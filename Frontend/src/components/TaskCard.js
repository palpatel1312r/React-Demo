import React from "react";
import { format, isValid, parseISO } from "date-fns";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onOpenSidebar,
  isDark,
  isDragging,
  users,
  currentUser,
}) => {
  const getPriorityBadge = (priority) => {
    const badges = {
      low: { class: "bg-success", icon: "fa-arrow-down" },
      medium: { class: "bg-warning", icon: "fa-minus" },
      high: { class: "bg-danger", icon: "fa-arrow-up" },
    };
    return badges[priority] || badges.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);
      if (!isValid(date)) return "Invalid date";
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const priorityInfo = getPriorityBadge(task.priority);

  // Check if current user is the creator
  const isCreator = task.user_id === currentUser?.id;

  // Check if current user is assigned to this task
  const isAssigned =
    task.assigned_to && Number(task.assigned_to) === Number(currentUser?.id);

  // User can manage if they are the creator OR assigned to the task
  const canManage = isCreator || isAssigned;

  // Debug logging to help identify the issue
  console.log("🔍 TaskCard Debug:", {
    taskId: task.id,
    taskTitle: task.title,
    taskUserId: task.user_id,
    taskAssignedTo: task.assigned_to,
    currentUserId: currentUser?.id,
    isCreator,
    isAssigned,
    canManage,
    usersAvailable: users?.length || 0,
  });

  // Get assigned user name
  const assignedUser = users?.find((user) => user.id === task.assigned_to);

  // Get creator name
  const creator = isCreator
    ? "You"
    : users?.find((user) => user.id === task.user_id)?.name || "User 3";

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "#098622",
      "in-progress": "#e4eb03",
      completed: "#d91515",
    };
    return colors[status] || "#6c757d";
  };

  // Handle card click
  const handleCardClick = () => {
    if (onOpenSidebar) {
      onOpenSidebar(task);
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        color: isDark ? "#e0e0e0" : "#212529",
        border: isDragging
          ? "2px solid #0d6efd"
          : `1px solid ${isDark ? "#3d3d3d" : "#dee2e6"}`,
        transform: isDragging ? "rotate(2deg)" : "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={handleCardClick}
    >

      {task.tags && task.tags.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mt-1">
          {task.tags.map((tag, index) => {
            // ✅ Handle both string and object tags
            const tagName = typeof tag === "string" ? tag : tag.name;
            return (
              <span
                key={index}
                className="badge"
                style={{
                  backgroundColor: isDark ? "#2d2d2d" : "#e9ecef",
                  color: isDark ? "#e0e0e0" : "#495057",
                  fontSize: "11px",
                  padding: "3px 8px",
                }}
              >
                {/* #{tagName} */}
              </span>
            );
          })}
        </div>
      )}
      {/* Status indicator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          backgroundColor: getStatusColor(task.status),
          borderRadius: "4px 0 0 4px",
        }}
      />
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start">
          <h6
            className="card-title mb-2"
            style={{ fontWeight: "600", paddingLeft: "4px" }}
          >
            {task.title}
          </h6>

          <div className="d-flex gap-1">
            {/* Show buttons if user can manage */}
            {canManage && (
              <>
                <button
                  className="btn btn-sm btn-outline-primary p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  style={{ fontSize: "12px" }}
                  title="Edit task"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id, task.title);
                  }}
                  style={{ fontSize: "12px" }}
                  title="Delete task"
                >
                  <i className="fas fa-trash"></i>
                </button>
                {/* <button
                  className="btn btn-sm btn-outline-info p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenSidebar) {
                      onOpenSidebar(task);
                    }
                  }}
                  style={{ fontSize: "12px" }}
                  title="Manage assignments"
                >
                  <i className="fas fa-users-cog"></i>
                </button> */}
              </>
            )}
          </div>
        </div>
        {task.description && (
          <p
            className="card-text small text-muted mb-2"
            style={{ paddingLeft: "4px" }}
          >
            {task.description.length > 60
              ? `${task.description.substring(0, 60)}...`
              : task.description}
          </p>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mt-1">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="badge"
                style={{
                  backgroundColor: isDark ? "#2d2d2d" : "#e9ecef",
                  color: isDark ? "#e0e0e0" : "#495057",
                  fontSize: "11px",
                  padding: "3px 8px",
                }}
              >
                #{typeof tag === "string" ? tag : tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
          <span className={`badge ${priorityInfo.class}`}>
            <i className={`fas ${priorityInfo.icon} me-1`}></i>
            {task.priority || "medium"}
          </span>

          {task.due_date && (
            <span className="badge bg-secondary">
              <i className="fas fa-calendar-alt me-1"></i>
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
        {assignedUser && (
          <div className="mt-1 small">
            <span
              className="badge"
              style={{
                backgroundColor: isDark ? "#0d6efd" : "#0dcaf0",
                color: isDark ? "#fff" : "#000",
              }}
            >
              <i className="fas fa-user-check me-1"></i>
              Assigned to: {assignedUser.name}
            </span>
          </div>
        )}
        {!isCreator && (
          <div className="mt-1 small text-muted">
            <i className="fas fa-user me-1"></i>
            Created by: {creator}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
