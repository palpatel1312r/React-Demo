const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const knex = require("knex");
const knexConfig = require("./knexfile");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Knex
const db = knex(knexConfig.development);

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

// Test routes
app.get("/api/test", async (req, res) => {
  try {
    const result = await db.raw("SELECT 1+1 as test");
    res.json({
      success: true,
      message: "Database connected!",
      result: result[0][0],
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/api/test-contacts", async (req, res) => {
  try {
    const contacts = await db("contacts").select("*");
    res.json({
      success: true,
      count: contacts.length,
      contacts: contacts,
    });
  } catch (error) {
    console.error("Contacts test failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to query contacts",
      error: error.message,
    });
  }
});

app.post("/api/test-insert", async (req, res) => {
  try {
    console.log("🧪 Testing direct insert...");

    const result = await db("contacts").insert({
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message",
      is_read: false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    console.log("✅ Test insert result:", result);

    const contact = await db("contacts")
      .select("*")
      .where("id", result[0])
      .first();

    res.json({
      success: true,
      message: "Test insert successful!",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Test insert failed:", error);
    res.status(500).json({
      success: false,
      message: "Test insert failed",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

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
