import { useCallback, useEffect, useState } from "react";

// Reads the main content aloud with the browser's built-in speech (no external service).
export default function useReadAloud(lang) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => { if (supported) window.speechSynthesis.cancel(); setSpeaking(false); }, [supported]);

  const start = useCallback(() => {
    if (!supported) return false;
    window.speechSynthesis.cancel();
    const main = document.getElementById("main");
    const text = (window.getSelection()?.toString() || main?.innerText || "").replace(/\s+/g, " ").trim();
    if (!text) return true;
    const want = lang === "ta" ? "ta" : "en";
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith(want));
    // Speak in sentence-sized chunks: long single utterances stop early in some browsers.
    const chunks = text.match(/[^.!?।]+[.!?।]*\s*/g) || [text];
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = lang === "ta" ? "ta-IN" : "en-IN";
      if (voice) u.voice = voice;
      if (i === chunks.length - 1) u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    });
    setSpeaking(true);
    return true;
  }, [supported, lang]);

  useEffect(() => stop, [stop]); // stop when the page unmounts
  useEffect(() => { stop(); }, [lang, stop]);
  return { supported, speaking, start, stop };
}