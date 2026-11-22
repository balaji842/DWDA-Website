const fs = require("fs");
const path = require("path");
const Application = require("../models/Application");
const Scheme = require("../models/Scheme");
const News = require("../models/News");
const DistrictOffice = require("../models/DistrictOffice");
const Document = require("../models/Document");
const Institution = require("../models/Institution");
const Setting = require("../models/Setting");
const Admin = require("../models/Admin");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { v, check, clean, escapeRegex } = require("../utils/validate");
const { districtScope } = require("../middleware/auth");
const { DIRS, removeFiles } = require("../middleware/upload");
const { STATUSES, STATUS_FLOW, DISTRICTS, CATEGORIES } = require("../config/constants");
const { publicAdmin } = require("./authController");
const sms = require("../services/smsService");

const pageOf = (q) => {
  const limit = Math.min(Math.max(Number(q.limit) || 20, 1), 100);
  const page = Math.max(Number(q.page) || 1, 1);
  return { limit, page, skip: (page - 1) * limit };
};
const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));
const bi = (val) => (val && typeof val === "object" ? { en: clean(val.en, 5000), ta: clean(val.ta, 5000) } : undefined);

// ---------------- dashboard
exports.stats = asyncHandler(async (req, res) => {
  const scope = districtScope(req.admin);
  const rows = await Application.aggregate([{ $match: scope }, { $group: { _id: "$status", n: { $sum: 1 } } }]);
  const by = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  rows.forEach((r) => { by[r._id] = r.n; });
  const total = Object.values(by).reduce((a, b) => a + b, 0);
  const recent = await Application.find(scope).sort({ createdAt: -1 }).limit(5).populate("scheme", "title").select("referenceNo applicantName district status createdAt scheme");
  res.json({
    total,
    pending: by.submitted + by["under-verification"] + by["documents-required"],
    approved: by.approved + by.completed,
    rejected: by.rejected,
    byStatus: by,
    recent,
  });
});

// ---------------- applications
exports.listApplications = asyncHandler(async (req, res) => {
  const { limit, page, skip } = pageOf(req.query);
  const filter = { ...districtScope(req.admin) };
  if (req.query.status === "pending") filter.status = { $in: ["submitted", "under-verification", "documents-required"] };
  else if (req.query.status === "granted") filter.status = { $in: ["approved", "completed"] };
  else if (req.query.status && STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (req.query.district && req.admin.role === "superadmin" && DISTRICTS.includes(req.query.district)) filter.district = req.query.district;
  if (req.query.scheme) {
    const s = await Scheme.findOne({ slug: req.query.scheme }).select("_id");
    filter.scheme = s ? s._id : null;
  }
  const q = clean(req.query.q, 60);
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ referenceNo: rx }, { applicantName: rx }, { mobile: rx }];
  }
  const [items, total] = await Promise.all([
    Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("scheme", "title slug").select("-history -documents"),
    Application.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});

async function scopedApplication(req) {
  const app = await Application.findOne({ _id: req.params.id, ...districtScope(req.admin) })
    .populate("scheme", "title slug")
    .populate("history.by", "name")
    .populate("documents.verifiedBy", "name");
  if (!app) throw new AppError(404, "Application not found, or it belongs to another district.");
  return app;
}

exports.getApplication = asyncHandler(async (req, res) => {
  const app = await scopedApplication(req);
  res.json({ application: app, nextStatuses: STATUS_FLOW[app.status] });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const app = await scopedApplication(req);
  const status = req.body.status;
  if (!STATUS_FLOW[app.status].includes(status)) {
    throw new AppError(422, `An application that is "${app.status}" can't move to "${status}".`);
  }
  const remark = clean(req.body.remark, 500);
  if (["documents-required", "rejected"].includes(status) && !remark) {
    throw new AppError(422, "Some fields need attention.", { remark: "Tell the applicant why, so they know what to do next." });
  }
  app.status = status;
  app.history.push({ status, remark, internalNote: clean(req.body.internalNote, 1000), by: req.admin._id });
  await app.save();
  sms.send(app.mobile, `Application ${app.referenceNo}: status is now ${status.replace(/-/g, " ")}.`);
  res.json({ application: await scopedApplication(req), nextStatuses: STATUS_FLOW[app.status] });
});

exports.verifyDocument = asyncHandler(async (req, res) => {
  const app = await scopedApplication(req);
  const doc = app.documents.id(req.params.docId);
  if (!doc) throw new AppError(404, "Document not found.");
  doc.verified = Boolean(req.body.verified);
  doc.verifiedBy = doc.verified ? req.admin._id : undefined;
  doc.verifiedAt = doc.verified ? new Date() : undefined;
  await app.save();
  res.json({ application: await scopedApplication(req) });
});

// Applicant documents are only ever served here: signed-in officials, own district.
exports.downloadApplicationDocument = asyncHandler(async (req, res) => {
  const app = await scopedApplication(req);
  const doc = app.documents.id(req.params.docId);
  if (!doc) throw new AppError(404, "Document not found.");
  const file = path.join(DIRS.applications, path.basename(doc.storedName));
  if (!fs.existsSync(file)) throw new AppError(404, "The file is missing on the server.");
  res.setHeader("Content-Type", doc.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${(doc.originalName || doc.storedName).replace(/[^\w.\- ]/g, "_")}"`);
  res.setHeader("Cache-Control", "private, no-store");
  res.sendFile(file);
});

// ---------------- schemes (super admin)
const SCHEME_FIELDS = ["slug", "category", "audiences", "verified", "acceptsOnline", "order", "active"];
const SCHEME_TEXT = ["title", "summary", "description", "eligibility", "documentsRequired", "benefits", "howToApply"];
const schemeBody = (b) => {
  const out = pick(b, SCHEME_FIELDS);
  SCHEME_TEXT.forEach((k) => { if (b[k] !== undefined) out[k] = bi(b[k]); });
  if (out.category && !CATEGORIES.includes(out.category)) throw new AppError(422, "Some fields need attention.", { category: "Choose a category." });
  return out;
};

exports.listSchemesAdmin = asyncHandler(async (req, res) => res.json({ items: await Scheme.find().sort({ order: 1 }) }));
exports.createScheme = asyncHandler(async (req, res) => {
  const body = schemeBody(req.body);
  if (!body.title?.en) throw new AppError(422, "Some fields need attention.", { title: "Enter the English title." });
  res.status(201).json({ item: await Scheme.create(body) });
});
exports.updateScheme = asyncHandler(async (req, res) => {
  const item = await Scheme.findByIdAndUpdate(req.params.id, schemeBody(req.body), { new: true, runValidators: true });
  if (!item) throw new AppError(404, "Scheme not found.");
  res.json({ item });
});
exports.deleteScheme = asyncHandler(async (req, res) => {
  const used = await Application.exists({ scheme: req.params.id });
  if (used) throw new AppError(409, "Applications exist for this scheme. Hide it (set it inactive) instead of deleting.");
  const item = await Scheme.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError(404, "Scheme not found.");
  res.json({ message: "Scheme deleted." });
});

// ---------------- news
const newsBody = (b) => {
  const out = pick(b, ["slug", "isSample", "published"]);
  ["title", "summary", "body"].forEach((k) => { if (b[k] !== undefined) out[k] = bi(b[k]); });
  if (b.date !== undefined) out.date = new Date(b.date);
  if (!out.slug && out.title?.en) out.slug = `${out.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}-${Date.now().toString(36)}`;
  return out;
};
exports.listNewsAdmin = asyncHandler(async (req, res) => res.json({ items: await News.find().sort({ date: -1 }) }));
exports.createNews = asyncHandler(async (req, res) => {
  check({ ...req.body, titleEn: req.body.title?.en }, { titleEn: [v.required], date: [v.required] });
  res.status(201).json({ item: await News.create(newsBody(req.body)) });
});
exports.updateNews = asyncHandler(async (req, res) => {
  const item = await News.findByIdAndUpdate(req.params.id, newsBody(req.body), { new: true, runValidators: true });
  if (!item) throw new AppError(404, "Announcement not found.");
  res.json({ item });
});
exports.deleteNews = asyncHandler(async (req, res) => {
  if (!(await News.findByIdAndDelete(req.params.id))) throw new AppError(404, "Announcement not found.");
  res.json({ message: "Announcement deleted." });
});

// ---------------- district offices (district admins: own office only)
exports.listDistrictsAdmin = asyncHandler(async (req, res) => {
  res.json({ items: await DistrictOffice.find(districtScope(req.admin)).sort({ district: 1 }) });
});
exports.updateDistrict = asyncHandler(async (req, res) => {
  const b = req.body;
  check(b, { email: [v.email] });
  const fields = {};
  ["districtTa", "officeName", "address", "phone", "email", "hours", "mapUrl"].forEach((k) => {
    if (b[k] !== undefined) fields[k] = clean(b[k], 600);
  });
  if (fields.mapUrl && !/^https:\/\//.test(fields.mapUrl)) throw new AppError(422, "Some fields need attention.", { mapUrl: "Use a full https:// map link." });
  if (b.verified !== undefined) fields.verified = Boolean(b.verified);
  const item = await DistrictOffice.findOneAndUpdate({ _id: req.params.id, ...districtScope(req.admin) }, fields, { new: true });
  if (!item) throw new AppError(404, "Office not found, or it belongs to another district.");
  res.json({ item });
});

// ---------------- public documents
exports.listDocumentsAdmin = asyncHandler(async (req, res) => res.json({ items: await Document.find().sort({ order: 1 }) }));
const docBody = (b) => {
  const out = {};
  if (b.titleEn !== undefined || b.title) out.title = { en: clean(b.titleEn ?? b.title?.en, 300), ta: clean(b.titleTa ?? b.title?.ta, 300) };
  ["kind", "goNumber", "externalUrl"].forEach((k) => { if (b[k] !== undefined) out[k] = clean(b[k], 300); });
  if (b.year !== undefined && b.year !== "") out.year = Number(b.year);
  if (b.order !== undefined) out.order = Number(b.order) || 0;
  if (b.published !== undefined) out.published = b.published === true || b.published === "true";
  if (out.externalUrl && !/^https:\/\//.test(out.externalUrl)) throw new AppError(422, "Some fields need attention.", { externalUrl: "Use a full https:// link." });
  return out;
};
const attachFile = (out, file) => {
  if (!file) return;
  const head = Buffer.alloc(4);
  const fd = fs.openSync(file.path, "r"); fs.readSync(fd, head, 0, 4, 0); fs.closeSync(fd);
  if (head.toString() !== "%PDF") { removeFiles([file]); throw new AppError(400, "That file is not a PDF."); }
  Object.assign(out, { storedName: file.filename, originalName: clean(file.originalname, 150), size: file.size });
};
exports.createDocument = asyncHandler(async (req, res) => {
  const body = docBody(req.body);
  if (!body.title?.en) { removeFiles(req.file ? [req.file] : []); throw new AppError(422, "Some fields need attention.", { titleEn: "Enter a title." }); }
  attachFile(body, req.file);
  res.status(201).json({ item: await Document.create(body) });
});
exports.updateDocument = asyncHandler(async (req, res) => {
  const existing = await Document.findById(req.params.id);
  if (!existing) { removeFiles(req.file ? [req.file] : []); throw new AppError(404, "Document not found."); }
  const body = docBody(req.body);
  attachFile(body, req.file);
  if (req.file && existing.storedName) fs.promises.unlink(path.join(DIRS.documents, existing.storedName)).catch(() => {});
  if (req.body.removeFile === "true" && !req.file && existing.storedName) {
    fs.promises.unlink(path.join(DIRS.documents, existing.storedName)).catch(() => {});
    Object.assign(body, { storedName: "", originalName: "", size: undefined });
  }
  res.json({ item: await Document.findByIdAndUpdate(req.params.id, body, { new: true }) });
});
exports.deleteDocument = asyncHandler(async (req, res) => {
  const item = await Document.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError(404, "Document not found.");
  if (item.storedName) fs.promises.unlink(path.join(DIRS.documents, item.storedName)).catch(() => {});
  res.json({ message: "Document deleted." });
});

// ---------------- institutions
const instBody = (b) => {
  const out = pick(b, ["type", "district", "managedBy", "isSample", "published"]);
  ["name", "address", "phone"].forEach((k) => { if (b[k] !== undefined) out[k] = clean(b[k], 300); });
  return out;
};
exports.listInstitutionsAdmin = asyncHandler(async (req, res) => {
  res.json({ items: await Institution.find(districtScope(req.admin)).sort({ district: 1, name: 1 }) });
});
exports.createInstitution = asyncHandler(async (req, res) => {
  const body = instBody(req.body);
  if (req.admin.role === "district") body.district = req.admin.district;
  res.status(201).json({ item: await Institution.create(body) });
});
exports.updateInstitution = asyncHandler(async (req, res) => {
  const body = instBody(req.body);
  if (req.admin.role === "district") delete body.district;
  const item = await Institution.findOneAndUpdate({ _id: req.params.id, ...districtScope(req.admin) }, body, { new: true, runValidators: true });
  if (!item) throw new AppError(404, "Institution not found.");
  res.json({ item });
});
exports.deleteInstitution = asyncHandler(async (req, res) => {
  const item = await Institution.findOneAndDelete({ _id: req.params.id, ...districtScope(req.admin) });
  if (!item) throw new AppError(404, "Institution not found.");
  res.json({ message: "Institution deleted." });
});

// ---------------- site settings (super admin)
exports.updateSettings = asyncHandler(async (req, res) => {
  const b = req.body;
  check(b, { officeEmail: [v.email] });
  const fields = { lastUpdated: new Date() };
  ["helpline", "officeAddress", "officeEmail", "officePhone", "whatsapp", "videoCall"].forEach((k) => { if (b[k] !== undefined) fields[k] = clean(b[k], 300); });
  if (b.stats) ["populationFigure", "schemesFigure", "rehabHomesFigure", "specialSchoolsFigure"].forEach((k) => {
    if (b.stats[k] !== undefined) fields[`stats.${k}`] = clean(b.stats[k], 40);
  });
  const s = await Setting.findOneAndUpdate({ key: "site" }, { $set: fields }, { new: true, upsert: true });
  res.json({ settings: s });
});

// ---------------- admin users (super admin)
exports.listAdmins = asyncHandler(async (req, res) => {
  const items = await Admin.find().sort({ role: 1, name: 1 });
  res.json({ items: items.map((a) => ({ ...publicAdmin(a), active: a.active, lastLoginAt: a.lastLoginAt })) });
});
exports.createAdmin = asyncHandler(async (req, res) => {
  const b = req.body;
  check(b, {
    name: [v.required], email: [v.required, v.email], role: [v.oneOf(["superadmin", "district"])],
    password: [v.required, (p) => (/^(?=.*[A-Za-z])(?=.*\d).{10,}$/.test(p) ? "" : "Use at least 10 characters, with letters and numbers.")],
  });
  if (b.role === "district" && !DISTRICTS.includes(b.district)) throw new AppError(422, "Some fields need attention.", { district: "Choose the district this admin manages." });
  const a = await Admin.create({ name: clean(b.name, 100), email: b.email, password: b.password, role: b.role, district: b.role === "district" ? b.district : null });
  res.status(201).json({ item: publicAdmin(a) });
});
exports.updateAdmin = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.admin._id) && req.body.active === false) throw new AppError(422, "You can't deactivate your own account.");
  const a = await Admin.findById(req.params.id);
  if (!a) throw new AppError(404, "Admin not found.");
  if (req.body.active !== undefined) a.active = Boolean(req.body.active);
  if (req.body.name) a.name = clean(req.body.name, 100);
  await a.save();
  res.json({ item: { ...publicAdmin(a), active: a.active } });
});