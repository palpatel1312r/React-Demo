const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Generate JWT Token
const generateToken = (userId) => {
  try {
    console.log("🔑 Generating token for userId:", userId);
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("✅ Token generated successfully");
    return token;
  } catch (error) {
    console.error("❌ Error generating token:", error);
    throw error;
  }
};

// Register a new user
const register = async (req, res) => {
  console.log("📝 Registration request received");
  console.log("Request body:", req.body);

  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log("📊 Form data:", {
      name,
      email,
      passwordLength: password?.length,
    });

    // Validation
    if (!name || !email || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password.length < 4) {
      console.log("❌ Validation failed: Password too short");
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters",
      });
    }

    if (password !== confirmPassword) {
      console.log("❌ Validation failed: Passwords do not match");
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user exists
    console.log("🔍 Checking if user exists:", email);
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    console.log("✅ User does not exist, proceeding...");

    // Create user
    console.log("👤 Creating new user...");
    const newUser = await User.create({ name, email, password });
    console.log("✅ User created successfully:", newUser);

    // Generate token
    console.log("🔑 Generating JWT token...");
    const token = generateToken(newUser.id);
    console.log("✅ Token generated");

    // Send response
    const response = {
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
    console.log("📤 Sending response:", response);
    res.status(201).json(response);
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("❌ Error stack:", error.stack);

    // Check for specific errors
    if (error.message === "Email already exists") {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login user
const login = async (req, res) => {
  console.log("📝 Login request received");
  console.log("Request body:", { email: req.body.email });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    console.log("🔍 Finding user:", email);
    const user = await User.findByEmail(email);
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log("✅ User found:", user.id);

    // Check password
    console.log("🔐 Checking password...");
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log("✅ Password matches");

    // Generate token
    const token = generateToken(user.id);

    const response = {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    console.log("📤 Sending login response");
    res.json(response);
  } catch (error) {
    console.error("❌ Login error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    console.log("👤 Getting current user:", req.userId);
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("❌ User not found:", req.userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
