import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">1,240</div>
              <div className="text-xs font-semibold text-[#64748b]">Total Listings</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">+24 this week</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#e8f7ec] text-[#10b981] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">8,430</div>
              <div className="text-xs font-semibold text-[#64748b]">Registered Users</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">+156 this week</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">342</div>
              <div className="text-xs font-semibold text-[#64748b]">Active Bookings</div>
              <div className="text-xs font-bold text-[#f59e0b] mt-1">94 pending</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center text-2xl font-bold">
              LKR 
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">LKR 2.4M</div>
              <div className="text-xs font-semibold text-[#64748b]">Platform Revenue</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">+18% this month</div>
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e2e8f0] mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'users' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800 border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Users
          </button>
          <button 
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'listings' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800 border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Listings
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'reports' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800 border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Reports
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Platform Growth Chart */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60 flex flex-col h-[380px]">
                <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Platform Growth (2025)</h3>
                <div className="flex-grow flex items-end justify-between px-4 pb-2 relative">
                  <div className="absolute bottom-6 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                  <div className="absolute bottom-20 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                  <div className="absolute bottom-36 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                  <div className="absolute bottom-52 left-4 right-4 border-b border-dashed border-[#e2e8f0]"></div>
                  
                  {[
                    { month: 'Jan', h: 'h-16' },
                    { month: 'Feb', h: 'h-24' },
                    { month: 'Mar', h: 'h-28' },
                    { month: 'Apr', h: 'h-28' },
                    { month: 'May', h: 'h-36' },
                    { month: 'Jun', h: 'h-40' },
                    { month: 'Jul', h: 'h-48' }
                  ].map((bar, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 z-10 w-1/8 flex-1 px-1">
                      <div className={`w-full max-w-[60px] bg-gradient-to-t from-[#2563eb] to-[#60a5fa] rounded-t-lg ${bar.h}`}></div>
                      <div className="text-[11px] font-semibold text-slate-400">{bar.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60">
                <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Recent Activity</h3>
                
                <div className="space-y-6">
                  
                  <div className="flex items-start justify-between pb-6 border-b border-[#e2e8f0]/60">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold text-[#0f172a]">New listing submitted</div>
                        <div className="text-sm text-[#64748b]">BlueSky Residences 2 — Quezon City</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#94a3b8]">2 min ago</span>
                  </div>

                  <div className="flex items-start justify-between pb-6 border-b border-[#e2e8f0]/60">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold text-[#0f172a]">User reported</div>
                        <div className="text-sm text-[#64748b]">Fake listing — owner ID #4823</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#94a3b8]">15 min ago</span>
                  </div>

                  <div className="flex items-start justify-between pb-6 border-b border-[#e2e8f0]/60">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold text-[#0f172a]">New registration</div>
                        <div className="text-sm text-[#64748b]">Student: Maria Santos, UST</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#94a3b8]">1 hr ago</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold text-[#0f172a]">Booking completed</div>
                        <div className="text-sm text-[#64748b]">Metro Haven — Room 2A</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#94a3b8]">3 hrs ago</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60">
                <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] px-5 py-4 rounded-xl transition-colors border-none cursor-pointer text-left">
                    <svg className="w-5 h-5 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    <span className="font-bold text-[#0f172a] text-sm">Approve Pending Listings</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] px-5 py-4 rounded-xl transition-colors border-none cursor-pointer text-left">
                    <svg className="w-5 h-5 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <span className="font-bold text-[#0f172a] text-sm">Review Flagged Users</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] px-5 py-4 rounded-xl transition-colors border-none cursor-pointer text-left">
                    <svg className="w-5 h-5 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-bold text-[#0f172a] text-sm">Handle Reports</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-4 bg-[#f1f5f9] hover:bg-[#e2e8f0] px-5 py-4 rounded-xl transition-colors border-none cursor-pointer text-left">
                    <svg className="w-5 h-5 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <span className="font-bold text-[#0f172a] text-sm">View Analytics</span>
                  </button>
                </div>
              </div>

              {/* System Status */}
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
                    <span className="text-[#64748b] font-semibold text-[15px]">Storage</span>
                    <span className="text-[#10b981] font-bold text-[15px]">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b] font-semibold text-[15px]">Payments</span>
                    <span className="text-[#f59e0b] font-bold text-[15px]">Degraded</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Users Area */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e2e8f0]/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-sm font-medium placeholder-slate-400"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-[#f0f4f9] text-[#64748b] text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-5 rounded-tl-3xl">USER</th>
                      <th className="px-6 py-5">ROLE</th>
                      <th className="px-6 py-5">UNIVERSITY</th>
                      <th className="px-6 py-5">STATUS</th>
                      <th className="px-6 py-5">JOINED</th>
                      <th className="px-6 py-5 rounded-tr-3xl">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] font-medium text-[#0f172a]">
                    
                    {/* Row 1 */}
                    <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">J</div>
                          <span className="font-bold">Juan Dela Cruz</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-[#f3e8ff] text-[#9333ea] px-3 py-1.5 rounded-full text-xs font-bold">Student</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">UP Diliman</td>
                      <td className="px-6 py-5">
                        <span className="bg-[#e8f7ec] text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">active</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">Jan 2025</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center hover:bg-[#d8e5f8] transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">M</div>
                          <span className="font-bold">Maria Santos</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-[#f3e8ff] text-[#9333ea] px-3 py-1.5 rounded-full text-xs font-bold">Student</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">UST</td>
                      <td className="px-6 py-5">
                        <span className="bg-[#e8f7ec] text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">active</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">Feb 2025</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center hover:bg-[#d8e5f8] transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">R</div>
                          <span className="font-bold">Roberto Cruz</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-[#ebf3ff] text-[#1952c4] px-3 py-1.5 rounded-full text-xs font-bold">Owner</span>
                      </td>
                      <td className="px-6 py-5 text-[#94a3b8]">—</td>
                      <td className="px-6 py-5">
                        <span className="bg-[#ebf3ff] text-[#1952c4] px-3 py-1.5 rounded-full text-xs font-bold">verified</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">Nov 2024</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center hover:bg-[#d8e5f8] transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">C</div>
                          <span className="font-bold">Carmelita Reyes</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-[#ebf3ff] text-[#1952c4] px-3 py-1.5 rounded-full text-xs font-bold">Owner</span>
                      </td>
                      <td className="px-6 py-5 text-[#94a3b8]">—</td>
                      <td className="px-6 py-5">
                        <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-xs font-bold">pending</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">Jun 2025</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center hover:bg-[#d8e5f8] transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 5 */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm shrink-0">J</div>
                          <span className="font-bold">Jose Mendoza</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-[#ebf3ff] text-[#1952c4] px-3 py-1.5 rounded-full text-xs font-bold">Owner</span>
                      </td>
                      <td className="px-6 py-5 text-[#94a3b8]">—</td>
                      <td className="px-6 py-5">
                        <span className="bg-[#e8f7ec] text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">active</span>
                      </td>
                      <td className="px-6 py-5 text-[#64748b]">Mar 2025</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center hover:bg-[#d8e5f8] transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Listings Area */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Listing 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" alt="BlueSky Residences" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">BlueSky Residences</h3>
                <div className="text-[13px] font-medium text-[#64748b] mb-6">Diliman, Quezon City • Maria Santos</div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[15px] font-extrabold text-[#1952c4]">LKR 4,500/mo</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#0f172a]">
                    <span className="text-[#f59e0b]">★</span> 4.8
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Listing 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" alt="Tranquil Lodge" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Tranquil Lodge</h3>
                <div className="text-[13px] font-medium text-[#64748b] mb-6">Sampaloc, Manila • Carmelita Reyes</div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[15px] font-extrabold text-[#1952c4]">LKR 3,800/mo</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#0f172a]">
                    <span className="text-[#f59e0b]">★</span> 4.5
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Listing 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
              <div className="h-48 bg-[#d8e5f8] relative">
                <div className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Full</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Metro Haven</h3>
                <div className="text-[13px] font-medium text-[#64748b] mb-6">Taft Avenue, Manila • Roberto Cruz</div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[15px] font-extrabold text-[#1952c4]">LKR 6,200/mo</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#0f172a]">
                    <span className="text-[#f59e0b]">★</span> 4.9
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Listing 4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800" alt="Scholars' Den" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Scholars' Den</h3>
                <div className="text-[13px] font-medium text-[#64748b] mb-6">España Blvd, Manila • Jose Mendoza</div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[15px] font-extrabold text-[#1952c4]">LKR 3,200/mo</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#0f172a]">
                    <span className="text-[#f59e0b]">★</span> 4.3
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Listing 5 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800" alt="Lakeside Suites" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Lakeside Suites</h3>
                <div className="text-[13px] font-medium text-[#64748b] mb-6">Calamba, Laguna • Ana Villanueva</div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[15px] font-extrabold text-[#1952c4]">LKR 2,900/mo</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#0f172a]">
                    <span className="text-[#f59e0b]">★</span> 4.6
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Listing 6 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1e52d15461?auto=format&fit=crop&q=80&w=800" alt="Sunrise Apartments" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Sunrise Apartments</h3>
                <div className="text-[13px] font-medium text-[#64748b] mb-6">Katipunan Ave, QC • Patricia Gomez</div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[15px] font-extrabold text-[#1952c4]">LKR 7,500/mo</div>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#0f172a]">
                    <span className="text-[#f59e0b]">★</span> 4.7
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify
                  </button>
                  <button className="py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Reports Area */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            
            {/* Report 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-start gap-6 relative">
              <div className="absolute top-6 right-6 flex items-center gap-4">
                <span className="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold">high</span>
                <span className="text-[#64748b] text-[13px] font-semibold">15 min ago</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1 pr-40">
                <h3 className="text-[20px] font-extrabold text-[#0f172a] mb-1">Fake Listing</h3>
                <div className="text-[13px] font-semibold text-[#60a5fa] mb-3">
                  <span className="text-[#64748b]">By:</span> Student: Maria R. <span className="text-[#64748b]">• Target:</span> Happy Stay Dorm, Sampaloc
                </div>
                <p className="text-[#475569] text-[15px] font-medium mb-6">User claims photos are stolen and price/location is misrepresented.</p>
                
                <div className="flex items-center gap-3">
                  <button className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Investigate</button>
                  <button className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Remove Listing</button>
                  <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Dismiss</button>
                </div>
              </div>
            </div>

            {/* Report 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-start gap-6 relative">
              <div className="absolute top-6 right-6 flex items-center gap-4">
                <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold">medium</span>
                <span className="text-[#64748b] text-[13px] font-semibold">2 hrs ago</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1 pr-40">
                <h3 className="text-[20px] font-extrabold text-[#0f172a] mb-1">Inappropriate Photos</h3>
                <div className="text-[13px] font-semibold text-[#60a5fa] mb-3">
                  <span className="text-[#64748b]">By:</span> Student: Jose T. <span className="text-[#64748b]">• Target:</span> Green Residences, Taft
                </div>
                <p className="text-[#475569] text-[15px] font-medium mb-6">Submitted photos do not match the described property.</p>
                
                <div className="flex items-center gap-3">
                  <button className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Investigate</button>
                  <button className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Remove Listing</button>
                  <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Dismiss</button>
                </div>
              </div>
            </div>

            {/* Report 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-start gap-6 relative">
              <div className="absolute top-6 right-6 flex items-center gap-4">
                <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold">low</span>
                <span className="text-[#64748b] text-[13px] font-semibold">1 day ago</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1 pr-40">
                <h3 className="text-[20px] font-extrabold text-[#0f172a] mb-1">Price Mismatch</h3>
                <div className="text-[13px] font-semibold text-[#60a5fa] mb-3">
                  <span className="text-[#64748b]">By:</span> Student: Ana M. <span className="text-[#64748b]">• Target:</span> Blue Haven Apt., Katipunan
                </div>
                <p className="text-[#475569] text-[15px] font-medium mb-6">Listed price differs from actual quoted price by owner.</p>
                
                <div className="flex items-center gap-3">
                  <button className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Investigate</button>
                  <button className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Remove Listing</button>
                  <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Dismiss</button>
                </div>
              </div>
            </div>

            {/* Report 4 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-start gap-6 relative">
              <div className="absolute top-6 right-6 flex items-center gap-4">
                <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold">medium</span>
                <span className="text-[#64748b] text-[13px] font-semibold">2 days ago</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1 pr-40">
                <h3 className="text-[20px] font-extrabold text-[#0f172a] mb-1">Unresponsive Owner</h3>
                <div className="text-[13px] font-semibold text-[#60a5fa] mb-3">
                  <span className="text-[#64748b]">By:</span> Student: Carlo L. <span className="text-[#64748b]">• Target:</span> Scholar's Inn, España
                </div>
                <p className="text-[#475569] text-[15px] font-medium mb-6">Owner has not responded to 3 booking inquiries for over 7 days.</p>
                
                <div className="flex items-center gap-3">
                  <button className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Investigate</button>
                  <button className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Remove Listing</button>
                  <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer border-none">Dismiss</button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
