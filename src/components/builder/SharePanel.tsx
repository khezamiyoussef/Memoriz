import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy, Download, Facebook, Mail, MessageCircle, MessageSquareText, Send, Share2 } from 'lucide-react';
import memorizLogo from '../../assets/logo.png';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  url: string;
  slug: string;
}

// QR code of the live site plus one-tap sharing. Instagram, TikTok, Snapchat etc.
// have no web share links: they go through the phone's share sheet or the QR image.
export default function SharePanel({ url, slug }: Props) {
  const s = useLanguage().t.share;
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const enc = encodeURIComponent;
  const withUrl = `${s.message} ${url}`;
  const targets: { name: string; href: string; color: string; icon: JSX.Element }[] = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${enc(withUrl)}`, color: '#25D366', icon: <MessageCircle className="h-5 w-5" /> },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, color: '#1877F2', icon: <Facebook className="h-5 w-5" /> },
    { name: 'X', href: `https://x.com/intent/tweet?text=${enc(s.message)}&url=${enc(url)}`, color: '#000000', icon: <span className="text-base font-bold leading-none">𝕏</span> },
    { name: 'Telegram', href: `https://t.me/share/url?url=${enc(url)}&text=${enc(s.message)}`, color: '#229ED9', icon: <Send className="h-5 w-5" /> },
    { name: 'SMS', href: `sms:?&body=${enc(withUrl)}`, color: '#34C759', icon: <MessageSquareText className="h-5 w-5" /> },
    { name: s.email, href: `mailto:?subject=${enc(s.emailSubject)}&body=${enc(`${s.message}\n\n${url}`)}`, color: '#6B7280', icon: <Mail className="h-5 w-5" /> },
  ];

  const fileName = `memoriz-${slug}-qr.png`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the link is still visible to copy by hand
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = fileName;
    link.click();
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: s.emailSubject, text: s.message, url });
    } catch {
      // Cancelled by the user, or not allowed in this context
    }
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* QR code (rendered at 512px for a sharp download, shown smaller) */}
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <QRCodeCanvas
            ref={qrRef}
            value={url}
            size={512}
            level="H"
            marginSize={2}
            fgColor="#1f2937"
            imageSettings={{ src: memorizLogo, width: 76, height: 104, excavate: true }}
            // The library sets an inline 512px size; `style` overrides it (the canvas
            // itself stays 512px, so the downloaded PNG is still sharp)
            style={{ width: 176, height: 176 }}
            className="block"
            aria-label={s.qrAlt}
          />
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 transition"
        >
          <Download className="h-3.5 w-3.5" />
          {s.downloadQr}
        </button>
      </div>

      {/* Link */}
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <span className="flex-1 truncate text-sm font-medium text-gray-800">{url}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 transition"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? s.copied : s.copy}
        </button>
      </div>

      {/* Platforms */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {targets.map((target) => (
          <a
            key={target.name}
            href={target.href}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] text-gray-600 hover:bg-gray-50 transition"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: target.color }}
            >
              {target.icon}
            </span>
            {target.name}
          </a>
        ))}
      </div>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <Share2 className="h-4 w-4" />
          {s.moreApps}
        </button>
      )}
      <p className="text-center text-[11px] leading-snug text-gray-400">{s.socialHint}</p>
    </div>
  );
}
