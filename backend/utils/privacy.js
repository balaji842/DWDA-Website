// "Lakshmi Narayanan" -> "La***** Na*******"
const maskName = (name = "") =>
  name.split(/\s+/).filter(Boolean).map((w) => (w.length <= 2 ? `${w[0]}*` : w.slice(0, 2) + "*".repeat(w.length - 2))).join(" ");

const maskMobile = (m = "") => (m.length === 10 ? `${m.slice(0, 2)}******${m.slice(-2)}` : "");

module.exports = { maskName, maskMobile };
