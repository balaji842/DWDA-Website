import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { errorInfo } from "../../services/api.js";
import FormField from "../../components/FormField.jsx";
import { Notice } from "../../components/States.jsx";
import { Emblem } from "../../components/SiteHeader.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";

export default function Login() {
  useDocumentTitle("Officials sign in");
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(params.get("expired") ? "Your session ended. Sign in again." : "");
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = "Enter your email address.";
    if (!password) errs.password = "Enter your password.";
    setErrors(errs);
    if (Object.keys(errs).length) { document.getElementById(errs.email ? "email" : "password").focus(); return; }
    setBusy(true); setMessage("");
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setMessage(errorInfo(err).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <main className="card auth-card">
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <Emblem />
          <div><p style={{ fontWeight: 600, lineHeight: 1.3 }}>Department for Welfare of the Differently Abled</p><p className="hint">Officials only</p></div>
        </div>
        <h1 style={{ fontSize: "1.4rem", marginBottom: 16 }} tabIndex={-1}>Sign in</h1>
        {message && <div style={{ marginBottom: 16 }} role="alert"><Notice kind="error">{message}</Notice></div>}
        <form onSubmit={submit} noValidate style={{ display: "grid", gap: 16 }}>
          <FormField id="email" label="Email" required error={errors.email}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></FormField>
          <FormField id="password" label="Password" required error={errors.password}><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></FormField>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <p style={{ marginTop: 20, fontSize: ".875rem" }}><Link to="/">Back to the public website</Link></p>
      </main>
    </div>
  );
}
