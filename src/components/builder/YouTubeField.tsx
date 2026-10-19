import { useEffect, useState } from 'react';
import { Check, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { FieldDef } from '../../types/builder';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  hasYouTubeSearch,
  parseYouTubeId,
  searchYouTube,
  youtubeSearchUrl,
  youtubeWatchUrl,
} from '../../lib/youtube';

interface Props {
  field: FieldDef;
  values: Record<string, string>;
  onPatch: (patch: Record<string, string>) => void;
}

type SearchStatus = 'idle' | 'searching' | 'notFound' | 'unavailable';

const SEARCH_DELAY_MS = 1200;

/**
 * A song's YouTube link. When empty, it is filled automatically from the
 * song's title/artist (`field.searchFrom`). `<id>Query` remembers the search
 * behind an automatic link, so editing the title searches again, while a link
 * pasted by hand (no `<id>Query`) is never overwritten.
 */
export default function YouTubeField({ field, values, onPatch }: Props) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<SearchStatus>('idle');

  const autoKey = `${field.id}Query`;
  const link = values[field.id] ?? '';
  const autoQuery = values[autoKey] ?? '';
  const query = (field.searchFrom ?? []).map((id) => values[id] ?? '').join(' ').trim();
  const videoId = parseYouTubeId(link);

  const shouldSearch =
    hasYouTubeSearch() && query.length >= 2 && (!link || (Boolean(autoQuery) && autoQuery !== query));

  useEffect(() => {
    if (!shouldSearch) {
      setStatus('idle');
      return;
    }
    setStatus('searching');
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchYouTube(query, controller.signal)
        .then((id) => {
          if (controller.signal.aborted) return;
          if (id) {
            onPatch({ [field.id]: youtubeWatchUrl(id), [autoKey]: query });
            setStatus('idle');
          } else {
            setStatus('notFound');
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setStatus('unavailable');
        });
    }, SEARCH_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // onPatch changes every render; the search only depends on what is being searched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, shouldSearch]);

  let message: { text: string; tone: string; icon?: JSX.Element } | null = null;
  if (status === 'searching') {
    message = { text: t.editor.youtubeSearching, tone: 'text-gray-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> };
  } else if (status === 'notFound' && !link) {
    message = { text: t.editor.youtubeNotFound, tone: 'text-amber-600' };
  } else if (status === 'unavailable' && !link) {
    message = { text: t.editor.youtubeUnavailable, tone: 'text-amber-600' };
  } else if (link && !videoId) {
    message = { text: t.editor.youtubeInvalid, tone: 'text-red-500' };
  } else if (videoId && autoQuery) {
    message = { text: t.editor.youtubeAutoFound, tone: 'text-green-600', icon: <Sparkles className="w-3 h-3" /> };
  } else if (videoId) {
    message = { text: t.editor.youtubeValid, tone: 'text-green-600', icon: <Check className="w-3 h-3" /> };
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-gray-600">{field.label}</label>
        {videoId ? (
          <a
            href={youtubeWatchUrl(videoId)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-700 transition"
          >
            {t.editor.listenOnYoutube}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : query ? (
          <a
            href={youtubeSearchUrl(query)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-700 transition"
          >
            {t.editor.findOnYoutube}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : null}
      </div>
      <input
        type="url"
        value={link}
        // Typing or pasting makes the link "manual": automatic search won't replace it
        onChange={(e) => onPatch({ [field.id]: e.target.value, [autoKey]: '' })}
        placeholder={field.placeholder}
        spellCheck={false}
        className={`w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent transition ${
          link && !videoId ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {message && (
        <p className={`flex items-center gap-1 text-[11px] leading-snug ${message.tone}`}>
          {message.icon}
          {message.text}
        </p>
      )}
    </div>
  );
}
