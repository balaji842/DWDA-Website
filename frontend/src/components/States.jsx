import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";
import { errorInfo } from "../services/api.js";

export function Skeleton({ h = 16, w = "100%", style }) {
  return <span className="skeleton" style={{ display: "block", height: h, width: w, ...style }} aria-hidden="true" />;
}

export function CardSkeletons({ n = 4, h = 150, className = "grid-4" }) {
  const { t } = useLang();
  return (
    <div className={className} aria-busy="true">
      <span className="sr-only" role="status">{t("common.loading")}</span>
      {Array.from({ length: n }, (_, i) => <Skeleton key={i} h={h} style={{ borderRadius: 12 }} />)}
    </div>
  );
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="empty-state">
      <Inbox aria-hidden="true" />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const { t } = useLang();
  const msg = error ? errorInfo(error).message : t("common.loadError");
  return (
    <div className="notice notice-error" role="alert">
      <AlertCircle aria-hidden="true" />
      <div>
        <p>{msg}</p>
        {onRetry && <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={onRetry}><RefreshCw aria-hidden="true" /> {t("common.retry")}</button>}
      </div>
    </div>
  );
}

export function Notice({ kind = "info", icon: Icon = AlertCircle, children }) {
  return <div className={`notice notice-${kind}`}><Icon aria-hidden="true" /><div>{children}</div></div>;
}
