const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const knex = require("knex");
const knexConfig = require("./knexfile");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Knex with development config
const db = knex(knexConfig.development);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.20:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make db available to routes and middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Auth routes
app.use("/api/auth", authRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
