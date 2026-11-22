import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import { useSite } from "../context/SiteContext.jsx";
import useApi from "../hooks/useApi.js";
import PageHero from "../components/PageHero.jsx";
import SchemeCard from "../components/SchemeCard.jsx";
import { CardSkeletons, EmptyState, ErrorState, Notice } from "../components/States.jsx";

const S = {
  en: {
    title: "Institutions", lead: "Special schools, homes, day care and early intervention centres — and support for organisations that run them.",
    forOrgs: "For institutions and NGOs", forOrgsP: "Schemes that fund, train or recognise organisations working with differently abled persons.",
    reg: "Registering an institution", regP: "Rules for registering an institution, and the grants available, are set by the department. Contact your district office to start; the details will be published here once confirmed.",
    office: "Find my district office",
    directory: "Directory", district: "District", type: "Type", all: "All", found: "{n} institutions",
    types: { "special-school": "Special school", "rehabilitation-home": "Rehabilitation home", "day-care": "Day care centre", "early-intervention": "Early intervention centre", "training-centre": "Training centre", ngo: "NGO", other: "Other" },
    managed: { government: "Government", ngo: "NGO", aided: "Aided", other: "Other" },
    empty: "No institutions listed", emptyP: "No institutions are listed for this choice yet.",
    name: "Name", managedBy: "Run by", phone: "Phone",
  },
  ta: {
    title: "நிறுவனங்கள்", lead: "சிறப்புப் பள்ளிகள், இல்லங்கள், பகல்நேரப் பராமரிப்பு மற்றும் ஆரம்ப நிலை பயிற்சி மையங்கள் — அவற்றை நடத்தும் நிறுவனங்களுக்கான உதவி.",
    forOrgs: "நிறுவனங்கள் மற்றும் தொண்டு நிறுவனங்களுக்கு", forOrgsP: "மாற்றுத்திறனாளிகளுடன் பணியாற்றும் நிறுவனங்களுக்கு நிதி, பயிற்சி அல்லது அங்கீகாரம் வழங்கும் திட்டங்கள்.",
    reg: "நிறுவனப் பதிவு", regP: "பதிவு விதிகள் மற்றும் நிதியுதவி விவரங்கள் துறையால் வகுக்கப்படுகின்றன. தொடங்க மாவட்ட அலுவலகத்தைத் தொடர்பு கொள்ளவும்; உறுதிசெய்யப்பட்டதும் இங்கு வெளியிடப்படும்.",
    office: "என் மாவட்ட அலுவலகம்",
    directory: "பட்டியல்", district: "மாவட்டம்", type: "வகை", all: "அனைத்தும்", found: "{n} நிறுவனங்கள்",
    types: { "special-school": "சிறப்புப் பள்ளி", "rehabilitation-home": "மறுவாழ்வு இல்லம்", "day-care": "பகல்நேரப் பராமரிப்பு மையம்", "early-intervention": "ஆரம்ப நிலை பயிற்சி மையம்", "training-centre": "பயிற்சி மையம்", ngo: "தொண்டு நிறுவனம்", other: "பிற" },
    managed: { government: "அரசு", ngo: "தொண்டு நிறுவனம்", aided: "உதவி பெறும்", other: "பிற" },
    empty: "நிறுவனங்கள் இல்லை", emptyP: "இந்தத் தேர்வுக்கு இன்னும் நிறுவனங்கள் பட்டியலிடப்படவில்லை.",
    name: "பெயர்", managedBy: "நடத்துபவர்", phone: "தொலைபேசி",
  },
};

export default function Institutions() {
  const { t } = useLang();
  const s = useStrings(S);
  const { meta } = useSite();
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const schemes = useApi("/schemes", { audience: "institution" });
  const list = useApi("/institutions", { district: district || undefined, type: type || undefined });
  const items = list.data?.institutions || [];

  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container">
          <h2 className="section-title">{s.forOrgs}</h2>
          <p className="section-sub">{s.forOrgsP}</p>
          {schemes.loading && <CardSkeletons n={4} h={168} />}
          {schemes.error && <ErrorState error={schemes.error} onRetry={schemes.reload} />}
          {schemes.data && <ul className="grid-4" style={{ listStyle: "none" }}>{schemes.data.schemes.map((sc) => <li key={sc.slug} style={{ display: "grid" }}><SchemeCard scheme={sc} /></li>)}</ul>}
          <div className="card card-pad" style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Building2 aria-hidden="true" style={{ color: "var(--green-700)" }} />
            <div style={{ flex: "1 1 320px" }}><h3 style={{ fontSize: "1rem", marginBottom: 4 }}>{s.reg}</h3><p className="muted" style={{ fontSize: ".9rem" }}>{s.regP}</p></div>
            <Link className="btn btn-outline" to="/district-offices">{s.office}</Link>
          </div>
        </div>
      </section>
      <section className="section section-grey" aria-labelledby="dir-title">
        <div className="container">
          <h2 id="dir-title" className="section-title" style={{ marginBottom: 16 }}>{s.directory}</h2>
          <div className="toolbar">
            <div className="field"><label htmlFor="inst-district">{s.district}</label>
              <select id="inst-district" value={district} onChange={(e) => setDistrict(e.target.value)}><option value="">{s.all}</option>{(meta?.districts || []).map((d) => <option key={d}>{d}</option>)}</select></div>
            <div className="field"><label htmlFor="inst-type">{s.type}</label>
              <select id="inst-type" value={type} onChange={(e) => setType(e.target.value)}><option value="">{s.all}</option>{Object.entries(s.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            {list.data && <p className="muted" aria-live="polite" style={{ alignSelf: "center" }}>{s.found.replace("{n}", items.length)}</p>}
          </div>
          {items.some((i) => i.isSample) && <div style={{ marginBottom: 14 }}><Notice kind="warn">{t("common.sampleData")}.</Notice></div>}
          {list.loading && <CardSkeletons n={3} h={60} className="grid-3" />}
          {list.error && <ErrorState error={list.error} onRetry={list.reload} />}
          {list.data && (items.length ? (
            <div className="table-wrap">
              <table className="data">
                <caption className="sr-only">{s.directory}</caption>
                <thead><tr><th scope="col">{s.name}</th><th scope="col">{s.type}</th><th scope="col">{s.district}</th><th scope="col">{s.managedBy}</th><th scope="col">{s.phone}</th></tr></thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i._id}>
                      <td>{i.name} {i.isSample && <span className="tag tag-sample">{t("common.sample")}</span>}{i.address && <div className="muted" style={{ fontSize: ".8rem" }}>{i.address}</div>}</td>
                      <td>{s.types[i.type]}</td><td>{i.district}</td><td>{s.managed[i.managedBy]}</td>
                      <td>{i.phone ? <a href={`tel:${i.phone.replace(/[^\d+]/g, "")}`}>{i.phone}</a> : <span className="not-set">{t("common.notAdded")}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState title={s.empty}>{s.emptyP}</EmptyState>)}
        </div>
      </section>
    </>
  );
}
