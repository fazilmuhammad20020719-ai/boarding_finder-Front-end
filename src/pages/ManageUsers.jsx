import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { getUsersPage, updateUserStatusAdmin } from '../services/api';

const PAGE_SIZE = 50;
import { useAuth } from '../context/AuthContext';

// UI label ↔ backend account_status
const STATUS_TO_UI = { active: 'Active', paused: 'Locked', removed: 'Banned' };
const UI_TO_STATUS = { Active: 'active', Locked: 'paused', Banned: 'removed' };
const ROLE_TO_UI = { student: 'Tenant', owner: 'Owner', admin: 'Admin' };

const toUiUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: ROLE_TO_UI[u.role] || u.role,
  status: STATUS_TO_UI[u.account_status] || 'Active',
  verification: u.verification_status,
  joined: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1A1A1A&color=FACC15`,
});

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = async (offset) => {
    const data = await getUsersPage({ limit: PAGE_SIZE, offset });
    const page = (data.users || []).map(toUiUser);
    setUsers(prev => offset === 0 ? page : [...prev, ...page]);
    setPagination(data.pagination || { total: page.length, hasMore: false });
  };

  useEffect(() => {
    loadPage(0)
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await loadPage(users.length);
    } catch (err) {
      alert(err.message || 'Failed to load more users');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAction = async (id, newStatus) => {
    if (newStatus === 'Banned' && !window.confirm('Ban this user? They will be unable to log in.')) return;
    setBusyId(id);
    try {
      await updateUserStatusAdmin(id, UI_TO_STATUS[newStatus]);
      setUsers(prev =>
        prev.map(user => user.id === id ? { ...user, status: newStatus } : user)
      );
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
            <p className="text-white/60 mt-1 text-[15px]">Ban accounts, resolve disputes, and assist locked-out users.</p>
          </div>
          <Link to="/admin-dashboard">
            <button className="px-5 py-2.5 bg-[#111] hover:bg-[#222] border border-[#333] text-white font-semibold rounded-xl shadow-sm transition-all text-sm cursor-pointer">
              Admin Dashboard
            </button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#1A1A1A] p-4 rounded-[20px] shadow-sm border border-[#333] mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/30 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-white/60">Filter:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#111] border border-[#333] text-white rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Tenant">Tenants</option>
              <option value="Owner">Owners</option>
              <option value="Admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] text-white/60 text-xs uppercase tracking-wider border-b border-[#333]">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {loading || error || filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-6 py-12 text-center ${error ? 'text-red-400' : 'text-white/60'}`}>
                      {loading ? 'Loading users...' : error || 'No users found matching your search.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <React.Fragment key={user.id}>
                    <tr className="hover:bg-[#222] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-[#333]" />
                          <div>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                            <p className="text-xs text-white/60">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          user.role === 'Owner' ? 'bg-purple-500/20 text-purple-400' :
                          user.role === 'Admin' ? 'bg-red-500/20 text-red-400' : 'bg-[#1952c4]/20 text-[#60a5fa]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Active' ? 'bg-[#10b981]/20 text-[#10b981]' : 
                          user.status === 'Banned' ? 'bg-red-500/20 text-red-500' :
                          'bg-amber-500/20 text-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-[#10b981]' : 
                            user.status === 'Banned' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {user.joined}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {user.id !== currentUser?.id && (user.status === 'Banned' ? (
                          <button 
                            onClick={() => handleAction(user.id, 'Active')}
                            disabled={busyId === user.id}
                            className="px-3 py-1.5 bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer disabled:opacity-50"
                          >
                            Unban
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction(user.id, 'Banned')}
                            disabled={busyId === user.id}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer disabled:opacity-50"
                          >
                            Ban
                          </button>
                        ))}

                        {user.id !== currentUser?.id && user.status === 'Locked' && (
                          <button 
                            onClick={() => handleAction(user.id, 'Active')}
                            disabled={busyId === user.id}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer disabled:opacity-50"
                          >
                            Unlock
                          </button>
                        )}

                        {user.id !== currentUser?.id && user.status === 'Active' && (
                          <button 
                            onClick={() => handleAction(user.id, 'Locked')}
                            disabled={busyId === user.id}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer disabled:opacity-50"
                          >
                            Lock
                          </button>
                        )}
                        
                        <button
                          onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                          className="px-3 py-1.5 bg-[#111] hover:bg-[#222] border border-[#333] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          {expandedId === user.id ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === user.id && (
                      <tr className="bg-[#111]">
                        <td colSpan="5" className="px-6 py-4 text-sm text-white/70">
                          <span className="mr-6"><span className="text-white/40">User ID:</span> {user.id}</span>
                          <span className="mr-6"><span className="text-white/40">Verification:</span> {user.verification || 'n/a'}</span>
                          <Link to="/admin-dashboard" className="text-[#FACC15] hover:underline">Review in Admin Dashboard →</Link>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-[#333] flex justify-between items-center text-sm">
            <span className="text-white/60">Showing {filteredUsers.length} of {pagination.total} users</span>
            {pagination.hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-4 py-2 rounded-lg bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold border-none cursor-pointer disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default ManageUsers;
