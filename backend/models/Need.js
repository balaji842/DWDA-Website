const mongoose = require("mongoose");
const { DISTRICTS, DISABILITY_CATEGORIES } = require("../config/constants");

// Categories as used on the Namma School "Donate for Differently Abled" page. The need's title is its SubCategory.
const NEED_CATEGORIES = [
  "civil-infrastructure", "digital-infrastructure", "electrical-infrastructure", "health-hygiene", "medical-monitoring",
  "cleaning", "food-kitchen", "clothes-footwear", "safety", "renovation-maintenance", "special-needs",
];

// A specific item an institution needs, which donors can fund in whole or in part.
const needSchema = new mongoose.Schema(
  {
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true, index: true },
    district: { type: String, enum: DISTRICTS, required: true, index: true }, // copied from the institution for filtering
    category: { type: String, enum: NEED_CATEGORIES, required: true },
    disability: { type: String, enum: ["", ...DISABILITY_CATEGORIES], default: "" }, // the group this institution serves (may be blank)
    title: { en: { type: String, required: true, trim: true }, ta: { type: String, default: "" } },
    description: { en: { type: String, default: "" }, ta: { type: String, default: "" } },
    unitCost: { type: Number, required: true, min: 1 },             // rupees per unit
    quantityRequired: { type: Number, required: true, min: 1 },
    quantityFunded: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["open", "funded", "closed"], default: "open", index: true },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
);

needSchema.virtual("quantityRemaining").get(function rem() { return Math.max(0, this.quantityRequired - this.quantityFunded); });
needSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Need", needSchema);
module.exports.NEED_CATEGORIES = NEED_CATEGORIES;