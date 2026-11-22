import { useEffect, useRef, useState } from "react";
import api from "../services/api.js";
import { useLang } from "../context/LanguageContext.jsx";
import OfficeDetails from "./OfficeDetails.jsx";
import { ErrorState } from "./States.jsx";

// The dark green "Need help?" band with the district office lookup.
export default function DistrictFinder() {
  const { t, lang } = useLang();
  const [offices, setOffices] = useState([]);
  const [listError, setListError] = useState(null);
  const [choice, setChoice] = useState("");
  const [shown, setShown] = useState(null);
  const [error, setError] = useState("");
  const result = useRef(null);

  const loadList = () => { setListError(null); api.get("/districts").then((r) => setOffices(r.data.offices)).catch(setListError); };
  useEffect(loadList, []);

  const submit = (e) => {
    e.preventDefault();
    if (!choice) { setError(t("help.chooseFirst")); return; }
    setError("");
    setShown(offices.find((o) => o.district === choice) || null);
    window.setTimeout(() => result.current?.focus(), 0);
  };

  return (
    <section className="help-band on-dark" aria-labelledby="help-title">
      <div className="container">
        <div>
          <h2 id="help-title">{t("help.title")}</h2>
          <p>{t("help.sub")}</p>
        </div>
        <form className="district-form" onSubmit={submit} noValidate>
          <label htmlFor="district-select">{t("help.findLabel")}</label>
          <div className="row">
            <select id="district-select" value={choice} onChange={(e) => { setChoice(e.target.value); setError(""); }}
              aria-invalid={Boolean(error)} aria-describedby={error ? "district-error" : undefined} disabled={!offices.length}>
              <option value="">{t("help.select")}</option>
              {offices.map((o) => <option key={o.district} value={o.district}>{lang === "ta" && o.districtTa ? `${o.districtTa} (${o.district})` : o.district}</option>)}
            </select>
            <button type="submit" className="btn btn-on-dark">{t("help.show")}</button>
          </div>
          {error && <p id="district-error" role="alert" style={{ marginTop: 8, fontWeight: 600 }}>{error}</p>}
          {listError && <div style={{ marginTop: 10 }}><ErrorState error={listError} onRetry={loadList} /></div>}
        </form>
        {shown && (
          <div className="office-result" ref={result} tabIndex={-1} aria-live="polite">
            <OfficeDetails office={shown} />
          </div>
        )}
      </div>
    </section>
  );
}
