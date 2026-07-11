// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsLoggedIn,
} from "../features/auth/authSlice";
import { selectTheme } from "../features/theme/themeSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Redirect to Home (/) if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 Login attempt with:", formData.email);
    dispatch(loginUser(formData));
  };

  return (
    <div className="mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div
            className="card shadow-lg border-0"
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#2d2d2d",
              color: theme === "light" ? "#000" : "#fff",
            }}
          >
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Please login to your account</p>
                <div
                  className="mx-auto"
                  style={{
                    width: "50px",
                    height: "3px",
                    background: "linear-gradient(90deg, #0d6efd, #0dcaf0)",
                  }}
                ></div>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => dispatch(clearError())}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-envelope me-2"></i>Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    style={{
                      backgroundColor: theme === "light" ? "#fff" : "#3d3d3d",
                      color: theme === "light" ? "#000" : "#fff",
                      border: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    style={{
                      backgroundColor: theme === "light" ? "#fff" : "#3d3d3d",
                      color: theme === "light" ? "#000" : "#fff",
                      border: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Login
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-muted">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary fw-semibold">
                    Register here
                  </Link>
                </p>
              </div>

              {/* Test Credentials */}
              <div
                className="mt-3 p-3 rounded"
                style={{
                  backgroundColor: theme === "light" ? "#f8f9fa" : "#3d3d3d",
                  fontSize: "0.9rem",
                }}
              >
                <p className="mb-1">
                  <strong>Test Credentials:</strong>
                </p>
                <p className="mb-0">Email: admin@gmail.com</p>
                <p className="mb-0">Password: 1234</p>
                <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  (Make sure user exists in database)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
