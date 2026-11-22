import { MapPin } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { HelplineButton } from "./SiteHeader.jsx";

// One district office. Empty fields say "Not yet added" rather than guessing.
export default function OfficeDetails({ office, headingLevel = 3 }) {
  const { t, lang } = useLang();
  const H = `h${headingLevel}`;
  const v = (val) => val || <span className="not-set">{t("common.notAdded")}</span>;
  const district = lang === "ta" && office.districtTa ? office.districtTa : office.district;
  const anyDetail = office.address || office.phone || office.email || office.hours;
  return (
    <div>
      <H>{office.officeName || district}</H>
      {!anyDetail && <p className="muted" style={{ margin: "6px 0 12px", fontSize: ".875rem" }}>{t("help.unverified")}</p>}
      <dl className="dl-grid" style={{ marginTop: 10 }}>
        <dt>{t("help.address")}</dt><dd>{v(office.address)}</dd>
        <dt>{t("help.phone")}</dt><dd>{office.phone ? <a href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}>{office.phone}</a> : v("")}</dd>
        <dt>{t("help.email")}</dt><dd>{office.email ? <a href={`mailto:${office.email}`}>{office.email}</a> : v("")}</dd>
        <dt>{t("help.hours")}</dt><dd>{v(office.hours)}</dd>
        {office.mapUrl && office.verified && (
          <><dt>{t("help.map")}</dt><dd><a href={office.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true" /> {t("help.openMap")}<span className="sr-only"> (opens in a new tab)</span></a></dd></>
        )}
      </dl>
      {!anyDetail && <div style={{ marginTop: 14 }}><HelplineButton className="btn btn-outline btn-sm" /></div>}
    </div>
  );
}
