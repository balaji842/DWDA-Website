const r = require("express").Router();
const c = require("../controllers/applicationController");
const { applicationUpload } = require("../middleware/upload");
const { applyLimiter } = require("../middleware/rateLimit");
r.post("/", applyLimiter, applicationUpload.array("documents", 5), c.createApplication);
module.exports = r;
