const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Session / access token ──────────────────
// The short-lived access token lives only in memory (not localStorage), so an
// XSS payload cannot read a long-lived credential. The refresh token is an
// HTTP-only cookie the browser sends to /api/auth/refresh.
let accessToken = null;
let refreshPromise = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token || null;
};

/**
 * Exchange the refresh cookie for a new access token.
 * Concurrent callers share a single in-flight refresh.
 * @returns {Promise<string|null>}
 */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": "boarding-finder-csrf-protection" },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        setAccessToken(response.ok ? data.token : null);
        return accessToken;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Low-level authenticated fetch. Retries once after refreshing the session on 401.
 * Pass `raw: true` to get the Response back instead of parsed JSON.
 */
async function authFetch(endpoint, options = {}, { raw = false, retry = true } = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    // Do NOT set Content-Type for FormData — the browser sets the multipart boundary
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    "X-CSRF-Token": "boarding-finder-csrf-protection",
    ...options.headers,
  };
  const hadToken = !!accessToken;
  if (hadToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry && !endpoint.startsWith("/auth/login")) {
    const newToken = await refreshSession();
    if (newToken) {
      return authFetch(endpoint, options, { raw, retry: false });
    }
    // ── Session Expiration UX ── (only if the user was actually signed in)
    if (hadToken) {
      window.dispatchEvent(new Event("auth:session-expired"));
    }
  }

  if (raw) {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || data.message || "Something went wrong");
    }
    return response;
  }

  const data = await response.json().catch(() => ({})); // gracefully handle empty/non-json responses
  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }
  return data;
}

/**
 * Generic JSON request wrapper with error handling.
 */
async function request(endpoint, options = {}) {
  return authFetch(endpoint, options);
}

/**
 * Fetch every page of a paginated list endpoint (server caps each page).
 * Used by screens that genuinely need the whole collection (maps, dashboards).
 */
async function fetchAllPages(endpoint, key, pageSize = 200) {
  const sep = endpoint.includes("?") ? "&" : "?";
  let offset = 0;
  let items = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = await request(`${endpoint}${sep}limit=${pageSize}&offset=${offset}`, { method: "GET" });
    items = items.concat(data[key] || []);
    if (!data.pagination?.hasMore) return { [key]: items, pagination: data.pagination };
    offset += pageSize;
  }
}

/** Fetch a single page: returns { [key]: rows, pagination: { total, hasMore, ... } } */
async function fetchPage(endpoint, { limit = 50, offset = 0 } = {}) {
  return request(`${endpoint}?limit=${limit}&offset=${offset}`, { method: "GET" });
}

export async function logoutUser() {
  return request("/auth/logout", { method: "POST" }).catch(() => ({}));
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

export async function requestPasswordReset(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, password) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
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
  return fetchAllPages("/listings", "listings");
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

export async function pauseListing(id, is_paused) {
  return request(`/listings/${id}/pause`, {
    method: "PUT",
    body: JSON.stringify({ is_paused }),
  });
}

export async function duplicateListing(id) {
  return request(`/listings/${id}/duplicate`, {
    method: "POST",
  });
}

export async function getListingAnalytics(id) {
  return request(`/listings/${id}/analytics`, {
    method: "GET",
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

  return request("/listings/upload", { method: "POST", body: formData });
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

  return request("/auth/upload-verification-docs", { method: "POST", body: formData });
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
  return fetchAllPages("/admin/users", "users");
}

export async function getUsersPage(page) {
  return fetchPage("/admin/users", page);
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
  return fetchAllPages("/admin/listings", "listings");
}

export async function getPagedAdminListings(page) {
  return fetchPage("/admin/listings", page);
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

export async function getAllAdminBookings() {
  return fetchAllPages("/admin/bookings", "bookings");
}

export async function getPagedAdminBookings(page) {
  return fetchPage("/admin/bookings", page);
}

export async function updateBookingStatusAdmin(bookingId, status) {
  return request(`/admin/bookings/${bookingId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function getAllAdminReviews() {
  return fetchAllPages("/admin/reviews", "reviews");
}

export async function getPagedAdminReviews(page) {
  return fetchPage("/admin/reviews", page);
}

export async function updateReviewStatusAdmin(reviewId, status) {
  return request(`/admin/reviews/${reviewId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteReviewAdmin(reviewId) {
  return request(`/admin/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────────────────────────────────
// Admin Tickets API Methods - HMR force reload
// ─────────────────────────────────────────────────────────────────
export async function getAllAdminTickets() {
  return fetchAllPages("/admin/tickets", "tickets");
}

export async function getPagedAdminTickets(page) {
  return fetchPage("/admin/tickets", page);
}

export async function updateTicketStatusAdmin(ticketId, status) {
  return request(`/admin/tickets/${ticketId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function broadcastAnnouncement(title, message, target_audience) {
  return request("/admin/announcements", {
    method: "POST",
    body: JSON.stringify({ title, message, target_audience }),
  });
}

export async function getPlatformSettings() {
  return request("/admin/settings", { method: "GET" });
}

export async function updatePlatformSettings(settings) {
  return request("/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  });
}

// ─────────────────────────────────────────────────────────────────
// User Tickets API Methods
// ─────────────────────────────────────────────────────────────────
export async function createTicket(subject, description) {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify({ subject, description }),
  });
}

export async function getMyTickets() {
  return request("/tickets/my-tickets", { method: "GET" });
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

export const getPaymentConfig = async () => {
  return request("/payments/config", { method: "GET" });
};

export const getPromotionPlans = async () => {
  return request("/payments/promotion-plans", { method: "GET" });
};

export const startBookingCheckout = async ({ booking_id, amount, payment_type }) => {
  return request("/payments/checkout/booking", {
    method: "POST",
    body: JSON.stringify({ booking_id, amount, payment_type }),
  });
};

export const startPromotionCheckout = async ({ listing_id, plan_id }) => {
  return request("/payments/checkout/promotion", {
    method: "POST",
    body: JSON.stringify({ listing_id, plan_id }),
  });
};

export const getPaymentOrder = async (orderId) => {
  return request(`/payments/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
};

/**
 * Redirect the browser to the PayHere hosted checkout by submitting the
 * signed form fields returned from one of the checkout endpoints.
 */
export const redirectToPayHere = ({ action, fields }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
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

export const getIcalLink = async (listingId) => {
  return request(`/calendar/${listingId}/ical-link`, { method: "GET" });
};

export const importIcal = async (listingId, url) => {
  return request(`/calendar/${listingId}/ical-import`, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
};

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

// ─── Listings API Methods ─────────────────────

export const getMyListings = async () => {
  return request("/listings/owner/mine", { method: "GET" });
};

// ─── Verification Documents (private) ────────

/**
 * Fetch a user's private verification document with the auth token.
 * Returns a blob object URL (caller must revoke it) and whether it is a PDF.
 */
export async function fetchVerificationDoc(userId, index) {
  const response = await authFetch(`/admin/users/${userId}/verification-docs/${index}`, { method: "GET" }, { raw: true });
  const blob = await response.blob();
  return { url: URL.createObjectURL(blob), isPdf: blob.type === "application/pdf" };
}

// ─── Database Viewer (Admin) ─────────────────

export const getDbTables = async () => {
  return request("/db/tables", { method: "GET" });
};

export const getDbTable = async (tableName) => {
  return request(`/db/tables/${encodeURIComponent(tableName)}`, { method: "GET" });
};

export const deleteDbRecord = async (tableName, pkName, pkValue) => {
  return request(
    `/db/tables/${encodeURIComponent(tableName)}/${encodeURIComponent(pkName)}/${encodeURIComponent(pkValue)}`,
    { method: "DELETE" }
  );
};

export const exportDb = async (withData) => {
  return request(`/db/export?withData=${withData}`, { method: "GET" });
};

// ─── Contact & Reports ───────────────────────

export const sendContactMessage = async (data) => {
  return request("/tickets/contact", {
    method: "POST",
    body: JSON.stringify(data), // { name, email, subject, message }
  });
};

export const submitReport = async (data) => {
  return request("/tickets/report", {
    method: "POST",
    body: JSON.stringify(data), // { targetType, targetId, targetName, reason, details }
  });
};
