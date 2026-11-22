import { Link } from "react-router-dom";
import { ExternalLink, Info } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import { Notice } from "../components/States.jsx";

const S = {
  en: {
    title: "ID card / UDID", lead: "The national ID card for persons with disabilities is the first step for most benefits.",
    what: "What is the UDID card?",
    whatP: "UDID stands for Unique Disability ID. It is a single national identity card for persons with disabilities, issued with a disability certificate after a medical assessment. Most schemes on this site ask for it.",
    steps: "How to get it",
    s1: "Apply on the national UDID portal, or ask your District Differently Abled Welfare Office to help you apply.",
    s2: "Attend the medical assessment. A medical board checks the type and percentage of disability.",
    s3: "Receive your card. The certificate and card are issued after the assessment. Keep the number — you will need it for applications.",
    portal: "National UDID portal (Government of India)", newTab: "opens in a new tab",
    help: "Need help applying?", helpP: "Your district office can help you register, tell you when and where the medical board meets, and check your documents.",
    office: "Find my district office", camps: "Medical camps", campsP: "Assessment camps in your district are announced on the News page.", news: "See announcements",
    verify: "The department has not yet published state-specific instructions for this page. Check documents and timings with your district office.",
    noCard: "No card yet?", noCardP: "You can still apply for a scheme. Leave the UDID field empty and the office will guide you.", apply: "Apply for a scheme",
  },
  ta: {
    title: "அடையாள அட்டை / UDID", lead: "மாற்றுத்திறனாளிகளுக்கான தேசிய அடையாள அட்டை பெரும்பாலான நலத்திட்டங்களுக்கு முதல் படி.",
    what: "UDID அட்டை என்றால் என்ன?",
    whatP: "UDID என்பது தனித்துவ மாற்றுத்திறன் அடையாளம். மருத்துவ மதிப்பீட்டிற்குப் பின் மாற்றுத்திறன் சான்றிதழுடன் வழங்கப்படும் ஒரே தேசிய அடையாள அட்டை இது. இந்தத் தளத்தில் உள்ள பெரும்பாலான திட்டங்களுக்கு இது தேவை.",
    steps: "பெறுவது எப்படி",
    s1: "தேசிய UDID இணையதளத்தில் விண்ணப்பிக்கவும், அல்லது மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலகத்தின் உதவியைப் பெறவும்.",
    s2: "மருத்துவ மதிப்பீட்டில் கலந்துகொள்ளவும். மருத்துவக் குழு மாற்றுத்திறனின் வகையையும் சதவீதத்தையும் சரிபார்க்கும்.",
    s3: "அட்டையைப் பெறவும். மதிப்பீட்டிற்குப் பின் சான்றிதழும் அட்டையும் வழங்கப்படும். எண்ணைப் பாதுகாக்கவும்.",
    portal: "தேசிய UDID இணையதளம் (இந்திய அரசு)", newTab: "புதிய தாவலில் திறக்கும்",
    help: "விண்ணப்பிக்க உதவி வேண்டுமா?", helpP: "பதிவு செய்ய, மருத்துவக் குழு கூடும் இடம் மற்றும் நேரம் அறிய, ஆவணங்களைச் சரிபார்க்க மாவட்ட அலுவலகம் உதவும்.",
    office: "என் மாவட்ட அலுவலகம்", camps: "மருத்துவ முகாம்கள்", campsP: "உங்கள் மாவட்ட மதிப்பீட்டு முகாம்கள் செய்திகள் பக்கத்தில் அறிவிக்கப்படும்.", news: "அறிவிப்புகளைக் காண்க",
    verify: "இந்தப் பக்கத்திற்கான மாநில வழிமுறைகளைத் துறை இன்னும் வெளியிடவில்லை. ஆவணங்களையும் நேரத்தையும் மாவட்ட அலுவலகத்தில் உறுதிசெய்யவும்.",
    noCard: "இன்னும் அட்டை இல்லையா?", noCardP: "நீங்கள் திட்டத்திற்கு விண்ணப்பிக்கலாம். UDID புலத்தைக் காலியாக விடுங்கள்; அலுவலகம் வழிகாட்டும்.", apply: "திட்டத்திற்கு விண்ணப்பிக்க",
  },
};

export default function IdCard() {
  const { t } = useLang();
  const s = useStrings(S);
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container layout-side">
          <div className="prose">
            <Notice kind="warn" icon={Info}>{s.verify}</Notice>
            <h2>{s.what}</h2>
            <p>{s.whatP}</p>
            <h2>{s.steps}</h2>
            <ol className="grid-3" style={{ listStyle: "none", padding: 0 }}>
              {[s.s1, s.s2, s.s3].map((txt, i) => (
                <li key={i} className="card step-card"><span className="step-num" aria-hidden="true">{i + 1}</span><p style={{ color: "var(--text)" }}><span className="sr-only">Step {i + 1}: </span>{txt}</p></li>
              ))}
            </ol>
            <p style={{ marginTop: 18 }}>
              <a className="btn btn-primary" href="https://www.swavlambancard.gov.in/" target="_blank" rel="noopener noreferrer">
                {s.portal} <ExternalLink aria-hidden="true" /><span className="sr-only"> ({s.newTab})</span>
              </a>
            </p>
          </div>
          <aside style={{ display: "grid", gap: 16 }}>
            <div className="card card-pad"><h2 style={{ fontSize: "1.05rem", marginBottom: 6 }}>{s.help}</h2><p className="muted" style={{ fontSize: ".9rem", marginBottom: 10 }}>{s.helpP}</p><Link className="link-arrow" to="/district-offices">{s.office}</Link></div>
            <div className="card card-pad"><h2 style={{ fontSize: "1.05rem", marginBottom: 6 }}>{s.camps}</h2><p className="muted" style={{ fontSize: ".9rem", marginBottom: 10 }}>{s.campsP}</p><Link className="link-arrow" to="/news">{s.news}</Link></div>
            <div className="card card-pad"><h2 style={{ fontSize: "1.05rem", marginBottom: 6 }}>{s.noCard}</h2><p className="muted" style={{ fontSize: ".9rem", marginBottom: 10 }}>{s.noCardP}</p><Link className="link-arrow" to="/apply?scheme=identification-scheme">{s.apply}</Link></div>
            <Link className="link-arrow" to="/schemes/identification-scheme">{t("common.viewDetails")}: {t("cat.identity")}</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
