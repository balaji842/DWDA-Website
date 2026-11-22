const crypto = require("crypto");
const Application = require("../models/Application");

// TNDA-2026-7K3F9Q — no 0/O/1/I so it can be read out over the phone.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

async function newReferenceNo() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bytes = crypto.randomBytes(6);
    const code = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("");
    const ref = `TNDA-${new Date().getFullYear()}-${code}`;
    // eslint-disable-next-line no-await-in-loop
    if (!(await Application.exists({ referenceNo: ref }))) return ref;
  }
  throw new Error("Could not create a unique reference number");
}

module.exports = { newReferenceNo };
