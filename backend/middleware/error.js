const multer = require("multer");
const config = require("../config");

function notFound(req, res) {
  res.status(404).json({ message: `No API route for ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Something went wrong.";
  let details = err.details;

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE"
      ? `Each file must be ${Math.round(config.maxUploadBytes / 1024 / 1024)} MB or smaller.`
      : err.code === "LIMIT_FILE_COUNT" ? "Too many files. Upload up to 5." : "The upload could not be read.";
  } else if (err.name === "ValidationError") {
    status = 422;
    message = "Some fields need attention.";
    details = Object.fromEntries(Object.entries(err.errors).map(([k, e]) => [k, e.message]));
  } else if (err.name === "CastError") {
    status = 400;
    message = "That ID is not valid.";
  } else if (err.code === 11000) {
    status = 409;
    message = `That ${Object.keys(err.keyValue || {})[0] || "value"} is already in use.`;
  }

  if (status >= 500) {
    console.error(err);
    if (config.env === "production") message = "Something went wrong on our side. Try again in a few minutes.";
  }
  res.status(status).json({ message, ...(details ? { errors: details } : {}) });
}

module.exports = { notFound, errorHandler };
