import { Link, NavLink } from "react-router-dom";
import { Info, HandCoins, ChevronsRight } from "lucide-react";
import { useStrings } from "../../context/LanguageContext.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import Modal from "../../components/Modal.jsx";
import { D } from "./strings.js";
import DonorForm from "./DonorForm.jsx";

export function TestModeNote() {
  const s = useStrings(D);
  return <p className="test-mode" role="note"><Info aria-hidden="true" />{s.testMode}</p>;
}

// Top strip shared by the three donation pages: title + the three pill tabs (current one highlighted).
export function DonateHeader({ title }) {
  const s = useStrings(D);
  useDocumentTitle(title);
  const tabs = [["/donate/quick", s.quick], ["/donate/needs", s.need], ["/donate/institutions", s.inst]];
  return (
    <div className="don-strip">
      <div className="container">
        <div className="don-strip-title">
          <img src="/images/logo/cwda-logo.webp" alt="" width="44" height="44" />
          <div>
            <h1 tabIndex={-1} data-page-heading>{s.donateFor}<span className="sr-only"> — {title}</span></h1>
            <p>{s.donateForSub}</p>
          </div>
        </div>
        <nav aria-label={s.donate}>
          <ul className="don-tabs">
            {tabs.map(([to, label]) => (
              <li key={to}><NavLink to={to} className={({ isActive }) => `don-tab${isActive ? " is-on" : ""}`}>{label}</NavLink></li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

// "Donate money" badge shown above the amount card.
export function MoneyBadge() {
  const s = useStrings(D);
  return (
    <div className="money-badge" aria-hidden="true">
      <span className="money-badge-card"><HandCoins /><small>{s.donateMoney}</small></span>
    </div>
  );
}

export function AmountBox({ id, value, onChange, error }) {
  const s = useStrings(D);
  return (
    <div className="field">
      <label htmlFor={id} className="sr-only">{s.enterAmount}</label>
      <div className={`rupee-input${error ? " has-error" : ""}`}>
        <span aria-hidden="true">₹</span>
        <input id={id} inputMode="numeric" placeholder={s.enterAmount} value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
          aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
      </div>
      {error && <span className="field-error" id={`${id}-err`}>{error}</span>}
    </div>
  );
}

export function RemarksBox({ id, value, onChange }) {
  const s = useStrings(D);
  return (
    <div className="field">
      <label htmlFor={id} className="sr-only">{s.remarks}</label>
      <textarea id={id} className="remarks" placeholder={s.remarks} value={value} onChange={(e) => onChange(e.target.value)} maxLength={300} />
    </div>
  );
}

export function ConsentBox({ id, checked, onChange }) {
  const s = useStrings(D);
  return (
    <div className="consent">
      {!checked && <p className="consent-warn" id={`${id}-warn`}>{s.acceptTerms}</p>}
      <label className="check" htmlFor={id}>
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-describedby={checked ? undefined : `${id}-warn`} />
        <span>{s.consentA} <Link to="/donate/terms" target="_blank">{s.terms}<span className="sr-only"> (opens in a new tab)</span></Link> {s.consentB}</span>
      </label>
    </div>
  );
}

export function DonateButton({ onClick, disabled }) {
  const s = useStrings(D);
  return (
    <div className="don-go">
      <button type="button" className="don-go-btn" onClick={onClick} disabled={disabled}>
        <span>{s.clickDonate}</span><span className="arrow" aria-hidden="true"><ChevronsRight /></span>
      </button>
    </div>
  );
}

// Donor details, in a dialog after "Click here to donate".
export function DonorDialog({ open, onClose, build, amount }) {
  const s = useStrings(D);
  if (!open) return null;
  return (
    <Modal title={s.detailsTitle} onClose={onClose} wide>
      <DonorForm build={build} amount={amount} skipConsent />
    </Modal>
  );
}