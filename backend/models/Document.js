const mongoose = require("mongoose");

// Public documents: Acts, policies and Government Orders.
const documentSchema = new mongoose.Schema(
  {
    title: { en: { type: String, required: true }, ta: { type: String, default: "" } },
    kind: { type: String, enum: ["act", "policy", "go", "other"], default: "other" },
    year: Number,
    goNumber: { type: String, default: "" },
    storedName: { type: String, default: "" }, // PDF uploaded by an admin; empty until the official copy is added
    originalName: { type: String, default: "" },
    size: Number,
    externalUrl: { type: String, default: "" }, // or a link to an official source
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
