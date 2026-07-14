const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware"); // Use protect from authMiddleware

// Public routes
router.post("/submit", contactController.submitContact);

// Admin only routes (protected by auth middleware)
router.get("/all", protect, contactController.getAllContacts);
router.get("/unread", protect, contactController.getUnreadContacts);
router.put("/:id/read", protect, contactController.markAsRead);
router.delete("/:id", protect, contactController.deleteContact);

module.exports = router;
