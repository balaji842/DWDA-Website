import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);

  const dismiss = useCallback((tid) => setToasts((ts) => ts.filter((t) => t.id !== tid)), []);
  const show = useCallback((message, type = "success") => {
    const tid = ++id.current;
    setToasts((ts) => [...ts, { id: tid, message, type }]);
    window.setTimeout(() => dismiss(tid), type === "error" ? 8000 : 5000);
  }, [dismiss]);

  const value = useMemo(() => ({ success: (m) => show(m, "success"), error: (m) => show(m, "error") }), [show]);
  const ok = toasts.filter((t) => t.type !== "error");
  const bad = toasts.filter((t) => t.type === "error");

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* polite region for confirmations, assertive for errors */}
      <div className="toasts" aria-live="polite" role="status">
        {ok.map((t) => (
          <div key={t.id} className="toast"><CheckCircle2 aria-hidden="true" /><span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss"><X size={16} aria-hidden="true" /></button></div>
        ))}
      </div>
      <div className="toasts" style={{ bottom: ok.length ? 90 : 16 }} aria-live="assertive" role="alert">
        {bad.map((t) => (
          <div key={t.id} className="toast error"><AlertCircle aria-hidden="true" /><span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss"><X size={16} aria-hidden="true" /></button></div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
