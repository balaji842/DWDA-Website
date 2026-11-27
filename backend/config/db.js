const dns = require("dns");
const mongoose = require("mongoose");
const config = require("./index");

// Atlas "mongodb+srv://" addresses need a DNS SRV lookup. Some Windows / ISP DNS servers refuse it
// ("querySrv ECONNREFUSED"), so for SRV addresses we ask public DNS servers instead.
// Override with DNS_SERVERS=1.1.1.1,8.8.8.8 in backend/.env, or set DNS_SERVERS=system to use the PC's own DNS.
function useReliableDnsForSrv(uri) {
  if (!/^mongodb\+srv:\/\//.test(uri || "")) return;
  const setting = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1,8.8.4.4").trim();
  if (setting.toLowerCase() === "system") return;
  const servers = setting.split(",").map((s) => s.trim()).filter(Boolean);
  try { dns.setServers(servers); } catch (e) { console.warn("Could not set DNS servers:", e.message); }
}

async function connectDB() {
  mongoose.set("strictQuery", true);
  useReliableDnsForSrv(config.mongoUri);
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDB;