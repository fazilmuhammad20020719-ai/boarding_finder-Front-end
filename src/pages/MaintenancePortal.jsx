import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getStudentMaintenanceRequests, createMaintenanceRequest, getMyBookings } from '../services/api';

const MaintenancePortal = () => {
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    booking_id: '',
    title: '',
    category: 'Plumbing',
    urgency: 'Low',
    description: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, bookingsRes] = await Promise.all([
        getStudentMaintenanceRequests(),
        getMyBookings()
      ]);
      setTickets(ticketsRes || []);

      // Filter only active/approved bookings
      const activeBookings = (bookingsRes.bookings || []).filter(b => b.status === 'approved');
      setBookings(activeBookings);
      if (activeBookings.length > 0) {
        setFormData(prev => ({ ...prev, booking_id: activeBookings[0].booking_id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.booking_id) {
      alert("You need an active booking to submit a maintenance request.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMaintenanceRequest(formData);
      await fetchData();
      setShowForm(false);
      setFormData(prev => ({ ...prev, title: '', description: '' }));
      alert("Maintenance request submitted successfully.");
    } catch (err) {
      alert(err.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-500/20 text-orange-500';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400';
      case 'Resolved': return 'bg-[#10b981]/20 text-[#10b981]';
      default: return 'bg-[#333] text-white/60';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'High': return <span className="text-red-500 font-bold">!!!</span>;
      case 'Medium': return <span className="text-orange-400 font-bold">!!</span>;
      case 'Low': return <span className="text-blue-400 font-bold">!</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Maintenance Portal</h1>
            <p className="text-white/60 mt-1 text-[15px]">Submit repair tickets and track the status of your maintenance requests.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Request
            </button>
          )}
        </div>

        {/* New Request Form */}
        {showForm && (
          <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 md:p-8 mb-8 animate-fade-in-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Submit a New Request</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Select Property</label>
                <select
                  name="booking_id"
                  required
                  value={formData.booking_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl text-sm focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer"
                >
                  <option value="" disabled>Select active booking</option>
                  {bookings.map(b => (
                    <option key={b.booking_id} value={b.booking_id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Brief Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Broken AC in living room"
                  className="w-full px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl text-sm focus:ring-2 focus:ring-[#FACC15]/20 outline-none placeholder-white/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl text-sm focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC</option>
                    <option>Appliances</option>
                    <option>General Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Urgency</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl text-sm focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer"
                  >
                    <option value="Low">Low - Whenever possible</option>
                    <option value="Medium">Medium - Need it fixed soon</option>
                    <option value="High">High - Emergency / Safety issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Please describe the issue in detail..."
                  className="w-full px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl text-sm focus:ring-2 focus:ring-[#FACC15]/20 outline-none resize-none placeholder-white/40"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-[#111] border border-[#333] hover:bg-[#222] text-white/80 font-bold rounded-xl transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl shadow-sm transition-colors text-sm cursor-pointer border-none disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Tickets List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">Your Requests</h2>

          {loading ? (
            <div className="text-center p-8 text-white/40">Loading your requests...</div>
          ) : tickets.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-[24px] p-12 text-center border border-[#333] shadow-sm">
              <p className="text-white/40">You have no maintenance requests.</p>
            </div>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className="bg-[#1A1A1A] p-6 rounded-[24px] shadow-sm border border-[#333] flex flex-col md:flex-row gap-4 md:items-center justify-between hover:border-[#FACC15]/50 transition-colors">

                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-black bg-[#FACC15] px-2 py-0.5 rounded-md">
                      {ticket.category}
                    </span>
                    <span className="text-xs font-bold text-white/40">ID: {ticket.ticket_id}</span>
                    <span className="text-xs font-semibold text-white/60 bg-[#111] border border-[#333] px-2 rounded">{ticket.property_name}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{ticket.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-1">{ticket.description}</p>
                </div>

                <div className="flex flex-col md:items-end gap-2 shrink-0 md:min-w-[150px]">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <p className="text-xs text-white/60 font-medium">Submitted: {new Date(ticket.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-white/60 font-medium flex items-center gap-1">
                    Urgency: {getUrgencyIcon(ticket.urgency)} {ticket.urgency}
                  </p>
                </div>

              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default MaintenancePortal;
