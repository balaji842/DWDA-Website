import { useLang, useStrings } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import PageHero from "../components/PageHero.jsx";
import { DocList } from "./Home.jsx";
import { EmptyState, ErrorState, Notice, Skeleton } from "../components/States.jsx";

const S = {
  en: { title: "Acts & policies", lead: "Laws, the State policy and Government Orders (G.O.s) on the rights and welfare of persons with disabilities.", acts: "Acts and policy", gos: "Government orders (G.O.s)", noGos: "No G.O.s published yet", noGosP: "Government Orders will be listed here as the department adds them.", pending: "Where a document shows “Official copy to be added”, the department has not yet uploaded the official PDF." },
  ta: { title: "சட்டங்கள் & கொள்கைகள்", lead: "மாற்றுத்திறனாளிகளின் உரிமைகள் மற்றும் நலன் தொடர்பான சட்டங்கள், மாநிலக் கொள்கை மற்றும் அரசாணைகள்.", acts: "சட்டங்கள் மற்றும் கொள்கை", gos: "அரசாணைகள்", noGos: "இன்னும் அரசாணைகள் வெளியிடப்படவில்லை", noGosP: "துறை சேர்க்கும்போது அரசாணைகள் இங்கு பட்டியலிடப்படும்.", pending: "“அதிகாரப்பூர்வ நகல் சேர்க்கப்படும்” எனக் காட்டப்படும் ஆவணங்களின் PDF ஐத் துறை இன்னும் பதிவேற்றவில்லை." },
};

export default function ActsPolicies() {
  const { t, tx } = useLang();
  const s = useStrings(S);
  const { data, loading, error, reload } = useApi("/documents");
  const docs = data?.documents || [];
  const acts = docs.filter((d) => d.kind !== "go");
  // The "Government orders" heading entry itself has no file; real G.O.s are the ones with a file or link.
  const gos = docs.filter((d) => d.kind === "go" && (d.hasFile || d.externalUrl));

  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container" style={{ maxWidth: 880, marginLeft: "auto", marginRight: "auto" }}>
          {loading && <div style={{ display: "grid", gap: 12 }}>{[1, 2, 3].map((i) => <Skeleton key={i} h={22} />)}</div>}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && (
            <>
              {acts.some((d) => !d.hasFile && !d.externalUrl) && <Notice kind="info">{s.pending}</Notice>}
              <div className="card panel" style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: "1.2rem" }}>{s.acts}</h2>
                <DocList docs={acts} tx={tx} t={t} />
              </div>
              <div className="card panel" style={{ marginTop: 16 }} id="government-orders" tabIndex={-1}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: 10 }}>{s.gos}</h2>
                {gos.length ? <DocList docs={gos} tx={tx} t={t} /> : <EmptyState title={s.noGos}>{s.noGosP}</EmptyState>}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
