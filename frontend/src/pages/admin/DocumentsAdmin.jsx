import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api, { errorInfo, fileUrl } from "../../services/api.js";
import useApi from "../../hooks/useApi.js";
import { fmtSize } from "../../hooks/format.js";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/Modal.jsx";
import FormField from "../../components/FormField.jsx";
import { ErrorState, Skeleton } from "../../components/States.jsx";

const KINDS = [["act", "Act"], ["policy", "Policy"], ["go", "Government Order"], ["other", "Other"]];
const BLANK = { titleEn: "", titleTa: "", kind: "go", year: "", goNumber: "", externalUrl: "", order: 20, published: true };

export default function DocumentsAdmin() {
  const toast = useToast();
  const { data, loading, error, reload } = useApi("/admin/documents");
  const [edit, setEdit] = useState(null);
  const [file, setFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const open = (d) => {
    setErrors({}); setFile(null); setRemoveFile(false);
    setEdit(d ? { _id: d._id, titleEn: d.title.en, titleTa: d.title.ta, kind: d.kind, year: d.year || "", goNumber: d.goNumber, externalUrl: d.externalUrl, order: d.order, published: d.published, storedName: d.storedName, originalName: d.originalName, size: d.size } : { ...BLANK });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!edit.titleEn.trim()) { setErrors({ titleEn: "Enter a title." }); return; }
    if (file && (file.type !== "application/pdf" || file.size > 20 * 1024 * 1024)) { setErrors({ file: "Choose a PDF of 20 MB or less." }); return; }
    const fd = new FormData();
    ["titleEn", "titleTa", "kind", "year", "goNumber", "externalUrl", "order", "published"].forEach((k) => fd.append(k, String(edit[k] ?? "")));
    if (file) fd.append("file", file);
    if (removeFile) fd.append("removeFile", "true");
    setBusy(true);
    try {
      if (edit._id) await api.put(`/admin/documents/${edit._id}`, fd); else await api.post("/admin/documents", fd);
      toast.success("Document saved."); setEdit(null); reload();
    } catch (err) { const i = errorInfo(err); setErrors(i.fields); toast.error(i.message); } finally { setBusy(false); }
  };

  const del = async (d) => {
    if (!window.confirm(`Delete “${d.title.en}”? This cannot be undone.`)) return;
    try { await api.delete(`/admin/documents/${d._id}`); toast.success("Document deleted."); reload(); } catch (err) { toast.error(errorInfo(err).message); }
  };

  const set = (k) => (e) => setEdit((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <div><h1 style={{ fontSize: "1.45rem", marginBottom: 4 }}>Acts & documents</h1>
          <p className="muted" style={{ maxWidth: 720 }}>Upload the official PDF for each Act, the State policy and each Government Order. Until a PDF or official link is added, the public sees “Official copy to be added”.</p></div>
        <button type="button" className="btn btn-primary" onClick={() => open(null)}><Plus aria-hidden="true" /> Add document</button>
      </div>
      {loading && <Skeleton h={200} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <div className="table-wrap"><table className="data"><caption className="sr-only">Documents</caption>
          <thead><tr><th scope="col">Title</th><th scope="col">Type</th><th scope="col">File</th><th scope="col">Shown</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>{data.items.map((d) => (
            <tr key={d._id}>
              <td>{d.title.en}{d.goNumber && <div className="hint">{d.goNumber}</div>}</td>
              <td>{KINDS.find(([v]) => v === d.kind)?.[1]}</td>
              <td>{d.storedName ? <a href={fileUrl(`/documents/${d._id}/file`)} target="_blank" rel="noopener noreferrer">PDF ({fmtSize(d.size)})</a> : d.externalUrl ? "Link" : <span className="not-set">None yet</span>}</td>
              <td>{d.published ? "Yes" : "No"}</td>
              <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <button type="button" className="icon-btn" onClick={() => open(d)} aria-label={`Edit ${d.title.en}`}><Pencil aria-hidden="true" /></button>
                <button type="button" className="icon-btn" style={{ marginLeft: 6 }} onClick={() => del(d)} aria-label={`Delete ${d.title.en}`}><Trash2 aria-hidden="true" /></button>
              </td>
            </tr>))}
          </tbody></table></div>
      )}
      {edit && (
        <Modal title={edit._id ? "Edit document" : "Add document"} onClose={() => setEdit(null)} wide
          footer={<><button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancel</button><button type="submit" form="doc-form" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save"}</button></>}>
          <form id="doc-form" className="form-grid" onSubmit={save} noValidate>
            <FormField id="d-en" label="Title (English)" required error={errors.titleEn} className="span-2"><input value={edit.titleEn} onChange={set("titleEn")} /></FormField>
            <FormField id="d-ta" label="Title (Tamil)" className="span-2"><input value={edit.titleTa} onChange={set("titleTa")} lang="ta" /></FormField>
            <FormField id="d-kind" label="Type"><select value={edit.kind} onChange={set("kind")}>{KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></FormField>
            <FormField id="d-year" label="Year"><input type="number" value={edit.year} onChange={set("year")} /></FormField>
            <FormField id="d-go" label="G.O. number" hint="For Government Orders"><input value={edit.goNumber} onChange={set("goNumber")} /></FormField>
            <FormField id="d-order" label="Display order"><input type="number" value={edit.order} onChange={set("order")} /></FormField>
            <FormField id="d-file" label="Official PDF" hint={edit.storedName ? `Current file: ${edit.originalName}. Choose a new file to replace it.` : "PDF only, up to 20 MB."} error={errors.file} className="span-2">
              <input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files[0] || null)} />
            </FormField>
            {edit.storedName && <label className="check span-2"><input type="checkbox" checked={removeFile} onChange={(e) => setRemoveFile(e.target.checked)} /> Remove the current PDF</label>}
            <FormField id="d-url" label="Or official link" hint="Full https:// link to the document on an official site" error={errors.externalUrl} className="span-2"><input value={edit.externalUrl} onChange={set("externalUrl")} /></FormField>
            <label className="check span-2"><input type="checkbox" checked={edit.published} onChange={set("published")} /> Show on the website</label>
          </form>
        </Modal>
      )}
    </>
  );
}
