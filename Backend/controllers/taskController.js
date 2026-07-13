
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const { title, description, status, priority, due_date } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const task = await Task.query().insert({
      user_id: req.user.id,
      title: title.trim(),
      description: description?.trim() || null,
      status: status || "pending",
      priority: priority || "medium",
      due_date: due_date?.trim() || null,
    });

    res.status(201).json({ success: true, message: "Task created", task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const { status, priority } = req.query;
    let query = Task.query().where("user_id", req.user.id);

    if (status) query = query.where("status", status);
    if (priority) query = query.where("priority", priority);

    const tasks = await query.orderBy("created_at", "desc");

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.query()
      .where("id", req.params.id)
      .andWhere("user_id", req.user.id)
      .first();

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    const existingTask = await Task.query()
      .where("id", id)
      .andWhere("user_id", req.user.id)
      .first();

    if (!existingTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const updatedTask = await Task.query().patchAndFetchById(id, {
      title: title ? title.trim() : existingTask.title,
      description: description?.trim() || null,
      status: status || existingTask.status,
      priority: priority || existingTask.priority,
      due_date: due_date?.trim() || null,
    });

    res
      .status(200)
      .json({ success: true, message: "Task updated", task: updatedTask });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deletedCount = await Task.query()
      .where("id", req.params.id)
      .andWhere("user_id", req.user.id)
      .delete();

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};
