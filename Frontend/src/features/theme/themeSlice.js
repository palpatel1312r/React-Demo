// src/features/theme/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme || "light";
};

const initialState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

// Export actions
export const { toggleTheme, setTheme } = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;

// Selector for getting theme state
export const selectTheme = (state) => state.theme.mode;
