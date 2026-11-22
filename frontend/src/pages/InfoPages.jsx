import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import { Notice } from "../components/States.jsx";
import { NAV } from "../components/MainNav.jsx";

const PENDING = {
  en: "The department will publish the official text for this page. It is not shown here until it has been supplied and approved.",
  ta: "இந்தப் பக்கத்திற்கான அதிகாரப்பூர்வ உரையைத் துறை வெளியிடும். அது வழங்கப்பட்டு ஒப்புதல் பெறும் வரை இங்கு காட்டப்படாது.",
};

export function About() {
  const { t, lang } = useLang();
  const s = useStrings({
    en: { title: "History & mandate", lead: "What the department does and how it serves differently abled persons in Tamil Nadu.", work: "What the department does today", workP: "The department runs the twelve schemes listed on this site: identification and the national ID card, early identification and intervention for young children, training, rehabilitation homes and day care, special education, economic development, assistive devices, social security and the State Award." },
    ta: { title: "வரலாறு & பணி", lead: "துறை என்ன செய்கிறது, தமிழ்நாட்டில் உள்ள மாற்றுத்திறனாளிகளுக்கு எவ்வாறு சேவை செய்கிறது.", work: "துறையின் தற்போதைய பணிகள்", workP: "இந்தத் தளத்தில் உள்ள பன்னிரண்டு திட்டங்களைத் துறை செயல்படுத்துகிறது: அடையாள அட்டை, சிறு குழந்தைகளுக்கான ஆரம்ப நிலை கண்டறிதல் மற்றும் பயிற்சி, மறுவாழ்வு இல்லங்கள், பகல்நேரப் பராமரிப்பு, சிறப்புக் கல்வி, பொருளாதார மேம்பாடு, உதவி உபகரணங்கள், சமூகப் பாதுகாப்பு மற்றும் மாநில விருது." },
  });
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section"><div className="container prose">
        <Notice kind="info" icon={Info}>{PENDING[lang]}</Notice>
        <h2>{s.work}</h2><p>{s.workP}</p>
        <p><Link className="link-arrow" to="/schemes">{t("schemes.seeAll")}</Link></p>
      </div></section>
    </>
  );
}

export function Rti() {
  const { lang } = useLang();
  const s = useStrings({
    en: { title: "Right to Information (RTI)", lead: "How to ask the department for information under the Right to Information Act, 2005.", how: "How to ask", howP: "Under the RTI Act, 2005, any citizen can ask a public authority for information it holds. Write your request to the department's Public Information Officer (PIO). The names and addresses of the PIO and the Appellate Authority will be listed here.", officers: "Information officers" },
    ta: { title: "தகவல் அறியும் உரிமை (RTI)", lead: "தகவல் அறியும் உரிமைச் சட்டம், 2005 இன் கீழ் துறையிடம் தகவல் கேட்பது எப்படி.", how: "கேட்பது எப்படி", howP: "தகவல் அறியும் உரிமைச் சட்டம், 2005 இன் கீழ் எந்தக் குடிமகனும் ஒரு பொது அதிகார அமைப்பிடம் உள்ள தகவலைக் கேட்கலாம். துறையின் பொதுத் தகவல் அலுவலருக்கு (PIO) உங்கள் கோரிக்கையை எழுதவும். PIO மற்றும் மேல்முறையீட்டு அலுவலரின் விவரங்கள் இங்கு பட்டியலிடப்படும்.", officers: "தகவல் அலுவலர்கள்" },
  });
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section"><div className="container prose">
        <h2 style={{ marginTop: 0 }}>{s.how}</h2><p>{s.howP}</p>
        <h2>{s.officers}</h2>
        <Notice kind="info" icon={Info}>{PENDING[lang]}</Notice>
      </div></section>
    </>
  );
}

export function ScreenReader() {
  const s = useStrings({
    en: { title: "Screen reader access", lead: "This site works with free and paid screen readers on computers and phones.",
      tips: "Tips for moving around", list: ["Press Tab on any page and choose “Skip to main content” to go past the menus.", "Use your screen reader's heading list (for example H in NVDA or JAWS) — every page has one main heading and clear section headings.", "Use landmarks to jump between the header, navigation, main content and footer.", "When a form has a problem, a summary at the top lists each error as a link to the field."],
      readers: "Screen readers you can use", rows: [["NVDA", "Windows", "Free"], ["JAWS", "Windows", "Paid"], ["Narrator", "Windows", "Built in"], ["TalkBack", "Android", "Built in"], ["VoiceOver", "iPhone, iPad, Mac", "Built in"]],
      name: "Screen reader", platform: "Works on", cost: "Cost" },
    ta: { title: "திரை வாசிப்பான் அணுகல்", lead: "இந்தத் தளம் கணினிகள் மற்றும் கைபேசிகளில் உள்ள திரை வாசிப்பான்களுடன் வேலை செய்யும்.",
      tips: "நகர்வதற்கான குறிப்புகள்", list: ["எந்தப் பக்கத்திலும் Tab அழுத்தி “முதன்மை உள்ளடக்கத்திற்குச் செல்ல” என்பதைத் தேர்ந்தெடுக்கவும்.", "உங்கள் திரை வாசிப்பானின் தலைப்புப் பட்டியலைப் பயன்படுத்தவும் — ஒவ்வொரு பக்கத்திலும் ஒரு முதன்மைத் தலைப்பு உள்ளது.", "தலைப்பு, வழிசெலுத்தல், முதன்மை உள்ளடக்கம் மற்றும் அடிக்குறிப்புக்கு இடையே தாவ அடையாளக் குறிகளைப் பயன்படுத்தவும்.", "படிவத்தில் பிழை இருந்தால், மேலே உள்ள சுருக்கம் ஒவ்வொரு பிழையையும் இணைப்பாகப் பட்டியலிடும்."],
      readers: "பயன்படுத்தக்கூடிய திரை வாசிப்பான்கள்", rows: [["NVDA", "Windows", "இலவசம்"], ["JAWS", "Windows", "கட்டணம்"], ["Narrator", "Windows", "உள்ளமைந்தது"], ["TalkBack", "Android", "உள்ளமைந்தது"], ["VoiceOver", "iPhone, iPad, Mac", "உள்ளமைந்தது"]],
      name: "திரை வாசிப்பான்", platform: "இயங்குதளம்", cost: "கட்டணம்" },
  });
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section"><div className="container prose">
        <h2 style={{ marginTop: 0 }}>{s.tips}</h2>
        <ul>{s.list.map((x) => <li key={x}>{x}</li>)}</ul>
        <h2>{s.readers}</h2>
        <div className="table-wrap"><table className="data"><caption className="sr-only">{s.readers}</caption>
          <thead><tr><th scope="col">{s.name}</th><th scope="col">{s.platform}</th><th scope="col">{s.cost}</th></tr></thead>
          <tbody>{s.rows.map((r) => <tr key={r[0]}><th scope="row" style={{ background: "none", color: "var(--text)", fontSize: ".875rem" }}>{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div>
      </div></section>
    </>
  );
}

export function Sitemap() {
  const { t } = useLang();
  const s = useStrings({ en: { title: "Sitemap", lead: "Every page on this website.", main: "Main pages", more: "More", services: "Services" }, ta: { title: "தள வரைபடம்", lead: "இந்த இணையதளத்தின் எல்லாப் பக்கங்களும்.", main: "முதன்மைப் பக்கங்கள்", more: "மேலும்", services: "சேவைகள்" } });
  const more = [["/about", t("footer.history")], ["/rti", t("footer.rti")], ["/accessibility", t("footer.a11y")], ["/screen-reader-access", t("footer.screenReader")], ["/admin/login", t("footer.admin")]];
  const services = [["/apply", t("online.apply")], ["/track", t("online.track")], ["/id-card", t("online.id")], ["/district-offices", t("online.office")]];
  const Col = ({ title, items }) => (<div><h2 style={{ fontSize: "1.1rem", marginBottom: 10 }}>{title}</h2><ul style={{ listStyle: "none", display: "grid", gap: 8 }}>{items.map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></div>);
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section"><div className="container grid-3">
        <Col title={s.main} items={NAV.map(([to, key]) => [to, t(`nav.${key}`)])} />
        <Col title={s.services} items={services} />
        <Col title={s.more} items={more} />
      </div></section>
    </>
  );
}
