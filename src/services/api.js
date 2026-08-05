const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic fetch wrapper with error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Attach token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ─── Auth API Methods ────────────────────────

export async function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getMe() {
  return request("/auth/me", {
    method: "GET",
  });
}

// ─── Profile API Methods ─────────────────────

export async function updateProfile(profileData) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}
