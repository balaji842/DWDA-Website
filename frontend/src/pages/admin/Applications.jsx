import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import useApi from "../../hooks/useApi.js";
import { fmtDate } from "../../hooks/format.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState, Skeleton } from "../../components/States.jsx";
import { STATUS_LABEL, STATUS_ORDER } from "../../components/status.js";

export default function Applications() {
  const { admin } = useAuth();
  const { meta } = useSite();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const query = Object.fromEntries(params.entries());
  const page = Number(query.page) || 1;
  const { data, loading, error, reload } = useApi("/admin/applications", { ...query, limit: 20 });
  const schemes = useApi("/admin/schemes");
  useEffect(() => setQ(params.get("q") || ""), [params]);

  const set = (k, v) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v); else n.delete(k);
    if (k !== "page") n.delete("page");
    setParams(n);
  };

  return (
    <>
      <h1 style={{ fontSize: "1.45rem", marginBottom: 16 }}>Applications</h1>
      <div className="toolbar">
        <form role="search" onSubmit={(e) => { e.preventDefault(); set("q", q.trim()); }} className="field" style={{ minWidth: "min(320px,100%)" }}>
          <label htmlFor="app-q">Search</label>
          <div className="search-row"><input id="app-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference, name or mobile" />
            <button className="btn btn-primary" type="submit" aria-label="Search applications"><Search aria-hidden="true" /></button></div>
        </form>
        <div className="field"><label htmlFor="app-status">Status</label>
          <select id="app-status" value={query.status || ""} onChange={(e) => set("status", e.target.value)}>
            <option value="">All</option><option value="pending">All pending</option><option value="granted">Approved or completed</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABEL.en[s]}</option>)}
          </select></div>
        <div className="field"><label htmlFor="app-scheme">Scheme</label>
          <select id="app-scheme" value={query.scheme || ""} onChange={(e) => set("scheme", e.target.value)}>
            <option value="">All</option>{(schemes.data?.items || []).map((s) => <option key={s.slug} value={s.slug}>{s.title.en}</option>)}
          </select></div>
        {admin.role === "superadmin" && (
          <div className="field"><label htmlFor="app-district">District</label>
            <select id="app-district" value={query.district || ""} onChange={(e) => set("district", e.target.value)}>
              <option value="">All</option>{(meta?.districts || []).map((d) => <option key={d}>{d}</option>)}
            </select></div>
        )}
      </div>
      {loading && <Skeleton h={240} style={{ borderRadius: 12 }} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (data.items.length ? (
        <>
          <p className="hint" aria-live="polite" style={{ marginBottom: 8 }}>{data.total} application{data.total === 1 ? "" : "s"}</p>
          <div className="table-wrap">
            <table className="data">
              <caption className="sr-only">Applications</caption>
              <thead><tr><th scope="col">Reference</th><th scope="col">Applicant</th><th scope="col">Scheme</th><th scope="col">District</th><th scope="col">Submitted</th><th scope="col">Status</th></tr></thead>
              <tbody>{data.items.map((a) => (
                <tr key={a._id}>
                  <td><Link to={`/admin/applications/${a._id}`}>{a.referenceNo}</Link></td>
                  <td>{a.applicantName}<div className="hint">{a.mobile}</div></td>
                  <td>{a.scheme?.title?.en || "—"}</td><td>{a.district}</td><td>{fmtDate(a.createdAt)}</td><td><StatusBadge status={a.status} /></td>
                </tr>))}
              </tbody>
            </table>
          </div>
          <nav className="pagination" aria-label="Pagination">
            <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => set("page", String(page - 1))}>Previous</button>
            <span>Page {data.page} of {data.pages}</span>
            <button type="button" className="btn btn-ghost btn-sm" disabled={page >= data.pages} onClick={() => set("page", String(page + 1))}>Next</button>
          </nav>
        </>
      ) : <EmptyState title="No applications match">Change the filters or clear the search.</EmptyState>)}
    </>
  );
}
