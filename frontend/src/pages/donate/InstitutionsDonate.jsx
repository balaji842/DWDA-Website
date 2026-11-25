import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStrings } from "../../context/LanguageContext.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import useApi from "../../hooks/useApi.js";
import { D } from "./strings.js";
import { DonateHeader, MoneyBadge, AmountBox, RemarksBox, ConsentBox, DonateButton, DonorDialog } from "./parts.jsx";

export const TYPES = {
  en: { "special-school": "Special school", "rehabilitation-home": "Rehabilitation home", "day-care": "Day care centre", "early-intervention": "Early intervention centre", "training-centre": "Training centre", ngo: "NGO", other: "Other" },
  ta: { "special-school": "சிறப்புப் பள்ளி", "rehabilitation-home": "மறுவாழ்வு இல்லம்", "day-care": "பகல்நேரப் பராமரிப்பு மையம்", "early-intervention": "ஆரம்ப நிலை பயிற்சி மையம்", "training-centre": "பயிற்சி மையம்", ngo: "தொண்டு நிறுவனம்", other: "பிற" },
};

export function Filters({ district, setDistrict, institution, setInstitution, disability, setDisability, prefix, institutionRequired = false, instError }) {
  const s = useStrings(D);
  const { meta } = useSite();
  const insts = useApi("/donate/institutions", { district: district || undefined });
  const list = insts.data?.institutions || [];
  useEffect(() => { if (institution && insts.data && !list.some((i) => i._id === institution)) setInstitution(""); }, [insts.data]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="don-filters-band">
      <div className="field">
        <label htmlFor={`${prefix}-district`}>{s.districtL}</label>
        <select id={`${prefix}-district`} value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">{s.selectDistrict}</option>{(meta?.districts || []).map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-institution`}>{s.institutionL}{institutionRequired && <span className="req" aria-hidden="true">*</span>}</label>
        <select id={`${prefix}-institution`} value={institution} onChange={(e) => setInstitution(e.target.value)} aria-invalid={instError ? true : undefined} aria-describedby={instError ? `${prefix}-inst-err` : undefined}>
          <option value="">{s.selectInst}</option>{list.map((i) => <option key={i._id} value={i._id}>{i.name}</option>)}
        </select>
        {instError && <span className="field-error on-band" id={`${prefix}-inst-err`}>{instError}</span>}
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-disability`}>{s.disabilityL}</label>
        <select id={`${prefix}-disability`} value={disability} onChange={(e) => setDisability(e.target.value)}>
          <option value="">{s.selectDis}</option>{(meta?.disabilityCategories || []).map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
    </div>
  );
}

// Donate to a specific institution — District / Institution name / Disability, then amount, remarks, consent.
export default function InstitutionsDonate() {
  const { id } = useParams();
  const s = useStrings(D);
  const [district, setDistrict] = useState("");
  const [institution, setInstitution] = useState(id || "");
  const [disability, setDisability] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [consent, setConsent] = useState(false);
  const [errs, setErrs] = useState({});
  const [open, setOpen] = useState(false);

  const go = () => {
    const e = {};
    if (!institution) e.institution = s.instReq;
    if (!(Number(amount) >= 100)) e.amount = s.amountReq;
    setErrs(e);
    if (e.institution) { document.getElementById("inst-institution")?.focus(); return; }
    if (e.amount) { document.getElementById("inst-amount")?.focus(); return; }
    if (!consent) { document.getElementById("inst-consent")?.focus(); return; }
    setOpen(true);
  };
  return (
    <>
      <DonateHeader title={s.inst} />
      <section className="don-band">
        <div className="container">
          <Filters prefix="inst" district={district} setDistrict={setDistrict} institution={institution} setInstitution={(v) => { setInstitution(v); setErrs((x) => ({ ...x, institution: undefined })); }}
            disability={disability} setDisability={setDisability} institutionRequired instError={errs.institution} />
          <MoneyBadge />
          <div className="don-card">
            <div className="don-card-inner">
              <AmountBox id="inst-amount" value={amount} onChange={(v) => { setAmount(v); setErrs((x) => ({ ...x, amount: undefined })); }} error={errs.amount} />
              <RemarksBox id="inst-remarks" value={remarks} onChange={setRemarks} />
              <ConsentBox id="inst-consent" checked={consent} onChange={setConsent} />
            </div>
          </div>
          <DonateButton onClick={go} disabled={!consent} />
        </div>
      </section>
      <DonorDialog open={open} onClose={() => setOpen(false)} amount={Number(amount)}
        build={() => ({ type: "institution", institution, disability, amount: Number(amount), message: remarks })} />
    </>
  );
}