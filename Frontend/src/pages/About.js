// src/pages/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";

function About() {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);

  return (
    <div className="mt-4">
      <div
        className="card shadow-lg border-0"
        style={{
          backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
          color: theme === "light" ? "#000" : "#fff",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="bg-primary bg-gradient text-white rounded-circle d-inline-flex p-4 mb-3">
              <i className="bi bi-info-circle fs-1"></i>
            </div>
            <h2 className="display-5 fw-bold">About Us</h2>
            <div
              className="mx-auto"
              style={{
                width: "50px",
                height: "3px",
                background: "linear-gradient(90deg, #0d6efd, #0dcaf0)",
              }}
            ></div>
          </div>

          <p className="lead text-center">This is the About page.</p>
          <p
            className="text-center"
            style={{
              color: theme === "light" ? "#6c757d" : "#aaa",
              transition: "color 0.3s ease",
            }}
          >
            Learn about our awesome React application.
          </p>

          <div className="row mt-4 g-4">
            <div className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  backgroundColor: theme === "light" ? "#f8f9fa" : "#3d3d3d",
                  color: theme === "light" ? "#000" : "#fff",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                <div className="card-body text-center">
                  <div className="text-primary fs-1">🚀</div>
                  <h5 className="card-title mt-2">Fast & Modern</h5>
                  <p
                    className="card-text"
                    style={{
                      color: theme === "light" ? "#6c757d" : "#aaa",
                    }}
                  >
                    Built with latest React features
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  backgroundColor: theme === "light" ? "#f8f9fa" : "#3d3d3d",
                  color: theme === "light" ? "#000" : "#fff",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                <div className="card-body text-center">
                  <div className="text-success fs-1">🔒</div>
                  <h5 className="card-title mt-2">Secure</h5>
                  <p
                    className="card-text"
                    style={{
                      color: theme === "light" ? "#6c757d" : "#aaa",
                    }}
                  >
                    Protected routes & authentication
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  backgroundColor: theme === "light" ? "#f8f9fa" : "#3d3d3d",
                  color: theme === "light" ? "#000" : "#fff",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                <div className="card-body text-center">
                  <div className="text-warning fs-1">🎨</div>
                  <h5 className="card-title mt-2">Responsive</h5>
                  <p
                    className="card-text"
                    style={{
                      color: theme === "light" ? "#6c757d" : "#aaa",
                    }}
                  >
                    Works on all devices
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-house-door me-2"></i>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
