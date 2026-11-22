import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Eye, CheckCircle2 } from "lucide-react";
import api, { errorInfo } from "../../services/api.js";
import useApi from "../../hooks/useApi.js";
import { fmtDate, fmtDateTime, fmtSize } from "../../hooks/format.js";
import { useToast } from "../../context/ToastContext.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import FormField from "../../components/FormField.jsx";
import { ErrorState, Notice, Skeleton } from "../../components/States.jsx";
import { STATUS_LABEL } from "../../components/status.js";

export default function ApplicationDetail() {
  const { id } = useParams();
  const toast = useToast();
  const { data, loading, error, reload } = useApi(`/admin/applications/${id}`);
  const [override, setOverride] = useState(null);
  const view = override || data;
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [note, setNote] = useState("");
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);

  const openDoc = async (doc) => {
    // Documents need the sign-in token, so fetch them and open a local copy.
    const w = window.open("", "_blank");
    try {
      const r = await api.get(`/admin/applications/${id}/documents/${doc._id}/file`, { responseType: "blob" });
      const url = URL.createObjectURL(r.data);
      if (w) w.location.href = url; else window.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) { w?.close(); toast.error(errorInfo(err).message); }
  };

  const verify = async (doc) => {
    try {
      const r = await api.patch(`/admin/applications/${id}/documents/${doc._id}`, { verified: !doc.verified });
      setOverride({ ...view, application: r.data.application });
      toast.success(doc.verified ? "Marked as not verified." : "Document verified.");
    } catch (err) { toast.error(errorInfo(err).message); }
  };

  const update = async (e) => {
    e.preventDefault();
    if (!status) { setErrs({ status: "Choose the new status." }); return; }
    setBusy(true); setErrs({});
    try {
      const r = await api.patch(`/admin/applications/${id}/status`, { status, remark, internalNote: note });
      setOverride(r.data);
      setStatus(""); setRemark(""); setNote("");
      toast.success(`Status changed to ${STATUS_LABEL.en[status]}. The applicant sees this when they track.`);
    } catch (err) {
      const info = errorInfo(err); setErrs(info.fields);
      if (!Object.keys(info.fields).length) toast.error(info.message);
    } finally { setBusy(false); }
  };

  if (loading && !view) return <Skeleton h={300} />;
  if (error && !view) return <ErrorState error={error} onRetry={reload} />;
  const a = view.application;
  const next = view.nextStatuses || [];

  return (
    <>
      <Link to="/admin/applications" className="link-arrow" style={{ marginBottom: 12 }}><ArrowLeft aria-hidden="true" /> All applications</Link>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "8px 0 20px" }}>
        <h1 style={{ fontSize: "1.45rem" }}>{a.referenceNo}</h1><StatusBadge status={a.status} />
      </div>
      <div className="layout-side" style={{ gridTemplateColumns: "minmax(0,1fr) 360px" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <section className="card card-pad">
            <h2 style={{ fontSize: "1.05rem", marginBottom: 12 }}>Applicant</h2>
            <dl className="dl-grid" style={{ gridTemplateColumns: "170px minmax(0,1fr)" }}>
              <dt>Name</dt><dd>{a.applicantName}</dd>
              <dt>Date of birth</dt><dd>{fmtDate(a.dateOfBirth)}</dd>
              <dt>Gender</dt><dd style={{ textTransform: "capitalize" }}>{a.gender.replace(/-/g, " ")}</dd>
              <dt>Mobile</dt><dd>{a.mobile}</dd>
              <dt>Email</dt><dd>{a.email || "—"}</dd>
              <dt>District</dt><dd>{a.district}</dd>
              <dt>Address</dt><dd style={{ whiteSpace: "pre-line" }}>{a.address}</dd>
              <dt>Disability</dt><dd>{a.disabilityCategory}, {a.disabilityPercentage}%</dd>
              <dt>UDID / ID number</dt><dd>{a.udidNumber || "—"}</dd>
              <dt>Scheme</dt><dd>{a.scheme?.title?.en}</dd>
              <dt>Submitted</dt><dd>{fmtDateTime(a.createdAt)}</dd>
            </dl>
          </section>
          <section className="card card-pad">
            <h2 style={{ fontSize: "1.05rem", marginBottom: 12 }}>Documents</h2>
            {a.documents.length ? (
              <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
                {a.documents.map((d) => (
                  <li key={d._id} className="upload-item" style={{ gridTemplateColumns: "minmax(0,1fr) auto auto" }}>
                    <span><strong style={{ fontSize: ".9rem" }}>{d.label}</strong><span className="fname hint" style={{ display: "block" }}>{d.originalName} · {fmtSize(d.size)}</span>
                      {d.verified && <span className="hint" style={{ color: "var(--green-700)" }}>Verified{d.verifiedBy?.name ? ` by ${d.verifiedBy.name}` : ""}</span>}</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => openDoc(d)}><Eye aria-hidden="true" /> View<span className="sr-only"> {d.label}</span></button>
                    <button type="button" className={`btn btn-sm ${d.verified ? "btn-ghost" : "btn-outline"}`} onClick={() => verify(d)} aria-pressed={d.verified}>
                      <CheckCircle2 aria-hidden="true" /> {d.verified ? "Verified" : "Mark verified"}<span className="sr-only"> {d.label}</span></button>
                  </li>
                ))}
              </ul>
            ) : <p className="muted">No documents uploaded.</p>}
          </section>
          <section className="card card-pad">
            <h2 style={{ fontSize: "1.05rem", marginBottom: 12 }}>History</h2>
            <ol className="timeline">
              {a.history.map((h, i) => (
                <li key={i} className={`tl-item ${h.status === "rejected" ? "bad" : "done"}`}>
                  <span className="tl-dot" aria-hidden="true" />
                  <div className="tl-body"><strong>{STATUS_LABEL.en[h.status]}</strong><span className="when">{fmtDateTime(h.at)}{h.by?.name ? ` · ${h.by.name}` : ""}</span>
                    {h.remark && <p className="remark">Applicant sees: {h.remark}</p>}
                    {h.internalNote && <p className="remark hint">Internal: {h.internalNote}</p>}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside className="card card-pad" style={{ position: "sticky", top: 16 }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: 12 }}>Update status</h2>
          {next.length ? (
            <form onSubmit={update} noValidate style={{ display: "grid", gap: 14 }}>
              <FormField id="new-status" label="New status" required error={errs.status}>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Choose…</option>{next.map((s) => <option key={s} value={s}>{STATUS_LABEL.en[s]}</option>)}
                </select>
              </FormField>
              <FormField id="remark" label="Remark for the applicant" hint="Shown when they track. Required for Documents required and Rejected." error={errs.remark}
                required={["documents-required", "rejected"].includes(status)}>
                <textarea value={remark} onChange={(e) => setRemark(e.target.value)} maxLength={500} />
              </FormField>
              <FormField id="note" label="Internal note (optional)" hint="Only officials see this.">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
              </FormField>
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save status"}</button>
            </form>
          ) : <Notice kind="info">This application is {STATUS_LABEL.en[a.status].toLowerCase()}. No further status changes are possible.</Notice>}
        </aside>
      </div>
    </>
  );
}
