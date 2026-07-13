// Backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    console.log("🔐 Auth header:", authHeader);

    if (!authHeader) {
      console.log("❌ No Authorization header");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Check if header starts with Bearer
    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid auth header format");
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    console.log("🔑 Token received:", token.substring(0, 20) + "...");

    if (!token) {
      console.log("❌ No token after Bearer");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    // ✅ IMPORTANT: Set user on request
    req.user = decoded;
    console.log("👤 User set on request:", req.user);

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
