import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_BOOKINGS = [
  {
    id: "BF-2026-0021260",
    propertyId: 2,
    propertyName: "BlueSky Residences",
    location: "Colombo 03",
    status: "pending",
    moveInDate: "TBD",
    durationMonths: 6,
    totalPrice: 94500,
    bookingDate: "July 5, 2026",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    ownerName: "Roberto Cruz"
  },
  {
    id: "BF-2025-0010931",
    propertyId: 5,
    propertyName: "Tranquil Lodge",
    location: "Nugegoda",
    status: "active",
    moveInDate: "Jan 15, 2026",
    durationMonths: 12,
    totalPrice: 149500,
    bookingDate: "Jan 1, 2026",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    ownerName: "Sarah de Silva"
  },
  {
    id: "BF-2024-0098412",
    propertyId: 1,
    propertyName: "Metro Haven",
    location: "Katubedda, Moratuwa",
    status: "completed",
    moveInDate: "Aug 01, 2024",
    durationMonths: 12,
    totalPrice: 240500,
    bookingDate: "July 20, 2024",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600",
    ownerName: "Metro Group"
  },
  {
    id: "BF-2024-0081023",
    propertyId: 6,
    propertyName: "Scholars' Den",
    location: "Katubedda, Moratuwa",
    status: "cancelled",
    moveInDate: "Sep 01, 2024",
    durationMonths: 6,
    totalPrice: 66500,
    bookingDate: "Aug 15, 2024",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
    ownerName: "Ajith Perera"
  }
];

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) {}
    return 2;
  })();

  const filterBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(b => b.status === 'pending');
      case 'active':
        return bookings.filter(b => b.status === 'active');
      case 'completed':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const displayedBookings = filterBookings();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1 rounded-full text-xs font-bold border border-[#fde68a]/60 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse"></div>Pending Review</span>;
      case 'active':
        return <span className="bg-[#e8f7ec] text-[#10b981] px-3 py-1 rounded-full text-xs font-bold border border-[#a7f3d0]/60 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>Active Stay</span>;
      case 'completed':
        return <span className="bg-[#f4f7f9] text-[#64748b] px-3 py-1 rounded-full text-xs font-bold border border-[#e2e8f0]/80">Completed</span>;
      case 'cancelled':
        return <span className="bg-[#fef2f2] text-[#ef4444] px-3 py-1 rounded-full text-xs font-bold border border-[#fecaca]/60">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 md:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">My Bookings</h1>
        <p className="text-[#64748b] font-medium text-sm mb-8">Manage your boarding requests, active stays, and past history.</p>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-[#e2e8f0]/60 w-fit">
          {[
            { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'pending').length },
            { id: 'active', label: 'Active', count: bookings.filter(b => b.status === 'active').length },
            { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
            { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap border-none ${
                activeTab === tab.id 
                  ? 'bg-[#1952c4] text-white shadow-sm' 
                  : 'bg-transparent text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#f4f7f9] text-[#94a3b8]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {displayedBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#e2e8f0]/60 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#f4f7f9] rounded-2xl flex items-center justify-center text-[#94a3b8] mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">No {activeTab} bookings</h3>
              <p className="text-[#64748b] text-sm max-w-xs mx-auto mb-6">
                You don't have any bookings in this category right now.
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => navigate('/search')}
                  className="px-6 py-2.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors cursor-pointer border-none text-sm shadow-sm"
                >
                  Explore Properties
                </button>
              )}
            </div>
          ) : (
            displayedBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60 hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row">
                  
                  {/* Property Image */}
                  <div className="sm:w-64 h-48 sm:h-auto bg-slate-100 relative flex-shrink-0 cursor-pointer overflow-hidden" onClick={() => navigate(`/property/${booking.propertyId}`)}>
                    <img src={booking.image} alt={booking.propertyName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 
                          className="text-lg font-extrabold text-[#0f172a] hover:text-[#1952c4] cursor-pointer transition-colors"
                          onClick={() => navigate(`/property/${booking.propertyId}`)}
                        >
                          {booking.propertyName}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-0.5">Ref No.</div>
                          <div className="text-sm font-bold text-[#0f172a] bg-[#f4f7f9] px-2 py-1 rounded-lg">{booking.id}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm text-[#64748b] font-medium mb-5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {booking.location}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f4f7f9] p-4 rounded-2xl mb-5">
                        <div>
                          <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Move In</div>
                          <div className="text-[13px] font-bold text-[#0f172a]">{booking.moveInDate}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Duration</div>
                          <div className="text-[13px] font-bold text-[#0f172a]">{booking.durationMonths} Months</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Booked On</div>
                          <div className="text-[13px] font-bold text-[#0f172a]">{booking.bookingDate}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total</div>
                          <div className="text-[13px] font-bold text-[#1952c4]">LKR {booking.totalPrice.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-[#e2e8f0]/80 pt-4 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-[10px]">
                          {booking.ownerName.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-[#475569]">Contact {booking.ownerName}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        {booking.status === 'pending' && (
                          <button className="px-4 py-2 bg-white border border-[#e2e8f0] hover:border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-lg transition-colors cursor-pointer text-xs">
                            Cancel Request
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button 
                            onClick={() => navigate('/write-review')}
                            className="px-4 py-2 bg-white border border-[#e2e8f0] hover:border-[#1952c4] hover:bg-[#ebf3ff] text-[#1952c4] font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Leave Review
                          </button>
                        )}
                        {booking.status === 'active' && (
                          <button className="px-4 py-2 bg-white border border-[#e2e8f0] hover:border-[#1952c4] hover:bg-[#ebf3ff] text-[#1952c4] font-bold rounded-lg transition-colors cursor-pointer text-xs">
                            Request Maintenance
                          </button>
                        )}
                        <button className="px-4 py-2 bg-[#f4f7f9] hover:bg-[#e2e8f0] text-[#0f172a] font-bold rounded-lg transition-colors cursor-pointer text-xs border-none">
                          View Details
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MyBookings;
