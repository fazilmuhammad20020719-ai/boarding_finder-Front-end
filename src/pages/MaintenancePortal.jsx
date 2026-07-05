import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MOCK_TICKETS = [
  {
    id: "TKT-081",
    title: "Leaking faucet in bathroom",
    category: "Plumbing",
    urgency: "Medium",
    status: "In Progress",
    date: "Jul 02, 2026",
    description: "The cold water faucet in the master bathroom is constantly dripping."
  },
  {
    id: "TKT-079",
    title: "AC not cooling properly",
    category: "HVAC",
    urgency: "High",
    status: "Resolved",
    date: "Jun 15, 2026",
    description: "Air conditioner is running but blowing warm air."
  }
];

const MaintenancePortal = () => {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    urgency: 'Low',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: `TKT-0${Math.floor(Math.random() * 90) + 10}`, // Random ID
      title: formData.title,
      category: formData.category,
      urgency: formData.urgency,
      status: "Pending",
      date: "Today",
      description: formData.description
    };
    
    setTickets([newTicket, ...tickets]);
    setShowForm(false);
    setFormData({ title: '', category: 'Plumbing', urgency: 'Low', description: '' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch(urgency) {
      case 'High': return <span className="text-red-500 font-bold">!!!</span>;
      case 'Medium': return <span className="text-orange-500 font-bold">!!</span>;
      case 'Low': return <span className="text-blue-500 font-bold">!</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Maintenance Portal</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Submit repair tickets and track the status of your maintenance requests.</p>
          </div>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Request
            </button>
          )}
        </div>

        {/* New Request Form */}
        {showForm && (
          <div className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 p-6 md:p-8 mb-8 animate-fade-in-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0f172a]">Submit a New Request</h2>
              <button onClick={() => setShowForm(false)} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">Brief Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Broken AC in living room"
                  className="w-full px-4 py-3 bg-[#f0f4f9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1952c4]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#f0f4f9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1952c4]/20 outline-none cursor-pointer"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC</option>
                    <option>Appliances</option>
                    <option>General Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">Urgency</label>
                  <select 
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#f0f4f9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1952c4]/20 outline-none cursor-pointer"
                  >
                    <option value="Low">Low - Whenever possible</option>
                    <option value="Medium">Medium - Need it fixed soon</option>
                    <option value="High">High - Emergency / Safety issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">Description</label>
                <textarea 
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Please describe the issue in detail..."
                  className="w-full px-4 py-3 bg-[#f0f4f9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1952c4]/20 outline-none resize-none"
                ></textarea>
              </div>

              {/* Photo Upload Mock */}
              <div>
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">Attach Photos (Optional)</label>
                <div className="border-2 border-dashed border-[#cbd5e1] rounded-[16px] p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <svg className="mx-auto h-8 w-8 text-[#94a3b8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-[#1952c4]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#64748b] mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]/60">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-bold rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Tickets List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0f172a] mb-4">Your Requests</h2>
          
          {tickets.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-[#e2e8f0]/60 shadow-sm">
              <p className="text-[#64748b]">You have no maintenance requests.</p>
            </div>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-[#e2e8f0]/60 flex flex-col md:flex-row gap-4 md:items-center justify-between hover:border-[#1952c4]/30 transition-colors">
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1952c4] bg-[#ebf3ff] px-2 py-0.5 rounded-md">
                      {ticket.category}
                    </span>
                    <span className="text-xs font-bold text-[#94a3b8]">ID: {ticket.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#0f172a] mb-1">{ticket.title}</h3>
                  <p className="text-sm text-[#475569] line-clamp-1">{ticket.description}</p>
                </div>

                <div className="flex flex-col md:items-end gap-2 shrink-0 md:min-w-[150px]">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <p className="text-xs text-[#64748b] font-medium">Submitted: {ticket.date}</p>
                  <p className="text-xs text-[#64748b] font-medium flex items-center gap-1">
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
