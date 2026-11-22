import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import useApi from "../hooks/useApi.js";
import PageHero from "../components/PageHero.jsx";
import SchemeCard from "../components/SchemeCard.jsx";
import CategoryFilter, { CATS } from "../components/CategoryFilter.jsx";
import { CardSkeletons, EmptyState, ErrorState } from "../components/States.jsx";

const S = {
  en: { lead: "Every scheme run by the department. Search by need, or pick a topic.", forLabel: "Showing schemes for", clearFor: "Show schemes for everyone", count: "{n} schemes found." },
  ta: { lead: "துறையின் அனைத்துத் திட்டங்களும். தேவைக்கேற்பத் தேடுங்கள், அல்லது ஒரு தலைப்பைத் தேர்ந்தெடுங்கள்.", forLabel: "இவர்களுக்கான திட்டங்கள்", clearFor: "அனைவருக்குமான திட்டங்களைக் காட்டு", count: "{n} திட்டங்கள் கிடைத்தன." },
};
const AUDIENCE = { person: "forPerson", parent: "forParent", institution: "forInstitution" };

export default function Schemes() {
  const { t } = useLang();
  const s = useStrings(S);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const cat = CATS.includes(params.get("category")) ? params.get("category") : "all";
  const audience = AUDIENCE[params.get("for")] ? params.get("for") : "";
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);

  const { data, loading, error, reload } = useApi("/schemes", { q: q || undefined, category: cat === "all" ? undefined : cat, audience: audience || undefined });

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHero title={audience ? t(`schemes.${AUDIENCE[audience]}`) : t("nav.schemes")} lead={s.lead} crumbs={audience ? [["/schemes", t("nav.schemes")]] : []} />
      <section className="section">
        <div className="container">
          <form role="search" onSubmit={(e) => { e.preventDefault(); update({ q: input.trim() }); }} style={{ marginBottom: 20 }}>
            <label className="search-label" htmlFor="scheme-search">{t("schemes.searchLabel")}</label>
            <div className="search-row" style={{ maxWidth: 620 }}>
              <input id="scheme-search" type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("hero.placeholder")} autoComplete="off" />
              <button type="submit" className="btn btn-primary"><Search aria-hidden="true" /> {t("common.search")}</button>
            </div>
          </form>

          {audience && (
            <p className="notice notice-info" style={{ marginBottom: 18, alignItems: "center" }}>
              <span>{s.forLabel}: <strong>{t(`schemes.${AUDIENCE[audience]}`)}</strong></span>
              <button type="button" className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => update({ for: "" })}>{s.clearFor}</button>
            </p>
          )}

          <CategoryFilter value={cat} onChange={(c) => update({ category: c === "all" ? "" : c })} />

          <div aria-live="polite">
            {q && (
              <p className="result-count">
                {t("schemes.resultsFor", { q })}{data ? ` — ${s.count.replace("{n}", data.schemes.length)}` : ""}{" "}
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ q: "" })}><X aria-hidden="true" /> {t("schemes.clearSearch")}</button>
              </p>
            )}
            {!q && data && <p className="result-count">{t("common.showing", { n: data.schemes.length, total: data.total })}</p>}
          </div>

          {loading && <CardSkeletons n={8} h={168} />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && (data.schemes.length ? (
            <ul className="grid-4" style={{ listStyle: "none" }}>
              {data.schemes.map((sc) => <li key={sc.slug} style={{ display: "grid" }}><SchemeCard scheme={sc} headingLevel={2} /></li>)}
            </ul>
          ) : (
            <EmptyState title={t("schemes.noResults")} action={<Link className="btn btn-outline" to="/schemes">{t("schemes.showAll")}</Link>}>
              {t("schemes.noResultsSub")}
            </EmptyState>
          ))}
        </div>
      </section>
    </>
  );
}
