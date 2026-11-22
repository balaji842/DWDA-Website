import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Contrast, Volume2, VolumeX, Headphones, Accessibility as A11yIcon, ArrowDownToLine } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { useA11y } from "../context/AccessibilityContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import useReadAloud from "./ReadAloud.js";

export default function TopBar() {
  const { t, lang, setLang } = useLang();
  const a = useA11y();
  const toast = useToast();
  const { pathname } = useLocation();
  const speech = useReadAloud(lang);
  useEffect(() => speech.stop(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRead = () => {
    if (speech.speaking) return speech.stop();
    if (!speech.start()) toast.error(t("common.readAloudNA"));
  };

  return (
    <div className="topbar on-dark">
      <div className="container">
        <div className="topbar-left">
          <a href="#main"><ArrowDownToLine aria-hidden="true" />{t("common.skip")}</a>
          <span className="topbar-sep" aria-hidden="true" />
          <Link to="/screen-reader-access" className="hide-sm"><Headphones aria-hidden="true" />{t("common.screenReader")}</Link>
          <span className="topbar-sep" aria-hidden="true" />
          <Link to="/accessibility" className="hide-sm"><A11yIcon aria-hidden="true" />{t("common.a11yStatement")}</Link>
        </div>
        <div className="topbar-tools" role="group" aria-label="Accessibility tools">
          <span className="sr-only" id="ts-label">{t("common.textSize")}</span>
          <span role="group" aria-labelledby="ts-label" style={{ display: "inline-flex", gap: 2 }}>
            <button type="button" className="tool-btn" onClick={a.decrease} disabled={a.textSize <= a.min} aria-label={t("common.decrease")}>A−</button>
            <button type="button" className="tool-btn" onClick={a.resetText} aria-pressed={a.textSize === 0} aria-label={t("common.reset")}>A</button>
            <button type="button" className="tool-btn" onClick={a.increase} disabled={a.textSize >= a.max} aria-label={t("common.increase")}>A+</button>
          </span>
          <button type="button" className="tool-btn" onClick={a.toggleContrast} aria-pressed={a.contrast} aria-label={t("common.highContrast")} title={t("common.highContrast")}>
            <Contrast aria-hidden="true" />
          </button>
          <button type="button" className="tool-btn" onClick={toggleRead} aria-pressed={speech.speaking}>
            {speech.speaking ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            <span>{speech.speaking ? t("common.stopReading") : t("common.readAloud")}</span>
          </button>
          <span className="lang-switch" role="group" aria-label="Language / மொழி">
            <button type="button" className="tool-btn" lang="ta" aria-pressed={lang === "ta"} onClick={() => setLang("ta")}>தமிழ்</button>
            <button type="button" className="tool-btn" lang="en" aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
          </span>
        </div>
      </div>
    </div>
  );
}