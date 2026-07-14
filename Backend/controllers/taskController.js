const db = require("../config/db");

// Backend/controllers/taskController.js
exports.getTasks = async (req, res) => {
  try {
    console.log("📋 Getting tasks for user:", req.user.id);

    const tasks = await db("tasks")
      .where("user_id", req.user.id)
      .orWhere("assigned_to", req.user.id)
      .orderBy("status")
      .orderBy("order")
      .orderBy("created_at", "desc");

    // Get users for assignment dropdown
    const users = await db("users")
      .select("id", "name", "email")
      .where("id", "!=", req.user.id);

    // ✅ Get tags for all tasks
    const taskIds = tasks.map((t) => t.id);
    let tagsMap = {};
    if (taskIds.length > 0) {
      const taskTags = await db("tags")
        .join("task_tags", "tags.id", "task_tags.tag_id")
        .whereIn("task_tags.task_id", taskIds)
        .select("task_tags.task_id", "tags.id as tag_id", "tags.name");

      taskTags.forEach((tt) => {
        if (!tagsMap[tt.task_id]) tagsMap[tt.task_id] = [];
        tagsMap[tt.task_id].push(tt.name); // ✅ Store just the tag name as string
      });
    }

    // Add tags to each task
    const tasksWithTags = tasks.map((task) => ({
      ...task,
      tags: tagsMap[task.id] || [], // ✅ Array of tag name strings
    }));

    console.log("✅ Tasks found:", tasks.length);
    res.json({ tasks: tasksWithTags, users });
  } catch (error) {
    console.error("❌ Error getting tasks:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    console.log("📝 Creating task for user:", req.user.id);
    console.log("📝 Task data:", req.body);

    const { title, description, status, priority, due_date, assigned_to } =
      req.body;

    // Validate required fields
    if (!title || !due_date) {
      return res
        .status(400)
        .json({ message: "Title and due date are required" });
    }

    // Get the highest order for the status
    const lastTask = await db("tasks")
      .where({ user_id: req.user.id, status: status || "pending" })
      .orderBy("order", "desc")
      .first();

    const order = lastTask ? lastTask.order + 1 : 0;

    // Create task
    const [taskId] = await db("tasks").insert({
      title: title.trim(),
      description: description ? description.trim() : "",
      status: status || "pending",
      priority: priority || "medium",
      due_date: due_date,
      order: order,
      user_id: req.user.id,
      assigned_to: assigned_to || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("✅ Task created with ID:", taskId);
    const task = await db("tasks").where("id", taskId).first();
    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update task status (drag and drop)
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  const trx = await db.transaction();

  try {
    const { status, targetIndex } = req.body;
    console.log("🔄 Updating task status:", {
      id: req.params.id,
      status,
      targetIndex,
    });

    // Validate status
    if (!["pending", "in-progress", "completed"].includes(status)) {
      await trx.rollback();
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await trx("tasks").where("id", req.params.id).first();

    if (!task) {
      await trx.rollback();
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ FIXED: Allow Creator OR Assignee to change status
    if (task.user_id !== req.user.id && task.assigned_to !== req.user.id) {
      await trx.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all tasks in the target status
    const tasksInStatus = await trx("tasks")
      .where({ user_id: req.user.id, status: status })
      .orderBy("order");

    // Remove task from current status and update order
    if (task.status !== status) {
      // Remove from old status and reorder
      await trx("tasks")
        .where({
          user_id: req.user.id,
          status: task.status,
        })
        .where("order", ">", task.order)
        .decrement("order", 1);

      // Insert into new status at target position
      const newOrder =
        targetIndex !== undefined ? targetIndex : tasksInStatus.length;

      // Shift tasks after insertion point
      await trx("tasks")
        .where({
          user_id: req.user.id,
          status: status,
        })
        .where("order", ">=", newOrder)
        .increment("order", 1);

      // Update the task
      await trx("tasks").where("id", req.params.id).update({
        status: status,
        order: newOrder,
        updated_at: new Date(),
      });
    } else {
      // Reorder within same status
      const oldOrder = task.order;

      if (targetIndex !== undefined && targetIndex !== oldOrder) {
        if (targetIndex > oldOrder) {
          // Moving down
          await trx("tasks")
            .where({
              user_id: req.user.id,
              status: status,
            })
            .where("order", ">", oldOrder)
            .where("order", "<=", targetIndex)
            .decrement("order", 1);
        } else {
          // Moving up
          await trx("tasks")
            .where({
              user_id: req.user.id,
              status: status,
            })
            .where("order", ">=", targetIndex)
            .where("order", "<", oldOrder)
            .increment("order", 1);
        }

        await trx("tasks").where("id", req.params.id).update({
          order: targetIndex,
          updated_at: new Date(),
        });
      }
    }

    await trx.commit();

    // Get updated task
    const updatedTask = await db("tasks").where("id", req.params.id).first();
    console.log("✅ Task status updated:", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    await trx.rollback();
    console.error("❌ Error updating task status:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.sql : undefined,
    });
  }
};

// backend/controllers/taskController.js - Add these functions

// @desc    Get all tags
// @route   GET /api/tags
// @access  Private
exports.getTags = async (req, res) => {
  try {
    const tags = await db("tags").orderBy("name", "asc");
    res.json(tags);
  } catch (error) {
    console.error("❌ Error getting tags:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get tags for a task
// @route   GET /api/tasks/:id/tags
// @access  Private
exports.getTaskTags = async (req, res) => {
  try {
    const tags = await db("tags")
      .join("task_tags", "tags.id", "task_tags.tag_id")
      .where("task_tags.task_id", req.params.id)
      .select("tags.*");
    res.json(tags);
  } catch (error) {
    console.error("❌ Error getting task tags:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update task tags
// @route   PUT /api/tasks/:id/tags
// @access  Private
exports.updateTaskTags = async (req, res) => {
  const trx = await db.transaction();
  try {
    const { tags } = req.body; // Array of tag names
    const taskId = req.params.id;

    // Verify task exists
    const task = await trx("tasks").where("id", taskId).first();
    if (!task) {
      await trx.rollback();
      return res.status(404).json({ message: "Task not found" });
    }

    // Check authorization
    if (task.user_id !== req.user.id && task.assigned_to !== req.user.id) {
      await trx.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete existing task tags
    await trx("task_tags").where("task_id", taskId).del();

    // Process new tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const trimmedTag = tagName.trim().toLowerCase();
        if (trimmedTag) {
          // Get or create tag
          let tag = await trx("tags").where("name", trimmedTag).first();
          if (!tag) {
            const [tagId] = await trx("tags").insert({
              name: trimmedTag,
              created_at: new Date(),
            });
            tag = { id: tagId, name: trimmedTag };
          }
          // Create task-tag relationship
          await trx("task_tags").insert({
            task_id: taskId,
            tag_id: tag.id,
          });
        }
      }
    }

    await trx.commit();

    // Get updated tags
    const updatedTags = await db("tags")
      .join("task_tags", "tags.id", "task_tags.tag_id")
      .where("task_tags.task_id", taskId)
      .select("tags.*");

    res.json(updatedTags);
  } catch (error) {
    await trx.rollback();
    console.error("❌ Error updating task tags:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update getTasks to include tags
exports.getTasks = async (req, res) => {
  try {
    console.log("📋 Getting tasks for user:", req.user.id);

    const tasks = await db("tasks")
      .where("user_id", req.user.id)
      .orWhere("assigned_to", req.user.id)
      .orderBy("status")
      .orderBy("order")
      .orderBy("created_at", "desc");

    // Get users for assignment dropdown
    const users = await db("users")
      .select("id", "name", "email")
      .where("id", "!=", req.user.id);

    // Get tags for all tasks
    const taskIds = tasks.map((t) => t.id);
    let tagsMap = {};
    if (taskIds.length > 0) {
      const taskTags = await db("tags")
        .join("task_tags", "tags.id", "task_tags.tag_id")
        .whereIn("task_tags.task_id", taskIds)
        .select("task_tags.task_id", "tags.id as tag_id", "tags.name");

      taskTags.forEach((tt) => {
        if (!tagsMap[tt.task_id]) tagsMap[tt.task_id] = [];
        tagsMap[tt.task_id].push({ id: tt.tag_id, name: tt.name });
      });
    }

    // Add tags to each task
    const tasksWithTags = tasks.map((task) => ({
      ...task,
      tags: tagsMap[task.id] || [],
    }));

    console.log("✅ Tasks found:", tasks.length);
    res.json({ tasks: tasksWithTags, users });
  } catch (error) {
    console.error("❌ Error getting tasks:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Backend/controllers/taskController.js

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  const trx = await db.transaction(); // ✅ Use transaction for tags update

  try {
    const { title, description, priority, due_date, assigned_to, tags } = req.body;
    console.log("📝 Updating task:", {
      id: req.params.id,
      title,
      priority,
      assigned_to,
      tags, // ✅ Log tags
    });

    const task = await trx("tasks").where("id", req.params.id).first();

    if (!task) {
      await trx.rollback();
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Allow Creator OR Assignee to update
    if (task.user_id !== req.user.id && task.assigned_to !== req.user.id) {
      await trx.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Update task basic info
    await trx("tasks")
      .where("id", req.params.id)
      .update({
        title: title || task.title,
        description: description || task.description,
        priority: priority || task.priority,
        due_date: due_date || task.due_date,
        assigned_to: assigned_to !== undefined ? assigned_to : task.assigned_to,
        updated_at: new Date(),
      });

    // ✅ Handle tags if provided
    if (tags !== undefined) {
      // Delete existing task tags
      await trx("task_tags").where("task_id", req.params.id).del();

      // Process new tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          const trimmedTag = tagName.trim().toLowerCase();
          if (trimmedTag) {
            // Get or create tag
            let tag = await trx("tags").where("name", trimmedTag).first();
            if (!tag) {
              const [tagId] = await trx("tags").insert({
                name: trimmedTag,
                created_at: new Date(),
              });
              tag = { id: tagId, name: trimmedTag };
            }
            // Create task-tag relationship
            await trx("task_tags").insert({
              task_id: req.params.id,
              tag_id: tag.id,
            });
          }
        }
      }
    }

    await trx.commit();

    // ✅ Get updated task with tags
    const updatedTask = await db("tasks").where("id", req.params.id).first();

    // Get tags for the updated task
    const taskTags = await db("tags")
      .join("task_tags", "tags.id", "task_tags.tag_id")
      .where("task_tags.task_id", req.params.id)
      .select("tags.name");

    const tagNames = taskTags.map(t => t.name);

    const result = {
      ...updatedTask,
      tags: tagNames,
    };

    console.log("✅ Task updated:", result);
    res.json(result);
  } catch (error) {
    await trx.rollback();
    console.error("❌ Error updating task:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  const trx = await db.transaction();

  try {
    console.log("🗑️ Deleting task:", req.params.id);

    const task = await trx("tasks").where("id", req.params.id).first();

    if (!task) {
      await trx.rollback();
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ FIXED: Allow Creator OR Assignee to delete
    if (task.user_id !== req.user.id && task.assigned_to !== req.user.id) {
      await trx.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    // Reorder remaining tasks
    await trx("tasks")
      .where({
        user_id: req.user.id,
        status: task.status,
      })
      .where("order", ">", task.order)
      .decrement("order", 1);

    await trx("tasks").where("id", req.params.id).delete();
    await trx.commit();

    console.log("✅ Task deleted successfully");
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    await trx.rollback();
    console.error("❌ Error deleting task:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.sql : undefined,
    });
  }
};
