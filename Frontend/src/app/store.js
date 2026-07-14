// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    theme: themeReducer,
  },
  // configureStore automatically includes thunk middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== "production",
});
