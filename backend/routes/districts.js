const r = require("express").Router();
const c = require("../controllers/publicController");
r.get("/", c.listDistricts);
r.get("/:district", c.getDistrict);
module.exports = r;
