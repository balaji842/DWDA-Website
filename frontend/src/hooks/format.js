export const fmtDate = (d, lang = "en") => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
export const fmtDateTime = (d, lang = "en") => (d ? new Date(d).toLocaleString(lang === "ta" ? "ta-IN" : "en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "");
export const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round((b || 0) / 1024))} KB`);
