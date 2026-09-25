import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getPendingUsers, verifyUserAdmin, getVerificationStats,
  getAllUsers, updateUserStatusAdmin, updateUserRoleAdmin,
  getAllAdminListings, updateListingStatusAdmin, getPlatformAnalytics,
  getAllAdminBookings, updateBookingStatusAdmin,
  getAllAdminReviews, updateReviewStatusAdmin, deleteReviewAdmin,
  getAllAdminTickets, updateTicketStatusAdmin, broadcastAnnouncement,
  getPlatformSettings, updatePlatformSettings
} from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// We need to resolve image urls for verification docs.
const BASE_URL = API_URL.replace('/api', '');

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('verifications');

  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [platformSettings, setPlatformSettings] = useState({
    platform_fee_percentage: '5',
    maintenance_mode: 'false',
    terms_of_service_url: 'https://boardingfinder.com/terms'
  });

  // Broadcast state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementAudience, setAnnouncementAudience] = useState('all');

  // User Management filters
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [userFilterStatus, setUserFilterStatus] = useState('all');

  // Booking filters
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // Review filters
  const [reviewFilterStatus, setReviewFilterStatus] = useState('all');

  // Ticket filters
  const [ticketFilterStatus, setTicketFilterStatus] = useState('all');

  useEffect(() => {
    fetchStats();
    fetchPendingUsers();
    fetchAllUsersList();
    fetchAllListingsList();
    fetchAllBookingsList();
    fetchAllReviewsList();
    fetchAllTicketsList();
    fetchAnalytics();
    fetchPlatformSettingsData();
  }, []);

  const fetchPlatformSettingsData = async () => {
    try {
      setLoadingSettings(true);
      const data = await getPlatformSettings();
      if (data.settings) {
        setPlatformSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await updatePlatformSettings(platformSettings);
      alert('Settings updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchAllTicketsList = async () => {
    try {
      setLoadingTickets(true);
      const data = await getAllAdminTickets();
      setAllTickets(data.tickets || []);
    } catch (err) {
      console.error('Failed to fetch all tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchAllReviewsList = async () => {
    try {
      setLoadingReviews(true);
      const data = await getAllAdminReviews();
      setAllReviews(data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch all reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const data = await getPlatformAnalytics();
      setAnalyticsData(data.analytics);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchAllBookingsList = async () => {
    try {
      setLoadingBookings(true);
      const data = await getAllAdminBookings();
      setAllBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch all bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchAllListingsList = async () => {
    try {
      setLoadingListings(true);
      const data = await getAllAdminListings();
      setAllListings(data.listings || []);
    } catch (err) {
      console.error('Failed to fetch all listings:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchAllUsersList = async () => {
    try {
      setLoadingAllUsers(true);
      const data = await getAllUsers();
      setAllUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch all users:', err);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getVerificationStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const data = await getPendingUsers();
      setPendingUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVerifyAction = async (action) => {
    if (!selectedUser) return;

    if (action === 'reject' && !actionNote) {
      alert("Please provide a note when rejecting.");
      return;
    }

    setIsProcessing(true);
    try {
      await verifyUserAdmin(selectedUser.id, action, actionNote);
      // Refresh data
      await fetchPendingUsers();
      await fetchStats();
      setSelectedUser(null);
      setActionNote('');
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateStatus = async (userId, status) => {
    if (!window.confirm(`Are you sure you want to change this user's status to ${status}?`)) return;
    setIsProcessing(true);
    try {
      await updateUserStatusAdmin(userId, status);
      await fetchAllUsersList();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateRole = async (userId, role) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
    setIsProcessing(true);
    try {
      await updateUserRoleAdmin(userId, role);
      await fetchAllUsersList();
    } catch (err) {
      alert(err.message || 'Failed to update role');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateListingStatus = async (listingId, status) => {
    if (!window.confirm(`Are you sure you want to change this listing's status to ${status}?`)) return;
    setIsProcessing(true);
    try {
      await updateListingStatusAdmin(listingId, status);
      await fetchAllListingsList();
    } catch (err) {
      alert(err.message || 'Failed to update listing status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    if (!window.confirm(`Are you sure you want to change this booking's status to ${status}?`)) return;
    setIsProcessing(true);
    try {
      await updateBookingStatusAdmin(bookingId, status);
      await fetchAllBookingsList();
      await fetchAnalytics();
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateReviewStatus = async (reviewId, status) => {
    if (!window.confirm(`Are you sure you want to change this review's status to ${status}?`)) return;
    setIsProcessing(true);
    try {
      await updateReviewStatusAdmin(reviewId, status);
      await fetchAllReviewsList();
    } catch (err) {
      alert(err.message || 'Failed to update review status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE this review? This action cannot be undone.`)) return;
    setIsProcessing(true);
    try {
      await deleteReviewAdmin(reviewId);
      await fetchAllReviewsList();
      await fetchAnalytics(); // Might impact reviews stat
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    if (!window.confirm(`Are you sure you want to change this ticket's status to ${status}?`)) return;
    setIsProcessing(true);
    try {
      await updateTicketStatusAdmin(ticketId, status);
      await fetchAllTicketsList();
    } catch (err) {
      alert(err.message || 'Failed to update ticket status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBroadcastAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMessage) {
      alert("Title and message are required.");
      return;
    }

    if (!window.confirm(`Are you sure you want to broadcast this message to ${announcementAudience === 'all' ? 'everyone' : announcementAudience + 's'}?`)) return;

    setIsProcessing(true);
    try {
      const result = await broadcastAnnouncement(announcementTitle, announcementMessage, announcementAudience);
      alert(`Success! Broadcasted to ${result.count} users.`);
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementAudience('all');
    } catch (err) {
      alert(err.message || 'Failed to broadcast announcement');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderVerificationModal = () => {
    if (!selectedUser) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
          <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#111] rounded-t-3xl">
            <h3 className="text-xl font-bold text-white">Review Identity Documents</h3>
            <button onClick={() => setSelectedUser(null)} className="text-white/40 hover:text-white bg-transparent border-none cursor-pointer transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111]">
            {/* User Details */}
            <div className="bg-[#1A1A1A] border border-[#333] p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-white mb-4 border-b border-[#333] pb-2">User Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Name:</span>
                  <span className="font-semibold text-white">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="font-semibold text-white">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Role:</span>
                  <span className="font-semibold text-[#FACC15] capitalize">{selectedUser.role}</span>
                </div>
                {selectedUser.role === 'student' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white/60">University:</span>
                      <span className="font-semibold text-white">{selectedUser.university}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Student ID:</span>
                      <span className="font-semibold text-white">{selectedUser.student_id}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#1A1A1A] border border-[#333] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white mb-4 border-b border-[#333] pb-2">Admin Actions</h4>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white/60 mb-2">Rejection Note (required for rejection):</label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="e.g. Blurry ID, Expired document..."
                    className="w-full bg-[#111] text-white border border-[#333] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15]/30 transition-all resize-none h-24 placeholder-white/40"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleVerifyAction('reject')}
                  disabled={isProcessing || !actionNote}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 border-none cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleVerifyAction('approve')}
                  disabled={isProcessing}
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 border-none cursor-pointer"
                >
                  Approve
                </button>
              </div>
            </div>

            {/* Documents */}
            <div className="md:col-span-2 bg-[#1A1A1A] border border-[#333] p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-white mb-4 border-b border-[#333] pb-2">Submitted Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedUser.verification_docs?.map((doc, idx) => {
                  let fileUrl = doc;
                  let isPdf = doc.toLowerCase().endsWith('.pdf');

                  if (doc.includes('drive.google.com/uc?id=') && !isPdf) {
                    fileUrl = doc.replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1000';
                  } else if (doc.includes('drive.google.com/open?id=') && !isPdf) {
                    const fileId = doc.split('id=')[1];
                    fileUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                  } else if (!doc.startsWith('http')) {
                    // Fallback for legacy local files
                    const normalizedDoc = doc.replace(/\\/g, '/');
                    const cleanUrl = normalizedDoc.startsWith('/') ? normalizedDoc.substring(1) : normalizedDoc;
                    fileUrl = `${BASE_URL}/${cleanUrl}`;
                  }

                  if (doc.includes('drive.google.com/file/d/')) {
                    isPdf = true;
                  }

                  return (
                    <div key={idx} className="border border-[#333] rounded-xl overflow-hidden bg-[#111] flex flex-col">
                      <div className="bg-[#222] py-2 px-4 text-xs font-bold text-white/60 uppercase tracking-wider">
                        Document {idx + 1}
                      </div>
                      <div className="p-4 flex-grow flex items-center justify-center min-h-[300px]">
                        {isPdf ? (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[#FACC15] hover:underline">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span className="font-semibold">View Document</span>
                          </a>
                        ) : (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <img src={fileUrl} alt={`Doc ${idx + 1}`} className="max-w-full max-h-[400px] object-contain rounded shadow-sm hover:opacity-90 transition-opacity" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
                {(!selectedUser.verification_docs || selectedUser.verification_docs.length === 0) && (
                  <div className="col-span-2 text-center text-white/40 py-8 italic">No documents uploaded.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      {/* Top Bar */}
      <header className="bg-black border-b border-[#333] text-white px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-[#FACC15]/20 flex items-center justify-center bg-[#FACC15]/10 text-[#FACC15]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#FACC15] uppercase tracking-wide">System Administrator</div>
            <div className="text-xl font-extrabold text-white">BoardingFinder Admin</div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-white/60 hover:text-white font-semibold transition-colors cursor-pointer bg-transparent border-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#1952c4]/20 text-[#1952c4] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-white">{stats?.total_users || 0}</div>
              <div className="text-xs font-semibold text-white/60">Total Users</div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-white">{stats?.verified_users || 0}</div>
              <div className="text-xs font-semibold text-white/60">Verified Users</div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-white">{stats?.pending_verifications || 0}</div>
              <div className="text-xs font-semibold text-white/60">Pending Approval</div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-white">{stats?.rejected_verifications || 0}</div>
              <div className="text-xs font-semibold text-white/60">Rejected Verifications</div>
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#333] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'verifications' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Pending Verifications
            {stats?.pending_verifications > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{stats.pending_verifications}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            User Management
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'listings' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Listing Management
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'bookings' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Bookings
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'reviews' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Review Moderation
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'tickets' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Support Tickets
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'announcements' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            System Announcements
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Global Settings
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'text-[#FACC15] border-b-2 border-[#FACC15] border-solid' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview & Analytics
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'verifications' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            {loadingUsers ? (
              <div className="p-12 text-center text-white/60">Loading pending users...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#10b981]/20 text-[#10b981] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                <p className="text-white/60">There are no pending identity verifications to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">USER</th>
                      <th className="px-6 py-5">ROLE</th>
                      <th className="px-6 py-5">EMAIL</th>
                      <th className="px-6 py-5">DOCUMENTS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] font-medium text-white">
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1952c4]/20 text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${user.role === 'owner' ? 'bg-[#1952c4]/20 text-[#1952c4]' : 'bg-[#9333ea]/20 text-[#c084fc]'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-white/60">{user.email}</td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-3 py-1.5 rounded-full border border-[#f59e0b]/20">
                            {user.verification_docs?.length || 0} Docs Uploaded
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="bg-[#111] hover:bg-[#222] border border-[#333] text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                          >
                            Review Docs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (() => {
          // ── Filter state (scoped to this tab render) ──
          // We use a stateless filter approach: filter controls update parent state
          // defined alongside the other state vars at the top of the component.
          const filteredUsers = allUsers.filter(user => {
            const q = (userSearchQuery || '').toLowerCase();
            const matchesSearch = !q || user.name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);
            const matchesRole = userFilterRole === 'all' || user.role === userFilterRole;
            const status = user.account_status || 'active';
            const matchesStatus = userFilterStatus === 'all' || status === userFilterStatus;
            return matchesSearch && matchesRole && matchesStatus;
          });

          return (
            <div className="space-y-4">
              {/* ── Filter Bar ── */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333] p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/40 transition-all"
                  />
                </div>

                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase whitespace-nowrap">Role</span>
                  <select
                    value={userFilterRole}
                    onChange={(e) => setUserFilterRole(e.target.value)}
                    className="bg-[#111] border border-[#333] text-white rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 cursor-pointer appearance-none pr-8"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase whitespace-nowrap">Status</span>
                  <select
                    value={userFilterStatus}
                    onChange={(e) => setUserFilterStatus(e.target.value)}
                    className="bg-[#111] border border-[#333] text-white rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 cursor-pointer appearance-none pr-8"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Suspended</option>
                    <option value="removed">Banned</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(userSearchQuery || userFilterRole !== 'all' || userFilterStatus !== 'all') && (
                  <button
                    onClick={() => { setUserSearchQuery(''); setUserFilterRole('all'); setUserFilterStatus('all'); }}
                    className="text-xs font-bold text-[#FACC15] hover:text-[#EAB308] bg-transparent border-none cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* ── Users Table ── */}
              <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
                {loadingAllUsers ? (
                  <div className="p-12 text-center text-white/60">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">No users found</h3>
                    <p className="text-white/50 text-sm">Try adjusting your search or filter criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                          <th className="px-6 py-5 rounded-tl-3xl">USER</th>
                          <th className="px-6 py-5">ROLE</th>
                          <th className="px-6 py-5">STATUS</th>
                          <th className="px-6 py-5">JOINED</th>
                          <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="text-[14px] font-medium text-white">
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="font-bold">{user.name}</span>
                                <span className="text-xs text-white/60">{user.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                disabled={isProcessing}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer outline-none bg-[#111] ${user.role === 'admin' ? 'text-red-500 border-red-500/20' : user.role === 'owner' ? 'text-[#1952c4] border-[#1952c4]/20' : 'text-[#c084fc] border-[#9333ea]/20'}`}
                              >
                                <option value="student">Student</option>
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${user.account_status === 'active' ? 'bg-[#10b981]/20 text-[#10b981]' : user.account_status === 'paused' ? 'bg-amber-500/20 text-amber-500' : user.account_status === 'removed' ? 'bg-red-500/20 text-red-500' : 'bg-[#10b981]/20 text-[#10b981]'}`}>
                                {user.account_status || 'active'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-white/60 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-5 flex gap-2">
                              {(!user.account_status || user.account_status === 'active') ? (
                                <>
                                  <button onClick={() => handleUpdateStatus(user.id, 'paused')} disabled={isProcessing} className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 rounded-lg transition-colors border-none cursor-pointer">Suspend</button>
                                  <button onClick={() => handleUpdateStatus(user.id, 'removed')} disabled={isProcessing} className="px-3 py-1.5 text-xs font-bold bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors border-none cursor-pointer">Ban</button>
                                </>
                              ) : (
                                <button onClick={() => handleUpdateStatus(user.id, 'active')} disabled={isProcessing} className="px-3 py-1.5 text-xs font-bold bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30 rounded-lg transition-colors border-none cursor-pointer">Activate</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer with result count */}
                {!loadingAllUsers && filteredUsers.length > 0 && (
                  <div className="px-6 py-4 border-t border-[#333] flex justify-between items-center">
                    <span className="text-xs font-semibold text-white/50">
                      Showing {filteredUsers.length} of {allUsers.length} user{allUsers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'listings' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            {loadingListings ? (
              <div className="p-12 text-center text-white/60">Loading listings...</div>
            ) : allListings.length === 0 ? (
              <div className="p-12 text-center text-white/60">No listings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">TITLE & LOCATION</th>
                      <th className="px-6 py-5">OWNER</th>
                      <th className="px-6 py-5">PRICE</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] font-medium text-white">
                    {allListings.map(listing => (
                      <tr key={listing.listing_id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold cursor-pointer hover:text-[#FACC15] transition-colors" onClick={() => navigate(`/property/${listing.listing_id}`)}>{listing.title}</span>
                            <span className="text-xs text-white/60 max-w-xs truncate">{listing.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold">{listing.owner_name}</span>
                            <span className="text-xs text-white/60">{listing.owner_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-white">
                          ${listing.price}/mo
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${listing.approval_status === 'approved' ? 'bg-[#10b981]/20 text-[#10b981]' : listing.approval_status === 'pending' ? 'bg-amber-500/20 text-amber-500' : listing.approval_status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-[#333] text-white/60'}`}>
                            {listing.approval_status || 'approved'}
                          </span>
                        </td>
                        <td className="px-6 py-5 flex gap-2">
                          <select
                            value={listing.approval_status || 'approved'}
                            onChange={(e) => handleUpdateListingStatus(listing.listing_id, e.target.value)}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none bg-[#111] ${listing.approval_status === 'approved' ? 'text-[#10b981] border-[#10b981]/20' : listing.approval_status === 'rejected' ? 'text-red-500 border-red-500/20' : 'text-amber-500 border-amber-500/20'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="suspended">Suspended</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          <button onClick={() => navigate(`/property/${listing.listing_id}`)} className="px-3 py-1.5 text-xs font-bold bg-[#111] border border-[#333] text-white hover:bg-[#222] rounded-lg transition-colors cursor-pointer">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-[#FACC15]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Platform Bookings
              </h2>
              <div className="flex gap-3">
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-sm font-semibold border border-[#333] rounded-xl outline-none focus:border-[#FACC15]/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loadingBookings ? (
              <div className="p-12 text-center text-white/60">Loading platform bookings...</div>
            ) : allBookings.length === 0 ? (
              <div className="p-12 text-center text-white/60 flex flex-col items-center">
                <svg className="w-12 h-12 mb-4 text-[#333]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                No bookings found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">BOOKING ID</th>
                      <th className="px-6 py-5">LISTING</th>
                      <th className="px-6 py-5">STUDENT (SEEKER)</th>
                      <th className="px-6 py-5">OWNER</th>
                      <th className="px-6 py-5">TOTAL AMOUNT</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {allBookings.filter(b => bookingFilterStatus === 'all' || b.status === bookingFilterStatus).map((booking) => (
                      <tr key={booking.booking_id} className="hover:bg-[#222]/50 transition-colors">
                        <td className="px-6 py-5 font-semibold text-white/80">#{booking.booking_id}</td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-white truncate max-w-[200px]">{booking.listing_title}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{booking.seeker_name}</span>
                            <span className="text-xs text-white/60">{booking.seeker_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{booking.owner_name}</span>
                            <span className="text-xs text-white/60">{booking.owner_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-white">
                          ${booking.total_amount}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${booking.status === 'approved' ? 'bg-[#10b981]/20 text-[#10b981]' : booking.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 flex gap-2">
                          <select
                            value={booking.status}
                            onChange={(e) => handleUpdateBookingStatus(booking.booking_id, e.target.value)}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none bg-[#111] ${booking.status === 'approved' ? 'text-[#10b981] border-[#10b981]/20' : booking.status === 'pending' ? 'text-amber-500 border-amber-500/20' : 'text-red-500 border-red-500/20'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Review Moderation
              </h2>
              <div className="flex gap-3">
                <select
                  value={reviewFilterStatus}
                  onChange={(e) => setReviewFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-sm font-semibold border border-[#333] rounded-xl outline-none focus:border-amber-500/50"
                >
                  <option value="all">All Reviews</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {loadingReviews ? (
              <div className="p-12 text-center text-white/60">Loading reviews...</div>
            ) : allReviews.length === 0 ? (
              <div className="p-12 text-center text-white/60 flex flex-col items-center">
                <svg className="w-12 h-12 mb-4 text-[#333]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                No reviews found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">REVIEW INFO</th>
                      <th className="px-6 py-5">LISTING</th>
                      <th className="px-6 py-5">RATING</th>
                      <th className="px-6 py-5">COMMENT</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {allReviews.filter(r => reviewFilterStatus === 'all' || r.status === reviewFilterStatus).map((review) => (
                      <tr key={review.review_id} className="hover:bg-[#222]/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{review.reviewer_name}</span>
                            <span className="text-xs text-white/60">{review.reviewer_email}</span>
                            <span className="text-xs text-white/40 mt-1">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-white truncate max-w-[200px]" title={review.listing_title}>{review.listing_title}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-[#333]'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-white/80 max-w-xs break-words whitespace-pre-wrap">{review.comment}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${review.status === 'approved' ? 'bg-[#10b981]/20 text-[#10b981]' : review.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
                            {review.status || 'approved'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <select
                              value={review.status || 'approved'}
                              onChange={(e) => handleUpdateReviewStatus(review.review_id, e.target.value)}
                              disabled={isProcessing}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none bg-[#111] ${review.status === 'approved' ? 'text-[#10b981] border-[#10b981]/20' : review.status === 'pending' ? 'text-amber-500 border-amber-500/20' : 'text-red-500 border-red-500/20'}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>

                            <button
                              onClick={() => handleDeleteReview(review.review_id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer outline-none bg-[#111]"
                              title="Delete Review"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-[#60a5fa]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Support Tickets
              </h2>
              <div className="flex gap-3">
                <select
                  value={ticketFilterStatus}
                  onChange={(e) => setTicketFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-sm font-semibold border border-[#333] rounded-xl outline-none focus:border-[#60a5fa]/50"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {loadingTickets ? (
              <div className="p-12 text-center text-white/60">Loading support tickets...</div>
            ) : allTickets.length === 0 ? (
              <div className="p-12 text-center text-white/60 flex flex-col items-center">
                <svg className="w-12 h-12 mb-4 text-[#333]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                No support tickets found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">TICKET ID</th>
                      <th className="px-6 py-5">USER INFO</th>
                      <th className="px-6 py-5">SUBJECT / DESCRIPTION</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {allTickets.filter(t => ticketFilterStatus === 'all' || t.status === ticketFilterStatus).map((ticket) => (
                      <tr key={ticket.ticket_id} className="hover:bg-[#222]/50 transition-colors">
                        <td className="px-6 py-5 font-semibold text-white/80">#{ticket.ticket_id}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{ticket.user_name} <span className="text-[#FACC15] text-[10px] ml-1 uppercase">({ticket.user_role})</span></span>
                            <span className="text-xs text-white/60">{ticket.user_email}</span>
                            <span className="text-xs text-white/40 mt-1">{new Date(ticket.created_at).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 max-w-md">
                          <div className="font-bold text-white text-sm mb-1 break-words">{ticket.subject}</div>
                          <div className="text-sm text-white/70 break-words whitespace-pre-wrap">{ticket.description}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${ticket.status === 'open' ? 'bg-amber-500/20 text-amber-500' :
                              ticket.status === 'in_progress' ? 'bg-[#60a5fa]/20 text-[#60a5fa]' :
                                ticket.status === 'resolved' ? 'bg-[#10b981]/20 text-[#10b981]' :
                                  'bg-[#333] text-white/60'
                            }`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleUpdateTicketStatus(ticket.ticket_id, e.target.value)}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none bg-[#111] ${ticket.status === 'open' ? 'text-amber-500 border-amber-500/20' :
                                ticket.status === 'in_progress' ? 'text-[#60a5fa] border-[#60a5fa]/20' :
                                  ticket.status === 'resolved' ? 'text-[#10b981] border-[#10b981]/20' :
                                    'text-white/60 border-[#333]'
                              }`}
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] bg-[#111]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                Broadcast System Announcement
              </h2>
              <p className="text-white/60 text-sm mt-2">Send important alerts to all users directly into their notification inboxes.</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleBroadcastAnnouncement} className="max-w-3xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Target Audience</label>
                  <select
                    value={announcementAudience}
                    onChange={(e) => setAnnouncementAudience(e.target.value)}
                    className="w-full sm:w-64 bg-[#111] text-white border border-[#333] rounded-xl p-3 focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]/50 transition-all outline-none"
                  >
                    <option value="all">All Users (Global)</option>
                    <option value="student">Students Only</option>
                    <option value="owner">Owners Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Announcement Title</label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="e.g. Scheduled System Maintenance"
                    className="w-full bg-[#111] text-white border border-[#333] rounded-xl p-3 focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]/50 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-2">Message Content</label>
                  <textarea
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-[#111] text-white border border-[#333] rounded-xl p-4 h-40 resize-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]/50 transition-all outline-none"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-[#333] flex justify-end">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-xl shadow-lg shadow-[#8b5cf6]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? 'Broadcasting...' : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        Send Broadcast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] bg-[#111]">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Global Settings Panel
              </h2>
              <p className="text-white/60 text-sm mt-2">Manage dynamic variables like platform fees, terms of service, and system maintenance modes.</p>
            </div>

            <div className="p-8">
              {loadingSettings ? (
                <div className="text-white/60">Loading settings...</div>
              ) : (
                <form onSubmit={handleUpdateSettings} className="max-w-2xl space-y-8">

                  {/* Platform Fee */}
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Platform Fee Percentage (%)</label>
                    <p className="text-white/40 text-xs mb-3">The percentage fee charged on digital leases or transactions.</p>
                    <div className="relative">
                      <input
                        type="number"
                        min="0" max="100" step="0.1"
                        value={platformSettings.platform_fee_percentage || ''}
                        onChange={(e) => setPlatformSettings({ ...platformSettings, platform_fee_percentage: e.target.value })}
                        className="w-full sm:w-64 bg-[#111] text-white border border-[#333] rounded-xl p-3 pl-4 pr-10 focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]/50 transition-all outline-none"
                        required
                      />
                      <span className="absolute left-[230px] sm:left-[230px] top-[14px] text-white/50 font-bold">%</span>
                    </div>
                  </div>

                  {/* Terms of Service URL */}
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Terms of Service URL</label>
                    <p className="text-white/40 text-xs mb-3">The link to the platform's terms of service document.</p>
                    <input
                      type="url"
                      value={platformSettings.terms_of_service_url || ''}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, terms_of_service_url: e.target.value })}
                      placeholder="https://example.com/terms"
                      className="w-full bg-[#111] text-white border border-[#333] rounded-xl p-3 focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]/50 transition-all outline-none"
                      required
                    />
                  </div>

                  {/* Maintenance Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">System Maintenance Mode</label>
                    <p className="text-white/40 text-xs mb-3">If enabled, standard users will see a maintenance screen and won't be able to log in or use the platform.</p>
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setPlatformSettings({ ...platformSettings, maintenance_mode: platformSettings.maintenance_mode === 'true' ? 'false' : 'true' })}
                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${platformSettings.maintenance_mode === 'true' ? 'bg-red-500' : 'bg-[#333]'}`}
                      >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${platformSettings.maintenance_mode === 'true' ? 'translate-x-7' : 'translate-x-0'}`} />
                      </div>
                      <span className={`text-sm font-bold ${platformSettings.maintenance_mode === 'true' ? 'text-red-500' : 'text-white/40'}`}>
                        {platformSettings.maintenance_mode === 'true' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#333] flex justify-end">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl shadow-lg shadow-[#10b981]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isProcessing ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {loadingAnalytics || !analyticsData ? (
              <div className="p-12 text-center text-white/60 bg-[#1A1A1A] rounded-3xl shadow-sm border border-[#333]">Loading analytics...</div>
            ) : (
              <>
                {/* KPI Row 1: Finances & Bookings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1A1A1A] border border-[#333] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white/60 font-semibold text-sm">Total Gross Revenue</h4>
                      <div className="p-2 bg-[#1952c4]/20 rounded-xl">
                        <svg className="w-5 h-5 text-[#1952c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white mb-1">Rs {analyticsData.revenue.totalGross.toLocaleString()}</div>
                      <div className="text-xs font-medium text-white/60">+{(analyticsData.revenue.platformNet || 0).toLocaleString()} (5% Platform Fee)</div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white/60 font-semibold text-sm">Total Bookings</h4>
                      <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white mb-1">{analyticsData.bookings.total}</div>
                      <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                        <span className="text-[#10b981] flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> {analyticsData.bookings.approved} Approved</span>
                        <span>•</span>
                        <span>{analyticsData.bookings.pending} Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white/60 font-semibold text-sm">Property Listings</h4>
                      <div className="p-2 bg-[#1952c4]/20 rounded-xl text-[#60a5fa]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white mb-1">{analyticsData.listings.total}</div>
                      <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                        <span className="text-[#10b981] flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> {analyticsData.listings.approved} Live</span>
                        <span>•</span>
                        <span>{analyticsData.listings.pending} Pending Review</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white/60 font-semibold text-sm">Platform Reviews</h4>
                      <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white mb-1">{analyticsData.reviews.total}</div>
                      <div className="text-xs font-medium text-white/60">
                        <span className="font-bold text-amber-400">{analyticsData.reviews.averageRating}</span> Avg Rating System-wide
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Charts & Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* User Demographics */}
                  <div className="lg:col-span-1 bg-[#1A1A1A] rounded-3xl p-8 shadow-sm border border-[#333] flex flex-col h-[380px]">
                    <h3 className="text-[17px] font-extrabold text-white mb-6">User Demographics</h3>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                          <div className="text-4xl font-black text-[#60a5fa] mb-1">{analyticsData.users.students}</div>
                          <div className="text-sm font-semibold text-white/60 uppercase tracking-wide">Students</div>
                        </div>
                        <div className="text-[#333] font-light text-4xl">/</div>
                        <div className="text-center">
                          <div className="text-4xl font-black text-purple-400 mb-1">{analyticsData.users.owners}</div>
                          <div className="text-sm font-semibold text-white/60 uppercase tracking-wide">Owners</div>
                        </div>
                      </div>

                      <div className="w-full bg-[#111] rounded-full h-4 mb-2 overflow-hidden flex">
                        {analyticsData.users.total > 0 && (
                          <>
                            <div className="bg-[#60a5fa] h-full" style={{ width: `${(analyticsData.users.students / analyticsData.users.total) * 100}%` }}></div>
                            <div className="bg-purple-500 h-full" style={{ width: `${(analyticsData.users.owners / analyticsData.users.total) * 100}%` }}></div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-white/60">
                        <span>{analyticsData.users.total > 0 ? Math.round((analyticsData.users.students / analyticsData.users.total) * 100) : 0}% Students</span>
                        <span>{analyticsData.users.total > 0 ? Math.round((analyticsData.users.owners / analyticsData.users.total) * 100) : 0}% Owners</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Status Chart */}
                  <div className="lg:col-span-2 bg-[#1A1A1A] rounded-3xl p-8 shadow-sm border border-[#333] flex flex-col h-[380px]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[17px] font-extrabold text-white">Booking Funnel</h3>
                      <div className="text-xs font-semibold text-white/60 bg-[#111] px-3 py-1 rounded-full">All Time</div>
                    </div>
                    <div className="flex-grow flex items-end justify-between px-6 pb-2 relative">
                      <div className="absolute bottom-6 left-6 right-6 border-b border-dashed border-[#333]"></div>
                      <div className="absolute bottom-20 left-6 right-6 border-b border-dashed border-[#333]"></div>
                      <div className="absolute bottom-36 left-6 right-6 border-b border-dashed border-[#333]"></div>
                      <div className="absolute bottom-52 left-6 right-6 border-b border-dashed border-[#333]"></div>

                      {[
                        { label: 'Total Requests', val: analyticsData.bookings.total, h: 'h-52', color: 'bg-[#333]' },
                        { label: 'Pending', val: analyticsData.bookings.pending, h: 'h-24', color: 'bg-amber-500' },
                        { label: 'Approved', val: analyticsData.bookings.approved, h: 'h-40', color: 'bg-[#10b981]' },
                        { label: 'Cancelled/Rejected', val: analyticsData.bookings.cancelled, h: 'h-10', color: 'bg-red-500' }
                      ].map((bar, index) => {
                        // Calculate dynamic height based on max value if total > 0
                        const maxVal = Math.max(analyticsData.bookings.total, 1);
                        const heightPct = Math.max((bar.val / maxVal) * 100, 5); // min 5% height so it's visible
                        return (
                          <div key={index} className="flex flex-col items-center gap-4 z-10 flex-1 px-2">
                            <div
                              className={`w-full max-w-[70px] ${bar.color} rounded-t-xl relative group cursor-pointer transition-all hover:opacity-80`}
                              style={{ height: `${heightPct}%`, minHeight: '20px' }}
                            >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-[#333]">
                                {bar.val} Bookings
                              </div>
                            </div>
                            <div className="text-[11px] font-bold text-white/40 uppercase text-center">{bar.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* Verification Modal */}
      {renderVerificationModal()}
    </div>
  );
};

export default AdminDashboard;
