// src/components/TaskBoard.js
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import {
  selectTasksByStatus,
  selectTaskLoading,
  selectAllUsersSelector,
  fetchTasks,
  updateTaskStatus,
  deleteTask,
  setFilters,
  clearFilters,
  selectAllTags,
} from "../features/tasks/taskSlice";
import { selectTheme } from "../features/theme/themeSlice";
import { selectIsLoggedIn, selectUser } from "../features/auth/authSlice";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import ConfirmDialog from "./ConfirmDialog";
import TaskSidebar from "./TaskSidebar";

const TaskBoard = () => {
  const dispatch = useDispatch();
  const tasksByStatus = useSelector(selectTasksByStatus);
  const loading = useSelector(selectTaskLoading);
  const users = useSelector(selectAllUsersSelector);
  const allTags = useSelector(selectAllTags);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isDark = useSelector(selectTheme) === "dark";
  const reduxUser = useSelector(selectUser);

  const currentUser = useMemo(() => {
    if (reduxUser && reduxUser.id) {
      console.log("✅ Using user from Redux:", reduxUser);
      return reduxUser;
    }
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          console.log("✅ Using user from localStorage:", parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
    return null;
  }, [reduxUser]);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterAssignment, setFilterAssignment] = useState("all");
  const [filterTag, setFilterTag] = useState(""); // Add tag filter state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isLoggedIn]);

  // Update filters when filter values change
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(
        setFilters({
          priority: filterPriority,
          assignment: filterAssignment,
          tag: filterTag, // Add tag filter
        }),
      );
    }
  }, [dispatch, filterPriority, filterAssignment, filterTag, isLoggedIn]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    console.log("🔄 Dragging task:", {
      id: parseInt(draggableId),
      from: source.droppableId,
      to: destination.droppableId,
      index: destination.index,
    });

    dispatch(
      updateTaskStatus({
        id: parseInt(draggableId),
        status: destination.droppableId,
        targetIndex: destination.index,
      }),
    );
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleClearFilters = () => {
    setFilterPriority("");
    setFilterAssignment("all");
    setFilterTag(""); // Clear tag filter
    dispatch(clearFilters());
  };

  const handleOpenSidebar = (task) => {
    setSelectedTask(task);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    dispatch(fetchTasks({ _t: Date.now() }));
  };

  const columns = [
    { id: "pending", title: "Pending", icon: "fa-clock" },
    { id: "in-progress", title: "In Progress", icon: "fa-spinner" },
    { id: "completed", title: "Completed", icon: "fa-check-circle" },
  ];

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
            You need to be logged in to view and manage your tasks.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/login">
              <button
                className="btn btn-primary btn-lg"
                style={{
                  borderRadius: "10px",
                  padding: "12px 40px",
                  fontWeight: "500",
                  minWidth: "140px",
                }}
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Login
              </button>
            </Link>
            <Link to="/register">
              <button
                className="btn btn-outline-primary btn-lg"
                style={{
                  borderRadius: "10px",
                  padding: "12px 40px",
                  fontWeight: "500",
                  minWidth: "140px",
                  border: isDark ? "1px solid #0d6efd" : "1px solid #0d6efd",
                  color: isDark ? "#0d6efd" : "#0d6efd",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#0d6efd";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = isDark ? "#0d6efd" : "#0d6efd";
                }}
              >
                <i className="fas fa-user-plus me-2"></i>
                Register
              </button>
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
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: isDark ? "#f0f0f0" : "#1a1a1a" }}>
          <i className="fas fa-tasks me-2"></i>
          Task Board
        </h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus me-2"></i>
          Add Task
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <div className="d-flex gap-2 align-items-center">
              <label
                className="fw-semibold me-1"
                style={{ color: isDark ? "#e0e0e0" : "#212529" }}
              >
                <i className="fas fa-filter me-1"></i>
                Priority:
              </label>
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
                  backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                  color: isDark ? "#e0e0e0" : "#212529",
                  border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
                  maxWidth: "150px",
                }}
              >
                <option value="">All</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label
                className="fw-semibold me-1"
                style={{ color: isDark ? "#e0e0e0" : "#212529" }}
              >
                <i className="fas fa-user me-1"></i>
                Show:
              </label>
              <select
                className="form-select"
                value={filterAssignment}
                onChange={(e) => setFilterAssignment(e.target.value)}
                style={{
                  backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                  color: isDark ? "#e0e0e0" : "#212529",
                  border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
                  maxWidth: "180px",
                }}
              >
                <option value="all">All Tasks</option>
                <option value="created">Created by Me</option>
                <option value="assigned">Assigned to Me</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div className="d-flex gap-2 align-items-center">
              <label
                className="fw-semibold me-1"
                style={{ color: isDark ? "#e0e0e0" : "#212529" }}
              >
                <i className="fas fa-tags me-1"></i>
                Tag:
              </label>
              <select
                className="form-select"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                style={{
                  backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                  color: isDark ? "#e0e0e0" : "#212529",
                  border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
                  maxWidth: "150px",
                }}
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option
                    key={tag.id || tag}
                    value={typeof tag === "string" ? tag : tag.name}
                  >
                    #{typeof tag === "string" ? tag : tag.name}
                  </option>
                ))}
              </select>
            </div>

            {(filterPriority || filterAssignment !== "all" || filterTag) && (
              <button
                className="btn btn-outline-secondary"
                onClick={handleClearFilters}
                style={{
                  color: isDark ? "#e0e0e0" : "#212529",
                  borderColor: isDark ? "#3d3d3d" : "#ced4da",
                }}
              >
                <i className="fas fa-times"></i> Clear All
              </button>
            )}

            <span className="ms-auto">
              <span
                className="badge"
                style={{
                  backgroundColor: isDark ? "#3d3d3d" : "#e9ecef",
                  color: isDark ? "#f0f0f0" : "#1a1a1a",
                  padding: "8px 16px",
                  fontSize: "14px",
                }}
              >
                <i className="fas fa-info-circle me-1"></i>
                {filterPriority
                  ? `${filterPriority.toUpperCase()} priority`
                  : "All priorities"}
                {filterAssignment === "created" && " | Created by me"}
                {filterAssignment === "assigned" && " | Assigned to me"}
                {filterTag && ` | Tag: #${filterTag}`}
              </span>
            </span>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row g-3">
          {columns.map((column) => (
            <div key={column.id} className="col-md-4">
              <div
                className="task-column p-3 rounded"
                style={{
                  backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
                  minHeight: "400px",
                  border: `1px solid ${isDark ? "#3d3d3d" : "#dee2e6"}`,
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 style={{ color: isDark ? "#f0f0f0" : "#1a1a1a" }}>
                    <i className={`fas ${column.icon} me-2`}></i>
                    {column.title}
                  </h5>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: isDark ? "#3d3d3d" : "#e9ecef",
                      color: isDark ? "#f0f0f0" : "#1a1a1a",
                    }}
                  >
                    {tasksByStatus[column.id]?.length || 0}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: "200px",
                        backgroundColor: snapshot.isDraggingOver
                          ? isDark
                            ? "#3d3d3d"
                            : "#e9ecef"
                          : "transparent",
                        transition: "background-color 0.2s ease",
                        borderRadius: "8px",
                        padding: "4px",
                      }}
                    >
                      {tasksByStatus[column.id]?.length === 0 && (
                        <div
                          className="text-center py-4"
                          style={{
                            color: isDark ? "#6c757d" : "#adb5bd",
                            fontSize: "14px",
                          }}
                        >
                          <i className="fas fa-inbox me-2"></i>
                          No tasks
                        </div>
                      )}
                      {tasksByStatus[column.id]?.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                marginBottom: "8px",
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onOpenSidebar={handleOpenSidebar}
                                isDark={isDark}
                                isDragging={snapshot.isDragging}
                                users={users}
                                currentUser={currentUser}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskForm
        show={showForm}
        onClose={handleCloseForm}
        task={editingTask}
        currentUser={currentUser}
      />

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

      <TaskSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
};

export default TaskBoard;
