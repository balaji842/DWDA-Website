import { createContext, useContext, useEffect, useMemo, useState } from "react";

const A11yContext = createContext(null);
const MIN = -1;
const MAX = 3;
const read = (key, fallback) => { try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; } };
const write = (key, v) => { try { localStorage.setItem(key, v); } catch { /* storage unavailable */ } };

export function AccessibilityProvider({ children }) {
  const [textSize, setTextSize] = useState(() => Math.min(MAX, Math.max(MIN, Number(read("dwda-text", 0)) || 0)));
  const [contrast, setContrast] = useState(() => read("dwda-contrast", "0") === "1");
  const [reduceMotion, setReduceMotion] = useState(() => read("dwda-motion", "0") === "1");

  useEffect(() => {
    document.documentElement.dataset.textSize = String(textSize);
    write("dwda-text", textSize);
  }, [textSize]);
  useEffect(() => {
    document.documentElement.classList.toggle("hc", contrast);
    write("dwda-contrast", contrast ? "1" : "0");
  }, [contrast]);
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    write("dwda-motion", reduceMotion ? "1" : "0");
  }, [reduceMotion]);

  const value = useMemo(() => ({
    textSize, contrast, reduceMotion, min: MIN, max: MAX,
    increase: () => setTextSize((s) => Math.min(MAX, s + 1)),
    decrease: () => setTextSize((s) => Math.max(MIN, s - 1)),
    resetText: () => setTextSize(0),
    toggleContrast: () => setContrast((c) => !c),
    toggleMotion: () => setReduceMotion((m) => !m),
  }), [textSize, contrast, reduceMotion]);

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export const useA11y = () => useContext(A11yContext);
