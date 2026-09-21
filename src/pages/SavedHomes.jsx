import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSavedListings, removeSavedListing } from '../services/api';

const SavedHomesPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const fetchSavedListings = async () => {
    try {
      const data = await getSavedListings();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch saved listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (id, e) => {
    e.stopPropagation();
    try {
      await removeSavedListing(id);
      setListings((prev) => prev.filter(l => l.listing_id !== id));
    } catch (error) {
      console.error("Failed to remove saved listing:", error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
        <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={listings.length} />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading saved homes...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={listings.length} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-10">

        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Boarding Houses</h1>
            <p className="text-white/50 text-sm mt-1">Here are all the properties you saved for consideration.</p>
          </div>
          <div className="flex items-center gap-3">
            {listings.length > 0 && (
              <Link
                to="/compare"
                className="px-5 py-3 bg-[#111] border border-[#333] hover:bg-[#222] text-white font-bold text-sm rounded-full transition-all shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Compare ({Math.min(listings.length, 3)})
              </Link>
            )}
            <Link
              to="/home"
              className="px-5 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold text-sm rounded-full transition-all shadow-sm flex items-center gap-1.5"
            >
              ← Back to Search
            </Link>
          </div>
        </div>

        {/* Content */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              let amenitiesList = [];
              if (Array.isArray(listing.amenities)) {
                amenitiesList = listing.amenities;
              } else if (typeof listing.amenities === 'string') {
                try {
                  const parsed = JSON.parse(listing.amenities);
                  if (Array.isArray(parsed)) {
                    amenitiesList = parsed;
                  } else if (typeof parsed === 'object' && parsed !== null) {
                    amenitiesList = Object.keys(parsed).filter(key => parsed[key]);
                  }
                } catch (e) {
                  amenitiesList = listing.amenities ? listing.amenities.split(',') : [];
                }
              }
              if (!Array.isArray(amenitiesList)) amenitiesList = [];
              const displayImage = listing.image_urls && listing.image_urls.length > 0
                ? (listing.image_urls[0].startsWith('http') ? listing.image_urls[0] : `http://localhost:5000${listing.image_urls[0]}`)
                : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600"; // fallback image

              return (
                <div
                  key={listing.listing_id}
                  onClick={() => navigate(`/property/${listing.listing_id}`)}
                  className="bg-[#1A1A1A] rounded-[24px] overflow-hidden border border-[#333] hover:border-[#FACC15]/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer relative"
                >
                  {/* Photo Overlay */}
                  <div className="h-52 w-full relative overflow-hidden bg-black">
                    <img
                      src={displayImage}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Bottom Image Badges */}
                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <span className="bg-[#FACC15] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        LKR {Number(listing.price).toLocaleString()}/mo
                      </span>
                    </div>

                    {/* Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleUnlike(listing.listing_id, e)}
                      className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white hover:bg-slate-50 shadow-md flex items-center justify-center transition-all border-none cursor-pointer"
                    >
                      <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#FACC15] transition-colors line-clamp-1 mb-2">
                        {listing.title}
                      </h3>

                      <div className="flex items-center justify-between text-[13px] text-white/50 mb-4 font-semibold">
                        <span>📍 {listing.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {amenitiesList.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-[#111] border border-[#333] text-white/70 text-[11px] font-semibold px-2.5 py-1 rounded-md"
                          >
                            {typeof amenity === 'string' ? amenity.trim() : JSON.stringify(amenity)}
                          </span>
                        ))}
                        {amenitiesList.length > 4 && (
                          <span className="bg-[#111] border border-[#333] text-white/70 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                            +{amenitiesList.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="border-t border-[#333] my-4"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#FACC15] hover:underline flex items-center gap-1">
                          View details ➔
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1A1A1A] rounded-[32px] p-16 text-center shadow-sm border border-[#333]">
            <span className="text-6xl block mb-5">❤️</span>
            <h3 className="text-xl font-bold text-white">No saved homes yet</h3>
            <p className="text-white/50 mt-2 max-w-sm mx-auto mb-8">Browse the listings in the search dashboard and click the heart icon to save them here.</p>
            <Link
              to="/home"
              className="px-8 py-3.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold text-sm rounded-full transition-all shadow-md inline-block"
            >
              Explore Boarding Houses
            </Link>
          </div>
        )}

      </main>
    </div>
  );
};

export default SavedHomesPage;
