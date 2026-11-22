import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";

export default function SchemeCard({ scheme, headingLevel = 3 }) {
  const { t, tx } = useLang();
  const H = `h${headingLevel}`;
  const title = tx(scheme.title);
  return (
    <article className="card scheme-card">
      <span className="tag">{t(`cat.${scheme.category}`)}</span>
      <H><Link to={`/schemes/${scheme.slug}`}>{title}</Link></H>
      <p>{tx(scheme.summary)}</p>
      <div className="card-actions">
        <Link className="link-arrow" to={`/schemes/${scheme.slug}#who-can-apply`} aria-label={`${t("common.whoCanApply")}: ${title}`}>
          {t("common.whoCanApply")} <ArrowRight aria-hidden="true" />
        </Link>
        <Link className="view-link" to={`/schemes/${scheme.slug}`} aria-label={`${t("common.viewDetails")}: ${title}`}>{t("common.viewDetails")}</Link>
      </div>
    </article>
  );
}
