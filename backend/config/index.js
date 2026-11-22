require("dotenv").config();

const required = (name, fallback) => {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.`);
  return v;
};

const config = {
  port: Number(process.env.PORT) || 5000,
  env: process.env.NODE_ENV || "development",
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/tn_dwda"),
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim()),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME || "Super Admin",
  },
  maxUploadBytes: (Number(process.env.MAX_UPLOAD_MB) || 5) * 1024 * 1024,
};

if (config.env === "production" && config.jwtSecret.startsWith("change-this")) {
  throw new Error("Set a real JWT_SECRET before running in production.");
}

module.exports = config;
