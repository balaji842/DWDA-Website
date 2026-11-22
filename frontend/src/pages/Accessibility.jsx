import { useLang, useStrings } from "../context/LanguageContext.jsx";
import { useA11y } from "../context/AccessibilityContext.jsx";
import PageHero from "../components/PageHero.jsx";

const S = {
  en: {
    title: "Accessibility statement", lead: "This website is built for differently abled people first. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
    settings: "Your display settings", settingsP: "These settings are saved on this device and apply to every page.",
    size: "Text size", contrast: "High contrast colours", motion: "Reduce motion (stop animations)", on: "On", off: "Off", lang: "Language",
    what: "What you can do on this site",
    list: [
      "Use every page with a keyboard alone. Press Tab to move, Enter or Space to choose, and Escape to close a dialog. A visible outline shows where you are.",
      "Use a screen reader such as NVDA, JAWS, TalkBack or VoiceOver. Pages use headings, landmarks and labels, and form errors are announced.",
      "Make text larger with A+ or smaller with A− at the top of every page, without losing content.",
      "Switch to high contrast colours, and switch the language between English and Tamil.",
      "Upload documents from a phone, and fill every form on a small screen.",
    ],
    limits: "Known limitations", limitsP: "Some PDF documents published by other offices may not be fully accessible. If you need a document in another format, contact your district office and we will help.",
    feedback: "Report a problem", feedbackP: "If something on this site is hard to use, tell the department through the helpline or the email address on the Contact page. Say which page, and what went wrong.",
    reviewed: "This statement will be reviewed after every major change to the site.",
  },
  ta: {
    title: "அணுகல்தன்மை அறிக்கை", lead: "இந்த இணையதளம் முதன்மையாக மாற்றுத்திறனாளிகளுக்காக உருவாக்கப்பட்டது. WCAG 2.2 AA நிலையைப் பூர்த்தி செய்வதே எங்கள் நோக்கம்.",
    settings: "உங்கள் திரை அமைப்புகள்", settingsP: "இந்த அமைப்புகள் இந்தச் சாதனத்தில் சேமிக்கப்பட்டு எல்லாப் பக்கங்களுக்கும் பொருந்தும்.",
    size: "எழுத்து அளவு", contrast: "உயர் மாறுபாட்டு வண்ணங்கள்", motion: "அசைவைக் குறைக்க", on: "இயக்கத்தில்", off: "நிறுத்தத்தில்", lang: "மொழி",
    what: "இந்தத் தளத்தில் நீங்கள் செய்யக்கூடியவை",
    list: [
      "விசைப்பலகை மட்டும் கொண்டு எல்லாப் பக்கங்களையும் பயன்படுத்தலாம். Tab அழுத்தி நகரவும், Enter அல்லது Space அழுத்தித் தேர்வுசெய்யவும், Escape அழுத்தி உரையாடலை மூடவும்.",
      "NVDA, JAWS, TalkBack அல்லது VoiceOver போன்ற திரை வாசிப்பான்களைப் பயன்படுத்தலாம். படிவப் பிழைகள் அறிவிக்கப்படும்.",
      "ஒவ்வொரு பக்கத்தின் மேலும் உள்ள A+ / A− மூலம் எழுத்தைப் பெரிதாக்கலாம் அல்லது சிறிதாக்கலாம்.",
      "உயர் மாறுபாட்டு வண்ணங்களுக்கு மாறலாம்; ஆங்கிலம் மற்றும் தமிழுக்கு இடையே மொழியை மாற்றலாம்.",
      "கைபேசியிலிருந்து ஆவணங்களைப் பதிவேற்றலாம்; சிறிய திரையிலும் எல்லாப் படிவங்களையும் நிரப்பலாம்.",
    ],
    limits: "அறியப்பட்ட வரம்புகள்", limitsP: "பிற அலுவலகங்கள் வெளியிட்ட சில PDF ஆவணங்கள் முழுமையாக அணுகக்கூடியதாக இல்லாமல் இருக்கலாம். வேறு வடிவம் தேவைப்பட்டால் மாவட்ட அலுவலகத்தைத் தொடர்பு கொள்ளவும்.",
    feedback: "சிக்கலைத் தெரிவிக்க", feedbackP: "இந்தத் தளத்தில் ஏதேனும் பயன்படுத்தக் கடினமாக இருந்தால், உதவி எண் அல்லது தொடர்புப் பக்கத்தில் உள்ள மின்னஞ்சல் மூலம் தெரிவிக்கவும்.",
    reviewed: "தளத்தில் ஒவ்வொரு பெரிய மாற்றத்திற்குப் பிறகும் இந்த அறிக்கை மறுஆய்வு செய்யப்படும்.",
  },
};

export default function Accessibility() {
  const { t, toggle, lang } = useLang();
  const s = useStrings(S);
  const a = useA11y();
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container layout-side">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>{s.what}</h2>
            <ul>{s.list.map((x) => <li key={x}>{x}</li>)}</ul>
            <h2>{s.limits}</h2><p>{s.limitsP}</p>
            <h2>{s.feedback}</h2><p>{s.feedbackP}</p>
            <p className="muted">{s.reviewed}</p>
          </div>
          <aside className="card card-pad" aria-labelledby="settings-title">
            <h2 id="settings-title" style={{ fontSize: "1.1rem", marginBottom: 4 }}>{s.settings}</h2>
            <p className="hint" style={{ marginBottom: 16 }}>{s.settingsP}</p>
            <div className="field" style={{ marginBottom: 16 }}>
              <span className="label" id="size-l">{s.size}</span>
              <div className="radio-row" role="group" aria-labelledby="size-l">
                <button type="button" className="btn btn-ghost btn-sm" onClick={a.decrease} disabled={a.textSize <= a.min} aria-label={t("common.decrease")}>A−</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={a.resetText} aria-label={t("common.reset")}>A</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={a.increase} disabled={a.textSize >= a.max} aria-label={t("common.increase")}>A+</button>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <label className="check"><input type="checkbox" checked={a.contrast} onChange={a.toggleContrast} /> {s.contrast}</label>
              <label className="check"><input type="checkbox" checked={a.reduceMotion} onChange={a.toggleMotion} /> {s.motion}</label>
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <span className="label">{s.lang}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={toggle} lang={lang === "en" ? "ta" : "en"}>{t("common.switchLang")}</button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
