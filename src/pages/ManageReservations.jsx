import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OwnerTopBar from '../components/OwnerTopBar';
import { getOwnerBookings, updateBookingStatus, getMyListings } from '../services/api';
import { PaymentBadge, ConfirmCashButton } from '../components/CashPayment';
import { useAuth } from '../context/AuthContext';

const ManageReservations = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [reservations, setReservations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const tabs = ['Pending', 'Upcoming', 'Past'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resData, propData] = await Promise.all([
        getOwnerBookings(),
        getMyListings()
      ]);

      if (propData.listings) {
        setProperties(propData.listings);
      }

      if (resData.bookings) {
        const mapped = resData.bookings.map(b => {
          const moveIn = new Date(b.move_in_date);
          const moveOut = new Date(moveIn);
          moveOut.setMonth(moveIn.getMonth() + b.duration_months);

          let status = 'Past';
          if (b.status === 'pending') status = 'Pending';
          if (b.status === 'approved') status = 'Upcoming';
          // 'cancelled' or 'rejected' go to Past automatically in UI

          return {
            id: b.booking_id,
            displayId: `BF-BKG-${b.booking_id.toString().padStart(6, '0')}`,
            tenant: b.seeker_name || 'Guest',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.seeker_name || 'Guest')}&background=1A1A1A&color=FACC15`,
            property: b.title,
            propertyId: b.listing_id,
            checkIn: moveIn.toLocaleDateString(),
            checkOut: moveOut.toLocaleDateString(),
            guests: 1, // You might want to update this if you track guest count in the DB
            totalPrice: parseFloat(b.total_amount) || 0,
            status: status,
            leaseStatus: b.lease_status || null,
            // Fields the Cash on Move-in badge/button need
            payment: { booking_id: b.booking_id, status: b.status, payment_status: b.payment_status, paid_amount: b.paid_amount, paid_at: b.paid_at, price: b.price, security_deposit: b.security_deposit }
          };
        });
        setReservations(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch reservations data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAction = async (id, newStatus) => {
    try {
      // Map UI status back to backend status
      let backendStatus = '';
      if (newStatus === 'Upcoming') backendStatus = 'approved';
      if (newStatus === 'Declined') backendStatus = 'rejected';
      if (newStatus === 'Cancelled') backendStatus = 'cancelled';

      await updateBookingStatus(id, backendStatus);

      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, status: newStatus === 'Declined' || newStatus === 'Cancelled' ? 'Past' : newStatus, payment: { ...res.payment, status: backendStatus } } : res)
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.message || "Failed to update status."); // e.g. "This room is fully booked (8/8 beds taken)."
    }
  };

  const handleGenerateLease = async (bookingId) => {
    try {
      const { generateLease } = await import('../services/api');
      await generateLease(bookingId);
      setReservations(prev => prev.map(r => r.id === bookingId ? { ...r, leaseStatus: 'pending' } : r));
      alert("Lease generated successfully and is ready for the student to sign!");
    } catch (err) {
      alert(err.message || "Failed to generate lease. Maybe one already exists?");
    }
  };

  const handleExportCSV = () => {
    if (filteredReservations.length === 0) {
      alert("No reservations to export.");
      return;
    }

    const headers = ['Booking ID', 'Tenant', 'Property', 'Check In', 'Check Out', 'Total Price', 'Status'];
    const rows = filteredReservations.map(res => [
      res.displayId,
      `"${res.tenant}"`,
      `"${res.property}"`,
      res.checkIn,
      res.checkOut,
      res.totalPrice,
      res.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reservations_${activeTab.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter reservations based on active tab AND property dropdown AND search query
  const filteredReservations = reservations.filter(res => {
    const matchesTab = res.status === activeTab;
    const matchesProperty = selectedPropertyId ? res.propertyId.toString() === selectedPropertyId.toString() : true;
    const matchesSearch = searchQuery 
      ? res.tenant.toLowerCase().includes(searchQuery.toLowerCase()) || res.displayId.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    return matchesTab && matchesProperty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <OwnerTopBar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/owner-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Reservations</h1>
            <p className="text-white/60 mt-1 text-[15px]">Review requests, accept or decline bookings, and manage upcoming stays.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-[#111] border border-[#333] hover:bg-[#222] text-white font-semibold rounded-xl shadow-sm transition-all text-sm cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-[#FACC15]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Export to CSV
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#1A1A1A] p-4 rounded-[20px] shadow-sm border border-[#333] mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by student name or Booking ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] text-sm text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-3 border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20"
            />
          </div>
          <div className="w-full md:w-64 shrink-0">
            <select 
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer"
            >
              <option value="">All Properties</option>
              {properties.map(prop => (
                <option key={prop.listing_id} value={prop.listing_id}>
                  {prop.title}
                </option>
              ))}
            </select>
          </div>
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
          {loading ? (
             <div className="py-20 text-center">
               <div className="w-10 h-10 border-4 border-[#FACC15] border-t-transparent rounded-full animate-spin mx-auto"></div>
               <p className="mt-4 text-white/60 font-semibold text-sm">Loading reservations...</p>
             </div>
          ) : filteredReservations.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-[24px] p-12 text-center border border-[#333] shadow-sm">
              <div className="w-16 h-16 bg-[#111] text-white/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No {activeTab.toLowerCase()} reservations found</h3>
              <p className="text-white/60">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            filteredReservations.map((res) => (
              <div key={res.id} className="bg-[#1A1A1A] p-6 rounded-[24px] shadow-sm border border-[#333] flex flex-col gap-5">

                {/* Top row: tenant info on the left, actions on the right */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                {/* Tenant & Property Info */}
                <div className="flex items-start gap-4 min-w-0">
                  <img src={res.avatar} alt={res.tenant} className="w-12 h-12 rounded-full border border-[#333]" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-white">{res.tenant}</h3>
                      <span className="text-xs font-semibold text-white/60 bg-[#111] px-2 py-0.5 rounded-full border border-[#333]">{res.displayId}</span>
                    </div>
                    <p className="text-[#FACC15] font-bold text-sm mb-1">{res.property}</p>
                    <p className="text-white/60 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {res.guests} Guest{res.guests > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center md:justify-end gap-3 shrink-0">
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
                      {res.leaseStatus ? (
                        <span className="flex-1 lg:flex-none px-6 py-2.5 bg-[#10b981]/15 text-[#10b981] font-semibold rounded-xl text-sm text-center">
                          {res.leaseStatus === 'signed' ? 'Lease signed' : 'Lease sent'}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleGenerateLease(res.id)}
                          className="flex-1 lg:flex-none px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-xl shadow-sm transition-colors text-sm border-none cursor-pointer"
                        >
                          Generate Lease
                        </button>
                      )}
                      <Link to="/messages">
                        <button className="flex-1 lg:flex-none px-6 py-2.5 bg-[#111] border border-[#333] hover:bg-white/10 text-white/90 font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                          Message
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAction(res.id, 'Cancelled')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 font-semibold rounded-xl shadow-sm transition-colors text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {activeTab === 'Past' && (
                    <button className="flex-1 lg:flex-none px-6 py-2.5 bg-[#111] hover:bg-[#222] border border-[#333] text-white/80 font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                      View Details
                    </button>
                  )}
                </div>
                </div>

                {/* Bottom row: dates, price and payment, in even columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5 border-t border-[#333]">
                  <div className="bg-[#111] px-4 py-3 rounded-xl border border-[#333]">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Stay Dates</p>
                    <p className="text-sm font-bold text-white whitespace-nowrap">{res.checkIn} - {res.checkOut}</p>
                  </div>
                  <div className="bg-[#111] px-4 py-3 rounded-xl border border-[#333]">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Booking value</p>
                    <p className="text-lg font-black text-[#FACC15] whitespace-nowrap">LKR {res.totalPrice.toLocaleString()}</p>
                  </div>
                  {res.payment?.status === 'approved' && (
                    <div className="bg-[#111] px-4 py-3 rounded-xl border border-[#333] flex flex-col items-start gap-2 sm:col-span-2 lg:col-span-1">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Move-in payment (cash)</p>
                      <PaymentBadge booking={res.payment} />
                      <ConfirmCashButton
                        booking={res.payment}
                        onChange={(u) => setReservations(prev => prev.map(r => r.id === res.id
                          ? { ...r, payment: { ...r.payment, payment_status: u.payment_status, paid_amount: u.paid_amount, paid_at: u.paid_at } } : r))}
                      />
                    </div>
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
