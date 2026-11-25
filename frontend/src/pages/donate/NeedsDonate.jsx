import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useLang, useStrings } from "../../context/LanguageContext.jsx";
import useApi from "../../hooks/useApi.js";
import { CardSkeletons, EmptyState, ErrorState, Notice } from "../../components/States.jsx";
import { D, CATS, money } from "./strings.js";
import { DonateHeader, DonateButton, DonorDialog, ConsentBox } from "./parts.jsx";
import { Filters } from "./InstitutionsDonate.jsx";

const inr = (n, lang) => new Intl.NumberFormat(lang === "ta" ? "ta-IN" : "en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(n || 0);

// Donate to a specific need — Cash / Kind mode, filters, needs table with Select boxes and total.
export default function NeedsDonate() {
  const s = useStrings(D);
  const { lang, tx, t } = useLang();
  const [mode, setMode] = useState("cash");
  const [district, setDistrict] = useState("");
  const [institution, setInstitution] = useState("");
  const [disability, setDisability] = useState("");
  const [rows, setRows] = useState({}); // id -> { qty, value, selected }
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const { data, loading, error, reload } = useApi("/donate/needs", { district: district || undefined, institution: institution || undefined, disability: disability || undefined });
  const needs = data?.needs || [];
  const C = CATS[lang] || CATS.en;

  useEffect(() => { // new needs get default quantity 1 and the official cost
    if (!data) return;
    setRows((cur) => { const next = { ...cur }; needs.forEach((n) => { if (!next[n._id]) next[n._id] = { qty: 1, value: n.unitCost, selected: false }; }); return next; });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const row = (n) => rows[n._id] || { qty: 1, value: n.unitCost, selected: false };
  const setRow = (id, patch) => { setRows((cur) => ({ ...cur, [id]: { ...cur[id], ...patch } })); setErr(""); };
  const unit = (n) => (mode === "kind" ? Number(row(n).value) || 0 : n.unitCost);
  const selected = needs.filter((n) => row(n).selected);
  const total = useMemo(() => selected.reduce((sum, n) => sum + row(n).qty * unit(n), 0), [selected, rows, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = () => {
    if (!selected.length) { setErr(s.selectRows); return; }
    if (!consent) { document.getElementById("need-consent")?.focus(); return; }
    setOpen(true);
  };

  return (
    <>
      <DonateHeader title={s.need} />
      <section className="don-mode">
        <div className="container">
          <h2>{s.chooseMode}</h2>
          <div className="mode-toggle" role="radiogroup" aria-label={s.chooseMode}>
            {["cash", "kind"].map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? "is-on" : ""} onClick={() => setMode(m)}>{s[m]}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="don-band don-band-table">
        <div className="container">
          <Filters prefix="need" district={district} setDistrict={setDistrict} institution={institution} setInstitution={setInstitution} disability={disability} setDisability={setDisability} />
        </div>
      </section>
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          {loading && <CardSkeletons n={1} h={320} className="grid-2" />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && (needs.length ? (
            <div className="table-wrap need-table-wrap">
              <table className="data need-table">
                <caption className="sr-only">{s.need} — {s[mode]}</caption>
                <thead><tr>
                  <th scope="col">{s.colDistrict}</th><th scope="col">{s.colSchool}</th><th scope="col">{s.colDisability}</th><th scope="col">{s.colCategory}</th>
                  <th scope="col">{s.colSub}</th><th scope="col">{s.colQty}</th><th scope="col">{s.colReq}</th><th scope="col">{s.colAmount}</th>
                  <th scope="col">{s.colTotal}</th><th scope="col">{s.colSelect}</th>
                </tr></thead>
                <tbody>
                  {needs.map((n) => {
                    const r = row(n); const name = tx(n.title); const max = n.quantityRemaining;
                    return (
                      <tr key={n._id} className={r.selected ? "is-selected" : undefined}>
                        <td>{n.district}</td>
                        <td>{n.institution?.name}</td>
                        <td>{n.disability || <span className="sr-only">—</span>}</td>
                        <td>{C[n.category] || n.category}</td>
                        <th scope="row">{name}</th>
                        <td>
                          <div className="stepper stepper-dark" role="group" aria-label={`${s.colQty}: ${name}`}>
                            <button type="button" onClick={() => setRow(n._id, { qty: Math.max(1, r.qty - 1) })} disabled={r.qty <= 1} aria-label={`− ${name}`}><Minus aria-hidden="true" /></button>
                            <input value={r.qty} inputMode="numeric" aria-label={`${s.colQty}: ${name}`} onChange={(e) => setRow(n._id, { qty: Math.max(1, Math.min(max, Number(e.target.value.replace(/\D/g, "")) || 1)) })} />
                            <button type="button" onClick={() => setRow(n._id, { qty: Math.min(max, r.qty + 1) })} disabled={r.qty >= max} aria-label={`+ ${name}`}><Plus aria-hidden="true" /></button>
                          </div>
                        </td>
                        <td className="num">{max}</td>
                        <td className="num">
                          {mode === "kind" ? (
                            <input className="inr-input" inputMode="numeric" aria-label={`${s.value}: ${name}`} value={`INR ${new Intl.NumberFormat("en-IN").format(r.value || 0)}.00`}
                              onChange={(e) => setRow(n._id, { value: Math.min(10000000, Number(e.target.value.replace(/^INR\s*/, "").replace(/\.00$/, "").replace(/\D/g, "")) || 0) })} />
                          ) : new Intl.NumberFormat("en-IN").format(n.unitCost)}
                        </td>
                        <td className="num">{new Intl.NumberFormat("en-IN").format(r.qty * unit(n))}</td>
                        <td className="select-cell"><input type="checkbox" checked={r.selected} onChange={(e) => setRow(n._id, { selected: e.target.checked })} aria-label={`${s.colSelect}: ${name}`} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : <EmptyState title={s.noRows} />)}

          {data && needs.length > 0 && (
            <>
              <div className="total-row" aria-live="polite">
                <span>{s.totalContribution}</span>
                <output className="total-box">{new Intl.NumberFormat("en-IN").format(total)}</output>
              </div>
              {err && <p className="field-error" role="alert" style={{ justifyContent: "flex-end", marginTop: 8 }}>{err}</p>}
              <div className="need-consent"><ConsentBox id="need-consent" checked={consent} onChange={setConsent} /></div>
              <DonateButton onClick={go} disabled={!consent} />
              <p className="sr-only" aria-live="polite">{selected.length} selected, {inr(total, lang)}</p>
            </>
          )}
        </div>
      </section>
      <DonorDialog open={open} onClose={() => setOpen(false)} amount={mode === "cash" ? total : 0}
        build={() => ({ type: "need", mode, items: selected.map((n) => ({ need: n._id, quantity: row(n).qty, unitValue: unit(n) })) })} />
    </>
  );
}

export { money };