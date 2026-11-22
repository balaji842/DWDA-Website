import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "../translations/en.js";
import ta from "../translations/ta.js";

const DICTS = { en, ta };
const LanguageContext = createContext(null);
const read = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };

const lookup = (dict, key) => key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), dict);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (read("dwda-lang", "en") === "ta" ? "ta" : "en"));

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("dwda-lang", lang); } catch { /* storage unavailable */ }
  }, [lang]);

  // t("hero.title") or t("common.showing", { n: 3, total: 12 })
  const t = useCallback((key, vars) => {
    let s = lookup(DICTS[lang], key) ?? lookup(en, key) ?? key;
    if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
    return s;
  }, [lang]);

  // tx({ en, ta }) for bilingual data from the API: Tamil when present, else English.
  const tx = useCallback((obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return (lang === "ta" && obj.ta) || obj.en || "";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, toggle: () => setLang((l) => (l === "en" ? "ta" : "en")), t, tx }), [lang, t, tx]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);

// Page-local strings: const s = useStrings({ en: {...}, ta: {...} });
export function useStrings(strings) {
  const { lang } = useLang();
  return lang === "ta" ? { ...strings.en, ...strings.ta } : strings.en;
}
