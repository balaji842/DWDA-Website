import { useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Phone, Building2 } from "lucide-react";
import { useLang, useStrings } from "../../context/LanguageContext.jsx";
import useApi from "../../hooks/useApi.js";
import PageHero from "../../components/PageHero.jsx";
import { ErrorState, Skeleton } from "../../components/States.jsx";
import NotFound from "../NotFound.jsx";
import { D, money, fill } from "./strings.js";
import { AmountPicker, NeedCard, TestModeNote, BasketBar } from "./parts.jsx";
import DonorForm from "./DonorForm.jsx";
import { TYPES } from "./InstitutionsDonate.jsx";

export default function InstitutionDonate() {
  const { id } = useParams();
  const s = useStrings(D);
  const { lang, t } = useLang();
  const { data, loading, error, reload } = useApi(`/donate/institutions/${id}`);
  const [amount, setAmount] = useState("2500");
  const [err, setErr] = useState("");
  if (error?.response?.status === 404) return <NotFound />;
  const inst = data?.institution;
  const build = () => {
    const a = Number(amount);
    if (!(a >= 100)) { setErr(s.minAmount); return { errors: { amount: s.minAmount } }; }
    setErr(""); return { type: "institution", institution: id, amount: a };
  };
  return (
    <>
      {inst ? <PageHero title={inst.name} lead={`${(TYPES[lang] || TYPES.en)[inst.type]} · ${inst.district}`} crumbs={[["/donate", s.crumb], ["/donate/institutions", s.inst]]} />
        : <div className="page-hero"><div className="container"><Skeleton h={34} w="50%" /></div></div>}
      <section className="section" style={{ paddingBottom: 100 }}>
        <div className="container">
          {loading && <Skeleton h={300} />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {inst && (
            <>
              <div className="inst-facts card card-pad">
                <p><Building2 aria-hidden="true" /> {(TYPES[lang] || TYPES.en)[inst.type]}{inst.isSample && <span className="tag tag-sample" style={{ marginLeft: 8 }}>{t("common.sample")}</span>}</p>
                <p><MapPin aria-hidden="true" /> {inst.address || inst.district}</p>
                {inst.phone && <p><Phone aria-hidden="true" /> <a href={`tel:${inst.phone.replace(/[^\d+]/g, "")}`}>{inst.phone}</a></p>}
                <p><strong>{fill(s.raised, { a: money(data.raised.total, lang), n: data.raised.count })}</strong></p>
              </div>
              <div className="don-layout" style={{ marginTop: 24 }}>
                <div className="card form-card">
                  <h2 className="card-title" style={{ marginBottom: 4 }}>{s.giveAny}</h2>
                  <p className="muted" style={{ marginBottom: 16 }}>{s.giveAnySub}</p>
                  <TestModeNote />
                  <AmountPicker value={amount} onChange={(v) => { setAmount(v); setErr(""); }} error={err} id="inst-amount" />
                  <div style={{ height: 20 }} />
                  <DonorForm build={build} amount={Number(amount) >= 100 ? Number(amount) : 0} />
                </div>
                <aside className="card card-pad don-summary">
                  <h2>{s.payFor}</h2>
                  <p className="big-amount">{money(Number(amount) || 0, lang)}</p>
                  <p className="muted">{inst.name}</p>
                </aside>
              </div>
              {data.needs.length > 0 && (
                <>
                  <div className="sec-head" style={{ marginTop: 40 }}><div><h2>{s.itsNeeds}</h2></div></div>
                  <ul className="grid-3" style={{ listStyle: "none" }}>{data.needs.map((n) => <li key={n._id} style={{ display: "grid" }}><NeedCard need={n} showInstitution={false} /></li>)}</ul>
                </>
              )}
            </>
          )}
        </div>
      </section>
      <BasketBar />
    </>
  );
}