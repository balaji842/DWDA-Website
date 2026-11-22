import { useState } from "react";
import { Plus } from "lucide-react";
import api, { errorInfo } from "../../services/api.js";
import useApi from "../../hooks/useApi.js";
import { fmtDateTime } from "../../hooks/format.js";
import { useSite } from "../../context/SiteContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/Modal.jsx";
import FormField from "../../components/FormField.jsx";
import { ErrorState, Skeleton } from "../../components/States.jsx";

export default function UsersAdmin() {
  const { meta } = useSite();
  const { admin: me } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useApi("/admin/users");
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const create = async (e) => {
    e.preventDefault(); setBusy(true); setErrors({});
    try { await api.post("/admin/users", form); toast.success("Admin account created. Share the password securely."); setForm(null); reload(); }
    catch (err) { const i = errorInfo(err); setErrors(i.fields); toast.error(i.message); } finally { setBusy(false); }
  };
  const toggle = async (u) => {
    try { await api.patch(`/admin/users/${u.id}`, { active: !u.active }); toast.success(u.active ? "Account deactivated." : "Account activated."); reload(); }
    catch (err) { toast.error(errorInfo(err).message); }
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <div><h1 style={{ fontSize: "1.45rem", marginBottom: 4 }}>Admin users</h1>
          <p className="muted">Super Admins manage everything. District Admins see and update only their own district's applications, office and institutions.</p></div>
        <button type="button" className="btn btn-primary" onClick={() => { setErrors({}); setForm({ name: "", email: "", password: "", role: "district", district: "" }); }}><Plus aria-hidden="true" /> Add admin</button>
      </div>
      {loading && <Skeleton h={200} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <div className="table-wrap"><table className="data"><caption className="sr-only">Admin users</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Last sign-in</th><th scope="col">Status</th></tr></thead>
          <tbody>{data.items.map((u) => (
            <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role === "superadmin" ? "Super Admin" : `District Admin — ${u.district}`}</td>
              <td>{u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : "Never"}</td>
              <td>{u.id === me.id ? "You" : <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(u)}>{u.active ? "Deactivate" : "Activate"}<span className="sr-only"> {u.name}</span></button>}</td></tr>
          ))}</tbody></table></div>
      )}
      {form && (
        <Modal title="Add admin" onClose={() => setForm(null)}
          footer={<><button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>Cancel</button><button type="submit" form="user-form" className="btn btn-primary" disabled={busy}>{busy ? "Creating…" : "Create account"}</button></>}>
          <form id="user-form" className="form-grid" onSubmit={create} noValidate>
            <FormField id="u-name" label="Name" required error={errors.name} className="span-2"><input value={form.name} onChange={set("name")} /></FormField>
            <FormField id="u-email" label="Email" required error={errors.email} className="span-2"><input type="email" value={form.email} onChange={set("email")} autoComplete="off" /></FormField>
            <FormField id="u-pass" label="Temporary password" hint="At least 10 characters, with letters and numbers." required error={errors.password} className="span-2"><input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" /></FormField>
            <FormField id="u-role" label="Role" required error={errors.role}><select value={form.role} onChange={set("role")}><option value="district">District Admin</option><option value="superadmin">Super Admin</option></select></FormField>
            {form.role === "district" && <FormField id="u-district" label="District" required error={errors.district}><select value={form.district} onChange={set("district")}><option value="">Choose…</option>{(meta?.districts || []).map((d) => <option key={d}>{d}</option>)}</select></FormField>}
          </form>
        </Modal>
      )}
    </>
  );
}
