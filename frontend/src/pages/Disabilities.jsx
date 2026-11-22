import { Link } from "react-router-dom";
import { ArrowRight, Scale, Puzzle, Accessibility, Brain, Layers, ExternalLink, ShieldCheck, Info } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import SiteImage from "../components/SiteImage.jsx";
import { Notice } from "../components/States.jsx";
import { DISABILITIES, NATIONAL_TRUST_SCHEMES } from "../data/disabilities.js";

export const DIS_ICONS = { autism: Puzzle, "cerebral-palsy": Accessibility, "intellectual-disability": Brain, "multiple-disabilities": Layers };

const S = {
  en: {
    title: "Autism, cerebral palsy, intellectual and multiple disabilities",
    lead: "The National Trust Act, 1999 gives special support to people with these four disabilities and their families. Here is what each one means and where to get help in Tamil Nadu.",
    four: "The four disabilities",
    act: "About the National Trust",
    actP: "The National Trust is a statutory body of the Ministry of Social Justice and Empowerment, Government of India, set up under the National Trust Act, 1999 (Act 44 of 1999). It works for people with autism, cerebral palsy, intellectual disability and multiple disabilities, and supports their families and the organisations that serve them.",
    term: "The Act uses the older term “mental retardation”. This website uses “intellectual disability”, as in the Rights of Persons with Disabilities Act, 2016.",
    schemes: "National Trust schemes", schemesP: "Run through organisations registered with the National Trust. Check current availability on the National Trust website.",
    guard: "Legal guardianship", guardP: "Some adults with these disabilities need a legal guardian to make decisions with them or for them. Under Section 14 of the Act, the Local Level Committee in each district — headed by the District Collector — appoints legal guardians. Ask your district office how to apply.",
    tn: "Getting help in Tamil Nadu",
    tn1: "Get the national disability certificate and UDID card — the first step for most benefits.",
    tn2: "Visit your District Differently Abled Welfare Office for early intervention, special education, assistive devices and maintenance assistance.",
    tn3: "Apply for State schemes online on this website and track your application.",
    nt: "National Trust website", newTab: "opens in a new tab", idLink: "ID card / UDID", officeLink: "District offices", applyLink: "Apply online",
  },
  ta: {
    title: "ஆட்டிசம், மூளை முடக்குவாதம், அறிவுசார் மற்றும் பல்வகைக் குறைபாடுகள்",
    lead: "தேசிய அறக்கட்டளைச் சட்டம், 1999 இந்த நான்கு குறைபாடுகள் உள்ளவர்களுக்கும் அவர்களின் குடும்பங்களுக்கும் சிறப்பு ஆதரவு வழங்குகிறது. ஒவ்வொன்றின் பொருளும், தமிழ்நாட்டில் உதவி பெறும் இடங்களும் இங்கே.",
    four: "நான்கு குறைபாடுகள்",
    act: "தேசிய அறக்கட்டளை பற்றி",
    actP: "தேசிய அறக்கட்டளை என்பது தேசிய அறக்கட்டளைச் சட்டம், 1999 (சட்டம் 44/1999) இன் கீழ் அமைக்கப்பட்ட, இந்திய அரசின் சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகத்தின் சட்டப்பூர்வ அமைப்பு. ஆட்டிசம், மூளை முடக்குவாதம், அறிவுசார் குறைபாடு மற்றும் பல்வகைக் குறைபாடுகள் உள்ளவர்களுக்காகவும், அவர்களின் குடும்பங்கள் மற்றும் அவர்களுக்குச் சேவை செய்யும் நிறுவனங்களுக்காகவும் இது செயல்படுகிறது.",
    term: "இச்சட்டம் பழைய சொல்லைப் பயன்படுத்துகிறது. மாற்றுத்திறனாளிகள் உரிமைகள் சட்டம், 2016 போலவே இந்தத் தளம் “அறிவுசார் குறைபாடு” எனப் பயன்படுத்துகிறது.",
    schemes: "தேசிய அறக்கட்டளைத் திட்டங்கள்", schemesP: "தேசிய அறக்கட்டளையில் பதிவுசெய்த நிறுவனங்கள் மூலம் செயல்படுத்தப்படுகின்றன. தற்போதைய நிலையைத் தேசிய அறக்கட்டளை இணையதளத்தில் சரிபார்க்கவும்.",
    guard: "சட்டப் பாதுகாவலர்", guardP: "இக்குறைபாடுகள் உள்ள சில வயது வந்தோருக்கு, அவர்களுடன் அல்லது அவர்களுக்காக முடிவெடுக்கச் சட்டப் பாதுகாவலர் தேவைப்படலாம். சட்டத்தின் பிரிவு 14 இன் கீழ், மாவட்ட ஆட்சியர் தலைமையிலான ஒவ்வொரு மாவட்டத்தின் உள்ளூர் நிலைக் குழு சட்டப் பாதுகாவலர்களை நியமிக்கிறது. விண்ணப்பிக்கும் முறையை மாவட்ட அலுவலகத்தில் கேட்கவும்.",
    tn: "தமிழ்நாட்டில் உதவி பெற",
    tn1: "தேசிய மாற்றுத்திறன் சான்றிதழ் மற்றும் UDID அட்டையைப் பெறுங்கள் — பெரும்பாலான நலத்திட்டங்களுக்கு முதல் படி.",
    tn2: "ஆரம்பப் பயிற்சி, சிறப்புக் கல்வி, உதவி உபகரணங்கள் மற்றும் பராமரிப்பு உதவிக்கு மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலகத்தை அணுகுங்கள்.",
    tn3: "இந்தத் தளத்தில் மாநிலத் திட்டங்களுக்கு இணையத்தில் விண்ணப்பித்து நிலையை அறியுங்கள்.",
    nt: "தேசிய அறக்கட்டளை இணையதளம்", newTab: "புதிய தாவலில் திறக்கும்", idLink: "அடையாள அட்டை / UDID", officeLink: "மாவட்ட அலுவலகங்கள்", applyLink: "இணையத்தில் விண்ணப்பிக்க",
  },
};

export function NtLink({ s }) {
  return (
    <a className="sec-link" href="https://nationaltrust.nic.in/" target="_blank" rel="noopener noreferrer">
      {s.nt} <ExternalLink aria-hidden="true" /><span className="sr-only"> ({s.newTab})</span>
    </a>
  );
}

export default function Disabilities() {
  const { t, tx, lang } = useLang();
  const s = useStrings(S);
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container">
          <div className="sec-head"><div><h2>{s.four}</h2></div></div>
          <ul className="focus-grid">
            {DISABILITIES.map((d, i) => (
              <li key={d.slug}>
                <Link className="focus-card" to={`/disabilities/${d.slug}`} style={{ "--tone": d.tone }}>
                  <SiteImage name={d.image} icon={DIS_ICONS[d.slug]} tone={d.tone} ratio="16/10" />
                  <div className="focus-body">
                    <span className="num" aria-hidden="true">0{i + 1}</span>
                    <h3>{tx(d.title)}</h3>
                    <p>{tx(d.summary)}</p>
                    <span className="more">{t("focus.more")}<span className="sr-only">: {tx(d.short)}</span> <ArrowRight aria-hidden="true" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 18 }}><Notice kind="info" icon={Info}>{s.term}</Notice></div>
        </div>
      </section>

      <section className="section section-grey">
        <div className="container layout-side" style={{ gridTemplateColumns: "minmax(0,1fr) 360px" }}>
          <div>
            <div className="sec-head"><div><h2>{s.act}</h2></div></div>
            <p className="prose" style={{ marginBottom: 26 }}>{s.actP}</p>
            <div className="sec-head"><div><h2>{s.schemes}</h2><p>{s.schemesP}</p></div><NtLink s={s} /></div>
            <ul className="nt-grid">
              {NATIONAL_TRUST_SCHEMES.map((n) => <li key={n.name}><strong lang="en">{n.name}</strong><p>{lang === "ta" ? n.ta : n.en}</p></li>)}
            </ul>
          </div>
          <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <div className="card card-pad">
              <h2 className="card-title" style={{ fontSize: "1.15rem", marginBottom: 8 }}><Scale aria-hidden="true" />{s.guard}</h2>
              <p className="muted" style={{ fontSize: ".95rem" }}>{s.guardP}</p>
            </div>
            <div className="card card-pad">
              <h2 className="card-title" style={{ fontSize: "1.15rem", marginBottom: 10 }}><ShieldCheck aria-hidden="true" />{s.tn}</h2>
              <ol style={{ paddingLeft: "1.2em", display: "grid", gap: 8, fontSize: ".95rem" }}>
                <li>{s.tn1} <Link to="/id-card">{s.idLink}</Link></li>
                <li>{s.tn2} <Link to="/district-offices">{s.officeLink}</Link></li>
                <li>{s.tn3} <Link to="/apply">{s.applyLink}</Link></li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}