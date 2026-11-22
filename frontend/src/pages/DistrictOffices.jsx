import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import PageHero from "../components/PageHero.jsx";
import OfficeDetails from "../components/OfficeDetails.jsx";
import { CardSkeletons, EmptyState, ErrorState } from "../components/States.jsx";

const S = {
  en: { title: "District offices", lead: "Address, phone and working hours of the District Differently Abled Welfare Office in all 38 districts.", filter: "Find a district", filterHint: "Type a district name.", count: "{n} of {total} districts", none: "No district matches", noneP: "Check the spelling, or clear the box to see all districts." },
  ta: { title: "மாவட்ட அலுவலகங்கள்", lead: "38 மாவட்டங்களிலும் உள்ள மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலகத்தின் முகவரி, தொலைபேசி மற்றும் பணி நேரம்.", filter: "மாவட்டத்தைக் கண்டறிய", filterHint: "மாவட்டத்தின் பெயரைத் தட்டச்சு செய்யவும்.", count: "{total} இல் {n} மாவட்டங்கள்", none: "பொருந்தும் மாவட்டம் இல்லை", noneP: "எழுத்துப்பிழையைச் சரிபார்க்கவும், அல்லது அனைத்தையும் காண பெட்டியை அழிக்கவும்." },
};

export default function DistrictOffices() {
  useLang();
  const s = useStrings(S);
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("d") || ""); // ?d=Madurai from the home page district picker
  const { data, loading, error, reload } = useApi("/districts");
  const offices = data?.offices || [];
  const shown = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? offices.filter((o) => o.district.toLowerCase().includes(k) || (o.districtTa || "").includes(q.trim())) : offices;
  }, [offices, q]);

  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="field" style={{ minWidth: "min(360px, 100%)" }}>
              <label htmlFor="district-filter">{s.filter}</label>
              <span className="hint" id="district-filter-hint">{s.filterHint}</span>
              <input id="district-filter" type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-describedby="district-filter-hint" autoComplete="off" />
            </div>
            {data && <p className="muted" aria-live="polite" style={{ alignSelf: "center" }}>{s.count.replace("{n}", shown.length).replace("{total}", offices.length)}</p>}
          </div>
          {loading && <CardSkeletons n={6} h={200} className="grid-3" />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && (shown.length ? (
            <ul className="grid-3" style={{ listStyle: "none" }}>
              {shown.map((o) => <li key={o.district} className="card card-pad" id={o.district.toLowerCase()}><OfficeDetails office={o} headingLevel={2} /></li>)}
            </ul>
          ) : <EmptyState title={s.none}>{s.noneP}</EmptyState>)}
        </div>
      </section>
    </>
  );
}