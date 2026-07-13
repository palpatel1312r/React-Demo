// Backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register user
exports.register = async (req, res) => {
  try {
    console.log("📝 Registration request received");
    console.log("📝 Request body:", req.body);

    const { name, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("❌ Passwords don't match");
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check password length
    if (password.length < 4) {
      console.log("❌ Password too short");
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters long",
      });
    }

    // ✅ FIX: Use findOne instead of findByEmail
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.query().insert({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("✅ User created:", user.id, user.email);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log("🔐 Login request received");
    console.log("🔐 Request body:", req.body);

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ FIX: Use findOne instead of findByEmail
    const user = await User.query().findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("✅ User found:", user.id, user.email);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" },
    );

    console.log("✅ Login successful for:", email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    console.log("👤 Get current user request");
    console.log("👤 User ID:", req.user?.id);

    if (!req.user || !req.user.id) {
      console.log("❌ No user ID in request");
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await User.query()
      .select("id", "name", "email", "created_at")
      .where("id", req.user.id)
      .first();

    if (!user) {
      console.log("❌ User not found in database:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.id, user.email);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
