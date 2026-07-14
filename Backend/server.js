// Backend/server.js
const express = require("express");
const cors = require("cors");
const config = require("./config/config");

// ✅ Now config has all your environment variables
console.log(
  "📊 JWT_SECRET from config:",
  config.jwtSecret ? "✅ Set" : "❌ Not set",
);
console.log("📊 DB_NAME from config:", config.dbName);
console.log("📊 PORT from config:", config.port);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));

// ... rest of your server code

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
