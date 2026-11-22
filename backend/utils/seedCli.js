// npm run seed            -> adds missing reference data
// npm run seed -- --reset -> clears sample news/institutions/schemes and re-adds them
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { seedIfEmpty, reset } = require("./seed");

(async () => {
  await connectDB();
  if (process.argv.includes("--reset")) await reset();
  await seedIfEmpty();
  await mongoose.disconnect();
  console.log("Seed complete.");
})().catch((e) => { console.error(e); process.exit(1); });
