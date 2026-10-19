// YouTube helpers for the playlist: link parsing and the IFrame Player API,
// used through an off-screen player so only the audio is heard.

const VIDEO_ID = /^[\w-]{11}$/;

/** Extracts the video id from any common YouTube link (or a bare id). */
export function parseYouTubeId(input: string | undefined): string | null {
  const value = input?.trim();
  if (!value) return null;
  if (VIDEO_ID.test(value)) return value;

  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.toLowerCase().replace(/^(www|m|music)\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/')[1];
      return VIDEO_ID.test(id) ? id : null;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v');
      if (v && VIDEO_ID.test(v)) return v;
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // Not a URL
  }
  return null;
}

export const youtubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;

export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

// ---- Automatic song lookup (YouTube Data API v3) ----
// Runs only while a creator edits a song, never when visitors play it. Each
// search costs 100 of the key's 10,000 daily quota units, hence the cache.

export const hasYouTubeSearch = () => Boolean(import.meta.env.VITE_YOUTUBE_API_KEY?.trim());

export class YouTubeSearchUnavailable extends Error {}

const searchCache = new Map<string, string | null>();

/** Returns the id of the top embeddable music video for `query`, or null if none. */
export async function searchYouTube(query: string, signal?: AbortSignal): Promise<string | null> {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
  if (!key) throw new YouTubeSearchUnavailable('VITE_YOUTUBE_API_KEY is not set');

  const cacheKey = query.trim().toLowerCase();
  if (searchCache.has(cacheKey)) return searchCache.get(cacheKey)!;

  const params = new URLSearchParams({
    part: 'id',
    type: 'video',
    videoEmbeddable: 'true', // skip videos that refuse to play in an embedded player
    videoCategoryId: '10', // Music
    maxResults: '1',
    q: query.trim(),
    key,
  });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { signal });
  if (!res.ok) throw new YouTubeSearchUnavailable(`YouTube search failed (${res.status})`);

  const data = (await res.json()) as { items?: { id?: { videoId?: string } }[] };
  const videoId = data.items?.[0]?.id?.videoId ?? null;
  searchCache.set(cacheKey, videoId);
  return videoId;
}

// ---- Minimal typings for https://developers.google.com/youtube/iframe_api_reference ----

export const YT_STATE = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 } as const;

export interface YTPlayer {
  loadVideoById(videoId: string): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface YTPlayerOptions {
  host?: string;
  width?: number | string;
  height?: number | string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: () => void;
    onStateChange?: (event: { data: number }) => void;
    onError?: (event: { data: number }) => void;
  };
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Loads https://www.youtube.com/iframe_api once per page. */
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT!);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error('Failed to load the YouTube player'));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

/**
 * Creates a YouTube player inside `host`. The host is kept off-screen by the
 * caller, so nothing of the video is ever visible.
 */
export async function createHiddenPlayer(
  host: HTMLElement,
  events: { onStateChange: (state: number) => void; onError: () => void }
): Promise<YTPlayer> {
  const YT = await loadYouTubeApi();
  const mount = document.createElement('div');
  host.appendChild(mount);

  return new Promise((resolve) => {
    const player = new YT.Player(mount, {
      // Privacy-enhanced mode: no tracking cookies before playback, less ad tracking
      host: 'https://www.youtube-nocookie.com',
      width: 200,
      height: 200,
      playerVars: { controls: 0, disablekb: 1, fs: 0, playsinline: 1, rel: 0, iv_load_policy: 3 },
      events: {
        onReady: () => resolve(player),
        onStateChange: (e) => events.onStateChange(e.data),
        onError: () => events.onError(),
      },
    });
  });
}
