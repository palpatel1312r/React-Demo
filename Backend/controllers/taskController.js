// Backend/controllers/taskController.js
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    console.log("📝 Creating task...");
    console.log("📝 User object:", req.user);

    if (!req.user || !req.user.id) {
      console.log("❌ No user found in request");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { title, description, status, priority, due_date } = req.body;
    const user_id = req.user.id;

    console.log("📝 User ID:", user_id);
    console.log("📝 Request body:", req.body);

    if (!title) {
      console.log("❌ Title is missing");
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await Task.query().insert({
      user_id,
      title,
      description: description || null,
      status: status || "pending",
      priority: priority || "medium",
      due_date: due_date || null,
    });

    console.log("✅ Task created:", task);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("❌ Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    console.log("📋 Fetching tasks...");
    console.log("📋 User object:", req.user);

    if (!req.user || !req.user.id) {
      console.log("❌ No user found in request");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user_id = req.user.id;
    const { status, priority } = req.query;

    console.log("📋 User ID:", user_id);
    console.log("📋 Filters:", { status, priority });

    let query = Task.query().where("user_id", user_id);

    if (status) {
      query = query.where("status", status);
    }
    if (priority) {
      query = query.where("priority", priority);
    }

    const tasks = await query.orderBy("created_at", "desc");

    console.log(`✅ Found ${tasks.length} tasks`);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks: tasks,
    });
  } catch (error) {
    console.error("❌ Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const task = await Task.query()
      .where("id", id)
      .andWhere("user_id", user_id)
      .first();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { title, description, status, priority, due_date } = req.body;

    const existingTask = await Task.query()
      .where("id", id)
      .andWhere("user_id", user_id)
      .first();

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const updatedTask = await Task.query().patchAndFetchById(id, {
      title,
      description,
      status,
      priority,
      due_date,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const deletedCount = await Task.query()
      .where("id", id)
      .andWhere("user_id", user_id)
      .delete();

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};
