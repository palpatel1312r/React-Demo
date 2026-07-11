// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";

function Home() {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  return (
    <div className="mt-4">
      {/* ✅ Hero Section - Changes based on theme */}
      <div
        className="card shadow-lg border-0 text-white"
        style={{
          background:
            theme === "light"
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          transition: "background 0.3s ease",
        }}
      >
        <div className="card-body p-5 text-center">
          <h1 className="display-3 fw-bold mb-3">Welcome! 👋</h1>
          <p className="lead mb-4">
            This is a simple routing example with protected routes.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-light btn-lg px-4 rounded-pill shadow-sm"
              onClick={() => navigate("/about")}
            >
              <i className="bi bi-info-circle me-2"></i>Learn More
            </button>
            <button
              className="btn btn-outline-light btn-lg px-4 rounded-pill"
              onClick={() => navigate("/contact")}
            >
              <i className="bi bi-speedometer2 me-2"></i>Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Feature Cards - Theme aware */}
      <div className="row mt-4 g-4">
        <div className="col-md-4">
          <div
            className="card h-100 shadow-sm border-0"
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
              color: theme === "light" ? "#000" : "#fff",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div className="card-body text-center p-4">
              <div className="text-primary fs-1 mb-3">📱</div>
              <h5 className="card-title">Responsive Design</h5>
              <p
                className="card-text"
                style={{
                  color: theme === "light" ? "#6c757d" : "#aaa",
                }}
              >
                Works perfectly on all screen sizes
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card h-100 shadow-sm border-0"
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
              color: theme === "light" ? "#000" : "#fff",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div className="card-body text-center p-4">
              <div className="text-success fs-1 mb-3">🔐</div>
              <h5 className="card-title">Protected Routes</h5>
              <p
                className="card-text"
                style={{
                  color: theme === "light" ? "#6c757d" : "#aaa",
                }}
              >
                Secure your pages with authentication
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card h-100 shadow-sm border-0"
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
              color: theme === "light" ? "#000" : "#fff",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div className="card-body text-center p-4">
              <div className="text-warning fs-1 mb-3">⚡</div>
              <h5 className="card-title">Fast Navigation</h5>
              <p
                className="card-text"
                style={{
                  color: theme === "light" ? "#6c757d" : "#aaa",
                }}
              >
                Seamless page transitions with React Router
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Theme Indicator (Optional) */}
      <div className="mt-4 text-center">
        <span
          className="badge"
          style={{
            backgroundColor: theme === "light" ? "#e9ecef" : "#3d3d3d",
            color: theme === "light" ? "#495057" : "#ced4da",
            padding: "8px 16px",
            fontSize: "0.9rem",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          🌓 Current Theme:{" "}
          <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>
        </span>
      </div>
    </div>
  );
}

export default Home;
