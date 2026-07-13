
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ IMPORTANT: Make sure this has /api at the end
const API_URL = "http://localhost:5000/api"; // Hardcode it for testing

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
      const { token, user } = response.data;
      setAuthToken(token);
      return { user, token };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data.user;
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
      return response.data.user;
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
  role: null,
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
      state.role = null;
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
        state.role = action.payload.user.role || "user";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
      })
      // Update Avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.role = null;
        state.isLoading = false;
        state.error = null;
        console.log("✅ Logout successful - State cleared");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.role = null;
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
export const selectUserRole = (state) => state.auth.role;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
