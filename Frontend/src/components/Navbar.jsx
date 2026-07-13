
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectTheme, toggleTheme } from "../features/theme/themeSlice";
import {
  logoutUser,
  logout,
  selectUser,
  selectIsLoggedIn,
} from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleLogout = async () => {
    console.log("🔴 Logout button clicked");

    try {
      await dispatch(logoutUser()).unwrap();
      console.log("✅ Logout dispatched successfully");
    } catch (error) {
      console.log("⚠️ Logout error, but continuing...");
      dispatch(logout());
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          ReactJS
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto navbar-list">
            {/* Navigation Links */}
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">
                <i className="fas fa-home me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/about">
                <i className="fas fa-info-circle me-1"></i> About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/contact">
                <i className="fas fa-envelope me-1"></i> Contact
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/tasks">
                <i className="fas fa-tasks me-1"></i> Tasks
              </Link>
            </li>
            {/* Conditional: Show ONLY Logout OR Login/Register */}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span
                    className="nav-link nav-link-custom"
                    style={{ opacity: 0.7 }}
                  >
                    <i className="fas fa-user me-1"></i>
                    {user?.name || "User"}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link nav-link-custom btn btn-link logout-btn"
                    onClick={handleLogout}
                    style={{
                      textDecoration: "none",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: theme === "light" ? "#dc3545" : "#ff6b6b",
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to="/register">
                    <i className="fas fa-user-plus me-1"></i> Register
                  </Link>
                </li>
              </>
            )}
            {/* ✅ THEME TOGGLE BUTTON - Added here */}
            <li className="nav-item">
              <button
                className="btn btn-sm ms-2 theme-toggle-btn"
                onClick={() => dispatch(toggleTheme())}
                style={{
                  borderRadius: "20px",
                  backgroundColor: theme === "light" ? "#1a1a1a" : "#f0f2f5",
                  color: theme === "light" ? "#ffffff" : "#1a1a1a",
                  border: "none",
                  padding: "5px 15px",
                  transition: "all 0.3s ease",
                }}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
