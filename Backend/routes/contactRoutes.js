const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const auth = require("../middleware/auth");

// Public routes
router.post("/submit", contactController.submitContact);

// Admin only routes (protected by auth middleware)
router.get("/all", auth, contactController.getAllContacts);
router.get("/unread", auth, contactController.getUnreadContacts);
router.put("/:id/read", auth, contactController.markAsRead);
router.delete("/:id", auth, contactController.deleteContact);

module.exports = router;
