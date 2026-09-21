import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { getOwnerBookings, updateBookingStatus } from '../services/api';

const ManageReservations = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Pending', 'Upcoming', 'Past'];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getOwnerBookings();
        if (response.bookings) {
          const mapped = response.bookings.map(b => {
            const moveIn = new Date(b.move_in_date);
            const moveOut = new Date(moveIn);
            moveOut.setMonth(moveIn.getMonth() + b.duration_months);

            let status = 'Past';
            if (b.status === 'pending') status = 'Pending';
            if (b.status === 'approved') status = 'Upcoming';

            return {
              id: b.booking_id,
              displayId: `BF-BKG-${b.booking_id.toString().padStart(6, '0')}`,
              tenant: b.seeker_name || 'Guest',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.seeker_name || 'Guest')}&background=1A1A1A&color=FACC15`,
              property: b.title,
              checkIn: moveIn.toLocaleDateString(),
              checkOut: moveOut.toLocaleDateString(),
              guests: 1,
              totalPrice: parseFloat(b.total_amount) || 0,
              status: status
            };
          });
          setReservations(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch reservations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter(res => res.status === activeTab);

  const handleAction = async (id, newStatus) => {
    try {
      // Map UI status back to backend status
      let backendStatus = '';
      if (newStatus === 'Upcoming') backendStatus = 'approved';
      if (newStatus === 'Declined') backendStatus = 'rejected';
      if (newStatus === 'Cancelled') backendStatus = 'cancelled';

      await updateBookingStatus(id, backendStatus);

      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, status: newStatus === 'Declined' || newStatus === 'Cancelled' ? 'Past' : newStatus } : res)
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    }
  };

  const handleGenerateLease = async (bookingId) => {
    try {
      const { generateLease } = await import('../services/api');
      await generateLease(bookingId);
      alert("Lease generated successfully and is ready for the student to sign!");
    } catch (err) {
      alert(err.message || "Failed to generate lease. Maybe one already exists?");
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Reservations</h1>
            <p className="text-white/60 mt-1 text-[15px]">Review requests, accept or decline bookings, and manage upcoming stays.</p>
          </div>
          <Link to="/owner-dashboard">
            <button className="px-5 py-2.5 bg-[#111] border border-[#333] hover:bg-[#222] text-white font-semibold rounded-xl shadow-sm transition-all text-sm cursor-pointer">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#333] mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors relative bg-transparent border-none cursor-pointer ${activeTab === tab
                  ? 'text-[#FACC15]'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FACC15] rounded-t-md"></span>
              )}
            </button>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-[24px] p-12 text-center border border-[#333] shadow-sm">
              <div className="w-16 h-16 bg-[#111] text-white/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No {activeTab.toLowerCase()} reservations</h3>
              <p className="text-white/60">You don't have any {activeTab.toLowerCase()} booking requests at the moment.</p>
            </div>
          ) : (
            filteredReservations.map((res) => (
              <div key={res.id} className="bg-[#1A1A1A] p-6 rounded-[24px] shadow-sm border border-[#333] flex flex-col lg:flex-row gap-6 justify-between lg:items-center">

                {/* Tenant & Property Info */}
                <div className="flex items-start gap-4">
                  <img src={res.avatar} alt={res.tenant} className="w-12 h-12 rounded-full border border-[#333]" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-white">{res.tenant}</h3>
                      <span className="text-xs font-semibold text-white/60 bg-[#111] px-2 py-0.5 rounded-full">{res.displayId}</span>
                    </div>
                    <p className="text-white/80 font-medium text-sm mb-1">{res.property}</p>
                    <p className="text-white/60 text-sm">
                      {res.guests} Guest{res.guests > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Dates & Price Info */}
                <div className="flex flex-col sm:flex-row gap-6 lg:gap-12">
                  <div>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Dates</p>
                    <p className="text-sm font-semibold text-white">{res.checkIn} - {res.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Total Payout</p>
                    <p className="text-lg font-black text-[#FACC15]">${res.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#333]">
                  {activeTab === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleAction(res.id, 'Upcoming')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-semibold rounded-xl shadow-sm transition-colors text-sm border-none cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(res.id, 'Declined')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-[#111] border border-[#333] hover:bg-red-500/20 hover:text-red-500 hover:border-red-500 text-white/80 font-semibold rounded-xl shadow-sm transition-colors text-sm cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {activeTab === 'Upcoming' && (
                    <>
                      <button
                        onClick={() => handleGenerateLease(res.id)}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-xl shadow-sm transition-colors text-sm border-none cursor-pointer"
                      >
                        Generate Lease
                      </button>
                      <Link to="/messages">
                        <button className="flex-1 lg:flex-none px-6 py-2.5 bg-[#FACC15]/20 hover:bg-[#FACC15]/30 text-[#FACC15] font-semibold rounded-xl transition-colors text-sm border-none cursor-pointer">
                          Message
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAction(res.id, 'Cancelled')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-[#111] border border-[#333] hover:bg-red-500/20 hover:text-red-500 hover:border-red-500 text-white/80 font-semibold rounded-xl shadow-sm transition-colors text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {activeTab === 'Past' && (
                    <button className="flex-1 lg:flex-none px-6 py-2.5 bg-[#111] hover:bg-[#222] text-white/80 font-semibold rounded-xl transition-colors text-sm border-none cursor-pointer">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default ManageReservations;
