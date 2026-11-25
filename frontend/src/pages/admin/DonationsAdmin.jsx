import { useState } from "react";
import { Download, Search } from "lucide-react";
import useApi from "../../hooks/useApi.js";
import api from "../../services/api.js";
import { fmtDateTime } from "../../hooks/format.js";
import { EmptyState, ErrorState, Notice, Skeleton } from "../../components/States.jsx";
import { money } from "../donate/strings.js";

const TYPE = { quick: "Quick cash", need: "Specific need", institution: "Institution" };
const typeLabel = (d) => (d.type === "need" ? `Specific need (${d.mode === "kind" ? "kind" : "cash"})` : TYPE[d.type]);

export default function DonationsAdmin() {
  const [q, setQ] = useState(""); const [f, setF] = useState({ status: "", type: "", q: "", page: 1 });
  const { data, loading, error, reload } = useApi("/admin/donations", { ...f, limit: 20 });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v, page: k === "page" ? v : 1 }));
  const exportCsv = async () => {
    const { data: all } = await api.get("/admin/donations", { params: { ...f, page: 1, limit: 500 } });
    const rows = [["Receipt", "Date", "Type", "Mode", "Status", "Amount", "Donor", "Organisation", "Email", "Mobile", "PAN", "Tax receipt", "Donated to", "Payment ref", "Mode"]]
      .concat(all.items.map((d) => [d.receiptNo, d.createdAt, TYPE[d.type], d.mode || "cash", d.status, d.amount, d.donor.name, d.donor.organisation, d.donor.email, d.donor.mobile, d.donor.pan, d.wantsTaxReceipt ? "yes" : "no",
        d.type === "institution" ? d.institutionName : d.type === "need" ? d.items.map((i) => `${i.title.en} x${i.quantity}`).join("; ") : `${d.purpose}${d.district ? ` / ${d.district}` : ""}`, d.payment?.reference, d.payment?.mode]));
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "donations.csv"; a.click();
  };
  const paid = (data?.summary || []).reduce((s, x) => s + x.total, 0);
  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <div><h1 style={{ fontSize: "1.45rem", marginBottom: 4 }}>Donations</h1>
          <p className="muted"></p></div>
        <button type="button" className="btn btn-outline" onClick={exportCsv}><Download aria-hidden="true" /> Export CSV</button>
      </div>
      {data && (
        <ul className="grid-4" style={{ listStyle: "none", marginBottom: 18 }}>
          <li className="card kpi"><span className="kpi-label">Received (paid)</span><p className="kpi-value">{money(paid)}</p></li>
          {["quick", "need", "institution"].map((t) => { const x = data.summary.find((s) => s._id === t); return <li key={t} className="card kpi"><span className="kpi-label">{TYPE[t]}</span><p className="kpi-value" style={{ fontSize: "1.4rem" }}>{money(x?.total || 0)}</p><span className="hint">{x?.count || 0} donations</span></li>; })}
        </ul>
      )}
      <div className="toolbar">
        <form role="search" className="field" style={{ minWidth: "min(320px,100%)" }} onSubmit={(e) => { e.preventDefault(); set("q", q.trim()); }}>
          <label htmlFor="d-q">Search</label>
          <div className="search-row"><input id="d-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Receipt, donor, email, mobile" /><button className="btn btn-primary" aria-label="Search"><Search aria-hidden="true" /></button></div>
        </form>
        <div className="field"><label htmlFor="d-s">Status</label><select id="d-s" value={f.status} onChange={(e) => set("status", e.target.value)}><option value="">All</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="pledged">Pledged (kind)</option></select></div>
        <div className="field"><label htmlFor="d-t">Type</label><select id="d-t" value={f.type} onChange={(e) => set("type", e.target.value)}><option value="">All</option>{Object.entries(TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      </div>
      {loading && <Skeleton h={240} />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (data.items.length ? (
        <>
          <div className="table-wrap"><table className="data"><caption className="sr-only">Donations</caption>
            <thead><tr><th scope="col">Receipt</th><th scope="col">Date</th><th scope="col">Donor</th><th scope="col">Type</th><th scope="col">Donated to</th><th scope="col" style={{ textAlign: "right" }}>Amount</th><th scope="col">Status</th></tr></thead>
            <tbody>{data.items.map((d) => (
              <tr key={d._id}>
                <td>{d.receiptNo}{d.status !== "pledged" && d.payment?.mode === "test" && <div className="hint">test</div>}</td><td>{fmtDateTime(d.createdAt)}</td>
                <td>{d.donor.organisation || d.donor.name}<div className="hint">{d.donor.email} · {d.donor.mobile}{d.anonymous ? " · anonymous" : ""}</div></td>
                <td>{typeLabel(d)}{d.disability && <div className="hint">{d.disability}</div>}</td>
                <td>{d.type === "institution" ? d.institutionName : d.type === "need" ? d.items.map((i) => `${i.title.en} ×${i.quantity}`).join(", ") : `${d.purpose}${d.district ? ` · ${d.district}` : ""}`}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{money(d.amount)}</td>
                <td><span className={`status-badge ${d.status === "paid" ? "s-approved" : d.status === "failed" ? "s-rejected" : d.status === "pledged" ? "s-submitted" : "s-under-verification"}`}>{d.status === "pledged" ? "pledged (kind)" : d.status}</span></td>
              </tr>))}</tbody></table></div>
          <nav className="pagination" aria-label="Pagination">
            <button type="button" className="btn btn-ghost btn-sm" disabled={f.page <= 1} onClick={() => set("page", f.page - 1)}>Previous</button>
            <span>Page {data.page} of {data.pages}</span>
            <button type="button" className="btn btn-ghost btn-sm" disabled={f.page >= data.pages} onClick={() => set("page", f.page + 1)}>Next</button>
          </nav>
        </>
      ) : <EmptyState title="No donations yet">They will appear here as people donate.</EmptyState>)}
      <div style={{ marginTop: 16 }}><Notice kind="info">Donor details are personal data. Share exports only with officials who need them.</Notice></div>
    </>
  );
}