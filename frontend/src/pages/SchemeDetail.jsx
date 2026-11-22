import { Link, useParams } from "react-router-dom";
import { FilePlus, Info, MapPin } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import PageHero from "../components/PageHero.jsx";
import { ErrorState, Notice, Skeleton } from "../components/States.jsx";
import NotFound from "./NotFound.jsx";

const S = {
  en: {
    about: "About this scheme", benefits: "What you get", docs: "Documents you need", how: "How to apply",
    notPublished: "The department has not yet published this information on the website. Ask at your district office or call the helpline before you apply.",
    unverified: "Details of this scheme are being confirmed by the department. The summary above is accurate; check eligibility and documents with your district office.",
    apply: "Apply for this scheme", offline: "This scheme does not take online applications. Apply at your district office.",
    office: "Find my district office", idFirst: "Most schemes need your national ID card / UDID first.", idLink: "How to get it",
  },
  ta: {
    about: "இந்தத் திட்டம் பற்றி", benefits: "உங்களுக்குக் கிடைப்பவை", docs: "தேவையான ஆவணங்கள்", how: "விண்ணப்பிக்கும் முறை",
    notPublished: "இந்தத் தகவலைத் துறை இன்னும் இணையதளத்தில் வெளியிடவில்லை. விண்ணப்பிக்கும் முன் மாவட்ட அலுவலகத்தில் கேட்கவும் அல்லது உதவி எண்ணை அழைக்கவும்.",
    unverified: "இந்தத் திட்டத்தின் விவரங்களைத் துறை உறுதிப்படுத்தி வருகிறது. தகுதி மற்றும் ஆவணங்களை மாவட்ட அலுவலகத்தில் உறுதிசெய்யவும்.",
    apply: "இந்தத் திட்டத்திற்கு விண்ணப்பிக்க", offline: "இந்தத் திட்டத்திற்கு இணைய விண்ணப்பம் இல்லை. மாவட்ட அலுவலகத்தில் விண்ணப்பிக்கவும்.",
    office: "என் மாவட்ட அலுவலகம்", idFirst: "பெரும்பாலான திட்டங்களுக்கு முதலில் தேசிய அடையாள அட்டை / UDID தேவை.", idLink: "அதைப் பெறுவது எப்படி",
  },
};

function Block({ id, title, text, fallback }) {
  return (
    <section aria-labelledby={`${id}-h`} id={id} tabIndex={-1} style={{ scrollMarginTop: 70 }}>
      <h2 id={`${id}-h`}>{title}</h2>
      {text ? text.split(/\n+/).map((p, i) => <p key={i}>{p}</p>) : <p className="not-set">{fallback}</p>}
    </section>
  );
}

export default function SchemeDetail() {
  const { slug } = useParams();
  const { t, tx } = useLang();
  const s = useStrings(S);
  const { data, loading, error, reload } = useApi(`/schemes/${encodeURIComponent(slug)}`);

  if (error?.response?.status === 404) return <NotFound />;
  const sc = data?.scheme;

  return (
    <>
      {sc ? <PageHero title={tx(sc.title)} lead={tx(sc.summary)} crumbs={[["/schemes", t("nav.schemes")]]} />
        : <div className="page-hero"><div className="container"><Skeleton h={14} w={180} /><Skeleton h={34} w="50%" style={{ marginTop: 14 }} /></div></div>}
      <section className="section">
        <div className="container">
          {loading && <div style={{ display: "grid", gap: 12, maxWidth: 700 }}>{[1, 2, 3, 4].map((i) => <Skeleton key={i} h={22} />)}</div>}
          {error && <ErrorState error={error} onRetry={reload} />}
          {sc && (
            <div className="layout-side">
              <div className="prose">
                <p><span className="tag">{t(`cat.${sc.category}`)}</span></p>
                {!sc.verified && <Notice kind="warn" icon={Info}>{s.unverified}</Notice>}
                <Block id="about" title={s.about} text={tx(sc.description)} fallback={tx(sc.summary)} />
                <Block id="who-can-apply" title={t("common.whoCanApply")} text={tx(sc.eligibility)} fallback={s.notPublished} />
                <Block id="benefits" title={s.benefits} text={tx(sc.benefits)} fallback={s.notPublished} />
                <Block id="documents" title={s.docs} text={tx(sc.documentsRequired)} fallback={s.notPublished} />
                <Block id="how-to-apply" title={s.how} text={tx(sc.howToApply)} fallback={t("steps.s3d")} />
              </div>
              <aside className="card card-pad" style={{ display: "grid", gap: 12, position: "sticky", top: 70 }}>
                {sc.acceptsOnline
                  ? <Link className="btn btn-primary btn-block" to={`/apply?scheme=${sc.slug}`}><FilePlus aria-hidden="true" /> {s.apply}</Link>
                  : <p className="notice">{s.offline}</p>}
                <Link className="btn btn-outline btn-block" to="/district-offices"><MapPin aria-hidden="true" /> {s.office}</Link>
                <p className="hint">{s.idFirst} <Link to="/id-card">{s.idLink}</Link></p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
