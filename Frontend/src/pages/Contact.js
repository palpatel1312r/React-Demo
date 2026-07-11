import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();
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
      <div className="card shadow-lg border-0">
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
            <p className="text-muted mt-2">We'd love to hear from you!</p>
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
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name">
                    <i className="bi bi-person me-2"></i>Your Name
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">
                    <i className="bi bi-envelope me-2"></i>Your Email
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    style={{ height: "150px" }}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label htmlFor="message">
                    <i className="bi bi-chat-dots me-2"></i>Your Message
                  </label>
                </div>
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
