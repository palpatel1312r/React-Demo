// src/pages/Contact.jsx - Simple version without floating labels
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";

function Contact() {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/contacts/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error submitting contact:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="bg-success bg-gradient text-white rounded-circle d-inline-flex p-4 mb-3">
              <i className="bi bi-envelope fs-1"></i>
            </div>
            <h2 className="display-5 fw-bold">Contact Us</h2>
            <div
              className="mx-auto"
              style={{
                width: "50px",
                height: "3px",
                background: "linear-gradient(90deg, #198754, #20c997)",
              }}
            ></div>
            <p
              className="mt-2"
              style={{
                color: theme === "light" ? "#6c757d" : "#aaa",
                transition: "color 0.3s ease",
              }}
            >
              We'd love to hear from you!
            </p>
          </div>

          {submitted && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              Your message has been sent successfully!
              <button
                type="button"
                className="btn-close"
                onClick={() => setSubmitted(false)}
              ></button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Name Field - Simple label */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-person me-2"></i>Your Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme === "light" ? "#fff" : "#3d3d3d",
                    color: theme === "light" ? "#000" : "#fff",
                    border: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
                  }}
                />
              </div>

              {/* Email Field - Simple label */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-envelope me-2"></i>Your Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: theme === "light" ? "#fff" : "#3d3d3d",
                    color: theme === "light" ? "#000" : "#fff",
                    border: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
                  }}
                />
              </div>

              {/* Message Field - Simple label */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <i className="bi bi-chat-dots me-2"></i>Your Message
                </label>
                <textarea
                  className="form-control form-control-lg"
                  name="message"
                  placeholder="Enter your message"
                  style={{
                    height: "150px",
                    backgroundColor: theme === "light" ? "#fff" : "#3d3d3d",
                    color: theme === "light" ? "#000" : "#fff",
                    border: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
                    resize: "vertical",
                  }}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-success btn-lg px-5 rounded-pill shadow-sm flex-grow-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>Send Message
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-4 rounded-pill"
                onClick={() => navigate(-1)}
                style={{
                  color: theme === "light" ? "#6c757d" : "#aaa",
                  borderColor: theme === "light" ? "#6c757d" : "#555",
                }}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
