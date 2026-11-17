import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OwnerTopBar from '../components/OwnerTopBar';
import OwnerBookingManager from '../components/OwnerBookingManager';
import { getOwnerBookings, getMyListings } from '../services/api';

// Manage Reservations: the owner's full booking list with search and a
// property filter. Approving, declining, cancelling, recording arrival /
// leaving and confirming the cash payment all happen in OwnerBookingManager.

const bookingCode = (id) => `BF-BKG-${String(id).padStart(6, '0')}`;

const ManageReservations = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [resData, propData] = await Promise.all([getOwnerBookings(), getMyListings()]);
        setBookings(resData.bookings || []);
        setProperties(propData.listings || []);
      } catch (err) {
        console.error('Failed to fetch reservations data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const shown = bookings.filter((b) => {
    const matchesProperty = !selectedPropertyId || String(b.listing_id) === String(selectedPropertyId);
    const matchesSearch = !q
      || (b.seeker_name || '').toLowerCase().includes(q)
      || (b.seeker_email || '').toLowerCase().includes(q)
      || bookingCode(b.booking_id).toLowerCase().includes(q)
      || String(b.booking_id) === q;
    return matchesProperty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <OwnerTopBar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <Link to="/owner-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Manage Reservations</h1>
          <p className="text-white/60 mt-1 text-[15px]">
            Review requests, record when students arrive and leave, confirm cash payments and cancel bookings.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#1A1A1A] p-4 rounded-[20px] shadow-sm border border-[#333] mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search by student name, email or Booking ID..."
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
              {properties.map((prop) => (
                <option key={prop.listing_id} value={prop.listing_id}>{prop.title}</option>
              ))}
            </select>
          </div>
        </div>

        <OwnerBookingManager bookings={shown} setBookings={setBookings} loading={loading} showPayment showCode />
      </main>
    </div>
  );
};

export default ManageReservations;
