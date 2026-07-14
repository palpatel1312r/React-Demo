import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ IMPORTANT: Make sure this has /api at the end
const API_URL = "http://localhost:5000/api";

// Configure axios with token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("📤 Sending login request to:", `${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log("✅ Login response:", response.data);

      // The backend returns: { id, name, email, token }
      const { token, id, name, email } = response.data;
      const user = { id, name, email };

      setAuthToken(token);
      return { user, token };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log(
        "📤 Sending register request to:",
        `${API_URL}/auth/register`,
      );
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log("✅ Register response:", response.data);

      // The backend returns: { id, name, email, token }
      const { token, id, name, email } = response.data;
      const user = { id, name, email };

      setAuthToken(token);
      return { user, token };
    } catch (error) {
      console.error(
        "❌ Register error:",
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      // The backend returns: { id, name, email }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (avatarUrl, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/auth/avatar`, {
        avatar: avatarUrl,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update avatar",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      setAuthToken(null);
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      setAuthToken(null);
      localStorage.removeItem("user");
      return rejectWithValue(error.message || "Logout failed");
    }
  },
);

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  // Remove role from here since we don't have it
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.token = token;
        state.isLoggedIn = true;
        setAuthToken(token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.error = null;
      setAuthToken(null);
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Remove role assignment
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // Remove role assignment
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = null;
        console.log("✅ Logout successful - State cleared");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = null;
        setAuthToken(null);
        localStorage.removeItem("user");
        console.log("✅ Logout completed (with error handling)");
      });
  },
});

export const { clearError, restoreSession, logout } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserRole = (state) => state.auth.user?.role || null; // Safe access
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
