const AppError = require("./AppError");

// Small, dependency-free validators. Each returns an error message or "".
const v = {
  required: (val) => (val === undefined || val === null || String(val).trim() === "" ? "This field is required." : ""),
  mobile: (val) => (/^[6-9]\d{9}$/.test(String(val || "")) ? "" : "Enter a 10-digit mobile number starting with 6, 7, 8 or 9."),
  email: (val) => (!val || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val) ? "" : "Enter a valid email address, like name@example.com."),
  percentage: (val) => {
    const n = Number(val);
    return Number.isFinite(n) && n >= 0 && n <= 100 ? "" : "Enter a number from 0 to 100.";
  },
  pastDate: (val) => {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return "Enter a valid date.";
    if (d > new Date()) return "Date of birth cannot be in the future.";
    if (d.getFullYear() < 1900) return "Enter a year after 1900.";
    return "";
  },
  oneOf: (list) => (val) => (list.includes(val) ? "" : "Choose an option from the list."),
  maxLen: (n) => (val) => (String(val || "").length <= n ? "" : `Keep this under ${n} characters.`),
  udid: (val) => (!val || /^[A-Za-z0-9\-/ ]{6,30}$/.test(val) ? "" : "Enter the number as printed on your card."),
};

// rules: { field: [validator, ...] }. Throws a 422 with every field error at once.
function check(body, rules) {
  const errors = {};
  for (const [field, list] of Object.entries(rules)) {
    for (const fn of list) {
      const msg = fn(body[field]);
      if (msg) { errors[field] = msg; break; }
    }
  }
  if (Object.keys(errors).length) throw new AppError(422, "Some fields need attention.", errors);
}

const clean = (s, max = 500) => String(s ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { v, check, clean, escapeRegex };
