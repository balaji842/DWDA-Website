const mongoose = require("mongoose");

// Site-wide official values (helpline, head office, At a glance figures).
// Every value starts empty; the site shows a placeholder until an admin fills it.
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    helpline: { type: String, default: "" },
    officeAddress: { type: String, default: "" },
    officeEmail: { type: String, default: "" },
    officePhone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    videoCall: { type: String, default: "" }, // video-calling line for people with hearing impairment
    stats: {
      populationFigure: { type: String, default: "" }, // Census 2011
      schemesFigure: { type: String, default: "" }, // number of schemes as published by the department
      rehabHomesFigure: { type: String, default: "" },
      specialSchoolsFigure: { type: String, default: "" },
    },
    lastUpdated: { type: Date, default: Date.now },
    officialSeeded: { type: Boolean, default: false }, // official values below were filled in once
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);