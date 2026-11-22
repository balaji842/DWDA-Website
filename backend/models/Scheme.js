const mongoose = require("mongoose");
const { CATEGORIES } = require("../config/constants");

// Bilingual text: English is required, Tamil is optional (falls back to English).
const text = { en: { type: String, trim: true, default: "" }, ta: { type: String, trim: true, default: "" } };

const schemeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9-]+$/ },
    category: { type: String, required: true, enum: CATEGORIES },
    audiences: [{ type: String, enum: ["person", "parent", "institution"] }],
    title: text,
    summary: text,
    // Official content, entered and verified by the department.
    description: text,
    eligibility: text,
    documentsRequired: text,
    benefits: text,
    howToApply: text,
    verified: { type: Boolean, default: false }, // true once the department has confirmed the content
    acceptsOnline: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schemeSchema.index({ "title.en": "text", "summary.en": "text", "title.ta": "text", "summary.ta": "text" });

module.exports = mongoose.model("Scheme", schemeSchema);
