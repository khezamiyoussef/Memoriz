import { useNavigate } from 'react-router-dom';
import memorizLogo from '../assets/memoriz-logo.svg';
import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

// Flags as SVG: Windows has no flag emoji and would show the letters "GB"/"FR".
// Each flag fills its 3:2 tile; the 2:1 UK flag is cropped slightly at the sides to fit.
const flagClass = 'block h-full w-full';

function UkFlag() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={flagClass} aria-hidden="true">
      <clipPath id="uk-flag-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-flag-clip)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FrFlag() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={flagClass} aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#000091" />
      <rect width="1" height="2" x="1" fill="#fff" />
      <rect width="1" height="2" x="2" fill="#E1000F" />
    </svg>
  );
}

const OPTIONS: { lang: Lang; Flag: () => JSX.Element; label: string }[] = [
  { lang: 'en', Flag: UkFlag, label: 'English' },
  { lang: 'fr', Flag: FrFlag, label: 'Français' },
];

export default function LanguageSelect() {
  const navigate = useNavigate();
  const { lang: current, setLang } = useLanguage();

  const choose = (lang: Lang) => {
    setLang(lang);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <img src={memorizLogo} alt="Memoriz" className="w-12 h-12 mx-auto mb-4 object-contain" />
        {/* Shown before a language is picked, so the heading is bilingual */}
        <h1 className="text-2xl font-bold text-gray-800">Choose your language</h1>
        <p className="text-lg text-gray-500 mb-8">Choisissez votre langue</p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {OPTIONS.map((option) => (
            <button
              key={option.lang}
              onClick={() => choose(option.lang)}
              aria-label={option.label}
              title={option.label}
              className={`aspect-[3/2] overflow-hidden rounded-2xl shadow-sm ring-2 transition hover:scale-[1.03] hover:shadow-lg hover:ring-rose-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300 ${
                option.lang === current ? 'ring-rose-200' : 'ring-black/5'
              }`}
            >
              <option.Flag />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
