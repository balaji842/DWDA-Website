const config = require("./config");
const connectDB = require("./config/db");
const { seedIfEmpty } = require("./utils/seed");
const app = require("./app");

(async () => {
  try {
    await connectDB();
    await seedIfEmpty();
    app.listen(config.port, () => console.log(`API running on http://localhost:${config.port}/api`));
  } catch (err) {
    console.error("\nThe API could not start:", err.message);
    console.error("Check that MongoDB is running and MONGODB_URI in backend/.env is correct.\n");
    process.exit(1);
  }
})();
