import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_LISTINGS = [
  {
    id: 1,
    name: "Metro Haven",
    university: "University of Moratuwa",
    location: "Katubedda, Moratuwa",
    price: 18500,
    rating: 4.9,
    reviews: 203,
    type: "studio_unit",
    gender: "mixed",
    amenities: ["Wifi", "Parking", "Gym", "Pool"],
    distance: "0.2 km",
    beds: 2,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600",
    description: "A secure studio unit located right next to the University of Moratuwa. Features top-tier student amenities including a swimming pool and modern fitness center.",
    mapCoords: { top: '35%', left: '28%' },
    isFullyBooked: true,
    liked: false
  },
  {
    id: 2,
    name: "BlueSky Residences",
    university: "University of Colombo",
    location: "Colombo 03",
    price: 13500,
    rating: 4.8,
    reviews: 142,
    type: "dormitory",
    gender: "mixed",
    amenities: ["Wifi", "Parking", "Laundry", "CCTV"],
    distance: "0.3 km",
    beds: 4,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    description: "A lively student community dormitory in Colombo 03. Fully managed with shared study spaces, laundry services, and high-security CCTV cameras.",
    mapCoords: { top: '48%', left: '55%' },
    isFullyBooked: false,
    liked: false
  },
  {
    id: 3,
    name: "Sunrise Apartments",
    university: "University of Kelaniya",
    location: "Kelaniya, Gampaha",
    price: 22500,
    rating: 4.7,
    reviews: 178,
    type: "studio_unit",
    gender: "mixed",
    amenities: ["Wifi", "Parking", "Gym", "CCTV"],
    distance: "0.1 km",
    beds: 1,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
    description: "A private studio room perfect for individuals wanting silent study spaces. Offers high-speed Wi-Fi and 24/7 CCTV surveillance near the campus.",
    mapCoords: { top: '75%', left: '38%' },
    isFullyBooked: false,
    liked: false
  },
  {
    id: 4,
    name: "Lakeside Suites",
    university: "University of Sri Jayewardenepura",
    location: "Nugegoda",
    price: 8500,
    rating: 4.6,
    reviews: 51,
    type: "dormitory",
    gender: "female",
    amenities: ["Wifi", "Meals", "Parking"],
    distance: "1.2 km",
    beds: 3,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600",
    description: "Cozy female-only shared dormitory suites in Galle. Overlooks scenic areas and includes daily home-cooked Sri Lankan meals in the rent.",
    mapCoords: { top: '22%', left: '70%' },
    isFullyBooked: false,
    liked: true
  },
  {
    id: 5,
    name: "Tranquil Lodge",
    university: "University of Colombo",
    location: "Colombo 07",
    price: 11500,
    rating: 4.5,
    reviews: 89,
    type: "boarding_house",
    gender: "female",
    amenities: ["Wifi", "Meals", "CCTV", "Curfew"],
    distance: "0.5 km",
    beds: 2,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    description: "A quiet, secure boarding house for girls in Nugegoda. High-speed Wi-Fi, healthy meals, safety CCTV, and standard student curfew policies are maintained.",
    mapCoords: { top: '28%', left: '42%' },
    isFullyBooked: false,
    liked: true
  },
  {
    id: 6,
    name: "Scholars' Den",
    university: "University of Moratuwa",
    location: "Katubedda, Moratuwa",
    price: 9500,
    rating: 4.3,
    reviews: 67,
    type: "boarding_house",
    gender: "male",
    amenities: ["Wifi", "CCTV", "Laundry"],
    distance: "0.8 km",
    beds: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
    description: "Affordable male-only boarding house near the University of Moratuwa. Ideal for students wanting a budget-friendly bedspace with laundry access.",
    mapCoords: { top: '55%', left: '68%' },
    isFullyBooked: false,
    liked: false
  }
];

const SavedHomesPage = () => {
  const [listings, setListings] = useState([]);

  const navigate = useNavigate();

  // Load listings from localStorage
  useEffect(() => {
    const localListings = localStorage.getItem('listings');
    if (localListings) {
      setListings(JSON.parse(localListings));
    } else {
      setListings(MOCK_LISTINGS);
      localStorage.setItem('listings', JSON.stringify(MOCK_LISTINGS));
    }
  }, []);

  // Sync back to localStorage when listings change
  const saveToLocal = (updated) => {
    setListings(updated);
    localStorage.setItem('listings', JSON.stringify(updated));
  };

  const handleUnlike = (id, e) => {
    e.stopPropagation();
    const updated = listings.map(l => l.id === id ? { ...l, liked: false } : l);
    saveToLocal(updated);
  };

  const savedListings = useMemo(() => {
    return listings.filter(l => l.liked);
  }, [listings]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={savedListings.length} />

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
        {savedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => navigate(`/property/${listing.id}`)}
                className="bg-white rounded-[24px] overflow-hidden border border-[#cbd5e1]/45 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.055)] hover:-translate-y-1.5 hover:border-[#1952c4]/30 transition-all duration-300 flex flex-col group cursor-pointer relative"
              >
                {/* Photo Overlay */}
                <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {listing.isFullyBooked && (
                    <div className="absolute inset-0 bg-[#0f172a]/45 backdrop-blur-[2px] flex items-center justify-center z-10">
                      <span className="bg-white text-slate-800 text-sm font-extrabold px-5 py-2 rounded-full shadow-lg uppercase tracking-wide">
                        Fully Booked
                      </span>
                    </div>
                  )}

                  {/* Bottom Image Badges */}
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="bg-[#1952c4] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      LKR {listing.price.toLocaleString()}/mo
                    </span>
                    <span className="bg-[#845ef7] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md capitalize">
                      {listing.gender}
                    </span>
                  </div>

                  {/* Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleUnlike(listing.id, e)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white hover:bg-slate-50 shadow-md flex items-center justify-center transition-all border-none cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#1952c4] uppercase tracking-wider mb-2 block truncate">
                      {listing.university}
                    </span>
                    <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#1952c4] transition-colors line-clamp-1 mb-2">
                      {listing.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-[13px] text-slate-500 mb-4 font-semibold">
                      <span>📍 {listing.location}</span>
                      <span className="text-[#1952c4] font-bold">📏 {listing.distance}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {listing.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f0f4f9] text-[#475569] text-[11px] font-semibold px-2.5 py-1 rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="border-t border-[#e2e8f0]/60 my-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 font-bold text-[13px] text-slate-700">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < Math.floor(listing.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                        ))}
                        <span className="text-[#0f172a] ml-1">{listing.rating}</span>
                      </div>

                      <span className="text-xs font-bold text-[#1952c4] hover:underline flex items-center gap-1">
                        View details ➔
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
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
