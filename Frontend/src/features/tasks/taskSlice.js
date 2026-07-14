// src/features/tasks/taskSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const axiosConfig = (getState) => {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ ALL THESE MUST HAVE 'export' KEYWORD
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/tasks`,
        axiosConfig(getState),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        taskData,
        axiosConfig(getState),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task",
      );
    }
  },
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status, targetIndex }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${id}/status`,
        { status, targetIndex },
        axiosConfig(getState),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task status",
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${id}`,
        taskData, // ✅ This now includes tags
        axiosConfig(getState),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task",
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, axiosConfig(getState));
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

// New thunks for tags
export const updateTaskTags = createAsyncThunk(
  "tasks/updateTaskTags",
  async ({ id, tags }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${id}/tags`,
        { tags },
        axiosConfig(getState),
      );
      return { taskId: id, tags: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task tags",
      );
    }
  },
);

export const fetchTags = createAsyncThunk(
  "tasks/fetchTags",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/tasks/tags`,
        axiosConfig(getState),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags",
      );
    }
  },
);

const initialState = {
  tasks: [],
  users: [],
  allTags: [], // Add this
  loading: false,
  error: null,
  filters: {
    status: "",
    priority: "",
    assignment: "",
    tag: "", // Add tag filter
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: "", priority: "", assignment: "", tag: "" };
    },
    reorderTasks: (state, action) => {
      const { status, tasks } = action.payload;
      const otherTasks = state.tasks.filter((t) => t.status !== status);
      state.tasks = [...otherTasks, ...tasks];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
        state.users = action.payload.users || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      // Add new cases for tags
      .addCase(updateTaskTags.fulfilled, (state, action) => {
        const { taskId, tags } = action.payload;
        const task = state.tasks.find((t) => t.id === taskId);
        if (task) {
          task.tags = tags;
        }
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.allTags = action.payload;
      });
  },
});

// ✅ EXPORT ACTIONS
export const { setFilters, clearFilters, reorderTasks } = taskSlice.actions;

// ✅ SELECTORS
const selectAllTasks = (state) => state.tasks.tasks;
const selectFilters = (state) => state.tasks.filters;
const selectCurrentUser = (state) => state.auth.user;

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

// src/features/tasks/taskSlice.js
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters, selectCurrentUser],
  (tasks, filters, currentUser) => {
    let filtered = tasks;

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Filter by assignment
    if (filters.assignment === "created") {
      filtered = filtered.filter((task) => task.user_id === currentUser?.id);
    } else if (filters.assignment === "assigned") {
      filtered = filtered.filter(
        (task) => Number(task.assigned_to) === Number(currentUser?.id),
      );
    }

    // ✅ Filter by tag - fixed to handle both string and object tags
    if (filters.tag) {
      filtered = filtered.filter((task) => {
        if (!task.tags || task.tags.length === 0) return false;
        // Check if any tag matches (handles both strings and objects)
        return task.tags.some((tag) => {
          const tagName = typeof tag === "string" ? tag : tag.name;
          return tagName === filters.tag;
        });
      });
    }

    return filtered;
  },
);

export const selectTasksByStatus = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    const sortByPriority = (taskList) => {
      return [...taskList].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    };

    return {
      pending: sortByPriority(
        tasks.filter((task) => task.status === "pending"),
      ),
      "in-progress": sortByPriority(
        tasks.filter((task) => task.status === "in-progress"),
      ),
      completed: sortByPriority(
        tasks.filter((task) => task.status === "completed"),
      ),
    };
  },
);

export const selectAllUsersSelector = (state) => state.tasks.users;
export const selectTaskLoading = (state) => state.tasks.loading;
export const selectTaskError = (state) => state.tasks.error;
export const selectAllTasksSelector = selectAllTasks;
export const selectAllTags = (state) => state.tasks.allTags;

export default taskSlice.reducer;
