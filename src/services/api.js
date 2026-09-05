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

// ─── Listings API Methods ─────────────────────

export async function createListing(listingData) {
  return request("/listings", {
    method: "POST",
    body: JSON.stringify(listingData),
  });
}

export async function getAllListings() {
  return request("/listings", { method: "GET" });
}

export async function getListingById(id) {
  return request(`/listings/${id}`, { method: "GET" });
}

export async function getListing(id) {
  return request(`/listings/${id}`, {
    method: "GET",
  });
}

export async function updateListing(id, listingData) {
  return request(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(listingData),
  });
}

export async function deleteListing(id) {
  return request(`/listings/${id}`, {
    method: "DELETE",
  });
}

/**
 * Upload listing photos to Google Drive via the backend.
 * @param {File[]} files - Array of File objects from an <input type="file">
 * @returns {Promise<{message: string, urls: string[]}>}
 */
export async function uploadListingPhotos(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("photos", file);
  });

  const url = `${API_URL}/listings/upload`;

  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  // Do NOT set Content-Type — browser will set it with the correct multipart boundary

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Photo upload failed");
  }

  return data;
}

// ─── Profile API Methods ─────────────────────

export async function updateProfile(profileData) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

// ─── Bookings API Methods ─────────────────────

export async function createBooking(bookingData) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
}

export async function getMyBookings() {
  return request("/bookings/my-bookings", { method: "GET" });
}

export async function getOwnerBookings() {
  return request("/bookings/owner-bookings", { method: "GET" });
}

export async function updateBookingStatus(id, status) {
  return request(`/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ─────────────────────────────────────────────────────────────────
// Messages API Methods
// ─────────────────────────────────────────────────────────────────

export async function getConversations() {
  return request("/messages/conversations", { method: "GET" });
}

export async function getMessages(conversationId) {
  return request(`/messages/${conversationId}`, { method: "GET" });
}

export async function sendMessage(data) {
  return request("/messages", {
    method: "POST",
    body: JSON.stringify(data), // { listing_id, receiver_id, text, conversation_id }
  });
}

export async function markMessagesAsRead(conversationId) {
  return request(`/messages/${conversationId}/read`, { method: "PUT" });
}
