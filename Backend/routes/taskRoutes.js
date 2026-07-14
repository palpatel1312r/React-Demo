// Backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
// ✅ Make sure auth is imported correctly
const auth = require("../middleware/auth");

// ✅ Check if auth middleware exists before using it
if (!auth) {
  console.error("❌ Auth middleware not found!");
  // Fallback: create a simple auth middleware if needed
  router.use((req, res, next) => {
    // Simple auth check - you might want to implement proper auth here
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token provided" });
    }
    next();
  });
} else {
  // All routes require authentication
  router.use(auth);
}

// Task CRUD routes
router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:id/status", taskController.updateTaskStatus);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Tag routes
router.get("/tags", taskController.getTags);
router.get("/:id/tags", taskController.getTaskTags);
router.put("/:id/tags", taskController.updateTaskTags);

module.exports = router;
