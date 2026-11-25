import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, Printer } from "lucide-react";
import api from "../../services/api.js";
import { useLang, useStrings } from "../../context/LanguageContext.jsx";
import { Emblem } from "../../components/SiteHeader.jsx";
import PageHero from "../../components/PageHero.jsx";
import { ErrorState, Notice, Skeleton } from "../../components/States.jsx";
import { fmtDateTime } from "../../hooks/format.js";
import { D, PURPOSES, money, fill } from "./strings.js";

export default function Receipt() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const s = useStrings(D);
  const { lang, tx, t } = useLang();
  const [don, setDon] = useState(null);
  const [error, setError] = useState(null);
  const load = () => api.get(`/donate/${id}`, { params: { token } }).then((r) => setDon(r.data.donation)).catch(setError);
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const to = !don ? "" : don.type === "quick" ? `${(PURPOSES[lang] || PURPOSES.en)[don.purpose] || s.generalFund}${don.district ? ` — ${fill(s.forDistrict, { d: don.district })}` : ""}`
    : don.type === "institution" ? don.institutionName : s.items;
  return (
    <>
      <PageHero title={don?.status === "pledged" ? s.pledgeThanks : s.thanks} crumbs={[["/donate", s.crumb]]} />
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          {error && (error.response?.status === 404 ? <Notice kind="error">{s.notFound}</Notice> : <ErrorState error={error} onRetry={load} />)}
          {!don && !error && <Skeleton h={360} />}
          {don && !["paid", "pledged"].includes(don.status) && <Notice kind="warn">{s.payFailed} <Link to={`/donate/pay/${id}?token=${token}`}>{s.payTitle}</Link></Notice>}
          {don && ["paid", "pledged"].includes(don.status) && (
            <>
              <article className="card receipt" aria-labelledby="rcpt-title">
                {don.status === "paid" && don.payment?.mode === "test" && <p className="receipt-test" role="note">{s.testReceipt}</p>}
                {don.status === "pledged" && <p className="notice notice-info" role="note" style={{ marginBottom: 16 }}>{s.pledgeNote}</p>}
                <header className="receipt-head">
                  <Emblem />
                  <div><small>{t("common.govt")}</small><strong>{t("common.deptName")}</strong></div>
                  <span className="tick" aria-hidden="true"><Check /></span>
                </header>
                <h2 id="rcpt-title">{don.status === "pledged" ? s.pledgeReceipt : s.receiptTitle}</h2>
                <dl className="dl-grid receipt-grid">
                  <dt>{s.receiptNo}</dt><dd><strong>{don.receiptNo}</strong></dd>
                  <dt>{s.date}</dt><dd>{fmtDateTime(don.payment.paidAt || don.createdAt, lang)}</dd>
                  <dt>{s.paidBy}</dt><dd>{don.donor.organisation ? `${don.donor.organisation} (${don.donor.name})` : don.donor.name}{don.donor.pan ? ` · PAN ${don.donor.pan}` : ""}</dd>
                  {don.donor.address && <><dt>{s.address}</dt><dd>{[don.donor.address, don.donor.city, don.donor.pincode].filter(Boolean).join(", ")}</dd></>}
                  <dt>{s.donatedTo}</dt><dd>{to}</dd>
                  {don.status === "pledged" ? <><dt>{s.status}</dt><dd>{s.pledged}</dd></> : <><dt>{s.paymentRef}</dt><dd>{don.payment.reference} · {s[don.payment.method] || don.payment.method}</dd></>}
                </dl>
                {don.items?.length > 0 && (
                  <div className="table-wrap" style={{ marginTop: 16 }}>
                    <table className="data"><caption className="sr-only">{s.items}</caption>
                      <thead><tr><th scope="col">{s.items}</th><th scope="col">{s.institution}</th><th scope="col">{s.qty}</th><th scope="col" style={{ textAlign: "right" }}>{s.amount}</th></tr></thead>
                      <tbody>{don.items.map((i, n) => <tr key={n}><td>{tx(i.title)}</td><td>{i.institutionName}</td><td>{i.quantity} × {money(i.unitValue || i.unitCost, lang)}</td><td style={{ textAlign: "right" }}>{money(i.amount, lang)}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
                <p className="receipt-total"><span>{s.total}</span><strong>{money(don.amount, lang)}</strong></p>
              </article>
              <div className="pay-actions no-print">
                <button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer aria-hidden="true" /> {s.print}</button>
                <Link className="btn btn-outline" to="/donate">{s.again}</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}