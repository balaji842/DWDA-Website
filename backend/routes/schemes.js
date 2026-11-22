const r = require("express").Router();
const c = require("../controllers/publicController");
r.get("/", c.listSchemes);
r.get("/:slug", c.getScheme);
module.exports = r;
