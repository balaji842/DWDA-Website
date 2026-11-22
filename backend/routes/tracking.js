const r = require("express").Router();
const c = require("../controllers/trackingController");
const { trackLimiter } = require("../middleware/rateLimit");
r.post("/", trackLimiter, c.track);
module.exports = r;
