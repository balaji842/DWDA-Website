import { useEffect, useState } from "react";
import api, { errorInfo } from "../../services/api.js";
import { useSite } from "../../context/SiteContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import FormField from "../../components/FormField.jsx";
import { Skeleton } from "../../components/States.jsx";

export default function SettingsAdmin() {
  const { settings, reload } = useSite();
  const toast = useToast();
  const [f, setF] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (settings) setF({ helpline: "", officeAddress: "", officeEmail: "", officePhone: "", whatsapp: "", videoCall: "", ...settings, stats: { populationFigure: "", schemesFigure: "", rehabHomesFigure: "", specialSchoolsFigure: "", ...(settings.stats || {}) } }); }, [settings]);
  if (!f) return <Skeleton h={300} />;

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const setStat = (k) => (e) => setF((x) => ({ ...x, stats: { ...x.stats, [k]: e.target.value } }));
  const save = async (e) => {
    e.preventDefault(); setBusy(true); setErrors({});
    try { await api.put("/admin/settings", f); toast.success("Settings saved. The website now shows the new values."); reload(); }
    catch (err) { const i = errorInfo(err); setErrors(i.fields); toast.error(i.message); } finally { setBusy(false); }
  };

  return (
    <>
      <h1 style={{ fontSize: "1.45rem", marginBottom: 4 }}>Site settings</h1>
      <p className="muted" style={{ marginBottom: 20, maxWidth: 720 }}>Official values shown across the website. Leave a field empty until it is verified — the site shows a placeholder instead of guessing. Saving also updates “Last updated” in the footer.</p>
      <form className="card form-card" onSubmit={save} noValidate>
        <fieldset><legend>Contact</legend><div className="form-grid">
          <FormField id="s-help" label="Helpline number" hint="Shown in the header on every page"><input value={f.helpline} onChange={set("helpline")} /></FormField>
          <FormField id="s-phone" label="Head office phone"><input value={f.officePhone} onChange={set("officePhone")} /></FormField>
          <FormField id="s-email" label="Head office email" error={errors.officeEmail}><input type="email" value={f.officeEmail} onChange={set("officeEmail")} /></FormField>
          <FormField id="s-wa" label="WhatsApp number" hint="Only an official number. Leave empty to hide it."><input value={f.whatsapp} onChange={set("whatsapp")} /></FormField>
          <FormField id="s-video" label="Video-call number for people with hearing impairment" hint="Only an official number. Leave empty to hide it."><input value={f.videoCall} onChange={set("videoCall")} /></FormField>
          <FormField id="s-addr" label="Head office address" className="span-2"><textarea value={f.officeAddress} onChange={set("officeAddress")} /></FormField>
        </div></fieldset>
        <fieldset><legend>At a glance figures</legend>
          <p className="hint" style={{ marginBottom: 14 }}>Enter figures exactly as published in the named source. If the number of schemes is empty, the site counts the schemes listed here.</p>
          <div className="form-grid">
            <FormField id="s-pop" label="Differently abled persons in Tamil Nadu" hint="Source: Census 2011"><input value={f.stats.populationFigure} onChange={setStat("populationFigure")} /></FormField>
            <FormField id="s-schemes" label="Number of schemes run by the department" hint="Source: department records"><input value={f.stats.schemesFigure} onChange={setStat("schemesFigure")} /></FormField>
            <FormField id="s-homes" label="Government rehabilitation homes" hint="Source: department records"><input value={f.stats.rehabHomesFigure} onChange={setStat("rehabHomesFigure")} /></FormField>
            <FormField id="s-schools" label="Special schools" hint="Source: department records"><input value={f.stats.specialSchoolsFigure} onChange={setStat("specialSchoolsFigure")} /></FormField>
          </div></fieldset>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
      </form>
    </>
  );
}