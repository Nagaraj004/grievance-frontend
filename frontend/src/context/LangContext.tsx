import { createContext, useContext, useState, ReactNode } from 'react';
import { Lang, translations, TranslationKey } from '../i18n/translations';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('tn_lang') as Lang) || 'en');

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('tn_lang', l);
  };

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.en[key] ?? key;

  return <LangContext.Provider value={{ lang, setLang: changeLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
