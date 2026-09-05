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
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.seeker_name || 'Guest')}&background=ebf3ff&color=1952c4`,
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

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Reservations</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Review requests, accept or decline bookings, and manage upcoming stays.</p>
          </div>
          <Link to="/owner-dashboard">
            <button className="px-5 py-2.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-semibold rounded-xl shadow-sm transition-all text-sm">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e2e8f0]/80 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab
                  ? 'text-[#1952c4]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1952c4] rounded-t-md"></span>
              )}
            </button>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-[#e2e8f0]/60 shadow-sm">
              <div className="w-16 h-16 bg-[#f0f4f9] text-[#94a3b8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1">No {activeTab.toLowerCase()} reservations</h3>
              <p className="text-[#64748b]">You don't have any {activeTab.toLowerCase()} booking requests at the moment.</p>
            </div>
          ) : (
            filteredReservations.map((res) => (
              <div key={res.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-[#e2e8f0]/60 flex flex-col lg:flex-row gap-6 justify-between lg:items-center">

                {/* Tenant & Property Info */}
                <div className="flex items-start gap-4">
                  <img src={res.avatar} alt={res.tenant} className="w-12 h-12 rounded-full border border-[#e2e8f0]" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-[#0f172a]">{res.tenant}</h3>
                      <span className="text-xs font-semibold text-[#64748b] bg-[#f0f4f9] px-2 py-0.5 rounded-full">{res.displayId}</span>
                    </div>
                    <p className="text-[#475569] font-medium text-sm mb-1">{res.property}</p>
                    <p className="text-[#64748b] text-sm">
                      {res.guests} Guest{res.guests > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Dates & Price Info */}
                <div className="flex flex-col sm:flex-row gap-6 lg:gap-12">
                  <div>
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Dates</p>
                    <p className="text-sm font-semibold text-[#0f172a]">{res.checkIn} - {res.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Total Payout</p>
                    <p className="text-lg font-black text-[#10b981]">${res.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#e2e8f0]/60">
                  {activeTab === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleAction(res.id, 'Upcoming')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(res.id, 'Declined')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-white border border-[#e2e8f0] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[#475569] font-semibold rounded-xl shadow-sm transition-colors text-sm"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {activeTab === 'Upcoming' && (
                    <>
                      <Link to="/messages">
                        <button className="flex-1 lg:flex-none px-6 py-2.5 bg-[#ebf3ff] hover:bg-[#dbe7fe] text-[#1952c4] font-semibold rounded-xl transition-colors text-sm">
                          Message
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAction(res.id, 'Cancelled')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-white border border-[#e2e8f0] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[#475569] font-semibold rounded-xl shadow-sm transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {activeTab === 'Past' && (
                    <button className="flex-1 lg:flex-none px-6 py-2.5 bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold rounded-xl transition-colors text-sm">
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
