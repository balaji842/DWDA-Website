import { Link } from "react-router-dom";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";

const S = {
  en: { title: "Page not found", lead: "The page you asked for isn't here. It may have moved, or the link may be wrong.", home: "Go to the home page", schemes: "See all schemes" },
  ta: { title: "பக்கம் கிடைக்கவில்லை", lead: "நீங்கள் கேட்ட பக்கம் இங்கு இல்லை. அது இடம் மாறியிருக்கலாம், அல்லது இணைப்பு தவறாக இருக்கலாம்.", home: "முகப்புப் பக்கத்திற்குச் செல்ல", schemes: "அனைத்துத் திட்டங்களும்" },
};

export default function NotFound() {
  const s = useStrings(S);
  useLang();
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section"><div className="container" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn btn-primary" to="/">{s.home}</Link>
        <Link className="btn btn-outline" to="/schemes">{s.schemes}</Link>
      </div></section>
    </>
  );
}
