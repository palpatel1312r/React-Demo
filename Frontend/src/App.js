// src/App.js
import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectTheme } from "./features/theme/themeSlice";
import { restoreSession, selectIsLoggedIn } from "./features/auth/authSlice";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Restore session on mount
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Debug: Log the login state
  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);
    console.log("Token:", localStorage.getItem("token"));
  }, [isLoggedIn]);

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Navbar />
        <main className="container" style={{ padding: "2rem 0", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Login Route - Redirect only if logged in */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
            />

            {/* Register Route - Redirect only if logged in */}
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}
            />
          </Routes>
        </main>
   
      </div>
    </Router>
  );
}

export default App;
