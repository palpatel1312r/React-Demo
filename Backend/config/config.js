// Backend/config/config.js
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Try multiple possible locations
const possiblePaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, ".env"),
  path.resolve(process.cwd(), ".env"),
];

let loaded = false;
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    console.log(`📁 Loading .env from: ${envPath}`);
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      loaded = true;
      break;
    }
  }
}

if (!loaded) {
  console.error("❌ Could not find .env file in any location!");
  console.log("📁 Checked paths:", possiblePaths);
}

// Export environment variables with defaults
module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: process.env.DB_PORT || 3306,
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "ReactDb",
  jwtSecret:
    process.env.JWT_SECRET ||
    "RY+JmvJ35dWFpYhhLNBSEtHiMZvInCe5mXW07bm5GQW9ZPrJDynQIBkW5iZ93xWEpASyj/BONBk1+rR5NuGHdg==",
  jwtExpire: process.env.JWT_EXPIRE || "30d",
};
