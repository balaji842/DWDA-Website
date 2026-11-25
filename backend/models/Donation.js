const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    need: { type: mongoose.Schema.Types.ObjectId, ref: "Need" },
    title: { en: String, ta: String },
    institutionName: String,
    quantity: Number,
    unitCost: Number,   // the official cost per unit
    unitValue: Number,  // kind donations: the donor's estimated value per unit
    amount: Number,
  },
  { _id: false }
);

// One donation. Payments are TEST ONLY until a payment gateway is connected:
// payment.mode is "test" and no money moves.
const donationSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true, index: true },
    accessToken: { type: String, required: true, select: false }, // lets the donor open pay/receipt pages without an account
    type: { type: String, enum: ["quick", "need", "institution"], required: true },
    mode: { type: String, enum: ["cash", "kind"], default: "cash" }, // kind = donor supplies the items (no payment)
    disability: { type: String, default: "" },
    purpose: { type: String, default: "" },                        // quick donation: general fund / a district / a cause
    district: { type: String, default: "" },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
    institutionName: { type: String, default: "" },
    items: [itemSchema],
    amount: { type: Number, required: true, min: 1 },
    donorType: { type: String, enum: ["individual", "organisation", "csr"], default: "individual" },
    donor: {
      name: { type: String, required: true, trim: true },
      organisation: { type: String, default: "" },
      email: { type: String, required: true, trim: true, lowercase: true },
      mobile: { type: String, required: true },
      pan: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    anonymous: { type: Boolean, default: false },
    wantsTaxReceipt: { type: Boolean, default: false },
    message: { type: String, default: "" },
    status: { type: String, enum: ["pending", "paid", "failed", "pledged"], default: "pending", index: true }, // pledged = kind donation recorded
    payment: {
      mode: { type: String, default: "test" },
      method: { type: String, default: "" },   // upi / card / netbanking
      reference: { type: String, default: "" },
      paidAt: Date,
      attempts: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);