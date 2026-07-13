// Frontend/src/components/TaskForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../features/tasks/taskSlice";

const TaskForm = ({ show, onClose, task }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
        status: task.status || "pending",
        priority: task.priority || "medium",
        due_date: dueDate,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
      });
    }
    setErrors({});
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    // Validate due date
    if (formData.due_date) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      };

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
      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
      });
      setErrors({});
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

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {task ? "Edit Task" : "Create New Task"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
                {/* <small className="text-muted">
                  {formData.title.length}/255 characters
                </small> */}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  maxLength={1000}
                  placeholder="Enter task description (optional)"
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
                {/* <small className="text-muted">
                  {formData.description.length}/1000 characters
                </small> */}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.due_date ? "is-invalid" : ""}`}
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
                {errors.due_date && (
                  <div className="invalid-feedback">{errors.due_date}</div>
                )}
                <small className="text-muted">
                  Optional - select a due date
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
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
