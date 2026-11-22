import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

// Inner-page heading with breadcrumb. The h1 receives focus on navigation (see RouteFocus).
export default function PageHero({ title, lead, crumbs = [] }) {
  const { t } = useLang();
  useDocumentTitle(title);
  return (
    <div className="page-hero">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">{t("common.home")}</Link></li>
            {crumbs.map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        <h1 tabIndex={-1} data-page-heading>{title}</h1>
        {lead && <p>{lead}</p>}
      </div>
    </div>
  );
}
