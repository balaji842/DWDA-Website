const r = require("express").Router();
const c = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/auth");
const { documentUpload } = require("../middleware/upload");

const SUPER = requireRole("superadmin");
r.use(protect); // every admin route needs a signed-in official

r.get("/stats", c.stats);

r.get("/applications", c.listApplications);
r.get("/applications/:id", c.getApplication);
r.patch("/applications/:id/status", c.updateStatus);
r.patch("/applications/:id/documents/:docId", c.verifyDocument);
r.get("/applications/:id/documents/:docId/file", c.downloadApplicationDocument);

r.get("/schemes", c.listSchemesAdmin);
r.post("/schemes", SUPER, c.createScheme);
r.put("/schemes/:id", SUPER, c.updateScheme);
r.delete("/schemes/:id", SUPER, c.deleteScheme);

r.get("/news", c.listNewsAdmin);
r.post("/news", SUPER, c.createNews);
r.put("/news/:id", SUPER, c.updateNews);
r.delete("/news/:id", SUPER, c.deleteNews);

r.get("/districts", c.listDistrictsAdmin);
r.put("/districts/:id", c.updateDistrict); // district admins: own office only

r.get("/documents", c.listDocumentsAdmin);
r.post("/documents", SUPER, documentUpload.single("file"), c.createDocument);
r.put("/documents/:id", SUPER, documentUpload.single("file"), c.updateDocument);
r.delete("/documents/:id", SUPER, c.deleteDocument);

r.get("/institutions", c.listInstitutionsAdmin);
r.post("/institutions", c.createInstitution);
r.put("/institutions/:id", c.updateInstitution);
r.delete("/institutions/:id", c.deleteInstitution);

r.put("/settings", SUPER, c.updateSettings);

r.get("/users", SUPER, c.listAdmins);
r.post("/users", SUPER, c.createAdmin);
r.patch("/users/:id", SUPER, c.updateAdmin);

module.exports = r;
