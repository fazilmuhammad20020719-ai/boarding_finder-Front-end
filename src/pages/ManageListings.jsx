import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MOCK_LISTINGS = [
  {
    id: "LST-5091",
    title: "Luxury Loft in City Center",
    owner: "Muslima",
    address: "123 Main St, Apt 4B, Cityville",
    price: 1500,
    type: "Apartment",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    submittedAt: "2 hours ago"
  },
  {
    id: "LST-5092",
    title: "Cozy Student Room Near Campus",
    owner: "Nuha",
    address: "45 College Ave, Room 12",
    price: 450,
    type: "Private Room",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    submittedAt: "5 hours ago"
  },
  {
    id: "LST-5093",
    title: "Spacious Family Home with Garden",
    owner: "Fazil",
    address: "789 Oak Lane, Suburbia",
    price: 2200,
    type: "House",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    submittedAt: "2 days ago"
  },
  {
    id: "LST-5094",
    title: "Budget Shared Room",
    owner: "Naja",
    address: "101 Budget St, Apt 2",
    price: 200,
    type: "Shared Room",
    status: "Rejected",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    submittedAt: "3 days ago"
  }
];

const ManageListings = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [listings, setListings] = useState(MOCK_LISTINGS);

  const tabs = ['Pending', 'Approved', 'Rejected'];

  const filteredListings = listings.filter(listing => listing.status === activeTab);

  const handleAction = (id, newStatus) => {
    setListings(prev => 
      prev.map(listing => listing.id === id ? { ...listing, status: newStatus } : listing)
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Listing Approvals</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Review new property submissions for quality control before they go live.</p>
          </div>
          <Link to="/admin-dashboard">
            <button className="px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-xl shadow-sm transition-all text-sm">
              Admin Dashboard
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e2e8f0]/80 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab
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

        {/* Listings Grid */}
        <div className="space-y-6">
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-[#e2e8f0]/60 shadow-sm">
              <div className="w-16 h-16 bg-[#f0f4f9] text-[#94a3b8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1">No {activeTab.toLowerCase()} listings</h3>
              <p className="text-[#64748b]">There are no property submissions in this category right now.</p>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto relative">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0f172a] shadow-sm">
                    {listing.type}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h2 className="text-xl font-bold text-[#0f172a] line-clamp-1">{listing.title}</h2>
                      <span className="text-lg font-black text-[#1952c4] whitespace-nowrap">
                        ${listing.price}<span className="text-sm text-[#64748b] font-medium">/mo</span>
                      </span>
                    </div>
                    
                    <p className="text-[#475569] text-sm mb-4 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {listing.address}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#f0f4f9] rounded-xl p-3">
                        <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-0.5">Owner</p>
                        <p className="text-sm font-semibold text-[#0f172a] truncate">{listing.owner}</p>
                      </div>
                      <div className="bg-[#f0f4f9] rounded-xl p-3">
                        <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-0.5">Submitted</p>
                        <p className="text-sm font-semibold text-[#0f172a] truncate">{listing.submittedAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#e2e8f0]/60">
                    {activeTab === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleAction(listing.id, 'Approved')}
                          className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
                        >
                          Approve Listing
                        </button>
                        <button 
                          onClick={() => handleAction(listing.id, 'Rejected')}
                          className="px-6 py-2 bg-white border border-[#e2e8f0] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[#475569] font-semibold rounded-xl shadow-sm transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(activeTab === 'Approved' || activeTab === 'Rejected') && (
                      <button 
                        onClick={() => handleAction(listing.id, 'Pending')}
                        className="px-6 py-2 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-semibold rounded-xl shadow-sm transition-colors text-sm"
                      >
                        Revert to Pending
                      </button>
                    )}
                    <button className="px-6 py-2 ml-auto bg-[#ebf3ff] hover:bg-[#dbe7fe] text-[#1952c4] font-semibold rounded-xl transition-colors text-sm">
                      Review Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default ManageListings;
