const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { en: { type: String, required: true, trim: true }, ta: { type: String, default: "" } },
    summary: { en: { type: String, default: "" }, ta: { type: String, default: "" } },
    body: { en: { type: String, default: "" }, ta: { type: String, default: "" } },
    date: { type: Date, required: true },
    isSample: { type: Boolean, default: false }, // demo content: shown with a "Sample" label
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
