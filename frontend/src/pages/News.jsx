import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import { fmtDate } from "../hooks/format.js";
import PageHero from "../components/PageHero.jsx";
import { EmptyState, ErrorState, Skeleton } from "../components/States.jsx";

const S = {
  en: { lead: "Last dates, medical camps, award nominations and other notices from the department.", prev: "Newer", next: "Older", page: "Page {p} of {n}" },
  ta: { lead: "கடைசி தேதிகள், மருத்துவ முகாம்கள், விருதுப் பரிந்துரைகள் மற்றும் துறையின் பிற அறிவிப்புகள்.", prev: "புதியவை", next: "பழையவை", page: "{n} இல் பக்கம் {p}" },
};

export default function News() {
  const { t, tx, lang } = useLang();
  const s = useStrings(S);
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi("/news", { page, limit: 10 });

  return (
    <>
      <PageHero title={t("news.title")} lead={s.lead} />
      <section className="section">
        <div className="container" style={{ maxWidth: 880, marginLeft: "auto", marginRight: "auto" }}>
          {loading && <div style={{ display: "grid", gap: 14 }}>{[1, 2, 3].map((i) => <Skeleton key={i} h={60} />)}</div>}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && (data.news.length ? (
            <>
              <ul className="card panel news-list">
                {data.news.map((n) => (
                  <li key={n.slug} className="news-item" style={{ gridTemplateColumns: "100px minmax(0,1fr)" }}>
                    <time dateTime={n.date}>{fmtDate(n.date, lang)}</time>
                    <div>
                      <h2 style={{ fontSize: "1rem", fontFamily: "var(--font-body)" }}><Link to={`/news/${n.slug}`}>{tx(n.title)}</Link>
                        {n.isSample && <span className="tag tag-sample" style={{ marginLeft: 8 }}>{t("common.sample")}</span>}</h2>
                      {tx(n.summary) && <p className="news-sum">{tx(n.summary)}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              {data.pages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{s.prev}</button>
                  <span>{s.page.replace("{p}", page).replace("{n}", data.pages)}</span>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>{s.next}</button>
                </nav>
              )}
            </>
          ) : <EmptyState title={t("news.empty")} />)}
        </div>
      </section>
    </>
  );
}
