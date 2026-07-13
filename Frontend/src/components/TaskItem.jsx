// Frontend/src/components/TaskItem.jsx
import React from "react";
import { format, isValid, parseISO } from "date-fns";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning",
      "in-progress": "bg-info",
      completed: "bg-success",
    };
    return badges[status] || "bg-secondary";
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-success",
      medium: "bg-warning",
      high: "bg-danger",
    };
    return badges[priority] || "bg-secondary";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: "fa-arrow-down",
      medium: "fa-minus",
      high: "fa-arrow-up",
    };
    return icons[priority] || "fa-circle";
  };

  // Safe date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    try {
      // Try to parse the date
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);

      // Check if date is valid
      if (!isValid(date)) {
        return "Invalid date";
      }

      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No date";

    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);

      if (!isValid(date)) {
        return "Invalid date";
      }

      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <h5 className="card-title mb-2">{task.title || "Untitled Task"}</h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={onEdit}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={onDelete}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="card-text text-muted small">{task.description}</p>
          )}

          <div className="mt-3">
            <span className={`badge ${getStatusBadge(task.status)} me-2`}>
              {task.status || "pending"}
            </span>
            <span className={`badge ${getPriorityBadge(task.priority)}`}>
              <i className={`fas ${getPriorityIcon(task.priority)} me-1`}></i>
              {task.priority || "medium"}
            </span>
          </div>

          {task.due_date && (
            <div className="mt-2 small text-muted">
              <i className="fas fa-calendar-alt me-1"></i>
              Due: {formatDate(task.due_date)}
            </div>
          )}

          <div className="mt-2 small text-muted">
            <i className="fas fa-clock me-1"></i>
            Created: {formatDateTime(task.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
