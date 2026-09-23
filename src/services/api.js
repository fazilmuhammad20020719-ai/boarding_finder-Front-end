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
    throw new Error(data.error || data.message || "Something went wrong");
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

export async function getStats() {
  return request("/listings/public/stats", { method: "GET" });
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

export async function addReview(listingId, reviewData) {
  return request(`/listings/${listingId}/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData),
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

// ─── Neighborhood API Methods ──────────────────

export async function getNeighborhoodDetails(id) {
  return request(`/listings/${id}/neighborhood`);
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

export async function checkBookingForListing(listingId) {
  return request(`/bookings/check/${listingId}`, { method: "GET" });
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

// ─────────────────────────────────────────────────────────────────
// Verification API Methods
// ─────────────────────────────────────────────────────────────────

export async function verifyOtp(otp) {
  return request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export async function resendOtp() {
  return request("/auth/resend-otp", {
    method: "POST",
  });
}

export async function uploadVerificationDocs(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("documents", file);
  });

  const url = `${API_URL}/auth/upload-verification-docs`;
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Document upload failed");
  }
  return data;
}

// ─────────────────────────────────────────────────────────────────
// Admin API Methods
// ─────────────────────────────────────────────────────────────────

export async function getPendingUsers() {
  return request("/admin/pending-users", { method: "GET" });
}

export async function verifyUserAdmin(userId, action, note = "") {
  return request(`/admin/users/${userId}/verify`, {
    method: "PUT",
    body: JSON.stringify({ action, note }),
  });
}

export async function getVerificationStats() {
  return request("/admin/verification-stats", { method: "GET" });
}

export async function getAllUsers() {
  return request("/admin/users", { method: "GET" });
}

export async function updateUserStatusAdmin(userId, status) {
  return request(`/admin/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function updateUserRoleAdmin(userId, role) {
  return request(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export async function getAllAdminListings() {
  return request("/admin/listings", { method: "GET" });
}

export async function getPlatformAnalytics() {
  return request("/admin/analytics", { method: "GET" });
}

export async function updateListingStatusAdmin(listingId, status) {
  return request(`/admin/listings/${listingId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ─────────────────────────────────────────────────────────────────
// Owner Management API Methods
// ─────────────────────────────────────────────────────────────────

export async function getLinkedStudents() {
  return request("/owner/students", { method: "GET" });
}

export async function updateStudentStatus(studentId, action) {
  return request(`/owner/students/${studentId}/status`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  });
}

// ─────────────────────────────────────────────────────────────────
// Dashboard/Overview API Methods
// ─────────────────────────────────────────────────────────────────

export async function getOwnerOverviewStats() {
  return request("/owner/overview-stats", { method: "GET" });
}

// ─────────────────────────────────────────────────────────────────
// Saved Listings API Methods
// ─────────────────────────────────────────────────────────────────

export async function getSavedListings() {
  return request("/saved-listings", { method: "GET" });
}

export async function addSavedListing(listing_id) {
  return request("/saved-listings", {
    method: "POST",
    body: JSON.stringify({ listing_id }),
  });
}

export async function removeSavedListing(listingId) {
  return request(`/saved-listings/${listingId}`, {
    method: "DELETE",
  });
}

export async function checkSavedStatus(listingId) {
  return request(`/saved-listings/check/${listingId}`, { method: "GET" });
}

// ─────────────────────────────────────────────────────────────────
// Roommate Matcher API Methods
// ─────────────────────────────────────────────────────────────────

export async function getRoommateMatches() {
  return request("/roommates/matches", { method: "GET" });
}

export async function getMyRoommateProfile() {
  return request("/roommates/me", { method: "GET" });
}

export async function updateRoommateProfile(profileData) {
  return request("/roommates/me", {
    method: "POST",
    body: JSON.stringify(profileData),
  });
}

export async function passRoommateProfile(passedId) {
  return request("/roommates/pass", {
    method: "POST",
    body: JSON.stringify({ passedId }),
  });
}

export async function sendRoommateConnectionRequest(receiverId) {
  return request("/roommates/connect", {
    method: "POST",
    body: JSON.stringify({ receiverId }),
  });
}

export async function getRoommateConnectionRequests() {
  return request("/roommates/connections/pending", { method: "GET" });
}

export async function respondToRoommateConnectionRequest(connectionId, action) {
  return request(`/roommates/connections/${connectionId}/respond`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  });
}

export async function getAcceptedRoommateConnections() {
  return request("/roommates/connections/accepted", { method: "GET" });
}

export async function disconnectRoommate(connectionId) {
  return request(`/roommates/connections/${connectionId}`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────────────────────────────────
// Forum API Methods
// ─────────────────────────────────────────────────────────────────

export async function getForumPosts(category, search) {
  let url = "/forum/posts?";
  if (category && category !== "All Topics") url += `category=${encodeURIComponent(category)}&`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  return request(url, { method: "GET" });
}

export async function createForumPost(postData) {
  return request("/forum/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

export async function getForumPostById(id) {
  return request(`/forum/posts/${id}`, { method: "GET" });
}

export async function addForumComment(postId, content) {
  return request(`/forum/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function toggleForumUpvote(postId) {
  return request(`/forum/posts/${postId}/upvote`, {
    method: "POST",
  });
}

// ─────────────────────────────────────────────────────────────────
// Leases API Methods
// ─── LEASES ─────────────────────────────────────────────────────────────

export const generateLease = async (bookingId) => {
  const data = await request(`/leases`, {
    method: 'POST',
    body: JSON.stringify({ booking_id: bookingId }),
  });
  if (data.error || data.message) {
    if (data.error) throw new Error(data.error);
  }
  return data;
};

export const getLeaseByBookingId = async (bookingId) => {
  const data = await request(`/leases/booking/${bookingId}`);
  if (data.error) throw new Error(data.error);
  return data;
};

export const signLease = async (leaseId, signature) => {
  const data = await request(`/leases/${leaseId}/sign`, {
    method: 'PUT',
    body: JSON.stringify({ signature }),
  });
  if (data.error) throw new Error(data.error);
  return data;
};

// ─── PAYMENTS ─────────────────────────────────────────────────────────────

export const processPayment = async (paymentDetails) => {
  const data = await request(`/payments/pay`, {
    method: 'POST',
    body: JSON.stringify(paymentDetails),
  });
  if (data.error) throw new Error(data.error);
  return data;
};

export const getPaymentHistory = async () => {
  const data = await request(`/payments/history`);
  if (data.error) throw new Error(data.error);
  return data;
};

export const getOwnerLedger = async () => {
  const data = await request(`/payments/ledger`);
  if (data.error) throw new Error(data.error);
  return data;
};

// ─── MAINTENANCE ─────────────────────────────────────────────────────────────

export const createMaintenanceRequest = async (ticketData) => {
  const data = await request(`/maintenance`, {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });
  if (data.error) throw new Error(data.error);
  return data;
};

export const getStudentMaintenanceRequests = async () => {
  const data = await request(`/maintenance/student`);
  if (data.error) throw new Error(data.error);
  return data;
};

export const getOwnerMaintenanceRequests = async () => {
  const data = await request(`/maintenance/owner`);
  if (data.error) throw new Error(data.error);
  return data;
};

export const updateMaintenanceStatus = async (id, status) => {
  const data = await request(`/maintenance/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  if (data.error) throw new Error(data.error);
  return data;
};

// ─── Notifications API Methods ─────────────────────

export const getNotifications = async () => {
  return request("/notifications", { method: "GET" });
};

export const markNotificationAsRead = async (id) => {
  return request(`/notifications/${id}/read`, { method: "PUT" });
};

export const markAllNotificationsAsRead = async () => {
  return request("/notifications/read-all", { method: "PUT" });
};

export const deleteNotification = async (id) => {
  return request(`/notifications/${id}`, { method: "DELETE" });
};

// ─── Calendar API Methods ─────────────────────

export const getCalendarBlocks = async (listingId) => {
  return request(`/calendar/${listingId}`, { method: "GET" });
};

export const addCalendarBlock = async (listingId, data) => {
  return request(`/calendar/${listingId}/block`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


export const removeCalendarBlock = async (listingId, blockId) => {
  return request(`/calendar/${listingId}/block/${blockId}`, { method: "DELETE" });
};

export const updateCalendarBlock = async (listingId, blockId, data) => {
  return request(`/calendar/${listingId}/block/${blockId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ─── Listings API Methods ─────────────────────

export const getMyListings = async () => {
  return request("/listings/owner/mine", { method: "GET" });
};
