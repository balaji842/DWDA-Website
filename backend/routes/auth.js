const r = require("express").Router();
const c = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimit");
r.post("/login", loginLimiter, c.login);
r.get("/me", protect, c.me);
r.post("/change-password", protect, c.changePassword);
module.exports = r;
