// Frontend/src/components/ConfirmDialog.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";

const ConfirmDialog = ({
  show,
  onConfirm,
  onCancel,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this task?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  const theme = useSelector(selectTheme);

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
            color: theme === "light" ? "#000" : "#fff",
            border: `1px solid ${theme === "light" ? "#e0e0e0" : "#444"}`,
            borderRadius: "16px",
            boxShadow:
              theme === "light"
                ? "0 20px 60px rgba(0,0,0,0.15)"
                : "0 20px 60px rgba(0,0,0,0.5)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            className="modal-header border-0"
            style={{
              padding: "24px 24px 0 24px",
            }}
          >
            <div
              className="icon-container"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: theme === "light" ? "#fee2e2" : "#7f1d1d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{
                  fontSize: "24px",
                  color: theme === "light" ? "#dc2626" : "#fca5a5",
                }}
              ></i>
            </div>
            <h5
              className="modal-title text-center w-100"
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: theme === "light" ? "#1a1a1a" : "#f0f0f0",
              }}
            >
              {title}
            </h5>
          </div>

          <div
            className="modal-body text-center"
            style={{
              padding: "8px 24px 24px 24px",
            }}
          >
            <p
              className="mb-0"
              style={{
                fontSize: "16px",
                color: theme === "light" ? "#6b7280" : "#b0b0b0",
                lineHeight: "1.6",
              }}
            >
              {message}
            </p>
          </div>

          <div
            className="modal-footer border-0"
            style={{
              padding: "0 24px 24px 24px",
              gap: "12px",
            }}
          >
            <button
              type="button"
              className="btn"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 20px",
                borderRadius: "10px",
                backgroundColor: theme === "light" ? "#f3f4f6" : "#3d3d3d",
                color: theme === "light" ? "#4b5563" : "#d1d5db",
                border: `1px solid ${theme === "light" ? "#e5e7eb" : "#4b5563"}`,
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor =
                  theme === "light" ? "#e5e7eb" : "#4b5563";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor =
                  theme === "light" ? "#f3f4f6" : "#3d3d3d";
              }}
            >
              <i className="fas fa-times me-2"></i>
              {cancelText}
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "500",
                backgroundColor: "#dc2626",
                color: "#fff",
                border: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#b91c1c";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#dc2626";
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt me-2"></i>
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
