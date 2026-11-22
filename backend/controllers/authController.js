const jwt = require("jsonwebtoken");
const config = require("../config");
const Admin = require("../models/Admin");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { v, check } = require("../utils/validate");

const publicAdmin = (a) => ({ id: a._id, name: a.name, email: a.email, role: a.role, district: a.district });

exports.login = asyncHandler(async (req, res) => {
  check(req.body, { email: [v.required, v.email], password: [v.required] });
  const admin = await Admin.findOne({ email: String(req.body.email).toLowerCase().trim() }).select("+password");
  // One message for both cases so the form doesn't reveal which emails exist.
  if (!admin || !admin.active || !(await admin.checkPassword(String(req.body.password)))) {
    throw new AppError(401, "The email or password is not correct.");
  }
  admin.lastLoginAt = new Date();
  await admin.save();
  const token = jwt.sign({ sub: admin._id.toString(), role: admin.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.json({ token, admin: publicAdmin(admin) });
});

exports.me = (req, res) => res.json({ admin: publicAdmin(req.admin) });

exports.changePassword = asyncHandler(async (req, res) => {
  check(req.body, {
    currentPassword: [v.required],
    newPassword: [v.required, (p) => (/^(?=.*[A-Za-z])(?=.*\d).{10,}$/.test(p) ? "" : "Use at least 10 characters, with letters and numbers.")],
  });
  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!(await admin.checkPassword(req.body.currentPassword))) {
    throw new AppError(422, "Some fields need attention.", { currentPassword: "This is not your current password." });
  }
  admin.password = req.body.newPassword;
  await admin.save();
  res.json({ message: "Password changed." });
});

exports.publicAdmin = publicAdmin;
