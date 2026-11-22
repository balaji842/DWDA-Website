const r = require("express").Router();
const c = require("../controllers/publicController");
r.get("/institutions", c.listInstitutions);
r.get("/settings", c.getSettings);
r.get("/meta", c.getMeta);
module.exports = r;
