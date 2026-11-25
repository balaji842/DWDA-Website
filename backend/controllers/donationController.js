const crypto = require("crypto");
const mongoose = require("mongoose");
const Need = require("../models/Need");
const Donation = require("../models/Donation");
const Institution = require("../models/Institution");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { v, check, clean, escapeRegex } = require("../utils/validate");
const { DISTRICTS, DISABILITY_CATEGORIES } = require("../config/constants");
const { NEED_CATEGORIES } = require("../models/Need");

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 10000000; // ₹1 crore per online donation
const ALPHA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const code = (n) => [...crypto.randomBytes(n)].map((b) => ALPHA[b % ALPHA.length]).join("");
const isId = (id) => mongoose.isValidObjectId(id);
const pan = (val) => (!val || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(val).toUpperCase()) ? "" : "Enter a valid PAN, like ABCDE1234F.");
const pincode = (val) => (!val || /^[1-9]\d{5}$/.test(String(val)) ? "" : "Enter a 6-digit PIN code.");

const publicNeed = (n) => ({
  _id: n._id, category: n.category, disability: n.disability || "", title: n.title, description: n.description, unitCost: n.unitCost,
  quantityRequired: n.quantityRequired, quantityFunded: n.quantityFunded, quantityRemaining: Math.max(0, n.quantityRequired - n.quantityFunded),
  status: n.status, district: n.district, isSample: n.isSample,
  institution: n.institution && n.institution.name ? { _id: n.institution._id, name: n.institution.name, district: n.institution.district, type: n.institution.type } : n.institution,
});

// ---------------- browse
exports.listNeeds = asyncHandler(async (req, res) => {
  const f = { status: "open" };
  if (req.query.district && DISTRICTS.includes(req.query.district)) f.district = req.query.district;
  if (req.query.category && NEED_CATEGORIES.includes(req.query.category)) f.category = req.query.category;
  if (req.query.institution && isId(req.query.institution)) f.institution = req.query.institution;
  if (req.query.disability && DISABILITY_CATEGORIES.includes(req.query.disability)) f.disability = req.query.disability;
  const q = clean(req.query.q, 60);
  if (q) { const rx = new RegExp(escapeRegex(q), "i"); f.$or = [{ "title.en": rx }, { "title.ta": rx }, { "description.en": rx }]; }
  const sort = req.query.sort === "amount" ? { unitCost: -1 } : req.query.sort === "newest" ? { createdAt: -1 } : { district: 1, institution: 1, category: 1, createdAt: 1 };
  const needs = await Need.find(f).sort(sort).limit(500).populate("institution", "name district type published");
  res.json({ needs: needs.filter((n) => n.institution?.published !== false).map(publicNeed), categories: NEED_CATEGORIES });
});

exports.listInstitutions = asyncHandler(async (req, res) => {
  const f = { published: true };
  if (req.query.district && DISTRICTS.includes(req.query.district)) f.district = req.query.district;
  if (req.query.type) f.type = clean(req.query.type, 40);
  const q = clean(req.query.q, 60);
  if (q) f.name = new RegExp(escapeRegex(q), "i");
  const list = await Institution.find(f).sort({ district: 1, name: 1 }).limit(500).lean();
  const stats = await Need.aggregate([
    { $match: { status: "open", institution: { $in: list.map((i) => i._id) } } },
    { $group: { _id: "$institution", openNeeds: { $sum: 1 }, amountNeeded: { $sum: { $multiply: ["$unitCost", { $subtract: ["$quantityRequired", "$quantityFunded"] }] } } } },
  ]);
  const by = Object.fromEntries(stats.map((s) => [String(s._id), s]));
  res.json({ institutions: list.map((i) => ({ ...i, openNeeds: by[i._id]?.openNeeds || 0, amountNeeded: by[i._id]?.amountNeeded || 0 })) });
});

exports.getInstitution = asyncHandler(async (req, res) => {
  if (!isId(req.params.id)) throw new AppError(404, "We couldn't find that institution.");
  const inst = await Institution.findOne({ _id: req.params.id, published: true }).lean();
  if (!inst) throw new AppError(404, "We couldn't find that institution.");
  const needs = await Need.find({ institution: inst._id, status: "open" }).sort({ createdAt: -1 });
  const raised = await Donation.aggregate([{ $match: { status: "paid", institution: inst._id } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]);
  res.json({ institution: inst, needs: needs.map((n) => publicNeed({ ...n.toObject(), institution: inst })), raised: raised[0] || { total: 0, count: 0 } });
});

// ---------------- create (status: pending)
exports.createDonation = asyncHandler(async (req, res) => {
  const b = req.body || {};
  const d = b.donor || {};
  check({ ...d, type: b.type, donorType: b.donorType, consent: b.consent }, {
    type: [v.oneOf(["quick", "need", "institution"])],
    donorType: [v.oneOf(["individual", "organisation", "csr"])],
    name: [v.required, v.maxLen(120)], email: [v.required, v.email], mobile: [v.required, v.mobile],
    pan: [pan], pincode: [pincode], address: [v.maxLen(300)],
    consent: [(val) => (val === true ? "" : "Tick the box to confirm the details are correct.")],
  });
  if (b.donorType !== "individual" && !clean(d.organisation)) throw new AppError(422, "Some fields need attention.", { organisation: "Enter the organisation name." });
  if (b.wantsTaxReceipt && !d.pan) throw new AppError(422, "Some fields need attention.", { pan: "PAN is needed for a tax-exemption receipt." });
  if (b.wantsTaxReceipt && !clean(d.address)) throw new AppError(422, "Some fields need attention.", { address: "Address is needed for a tax-exemption receipt." });

  const doc = {
    type: b.type, donorType: b.donorType, anonymous: Boolean(b.anonymous), wantsTaxReceipt: Boolean(b.wantsTaxReceipt), message: clean(b.message, 300),
    donor: { name: clean(d.name, 120), organisation: clean(d.organisation, 160), email: clean(d.email, 120), mobile: d.mobile, pan: clean(d.pan, 10).toUpperCase(), address: clean(d.address, 300), city: clean(d.city, 60), pincode: clean(d.pincode, 6) },
  };

  if (b.type === "need") {
    doc.mode = b.mode === "kind" ? "kind" : "cash";
    const items = Array.isArray(b.items) ? b.items.slice(0, 100) : [];
    if (!items.length) throw new AppError(422, "Select at least one need to donate to.");
    doc.items = [];
    for (const it of items) {
      if (!isId(it.need)) throw new AppError(422, "One of the needs in your basket is not valid.");
      const need = await Need.findOne({ _id: it.need, status: "open" }).populate("institution", "name");
      if (!need) throw new AppError(409, "One of the needs in your basket has just been fully funded or closed. Remove it and try again.");
      const remaining = need.quantityRequired - need.quantityFunded;
      const qty = Math.floor(Number(it.quantity));
      if (!(qty >= 1)) throw new AppError(422, `Choose a quantity for "${need.title.en}".`);
      if (qty > remaining) throw new AppError(409, `Only ${remaining} of "${need.title.en}" still needed. Lower the quantity and try again.`);
      // Kind: the donor states the value per unit of what they will supply (defaults to the official cost).
      const unitValue = doc.mode === "kind" ? Math.round(Number(it.unitValue ?? need.unitCost)) : need.unitCost;
      if (!(unitValue >= 1)) throw new AppError(422, `Enter the value of "${need.title.en}".`);
      doc.items.push({ need: need._id, title: need.title, institutionName: need.institution?.name || "", quantity: qty, unitCost: need.unitCost, unitValue, amount: qty * unitValue });
    }
    doc.amount = doc.items.reduce((s, i) => s + i.amount, 0);
    if (doc.mode === "kind") {
      // A kind pledge reserves the quantities now, so nobody else pledges the same items. All or nothing.
      const done = [];
      for (const it of doc.items) {
        const n = await Need.findOneAndUpdate(
          { _id: it.need, status: "open", $expr: { $lte: [{ $add: ["$quantityFunded", it.quantity] }, "$quantityRequired"] } },
          { $inc: { quantityFunded: it.quantity } }, { new: true }
        );
        if (!n) {
          for (const d of done) await Need.updateOne({ _id: d.need }, { $inc: { quantityFunded: -d.quantity }, $set: { status: "open" } });
          throw new AppError(409, `"${it.title.en}" was just taken by another donor. Refresh the list and try again.`);
        }
        if (n.quantityFunded >= n.quantityRequired) { n.status = "funded"; await n.save(); }
        done.push(it);
      }
      doc.status = "pledged";
    }
  } else {
    const amount = Math.round(Number(b.amount));
    if (!(amount >= MIN_AMOUNT)) throw new AppError(422, "Some fields need attention.", { amount: `The minimum donation is ₹${MIN_AMOUNT}.` });
    if (amount > MAX_AMOUNT) throw new AppError(422, "Some fields need attention.", { amount: "For donations above ₹1 crore, please contact the department." });
    doc.amount = amount;
    if (b.type === "quick") {
      doc.purpose = clean(b.purpose, 60) || "general";
      if (b.district) { if (!DISTRICTS.includes(b.district)) throw new AppError(422, "Some fields need attention.", { district: "Choose a district from the list." }); doc.district = b.district; }
    } else {
      if (!isId(b.institution)) throw new AppError(422, "Some fields need attention.", { institution: "Choose an institution." });
      if (b.disability && DISABILITY_CATEGORIES.includes(b.disability)) doc.disability = b.disability;
      const inst = await Institution.findOne({ _id: b.institution, published: true });
      if (!inst) throw new AppError(404, "We couldn't find that institution.");
      Object.assign(doc, { institution: inst._id, institutionName: inst.name, district: inst.district });
    }
  }

  let receiptNo;
  for (let i = 0; i < 5; i += 1) { receiptNo = `DON-${new Date().getFullYear()}-${code(6)}`; if (!(await Donation.exists({ receiptNo }))) break; }
  const accessToken = crypto.randomBytes(18).toString("hex");
  const don = await Donation.create({ ...doc, receiptNo, accessToken });
  res.status(201).json({ id: don._id, receiptNo, token: accessToken, amount: don.amount, status: don.status, mode: don.mode });
});

async function findWithToken(req) {
  if (!isId(req.params.id)) throw new AppError(404, "Donation not found.");
  const don = await Donation.findById(req.params.id).select("+accessToken");
  const token = String(req.query.token || req.body?.token || "");
  if (!don || !token || token.length !== don.accessToken.length || !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(don.accessToken))) throw new AppError(404, "Donation not found.");
  return don;
}
const publicDonation = (d) => ({
  id: d._id, receiptNo: d.receiptNo, type: d.type, mode: d.mode || "cash", disability: d.disability, purpose: d.purpose, district: d.district, institutionName: d.institutionName, items: d.items,
  amount: d.amount, donorType: d.donorType, donor: d.donor, anonymous: d.anonymous, wantsTaxReceipt: d.wantsTaxReceipt, message: d.message,
  status: d.status, payment: d.payment, createdAt: d.createdAt,
});

exports.getDonation = asyncHandler(async (req, res) => res.json({ donation: publicDonation(await findWithToken(req)) }));

// ---------------- TEST payment (no gateway connected yet)
exports.testPay = asyncHandler(async (req, res) => {
  const don = await findWithToken(req);
  if (don.status === "paid") return res.json({ donation: publicDonation(don) });
  if (don.status === "pledged") throw new AppError(409, "This is a kind pledge — there is nothing to pay.");
  const method = ["upi", "card", "netbanking"].includes(req.body.method) ? req.body.method : null;
  if (!method) throw new AppError(422, "Choose a payment method.");
  don.payment.attempts += 1;
  don.payment.method = method;
  if (req.body.outcome === "failure") {
    don.status = "failed";
    await don.save();
    return res.json({ donation: publicDonation(don) });
  }
  // Re-check stock for need donations, then record funding.
  if (don.type === "need") {
    for (const it of don.items) {
      const n = await Need.findOneAndUpdate(
        { _id: it.need, status: "open", $expr: { $lte: [{ $add: ["$quantityFunded", it.quantity] }, "$quantityRequired"] } },
        { $inc: { quantityFunded: it.quantity } }, { new: true }
      );
      if (!n) { don.status = "failed"; await don.save(); throw new AppError(409, `"${it.title.en}" was funded by someone else meanwhile. No money was taken. Please start a new donation.`); }
      if (n.quantityFunded >= n.quantityRequired) { n.status = "funded"; await n.save(); }
    }
  }
  don.status = "paid";
  don.payment.reference = `TEST-${code(10)}`;
  don.payment.paidAt = new Date();
  await don.save();
  res.json({ donation: publicDonation(don) });
});

exports.publicStats = asyncHandler(async (req, res) => {
  const [paid] = await Donation.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]);
  const [open] = await Need.aggregate([{ $match: { status: "open" } }, { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: { $multiply: ["$unitCost", { $subtract: ["$quantityRequired", "$quantityFunded"] }] } } } }]);
  const institutions = await Institution.countDocuments({ published: true });
  res.json({ raised: paid?.total || 0, donations: paid?.count || 0, openNeeds: open?.count || 0, amountNeeded: open?.amount || 0, institutions });
});

// ---------------- admin
exports.adminListDonations = asyncHandler(async (req, res) => {
  const f = {};
  if (["pending", "paid", "failed", "pledged"].includes(req.query.status)) f.status = req.query.status;
  if (["cash", "kind"].includes(req.query.mode)) f.mode = req.query.mode;
  if (["quick", "need", "institution"].includes(req.query.type)) f.type = req.query.type;
  const q = clean(req.query.q, 60);
  if (q) { const rx = new RegExp(escapeRegex(q), "i"); f.$or = [{ receiptNo: rx }, { "donor.name": rx }, { "donor.email": rx }, { "donor.mobile": rx }, { institutionName: rx }]; }
  const limit = Math.min(Number(req.query.limit) || 20, 500); const page = Math.max(Number(req.query.page) || 1, 1);
  const [items, total, sums] = await Promise.all([
    Donation.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Donation.countDocuments(f),
    Donation.aggregate([{ $match: { status: "paid" } }, { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1, summary: sums });
});

const needBody = (b) => {
  const out = {};
  if (b.title) out.title = { en: clean(b.title.en, 200), ta: clean(b.title.ta, 200) };
  if (b.description) out.description = { en: clean(b.description.en, 1000), ta: clean(b.description.ta, 1000) };
  if (b.category !== undefined) { if (!NEED_CATEGORIES.includes(b.category)) throw new AppError(422, "Some fields need attention.", { category: "Choose a category." }); out.category = b.category; }
  if (b.disability !== undefined) out.disability = DISABILITY_CATEGORIES.includes(b.disability) ? b.disability : "";
  ["unitCost", "quantityRequired", "quantityFunded"].forEach((k) => { if (b[k] !== undefined && b[k] !== "") out[k] = Math.max(0, Math.round(Number(b[k]))); });
  if (b.status !== undefined) out.status = ["open", "funded", "closed"].includes(b.status) ? b.status : "open";
  if (b.isSample !== undefined) out.isSample = Boolean(b.isSample);
  return out;
};
exports.adminListNeeds = asyncHandler(async (req, res) => {
  const f = req.admin.role === "district" ? { district: req.admin.district } : {};
  res.json({ items: await Need.find(f).sort({ status: 1, district: 1, createdAt: -1 }).populate("institution", "name district") });
});
exports.adminCreateNeed = asyncHandler(async (req, res) => {
  const body = needBody(req.body);
  if (!isId(req.body.institution)) throw new AppError(422, "Some fields need attention.", { institution: "Choose the institution." });
  const inst = await Institution.findById(req.body.institution);
  if (!inst || (req.admin.role === "district" && inst.district !== req.admin.district)) throw new AppError(422, "Some fields need attention.", { institution: "Choose an institution in your district." });
  if (!body.title?.en) throw new AppError(422, "Some fields need attention.", { "title.en": "Enter what is needed." });
  res.status(201).json({ item: await Need.create({ ...body, institution: inst._id, district: inst.district }) });
});
exports.adminUpdateNeed = asyncHandler(async (req, res) => {
  const f = { _id: req.params.id, ...(req.admin.role === "district" ? { district: req.admin.district } : {}) };
  const body = needBody(req.body);
  if (req.body.institution && isId(req.body.institution)) {
    const inst = await Institution.findById(req.body.institution);
    if (inst && (req.admin.role !== "district" || inst.district === req.admin.district)) Object.assign(body, { institution: inst._id, district: inst.district });
  }
  const item = await Need.findOneAndUpdate(f, body, { new: true, runValidators: true });
  if (!item) throw new AppError(404, "Need not found.");
  res.json({ item });
});
exports.adminDeleteNeed = asyncHandler(async (req, res) => {
  const f = { _id: req.params.id, ...(req.admin.role === "district" ? { district: req.admin.district } : {}) };
  if (await Donation.exists({ "items.need": req.params.id, status: "paid" })) throw new AppError(409, "Donations have been made for this need. Close it instead of deleting.");
  const item = await Need.findOneAndDelete(f);
  if (!item) throw new AppError(404, "Need not found.");
  res.json({ message: "Need deleted." });
});