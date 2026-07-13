// src/pages/Register.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";
import { selectIsLoggedIn } from "../features/auth/authSlice";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to Home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("📝 Form Data:", formData);

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      console.log("❌ Passwords don't match!");
      setError("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("❌ Password must be at least 4 characters long");
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      console.log("📤 Sending registration request:", requestData);

      const response = await registerUser(requestData);
      console.log("📥 Registration response:", response);

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/");
        window.location.reload();
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError("❌ Network error. Please try again.");
    }

    setLoading(false);
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
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p
                  className="text-muted"
                  style={{
                    color: theme === "light" ? "#6c757d" : "#aaa",
                  }}
                >
                  Register to get started
                </p>
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
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person me-2"></i>Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
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
                    placeholder="Enter password (min 4 characters)"
                    required
                    minLength="4"
                    style={{
                      backgroundColor: theme === "light" ? "#fff" : "#3d3d3d",
                      color: theme === "light" ? "#000" : "#fff",
                      border: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
                    }}
                  />
                  <small
                    className="text-muted"
                    style={{
                      color: theme === "light" ? "#6c757d" : "#888",
                    }}
                  >
                    Min 4 characters
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>Register
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p
                  className="text-muted"
                  style={{
                    color: theme === "light" ? "#6c757d" : "#aaa",
                  }}
                >
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-semibold">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
