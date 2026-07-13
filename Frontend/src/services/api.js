const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const getAuthHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// Register user
export const registerUser = async (userData) => {
  try {
    console.log("📤 API - Sending registration data:", userData);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
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
    const response = await fetch(`${API_URL}/auth/login`, {
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
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeader(),
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

// Create a new task
export const createTask = async (taskData) => {
  try {
    console.log("📝 Creating task with data:", taskData);
    console.log("🔑 Token:", getToken());

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(taskData),
    });

    console.log("📡 Response status:", response.status);

    const data = await response.json();
    console.log("📥 Response data:", data);

    if (response.ok) {
      return {
        success: true,
        task: data.task,
        message: data.message || "Task created successfully",
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to create task",
      };
    }
  } catch (error) {
    console.error("Create task error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// Get all tasks
export const getTasks = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString
      ? `${API_URL}/tasks?${queryString}`
      : `${API_URL}/tasks`;

    console.log("📡 Fetching tasks from:", url);
    console.log("🔑 Token:", getToken());
    console.log("📡 Headers:", getAuthHeader());

    const response = await fetch(url, {
      headers: getAuthHeader(),
    });

    console.log("📡 Response status:", response.status);

    const data = await response.json();
    console.log("📡 Response data:", data);

    if (response.ok) {
      return {
        success: true,
        tasks: data.tasks || [],
        count: data.count || 0,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to fetch tasks",
        tasks: [],
      };
    }
  } catch (error) {
    console.error("Get tasks error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
      tasks: [],
    };
  }
};

// Get a single task by ID
export const getTaskById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        task: data.task,
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to fetch task",
      };
    }
  } catch (error) {
    console.error("Get task error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// Update a task
export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        task: data.task,
        message: data.message || "Task updated successfully",
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to update task",
      };
    }
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Task deleted successfully",
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to delete task",
      };
    }
  } catch (error) {
    console.error("Delete task error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};
