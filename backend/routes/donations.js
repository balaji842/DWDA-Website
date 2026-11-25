const r = require("express").Router();
const c = require("../controllers/donationController");
const rateLimit = require("express-rate-limit");
const donateLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false, message: { message: "Too many donation attempts. Try again later." } });

r.get("/stats", c.publicStats);
r.get("/needs", c.listNeeds);
r.get("/institutions", c.listInstitutions);
r.get("/institutions/:id", c.getInstitution);
r.post("/", donateLimiter, c.createDonation);
r.get("/:id", c.getDonation);                     // needs ?token=
r.post("/:id/test-pay", donateLimiter, c.testPay); // TEST ONLY until a payment gateway is connected
module.exports = r;