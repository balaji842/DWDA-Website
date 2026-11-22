import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Circle, X, AlertTriangle, Search } from "lucide-react";
import api, { errorInfo } from "../services/api.js";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import { fmtDate, fmtDateTime } from "../hooks/format.js";
import PageHero from "../components/PageHero.jsx";
import FormField from "../components/FormField.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { Notice } from "../components/States.jsx";
import { STATUS_LABEL, HAPPY_PATH } from "../components/status.js";

const S = {
  en: {
    title: "Track my application", lead: "Enter your reference number and the mobile number you gave when you applied. For your privacy, both are needed.",
    ref: "Application reference number", refHint: "It looks like TNDA-2026-7K3F9Q. It is in the SMS and on the screen after you applied.",
    mobile: "Registered mobile number", mobileHint: "The 10-digit number you gave on the form.",
    check: "Check status", checking: "Checking…",
    req: "This field is required.", refErr: "Enter the reference number as shown, like TNDA-2026-7K3F9Q.", mobileErr: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.",
    result: "Application status", appNo: "Application number", name: "Applicant", scheme: "Scheme", submitted: "Submitted on", district: "District", current: "Current status",
    progress: "Progress", history: "History", step: "Step {n} of {total}",
    rejectedNote: "This application was not approved. The reason is shown below. Your district office can explain the next steps.",
    docsNote: "The office needs more documents from you. Read the note below, then take or send them to your district office.",
    noApp: "Don't have a reference number?", apply: "Apply for a scheme", office: "Contact your district office",
  },
  ta: {
    title: "என் விண்ணப்ப நிலை", lead: "குறிப்பு எண்ணையும், விண்ணப்பிக்கும்போது கொடுத்த கைபேசி எண்ணையும் உள்ளிடவும். உங்கள் தனியுரிமைக்காக இரண்டும் தேவை.",
    ref: "விண்ணப்பக் குறிப்பு எண்", refHint: "எ.கா. TNDA-2026-7K3F9Q. இது குறுஞ்செய்தியிலும், விண்ணப்பித்த பின் திரையிலும் இருக்கும்.",
    mobile: "பதிவு செய்த கைபேசி எண்", mobileHint: "படிவத்தில் கொடுத்த 10 இலக்க எண்.",
    check: "நிலையை அறிய", checking: "சரிபார்க்கப்படுகிறது…",
    req: "இது கட்டாயம்.", refErr: "குறிப்பு எண்ணைச் சரியாக உள்ளிடவும், எ.கா. TNDA-2026-7K3F9Q.", mobileErr: "6, 7, 8 அல்லது 9 இல் தொடங்கும் 10 இலக்கக் கைபேசி எண்ணை உள்ளிடவும்.",
    result: "விண்ணப்ப நிலை", appNo: "விண்ணப்ப எண்", name: "விண்ணப்பதாரர்", scheme: "திட்டம்", submitted: "சமர்ப்பித்த தேதி", district: "மாவட்டம்", current: "தற்போதைய நிலை",
    progress: "முன்னேற்றம்", history: "வரலாறு", step: "{total} இல் படி {n}",
    rejectedNote: "இந்த விண்ணப்பம் ஒப்புதல் பெறவில்லை. காரணம் கீழே உள்ளது. அடுத்த நடவடிக்கைகளை மாவட்ட அலுவலகம் விளக்கும்.",
    docsNote: "அலுவலகத்திற்கு உங்களிடமிருந்து கூடுதல் ஆவணங்கள் தேவை. கீழே உள்ள குறிப்பைப் படித்து, அவற்றை மாவட்ட அலுவலகத்திற்கு அளிக்கவும்.",
    noApp: "குறிப்பு எண் இல்லையா?", apply: "திட்டத்திற்கு விண்ணப்பிக்க", office: "மாவட்ட அலுவலகத்தைத் தொடர்பு கொள்ள",
  },
};

function Progress({ result, s, lang }) {
  const labels = STATUS_LABEL[lang];
  const reached = new Set(result.history.map((h) => h.status));
  const rejected = result.status === "rejected";
  // The usual path, with "Documents required" or "Rejected" shown where they happened.
  const steps = [...HAPPY_PATH];
  if (reached.has("documents-required")) {
    // If the office went back to verifying after asking for documents, the
    // documents step sits before "Under verification"; otherwise after it.
    const order = result.history.map((h) => h.status);
    const backToVerify = order.lastIndexOf("under-verification") > order.lastIndexOf("documents-required");
    steps.splice(backToVerify ? 1 : 2, 0, "documents-required");
  }
  if (rejected) steps.splice(steps.indexOf("approved"), 2, "rejected");
  const currentIdx = steps.lastIndexOf(result.status);
  const pct = Math.round(((currentIdx + 1) / steps.length) * 100);

  return (
    <>
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={currentIdx + 1}
        aria-valuetext={`${s.step.replace("{n}", currentIdx + 1).replace("{total}", steps.length)}: ${labels[result.status]}`}>
        <span style={{ width: `${pct}%`, background: rejected ? "var(--danger)" : undefined }} />
      </div>
      <p className="hint">{s.step.replace("{n}", currentIdx + 1).replace("{total}", steps.length)}</p>
      <ol className="timeline" aria-label={s.progress} style={{ marginTop: 16 }}>
        {steps.map((st, i) => {
          const isCurrent = i === currentIdx;
          // A step counts as done only if the application really passed through it.
          const done = (i < currentIdx && reached.has(st)) || (isCurrent && st === "completed");
          const cls = st === "rejected" ? "bad" : st === "documents-required" && isCurrent ? "warn" : done ? "done" : isCurrent ? "current" : "";
          const entry = [...result.history].reverse().find((h) => h.status === st);
          const Icon = st === "rejected" ? X : st === "documents-required" && isCurrent ? AlertTriangle : done ? Check : Circle;
          return (
            <li key={st} className={`tl-item ${cls}`} aria-current={isCurrent ? "step" : undefined}>
              <span className="tl-dot" aria-hidden="true"><Icon /></span>
              <div className="tl-body">
                <strong>{labels[st]}{isCurrent && <span className="sr-only"> (current)</span>}</strong>
                {entry && <span className="when">{fmtDateTime(entry.at, lang)}</span>}
                {entry?.remark && <p className="remark">{entry.remark}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export default function Track() {
  const { t, tx, lang } = useLang();
  const s = useStrings(S);
  const [params] = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") || "");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const msgRef = useRef(null);

  useEffect(() => { if (result) resultRef.current?.focus(); }, [result]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    const r = ref.trim().toUpperCase();
    if (!r) errs.ref = s.req; else if (!/^TNDA-\d{4}-[A-Z0-9]{6}$/.test(r)) errs.ref = s.refErr;
    if (!mobile) errs.mobile = s.req; else if (!/^[6-9]\d{9}$/.test(mobile)) errs.mobile = s.mobileErr;
    setErrors(errs);
    setMessage("");
    if (Object.keys(errs).length) { document.getElementById(errs.ref ? "track-ref" : "track-mobile")?.focus(); return; }
    setBusy(true);
    setResult(null);
    try {
      const { data } = await api.post("/tracking", { referenceNo: r, mobile });
      setResult(data);
    } catch (err) {
      setMessage(errorInfo(err).message);
      window.setTimeout(() => msgRef.current?.focus(), 0);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero title={s.title} lead={s.lead} crumbs={[["/apply", t("nav.apply")]]} />
      <section className="section">
        <div className="container layout-side">
          <div style={{ display: "grid", gap: 24 }}>
            <form className="card form-card" onSubmit={submit} noValidate>
              <div className="form-grid">
                <FormField id="track-ref" label={s.ref} hint={s.refHint} required error={errors.ref}>
                  <input value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} autoComplete="off" spellCheck={false} style={{ textTransform: "uppercase" }} />
                </FormField>
                <FormField id="track-mobile" label={s.mobile} hint={s.mobileHint} required error={errors.mobile}>
                  <input type="tel" inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} autoComplete="tel-national" />
                </FormField>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }} disabled={busy}><Search aria-hidden="true" /> {busy ? s.checking : s.check}</button>
              {message && <div ref={msgRef} tabIndex={-1} style={{ marginTop: 16 }}><Notice kind="error">{message}</Notice></div>}
            </form>

            {result && (
              <section className="card form-card" aria-labelledby="result-title" ref={resultRef} tabIndex={-1}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                  <h2 id="result-title" style={{ fontSize: "1.25rem" }}>{s.result}</h2>
                  <StatusBadge status={result.status} />
                </div>
                <dl className="dl-grid" style={{ gridTemplateColumns: "150px minmax(0,1fr)", marginBottom: 20 }}>
                  <dt>{s.appNo}</dt><dd><strong>{result.referenceNo}</strong></dd>
                  <dt>{s.name}</dt><dd>{result.applicantName}</dd>
                  <dt>{s.scheme}</dt><dd>{result.scheme ? <Link to={`/schemes/${result.scheme.slug}`}>{tx(result.scheme.title)}</Link> : "—"}</dd>
                  <dt>{s.district}</dt><dd>{result.district}</dd>
                  <dt>{s.submitted}</dt><dd>{fmtDate(result.submittedAt, lang)}</dd>
                </dl>
                {result.status === "rejected" && <div style={{ marginBottom: 16 }}><Notice kind="error">{s.rejectedNote}</Notice></div>}
                {result.status === "documents-required" && <div style={{ marginBottom: 16 }}><Notice kind="warn">{s.docsNote}</Notice></div>}
                <h3 style={{ fontSize: "1.05rem" }}>{s.progress}</h3>
                <Progress result={result} s={s} lang={lang} />
              </section>
            )}
          </div>

          <aside className="card card-pad" style={{ display: "grid", gap: 10 }}>
            <h2 style={{ fontSize: "1.05rem" }}>{s.noApp}</h2>
            <Link className="link-arrow" to="/apply">{s.apply}</Link>
            <Link className="link-arrow" to="/district-offices">{s.office}</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
