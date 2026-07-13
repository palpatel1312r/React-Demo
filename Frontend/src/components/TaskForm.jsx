
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "../features/tasks/taskSlice";
import { selectTheme } from "../features/theme/themeSlice";

const TaskForm = ({ show, onClose, task }) => {
  const dispatch = useDispatch();
  const isDark = useSelector(selectTheme) === "dark";
  const [data, setData] = useState({
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
      setData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().split("T")[0]
          : "",
      });
    } else {
      setData({
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

  const validate = () => {
    const e = {};
    if (!data.title?.trim()) e.title = "Title is required";
    if (!data.status?.trim()) e.status = "Status is required";
    if (!data.priority?.trim()) e.priority = "Priority is required";
    if (!data.due_date?.trim()) e.due_date = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: data.title.trim(),
        description: data.description.trim() || "",
        status: data.status,
        priority: data.priority,
        due_date: data.due_date,
      };
      await dispatch(
        task
          ? updateTask({ id: task.id, taskData: payload })
          : createTask(payload),
      ).unwrap();
      onClose();
      setData({
        title: "",
        description: "",
        status: "",
        priority: "",
        due_date: "",
      });
      setErrors({});
      setSubmitted(false);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save" });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const styles = {
    bg: isDark ? "#1e1e1e" : "#ffffff",
    text: isDark ? "#e0e0e0" : "#212529",
    inputBg: isDark ? "#2d2d2d" : "#ffffff",
    border: isDark ? "1px solid #3d3d3d" : "1px solid #ced4da",
    divider: isDark ? "1px solid #3d3d3d" : "1px solid #dee2e6",
  };

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
            backgroundColor: styles.bg,
            color: styles.text,
            border: styles.border,
          }}
        >
          <div
            className="modal-header"
            style={{ borderBottom: styles.divider }}
          >
            <h5 className="modal-title">
              {task ? "Edit Task" : "Create New Task"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
              style={{ filter: isDark ? "invert(1)" : "none" }}
            />
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}

              {/* Title - REQUIRED */}
              <div className="mb-3">
                <label className="form-label" style={{ color: styles.text }}>
                  Title *
                </label>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="Enter task title"
                  style={{
                    backgroundColor: styles.inputBg,
                    color: styles.text,
                    border: styles.border,
                  }}
                />
                {submitted && errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Description - OPTIONAL */}
              <div className="mb-3">
                <label className="form-label" style={{ color: styles.text }}>
                  Description
                </label>
                <textarea
                  className={`form-control ${submitted && errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  rows="3"
                  maxLength={1000}
                  placeholder="Enter task description (optional)"
                  style={{
                    backgroundColor: styles.inputBg,
                    color: styles.text,
                    border: styles.border,
                  }}
                />
                {submitted && errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              {/* Status and Priority - REQUIRED */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: styles.text }}>
                    Status *
                  </label>
                  <select
                    className={`form-select ${submitted && errors.status ? "is-invalid" : ""}`}
                    name="status"
                    value={data.status}
                    onChange={handleChange}
                    style={{
                      backgroundColor: styles.inputBg,
                      color: styles.text,
                      border: styles.border,
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
                  <label className="form-label" style={{ color: styles.text }}>
                    Priority *
                  </label>
                  <select
                    className={`form-select ${submitted && errors.priority ? "is-invalid" : ""}`}
                    name="priority"
                    value={data.priority}
                    onChange={handleChange}
                    style={{
                      backgroundColor: styles.inputBg,
                      color: styles.text,
                      border: styles.border,
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
                <label className="form-label" style={{ color: styles.text }}>
                  Due Date *
                </label>
                <input
                  type="date"
                  className={`form-control ${submitted && errors.due_date ? "is-invalid" : ""}`}
                  name="due_date"
                  value={data.due_date}
                  onChange={handleChange}
                  style={{
                    backgroundColor: styles.inputBg,
                    color: styles.text,
                    border: styles.border,
                  }}
                />
                {submitted && errors.due_date && (
                  <div className="invalid-feedback">{errors.due_date}</div>
                )}
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: styles.divider }}>
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
                    <span className="spinner-border spinner-border-sm me-2" />
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
