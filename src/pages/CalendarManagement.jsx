import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const CalendarManagement = () => {
  const [selectedProperty, setSelectedProperty] = useState('Sunset Apartment - Unit A');
  const [syncStatus, setSyncStatus] = useState('Not Connected');
  
  // Basic mock calendar state for demo
  const daysInMonth = 31;
  const startDay = 3; // Wednesday start
  const mockBlockedDates = [12, 13, 14, 25, 26, 27, 28];
  
  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
             <Link to="/owner-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors mb-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back to Dashboard
             </Link>
             <h1 className="text-3xl font-extrabold tracking-tight">Calendar & Availability</h1>
             <p className="text-white/60 mt-1 text-[15px]">Manage blocked dates and sync your calendar to avoid double bookings.</p>
          </div>
          
          <div>
            <select 
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-4 py-3 bg-[#111] border border-[#333] rounded-xl shadow-sm text-sm font-bold text-white focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer"
            >
              <option>Sunset Apartment - Unit A</option>
              <option>Oceanview Studio</option>
              <option>Downtown Loft</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Calendar Grid */}
          <div className="w-full lg:w-2/3 bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">August 2026</h2>
              <div className="flex gap-2">
                <button className="p-2 border border-[#333] bg-[#111] rounded-xl hover:bg-[#222] transition-colors text-white/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="p-2 border border-[#333] bg-[#111] rounded-xl hover:bg-[#222] transition-colors text-white/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold text-white/40 uppercase tracking-wider">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            {/* Calendar Grid (Mock) */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty slots before start day */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-xl bg-[#111] border border-[#333]/30"></div>
              ))}
              
              {/* Days of Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isBlocked = mockBlockedDates.includes(day);
                return (
                  <div 
                    key={day} 
                    className={`aspect-square rounded-xl border flex flex-col p-2 cursor-pointer transition-colors ${
                      isBlocked 
                        ? 'bg-red-500/10 border-red-500/30 hover:border-red-500' 
                        : 'bg-[#111] border-[#333] hover:border-[#FACC15] hover:bg-[#FACC15]/10'
                    }`}
                  >
                    <span className={`text-sm font-bold ${isBlocked ? 'text-red-500' : 'text-white'}`}>{day}</span>
                    {isBlocked && (
                      <span className="mt-auto text-[10px] font-semibold text-red-500 truncate">Blocked</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4 border-t border-[#333] pt-6">
               <div className="flex-1">
                 <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Manual Override</label>
                 <div className="flex flex-col sm:flex-row gap-2">
                   <input type="date" className="px-3 py-2 bg-[#111] border border-[#333] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 flex-1" />
                   <span className="text-white/60 self-center">to</span>
                   <input type="date" className="px-3 py-2 bg-[#111] border border-[#333] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 flex-1" />
                 </div>
               </div>
               <div className="flex items-end gap-2 shrink-0">
                 <button className="px-4 py-2.5 bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-colors text-sm border-none cursor-pointer">Block</button>
                 <button className="px-4 py-2.5 bg-[#10b981]/20 text-[#10b981] font-bold rounded-xl border border-[#10b981]/30 hover:bg-[#10b981]/30 transition-colors text-sm border-none cursor-pointer">Unblock</button>
               </div>
            </div>
          </div>

          {/* Right Side: Sync Controls */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Sync Status Card */}
            <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6">
              <h3 className="font-bold text-white mb-6">Calendar Integrations</h3>
              
              {/* Google Calendar */}
              <div className="flex items-center justify-between p-4 bg-[#111] border border-[#333] rounded-2xl mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#222] rounded-xl shadow-sm flex items-center justify-center p-2 shrink-0">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Google Calendar</p>
                    <p className="text-[11px] text-white/60 font-medium mt-0.5">{syncStatus}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                  Connect
                </button>
              </div>

              {/* Airbnb / Other platforms */}
              <div className="flex items-center justify-between p-4 bg-[#111] border border-[#333] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF5A5F] text-white rounded-xl shadow-sm flex items-center justify-center p-2 shrink-0 font-black">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Airbnb</p>
                    <p className="text-[11px] text-white/60 font-medium mt-0.5">Not Connected</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                  Connect
                </button>
              </div>
            </div>

            {/* iCal Links */}
            <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6">
              <h3 className="font-bold text-white mb-4">iCal Sync Links</h3>
              <p className="text-sm text-white/60 mb-6">Use these links to manually sync your availability with other unsupported platforms.</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Export Calendar
                  </label>
                  <div className="flex bg-[#111] border border-[#333] rounded-xl overflow-hidden">
                    <input 
                      type="text" 
                      readOnly 
                      value="https://api.boardingfinder.com/ical/export/982a-bc..." 
                      className="w-full px-3 py-2.5 bg-transparent text-xs text-white outline-none"
                    />
                    <button className="px-3 text-[#FACC15] font-bold text-xs bg-[#333]/50 hover:bg-[#333] transition-colors border-l border-[#333] cursor-pointer">Copy</button>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1.5">Paste this link into other platforms (e.g. Booking.com) to block out dates booked here.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4 4m4-4v12" /></svg>
                    Import Calendar
                  </label>
                  <div className="flex bg-[#111] border border-[#333] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FACC15]/20 transition-shadow">
                    <input 
                      type="text" 
                      placeholder="Paste iCal URL here..." 
                      className="w-full px-3 py-2.5 bg-transparent text-xs text-white outline-none placeholder-white/40"
                    />
                    <button className="px-3 text-black font-bold text-xs bg-[#FACC15] hover:bg-[#EAB308] transition-colors cursor-pointer border-none">Import</button>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1.5">Dates blocked on external platforms will automatically be blocked here.</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default CalendarManagement;
