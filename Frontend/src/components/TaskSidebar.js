// src/components/TaskSidebar.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  updateTask,
  selectAllUsersSelector,
  fetchTags,
  selectAllTags,
} from "../features/tasks/taskSlice";
import { selectTheme } from "../features/theme/themeSlice";
import TagInput from "./TagInput";

const TaskSidebar = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const dispatch = useDispatch();
  const isDark = useSelector(selectTheme) === "dark";
  const users = useSelector(selectAllUsersSelector); // ✅ Fixed: Only one declaration
  const availableTags = useSelector(selectAllTags);

  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [tags, setTags] = useState([]); // ✅ Added missing state

  // Load tags when task changes
  useEffect(() => {
    if (task) {
      setSelectedUser(task.assigned_to || "");
      // Load tags from task
      if (task.tags) {
        setTags(task.tags.map((t) => (typeof t === "string" ? t : t.name)));
      } else {
        setTags([]);
      }
    }
  }, [task]);

  // Load available tags when component mounts
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  if (!isOpen || !task) return null;

  const handleAssign = async () => {
    setLoading(true);
    try {
      const payload = {
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        due_date: task.due_date,
        status: task.status,
        assigned_to: selectedUser || null,
        tags: tags, // ✅ Include tags in the update
      };

      await dispatch(updateTask({ id: task.id, taskData: payload })).unwrap();

      // Close the sidebar and refresh
      onClose();
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error("Failed to assign task:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignedUserName = (userId) => {
    const user = users?.find((u) => u.id === userId);
    return user ? user.name : "Unassigned";
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: "🟢 Low",
      medium: "🟡 Medium",
      high: "🔴 High",
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "⏳ Pending",
      "in-progress": "🔄 In Progress",
      completed: "✅ Completed",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const styles = {
    bg: isDark ? "#1e1e1e" : "#ffffff",
    text: isDark ? "#e0e0e0" : "#212529",
    inputBg: isDark ? "#2d2d2d" : "#ffffff",
    border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
    hover: isDark ? "#2d2d2d" : "#f8f9fa",
    label: isDark ? "#adb5bd" : "#6c757d",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1040,
          display: isOpen ? "block" : "none",
        }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="position-fixed top-0 end-0 h-100 shadow-lg"
        style={{
          width: "380px",
          backgroundColor: styles.bg,
          color: styles.text,
          zIndex: 1050,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          overflowY: "auto",
          padding: "0",
        }}
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center p-3 border-bottom"
          style={{ borderColor: isDark ? "#3d3d3d" : "#dee2e6" }}
        >
          <h5 className="mb-0">
            <i className="fas fa-info-circle me-2"></i>
            Task Details
          </h5>
          <button
            className="btn-close"
            onClick={onClose}
            style={{ filter: isDark ? "invert(1)" : "none" }}
          />
        </div>

        {/* Body */}
        <div className="p-3">
          {/* Task Title */}
          <div className="mb-3">
            <h6 className="fw-bold" style={{ fontSize: "1.1rem" }}>
              {task.title}
            </h6>
            {task.description && (
              <p
                className="text-muted small mb-0"
                style={{ fontSize: "0.9rem" }}
              >
                {task.description}
              </p>
            )}
          </div>

          {/* Task Details - Read Only */}
          <div className="mb-3">
            <div className="d-flex gap-2 flex-wrap">
              <span
                className="badge"
                style={{
                  backgroundColor: isDark ? "#3d3d3d" : "#e9ecef",
                  color: isDark ? "#e0e0e0" : "#212529",
                  padding: "6px 12px",
                }}
              >
                {getPriorityLabel(task.priority)}
              </span>
              <span
                className="badge"
                style={{
                  backgroundColor: isDark ? "#3d3d3d" : "#e9ecef",
                  color: isDark ? "#e0e0e0" : "#212529",
                  padding: "6px 12px",
                }}
              >
                {getStatusLabel(task.status)}
              </span>
              <span
                className="badge"
                style={{
                  backgroundColor: isDark ? "#3d3d3d" : "#e9ecef",
                  color: isDark ? "#e0e0e0" : "#212529",
                  padding: "6px 12px",
                }}
              >
                <i className="fas fa-calendar me-1"></i>
                {formatDate(task.due_date)}
              </span>
            </div>
          </div>

          {/* Current Assignment - Read Only */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ color: styles.label }}
            >
              <i className="fas fa-user me-2"></i>
              Currently Assigned To
            </label>
            <div
              className="p-2 rounded"
              style={{
                backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
                border: styles.border,
              }}
            >
              {getAssignedUserName(task.assigned_to)}
            </div>
          </div>

          <hr className={isDark ? "border-secondary" : ""} />

          {/* Assign To - Editable */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ color: styles.label }}
            >
              <i className="fas fa-user-plus me-2"></i>
              Reassign To
              <span className="text-muted ms-1" style={{ fontSize: "0.8rem" }}>
                (Select a new assignee)
              </span>
            </label>
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{
                backgroundColor: styles.inputBg,
                color: styles.text,
                border: styles.border,
              }}
            >
              <option value="">Unassigned</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {selectedUser && (
              <div className="mt-2">
                <span className="badge bg-primary">
                  <i className="fas fa-user-check me-1"></i>
                  Will be assigned to: {getAssignedUserName(selectedUser)}
                </span>
              </div>
            )}
          </div>

          {/* Tags Input Section */}
          <div className="mb-3">
            <label className="form-label" style={{ color: styles.text }}>
              <i className="fas fa-tags me-2"></i>
              Tags
            </label>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              isDark={isDark}
              suggestions={availableTags}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-3 border-top position-sticky bottom-0"
          style={{
            backgroundColor: styles.bg,
            borderColor: isDark ? "#3d3d3d" : "#dee2e6",
          }}
        >
          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary flex-grow-1"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleAssign}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update Task
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskSidebar;
