// Backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const taskRoutes = require("./routes/taskRoutes");

const knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection"); // ✅ Import Model

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Knex
const db = knex(knexConfig.development);

// ✅ CRITICAL: Bind Knex to Objection Model
Model.knex(db);

// Test database connection
const testDbConnection = async () => {
  try {
    await db.raw("SELECT 1+1 as result");
    console.log("✅ Database connected successfully");

    // Check if contacts table exists
    const hasTable = await db.schema.hasTable("contacts");
    console.log(`📋 Contacts table exists: ${hasTable}`);

    if (!hasTable) {
      console.log("⚠️ Contacts table does not exist!");
      console.log("📝 Please run: npx knex migrate:latest");
    } else {
      // Count contacts
      const count = await db("contacts").count("id as count").first();
      console.log(`📊 Total contacts: ${count.count}`);
    }

    // Check if tasks table exists
    const hasTasksTable = await db.schema.hasTable("tasks");
    console.log(`📋 Tasks table exists: ${hasTasksTable}`);

    if (!hasTasksTable) {
      console.log("⚠️ Tasks table does not exist!");
      console.log("📝 Please run: npx knex migrate:latest");
    }

    // Check if users table exists
    const hasUsersTable = await db.schema.hasTable("users");
    console.log(`📋 Users table exists: ${hasUsersTable}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("⚠️ Please check your .env file and database credentials");
  }
};

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

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Add this test route
app.get("/api/debug-tasks", async (req, res) => {
  try {
    // Check if tasks table exists
    const hasTable = await db.schema.hasTable("tasks");

    if (!hasTable) {
      return res.status(400).json({
        success: false,
        message: "Tasks table does not exist! Run migrations.",
      });
    }

    // Try to query the table
    const result = await db("tasks").select("*").limit(5);

    res.json({
      success: true,
      tableExists: hasTable,
      tasks: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({
      success: false,
      message: "Debug error",
      error: error.message,
      sql: error.sql,
    });
  }
});

// 404 handler
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
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  testDbConnection();
});
