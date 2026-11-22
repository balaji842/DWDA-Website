const jwt = require("jsonwebtoken");
const config = require("../config");
const Admin = require("../models/Admin");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new AppError(401, "Sign in to continue.");
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new AppError(401, "Your session has ended. Sign in again.");
  }
  const admin = await Admin.findById(payload.sub);
  if (!admin || !admin.active) throw new AppError(401, "This account is not active.");
  req.admin = admin;
  next();
});

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) return next(new AppError(403, "Your role does not allow this action."));
  next();
};

// District admins only ever see their own district.
const districtScope = (admin) => (admin.role === "district" ? { district: admin.district } : {});

module.exports = { protect, requireRole, districtScope };
