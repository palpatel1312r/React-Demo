
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const taskRoutes = require("./routes/taskRoutes");

const knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database setup
const db = knex(knexConfig.development);
Model.knex(db);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.20:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Error handlers
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  // Optional: Quick database check
  db.raw("SELECT 1")
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ Database error:", err.message));
});
