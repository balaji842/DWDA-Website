const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const config = require("./config");
const { apiLimiter } = require("./middleware/rateLimit");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || config.clientOrigins.includes(origin)),
  credentials: false,
}));
app.use(compression());
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false, limit: "200kb" }));
if (config.env !== "test") app.use(morgan(config.env === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api", apiLimiter);
app.use("/api/schemes", require("./routes/schemes"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/tracking", require("./routes/tracking"));
app.use("/api/districts", require("./routes/districts"));
app.use("/api/news", require("./routes/news"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/donate", require("./routes/donations"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api", require("./routes/misc"));

app.use("/api", notFound);
app.use(errorHandler);

module.exports = app;