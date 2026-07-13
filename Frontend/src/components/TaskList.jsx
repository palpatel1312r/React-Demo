import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectFilteredTasks,
  selectTaskLoading,
  fetchTasks,
  deleteTask,
  setFilters,
  clearFilters,
} from "../features/tasks/taskSlice";
import { selectIsLoggedIn } from "../features/auth/authSlice";
import { selectTheme } from "../features/theme/themeSlice";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import ConfirmDialog from "./ConfirmDialog";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const loading = useSelector(selectTaskLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const theme = useSelector(selectTheme);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Only fetch tasks if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(
        setFilters({
          status: filterStatus,
          priority: filterPriority,
        }),
      );
    }
  }, [dispatch, filterStatus, filterPriority, isLoggedIn]);

  const handleDelete = (id, title) => {
    setDeletingTaskId(id);
    setDeletingTaskTitle(title);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteTask(deletingTaskId)).unwrap();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setDeletingTaskId(null);
      setDeletingTaskTitle("");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingTaskId(null);
    setDeletingTaskTitle("");
    setIsDeleting(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterPriority("");
    dispatch(clearFilters());
  };

  const isDark = theme === "dark";

  // If user is not logged in, show login message
  if (!isLoggedIn) {
    return (
      <div className="container py-5">
        <div
          className="text-center py-5"
          style={{
            backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
            borderRadius: "16px",
            padding: "60px 20px",
            border: `1px solid ${isDark ? "#3d3d3d" : "#e5e7eb"}`,
          }}
        >
          <div
            className="icon-container"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#3d3d3d" : "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
            }}
          >
            <i
              className="fas fa-lock"
              style={{
                fontSize: "36px",
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
            ></i>
          </div>

          <h3
            style={{
              color: isDark ? "#f0f0f0" : "#1a1a1a",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Please Login to Access Tasks
          </h3>

          <p
            style={{
              color: isDark ? "#b0b0b0" : "#6b7280",
              fontSize: "16px",
              marginBottom: "24px",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            You need to be logged in to view and manage your tasks. Please login
            to continue.
          </p>

          <Link to="/login">
            <button
              className="btn btn-primary btn-lg"
              style={{
                borderRadius: "10px",
                padding: "12px 40px",
                fontWeight: "500",
              }}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Login Now
            </button>
          </Link>

          <div className="mt-3">
            <Link
              to="/register"
              style={{
                color: isDark ? "#9ca3af" : "#6b7280",
                textDecoration: "none",
              }}
            >
              Don't have an account?{" "}
              <span style={{ color: "#0d6efd" }}>Register here</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: isDark ? "#f0f0f0" : "#1a1a1a" }}>My Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus me-2"></i>
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                color: isDark ? "#e0e0e0" : "#212529",
                border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                color: isDark ? "#e0e0e0" : "#212529",
                border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
              }}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              className="btn"
              onClick={handleClearFilters}
              style={{
                backgroundColor: isDark ? "#3d3d3d" : "#6c757d",
                color: isDark ? "#e0e0e0" : "#ffffff",
                border: isDark ? "1px solid #3d3d3d" : "1px solid #6c757d",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? "#4d4d4d" : "#5a6268";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? "#3d3d3d" : "#6c757d";
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-5">
          <h4 style={{ color: isDark ? "#9ca3af" : "#6c757d" }}>
            No tasks found
          </h4>
          <p style={{ color: isDark ? "#9ca3af" : "#6c757d" }}>
            Create your first task!
          </p>
        </div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => handleEdit(task)}
              onDelete={() => handleDelete(task.id, task.title)}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm show={showForm} onClose={handleCloseForm} task={editingTask} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        show={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTaskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
      />
    </div>
  );
};

export default TaskList;
