import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/listings/owner/mine', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        setListings(data.listings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Listings</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Manage your boarding houses and properties.</p>
          </div>
          <button
            onClick={() => navigate('/add-listing')}
            className="flex items-center gap-2 bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer border-none shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add New Listing
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1952c4]"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-[#e2e8f0]/60 shadow-sm">
            <div className="w-16 h-16 bg-[#ebf3ff] text-[#1952c4] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#0f172a] mb-1">No listings found</h3>
            <p className="text-[#64748b] mb-6">You haven't added any properties yet.</p>
            <button
              onClick={() => navigate('/add-listing')}
              className="bg-[#1952c4] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1546a8] transition-colors border-none cursor-pointer"
            >
              Add Your First Listing
            </button>
          </div>
        ) : (
          <>
            <div
              onClick={() => navigate('/add-listing')}
              className="w-full mb-8 bg-transparent rounded-3xl border-2 border-dashed border-[#cbd5e1] hover:border-[#1952c4] hover:bg-[#ebf3ff]/50 transition-all cursor-pointer py-8 flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-white text-slate-400 group-hover:text-[#1952c4] flex items-center justify-center transition-colors shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <span className="text-[16px] font-bold text-[#64748b] group-hover:text-[#1952c4] transition-colors">Add New Listing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.listing_id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
                  <div className="h-48 bg-slate-200 relative">
                    <img
                      src={(listing.image_urls && listing.image_urls.length > 0) ? listing.image_urls[0] : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800"}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-extrabold text-[#0f172a] mb-1 line-clamp-1">{listing.title}</h3>
                    <div className="text-sm font-medium text-[#64748b] mb-2 line-clamp-1">
                      {listing.location}
                    </div>
                    <div className="text-[17px] font-black text-[#1952c4] mb-4">
                      LKR {Number(listing.price).toLocaleString()} <span className="text-sm font-medium text-[#64748b]">/mo</span>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                      </button>
                      <button className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyListings;
