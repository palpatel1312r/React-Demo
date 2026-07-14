// Backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ FIXED: Use JWT_SECRET from .env
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET not defined in .env file!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const user = await db("users").where("id", decoded.id).first();

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
