// Backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ✅ Debug: Log all environment variables starting with JWT
console.log(
  "🔍 All env vars starting with JWT:",
  Object.keys(process.env).filter((key) => key.startsWith("JWT")),
);

// ✅ Get JWT_SECRET with a fallback
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "RY+JmvJ35dWFpYhhLNBSEtHiMZvInCe5mXW07bm5GQW9ZPrJDynQIBkW5iZ93xWEpASyj/BONBk1+rR5NuGHdg==";
console.log(
  "🔑 JWT_SECRET in authController:",
  JWT_SECRET ? "✅ Set" : "❌ Not set",
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📝 Login attempt for:", email);

    // Check if user exists
    const user = await db("users").where("email", email).first();
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Use the JWT_SECRET variable (already defined above)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    });

    console.log("✅ Login successful for:", email);

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await db("users").where("email", email).first();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [userId] = await db("users").insert({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Get created user
    const user = await db("users").where("id", userId).first();

    // ✅ Use the JWT_SECRET variable (already defined above)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    });

    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await db("users")
      .where("id", req.user.id)
      .select("id", "name", "email", "created_at")
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
