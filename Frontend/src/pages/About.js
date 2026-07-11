import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <div className="card shadow-lg border-0">
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
          <p className="text-center text-muted">
            Learn about our awesome React application.
          </p>

          <div className="row mt-4 g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="text-primary fs-1">🚀</div>
                  <h5 className="card-title mt-2">Fast & Modern</h5>
                  <p className="card-text text-muted">
                    Built with latest React features
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="text-success fs-1">🔒</div>
                  <h5 className="card-title mt-2">Secure</h5>
                  <p className="card-text text-muted">
                    Protected routes & authentication
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="text-warning fs-1">🎨</div>
                  <h5 className="card-title mt-2">Responsive</h5>
                  <p className="card-text text-muted">Works on all devices</p>
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
