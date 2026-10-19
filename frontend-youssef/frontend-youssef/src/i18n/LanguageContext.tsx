import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dictionaries, Dictionary, Lang } from './translations';

const STORAGE_KEY = 'memoriz_lang';

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') return stored;
  } catch {
    // Storage unavailable (private mode etc.) — fall back to the browser language
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// `fixedLang` pins the language (e.g. a published site renders in the language
// it was built in) without touching the visitor's saved preference.
export function LanguageProvider({ children, fixedLang }: { children: ReactNode; fixedLang?: Lang }) {
  const [chosenLang, setLangState] = useState<Lang>(initialLang);
  const lang = fixedLang ?? chosenLang;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted; the choice still applies for this session
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
