const rateLimit = require("express-rate-limit");

const make = (windowMin, max, message) =>
  rateLimit({ windowMs: windowMin * 60 * 1000, max, standardHeaders: true, legacyHeaders: false, message: { message } });

module.exports = {
  apiLimiter: make(15, 600, "Too many requests. Wait a few minutes and try again."),
  loginLimiter: make(15, 10, "Too many sign-in attempts. Wait 15 minutes and try again."),
  trackLimiter: make(15, 30, "Too many tracking attempts. Wait 15 minutes and try again."),
  applyLimiter: make(60, 20, "Too many applications from this connection. Try again later."),
};
