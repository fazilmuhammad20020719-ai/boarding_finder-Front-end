import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      {/* Top Bar */}
      <header className="bg-[#1e3a8a] text-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">Owner Dashboard</div>
            <div className="text-xl font-extrabold">Roberto Cruz</div>
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
            <div className="w-14 h-14 rounded-2xl bg-[#e8f7ec] text-[#10b981] flex items-center justify-center text-2xl font-bold">
              ₱
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">₱38,500</div>
              <div className="text-xs font-semibold text-[#64748b]">Monthly Revenue</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">+12% this month</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">12/15</div>
              <div className="text-xs font-semibold text-[#64748b]">Rooms Occupied</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">80% occupancy</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">4.7★</div>
              <div className="text-xs font-semibold text-[#64748b]">Average Rating</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">142 reviews</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div>
              <div className="text-[22px] font-black text-[#0f172a]">23</div>
              <div className="text-xs font-semibold text-[#64748b]">Inquiries</div>
              <div className="text-xs font-bold text-[#10b981] mt-1">8 unanswered</div>
            </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e2e8f0] mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold bg-transparent border-none cursor-pointer flex items-center gap-2 ${activeTab === 'overview' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 ${activeTab === 'listings' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800 border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            My Listings
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-bold bg-transparent cursor-pointer flex items-center gap-2 ${activeTab === 'bookings' ? 'text-[#1952c4] border-b-2 border-[#1952c4] border-solid' : 'text-slate-500 hover:text-slate-800 border-none'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Bookings
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60 flex flex-col min-h-[400px]">
              <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Revenue — Last 6 Months</h3>
              {/* Mock Chart Area */}
              <div className="flex-grow flex items-end justify-between px-4 pb-8 relative">
                <div className="absolute bottom-16 left-4 right-4 border-b border-dashed border-[#e2e8f0]/80"></div>
                <div className="absolute bottom-32 left-4 right-4 border-b border-dashed border-[#e2e8f0]/80"></div>
                <div className="absolute bottom-48 left-4 right-4 border-b border-dashed border-[#e2e8f0]/80"></div>
                
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-24"></div>
                  <div className="text-xs font-semibold text-slate-400">Jan</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-32"></div>
                  <div className="text-xs font-semibold text-slate-400">Feb</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-48"></div>
                  <div className="text-xs font-semibold text-slate-400">Mar</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-[#1952c4]/20 rounded-t-md h-40"></div>
                  <div className="text-xs font-semibold text-slate-400">Apr</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-56"></div>
                  <div className="text-xs font-semibold text-slate-400">May</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-[#1952c4] rounded-t-md h-64"></div>
                  <div className="text-xs font-semibold text-slate-400">Jun</div>
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60">
              <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Pending Requests</h3>
              
              <div className="space-y-4">
                
                {/* Request 1 */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm">
                      M
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0f172a]">Maria Reyes</div>
                      <div className="text-xs text-[#64748b]">Room 3A • Jul 1, 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center hover:bg-[#d1f0db] transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                {/* Request 2 */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0f172a]">Ana Cruz</div>
                      <div className="text-xs text-[#64748b]">Room 1C • Jul 8, 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center hover:bg-[#d1f0db] transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                {/* Request 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm">
                      C
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0f172a]">Carlo Lim</div>
                      <div className="text-xs text-[#64748b]">Room 2B • Jul 12, 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center hover:bg-[#d1f0db] transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* My Listings Area */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#64748b] font-medium">3 listings</span>
              <button className="flex items-center gap-2 bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer border-none shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Listing 1 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
                <div className="h-48 bg-slate-200 relative">
                  <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" alt="BlueSky Residences" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">BlueSky Residences</h3>
                  <div className="text-sm font-medium text-[#64748b] mb-6">₱4,500/mo • Dormitory</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </button>
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit
                    </button>
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Listing 2 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
                <div className="h-48 bg-slate-200 relative">
                  <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" alt="Tranquil Lodge" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Active</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Tranquil Lodge</h3>
                  <div className="text-sm font-medium text-[#64748b] mb-6">₱3,800/mo • Boarding House</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </button>
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit
                    </button>
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Listing 3 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
                <div className="h-48 bg-[#d8e5f8] relative flex items-center justify-center">
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Full</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">Metro Haven</h3>
                  <div className="text-sm font-medium text-[#64748b] mb-6">₱6,200/mo • Studio Unit</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View
                    </button>
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit
                    </button>
                    <button className="py-2 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Bookings Area */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#f0f4f9] text-[#64748b] text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-5 rounded-tl-3xl">STUDENT</th>
                    <th className="px-6 py-5">LISTING</th>
                    <th className="px-6 py-5">PERIOD</th>
                    <th className="px-6 py-5">STATUS</th>
                    <th className="px-6 py-5">AMOUNT</th>
                    <th className="px-6 py-5 rounded-tr-3xl">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] font-medium text-[#0f172a]">
                  {/* Row 1 */}
                  <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold">Maria Reyes</td>
                    <td className="px-6 py-5 text-[#64748b]">Room 3A</td>
                    <td className="px-6 py-5 text-[#64748b]">Jul-Dec 2025</td>
                    <td className="px-6 py-5">
                      <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-xs font-bold">pending</span>
                    </td>
                    <td className="px-6 py-5 font-bold text-[#1952c4]">₱4,500</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Approve</button>
                        <button className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none">Decline</button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold">Jose Santos</td>
                    <td className="px-6 py-5 text-[#64748b]">Room 2B</td>
                    <td className="px-6 py-5 text-[#64748b]">Aug 2025-Jan 2026</td>
                    <td className="px-6 py-5">
                      <span className="bg-[#e8f7ec] text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">active</span>
                    </td>
                    <td className="px-6 py-5 font-bold text-[#1952c4]">₱6,200</td>
                    <td className="px-6 py-5 text-[#94a3b8]">—</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold">Ana Cruz</td>
                    <td className="px-6 py-5 text-[#64748b]">Room 1C</td>
                    <td className="px-6 py-5 text-[#64748b]">Jul-Sep 2025</td>
                    <td className="px-6 py-5">
                      <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-xs font-bold">pending</span>
                    </td>
                    <td className="px-6 py-5 font-bold text-[#1952c4]">₱3,800</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Approve</button>
                        <button className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none">Decline</button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold">Lisa Tan</td>
                    <td className="px-6 py-5 text-[#64748b]">Room 4D</td>
                    <td className="px-6 py-5 text-[#64748b]">Jan-Jun 2025</td>
                    <td className="px-6 py-5">
                      <span className="bg-[#f1f5f9] text-[#64748b] px-3 py-1.5 rounded-full text-xs font-bold">completed</span>
                    </td>
                    <td className="px-6 py-5 font-bold text-[#1952c4]">₱4,500</td>
                    <td className="px-6 py-5 text-[#94a3b8]">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default OwnerDashboard;
