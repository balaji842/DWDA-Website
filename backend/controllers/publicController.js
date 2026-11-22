const path = require("path");
const fs = require("fs");
const Scheme = require("../models/Scheme");
const DistrictOffice = require("../models/DistrictOffice");
const News = require("../models/News");
const Document = require("../models/Document");
const Institution = require("../models/Institution");
const Setting = require("../models/Setting");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex, clean } = require("../utils/validate");
const { CATEGORIES, DISTRICTS, DISABILITY_CATEGORIES } = require("../config/constants");
const { DIRS } = require("../middleware/upload");

// ---------- schemes
exports.listSchemes = asyncHandler(async (req, res) => {
  const filter = { active: true };
  const { category, audience } = req.query;
  if (category && category !== "all") {
    if (!CATEGORIES.includes(category)) throw new AppError(400, "Unknown category.");
    filter.category = category;
  }
  if (audience) filter.audiences = audience;
  const q = clean(req.query.q, 80);
  if (q) {
    // Every word must appear somewhere in the scheme ("monthly assistance" finds
    // "Monthly maintenance assistance"). Simple plural endings are dropped.
    const words = q.split(/\s+/).filter((w) => w.length > 1).slice(0, 6);
    const fields = ["title.en", "title.ta", "summary.en", "summary.ta", "description.en", "description.ta", "benefits.en", "eligibility.en"];
    filter.$and = words.map((w) => {
      const rx = new RegExp(escapeRegex(w.replace(/(es|s)$/i, "") || w), "i");
      return { $or: fields.map((f) => ({ [f]: rx })) };
    });
  }
  const schemes = await Scheme.find(filter).sort({ order: 1, "title.en": 1 }).select("slug category audiences title summary verified acceptsOnline order");
  const total = await Scheme.countDocuments({ active: true });
  res.json({ schemes, total });
});

exports.getScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findOne({ slug: req.params.slug, active: true });
  if (!scheme) throw new AppError(404, "We couldn't find that scheme.");
  res.json({ scheme });
});

// ---------- districts
exports.listDistricts = asyncHandler(async (req, res) => {
  const offices = await DistrictOffice.find().sort({ district: 1 });
  res.json({ offices });
});

exports.getDistrict = asyncHandler(async (req, res) => {
  const office = await DistrictOffice.findOne({ district: new RegExp(`^${escapeRegex(req.params.district)}$`, "i") });
  if (!office) throw new AppError(404, "We couldn't find that district.");
  res.json({ office });
});

// ---------- news
exports.listNews = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const filter = { published: true };
  const [news, total] = await Promise.all([
    News.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
    News.countDocuments(filter),
  ]);
  res.json({ news, total, page, pages: Math.ceil(total / limit) || 1 });
});

exports.getNews = asyncHandler(async (req, res) => {
  const item = await News.findOne({ slug: req.params.slug, published: true });
  if (!item) throw new AppError(404, "We couldn't find that announcement.");
  res.json({ news: item });
});

// ---------- public documents (Acts, policies, G.O.s)
exports.listDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({ published: true }).sort({ order: 1, year: -1 });
  res.json({
    documents: docs.map((d) => ({
      _id: d._id, title: d.title, kind: d.kind, year: d.year, goNumber: d.goNumber,
      hasFile: Boolean(d.storedName), size: d.size, externalUrl: d.externalUrl,
    })),
  });
});

exports.downloadDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, published: true });
  if (!doc || !doc.storedName) throw new AppError(404, "The official copy of this document hasn't been added yet.");
  const file = path.join(DIRS.documents, path.basename(doc.storedName));
  if (!fs.existsSync(file)) throw new AppError(404, "The file is missing on the server.");
  const name = (doc.originalName || `${doc.title.en}.pdf`).replace(/[^\w.\- ]/g, "_");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${req.query.download ? "attachment" : "inline"}; filename="${name}"`);
  res.sendFile(file);
});

// ---------- institutions
exports.listInstitutions = asyncHandler(async (req, res) => {
  const filter = { published: true };
  if (req.query.district) filter.district = req.query.district;
  if (req.query.type) filter.type = req.query.type;
  const institutions = await Institution.find(filter).sort({ district: 1, name: 1 }).limit(500);
  res.json({ institutions });
});

// ---------- settings + reference lists
exports.getSettings = asyncHandler(async (req, res) => {
  const s = (await Setting.findOne({ key: "site" })) || {};
  res.json({
    helpline: s.helpline || "",
    officeAddress: s.officeAddress || "",
    officeEmail: s.officeEmail || "",
    officePhone: s.officePhone || "",
    whatsapp: s.whatsapp || "",
    videoCall: s.videoCall || "",
    stats: s.stats || {},
    lastUpdated: s.lastUpdated || null,
  });
});

exports.getMeta = (req, res) => {
  res.json({ districts: DISTRICTS, categories: CATEGORIES, disabilityCategories: DISABILITY_CATEGORIES });
};