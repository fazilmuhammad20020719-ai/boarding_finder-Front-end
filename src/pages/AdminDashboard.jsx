import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPendingUsers, verifyUserAdmin, getVerificationStats } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// We need to resolve image urls for verification docs.
const BASE_URL = API_URL.replace('/api', '');

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('verifications');
  
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchPendingUsers();
  }, []);

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
                   const fileUrl = doc.startsWith('http') ? doc : `${BASE_URL}${doc}`;
                   const isPdf = doc.toLowerCase().endsWith('.pdf');
                   return (
                     <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                       <div className="bg-slate-200 py-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                         Document {idx + 1}
                       </div>
                       <div className="p-4 flex-grow flex items-center justify-center min-h-[300px]">
                         {isPdf ? (
                           <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[#1952c4] hover:underline">
                             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                             <span className="font-semibold">View PDF Document</span>
                           </a>
                         ) : (
                           <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                             <img src={fileUrl} alt={`Doc ${idx+1}`} className="max-w-full max-h-[400px] object-contain rounded shadow-sm hover:opacity-90 transition-opacity" />
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
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            System Status
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

        {activeTab === 'overview' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60 flex flex-col h-[380px]">
                 <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Verification Pipeline</h3>
                 <div className="flex-grow flex items-end justify-between px-4 pb-2 relative">
                   <div className="absolute bottom-6 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                   <div className="absolute bottom-20 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                   <div className="absolute bottom-36 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                   <div className="absolute bottom-52 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                   
                   {[
                     { label: 'Registered', val: stats?.total_users || 0, h: 'h-48', color: 'from-slate-400 to-slate-500' },
                     { label: 'Verified', val: stats?.verified_users || 0, h: 'h-36', color: 'from-[#10b981] to-[#059669]' },
                     { label: 'Pending', val: stats?.pending_verifications || 0, h: 'h-16', color: 'from-[#f59e0b] to-[#d97706]' },
                     { label: 'Rejected', val: stats?.rejected_verifications || 0, h: 'h-8', color: 'from-red-500 to-red-600' }
                   ].map((bar, index) => (
                     <div key={index} className="flex flex-col items-center gap-3 z-10 flex-1 px-1">
                       <div className={`w-full max-w-[60px] bg-gradient-to-t ${bar.color} rounded-t-lg ${bar.h} relative group cursor-pointer`}>
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                           {bar.val}
                         </div>
                       </div>
                       <div className="text-[11px] font-semibold text-slate-500 uppercase">{bar.label}</div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
             
             <div className="lg:col-span-1 space-y-8">
               <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60">
                 <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">System Status</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-[#e2e8f0]/60">
                     <span className="text-[#64748b] font-semibold text-[15px]">API</span>
                     <span className="text-[#10b981] font-bold text-[15px]">Operational</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-[#e2e8f0]/60">
                     <span className="text-[#64748b] font-semibold text-[15px]">Database</span>
                     <span className="text-[#10b981] font-bold text-[15px]">Operational</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-[#e2e8f0]/60">
                     <span className="text-[#64748b] font-semibold text-[15px]">Email Service</span>
                     <span className="text-[#10b981] font-bold text-[15px]">Operational</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[#64748b] font-semibold text-[15px]">Document Storage</span>
                     <span className="text-[#10b981] font-bold text-[15px]">Operational</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        )}

      </main>
      
      {/* Verification Modal */}
      {renderVerificationModal()}
    </div>
  );
};

export default AdminDashboard;
