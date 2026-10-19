import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  templateId: string;
  values: Record<string, string>;
}

export default function TemplatePreview({ templateId, values }: Props) {
  const { thumb } = useLanguage().t;

  switch (templateId) {
    case 'hero':
      return (
        <div className="relative h-28 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
          {values.backgroundImage && (
            <img
              src={values.backgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-3 text-center">
            <div className="font-bold text-sm truncate max-w-full">{values.title || thumb.title}</div>
            <div className="text-xs opacity-80 mt-1 line-clamp-2">{values.subtitle || thumb.subtitle}</div>
            {values.buttonText && (
              <div className="mt-2 px-3 py-0.5 bg-white/30 rounded-full text-xs">{values.buttonText}</div>
            )}
          </div>
        </div>
      );

    case 'photo-gallery':
      return (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-center text-gray-600 pb-1">{values.title || thumb.gallery}</div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-square rounded overflow-hidden bg-gray-100">
                {values[`photo${n}`] ? (
                  <img src={values[`photo${n}`]} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">🖼️</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'love-letter':
      return (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
          <div className="text-xs font-medium text-amber-800 mb-1">{values.greeting || thumb.greeting}</div>
          <div className="text-xs text-gray-600 line-clamp-2 italic">{values.body || thumb.letterBody}</div>
          <div className="text-xs text-right mt-2 text-amber-700">
            {values.closing || thumb.yours} {values.signature || thumb.name}
          </div>
        </div>
      );

    case 'flip-cards':
      return (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-center text-gray-600">{values.title || thumb.whyILoveYou}</div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded flex items-center justify-center text-center p-1"
              >
                <span className="text-xs text-rose-600 font-medium truncate">
                  {values[`card${n}Front`] || thumb.card(n)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'carousel':
      return (
        <div className="relative h-24 rounded-lg overflow-hidden bg-gray-100">
          {values.slide1Image ? (
            <img src={values.slide1Image} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">🎠</div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-1.5 text-center">
            {values.slide1Caption || values.title || thumb.memories}
          </div>
          <div className="absolute top-1 right-1 flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="space-y-1 pl-3">
          <div className="text-xs font-semibold text-gray-600 mb-1">{values.title || thumb.ourStory}</div>
          {[1, 2].map((n) => (
            <div key={n} className="flex gap-2 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
              <div>
                <div className="text-xs text-rose-500">{values[`event${n}Date`] || thumb.event(n)}</div>
                <div className="text-xs text-gray-600 font-medium">{values[`event${n}Title`] || thumb.eventTitle}</div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'make-a-wish':
      return (
        <div className="text-center p-2 space-y-1">
          <div className="text-base">🌠</div>
          <div className="text-xs font-semibold text-gray-700">{values.title || thumb.makeAWish}</div>
          <div className="text-xs text-gray-400 italic">{values.prompt || thumb.wishPrompt}</div>
          <div className="w-full bg-gray-100 rounded text-xs text-gray-400 py-1 px-2 text-left">
            {values.placeholder || thumb.wishPlaceholder}
          </div>
          <div className="text-xs bg-rose-100 text-rose-600 rounded px-2 py-0.5 inline-block">
            {values.buttonText || thumb.send}
          </div>
          <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 mt-2 text-left">
            <span className="text-amber-500 text-xs shrink-0">⚠</span>
            <p className="text-[10px] leading-snug text-amber-700">
              <span className="font-semibold">{thumb.activateForm}</span>{thumb.activateFormRest}
            </p>
          </div>
        </div>
      );

    case 'final-message':
      return (
        <div className="text-center p-2 bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg space-y-1">
          <div className="text-xs text-gray-500 italic line-clamp-1">{values.line1 || thumb.firstLine}</div>
          <div className="text-xs font-semibold text-gray-700 line-clamp-1">{values.headline || thumb.headline}</div>
          <div className="text-xl">💝</div>
          <div className="text-xs text-gray-500">
            {values.closing || thumb.foreverYours} <span className="font-medium">{values.signature || thumb.name}</span>
          </div>
        </div>
      );

    case 'name-display':
      return (
        <div className="text-center py-3 space-y-1">
          <div className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            {values.name || thumb.name}
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {[1, 2, 3, 4].map((n) => (
              values[`meaning${n}`] && (
                <span key={n} className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                  {values[`meaning${n}`]}
                </span>
              )
            ))}
          </div>
        </div>
      );

    case 'floating-decoration':
      return (
        <div className="flex items-center justify-center h-16 gap-1">
          {['💕', '💕', '💕', '💕', '💕'].map((_, i) => (
            <span
              key={i}
              className="text-xl opacity-60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, color: values.color || '#e11d48' }}
            >
              ♥
            </span>
          ))}
        </div>
      );

    case 'surprises':
      return (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-center text-gray-600">{values.title || thumb.surprises}</div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-12 bg-gradient-to-br from-orange-100 to-rose-100 border border-orange-200 rounded flex items-center justify-center"
              >
                <span className="text-lg">🎁</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'love-playlist':
      return (
        <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-gray-600 text-center mb-1">
            🎵 {values.title || thumb.ourPlaylist}
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2 bg-white/70 rounded-lg px-2 py-1.5 border border-white">
              <span className="text-[10px] font-bold w-4" style={{ color: values.accentColor || '#e11d48' }}>{String(n).padStart(2,'0')}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gray-700 text-[10px] font-medium truncate">
                  {values[`song${n}Title`] || thumb.song(n)}
                </div>
                <div className="text-gray-400 text-[9px] truncate">
                  {values[`song${n}Artist`] || thumb.artist}
                </div>
              </div>
              <span className="text-[10px]" style={{ color: values.accentColor || '#e11d48' }}>♪</span>
            </div>
          ))}
        </div>
      );

    case 'promise-jar':
      return (
        <div className="bg-amber-50 rounded-lg p-3 space-y-2">
          <div className="text-xs font-semibold text-amber-800 text-center mb-1">
            🫙 {values.title || thumb.myPromises}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['rose', 'amber', 'violet', 'sky', 'emerald'].slice(0, 5).map((color, i) => (
              <div
                key={i}
                className={`h-10 rounded-lg flex items-center justify-center text-sm border ${
                  color === 'rose' ? 'bg-rose-100 border-rose-200' :
                  color === 'amber' ? 'bg-amber-100 border-amber-200' :
                  color === 'violet' ? 'bg-violet-100 border-violet-200' :
                  color === 'sky' ? 'bg-sky-100 border-sky-200' :
                  'bg-emerald-100 border-emerald-200'
                }`}
              >
                💌
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="h-16 flex items-center justify-center text-gray-400 text-xs bg-gray-50 rounded-lg">
          {thumb.fallback}
        </div>
      );
  }
}
