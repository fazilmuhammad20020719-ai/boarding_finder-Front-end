import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MOCK_USERS = [
  {
    id: "USR-001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    role: "Tenant",
    status: "Active",
    joined: "Jan 12, 2026",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=ebf3ff&color=1952c4"
  },
  {
    id: "USR-002",
    name: "Maria Garcia",
    email: "m.garcia@example.com",
    role: "Owner",
    status: "Active",
    joined: "Feb 05, 2026",
    avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=e8f7ec&color=10b981"
  },
  {
    id: "USR-003",
    name: "James Smith",
    email: "james.s@example.com",
    role: "Tenant",
    status: "Banned",
    joined: "Mar 20, 2026",
    avatar: "https://ui-avatars.com/api/?name=James+Smith&background=fee2e2&color=ef4444"
  },
  {
    id: "USR-004",
    name: "Linda Lee",
    email: "linda.l@example.com",
    role: "Owner",
    status: "Locked",
    joined: "Apr 10, 2026",
    avatar: "https://ui-avatars.com/api/?name=Linda+Lee&background=fef3c7&color=d97706"
  },
  {
    id: "USR-005",
    name: "Robert Brown",
    email: "rbrown@example.com",
    role: "Tenant",
    status: "Active",
    joined: "May 01, 2026",
    avatar: "https://ui-avatars.com/api/?name=Robert+Brown&background=f3e8ff&color=9333ea"
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-white/60">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#222] transition-colors">
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
                          user.role === 'Owner' ? 'bg-purple-500/20 text-purple-400' : 'bg-[#1952c4]/20 text-[#60a5fa]'
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
                        {user.status === 'Banned' ? (
                          <button 
                            onClick={() => handleAction(user.id, 'Active')}
                            className="px-3 py-1.5 bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer"
                          >
                            Unban
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction(user.id, 'Banned')}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer"
                          >
                            Ban
                          </button>
                        )}

                        {user.status === 'Locked' && (
                          <button 
                            onClick={() => handleAction(user.id, 'Active')}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 font-semibold rounded-lg text-xs transition-colors border-none cursor-pointer"
                          >
                            Unlock
                          </button>
                        )}
                        
                        <button className="px-3 py-1.5 bg-[#111] hover:bg-[#222] border border-[#333] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-[#333] flex justify-between items-center text-sm">
            <span className="text-white/60">Showing {filteredUsers.length} users</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#222] text-white/60 transition-colors border-none cursor-pointer bg-transparent" disabled>&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FACC15] text-black font-semibold border-none cursor-pointer">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#222] text-white font-medium transition-colors border-none cursor-pointer bg-transparent">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#222] text-white/60 transition-colors border-none cursor-pointer bg-transparent">&gt;</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ManageUsers;
