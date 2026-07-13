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
  const isDark = useSelector(selectTheme) === "dark";

  if (!show) return null;

  const s = {
    bg: isDark ? "#2d2d2d" : "#fff",
    text: isDark ? "#fff" : "#000",
    border: isDark ? "#444" : "#e0e0e0",
    iconBg: isDark ? "#7f1d1d" : "#fee2e2",
    iconColor: isDark ? "#fca5a5" : "#dc2626",
    cancelBg: isDark ? "#3d3d3d" : "#f3f4f6",
    cancelColor: isDark ? "#d1d5db" : "#4b5563",
    cancelBorder: isDark ? "#4b5563" : "#e5e7eb",
    cancelHover: isDark ? "#4b5563" : "#e5e7eb",
  };

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
            backgroundColor: s.bg,
            color: s.text,
            border: `1px solid ${s.border}`,
            borderRadius: "16px",
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.5)"
              : "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="modal-header border-0"
            style={{ padding: "24px 24px 0 24px" }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: s.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "24px", color: s.iconColor }}
              />
            </div>
            <h5
              className="modal-title text-center w-100"
              style={{ fontSize: "20px", fontWeight: "600" }}
            >
              {title}
            </h5>
          </div>

          <div
            className="modal-body text-center"
            style={{ padding: "8px 24px 24px 24px" }}
          >
            <p
              className="mb-0"
              style={{
                fontSize: "16px",
                color: isDark ? "#b0b0b0" : "#6b7280",
              }}
            >
              {message}
            </p>
          </div>

          <div
            className="modal-footer border-0"
            style={{ padding: "0 24px 24px 24px", gap: "12px" }}
          >
            <button
              className="btn"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 20px",
                borderRadius: "10px",
                backgroundColor: s.cancelBg,
                color: s.cancelColor,
                border: `1px solid ${s.cancelBorder}`,
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = s.cancelHover;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = s.cancelBg;
              }}
            >
              <i className="fas fa-times me-2" /> {cancelText}
            </button>

            <button
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
                  <span className="spinner-border spinner-border-sm me-2" />{" "}
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt me-2" /> {confirmText}
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
