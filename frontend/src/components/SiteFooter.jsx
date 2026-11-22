import { Link } from "react-router-dom";
import { ExternalLink, Phone, Mail, MapPin, Headset, Settings2, Contrast, Volume2, VolumeX, Headphones, Accessibility as A11yIcon, MessageCircle, Video } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { useSite } from "../context/SiteContext.jsx";
import { useA11y } from "../context/AccessibilityContext.jsx";
import { fmtDate } from "../hooks/format.js";
import { Emblem } from "./SiteHeader.jsx";
import useReadAloud from "./ReadAloud.js";

const tel = (n) => `tel:${n.replace(/[^\d+]/g, "")}`;

// Official external sites only.
const LINKS = [
  ["https://www.tn.gov.in/", "foot.gov"],
  ["https://www.scd.tn.gov.in/", "foot.scd"],
  ["https://depwd.gov.in/", "foot.depwd"],
  ["https://nationaltrust.nic.in/", "foot.nt"],
  ["https://www.swavlambancard.gov.in/", "foot.udid"],
];

export default function SiteFooter() {
  const { t, lang } = useLang();
  const { settings } = useSite();
  const a = useA11y();
  const speech = useReadAloud(lang);
  const s = settings || {};
  return (
    <footer className="site-footer on-dark">
      <div className="container cols">
        <div>
          <div className="footer-brand">
            <Emblem />
            <div>
              <small>{t("common.govt")}</small>
              <strong>{t("common.deptName")}</strong>
              <span className="ta" lang={lang === "en" ? "ta" : "en"}>{t("common.deptNameTa")}</span>
            </div>
          </div>
          {s.officeAddress && (
            <p style={{ marginTop: 16, display: "flex", gap: 10, opacity: .95 }}>
              <MapPin aria-hidden="true" style={{ width: 16, height: 16, flex: "none", marginTop: 3, color: "var(--accent)" }} />
              <span style={{ whiteSpace: "pre-line" }}>{s.officeAddress}</span>
            </p>
          )}
        </div>
        <div>
          <h2>{t("foot.useful")}</h2>
          <ul>
            {LINKS.map(([href, key]) => (
              <li key={href}><a className="ext" href={href} target="_blank" rel="noopener noreferrer">{t(key)}<ExternalLink aria-hidden="true" /><span className="sr-only"> ({t("foot.newTab")})</span></a></li>
            ))}
            <li><Link to="/rti">{t("footer.rti")}</Link> · <Link to="/acts-policies">{t("footer.acts")}</Link></li>
          </ul>
        </div>
        <div>
          <h2><Headset aria-hidden="true" />{t("foot.help")}</h2>
          <ul className="contact-lines">
            {s.helpline && <li><Phone aria-hidden="true" /><span>{t("contact.tollFree")}: <a href={tel(s.helpline)}>{s.helpline}</a></span></li>}
            {s.officePhone && <li><Phone aria-hidden="true" /><span>{t("contact.landline")}: <a href={tel(s.officePhone)}>{s.officePhone}</a></span></li>}
            {s.whatsapp && <li><MessageCircle aria-hidden="true" /><span>{t("contact.whatsapp")}: <a href={`https://wa.me/91${s.whatsapp.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer">{s.whatsapp}</a></span></li>}
            {s.videoCall && <li><Video aria-hidden="true" /><span>{t("contact.video")}: {s.videoCall}</span></li>}
            {s.officeEmail && <li><Mail aria-hidden="true" /><a href={`mailto:${s.officeEmail}`}>{s.officeEmail}</a></li>}
            {!s.helpline && !s.officeEmail && <li><Link to="/contact">{t("nav.contact")}</Link></li>}
          </ul>
        </div>
        <div>
          <h2><Settings2 aria-hidden="true" />{t("foot.a11y")}</h2>
          <div className="footer-tools" role="group" aria-label={t("foot.a11y")}>
            <button type="button" onClick={a.decrease} disabled={a.textSize <= a.min} aria-label={t("common.decrease")}>A−</button>
            <button type="button" onClick={a.resetText} aria-label={t("common.reset")}>A</button>
            <button type="button" onClick={a.increase} disabled={a.textSize >= a.max} aria-label={t("common.increase")}>A+</button>
            <button type="button" onClick={a.toggleContrast} aria-pressed={a.contrast}><Contrast aria-hidden="true" />{t("common.highContrast")}</button>
            {speech.supported && (
              <button type="button" onClick={() => (speech.speaking ? speech.stop() : speech.start())} aria-pressed={speech.speaking}>
                {speech.speaking ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}{speech.speaking ? t("common.stopReading") : t("common.readAloud")}
              </button>
            )}
            <Link className="btn-chip" to="/screen-reader-access"><Headphones aria-hidden="true" />{t("common.screenReader")}</Link>
            <Link className="btn-chip" to="/accessibility"><A11yIcon aria-hidden="true" />{t("common.a11yStatement")}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} {t("common.deptName")}, {t("common.govt")}. {t("foot.rights")}</span>
          <nav aria-label="Footer">
            <ul>
              <li>{t("footer.updated")} {s.lastUpdated ? fmtDate(s.lastUpdated, lang) : "[date]"}</li>
              <li><Link to="/sitemap">{t("footer.sitemap")}</Link></li>
              <li><Link to="/admin/login">{t("footer.admin")}</Link></li>
            </ul>
          </nav>
        </div>
        <div className="container" style={{ paddingTop: 0, paddingBottom: 14, opacity: .8 }}>{t("footer.nic")}</div>
      </div>
    </footer>
  );
}