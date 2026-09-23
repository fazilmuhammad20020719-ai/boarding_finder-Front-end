import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyListings, getCalendarBlocks, addCalendarBlock, removeCalendarBlock } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CalendarManagement = () => {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [syncStatus, setSyncStatus] = useState('Not Connected');
  const [blocks, setBlocks] = useState([]);

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Date selection state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      fetchBlocks(selectedPropertyId);
    } else {
      setBlocks([]);
    }
  }, [selectedPropertyId]);

  const fetchProperties = async () => {
    try {
      const data = await getMyListings();
      setProperties(data.listings || []);
      if (data.listings && data.listings.length > 0) {
        setSelectedPropertyId(data.listings[0].listing_id);
      }
    } catch (err) {
      console.error("Failed to fetch properties", err);
    }
  };

  const fetchBlocks = async (propertyId) => {
    try {
      const data = await getCalendarBlocks(propertyId);
      setBlocks(data.blocks || []);
    } catch (err) {
      console.error("Failed to fetch calendar blocks", err);
    }
  };

  const handleBlockDates = async () => {
    if (!selectedPropertyId || !manualStartDate || !manualEndDate) {
      alert("Please select start and end dates.");
      return;
    }
    if (new Date(manualStartDate) > new Date(manualEndDate)) {
      alert("Start date must be before end date.");
      return;
    }

    try {
      await addCalendarBlock(selectedPropertyId, { start_date: manualStartDate, end_date: manualEndDate });
      fetchBlocks(selectedPropertyId);
      setManualStartDate('');
      setManualEndDate('');
    } catch (err) {
      console.error("Failed to block dates", err);
      alert(err.message || "Failed to block dates");
    }
  };

  const handleUnblockDate = async (blockId) => {
    if (!selectedPropertyId || !blockId) return;
    try {
      await removeCalendarBlock(selectedPropertyId, blockId);
      fetchBlocks(selectedPropertyId);
    } catch (err) {
      console.error("Failed to unblock dates", err);
      alert(err.message || "Failed to unblock dates");
    }
  };

  // Calendar logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getBlockForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`;
    const checkDate = new Date(dateStr);

    return blocks.find(block => {
      const start = new Date(block.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(block.end_date);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  const handleDayClick = (day) => {
    const block = getBlockForDate(day);
    if (block && block.reason === 'manual') {
      if (window.confirm(`Unblock manually blocked dates from ${new Date(block.start_date).toLocaleDateString()} to ${new Date(block.end_date).toLocaleDateString()}?`)) {
        handleUnblockDate(block.id);
      }
    } else if (block && block.reason === 'booking') {
      alert("This date is blocked due to an approved booking.");
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      {/* Top Bar */}
      <header className="bg-black text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b border-[#333]">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Owner Dashboard</div>
            <div className="text-sm font-extrabold">{user?.name || "Roberto Cruz"}</div>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-2 justify-center flex-1">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            My Listings
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Bookings
          </button>
          <button
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-[#FACC15] text-black shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Calendar
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Messages
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Students
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Maintenance
          </button>
          <button
            onClick={() => navigate('/earnings')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Earnings
          </button>
        </div>

        <div className="flex items-center justify-end w-1/4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/90 hover:text-[#FACC15] font-semibold transition-colors cursor-pointer bg-transparent border-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

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
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="px-4 py-3 bg-[#111] border border-[#333] rounded-xl shadow-sm text-sm font-bold text-white focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer"
            >
              {properties.length === 0 && <option value="">No properties found</option>}
              {properties.map(prop => (
                <option key={prop.listing_id} value={prop.listing_id}>
                  {prop.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side: Calendar Grid */}
          <div className="w-full lg:w-2/3 bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{monthName} {year}</h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 border border-[#333] bg-[#111] rounded-xl hover:bg-[#222] transition-colors text-white/60 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={nextMonth} className="p-2 border border-[#333] bg-[#111] rounded-xl hover:bg-[#222] transition-colors text-white/60 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold text-white/40 uppercase tracking-wider">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty slots before start day */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-xl bg-[#111] border border-[#333]/30"></div>
              ))}

              {/* Days of Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const block = getBlockForDate(day);
                const isBlocked = !!block;
                const isManual = block?.reason === 'manual';

                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-xl border flex flex-col p-2 cursor-pointer transition-colors ${isBlocked
                        ? (isManual ? 'bg-red-500/10 border-red-500/30 hover:border-red-500' : 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500')
                        : 'bg-[#111] border-[#333] hover:border-[#FACC15] hover:bg-[#FACC15]/10'
                      }`}
                  >
                    <span className={`text-sm font-bold ${isBlocked ? (isManual ? 'text-red-500' : 'text-orange-500') : 'text-white'}`}>{day}</span>
                    {isBlocked && (
                      <span className={`mt-auto text-[10px] font-semibold truncate ${isManual ? 'text-red-500' : 'text-orange-500'}`}>
                        {isManual ? 'Blocked' : 'Booked'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4 border-t border-[#333] pt-6">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Manual Override</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className="px-3 py-2 bg-[#111] border border-[#333] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 flex-1"
                  />
                  <span className="text-white/60 self-center">to</span>
                  <input
                    type="date"
                    value={manualEndDate}
                    onChange={(e) => setManualEndDate(e.target.value)}
                    className="px-3 py-2 bg-[#111] border border-[#333] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 flex-1"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2 shrink-0">
                <button
                  onClick={handleBlockDates}
                  disabled={!selectedPropertyId}
                  className="px-4 py-2.5 bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-colors text-sm border-none cursor-pointer disabled:opacity-50"
                >
                  Block Dates
                </button>
              </div>
            </div>
            <p className="text-xs text-white/40 mt-4 italic">Click on a manually blocked date in the calendar to unblock it.</p>
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
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Google Calendar</p>
                    <p className="text-[11px] text-white/60 font-medium mt-0.5">{syncStatus}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer" onClick={() => alert("Calendar sync coming soon!")}>
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
                <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer" onClick={() => alert("Calendar sync coming soon!")}>
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
                      value={`https://api.boardingfinder.com/ical/export/${selectedPropertyId || 'default'}.ics`}
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
                    <button className="px-3 text-black font-bold text-xs bg-[#FACC15] hover:bg-[#EAB308] transition-colors cursor-pointer border-none" onClick={() => alert("iCal import coming soon!")}>Import</button>
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
