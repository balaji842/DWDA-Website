import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Search, IdCard, HandHeart, Accessibility, GraduationCap, Briefcase, ShieldCheck, MapPin, FileText,
  Info, User, Users, Building2, Activity, Scale, Headset, Megaphone, Phone, Mail, MessageCircle, Video, ChevronRight,
  HeartHandshake, Home as HomeIcon, BookOpen, Puzzle, Brain, Layers,
} from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { useSite } from "../context/SiteContext.jsx";
import useApi from "../hooks/useApi.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { fmtDate } from "../hooks/format.js";
import { fileUrl } from "../services/api.js";
import SiteImage, { HeroArt } from "../components/SiteImage.jsx";
import SchemeIcon from "../components/SchemeIcon.jsx";
import { DISABILITIES } from "../data/disabilities.js";
import { CardSkeletons, ErrorState, Skeleton } from "../components/States.jsx";

const DIS_ICONS = { autism: Puzzle, "cerebral-palsy": Accessibility, "intellectual-disability": Brain, "multiple-disabilities": Layers };
const tel = (n) => `tel:${n.replace(/[^\d+]/g, "")}`;

function SecHead({ id, title, sub, link }) {
  return (
    <div className="sec-head">
      <div><h2 id={id}>{title}</h2>{sub && <p>{sub}</p>}</div>
      {link}
    </div>
  );
}

function Hero() {
  const { t } = useLang();
  const [failed, setFailed] = useState(false);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-copy">
          <p className="eyebrow">{t("hero.eyebrow")}</p>
          <h1 id="hero-title" tabIndex={-1} data-page-heading>
            {t("hero.line1")}<br />
            <span className="line2">{t("hero.line2")}
              <svg className="swoosh" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11 C 80 2, 200 2, 297 9" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
            </span>
          </h1>
          <p className="hero-lead">{t("hero.sub")}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/schemes">{t("hero.explore")} <ArrowRight aria-hidden="true" /></Link>
            <Link className="btn btn-outline" to="/track"><Search aria-hidden="true" /> {t("online.track")}</Link>
          </div>
        </div>
        <div className="hero-media">
          {/* AI or real photo: frontend/public/images/hero.webp — illustration until then */}
          {failed ? <HeroArt /> : (
            <img className="site-img" src="/images/hero.webp" alt={t("hero.heroAlt")} fetchpriority="high" onError={() => setFailed(true)} />
          )}
        </div>
      </div>
      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 C 360 10, 900 110, 1440 30 L1440 90 L0 90 Z" fill="#ffffff" />
        <path d="M0 52 C 360 2, 900 102, 1440 22" stroke="#f5b400" strokeWidth="5" fill="none" />
      </svg>
    </section>
  );
}

function QuickTiles() {
  const { t } = useLang();
  const tiles = [
    ["/id-card", IdCard, "udid", "var(--t-blue)", "#0b4bb3"],
    ["/schemes", HandHeart, "schemes", "var(--t-violet)", "#6d28d9"],
    ["/schemes/assistive-devices", Accessibility, "devices", "var(--t-mint)", "#047857"],
    ["/schemes/special-education", GraduationCap, "education", "var(--t-peach)", "#b45309"],
    ["/schemes/economic-development", Briefcase, "employment", "var(--t-sky)", "#0369a1"],
    ["/schemes/social-security-schemes", ShieldCheck, "social", "var(--t-rose)", "#be123c"],
    ["/district-offices", MapPin, "district", "var(--t-green)", "#15803d"],
  ];
  return (
    <nav className="quick-tiles" aria-label={t("tiles.label")}>
      <div className="container">
        <ul>
          {tiles.map(([to, Icon, key, bg, ink]) => (
            <li key={key}>
              <Link className="qt" to={to} style={{ "--tile": bg, "--ink": ink }}>
                <Icon aria-hidden="true" />
                <strong>{t(`tiles.${key}`)}</strong>
                <span className="go" aria-hidden="true"><ArrowRight /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function FocusDisabilities() {
  const { t, tx } = useLang();
  return (
    <section className="section focus" aria-labelledby="focus-title">
      <div className="container">
        <SecHead id="focus-title" title={t("focus.title")} sub={t("focus.sub")}
          link={<Link className="sec-link" to="/disabilities">{t("focus.all")} <ArrowRight aria-hidden="true" /></Link>} />
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
        <p className="focus-note"><Info aria-hidden="true" />{t("focus.note")}</p>
      </div>
    </section>
  );
}

function ExploreSchemes() {
  const { t, tx } = useLang();
  const { data, loading, error, reload } = useApi("/schemes");
  return (
    <section className="section" style={{ paddingTop: 8 }} aria-labelledby="schemes-title" id="schemes">
      <div className="container">
        <SecHead id="schemes-title" title={t("explore.title")} sub={t("explore.sub")}
          link={<Link className="sec-link" to="/schemes">{t("explore.all")} <ArrowRight aria-hidden="true" /></Link>} />
        {loading && <CardSkeletons n={12} h={178} className="scheme-tiles" />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {data && (
          <ul className="scheme-tiles">
            {data.schemes.map((s) => (
              <li key={s.slug}><Link className="st" to={`/schemes/${s.slug}`}><SchemeIcon slug={s.slug} />{tx(s.title)}</Link></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ServicesForEveryNeed() {
  const { t } = useLang();
  const items = [
    ["/id-card", "service-udid", "udid", IdCard, "#0b4bb3"],
    ["/schemes/early-intervention-centres", "service-early-intervention", "early", HeartHandshake, "#0d9488"],
    ["/schemes/special-education", "service-education", "education", BookOpen, "#b45309"],
    ["/schemes/assistive-devices", "service-devices", "devices", Accessibility, "#047857"],
    ["/schemes/economic-development", "service-employment", "employment", Briefcase, "#0369a1"],
    ["/schemes/rehabilitation-homes", "service-rehabilitation", "rehab", HomeIcon, "#6d28d9"],
    ["/schemes/social-security-schemes", "service-social-security", "social", ShieldCheck, "#be123c"],
  ];
  return (
    <section className="section" style={{ paddingTop: 8 }} aria-labelledby="svc-title" id="services">
      <div className="container">
        <SecHead id="svc-title" title={t("svc.title")} sub={t("svc.sub")} />
        <ul className="service-photos">
          {items.map(([to, img, key, Icon, tone]) => (
            <li key={key}>
              <Link className="sp" to={to}>
                <SiteImage name={img} icon={Icon} tone={tone} ratio="3/2" />
                <span className="cap">{t(`svc.${key}`)}<span className="go" aria-hidden="true"><ArrowRight /></span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps() {
  const { t } = useLang();
  return (
    <section className="section section-grey" aria-labelledby="steps-title">
      <div className="container">
        <SecHead id="steps-title" title={t("steps.title")} sub={t("steps.sub")} />
        <ol className="grid-4" style={{ listStyle: "none" }}>
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="card step-card">
              <span className="step-num" aria-hidden="true">{n}</span>
              <h3><span className="sr-only">Step {n}: </span>{t(`steps.s${n}`)}</h3>
              <p>{t(`steps.s${n}d`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AtAGlance() {
  const { t } = useLang();
  const { settings } = useSite();
  const { data } = useApi("/schemes");
  const st = settings?.stats || {};
  // Figures as published by the department (editable in Site settings); placeholder until set.
  const items = [
    [st.populationFigure, "population"],
    [st.schemesFigure || (data ? String(data.total) : ""), "schemes"],
    [st.rehabHomesFigure, "homes"],
    [st.specialSchoolsFigure, "schools"],
  ];
  return (
    <section className="section" aria-labelledby="glance-title" style={{ paddingBottom: 24 }}>
      <div className="container">
        <SecHead id="glance-title" title={t("glance.title")} />
        <ul className="grid-4" style={{ listStyle: "none" }}>
          {items.map(([value, key]) => (
            <li key={key} className="card stat-card">
              {value ? <p className="stat-figure">{value}</p>
                : settings === null ? <Skeleton h={34} w="55%" style={{ marginBottom: 8 }} />
                  : <p className="stat-figure"><span aria-hidden="true">{t("common.figure")}</span><span className="sr-only">{t("common.figureMissing")}</span></p>}
              <p className="stat-label">{t(`glance.${key}`)}</p>
              <p className="stat-source">{key === "schemes" && st.schemesFigure ? t("glance.homesSrc") : t(`glance.${key}Src`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DistrictAndQuickInfo() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { data } = useApi("/districts");
  const [d, setD] = useState("");
  const [err, setErr] = useState("");
  const links = [
    ["/schemes?for=person", User, "person"], ["/schemes?for=parent", Users, "parent"],
    ["/institutions", Building2, "institution"], ["/track", Activity, "track"],
    ["/acts-policies", Scale, "acts"], ["/contact", Headset, "help"],
  ];
  return (
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="container duo">
        <div className="panel-soft" aria-labelledby="dp-title">
          <h2 id="dp-title"><MapPin aria-hidden="true" />{t("district.title")}</h2>
          <p>{t("district.sub")}</p>
          <form className="district-row" noValidate onSubmit={(e) => { e.preventDefault(); if (!d) { setErr(t("help.chooseFirst")); return; } navigate(`/district-offices?d=${encodeURIComponent(d)}`); }}>
            <label htmlFor="home-district" className="sr-only">{t("help.select")}</label>
            <select id="home-district" value={d} onChange={(e) => { setD(e.target.value); setErr(""); }} aria-invalid={Boolean(err)} aria-describedby={err ? "home-district-err" : undefined}>
              <option value="">{t("help.select")}</option>
              {(data?.offices || []).map((o) => <option key={o.district} value={o.district}>{lang === "ta" && o.districtTa ? `${o.districtTa} (${o.district})` : o.district}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">{t("district.view")} <ArrowRight aria-hidden="true" /></button>
            {err && <p id="home-district-err" role="alert" className="field-error" style={{ width: "100%" }}>{err}</p>}
          </form>
          {/* decorative map pins */}
          <svg className="map-deco" viewBox="0 0 200 220" aria-hidden="true">
            <path d="M120 8 L150 30 L160 70 L150 100 L170 140 L150 180 L110 212 L80 200 L60 160 L30 130 L40 90 L70 70 L80 30 Z" fill="currentColor" />
            {[[110, 60], [90, 120], [130, 150], [70, 150], [140, 95]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r="5" fill="#fff" />)}
          </svg>
        </div>
        <div className="panel-soft" aria-labelledby="qi-title">
          <h2 id="qi-title"><Info aria-hidden="true" />{t("qi.title")}</h2>
          <ul className="qi-list">
            {links.map(([to, Icon, key]) => <li key={key}><Link to={to}><Icon aria-hidden="true" />{t(`qi.${key}`)}</Link></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function AnnouncementsAndContact() {
  const { t, tx, lang } = useLang();
  const { settings } = useSite();
  const news = useApi("/news", { limit: 4 });
  const s = settings || {};
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="container duo">
        <div className="card panel" aria-labelledby="ann-title">
          <div className="panel-head">
            <h2 id="ann-title" className="card-title"><Megaphone aria-hidden="true" />{t("ann.title")}</h2>
            <Link to="/news" className="sec-link">{t("ann.all")} <ArrowRight aria-hidden="true" /></Link>
          </div>
          {news.loading && <div style={{ display: "grid", gap: 12, marginTop: 12 }}>{[1, 2, 3].map((i) => <Skeleton key={i} h={36} />)}</div>}
          {news.error && <ErrorState error={news.error} onRetry={news.reload} />}
          {news.data && (news.data.news.length ? (
            <ul className="ann-list">
              {news.data.news.map((n) => (
                <li key={n.slug}>
                  <Link to={`/news/${n.slug}`}>
                    <FileText aria-hidden="true" />
                    <span>{tx(n.title)} {n.isSample && <span className="tag tag-sample">{t("common.sample")}</span>}</span>
                    <time dateTime={n.date}>{fmtDate(n.date, lang)}</time>
                    <ChevronRight aria-hidden="true" style={{ width: 16, height: 16 }} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="muted" style={{ paddingTop: 12 }}>{t("news.empty")}</p>)}
        </div>

        <div className="card panel contact-card" aria-labelledby="ct-title">
          <h2 id="ct-title" className="card-title"><Phone aria-hidden="true" />{t("contact.title")}</h2>
          {settings === null ? <Skeleton h={120} style={{ marginTop: 14 }} /> : (
            <dl>
              {s.officeAddress && <div className="row"><dt><MapPin aria-hidden="true" />{t("contact.address")}</dt><dd><address style={{ whiteSpace: "pre-line", fontWeight: 500 }}>{s.officeAddress}</address></dd></div>}
              {s.helpline && <div className="row"><dt><Phone aria-hidden="true" />{t("contact.tollFree")}</dt><dd><a href={tel(s.helpline)}>{s.helpline}</a></dd></div>}
              {s.officePhone && <div className="row"><dt><Phone aria-hidden="true" />{t("contact.landline")}</dt><dd><a href={tel(s.officePhone)}>{s.officePhone}</a></dd></div>}
              {s.whatsapp && <div className="row"><dt><MessageCircle aria-hidden="true" />{t("contact.whatsapp")}</dt><dd>{s.whatsapp}</dd></div>}
              {s.videoCall && <div className="row"><dt><Video aria-hidden="true" />{t("contact.video")}</dt><dd>{s.videoCall}</dd></div>}
              {s.officeEmail && <div className="row"><dt><Mail aria-hidden="true" />{t("contact.email")}</dt><dd><a href={`mailto:${s.officeEmail}`}>{s.officeEmail}</a></dd></div>}
            </dl>
          )}
          <p style={{ marginTop: 16 }}><Link className="sec-link" to="/contact">{t("contact.more")} <ArrowRight aria-hidden="true" /></Link></p>
        </div>
      </div>
    </section>
  );
}

// Used by the Acts & policies page.
export function DocList({ docs, tx, t }) {
  return (
    <ul className="doc-list">
      {docs.map((d) => {
        const title = tx(d.title);
        if (d.hasFile) return <li key={d._id}><FileText aria-hidden="true" /><a href={fileUrl(`/documents/${d._id}/file`)} target="_blank" rel="noopener noreferrer">{title} ({t("common.pdf")})<span className="sr-only"> (opens in a new tab)</span></a></li>;
        if (d.externalUrl) return <li key={d._id}><FileText aria-hidden="true" /><a href={d.externalUrl} target="_blank" rel="noopener noreferrer">{title}<span className="sr-only"> (opens in a new tab)</span></a></li>;
        if (d.kind === "go") return <li key={d._id}><FileText aria-hidden="true" /><Link to="/acts-policies#government-orders">{title}</Link></li>;
        return <li key={d._id} className="pending"><FileText aria-hidden="true" /><span>{title}<small>{t("common.pdfPending")}</small></span></li>;
      })}
    </ul>
  );
}

export default function Home() {
  useDocumentTitle("");
  return (
    <>
      <Hero />
      <QuickTiles />
      <FocusDisabilities />
      <ExploreSchemes />
      <ServicesForEveryNeed />
      <Steps />
      <AtAGlance />
      <DistrictAndQuickInfo />
      <AnnouncementsAndContact />
    </>
  );
}