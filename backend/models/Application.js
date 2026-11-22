const mongoose = require("mongoose");
const { DISTRICTS, STATUSES } = require("../config/constants");

const fileSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // what the applicant said this file is
    originalName: String,
    storedName: { type: String, required: true }, // random name on disk; never derived from user input
    mimeType: String,
    size: Number,
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    verifiedAt: Date,
  },
  { _id: true }
);

const historySchema = new mongoose.Schema(
  {
    status: { type: String, enum: STATUSES, required: true },
    remark: { type: String, default: "" }, // shown to the applicant when tracking
    internalNote: { type: String, default: "" }, // officials only
    by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    referenceNo: { type: String, required: true, unique: true, index: true },
    applicantName: { type: String, required: true, trim: true, maxlength: 120 },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["female", "male", "transgender", "prefer-not-to-say"], required: true },
    mobile: { type: String, required: true, match: /^[6-9]\d{9}$/, index: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    district: { type: String, enum: DISTRICTS, required: true, index: true },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    disabilityCategory: { type: String, required: true },
    disabilityPercentage: { type: Number, min: 0, max: 100, required: true },
    udidNumber: { type: String, trim: true, default: "" },
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true },
    documents: [fileSchema],
    status: { type: String, enum: STATUSES, default: "submitted", index: true },
    history: [historySchema],
    consent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
