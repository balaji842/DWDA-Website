import { Link } from "react-router-dom";
import { Coins, ShoppingBasket, Building2, ArrowRight } from "lucide-react";
import { useLang, useStrings } from "../../context/LanguageContext.jsx";
import useApi from "../../hooks/useApi.js";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import SiteImage from "../../components/SiteImage.jsx";
import { D, money } from "./strings.js";
import { TestModeNote } from "./parts.jsx";
import { Skeleton } from "../../components/States.jsx";

export default function DonateHome() {
  const s = useStrings(D);
  const { lang, t } = useLang();
  useDocumentTitle(s.donate);
  const stats = useApi("/donate/stats");
  const st = stats.data;
  const options = [
    ["/donate/quick", Coins, s.quick, s.quickSub, "#0b4bb3", "service-social-security"],
    ["/donate/needs", ShoppingBasket, s.need, s.needSub, "#047857", "service-devices"],
    ["/donate/institutions", Building2, s.inst, s.instSub, "#6d28d9", "service-education"],
  ];
  return (
    <>
      <section className="don-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb"><ol><li><Link to="/">{t("common.home")}</Link></li><li aria-current="page">{s.crumb}</li></ol></nav>
          <h1 tabIndex={-1} data-page-heading>{s.heroTitle}</h1>
          <p className="lead">{s.heroLead}</p>
          <ul className="don-stats">
            {[[st?.raised, s.statRaised, true], [st?.donations, s.statDonations], [st?.openNeeds, s.statNeeds], [st?.institutions, s.statInst]].map(([v, l, isMoney]) => (
              <li key={l}>{st ? <strong>{isMoney ? money(v, lang) : v}</strong> : <Skeleton h={30} w={90} />}<span>{l}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <TestModeNote />
          <ul className="don-options">
            {options.map(([to, Icon, title, sub, tone, img]) => (
              <li key={to}>
                <Link to={to} className="don-option" style={{ "--tone": tone }}>
                  <SiteImage name={img} icon={Icon} tone={tone} ratio="16/9" />
                  <div className="don-option-body">
                    <span className="don-icon"><Icon aria-hidden="true" /></span>
                    <h2>{title}</h2>
                    <p>{sub}</p>
                    <span className="more">{s.start} <ArrowRight aria-hidden="true" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section-grey">
        <div className="container">
          <div className="sec-head"><div><h2>{s.how}</h2></div></div>
          <ol className="grid-4" style={{ listStyle: "none" }}>
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="card step-card"><span className="step-num" aria-hidden="true">{n}</span><h3>{s[`how${n}`]}</h3><p>{s[`how${n}d`]}</p></li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}