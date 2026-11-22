import { useLang } from "../context/LanguageContext.jsx";
import { STATUS_LABEL } from "./status.js";

export default function StatusBadge({ status }) {
  const { lang } = useLang();
  return <span className={`status-badge s-${status}`}>{STATUS_LABEL[lang]?.[status] || status}</span>;
}
