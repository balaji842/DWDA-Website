import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Eye, HeartHandshake, Scale, Stethoscope, IdCard, FilePlus, MapPin, ArrowRight } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import SiteImage from "../components/SiteImage.jsx";
import { Notice } from "../components/States.jsx";
import SchemeIcon from "../components/SchemeIcon.jsx";
import { DISABILITIES, NATIONAL_TRUST_SCHEMES, findDisability } from "../data/disabilities.js";
import { DIS_ICONS, NtLink } from "./Disabilities.jsx";
import NotFound from "./NotFound.jsx";

const S = {
  en: {
    crumb: "Disabilities", act: "Covered by the National Trust Act, 1999", about: "What it is", signs: "Signs to look out for",
    signsNote: "These are common signs, not a diagnosis. Every child develops differently. If you are worried, talk to a doctor, your nearest government hospital, or the district office — early help makes a real difference.",
    help: "What helps", assess: "Getting assessed", assessP: "A medical board assesses the disability and issues the disability certificate and national UDID card. This is the first step for most schemes.",
    state: "Tamil Nadu schemes that can help", nt: "National Trust support", ntP: "Schemes run through registered organisations:",
    guard: "Legal guardian", guardP: "Adults may need a legal guardian. The Local Level Committee in each district, headed by the District Collector, appoints guardians under Section 14 of the Act.",
    other: "Other disabilities under the Act", idLink: "Get the ID card / UDID", apply: "Apply for a scheme", office: "Find my district office",
    newTab: "opens in a new tab",
  },
  ta: {
    crumb: "குறைபாடுகள்", act: "தேசிய அறக்கட்டளைச் சட்டம், 1999 இன் கீழ் வருகிறது", about: "இது என்ன", signs: "கவனிக்க வேண்டிய அறிகுறிகள்",
    signsNote: "இவை பொதுவான அறிகுறிகள், நோயறிதல் அல்ல. ஒவ்வொரு குழந்தையும் வெவ்வேறு விதமாக வளர்கிறது. கவலை இருந்தால் மருத்துவர், அருகிலுள்ள அரசு மருத்துவமனை அல்லது மாவட்ட அலுவலகத்தை அணுகவும் — ஆரம்ப உதவி பெரும் மாற்றத்தை ஏற்படுத்தும்.",
    help: "உதவுபவை", assess: "மதிப்பீடு பெற", assessP: "மருத்துவக் குழு குறைபாட்டை மதிப்பீடு செய்து மாற்றுத்திறன் சான்றிதழ் மற்றும் தேசிய UDID அட்டையை வழங்கும். பெரும்பாலான திட்டங்களுக்கு இதுவே முதல் படி.",
    state: "உதவக்கூடிய தமிழ்நாட்டுத் திட்டங்கள்", nt: "தேசிய அறக்கட்டளை ஆதரவு", ntP: "பதிவுசெய்த நிறுவனங்கள் மூலம் செயல்படும் திட்டங்கள்:",
    guard: "சட்டப் பாதுகாவலர்", guardP: "வயது வந்தோருக்குச் சட்டப் பாதுகாவலர் தேவைப்படலாம். சட்டத்தின் பிரிவு 14 இன் கீழ், மாவட்ட ஆட்சியர் தலைமையிலான உள்ளூர் நிலைக் குழு பாதுகாவலர்களை நியமிக்கிறது.",
    other: "சட்டத்தின் கீழ் உள்ள பிற குறைபாடுகள்", idLink: "அடையாள அட்டை / UDID பெற", apply: "திட்டத்திற்கு விண்ணப்பிக்க", office: "என் மாவட்ட அலுவலகம்",
    newTab: "புதிய தாவலில் திறக்கும்",
  },
};

export default function DisabilityDetail() {
  const { slug } = useParams();
  const { t, tx, lang } = useLang();
  const s = useStrings(S);
  const d = findDisability(slug);
  const schemes = useApi(d ? "/schemes" : null);
  useDocumentTitle(d ? tx(d.title) : "");
  if (!d) return <NotFound />;

  const list = (obj) => (lang === "ta" ? obj.ta : obj.en);
  const related = (schemes.data?.schemes || []).filter((x) => d.schemes.includes(x.slug));

  return (
    <>
      <div className="dis-hero" style={{ "--tone": d.tone }}>
        <div className="container">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol><li><Link to="/">{t("common.home")}</Link></li><li><Link to="/disabilities">{s.crumb}</Link></li><li aria-current="page">{tx(d.short)}</li></ol>
            </nav>
            <span className="act-badge"><Scale aria-hidden="true" />{s.act}</span>
            <h1 tabIndex={-1} data-page-heading>{tx(d.title)}</h1>
            <p className="lead">{tx(d.summary)}</p>
          </div>
          <SiteImage name={d.image} icon={DIS_ICONS[d.slug]} tone={d.tone} ratio="16/10" eager />
        </div>
      </div>

      <section className="section">
        <div className="container layout-side" style={{ gridTemplateColumns: "minmax(0,1fr) 340px" }}>
          <div className="prose" style={{ maxWidth: "none" }}>
            {d.note && <Notice kind="info">{tx(d.note)}</Notice>}
            <h2 style={{ marginTop: d.note ? 24 : 0 }}>{s.about}</h2>
            {list(d.about).map((p) => <p key={p.slice(0, 20)}>{p}</p>)}

            <h2>{s.signs}</h2>
            <ul className="check-list">{list(d.signs).map((x) => <li key={x}><Eye aria-hidden="true" />{x}</li>)}</ul>
            <p className="muted" style={{ marginTop: 12 }}><Stethoscope aria-hidden="true" style={{ width: 16, height: 16, verticalAlign: "-3px", marginRight: 6 }} />{s.signsNote}</p>

            <h2>{s.help}</h2>
            <ul className="check-list">{list(d.help).map((x) => <li key={x}><CheckCircle2 aria-hidden="true" />{x}</li>)}</ul>

            <h2>{s.assess}</h2>
            <p>{s.assessP} <Link to="/id-card">{s.idLink}</Link></p>

            <h2>{s.state}</h2>
            {related.length > 0 && (
              <ul className="scheme-tiles" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
                {related.map((x) => <li key={x.slug}><Link className="st" to={`/schemes/${x.slug}`}><SchemeIcon slug={x.slug} />{tx(x.title)}</Link></li>)}
              </ul>
            )}

            <h2>{s.nt}</h2>
            <p>{s.ntP}</p>
            <ul className="nt-grid">
              {NATIONAL_TRUST_SCHEMES.map((n) => <li key={n.name}><strong lang="en">{n.name}</strong><p>{lang === "ta" ? n.ta : n.en}</p></li>)}
            </ul>
            <p style={{ marginTop: 12 }}><NtLink s={{ nt: t("foot.nt"), newTab: s.newTab }} /></p>
          </div>

          <aside style={{ display: "grid", gap: 16, alignContent: "start", position: "sticky", top: 110 }}>
            <div className="card card-pad" style={{ display: "grid", gap: 10 }}>
              <Link className="btn btn-primary btn-block" to="/id-card"><IdCard aria-hidden="true" /> {s.idLink}</Link>
              <Link className="btn btn-outline btn-block" to="/apply"><FilePlus aria-hidden="true" /> {s.apply}</Link>
              <Link className="btn btn-outline btn-block" to="/district-offices"><MapPin aria-hidden="true" /> {s.office}</Link>
            </div>
            <div className="card card-pad">
              <h2 className="card-title" style={{ fontSize: "1.05rem", marginBottom: 8 }}><HeartHandshake aria-hidden="true" />{s.guard}</h2>
              <p className="muted" style={{ fontSize: ".9rem" }}>{s.guardP}</p>
            </div>
            <nav className="card card-pad" aria-labelledby="other-dis">
              <h2 id="other-dis" style={{ fontSize: "1rem", marginBottom: 8 }}>{s.other}</h2>
              <ul className="side-nav">
                {DISABILITIES.map((x) => { const I = DIS_ICONS[x.slug]; return (
                  <li key={x.slug}><Link to={`/disabilities/${x.slug}`} aria-current={x.slug === d.slug ? "page" : undefined}><I aria-hidden="true" />{tx(x.short)}<ArrowRight aria-hidden="true" style={{ marginLeft: "auto" }} /></Link></li>
                ); })}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </>
  );
}