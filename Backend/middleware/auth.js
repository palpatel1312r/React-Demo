// Backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ✅ Get JWT_SECRET with fallback (same as controller)
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "RY+JmvJ35dWFpYhhLNBSEtHiMZvInCe5mXW07bm5GQW9ZPrJDynQIBkW5iZ93xWEpASyj/BONBk1+rR5NuGHdg==";

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("🔑 Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔑 Token received:", token.substring(0, 30) + "...");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded);

    const user = await db("users").where("id", decoded.id).first();
    console.log("👤 User found:", user ? user.id : "Not found");

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
