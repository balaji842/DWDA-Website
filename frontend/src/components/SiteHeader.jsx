import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, Search, X } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { useSite } from "../context/SiteContext.jsx";
import MainNav from "./MainNav.jsx";

export function Emblem() {
  const { t } = useLang();
  // Placeholder: replace with the official State emblem image supplied by the department.
  return <span className="emblem" role="img" aria-label={t("common.emblem")}><span aria-hidden="true">State<br />emblem</span></span>;
}

export function HelplineButton({ className = "btn btn-outline" }) {
  const { t } = useLang();
  const { settings } = useSite();
  const number = settings?.helpline;
  // Until a helpline is set, the button goes to the Contact page instead of a dead tel: link.
  return number ? (
    <a className={className} href={`tel:${number.replace(/[^\d+]/g, "")}`}>
      <Phone aria-hidden="true" /><span>{t("common.helpline")} <span className="btn-label-long">{number}</span></span>
    </a>
  ) : (
    <Link className={className} to="/contact"><Phone aria-hidden="true" /><span>{t("common.helplineNotSet")}</span></Link>
  );
}

export default function SiteHeader() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const input = useRef(null);
  const toggleBtn = useRef(null);

  useEffect(() => setSearchOpen(false), [pathname]);
  useEffect(() => { if (searchOpen) input.current?.focus(); }, [searchOpen]);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/schemes?q=${encodeURIComponent(q.trim())}` : "/schemes");
    setQ("");
  };

  return (
    <header className="site-header">
      <div className="container bar">
        <Link to="/" className="brand" aria-label={`${t("common.deptName")} — ${t("common.home")}`}>
          <Emblem />
          <span>
            <span className="brand-gov">{t("common.govt")}</span>
            <span className="brand-name">{t("common.deptName")}</span>
          </span>
          <span className="brand-ta" lang={lang === "en" ? "ta" : "en"} aria-hidden="true">{t("common.deptNameTa")}</span>
        </Link>
        <MainNav />
        <button ref={toggleBtn} type="button" className="search-btn" aria-expanded={searchOpen} aria-controls="site-search"
          aria-label={searchOpen ? t("common.closeSearch") : t("common.openSearch")} onClick={() => setSearchOpen((o) => !o)}>
          {searchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
        </button>
      </div>
      {searchOpen && (
        <div className="search-panel" id="site-search">
          <div className="container">
            <form role="search" onSubmit={submit} onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); toggleBtn.current?.focus(); } }}>
              <label htmlFor="site-search-input" className="sr-only">{t("common.searchSite")}</label>
              <input id="site-search-input" ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("hero.placeholder")} autoComplete="off" />
              <button type="submit" className="btn btn-primary"><Search aria-hidden="true" /> {t("common.search")}</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}