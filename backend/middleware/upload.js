const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require("../config");
const AppError = require("../utils/AppError");

const ROOT = path.join(__dirname, "..", "uploads");
const DIRS = { applications: path.join(ROOT, "applications"), documents: path.join(ROOT, "documents") };
Object.values(DIRS).forEach((d) => fs.mkdirSync(d, { recursive: true }));

const TYPES = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

// Files are named by random bytes, never by the uploaded name, and are kept
// outside any static folder: they can only be read through an authorised route.
const storage = (dir) =>
  multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString("hex") + (TYPES[file.mimetype] || "")),
  });

const filter = (allowed) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const okExt = { "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }[file.mimetype];
  if (!allowed.includes(file.mimetype) || !okExt || !okExt.includes(ext)) {
    return cb(new AppError(400, `"${file.originalname}" is not allowed. Upload ${allowed.map((t) => TYPES[t].slice(1).toUpperCase()).join(", ")} files only.`));
  }
  cb(null, true);
};

// The browser's MIME type can be faked, so check the file's first bytes too.
const SIGNATURES = {
  ".pdf": [0x25, 0x50, 0x44, 0x46], // %PDF
  ".jpg": [0xff, 0xd8, 0xff],
  ".png": [0x89, 0x50, 0x4e, 0x47],
};

function verifySignatures(files) {
  for (const f of files) {
    const sig = SIGNATURES[path.extname(f.filename)];
    const fd = fs.openSync(f.path, "r");
    const buf = Buffer.alloc(4);
    fs.readSync(fd, buf, 0, 4, 0);
    fs.closeSync(fd);
    if (!sig || !sig.every((b, i) => buf[i] === b)) {
      removeFiles(files);
      throw new AppError(400, `"${f.originalname}" does not look like a real PDF, JPG or PNG file.`);
    }
  }
}

function removeFiles(files = []) {
  for (const f of files) fs.promises.unlink(f.path).catch(() => {});
}

const applicationUpload = multer({
  storage: storage(DIRS.applications),
  fileFilter: filter(["application/pdf", "image/jpeg", "image/png"]),
  limits: { fileSize: config.maxUploadBytes, files: 5, fields: 30 },
});

const documentUpload = multer({
  storage: storage(DIRS.documents),
  fileFilter: filter(["application/pdf"]),
  limits: { fileSize: 20 * 1024 * 1024, files: 1 },
});

module.exports = { applicationUpload, documentUpload, verifySignatures, removeFiles, DIRS };
