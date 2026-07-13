import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MOCK_USERS = [
  {
    id: "USR-001",
    name: "Muslima",
    email: "muslima@example.com",
    role: "Tenant",
    status: "Active",
    joined: "Jan 12, 2026",
    avatar: "https://ui-avatars.com/api/?name=Muslima&background=ebf3ff&color=1952c4"
  },
  {
    id: "USR-002",
    name: "Nuha",
    email: "nuha@example.com",
    role: "Owner",
    status: "Active",
    joined: "Feb 05, 2026",
    avatar: "https://ui-avatars.com/api/?name=Nuha&background=e8f7ec&color=10b981"
  },
  {
    id: "USR-003",
    name: "Fazil",
    email: "fazil@example.com",
    role: "Tenant",
    status: "Banned",
    joined: "Mar 20, 2026",
    avatar: "https://ui-avatars.com/api/?name=Fazil&background=fee2e2&color=ef4444"
  },
  {
    id: "USR-004",
    name: "Naja",
    email: "naja@example.com",
    role: "Owner",
    status: "Locked",
    joined: "Apr 10, 2026",
    avatar: "https://ui-avatars.com/api/?name=Naja&background=fef3c7&color=d97706"
  },
  {
    id: "USR-005",
    name: "Farha",
    email: "farha@example.com",
    role: "Tenant",
    status: "Active",
    joined: "May 01, 2026",
    avatar: "https://ui-avatars.com/api/?name=Farha&background=f3e8ff&color=9333ea"
  }
];

const ManageUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const handleAction = (id, newStatus) => {
    setUsers(prev => 
      prev.map(user => user.id === id ? { ...user, status: newStatus } : user)
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Ban accounts, resolve disputes, and assist locked-out users.</p>
          </div>
          <Link to="/admin-dashboard">
            <button className="px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-xl shadow-sm transition-all text-sm">
              Admin Dashboard
            </button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[#e2e8f0]/60 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f4f9] border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-[#64748b]">Filter:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#f0f4f9] border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Tenant">Tenants</option>
              <option value="Owner">Owners</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#475569] text-xs uppercase tracking-wider border-b border-[#e2e8f0]/60">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#64748b]">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-[#e2e8f0]" />
                          <div>
                            <p className="text-sm font-bold text-[#0f172a]">{user.name}</p>
                            <p className="text-xs text-[#64748b]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          user.role === 'Owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                          user.status === 'Banned' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-green-500' : 
                            user.status === 'Banned' ? 'bg-red-500' :
                            'bg-orange-500'
                          }`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#64748b]">
                        {user.joined}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {user.status === 'Banned' ? (
                          <button 
                            onClick={() => handleAction(user.id, 'Active')}
                            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-lg text-xs transition-colors"
                          >
                            Unban
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction(user.id, 'Banned')}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg text-xs transition-colors"
                          >
                            Ban
                          </button>
                        )}

                        {user.status === 'Locked' && (
                          <button 
                            onClick={() => handleAction(user.id, 'Active')}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg text-xs transition-colors"
                          >
                            Unlock
                          </button>
                        )}
                        
                        <button className="px-3 py-1.5 bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold rounded-lg text-xs transition-colors">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-[#e2e8f0]/60 flex justify-between items-center text-sm">
            <span className="text-[#64748b]">Showing {filteredUsers.length} users</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748b] transition-colors" disabled>&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1952c4] text-white font-semibold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#0f172a] font-medium transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748b] transition-colors">&gt;</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ManageUsers;
