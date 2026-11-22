import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Copy, Upload, Trash2, Info } from "lucide-react";
import api, { errorInfo } from "../services/api.js";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import { useSite } from "../context/SiteContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import useApi from "../hooks/useApi.js";
import { fmtDate, fmtSize } from "../hooks/format.js";
import PageHero from "../components/PageHero.jsx";
import FormField from "../components/FormField.jsx";
import { ErrorState, Notice, Skeleton } from "../components/States.jsx";

const MAX_MB = 5;
const MAX_FILES = 5;
const TYPES = { "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

const S = {
  en: {
    title: "Apply for a scheme", lead: "Fill one form and upload your documents. It takes about 10 minutes. Fields marked * are required.",
    trackTitle: "Already applied?", trackLink: "Track your application",
    personal: "Your details", disability: "Disability details", schemeSec: "Scheme and documents", confirm: "Check and send",
    name: "Applicant's full name", nameHint: "As written on your ID card.", dob: "Date of birth", gender: "Gender",
    g: { female: "Female", male: "Male", transgender: "Transgender", "prefer-not-to-say": "Prefer not to say" },
    mobile: "Mobile number", mobileHint: "10 digits. We send status updates to this number, and you need it to track.",
    email: "Email (optional)", district: "District", choose: "Choose…", address: "Address", addressHint: "House number, street, village or town, and PIN code.",
    category: "Disability category", percent: "Disability percentage", percentHint: "As written on your disability certificate (0–100).",
    udid: "UDID / ID card number (optional)", udidHint: "If you don't have one yet, leave this empty — you can still apply.",
    scheme: "Scheme you are applying for", docs: "Supporting documents", docsHint: `PDF, JPG or PNG. Up to ${MAX_FILES} files, ${MAX_MB} MB each. You can take photos with your phone.`,
    choose_files: "Choose files", drop: "or drag and drop them here", docType: "What is this file?", remove: "Remove",
    docLabels: ["ID card / UDID card", "Disability (medical) certificate", "Proof of address", "Photograph", "Income certificate", "Other document"],
    consent: "I confirm that the details I have given are correct, and I agree to the department using them to process this application.",
    submit: "Send application", sending: "Sending…",
    errTitle: "There is a problem with your application",
    req: "This field is required.", mobileErr: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.", emailErr: "Enter a valid email address, like name@example.com.",
    pctErr: "Enter a number from 0 to 100.", dobErr: "Enter a date of birth that is not in the future.", consentErr: "Tick the box to confirm the details are correct.",
    filesErr: "Upload at least one document, such as your ID card.", typeErr: "is not a PDF, JPG or PNG file.", sizeErr: `is larger than ${MAX_MB} MB.`, countErr: `You can upload up to ${MAX_FILES} files.`,
    doneTitle: "Application sent", doneLead: "Your application has been received. Keep this reference number — you need it with your mobile number to track your application.",
    ref: "Your reference number", copy: "Copy number", copied: "Reference number copied.", for: "Scheme", on: "Sent on",
    doneTrack: "Track this application", doneAnother: "Apply for another scheme",
    offline: "This scheme does not take online applications. Apply at your district office.",
    sampleNote: "Online applications are stored securely. Only officials of your district can see your documents.",
  },
  ta: {
    title: "திட்டத்திற்கு விண்ணப்பிக்க", lead: "ஒரே படிவத்தை நிரப்பி ஆவணங்களைப் பதிவேற்றுங்கள். சுமார் 10 நிமிடங்கள் ஆகும். * குறியிட்டவை கட்டாயம்.",
    trackTitle: "ஏற்கெனவே விண்ணப்பித்துவிட்டீர்களா?", trackLink: "விண்ணப்ப நிலையை அறிய",
    personal: "உங்கள் விவரங்கள்", disability: "மாற்றுத்திறன் விவரங்கள்", schemeSec: "திட்டம் மற்றும் ஆவணங்கள்", confirm: "சரிபார்த்து அனுப்புக",
    name: "விண்ணப்பதாரரின் முழுப் பெயர்", nameHint: "அடையாள அட்டையில் உள்ளபடி.", dob: "பிறந்த தேதி", gender: "பாலினம்",
    g: { female: "பெண்", male: "ஆண்", transgender: "திருநர்", "prefer-not-to-say": "குறிப்பிட விரும்பவில்லை" },
    mobile: "கைபேசி எண்", mobileHint: "10 இலக்கங்கள். நிலை விவரங்களை இந்த எண்ணுக்கு அனுப்புவோம்; நிலை அறிய இது தேவை.",
    email: "மின்னஞ்சல் (விருப்பத்தேர்வு)", district: "மாவட்டம்", choose: "தேர்ந்தெடுக்கவும்…", address: "முகவரி", addressHint: "வீட்டு எண், தெரு, கிராமம் அல்லது நகரம், அஞ்சல் குறியீடு.",
    category: "மாற்றுத்திறன் வகை", percent: "மாற்றுத்திறன் சதவீதம்", percentHint: "உங்கள் சான்றிதழில் உள்ளபடி (0–100).",
    udid: "UDID / அடையாள அட்டை எண் (விருப்பத்தேர்வு)", udidHint: "இன்னும் இல்லையெனில் காலியாக விடலாம் — நீங்கள் விண்ணப்பிக்கலாம்.",
    scheme: "விண்ணப்பிக்கும் திட்டம்", docs: "ஆதார ஆவணங்கள்", docsHint: `PDF, JPG அல்லது PNG. அதிகபட்சம் ${MAX_FILES} கோப்புகள், ஒவ்வொன்றும் ${MAX_MB} MB.`,
    choose_files: "கோப்புகளைத் தேர்ந்தெடுக்க", drop: "அல்லது இங்கே இழுத்து விடவும்", docType: "இது என்ன கோப்பு?", remove: "நீக்கு",
    docLabels: ["அடையாள அட்டை / UDID", "மாற்றுத்திறன் (மருத்துவச்) சான்றிதழ்", "முகவரிச் சான்று", "புகைப்படம்", "வருமானச் சான்றிதழ்", "பிற ஆவணம்"],
    consent: "நான் அளித்த விவரங்கள் சரியானவை என்றும், இந்த விண்ணப்பத்தைச் செயல்படுத்தத் துறை அவற்றைப் பயன்படுத்த ஒப்புக்கொள்கிறேன் என்றும் உறுதிசெய்கிறேன்.",
    submit: "விண்ணப்பத்தை அனுப்புக", sending: "அனுப்பப்படுகிறது…",
    errTitle: "உங்கள் விண்ணப்பத்தில் சிக்கல் உள்ளது",
    req: "இது கட்டாயம்.", mobileErr: "6, 7, 8 அல்லது 9 இல் தொடங்கும் 10 இலக்கக் கைபேசி எண்ணை உள்ளிடவும்.", emailErr: "சரியான மின்னஞ்சலை உள்ளிடவும்.",
    pctErr: "0 முதல் 100 வரையிலான எண்ணை உள்ளிடவும்.", dobErr: "எதிர்காலத் தேதி அல்லாத பிறந்த தேதியை உள்ளிடவும்.", consentErr: "விவரங்கள் சரி என உறுதிசெய்ய பெட்டியைத் தேர்வுசெய்யவும்.",
    filesErr: "குறைந்தது ஒரு ஆவணத்தைப் பதிவேற்றவும்.", typeErr: "PDF, JPG அல்லது PNG கோப்பு அல்ல.", sizeErr: `${MAX_MB} MB ஐ விடப் பெரியது.`, countErr: `அதிகபட்சம் ${MAX_FILES} கோப்புகள்.`,
    doneTitle: "விண்ணப்பம் அனுப்பப்பட்டது", doneLead: "உங்கள் விண்ணப்பம் பெறப்பட்டது. இந்தக் குறிப்பு எண்ணைப் பாதுகாக்கவும் — நிலை அறிய இதுவும் கைபேசி எண்ணும் தேவை.",
    ref: "உங்கள் குறிப்பு எண்", copy: "எண்ணை நகலெடு", copied: "குறிப்பு எண் நகலெடுக்கப்பட்டது.", for: "திட்டம்", on: "அனுப்பிய தேதி",
    doneTrack: "இந்த விண்ணப்ப நிலையை அறிய", doneAnother: "வேறு திட்டத்திற்கு விண்ணப்பிக்க",
    offline: "இந்தத் திட்டத்திற்கு இணைய விண்ணப்பம் இல்லை. மாவட்ட அலுவலகத்தில் விண்ணப்பிக்கவும்.",
    sampleNote: "விண்ணப்பங்கள் பாதுகாப்பாகச் சேமிக்கப்படுகின்றன. உங்கள் மாவட்ட அலுவலர்கள் மட்டுமே ஆவணங்களைப் பார்க்க முடியும்.",
  },
};

const EMPTY = { applicantName: "", dateOfBirth: "", gender: "", mobile: "", email: "", district: "", address: "", disabilityCategory: "", disabilityPercentage: "", udidNumber: "", scheme: "", consent: false };
const ORDER = ["applicantName", "dateOfBirth", "gender", "mobile", "email", "district", "address", "disabilityCategory", "disabilityPercentage", "udidNumber", "scheme", "documents", "consent"];

function validate(f, files, s) {
  const e = {};
  ["applicantName", "dateOfBirth", "gender", "mobile", "district", "address", "disabilityCategory", "disabilityPercentage", "scheme"].forEach((k) => { if (!String(f[k]).trim()) e[k] = s.req; });
  if (f.mobile && !/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = s.mobileErr;
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = s.emailErr;
  if (f.disabilityPercentage !== "" && !(Number(f.disabilityPercentage) >= 0 && Number(f.disabilityPercentage) <= 100)) e.disabilityPercentage = s.pctErr;
  if (f.dateOfBirth && new Date(f.dateOfBirth) > new Date()) e.dateOfBirth = s.dobErr;
  if (!files.length) e.documents = s.filesErr;
  if (!f.consent) e.consent = s.consentErr;
  return e;
}

export default function Apply() {
  const { t, tx, lang } = useLang();
  const s = useStrings(S);
  const toast = useToast();
  const { meta } = useSite();
  const [params] = useSearchParams();
  const schemes = useApi("/schemes");
  const [form, setForm] = useState({ ...EMPTY, scheme: params.get("scheme") || "" });
  const [files, setFiles] = useState([]); // { file, label }
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);
  const [over, setOver] = useState(false);
  const summaryRef = useRef(null);
  const doneRef = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((er) => { const n = { ...er }; delete n[k]; return n; });
  };

  const addFiles = (list) => {
    const incoming = [...list];
    const problems = [];
    const ok = incoming.filter((f) => {
      const ext = `.${f.name.split(".").pop().toLowerCase()}`;
      if (!TYPES[f.type] || !TYPES[f.type].includes(ext)) { problems.push(`“${f.name}” ${s.typeErr}`); return false; }
      if (f.size > MAX_MB * 1024 * 1024) { problems.push(`“${f.name}” ${s.sizeErr}`); return false; }
      return true;
    });
    const room = MAX_FILES - files.length;
    if (ok.length > room) problems.push(s.countErr);
    setFiles((cur) => [...cur, ...ok.slice(0, Math.max(0, room)).map((file, i) => ({ file, label: s.docLabels[Math.min(cur.length + i, s.docLabels.length - 1)], key: `${file.name}-${file.size}-${Date.now()}-${i}` }))]);
    setErrors((er) => { const n = { ...er }; if (problems.length) n.documents = problems.join(" "); else delete n.documents; return n; });
  };

  const showErrors = (errs, message) => {
    setErrors(errs);
    setSummary(message || s.errTitle);
    window.setTimeout(() => summaryRef.current?.focus(), 0);
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form, files, s);
    if (Object.keys(errs).length) return showErrors(errs);
    setSending(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    files.forEach(({ file, label }) => { fd.append("documents", file); fd.append("documentLabels", label); });
    try {
      const { data } = await api.post("/applications", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(data);
      setSummary("");
      window.scrollTo(0, 0);
    } catch (err) {
      const info = errorInfo(err);
      if (Object.keys(info.fields).length) showErrors(info.fields, info.message);
      else { toast.error(info.message); showErrors({}, info.message); }
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <>
        <PageHero title={s.doneTitle} crumbs={[["/apply", t("nav.apply")]]} />
        <section className="section"><div className="container" style={{ maxWidth: 720 }}>
          <div className="card success-panel" ref={doneRef} tabIndex={-1} role="status">
            <div className="tick" aria-hidden="true"><Check /></div>
            <h2>{s.doneTitle}</h2>
            <p className="muted" style={{ maxWidth: 520, margin: "8px auto 0" }}>{s.doneLead}</p>
            <p style={{ marginTop: 16 }}><span className="sr-only">{s.ref}: </span><span className="ref-box">{done.referenceNo}</span></p>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard?.writeText(done.referenceNo).then(() => toast.success(s.copied))}><Copy aria-hidden="true" /> {s.copy}</button>
            <dl className="dl-grid" style={{ maxWidth: 380, margin: "20px auto 0", textAlign: "left" }}>
              <dt>{s.for}</dt><dd>{tx(done.scheme)}</dd>
              <dt>{s.on}</dt><dd>{fmtDate(done.submittedAt, lang)}</dd>
            </dl>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
              <Link className="btn btn-primary" to={`/track?ref=${done.referenceNo}`}>{s.doneTrack}</Link>
              <button type="button" className="btn btn-outline" onClick={() => { setDone(null); setForm({ ...EMPTY }); setFiles([]); }}>{s.doneAnother}</button>
            </div>
          </div>
        </div></section>
      </>
    );
  }

  const errorList = ORDER.filter((k) => errors[k]);
  const selected = schemes.data?.schemes.find((x) => x.slug === form.scheme);

  return (
    <>
      <PageHero title={s.title} lead={s.lead} crumbs={[["/apply", t("nav.apply")]]} />
      <section className="section">
        <div className="container layout-side">
          <form className="card form-card" onSubmit={submit} noValidate aria-describedby="form-note">
            {summary && (
              <div className="error-summary" ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="err-title">
                <h2 id="err-title">{summary}</h2>
                {errorList.length > 0 && (
                  <ul>{errorList.map((k) => <li key={k}><a href={`#${k === "documents" ? "documents-input" : k === "gender" ? "gender-female" : k}`}>{errors[k]}</a></li>)}</ul>
                )}
              </div>
            )}

            <fieldset>
              <legend>1. {s.personal}</legend>
              <div className="form-grid">
                <FormField id="applicantName" label={s.name} hint={s.nameHint} required error={errors.applicantName} className="span-2">
                  <input value={form.applicantName} onChange={set("applicantName")} autoComplete="name" maxLength={120} />
                </FormField>
                <FormField id="dateOfBirth" label={s.dob} required error={errors.dateOfBirth}>
                  <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} max={new Date().toISOString().slice(0, 10)} autoComplete="bday" />
                </FormField>
                <div className="field">
                  <fieldset style={{ margin: 0 }} aria-describedby={errors.gender ? "gender-error" : undefined}>
                    <legend className="label" style={{ fontFamily: "var(--font-body)", fontSize: ".9rem", marginBottom: 6 }}>{s.gender}<span className="req" aria-hidden="true">*</span></legend>
                    <div className="radio-row">
                      {Object.entries(s.g).map(([v, label]) => (
                        <label key={v} className="choice"><input type="radio" id={`gender-${v}`} name="gender" value={v} checked={form.gender === v} onChange={set("gender")} required />{label}</label>
                      ))}
                    </div>
                    {errors.gender && <span id="gender-error" className="field-error" style={{ marginTop: 6 }}>{errors.gender}</span>}
                  </fieldset>
                </div>
                <FormField id="mobile" label={s.mobile} hint={s.mobileHint} required error={errors.mobile}>
                  <input type="tel" inputMode="numeric" value={form.mobile} onChange={(e) => set("mobile")({ target: { value: e.target.value.replace(/\D/g, "").slice(0, 10) } })} autoComplete="tel-national" />
                </FormField>
                <FormField id="email" label={s.email} error={errors.email}>
                  <input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                </FormField>
                <FormField id="district" label={s.district} required error={errors.district}>
                  <select value={form.district} onChange={set("district")}>
                    <option value="">{s.choose}</option>
                    {(meta?.districts || []).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </FormField>
                <FormField id="address" label={s.address} hint={s.addressHint} required error={errors.address} className="span-2">
                  <textarea value={form.address} onChange={set("address")} autoComplete="street-address" maxLength={500} />
                </FormField>
              </div>
            </fieldset>

            <fieldset>
              <legend>2. {s.disability}</legend>
              <div className="form-grid">
                <FormField id="disabilityCategory" label={s.category} required error={errors.disabilityCategory} className="span-2">
                  <select value={form.disabilityCategory} onChange={set("disabilityCategory")}>
                    <option value="">{s.choose}</option>
                    {(meta?.disabilityCategories || []).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </FormField>
                <FormField id="disabilityPercentage" label={s.percent} hint={s.percentHint} required error={errors.disabilityPercentage}>
                  <input type="number" inputMode="numeric" min="0" max="100" value={form.disabilityPercentage} onChange={set("disabilityPercentage")} />
                </FormField>
                <FormField id="udidNumber" label={s.udid} hint={s.udidHint} error={errors.udidNumber}>
                  <input value={form.udidNumber} onChange={set("udidNumber")} maxLength={30} />
                </FormField>
              </div>
            </fieldset>

            <fieldset>
              <legend>3. {s.schemeSec}</legend>
              <div className="form-grid">
                <FormField id="scheme" label={s.scheme} required error={errors.scheme} className="span-2">
                  {schemes.loading ? <Skeleton h={46} /> : (
                    <select value={form.scheme} onChange={set("scheme")}>
                      <option value="">{s.choose}</option>
                      {(schemes.data?.schemes || []).map((x) => <option key={x.slug} value={x.slug} disabled={!x.acceptsOnline}>{tx(x.title)}</option>)}
                    </select>
                  )}
                </FormField>
                {schemes.error && <div className="span-2"><ErrorState error={schemes.error} onRetry={schemes.reload} /></div>}
                {selected && !selected.acceptsOnline && <div className="span-2"><Notice kind="warn">{s.offline}</Notice></div>}

                <div className="field span-2">
                  <span className="label" id="documents-label">{s.docs}<span className="req" aria-hidden="true">*</span></span>
                  <span className="hint" id="documents-hint">{s.docsHint}</span>
                  <div className={`dropzone${over ? " is-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
                    onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}>
                    <Upload aria-hidden="true" />
                    <div style={{ marginTop: 6 }}>
                      <input ref={fileInput} id="documents-input" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        className="sr-only" aria-labelledby="documents-label" aria-describedby={`documents-hint${errors.documents ? " documents-error" : ""}`}
                        aria-invalid={errors.documents ? true : undefined}
                        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} disabled={files.length >= MAX_FILES} />
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInput.current?.click()} disabled={files.length >= MAX_FILES}>{s.choose_files}</button>
                      <span className="hint" style={{ marginLeft: 8 }}>{s.drop}</span>
                    </div>
                  </div>
                  {errors.documents && <span id="documents-error" className="field-error">{errors.documents}</span>}
                  {files.length > 0 && (
                    <ul className="upload-list" aria-label={s.docs}>
                      {files.map((f, i) => (
                        <li key={f.key} className="upload-item">
                          <span className="fname" title={f.file.name}>{f.file.name} <span className="muted">({fmtSize(f.file.size)})</span></span>
                          <label className="sr-only" htmlFor={`label-${i}`}>{s.docType} {f.file.name}</label>
                          <select id={`label-${i}`} className="input" value={f.label} onChange={(e) => setFiles((cur) => cur.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}>
                            {s.docLabels.map((l) => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFiles((cur) => cur.filter((_, j) => j !== i))} aria-label={`${s.remove} ${f.file.name}`}><Trash2 aria-hidden="true" /> {s.remove}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset style={{ marginBottom: 20 }}>
              <legend>4. {s.confirm}</legend>
              <label className="check" htmlFor="consent">
                <input type="checkbox" id="consent" checked={form.consent} onChange={set("consent")} aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} />
                <span>{s.consent}<span className="req" aria-hidden="true">*</span></span>
              </label>
              {errors.consent && <span id="consent-error" className="field-error" style={{ marginTop: 6 }}>{errors.consent}</span>}
            </fieldset>

            <p id="form-note" className="hint" style={{ marginBottom: 16 }}>{s.sampleNote}</p>
            <button type="submit" className="btn btn-primary" disabled={sending} aria-disabled={sending}>{sending ? s.sending : s.submit}</button>
          </form>

          <aside style={{ display: "grid", gap: 16 }}>
            <div className="card card-pad">
              <h2 style={{ fontSize: "1.05rem", marginBottom: 6 }}>{s.trackTitle}</h2>
              <Link className="link-arrow" to="/track">{s.trackLink}</Link>
            </div>
            <Notice kind="info" icon={Info}>
              {t("steps.s1d")} <Link to="/id-card">{t("online.id")}</Link>
            </Notice>
          </aside>
        </div>
      </section>
    </>
  );
}
