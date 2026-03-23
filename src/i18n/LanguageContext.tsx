import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import en from "./en";
import id from "./id";
import type { Translations } from "./en";

export type Lang = "en" | "id";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const translations: Record<Lang, Translations> = { en, id };

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("gp_lang");
    return (saved === "id" ? "id" : "en") as Lang;
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("gp_lang", l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
