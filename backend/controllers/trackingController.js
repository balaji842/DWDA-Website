const Application = require("../models/Application");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { v, check, clean } = require("../utils/validate");
const { maskName, maskMobile } = require("../utils/privacy");

// POST /api/tracking — needs BOTH the reference number and the registered mobile.
// The same message is returned whether the number is wrong or the mobile doesn't
// match, so the form can't be used to discover which references exist.
exports.track = asyncHandler(async (req, res) => {
  check(req.body, {
    referenceNo: [v.required, (val) => (/^TNDA-\d{4}-[A-Z0-9]{6}$/i.test(String(val).trim()) ? "" : "Enter the reference number as shown, like TNDA-2026-7K3F9Q.")],
    mobile: [v.required, v.mobile],
  });
  const app = await Application.findOne({
    referenceNo: clean(req.body.referenceNo, 20).toUpperCase(),
    mobile: req.body.mobile,
  }).populate("scheme", "title slug");
  if (!app) throw new AppError(404, "No application matches that reference number and mobile number. Check both and try again.");

  res.json({
    referenceNo: app.referenceNo,
    applicantName: maskName(app.applicantName),
    mobile: maskMobile(app.mobile),
    scheme: app.scheme ? { title: app.scheme.title, slug: app.scheme.slug } : null,
    district: app.district,
    submittedAt: app.createdAt,
    status: app.status,
    // Public timeline: statuses and public remarks only — internal notes stay hidden.
    history: app.history.map((h) => ({ status: h.status, remark: h.remark, at: h.at })),
  });
});
