// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Title is required"],
//       trim: true,
//       maxlength: [255, "Title cannot exceed 255 characters"],
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: [1000, "Description cannot exceed 1000 characters"],
//     },
//     status: {
//       type: String,
//       enum: ["pending", "in-progress", "completed"],
//       default: "pending",
//       required: true,
//     },
//     priority: {
//       type: String,
//       enum: ["low", "medium", "high"],
//       default: "medium",
//       required: true,
//     },
//     due_date: {
//       type: Date,
//       required: [true, "Due date is required"],
//     },
//     order: {
//       type: Number,
//       default: 0,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   },
// );

// // Index for efficient queries
// taskSchema.index({ user: 1, status: 1, order: 1 });

// module.exports = mongoose.model("Task", taskSchema);
