// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Set auth header
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// Register user
export const registerUser = async (userData) => {
  try {
    console.log("📤 API - Sending registration data:", userData);

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData), // ✅ This now includes confirmPassword
    });

    const data = await response.json();
    console.log("📥 API - Registration response:", data);

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || "Registration successful",
      };
    } else {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }
  } catch (error) {
    console.error("❌ API - Register error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        message: data.message || "Login successful",
      };
    } else {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: authHeader(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to get user",
      };
    }
  } catch (error) {
    console.error("Get user error:", error);
    return {
      success: false,
      message: "Network error",
    };
  }
};
