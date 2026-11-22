const r = require("express").Router();
const c = require("../controllers/publicController");
r.get("/", c.listDocuments);
r.get("/:id/file", c.downloadDocument);
module.exports = r;
