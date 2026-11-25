import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileStack, ListChecks, Newspaper, MapPin, FileText, Building2, Settings, Users, LogOut, Menu, ExternalLink, HandHeart, ShoppingBasket } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

const LINKS = [
  ["/admin", LayoutDashboard, "Overview", null, true],
  ["/admin/applications", FileStack, "Applications"],
  ["/admin/donations", HandHeart, "Donations"],
  ["/admin/needs", ShoppingBasket, "Needs (donations)"],
  ["/admin/schemes", ListChecks, "Schemes"],
  ["/admin/news", Newspaper, "News & announcements"],
  ["/admin/districts", MapPin, "District offices"],
  ["/admin/documents", FileText, "Acts & documents", "superadmin"],
  ["/admin/institutions", Building2, "Institutions"],
  ["/admin/settings", Settings, "Site settings", "superadmin"],
  ["/admin/users", Users, "Admin users", "superadmin"],
];

export default function AdminLayout() {
  const { admin, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useDocumentTitle("Admin");
  useEffect(() => setOpen(false), [pathname]);

  if (!ready) return <p className="container" style={{ padding: 40 }} role="status">Loading…</p>;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: pathname }} />;

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">Skip to main content</a>
      <aside className={`admin-side on-dark${open ? " open" : ""}`} aria-label="Admin">
        <div className="brand-mini">Differently Abled Welfare<small>Admin dashboard</small></div>
        <nav aria-label="Admin sections">
          <ul className="admin-nav">
            {LINKS.filter(([, , , role]) => !role || admin.role === role).map(([to, Icon, label, , end]) => (
              <li key={to}><NavLink to={to} end={end}><Icon aria-hidden="true" />{label}</NavLink></li>
            ))}
            <li style={{ marginTop: 14 }}><a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" />View public site<span className="sr-only"> (opens in a new tab)</span></a></li>
          </ul>
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-top">
          <button type="button" className="icon-btn admin-menu-btn" aria-label="Open admin menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}><Menu aria-hidden="true" /></button>
          <span />
          <div className="admin-user">
            <span>{(() => {
              const role = admin.role === "superadmin" ? "Super Admin" : `District Admin, ${admin.district}`;
              return admin.name === role ? <strong style={{ color: "var(--text)" }}>{role}</strong> : <><strong style={{ color: "var(--text)" }}>{admin.name}</strong> · {role}</>;
            })()}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}><LogOut aria-hidden="true" /> Sign out</button>
          </div>
        </div>
        <main id="admin-main" tabIndex={-1}><Outlet /></main>
      </div>
      {open && <div className="modal-backdrop" style={{ zIndex: 800 }} onClick={() => setOpen(false)} aria-hidden="true" />}
    </div>
  );
}