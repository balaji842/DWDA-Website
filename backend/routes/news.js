const r = require("express").Router();
const c = require("../controllers/publicController");
r.get("/", c.listNews);
r.get("/:slug", c.getNews);
module.exports = r;
