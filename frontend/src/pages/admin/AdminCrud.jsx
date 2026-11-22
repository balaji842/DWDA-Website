import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api, { errorInfo } from "../../services/api.js";
import useApi from "../../hooks/useApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../../components/Modal.jsx";
import FormField from "../../components/FormField.jsx";
import { EmptyState, ErrorState, Skeleton } from "../../components/States.jsx";

// Read a dotted path: get(obj, "title.en")
const get = (o, path) => path.split(".").reduce((x, k) => (x == null ? undefined : x[k]), o);
const setPath = (o, path, v) => {
  const keys = path.split(".");
  const out = { ...o };
  let cur = out;
  keys.slice(0, -1).forEach((k) => { cur[k] = { ...(cur[k] || {}) }; cur = cur[k]; });
  cur[keys.at(-1)] = v;
  return out;
};

/**
 * A list + edit dialog for one admin collection.
 *   fields: [{ name: "title.en", label, type: text|textarea|select|checkbox|date|number|multi, options, required, hint, span }]
 *   columns: [{ label, render(item) }]
 */
export default function AdminCrud({ title, intro, endpoint, columns, fields, blank, canCreate = true, canDelete = true, superOnly = true, itemName = "item", search }) {
  const { admin } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useApi(endpoint);
  const [editing, setEditing] = useState(null); // { item, isNew }
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const allowed = !superOnly || admin.role === "superadmin";

  const items = (data?.items || []).filter((it) => !q || (search ? search(it) : JSON.stringify(it)).toLowerCase().includes(q.toLowerCase()));

  const save = async (e) => {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => { if (f.required && !String(get(editing.item, f.name) ?? "").trim()) errs[f.name] = `Enter ${f.label.toLowerCase()}.`; });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      if (editing.isNew) await api.post(endpoint, editing.item);
      else await api.put(`${endpoint}/${editing.item._id}`, editing.item);
      toast.success(`${itemName[0].toUpperCase() + itemName.slice(1)} saved.`);
      setEditing(null);
      reload();
    } catch (err) {
      const info = errorInfo(err);
      setErrors(info.fields);
      toast.error(info.message);
    } finally { setBusy(false); }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${itemName}? This cannot be undone.`)) return;
    try { await api.delete(`${endpoint}/${item._id}`); toast.success(`${itemName[0].toUpperCase() + itemName.slice(1)} deleted.`); reload(); }
    catch (err) { toast.error(errorInfo(err).message); }
  };

  const input = (f) => {
    const val = get(editing.item, f.name);
    const change = (v) => setEditing((ed) => ({ ...ed, item: setPath(ed.item, f.name, v) }));
    if (f.type === "checkbox") {
      return <label className="check" key={f.name} style={{ gridColumn: "1 / -1" }}><input type="checkbox" checked={Boolean(val)} onChange={(e) => change(e.target.checked)} /> {f.label}{f.hint && <span className="hint"> — {f.hint}</span>}</label>;
    }
    if (f.type === "multi") {
      return (
        <fieldset key={f.name} className="span-2" style={{ margin: 0 }}><legend className="label" style={{ fontFamily: "var(--font-body)", fontSize: ".9rem", marginBottom: 6 }}>{f.label}</legend>
          <div className="radio-row">{f.options.map(([v, l]) => (
            <label key={v} className="choice"><input type="checkbox" checked={(val || []).includes(v)} onChange={(e) => change(e.target.checked ? [...(val || []), v] : (val || []).filter((x) => x !== v))} />{l}</label>
          ))}</div></fieldset>
      );
    }
    const control = f.type === "textarea" ? <textarea value={val || ""} onChange={(e) => change(e.target.value)} lang={f.name.endsWith(".ta") ? "ta" : undefined} />
      : f.type === "select" ? <select value={val || ""} onChange={(e) => change(e.target.value)}>{f.placeholder !== false && <option value="">Choose…</option>}{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        : <input type={f.type || "text"} value={f.type === "date" && val ? String(val).slice(0, 10) : (val ?? "")} onChange={(e) => change(f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} lang={f.name.endsWith(".ta") ? "ta" : undefined} />;
    return <FormField key={f.name} id={`f-${f.name.replace(/\./g, "-")}`} label={f.label} hint={f.hint} required={f.required} error={errors[f.name]} className={f.span ? "span-2" : ""}>{control}</FormField>;
  };

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <div><h1 style={{ fontSize: "1.45rem", marginBottom: 4 }}>{title}</h1>{intro && <p className="muted" style={{ maxWidth: 720 }}>{intro}</p>}</div>
        {canCreate && allowed && <button type="button" className="btn btn-primary" onClick={() => { setErrors({}); setEditing({ item: blank(), isNew: true }); }}><Plus aria-hidden="true" /> Add {itemName}</button>}
      </div>
      <div className="toolbar"><div className="field" style={{ minWidth: "min(320px,100%)" }}><label htmlFor="crud-q">Filter</label><input id="crud-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {loading && <Skeleton h={240} style={{ borderRadius: 12 }} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (items.length ? (
        <div className="table-wrap">
          <table className="data">
            <caption className="sr-only">{title}</caption>
            <thead><tr>{columns.map((c) => <th key={c.label} scope="col">{c.label}</th>)}<th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{items.map((it) => (
              <tr key={it._id || it.id}>
                {columns.map((c) => <td key={c.label}>{c.render(it)}</td>)}
                <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                  <button type="button" className="icon-btn" onClick={() => { setErrors({}); setEditing({ item: JSON.parse(JSON.stringify(it)), isNew: false }); }} aria-label={`Edit ${columns[0].render(it)}`} disabled={!allowed && superOnly}><Pencil aria-hidden="true" /></button>
                  {canDelete && allowed && <button type="button" className="icon-btn" style={{ marginLeft: 6 }} onClick={() => remove(it)} aria-label={`Delete ${columns[0].render(it)}`}><Trash2 aria-hidden="true" /></button>}
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState title={`No ${itemName}s`}>{q ? "Nothing matches the filter." : `Add the first ${itemName}.`}</EmptyState>)}

      {editing && (
        <Modal title={editing.isNew ? `Add ${itemName}` : `Edit ${itemName}`} onClose={() => setEditing(null)} wide
          footer={<><button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button type="submit" form="crud-form" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save"}</button></>}>
          <form id="crud-form" onSubmit={save} noValidate className="form-grid">{fields.map(input)}</form>
        </Modal>
      )}
    </>
  );
}
