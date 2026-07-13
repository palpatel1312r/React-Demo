// Frontend/src/features/tasks/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTask as createTaskAPI,
  getTasks as getTasksAPI,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from "../../services/api";

// Async thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await getTasksAPI(params);
      return result.success ? result : rejectWithValue(result.message);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch tasks");
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const result = await createTaskAPI(taskData);
      return result.success ? result : rejectWithValue(result.message);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create task");
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const result = await updateTaskAPI(id, taskData);
      return result.success ? result : rejectWithValue(result.message);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update task");
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteTaskAPI(id);
      return result.success ? { id } : rejectWithValue(result.message);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete task");
    }
  },
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: { status: "", priority: "" },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: "", priority: "" };
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = [action.payload.task, ...state.tasks];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create task";
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (t) => t.id === action.payload.task.id,
        );
        if (index !== -1) state.tasks[index] = action.payload.task;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update task";
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload.id,
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete task";
      });
  },
});

export const { setFilters, clearFilters, clearTasks } = taskSlice.actions;

// Selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectTaskLoading = (state) => state.tasks.loading;
export const selectTaskError = (state) => state.tasks.error;
export const selectTaskFilters = (state) => state.tasks.filters;

export const selectFilteredTasks = (state) => {
  const { tasks, filters } = state.tasks;
  let filtered = tasks;
  if (filters.status) {
    filtered = filtered.filter((task) => task.status === filters.status);
  }
  if (filters.priority) {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }
  return filtered;
};

export default taskSlice.reducer;
