import { useStrings } from "../../context/LanguageContext.jsx";
import PageHero from "../../components/PageHero.jsx";
import { Notice } from "../../components/States.jsx";
import { D } from "./strings.js";
import { TestModeNote } from "./parts.jsx";

export default function DonateTerms() {
  const s = useStrings(D);
  return (
    <>
      <PageHero title={s.termsTitle} crumbs={[["/donate", s.crumb]]} />
      <section className="section"><div className="container prose">
        <Notice kind="info">{s.termsPending}</Notice>
        <div style={{ marginTop: 16 }}><TestModeNote /></div>
      </div></section>
    </>
  );
}