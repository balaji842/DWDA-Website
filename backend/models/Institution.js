const mongoose = require("mongoose");
const { DISTRICTS } = require("../config/constants");

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["special-school", "rehabilitation-home", "day-care", "early-intervention", "training-centre", "ngo", "other"], default: "other" },
    district: { type: String, enum: DISTRICTS, required: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    managedBy: { type: String, enum: ["government", "ngo", "aided", "other"], default: "other" },
    isSample: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);
