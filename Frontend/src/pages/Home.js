import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <div
        className="card shadow-lg border-0 bg-gradient-primary text-white"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              onClick={() => navigate("/Contact")}
            >
              <i className="bi bi-speedometer2 me-2"></i>Contact Us
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="text-primary fs-1 mb-3">📱</div>
              <h5 className="card-title">Responsive Design</h5>
              <p className="card-text text-muted">
                Works perfectly on all screen sizes
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="text-success fs-1 mb-3">🔐</div>
              <h5 className="card-title">Protected Routes</h5>
              <p className="card-text text-muted">
                Secure your pages with authentication
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="text-warning fs-1 mb-3">⚡</div>
              <h5 className="card-title">Fast Navigation</h5>
              <p className="card-text text-muted">
                Seamless page transitions with React Router
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
