import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { DISABILITIES } from "../data/disabilities.js";

// Menu structure. Items with `children` open as disclosure menus (button + list),
// which work with keyboard and screen readers.
export const MENU = [
  { to: "/", key: "home" },
  { key: "about", children: [["/about", "nav.history"], ["/acts-policies", "nav.acts"], ["/rti", "nav.rti"]] },
  { key: "schemesMenu", children: [["/schemes", "nav.allSchemes"], ["/apply", "nav.applyOnline"], ["/track", "nav.trackApp"]] },
  { key: "disabilities", children: [["/disabilities", "nav.disOverview"], ...DISABILITIES.map((d) => [`/disabilities/${d.slug}`, d.short])] },
  { key: "services", children: [["/id-card", "nav.idcard"], ["/institutions", "nav.institutions"]] },
  { to: "/district-offices", key: "districts" },
  { to: "/news", key: "news" },
  { to: "/contact", key: "contact" },
];

// Flat list for the sitemap.
export const NAV = [["/", "home"], ["/schemes", "schemes"], ["/disabilities", "disabilities"], ["/apply", "apply"], ["/id-card", "idcard"], ["/institutions", "institutions"],
  ["/district-offices", "districts"], ["/acts-policies", "acts"], ["/news", "news"], ["/contact", "contact"]];

export default function MainNav() {
  const { t, tx } = useLang();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);   // mobile panel
  const [sub, setSub] = useState(null);      // open submenu key
  const ref = useRef(null);

  useEffect(() => { setOpen(false); setSub(null); }, [pathname]);
  useEffect(() => {
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setSub(null); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const label = (l) => (typeof l === "string" ? t(l) : tx(l));
  const isIn = (item) => item.children?.some(([to]) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`)));

  return (
    <nav className="main-nav" aria-label={t("nav.label")} ref={ref}
      onKeyDown={(e) => { if (e.key === "Escape" && sub) { const k = sub; setSub(null); ref.current?.querySelector(`[data-sub="${k}"]`)?.focus(); } }}>
      <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((o) => !o)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />} {open ? t("common.close") : t("common.menu")}
      </button>
      <div id="primary-nav" className={`nav-panel${open ? " open" : ""}`}>
        <ul className="nav-list">
          {MENU.map((item) => (
            <li key={item.key}>
              {item.children ? (
                <>
                  <button type="button" className={`nav-trigger${isIn(item) ? " active" : ""}`} data-sub={item.key}
                    aria-expanded={sub === item.key} aria-controls={`sub-${item.key}`} onClick={() => setSub((s) => (s === item.key ? null : item.key))}>
                    {t(`nav.${item.key}`)} <ChevronDown aria-hidden="true" />
                  </button>
                  {sub === item.key && (
                    <ul className="submenu" id={`sub-${item.key}`}>
                      {item.children.map(([to, l]) => (
                        <li key={to}><NavLink to={to} end className={({ isActive }) => (isActive ? "active" : undefined)}>{label(l)}</NavLink></li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={item.to} end={item.to === "/"} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>{t(`nav.${item.key}`)}</NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}