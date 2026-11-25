import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import api, { errorInfo } from "../../services/api.js";
import { useStrings } from "../../context/LanguageContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import FormField from "../../components/FormField.jsx";
import { D, money } from "./strings.js";
import { useLang } from "../../context/LanguageContext.jsx";

const EMPTY = { name: "", organisation: "", email: "", mobile: "", pan: "", address: "", city: "", pincode: "" };

/**
 * Donor details + submit. `build()` returns the donation-specific part of the request
 * ({ type, amount, ... } or { type: "need", items }) or an errors object { errors: {...} }.
 */
export default function DonorForm({ build, amount, onCreated, skipConsent = false }) {
  const s = useStrings(D);
  const { lang } = useLang();
  const toast = useToast();
  const navigate = useNavigate();
  const [donorType, setDonorType] = useState("individual");
  const [d, setD] = useState(EMPTY);
  const [tax, setTax] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(skipConsent); // the donation page already asked for consent
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const summary = useRef(null);

  const set = (k) => (e) => { setD((x) => ({ ...x, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })); };

  const submit = async (e) => {
    e.preventDefault();
    const part = build();
    const errs = { ...(part.errors || {}) };
    if (!d.name.trim()) errs.name = s.req;
    if (!d.email.trim()) errs.email = s.req; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errs.email = "Enter a valid email address, like name@example.com.";
    if (!d.mobile) errs.mobile = s.req; else if (!/^[6-9]\d{9}$/.test(d.mobile)) errs.mobile = "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.";
    if (donorType !== "individual" && !d.organisation.trim()) errs.organisation = s.req;
    if (d.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(d.pan.toUpperCase())) errs.pan = "Enter a valid PAN, like ABCDE1234F.";
    if (tax && !d.pan) errs.pan = "PAN is needed for a tax receipt.";
    if (tax && !d.address.trim()) errs.address = "Address is needed for a tax receipt.";
    if (d.pincode && !/^[1-9]\d{5}$/.test(d.pincode)) errs.pincode = "Enter a 6-digit PIN code.";
    if (!consent) errs.consent = "Tick the box to confirm the details are correct.";
    setErrors(errs);
    if (Object.keys(errs).length) { window.setTimeout(() => summary.current?.focus(), 0); return; }
    setBusy(true);
    try {
      const { data } = await api.post("/donate", { ...part, donorType, donor: { ...d, pan: d.pan.toUpperCase() }, wantsTaxReceipt: tax, anonymous, message, consent });
      onCreated?.(data);
      // kind pledges need no payment: go straight to the acknowledgement
      navigate(data.status === "pledged" ? `/donate/receipt/${data.id}?token=${data.token}` : `/donate/pay/${data.id}?token=${data.token}`);
    } catch (err) {
      const info = errorInfo(err);
      if (Object.keys(info.fields).length) { setErrors(info.fields); window.setTimeout(() => summary.current?.focus(), 0); } else toast.error(info.message);
    } finally { setBusy(false); }
  };

  const errList = Object.entries(errors).filter(([, v]) => v);
  return (
    <form onSubmit={submit} noValidate className="donor-form">
      {errList.length > 0 && (
        <div className="error-summary" ref={summary} tabIndex={-1} role="alert">
          <h2>{s.errTitle}</h2>
          <ul>{errList.map(([k, v]) => <li key={k}><a href={`#don-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`don-${k}`)?.focus(); }}>{v}</a></li>)}</ul>
        </div>
      )}
      <fieldset>
        <legend>{s.yourDetails}</legend>
        <div className="field" style={{ marginBottom: 16 }}>
          <span className="label" id="don-type-l">{s.donorType}</span>
          <div className="radio-row" role="radiogroup" aria-labelledby="don-type-l">
            {["individual", "organisation", "csr"].map((t) => (
              <label key={t} className="choice"><input type="radio" name="donorType" value={t} checked={donorType === t} onChange={() => setDonorType(t)} />{s[t]}</label>
            ))}
          </div>
        </div>
        <div className="form-grid">
          {donorType !== "individual" && <FormField id="don-organisation" label={s.orgName} required error={errors.organisation} className="span-2"><input value={d.organisation} onChange={set("organisation")} autoComplete="organization" /></FormField>}
          <FormField id="don-name" label={s.name} required error={errors.name}><input value={d.name} onChange={set("name")} autoComplete="name" /></FormField>
          <FormField id="don-mobile" label={s.mobile} required error={errors.mobile}><input type="tel" inputMode="numeric" value={d.mobile} onChange={(e) => set("mobile")({ target: { value: e.target.value.replace(/\D/g, "").slice(0, 10) } })} autoComplete="tel-national" /></FormField>
          <FormField id="don-email" label={s.email} hint={s.emailHint} required error={errors.email}><input type="email" value={d.email} onChange={set("email")} autoComplete="email" /></FormField>
          <FormField id="don-pan" label={s.pan} hint={s.panHint} error={errors.pan}><input value={d.pan} onChange={(e) => set("pan")({ target: { value: e.target.value.toUpperCase().slice(0, 10) } })} style={{ textTransform: "uppercase" }} autoComplete="off" /></FormField>
          <label className="check span-2"><input type="checkbox" checked={tax} onChange={(e) => setTax(e.target.checked)} /> {s.taxReceipt}</label>
          <FormField id="don-address" label={s.address} error={errors.address} required={tax} className="span-2"><input value={d.address} onChange={set("address")} autoComplete="street-address" /></FormField>
          <FormField id="don-city" label={s.city}><input value={d.city} onChange={set("city")} autoComplete="address-level2" /></FormField>
          <FormField id="don-pincode" label={s.pincode} error={errors.pincode}><input inputMode="numeric" value={d.pincode} onChange={(e) => set("pincode")({ target: { value: e.target.value.replace(/\D/g, "").slice(0, 6) } })} autoComplete="postal-code" /></FormField>
          <FormField id="don-message" label={s.message} className="span-2"><textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={300} /></FormField>
          <label className="check span-2"><input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> {s.anonymous}</label>
          {!skipConsent && <div className="span-2">
            <label className="check" htmlFor="don-consent"><input type="checkbox" id="don-consent" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors((er) => ({ ...er, consent: undefined })); }} aria-invalid={errors.consent ? true : undefined} /> <span>{s.consent}<span className="req" aria-hidden="true">*</span></span></label>
            {errors.consent && <span className="field-error" style={{ marginTop: 6 }}>{errors.consent}</span>}
          </div>}
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
        <ShieldCheck aria-hidden="true" /> {busy ? s.sending : `${s.continuePay}${amount ? ` · ${money(amount, lang)}` : ""}`}
      </button>
    </form>
  );
}