import { motion } from "framer-motion";
import { Music2, Play, Square, Loader2 } from "lucide-react";
import { createHiddenPlayer, parseYouTubeId, YT_STATE, YTPlayer } from "../../lib/youtube";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface Props { values: Record<string, string>; isPreview?: boolean }

export default function PreviewPlaylist({ values, isPreview = false }: Props) {
  const p = useLanguage().t.preview.playlist;
  const accentColor = values.accentColor || "#e11d48";
  const [loading, setLoading] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [error, setError] = useState<number | null>(null);
  const [progress, setProgress] = useState({ time: 0, duration: 0 });
  const [seeking, setSeeking] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDragging = useRef(false);

  // One off-screen YouTube player per playlist; only its audio is ever heard.
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerPromise = useRef<Promise<YTPlayer> | null>(null);
  const currentRef = useRef<number | null>(null); // song the player is working on
  const pollRef = useRef<number | null>(null);

  const songs = [1, 2, 3, 4]
    .map((n) => ({
      title: values[`song${n}Title`],
      artist: values[`song${n}Artist`],
      memory: values[`song${n}Memory`],
      videoId: parseYouTubeId(values[`song${n}Youtube`]),
    }))
    .filter((s) => s.title);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const reset = () => {
    stopPolling();
    currentRef.current = null;
    setPlaying(null);
    setLoading(null);
    setProgress({ time: 0, duration: 0 });
  };

  const handleStateChange = (state: number) => {
    const index = currentRef.current;
    if (index === null) return;
    if (state === YT_STATE.PLAYING) {
      setLoading(null);
      setPlaying(index);
      stopPolling();
      pollRef.current = window.setInterval(() => {
        const player = playerRef.current;
        if (player) setProgress({ time: player.getCurrentTime(), duration: player.getDuration() });
      }, 250);
    } else if (state === YT_STATE.ENDED || state === YT_STATE.PAUSED) {
      reset();
    }
  };

  const handlePlayerError = () => {
    const index = currentRef.current;
    reset();
    if (index !== null) setError(index);
  };

  // Latest handlers for the player's callbacks, which are bound once at creation
  const handlers = useRef({ handleStateChange, handlePlayerError });
  handlers.current = { handleStateChange, handlePlayerError };

  const getPlayer = () => {
    if (!playerPromise.current && hostRef.current) {
      playerPromise.current = createHiddenPlayer(hostRef.current, {
        onStateChange: (state) => handlers.current.handleStateChange(state),
        onError: () => handlers.current.handlePlayerError(),
      }).then((player) => {
        playerRef.current = player;
        return player;
      });
      playerPromise.current.catch(() => {
        playerPromise.current = null;
      });
    }
    return playerPromise.current;
  };

  const hasPlayableSong = songs.some((s) => s.videoId);

  useEffect(() => {
    return () => {
      stopPolling();
      playerRef.current?.destroy();
    };
  }, []);

  const handlePlay = (index: number, videoId: string) => {
    if (playing === index || loading === index) {
      playerRef.current?.stopVideo();
      reset();
      return;
    }

    playerRef.current?.stopVideo();
    stopPolling();
    setError(null);
    setPlaying(null);
    setProgress({ time: 0, duration: 0 });
    setLoading(index);
    currentRef.current = index;

    // The player is only loaded on the first press, never just by opening the
    // page: loading it sends the visitor's IP address to Google (GDPR).
    const start = (player: YTPlayer) => {
      if (currentRef.current === index) player.loadVideoById(videoId);
    };
    if (playerRef.current) {
      start(playerRef.current);
    } else {
      getPlayer()
        ?.then(start)
        .catch(() => handlePlayerError());
    }
  };

  const handleSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (playing !== index) return;
    e.preventDefault();

    const card = cardRefs.current[index];
    const player = playerRef.current;
    if (!card || !player) return;

    isDragging.current = true;
    setSeeking(true);

    const doSeek = (clientX: number) => {
      const duration = player.getDuration();
      if (!duration) return;
      const rect = card.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      player.seekTo(ratio * duration, true);
      setProgress({ time: ratio * duration, duration });
    };

    doSeek(e.clientX);

    const onMove = (ev: MouseEvent) => doSeek(ev.clientX);
    const onUp = () => {
      isDragging.current = false;
      setSeeking(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-lavender to-blush">
      {/* Off-screen YouTube player: audio only, never visible */}
      <div
        ref={hostRef}
        aria-hidden="true"
        style={{ position: "fixed", left: -10000, top: 0, width: 200, height: 200, opacity: 0, pointerEvents: "none" }}
      />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-8 h-8" style={{ color: accentColor }} />
            <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground">
              {values.title || p.title}
            </h2>
            <Music2 className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <p className="text-xl text-foreground/60 font-script">
            {values.subtitle || p.subtitle}
          </p>
        </motion.div>

        {/* Song rows */}
        <div className="space-y-3">
          {songs.map((song, i) => {
            const isPlaying = playing === i;
            const isLoading = loading === i;
            const hasError = error === i;
            const pct = progress.duration > 0
              ? (progress.time / progress.duration) * 100
              : 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className={`relative border rounded-2xl shadow-soft transition-colors duration-300 backdrop-blur-sm overflow-hidden ${
                    isPlaying
                      ? "border-white ring-2 select-none"
                      : "bg-white/60 hover:bg-white/80 border-white/80"
                  }`}
                  style={isPlaying ? { "--tw-ring-color": accentColor } as React.CSSProperties : {}}
                  onMouseDown={(e) => handleSeekMouseDown(e, i)}
                >
                  {/* ── Progress fill (behind everything) ── */}
                  {isPlaying && (
                    <>
                      {/* Filled region */}
                      <div
                        className="absolute inset-y-0 left-0 pointer-events-none"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(to right, ${accentColor}20, ${accentColor}55)`,
                          transition: seeking ? "none" : "width 0.25s linear",
                          zIndex: 0,
                        }}
                      />

                      {/* Playhead line */}
                      {pct > 0 && pct < 100 && (
                        <div
                          className="absolute inset-y-0 w-0.5 pointer-events-none"
                          style={{
                            left: `${pct}%`,
                            backgroundColor: accentColor,
                            opacity: 0.7,
                            transition: seeking ? "none" : "left 0.25s linear",
                            zIndex: 1,
                          }}
                        />
                      )}

                      {/* Playhead thumb dot — grab handle */}
                      {pct > 0 && pct < 100 && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg hover:scale-125 transition-transform"
                          style={{
                            left: `calc(${pct}% - 10px)`,
                            backgroundColor: accentColor,
                            cursor: seeking ? "grabbing" : "grab",
                            transition: seeking ? "transform 0.1s" : "left 0.25s linear, transform 0.1s",
                            zIndex: 20,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleSeekMouseDown(e, i);
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* ── Card content ── */}
                  <div className="relative z-10 flex items-start gap-4 p-5 w-full">
                    {/* Play / Stop button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (song.videoId) handlePlay(i, song.videoId);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      disabled={!song.videoId}
                      title={song.videoId ? undefined : p.noLink}
                      className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      style={{ backgroundColor: isPlaying || isLoading ? accentColor : `${accentColor}20` }}
                      aria-label={song.videoId ? (isPlaying ? p.stop : p.play) : p.noLink}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : isPlaying ? (
                        <Square className="w-5 h-5 text-white fill-white" />
                      ) : (
                        <Play className="w-5 h-5" style={{ color: accentColor }} />
                      )}
                    </button>

                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-foreground font-semibold text-lg truncate">
                          {song.title}
                        </span>
                        {song.artist && (
                          <>
                            <span className="text-foreground/30 text-sm shrink-0">—</span>
                            <span className="text-foreground/50 text-sm truncate">{song.artist}</span>
                          </>
                        )}
                      </div>
                      {song.memory && (
                        <p className="text-foreground/50 text-sm font-script leading-relaxed line-clamp-2">
                          "{song.memory}"
                        </p>
                      )}
                      {hasError && <p className="text-xs text-red-500 mt-1">{p.playError}</p>}
                      {isPreview && !song.videoId && (
                        <p className="text-xs text-amber-600 mt-1">{p.addLinkHint}</p>
                      )}
                    </div>

                    {/* Track number badge */}
                    <span
                      className="shrink-0 text-xs font-bold opacity-30 mt-1"
                      style={{ color: accentColor }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center text-foreground/30 text-sm mt-10 font-script"
        >
          ♪ {values.footerNote || p.footer} ♪
        </motion.p>
        {hasPlayableSong && (
          <p className="text-center text-xs text-foreground/60 mt-4 max-w-md mx-auto">{p.youtubeNotice}</p>
        )}
      </div>
    </section>
  );
}
