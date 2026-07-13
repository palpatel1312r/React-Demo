import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "../features/tasks/taskSlice";
import { selectTheme } from "../features/theme/themeSlice";

const TaskForm = ({ show, onClose, task }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (task) {
      // Format date for input
      let dueDate = "";
      if (task.due_date) {
        try {
          const date = new Date(task.due_date);
          if (!isNaN(date.getTime())) {
            dueDate = date.toISOString().split("T")[0];
          }
        } catch (e) {
          console.error("Date parsing error:", e);
        }
      }

      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
        due_date: dueDate,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "",
        priority: "",
        due_date: "",
      });
    }
    setErrors({});
    setSubmitted(false);
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    // Title validation - REQUIRED
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    // Description validation - OPTIONAL (only validate length if provided)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    // Status validation - REQUIRED
    if (!formData.status || formData.status.trim() === "") {
      newErrors.status = "Status is required";
    }

    // Priority validation - REQUIRED
    if (!formData.priority || formData.priority.trim() === "") {
      newErrors.priority = "Priority is required";
    }

    // Due date validation - REQUIRED
    if (!formData.due_date || formData.due_date.trim() === "") {
      newErrors.due_date = "Due date is required";
    } else {
      const date = new Date(formData.due_date);
      if (isNaN(date.getTime())) {
        newErrors.due_date = "Invalid date format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
    // Reset submitted state when user changes anything
    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark as submitted to show validation errors
    setSubmitted(true);

    // Validate the form
    const isValid = validateForm();

    // If not valid, stop submission
    if (!isValid) {
      console.log("Validation failed. Errors:", errors);

      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          setTimeout(() => {
            element.focus();
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      }
      return;
    }

    // If valid, proceed with submission
    setLoading(true);

    try {
      // Prepare data for API
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || "",
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date,
      };

      console.log("Submitting task data:", taskData);

      if (task) {
        await dispatch(
          updateTask({
            id: task.id,
            taskData,
          }),
        ).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }

      // Success - close modal and reset form
      onClose();
      setFormData({
        title: "",
        description: "",
        status: "",
        priority: "",
        due_date: "",
      });
      setErrors({});
      setSubmitted(false);
    } catch (error) {
      console.error("Error saving task:", error);
      setErrors({
        submit: error.message || "Failed to save task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  // Dark theme styles
  const isDark = theme === "dark";

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            color: isDark ? "#e0e0e0" : "#212529",
            border: isDark ? "1px solid #3d3d3d" : "1px solid #dee2e6",
          }}
        >
          <div
            className="modal-header"
            style={{
              borderBottom: isDark ? "1px solid #3d3d3d" : "1px solid #dee2e6",
            }}
          >
            <h5
              className="modal-title"
              style={{
                color: isDark ? "#e0e0e0" : "#212529",
              }}
            >
              {task ? "Edit Task" : "Create New Task"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
              style={{
                filter: isDark ? "invert(1)" : "none",
              }}
            ></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              {/* Title - REQUIRED */}
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    color: isDark ? "#e0e0e0" : "#212529",
                  }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="Enter task title"
                  style={{
                    backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                    color: isDark ? "#e0e0e0" : "#212529",
                    border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
                  }}
                />
                {submitted && errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Description - OPTIONAL */}
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    color: isDark ? "#e0e0e0" : "#212529",
                  }}
                >
                  Description
                </label>
                <textarea
                  className={`form-control ${submitted && errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  maxLength={1000}
                  placeholder="Enter task description (optional)"
                  style={{
                    backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                    color: isDark ? "#e0e0e0" : "#212529",
                    border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
                  }}
                />
                {submitted && errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              {/* Status and Priority - REQUIRED */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label
                    className="form-label"
                    style={{
                      color: isDark ? "#e0e0e0" : "#212529",
                    }}
                  >
                    Status *
                  </label>
                  <select
                    className={`form-select ${submitted && errors.status ? "is-invalid" : ""}`}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{
                      backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                      color: isDark ? "#e0e0e0" : "#212529",
                      border: isDark
                        ? "1px solid #3d3d3d"
                        : "1px solid #ced4da",
                    }}
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {submitted && errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    className="form-label"
                    style={{
                      color: isDark ? "#e0e0e0" : "#212529",
                    }}
                  >
                    Priority *
                  </label>
                  <select
                    className={`form-select ${submitted && errors.priority ? "is-invalid" : ""}`}
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    style={{
                      backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                      color: isDark ? "#e0e0e0" : "#212529",
                      border: isDark
                        ? "1px solid #3d3d3d"
                        : "1px solid #ced4da",
                    }}
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {submitted && errors.priority && (
                    <div className="invalid-feedback">{errors.priority}</div>
                  )}
                </div>
              </div>

              {/* Due Date - REQUIRED */}
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    color: isDark ? "#e0e0e0" : "#212529",
                  }}
                >
                  Due Date *
                </label>
                <input
                  type="date"
                  className={`form-control ${submitted && errors.due_date ? "is-invalid" : ""}`}
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  style={{
                    backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
                    color: isDark ? "#e0e0e0" : "#212529",
                    border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
                  }}
                />
                {submitted && errors.due_date && (
                  <div className="invalid-feedback">{errors.due_date}</div>
                )}
              </div>
            </div>
            <div
              className="modal-footer"
              style={{
                borderTop: isDark ? "1px solid #3d3d3d" : "1px solid #dee2e6",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
                style={{
                  backgroundColor: isDark ? "#3d3d3d" : "#6c757d",
                  borderColor: isDark ? "#3d3d3d" : "#6c757d",
                  color: isDark ? "#e0e0e0" : "#ffffff",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : task ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
