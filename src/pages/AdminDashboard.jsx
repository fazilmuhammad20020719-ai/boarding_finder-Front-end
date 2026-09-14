import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPendingUsers, verifyUserAdmin, getVerificationStats, getAllUsers, updateUserStatusAdmin, updateUserRoleAdmin, getAllAdminListings, updateListingStatusAdmin, getPlatformAnalytics } from '../services/api';

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

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchPendingUsers();
    fetchAllUsersList();
    fetchAllListingsList();
    fetchAnalytics();
  }, []);

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

  const renderVerificationModal = () => {
    if (!selectedUser) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-3xl">
            <h3 className="text-xl font-bold text-slate-800">Review Identity Documents</h3>
            <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-100">
            {/* User Details */}
            <div className="bg-white p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">User Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-800">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-semibold text-[#1952c4] capitalize">{selectedUser.role}</span>
                </div>
                {selectedUser.role === 'student' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">University:</span>
                      <span className="font-semibold text-slate-800">{selectedUser.university}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student ID:</span>
                      <span className="font-semibold text-slate-800">{selectedUser.student_id}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">Admin Actions</h4>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Rejection Note (required for rejection):</label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="e.g. Blurry ID, Expired document..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all resize-none h-24"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleVerifyAction('reject')}
                  disabled={isProcessing || !actionNote}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 border-none cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleVerifyAction('approve')}
                  disabled={isProcessing}
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 border-none cursor-pointer"
                >
                  Approve
                </button>
              </div>
            </div>

            {/* Documents */}
            <div className="md:col-span-2 bg-white p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">Submitted Documents</h4>
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
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                      <div className="bg-slate-200 py-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Document {idx + 1}
                      </div>
                      <div className="p-4 flex-grow flex items-center justify-center min-h-[300px]">
                        {isPdf ? (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[#1952c4] hover:underline">
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
                  <div className="col-span-2 text-center text-slate-500 py-8 italic">No documents uploaded.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      {/* Top Bar */}
      <header className="bg-[#1e293b] text-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#60a5fa] uppercase tracking-wide">System Administrator</div>
            <div className="text-xl font-extrabold text-white">BoardingFinder Admin</div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors cursor-pointer bg-transparent border-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">{stats?.total_users || 0}</div>
              <div className="text-xs font-semibold text-[#64748b]">Total Users</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#e8f7ec] text-[#10b981] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">{stats?.verified_users || 0}</div>
              <div className="text-xs font-semibold text-[#64748b]">Verified Users</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">{stats?.pending_verifications || 0}</div>
              <div className="text-xs font-semibold text-[#64748b]">Pending Approval</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">{stats?.rejected_verifications || 0}</div>
              <div className="text-xs font-semibold text-[#64748b]">Rejected Verifications</div>
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e2e8f0] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'verifications' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800 border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Pending Verifications
            {stats?.pending_verifications > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{stats.pending_verifications}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            User Management
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'listings' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Listing Management
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview & Analytics
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
            {loadingUsers ? (
              <div className="p-12 text-center text-slate-500">Loading pending users...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#ecfdf5] text-[#10b981] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
                <p className="text-slate-500">There are no pending identity verifications to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-[#f0f4f9] text-[#64748b] text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">USER</th>
                      <th className="px-6 py-5">ROLE</th>
                      <th className="px-6 py-5">EMAIL</th>
                      <th className="px-6 py-5">DOCUMENTS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] font-medium text-[#0f172a]">
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${user.role === 'owner' ? 'bg-[#ebf3ff] text-[#1952c4]' : 'bg-[#f3e8ff] text-[#9333ea]'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[#64748b]">{user.email}</td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-[#f59e0b] bg-[#fff8e6] px-3 py-1.5 rounded-full border border-[#f59e0b]/20">
                            {user.verification_docs?.length || 0} Docs Uploaded
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors border-none cursor-pointer shadow-sm"
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

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
            {loadingAllUsers ? (
              <div className="p-12 text-center text-slate-500">Loading users...</div>
            ) : allUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#f0f4f9] text-[#64748b] text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">USER</th>
                      <th className="px-6 py-5">ROLE</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5">JOINED</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] font-medium text-[#0f172a]">
                    {allUsers.map(user => (
                      <tr key={user.id} className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold">{user.name}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer outline-none ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' : user.role === 'owner' ? 'bg-[#ebf3ff] text-[#1952c4] border-[#1952c4]/20' : 'bg-[#f3e8ff] text-[#9333ea] border-[#9333ea]/20'}`}
                          >
                            <option value="student">Student</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${user.account_status === 'active' ? 'bg-emerald-50 text-emerald-600' : user.account_status === 'paused' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                            {user.account_status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-slate-500 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 flex gap-2">
                          {(!user.account_status || user.account_status === 'active') ? (
                            <>
                              <button onClick={() => handleUpdateStatus(user.id, 'paused')} disabled={isProcessing} className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors border-none cursor-pointer">Suspend</button>
                              <button onClick={() => handleUpdateStatus(user.id, 'removed')} disabled={isProcessing} className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border-none cursor-pointer">Ban</button>
                            </>
                          ) : (
                            <button onClick={() => handleUpdateStatus(user.id, 'active')} disabled={isProcessing} className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border-none cursor-pointer">Activate</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
            {loadingListings ? (
              <div className="p-12 text-center text-slate-500">Loading listings...</div>
            ) : allListings.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No listings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#f0f4f9] text-[#64748b] text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">TITLE & LOCATION</th>
                      <th className="px-6 py-5">OWNER</th>
                      <th className="px-6 py-5">PRICE</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] font-medium text-[#0f172a]">
                    {allListings.map(listing => (
                      <tr key={listing.listing_id} className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold cursor-pointer hover:text-[#1952c4] transition-colors" onClick={() => navigate(`/property/${listing.listing_id}`)}>{listing.title}</span>
                            <span className="text-xs text-slate-500 max-w-xs truncate">{listing.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold">{listing.owner_name}</span>
                            <span className="text-xs text-slate-500">{listing.owner_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-700">
                          ${listing.price}/mo
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${listing.approval_status === 'approved' ? 'bg-emerald-50 text-emerald-600' : listing.approval_status === 'pending' ? 'bg-amber-50 text-amber-600' : listing.approval_status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                            {listing.approval_status || 'approved'}
                          </span>
                        </td>
                        <td className="px-6 py-5 flex gap-2">
                          <select
                            value={listing.approval_status || 'approved'}
                            onChange={(e) => handleUpdateListingStatus(listing.listing_id, e.target.value)}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none ${listing.approval_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : listing.approval_status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="suspended">Suspended</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          <button onClick={() => navigate(`/property/${listing.listing_id}`)} className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors border-none cursor-pointer">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {loadingAnalytics || !analyticsData ? (
              <div className="p-12 text-center text-slate-500 bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60">Loading analytics...</div>
            ) : (
              <>
                {/* KPI Row 1: Finances & Bookings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-[#1952c4] to-[#1546a8] rounded-3xl p-6 shadow-md text-white flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white/80 font-semibold text-sm">Total Gross Revenue</h4>
                      <div className="p-2 bg-white/20 rounded-xl">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black mb-1">Rs {analyticsData.revenue.totalGross.toLocaleString()}</div>
                      <div className="text-xs font-medium text-white/80">+{(analyticsData.revenue.platformNet || 0).toLocaleString()} (5% Platform Fee)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-slate-500 font-semibold text-sm">Total Bookings</h4>
                      <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#0f172a] mb-1">{analyticsData.bookings.total}</div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="text-emerald-500 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> {analyticsData.bookings.approved} Approved</span>
                        <span>•</span>
                        <span>{analyticsData.bookings.pending} Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-slate-500 font-semibold text-sm">Property Listings</h4>
                      <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#0f172a] mb-1">{analyticsData.listings.total}</div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="text-emerald-500 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> {analyticsData.listings.approved} Live</span>
                        <span>•</span>
                        <span>{analyticsData.listings.pending} Pending Review</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-slate-500 font-semibold text-sm">Platform Reviews</h4>
                      <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#0f172a] mb-1">{analyticsData.reviews.total}</div>
                      <div className="text-xs font-medium text-slate-500">
                        <span className="font-bold text-amber-500">{analyticsData.reviews.averageRating}</span> Avg Rating System-wide
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Charts & Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* User Demographics */}
                  <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60 flex flex-col h-[380px]">
                    <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">User Demographics</h3>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                          <div className="text-4xl font-black text-[#1952c4] mb-1">{analyticsData.users.students}</div>
                          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Students</div>
                        </div>
                        <div className="text-slate-300 font-light text-4xl">/</div>
                        <div className="text-center">
                          <div className="text-4xl font-black text-purple-600 mb-1">{analyticsData.users.owners}</div>
                          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Owners</div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden flex">
                        {analyticsData.users.total > 0 && (
                          <>
                            <div className="bg-[#1952c4] h-full" style={{ width: `${(analyticsData.users.students / analyticsData.users.total) * 100}%` }}></div>
                            <div className="bg-purple-500 h-full" style={{ width: `${(analyticsData.users.owners / analyticsData.users.total) * 100}%` }}></div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>{analyticsData.users.total > 0 ? Math.round((analyticsData.users.students / analyticsData.users.total) * 100) : 0}% Students</span>
                        <span>{analyticsData.users.total > 0 ? Math.round((analyticsData.users.owners / analyticsData.users.total) * 100) : 0}% Owners</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Status Chart */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60 flex flex-col h-[380px]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[17px] font-extrabold text-[#0f172a]">Booking Funnel</h3>
                      <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">All Time</div>
                    </div>
                    <div className="flex-grow flex items-end justify-between px-6 pb-2 relative">
                      <div className="absolute bottom-6 left-6 right-6 border-b border-dashed border-[#e2e8f0]"></div>
                      <div className="absolute bottom-20 left-6 right-6 border-b border-dashed border-[#e2e8f0]"></div>
                      <div className="absolute bottom-36 left-6 right-6 border-b border-dashed border-[#e2e8f0]"></div>
                      <div className="absolute bottom-52 left-6 right-6 border-b border-dashed border-[#e2e8f0]"></div>

                      {[
                        { label: 'Total Requests', val: analyticsData.bookings.total, h: 'h-52', color: 'bg-slate-300' },
                        { label: 'Pending', val: analyticsData.bookings.pending, h: 'h-24', color: 'bg-amber-400' },
                        { label: 'Approved', val: analyticsData.bookings.approved, h: 'h-40', color: 'bg-emerald-500' },
                        { label: 'Cancelled/Rejected', val: analyticsData.bookings.cancelled, h: 'h-10', color: 'bg-red-400' }
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
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                {bar.val} Bookings
                              </div>
                            </div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase text-center">{bar.label}</div>
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
