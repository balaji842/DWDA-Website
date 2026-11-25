import { useState } from "react";
import { useStrings } from "../../context/LanguageContext.jsx";
import { D } from "./strings.js";
import { DonateHeader, MoneyBadge, AmountBox, RemarksBox, ConsentBox, DonateButton, DonorDialog } from "./parts.jsx";

// Quick cash donation — as on the Namma School page: amount, remarks, consent, donate.
export default function QuickDonate() {
  const s = useStrings(D);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);

  const go = () => {
    if (!(Number(amount) >= 100)) { setErr(s.amountReq); document.getElementById("quick-amount")?.focus(); return; }
    if (!consent) { document.getElementById("quick-consent")?.focus(); return; }
    setErr(""); setOpen(true);
  };
  return (
    <>
      <DonateHeader title={s.quick} />
      <section className="don-band">
        <div className="container">
          <MoneyBadge />
          <div className="don-card">
            <div className="don-card-inner">
              <h2 className="don-welcome">{s.welcome}</h2>
              <AmountBox id="quick-amount" value={amount} onChange={(v) => { setAmount(v); setErr(""); }} error={err} />
              <RemarksBox id="quick-remarks" value={remarks} onChange={setRemarks} />
              <ConsentBox id="quick-consent" checked={consent} onChange={setConsent} />
            </div>
          </div>
          <DonateButton onClick={go} disabled={!consent} />
        </div>
      </section>
      <DonorDialog open={open} onClose={() => setOpen(false)} amount={Number(amount)}
        build={() => ({ type: "quick", amount: Number(amount), purpose: "general", message: remarks })} />
    </>
  );
}