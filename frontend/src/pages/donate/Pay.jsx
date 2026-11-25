import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Smartphone, CreditCard, Landmark, CheckCircle2, XCircle, FlaskConical } from "lucide-react";
import api, { errorInfo } from "../../services/api.js";
import { useLang, useStrings } from "../../context/LanguageContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import PageHero from "../../components/PageHero.jsx";
import { ErrorState, Notice, Skeleton } from "../../components/States.jsx";
import { D, money } from "./strings.js";

// TEST PAYMENT PAGE. When the gateway is connected, "Pay" will redirect to the gateway
// and its callback will mark the donation paid on the server instead of these buttons.
export default function Pay() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const s = useStrings(D);
  const { lang } = useLang();
  const toast = useToast();
  const navigate = useNavigate();
  const [don, setDon] = useState(null);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [methodErr, setMethodErr] = useState("");

  const load = () => api.get(`/donate/${id}`, { params: { token } }).then((r) => { setDon(r.data.donation); if (["paid", "pledged"].includes(r.data.donation.status)) navigate(`/donate/receipt/${id}?token=${token}`, { replace: true }); }).catch(setError);
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const pay = async (outcome) => {
    if (!method) { setMethodErr(s.chooseMethod); document.getElementById("pm-upi")?.focus(); return; }
    setBusy(true); setFailed(false);
    try {
      const { data } = await api.post(`/donate/${id}/test-pay`, { token, method, outcome });
      if (data.donation.status === "paid") navigate(`/donate/receipt/${id}?token=${token}`);
      else { setFailed(true); setDon(data.donation); }
    } catch (err) { toast.error(errorInfo(err).message); } finally { setBusy(false); }
  };

  const methods = [["upi", Smartphone, s.upi], ["card", CreditCard, s.card], ["netbanking", Landmark, s.netbanking]];
  return (
    <>
      <PageHero title={s.payTitle} crumbs={[["/donate", s.crumb]]} />
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          {error && (error.response?.status === 404 ? <Notice kind="error">{s.notFound}</Notice> : <ErrorState error={error} onRetry={load} />)}
          {!don && !error && <Skeleton h={300} />}
          {don && (
            <div className="card form-card">
              <div className="test-banner" role="note"><FlaskConical aria-hidden="true" /> {s.testMode}</div>
              <dl className="dl-grid pay-summary">
                <dt>{s.receiptNo}</dt><dd><strong>{don.receiptNo}</strong></dd>
                <dt>{s.paidBy}</dt><dd>{don.donor.organisation || don.donor.name}</dd>
                <dt>{s.amount}</dt><dd className="big-amount">{money(don.amount, lang)}</dd>
              </dl>
              {failed && <div style={{ margin: "16px 0" }} role="alert"><Notice kind="error" icon={XCircle}>{s.payFailed}</Notice></div>}
              <fieldset style={{ marginTop: 20 }}>
                <legend>{s.method}</legend>
                <div className="pay-methods" role="radiogroup" aria-describedby={methodErr ? "pm-err" : undefined}>
                  {methods.map(([k, Icon, label]) => (
                    <label key={k} className={`pay-method${method === k ? " is-on" : ""}`}>
                      <input type="radio" id={`pm-${k}`} name="method" value={k} checked={method === k} onChange={() => { setMethod(k); setMethodErr(""); }} />
                      <Icon aria-hidden="true" /> {label}
                    </label>
                  ))}
                </div>
                {methodErr && <span id="pm-err" className="field-error" style={{ marginTop: 8 }}>{methodErr}</span>}
                <p className="hint" style={{ marginTop: 10 }}>{s.gatewayNote}</p>
              </fieldset>
              <div className="pay-actions">
                <button type="button" className="btn btn-primary btn-lg" disabled={busy} onClick={() => pay("success")}><CheckCircle2 aria-hidden="true" /> {s.simOk} · {money(don.amount, lang)}</button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => pay("failure")}><XCircle aria-hidden="true" /> {s.simFail}</button>
              </div>
            </div>
          )}
          <p style={{ marginTop: 16 }}><Link to="/donate" className="link-arrow">{s.crumb}</Link></p>
        </div>
      </section>
    </>
  );
}