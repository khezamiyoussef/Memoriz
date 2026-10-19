import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, Loader2, X } from 'lucide-react';
import SharePanel from './SharePanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CanvasItem } from '../../types/builder';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  MySite,
  SlugStatus,
  SlugTakenError,
  checkSlug,
  isWellFormedSlug,
  normalizeSlug,
  publicSiteBase,
  publicSiteUrl,
  publishSite,
} from '@/lib/sites';

type Status = 'idle' | 'checking' | 'error' | SlugStatus;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CanvasItem[];
  site: MySite | null;
  onPublished: (site: MySite) => void;
}

export default function PublishDialog({ open, onOpenChange, items, site, onPublished }: Props) {
  const { lang, t } = useLanguage();
  const [slug, setSlug] = useState(site?.slug ?? '');
  const [status, setStatus] = useState<Status>(site?.slug ? 'yours' : 'idle');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const checkId = useRef(0);

  // Reset each time the dialog opens
  useEffect(() => {
    if (!open) return;
    setSlug(site?.slug ?? '');
    setStatus(site?.slug ? 'yours' : 'idle');
    setPublishing(false);
    setPublishError(false);
    setPublishedUrl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debounced availability check; stale responses are ignored via checkId
  useEffect(() => {
    if (!open || publishedUrl) return;
    const id = ++checkId.current;

    if (!slug) {
      setStatus('idle');
      return;
    }
    if (!isWellFormedSlug(slug)) {
      setStatus('invalid');
      return;
    }

    setStatus('checking');
    const timer = setTimeout(() => {
      checkSlug(slug)
        .then((result) => { if (id === checkId.current) setStatus(result); })
        .catch(() => { if (id === checkId.current) setStatus('error'); });
    }, 400);
    return () => clearTimeout(timer);
  }, [slug, open, publishedUrl]);

  const canPublish = (status === 'available' || status === 'yours') && items.length > 0 && !publishing;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    setPublishError(false);
    try {
      const updated = await publishSite(slug, items, lang);
      onPublished(updated);
      setPublishedUrl(publicSiteUrl(slug));
    } catch (err) {
      if (err instanceof SlugTakenError) setStatus('taken');
      else setPublishError(true);
    } finally {
      setPublishing(false);
    }
  };

  const host = publicSiteBase().replace(/^https?:\/\//, '');

  const statusMessage: Partial<Record<Status, { text: string; tone: 'muted' | 'ok' | 'bad' }>> = {
    checking: { text: t.publish.checking, tone: 'muted' },
    available: { text: t.publish.available, tone: 'ok' },
    yours: { text: t.publish.yours, tone: 'ok' },
    taken: { text: t.publish.taken, tone: 'bad' },
    reserved: { text: t.publish.reserved, tone: 'bad' },
    invalid: { text: t.publish.invalid, tone: 'bad' },
    error: { text: t.publish.checkError, tone: 'bad' },
  };
  const message = statusMessage[status];
  const toneClass = { muted: 'text-gray-400', ok: 'text-green-600', bad: 'text-red-500' };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {publishedUrl ? (
          <>
            <DialogHeader>
              <DialogTitle>{t.publish.successTitle}</DialogTitle>
              <DialogDescription>{t.publish.successDesc}</DialogDescription>
            </DialogHeader>

            <SharePanel url={publishedUrl} slug={slug} />
            <p className="text-xs text-gray-400">{t.publish.republishNote}</p>

            <DialogFooter className="gap-2 sm:gap-0">
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <ExternalLink className="h-4 w-4" />
                {t.publish.open}
              </a>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition sm:ml-2"
              >
                {t.publish.done}
              </button>
            </DialogFooter>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePublish();
            }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>{t.publish.title}</DialogTitle>
              <DialogDescription>{t.publish.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <div
                className={`flex items-center overflow-hidden rounded-lg border bg-white focus-within:ring-2 transition ${
                  message?.tone === 'bad'
                    ? 'border-red-300 focus-within:ring-red-100'
                    : message?.tone === 'ok'
                      ? 'border-green-300 focus-within:ring-green-100'
                      : 'border-gray-200 focus-within:ring-rose-100'
                }`}
              >
                <span className="shrink-0 select-none border-r border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500 max-w-[55%] truncate">
                  {host}/
                </span>
                <input
                  autoFocus
                  value={slug}
                  onChange={(e) => setSlug(normalizeSlug(e.target.value))}
                  placeholder={t.publish.placeholder}
                  aria-label={t.publish.title}
                  aria-invalid={message?.tone === 'bad'}
                  aria-describedby="slug-status"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoComplete="off"
                  className="min-w-0 flex-1 px-3 py-2 text-sm text-gray-800 outline-none"
                />
                <span className="pr-3">
                  {status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                  {message?.tone === 'ok' && <Check className="h-4 w-4 text-green-600" />}
                  {message?.tone === 'bad' && <X className="h-4 w-4 text-red-500" />}
                </span>
              </div>
              <p id="slug-status" aria-live="polite" className={`min-h-[1rem] text-xs ${message ? toneClass[message.tone] : ''}`}>
                {message?.text}
              </p>
              {items.length === 0 && <p className="text-xs text-amber-600">{t.publish.emptyCanvas}</p>}
              {publishError && <p className="text-xs text-red-500">{t.publish.error}</p>}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {t.publish.cancel}
              </button>
              <button
                type="submit"
                disabled={!canPublish}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50 transition sm:ml-2"
              >
                {publishing && <Loader2 className="h-4 w-4 animate-spin" />}
                {publishing ? t.publish.submitting : t.publish.submit}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
