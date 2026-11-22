import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi.js";
import { fmtDate } from "../../hooks/format.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { CardSkeletons, EmptyState, ErrorState } from "../../components/States.jsx";
import { STATUS_LABEL } from "../../components/status.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Dashboard() {
  const { admin } = useAuth();
  const { data, loading, error, reload } = useApi("/admin/stats");
  const kpis = data ? [["Total applications", data.total, ""], ["Pending", data.pending, "pending"], ["Approved or completed", data.approved, "granted"], ["Rejected", data.rejected, "rejected"]] : [];
  return (
    <>
      <h1 style={{ fontSize: "1.45rem", marginBottom: 4 }}>Overview</h1>
      <p className="muted" style={{ marginBottom: 20 }}>{admin.role === "district" ? `Applications from ${admin.district} district.` : "Applications from all districts."}</p>
      {loading && <CardSkeletons n={4} h={96} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <>
          <ul className="grid-4" style={{ listStyle: "none" }}>
            {kpis.map(([label, n, filter]) => (
              <li key={label}><Link className="card card-link kpi" to={filter ? `/admin/applications?status=${filter}` : "/admin/applications"}>
                <span className="kpi-label">{label}</span><p className="kpi-value">{n}</p></Link></li>
            ))}
          </ul>
          <div className="grid-2" style={{ marginTop: 20, alignItems: "start" }}>
            <section className="card card-pad">
              <h2 style={{ fontSize: "1.05rem", marginBottom: 12 }}>By status</h2>
              <table className="data"><tbody>
                {Object.entries(data.byStatus).map(([s, n]) => (
                  <tr key={s}><td><Link to={`/admin/applications?status=${s}`}>{STATUS_LABEL.en[s]}</Link></td><td style={{ textAlign: "right", fontWeight: 600 }}>{n}</td></tr>
                ))}
              </tbody></table>
            </section>
            <section className="card card-pad">
              <h2 style={{ fontSize: "1.05rem", marginBottom: 12 }}>Latest applications</h2>
              {data.recent.length ? (
                <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
                  {data.recent.map((a) => (
                    <li key={a._id} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                      <span><Link to={`/admin/applications/${a._id}`}>{a.referenceNo}</Link><br /><span className="hint">{a.applicantName} · {a.district} · {fmtDate(a.createdAt)}</span></span>
                      <StatusBadge status={a.status} />
                    </li>
                  ))}
                </ul>
              ) : <EmptyState title="No applications yet">They will appear here as people apply on the website.</EmptyState>}
            </section>
          </div>
        </>
      )}
    </>
  );
}
