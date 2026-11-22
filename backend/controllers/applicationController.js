const Application = require("../models/Application");
const Scheme = require("../models/Scheme");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { v, check, clean } = require("../utils/validate");
const { newReferenceNo } = require("../utils/reference");
const { maskName } = require("../utils/privacy");
const { verifySignatures, removeFiles } = require("../middleware/upload");
const { DISTRICTS, DISABILITY_CATEGORIES } = require("../config/constants");
const sms = require("../services/smsService");

const GENDERS = ["female", "male", "transgender", "prefer-not-to-say"];

// POST /api/applications (multipart/form-data)
exports.createApplication = asyncHandler(async (req, res) => {
  const files = req.files || [];
  try {
    const b = req.body;
    check(b, {
      applicantName: [v.required, v.maxLen(120)],
      dateOfBirth: [v.required, v.pastDate],
      gender: [v.required, v.oneOf(GENDERS)],
      mobile: [v.required, v.mobile],
      email: [v.email],
      district: [v.required, v.oneOf(DISTRICTS)],
      address: [v.required, v.maxLen(500)],
      disabilityCategory: [v.required, v.oneOf(DISABILITY_CATEGORIES)],
      disabilityPercentage: [v.required, v.percentage],
      udidNumber: [v.udid],
      scheme: [v.required],
      consent: [(val) => (val === "true" || val === true ? "" : "Tick the box to confirm the details are correct.")],
    });
    if (files.length === 0) throw new AppError(422, "Some fields need attention.", { documents: "Upload at least one document, such as your ID card." });
    verifySignatures(files);

    const scheme = await Scheme.findOne({ slug: clean(b.scheme, 80), active: true });
    if (!scheme) throw new AppError(422, "Some fields need attention.", { scheme: "Choose a scheme from the list." });
    if (!scheme.acceptsOnline) throw new AppError(422, "Some fields need attention.", { scheme: "This scheme does not take online applications. Apply at your district office." });

    const labels = [].concat(b.documentLabels || []);
    const app = await Application.create({
      referenceNo: await newReferenceNo(),
      applicantName: clean(b.applicantName, 120),
      dateOfBirth: new Date(b.dateOfBirth),
      gender: b.gender,
      mobile: b.mobile,
      email: clean(b.email, 120),
      district: b.district,
      address: clean(b.address, 500),
      disabilityCategory: b.disabilityCategory,
      disabilityPercentage: Number(b.disabilityPercentage),
      udidNumber: clean(b.udidNumber, 30),
      scheme: scheme._id,
      consent: true,
      documents: files.map((f, i) => ({
        label: clean(labels[i] || "Supporting document", 80),
        originalName: clean(f.originalname, 150),
        storedName: f.filename,
        mimeType: f.mimetype,
        size: f.size,
      })),
      history: [{ status: "submitted", remark: "Application received." }],
    });

    sms.send(app.mobile, `Your application ${app.referenceNo} for ${scheme.title.en} has been received.`);

    res.status(201).json({
      referenceNo: app.referenceNo,
      scheme: scheme.title,
      submittedAt: app.createdAt,
      applicantName: maskName(app.applicantName),
    });
  } catch (err) {
    removeFiles(files); // nothing is kept from a rejected application
    throw err;
  }
});
