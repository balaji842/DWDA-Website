import { Link, useParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import { fmtDate } from "../hooks/format.js";
import PageHero from "../components/PageHero.jsx";
import { ErrorState, Notice, Skeleton } from "../components/States.jsx";
import NotFound from "./NotFound.jsx";

export default function NewsDetail() {
  const { slug } = useParams();
  const { t, tx, lang } = useLang();
  const { data, loading, error, reload } = useApi(`/news/${encodeURIComponent(slug)}`);
  if (error?.response?.status === 404) return <NotFound />;
  const n = data?.news;
  return (
    <>
      {n ? <PageHero title={tx(n.title)} crumbs={[["/news", t("nav.news")]]} />
        : <div className="page-hero"><div className="container"><Skeleton h={30} w="60%" /></div></div>}
      <section className="section">
        <div className="container prose">
          {loading && <Skeleton h={80} />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {n && (
            <>
              <p className="muted">{t("news.published")}: <time dateTime={n.date}>{fmtDate(n.date, lang)}</time></p>
              {(tx(n.body) || tx(n.summary)).split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              <p style={{ marginTop: 24 }}><Link className="link-arrow" to="/news">{t("common.allNews")}</Link></p>
            </>
          )}
        </div>
      </section>
    </>
  );
}