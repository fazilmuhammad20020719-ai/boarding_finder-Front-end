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
      <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
        <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={listings.length} />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading saved homes...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={listings.length} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-10">

        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Saved Boarding Houses</h1>
            <p className="text-slate-500 text-sm mt-1">Here are all the properties you saved for consideration.</p>
          </div>
          <Link
            to="/home"
            className="px-5 py-3 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold text-sm rounded-full transition-all shadow-sm flex items-center gap-1.5"
          >
            ← Back to Search
          </Link>
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
                  className="bg-white rounded-[24px] overflow-hidden border border-[#e2e8f0]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer relative"
                >
                  {/* Photo Overlay */}
                  <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={displayImage}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Bottom Image Badges */}
                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <span className="bg-[#1952c4] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
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
                      <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#1952c4] transition-colors line-clamp-1 mb-2">
                        {listing.title}
                      </h3>

                      <div className="flex items-center justify-between text-[13px] text-slate-500 mb-4 font-semibold">
                        <span>📍 {listing.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {amenitiesList.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-[#f0f4f9] text-[#475569] text-[11px] font-semibold px-2.5 py-1 rounded-md"
                          >
                            {typeof amenity === 'string' ? amenity.trim() : JSON.stringify(amenity)}
                          </span>
                        ))}
                        {amenitiesList.length > 4 && (
                          <span className="bg-[#f0f4f9] text-[#475569] text-[11px] font-semibold px-2.5 py-1 rounded-md">
                            +{amenitiesList.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="border-t border-[#e2e8f0]/60 my-4"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#1952c4] hover:underline flex items-center gap-1">
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
          <div className="bg-white rounded-[32px] p-16 text-center shadow-sm border border-[#e2e8f0]/60">
            <span className="text-6xl block mb-5">❤️</span>
            <h3 className="text-xl font-bold text-slate-800">No saved homes yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto mb-8">Browse the listings in the search dashboard and click the heart icon to save them here.</p>
            <Link
              to="/home"
              className="px-8 py-3.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold text-sm rounded-full transition-all shadow-md inline-block"
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
