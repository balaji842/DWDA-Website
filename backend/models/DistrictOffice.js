const mongoose = require("mongoose");
const { DISTRICTS } = require("../config/constants");

// One office per district. Contact details start empty and are filled in by the
// department; the site shows "not yet added" rather than inventing them.
const districtOfficeSchema = new mongoose.Schema(
  {
    district: { type: String, enum: DISTRICTS, required: true, unique: true },
    districtTa: { type: String, default: "" },
    officeName: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    hours: { type: String, default: "" },
    mapUrl: { type: String, default: "" }, // only set once the location is verified
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DistrictOffice", districtOfficeSchema);
