import React, { useState, useMemo, useEffect } from 'react';
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
    university: "University of Ruhuna",
    location: "Galle",
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
    university: "University of Sri Jayewardenepura",
    location: "Nugegoda",
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

const HomePage = () => {
  const [listings, setListings] = useState(() => {
    const local = localStorage.getItem('listings');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return MOCK_LISTINGS;
      }
    }
    return MOCK_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('listings', JSON.stringify(listings));
  }, [listings]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'map'
  const [selectedListing, setSelectedListing] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price_asc', 'price_desc'
  
  // Sidebar Filters States
  const [maxPrice, setMaxPrice] = useState(30000);
  const [genderFilter, setGenderFilter] = useState({
    male: false,
    female: false,
    mixed: false
  });
  const [typeFilter, setTypeFilter] = useState({
    dormitory: false,
    boarding_house: false,
    studio_unit: false
  });
  const [facilitiesFilter, setFacilitiesFilter] = useState({
    wifi: false,
    parking: false,
    laundry: false,
    meals: false,
    cctv: false,
    gym: false,
    pool: false
  });

  // Map interactive states
  const [hoveredMapListing, setHoveredMapListing] = useState(null);
  const [selectedMapListing, setSelectedMapListing] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Go back to Landing page
  };

  // Liked listings count for navbar
  const likedCount = useMemo(() => {
    return listings.filter(l => l.liked).length;
  }, [listings]);

  // Sorting & Filtering Logic
  const filteredListings = useMemo(() => {
    let result = listings.filter((listing) => {
      // Search Query
      const matchesSearch =
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Price
      const matchesPrice = listing.price <= maxPrice;

      // Gender
      const activeGenders = Object.keys(genderFilter).filter(k => genderFilter[k]);
      const matchesGender = activeGenders.length === 0 || activeGenders.includes(listing.gender);

      // Type
      const activeTypes = Object.keys(typeFilter).filter(k => typeFilter[k]);
      const matchesType = activeTypes.length === 0 || activeTypes.includes(listing.type);

      // Facilities
      const activeFacilities = Object.keys(facilitiesFilter).filter(k => facilitiesFilter[k]);
      const matchesFacilities = activeFacilities.every(facility => 
        listing.amenities.some(a => a.toLowerCase().includes(facility.toLowerCase()))
      );

      return matchesSearch && matchesPrice && matchesGender && matchesType && matchesFacilities;
    });

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [listings, searchQuery, maxPrice, genderFilter, typeFilter, facilitiesFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-8">
        
        {/* ===== TOP SEARCH & SORT BAR ===== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="flex items-center flex-grow bg-white p-2 rounded-[20px] shadow-sm border border-[#e2e8f0]/60 max-w-2xl w-full">
            <div className="flex items-center flex-grow px-3 gap-2">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, university, or location..."
                className="w-full py-2.5 bg-transparent text-slate-800 placeholder-[#94a3b8] focus:outline-none text-[15px]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort & View Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-5 py-3 rounded-full font-bold text-[13px] transition-all cursor-pointer ${
                sortBy === 'rating'
                  ? 'bg-[#1952c4] text-white shadow-sm border border-[#1952c4]'
                  : 'bg-white hover:bg-slate-50 text-[#475569] border border-[#e2e8f0]/80 shadow-sm'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setSortBy('price_asc')}
              className={`px-5 py-3 rounded-full font-bold text-[13px] transition-all cursor-pointer ${
                sortBy === 'price_asc'
                  ? 'bg-[#1952c4] text-white shadow-sm border border-[#1952c4]'
                  : 'bg-white hover:bg-slate-50 text-[#475569] border border-[#e2e8f0]/80 shadow-sm'
              }`}
            >
              Price ↑
            </button>
            <button
              onClick={() => setSortBy('price_desc')}
              className={`px-5 py-3 rounded-full font-bold text-[13px] transition-all cursor-pointer ${
                sortBy === 'price_desc'
                  ? 'bg-[#1952c4] text-white shadow-sm border border-[#1952c4]'
                  : 'bg-white hover:bg-slate-50 text-[#475569] border border-[#e2e8f0]/80 shadow-sm'
              }`}
            >
              Price ↓
            </button>
            <Link to="/map">
              <button
                className="px-5 py-3 bg-white hover:bg-slate-50 text-[#475569] border border-[#e2e8f0]/80 shadow-sm rounded-full font-bold text-[13px] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Map View
              </button>
            </Link>
          </div>
        </div>

        {/* ===== CONTENT BLOCK ===== */}
        {viewMode === 'list' ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT SIDEBAR FILTERS */}
            <aside className="w-full lg:w-[280px] bg-white rounded-[24px] p-6 border border-[#e2e8f0]/60 shadow-sm flex-shrink-0">
              <h3 className="text-xl font-bold text-[#0f172a] mb-6">Filters</h3>
              
              <div className="space-y-6">
                {/* Max Monthly Price */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-3 uppercase">
                    Max Monthly Price
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="30000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1952c4]"
                  />
                  <div className="flex justify-between items-center mt-2 text-[11px] font-bold text-slate-400">
                    <span>Rs. 5,000</span>
                    <span>Rs. 30,000</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-[#1952c4] font-extrabold text-sm">Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                <hr className="border-[#e2e8f0]/50" />

                {/* Gender Policy */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-3 uppercase">
                    Gender Policy
                  </label>
                  <div className="space-y-2.5">
                    {['Male', 'Female', 'Mixed'].map((g) => {
                      const key = g.toLowerCase();
                      return (
                        <label key={g} className="flex items-center gap-3 text-[14px] text-slate-600 font-semibold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={genderFilter[key]}
                            onChange={() => setGenderFilter({ ...genderFilter, [key]: !genderFilter[key] })}
                            className="w-4.5 h-4.5 rounded border-[#e2e8f0] text-[#1952c4] focus:ring-[#1952c4]/20 cursor-pointer"
                          />
                          {g}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-[#e2e8f0]/50" />

                {/* Type */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-3 uppercase">
                    Type
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { key: 'dormitory', label: 'Dormitory' },
                      { key: 'boarding_house', label: 'Boarding House' },
                      { key: 'studio_unit', label: 'Studio Unit' }
                    ].map((t) => (
                      <label key={t.key} className="flex items-center gap-3 text-[14px] text-slate-600 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={typeFilter[t.key]}
                          onChange={() => setTypeFilter({ ...typeFilter, [t.key]: !typeFilter[t.key] })}
                          className="w-4.5 h-4.5 rounded border-[#e2e8f0] text-[#1952c4] focus:ring-[#1952c4]/20 cursor-pointer"
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-[#e2e8f0]/50" />

                {/* Facilities */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-3 uppercase">
                    Facilities
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { key: 'wifi', label: 'WiFi', icon: '📶' },
                      { key: 'parking', label: 'Parking', icon: '🚗' },
                      { key: 'laundry', label: 'Laundry', icon: '🧺' },
                      { key: 'meals', label: 'Meals', icon: '🍽️' },
                      { key: 'cctv', label: 'CCTV', icon: '🛡️' },
                      { key: 'gym', label: 'Gym', icon: '🏋️' },
                      { key: 'pool', label: 'Pool', icon: '🏊' }
                    ].map((f) => (
                      <label key={f.key} className="flex items-center gap-3 text-[14px] text-slate-600 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={facilitiesFilter[f.key]}
                          onChange={() => setFacilitiesFilter({ ...facilitiesFilter, [f.key]: !facilitiesFilter[f.key] })}
                          className="w-4.5 h-4.5 rounded border-[#e2e8f0] text-[#1952c4] focus:ring-[#1952c4]/20 cursor-pointer"
                        />
                        <span className="text-base">{f.icon}</span>
                        <span>{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </aside>

            {/* RIGHT LISTINGS GRID */}
            <div className="flex-grow w-full">
              <div className="mb-6">
                <h3 className="font-extrabold text-[#0f172a] text-lg">
                  {filteredListings.length} {filteredListings.length === 1 ? 'boarding house' : 'boarding houses'} found
                </h3>
              </div>

              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredListings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => setSelectedListing(listing)}
                      className="bg-white rounded-[24px] overflow-hidden border border-[#e2e8f0]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer relative"
                    >
                      {/* Photo Overlay */}
                      <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                        <img
                          src={listing.image}
                          alt={listing.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Fully Booked Overlay */}
                        {listing.isFullyBooked && (
                          <div className="absolute inset-0 bg-[#0f172a]/45 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <span className="bg-white text-slate-800 text-sm font-extrabold px-5 py-2 rounded-full shadow-lg uppercase tracking-wide">
                              Fully Booked
                            </span>
                          </div>
                        )}

                        {/* Bottom Image Badges (Price / Gender) */}
                        <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                          <span className="bg-[#1952c4] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                            Rs. {listing.price.toLocaleString()}/mo
                          </span>
                          <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md capitalize ${
                            listing.gender === 'female'
                              ? 'bg-[#ea4335] text-white'
                              : listing.gender === 'male'
                              ? 'bg-[#4285f4] text-white'
                              : 'bg-[#845ef7] text-white'
                          }`}>
                            {listing.gender}
                          </span>
                        </div>

                        {/* Heart Like Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle liked status dynamically
                            setListings(listings.map(l => l.id === listing.id ? { ...l, liked: !l.liked } : l));
                          }}
                          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white hover:bg-slate-50 shadow-md flex items-center justify-center transition-transform hover:scale-105 border-none cursor-pointer"
                        >
                          <svg
                            className={`w-5 h-5 ${listing.liked ? 'text-red-500 fill-current' : 'text-slate-400'}`}
                            fill={listing.liked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2.2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                      </div>

                      {/* Details */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-bold text-[#1952c4] uppercase tracking-wider block truncate">
                              {listing.university}
                            </span>
                            <span className="bg-slate-100 text-[#475569] text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                              {listing.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#1952c4] transition-colors line-clamp-1 mb-2">
                            {listing.name}
                          </h3>
                          
                          {/* Distance & Location Info */}
                          <div className="flex items-center justify-between text-[13px] text-slate-500 mb-4 font-semibold">
                            <span className="truncate">📍 {listing.location}</span>
                            <span className="flex-shrink-0 text-[#1952c4] font-bold">📏 {listing.distance}</span>
                          </div>

                          {/* Amenities Badges */}
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

                        {/* Footer Rating */}
                        <div>
                          <div className="border-t border-[#e2e8f0]/60 my-4"></div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 font-bold text-[13px] text-slate-700">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < Math.floor(listing.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                              ))}
                              <span className="text-[#0f172a] ml-1">{listing.rating}</span>
                              <span className="text-slate-400 font-normal text-xs">({listing.reviews})</span>
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
                <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-[#e2e8f0]/60">
                  <span className="text-5xl block mb-4">🔍</span>
                  <h3 className="text-xl font-bold text-slate-800">No boarding houses matches filters</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ===== HIGH FIDELITY MAP VIEW ===== */
          <div className="flex flex-col lg:flex-row gap-6 bg-white p-4 rounded-[32px] shadow-md border border-[#e2e8f0]/60 overflow-hidden">
            {/* Map Mini Sidebar */}
            <div className="w-full lg:w-[35%] flex flex-col max-h-[550px] overflow-y-auto pr-2 gap-4">
              <div className="p-2">
                <h3 className="font-bold text-[#0f172a] text-lg">Houses in this Area</h3>
                <p className="text-xs text-slate-400 mt-0.5">{filteredListings.length} properties matches filters</p>
              </div>
              
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => {
                    setSelectedMapListing(listing);
                    setSelectedListing(listing);
                  }}
                  onMouseEnter={() => setHoveredMapListing(listing.id)}
                  onMouseLeave={() => setHoveredMapListing(null)}
                  className={`p-3 rounded-2xl border transition-all duration-200 flex gap-3 cursor-pointer ${
                    selectedMapListing?.id === listing.id
                      ? 'border-[#1952c4] bg-[#ebf3ff]/40 shadow-sm'
                      : 'border-[#e2e8f0]/60 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <h4 className="font-bold text-[14px] text-[#0f172a] truncate">{listing.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{listing.university}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-extrabold text-[#1952c4]">
                        Rs. {listing.price.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-0.5">
                        ⭐ {listing.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SVG/Custom Styled Interactive Map */}
            <div className="w-full lg:w-[65%] h-[400px] lg:h-[550px] rounded-[24px] bg-[#e8eff9] border border-[#e2e8f0] relative overflow-hidden shadow-inner flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full z-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
                {/* River */}
                <path d="M-50 150 C 200 180, 150 350, 600 450 L600 550 L-50 550 Z" fill="#b9d5fc" />
                {/* Roads */}
                <path d="M 50 -10 L 50 600 M 350 -10 L 350 600 M -10 120 L 600 120 M -10 380 L 600 380" stroke="white" strokeWidth="12" strokeLinecap="round" />
                <path d="M 50 -10 L 50 600 M 350 -10 L 350 600 M -10 120 L 600 120 M -10 380 L 600 380" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,5" />
                
                {/* University Shaded Zones */}
                <rect x="30" y="30" width="180" height="80" rx="10" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="40" y="55" fill="#15803d" className="text-[11px] font-bold">MORATUWA ZONE</text>
                
                <rect x="380" y="240" width="180" height="100" rx="10" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="390" y="265" fill="#1d4ed8" className="text-[11px] font-bold">COLOMBO ZONE</text>

                <rect x="260" y="10" width="150" height="80" rx="10" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="270" y="35" fill="#b45309" className="text-[11px] font-bold">KELANIYA ZONE</text>
              </svg>

              <span className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur-sm border border-slate-200 text-[10px] text-slate-500 font-semibold px-3 py-1.5 rounded-md shadow-sm">
                Interactive Campus Map (Simulated)
              </span>

              {/* Price Markers */}
              {filteredListings.map((listing) => {
                const isHovered = hoveredMapListing === listing.id;
                const isSelected = selectedMapListing?.id === listing.id;
                return (
                  <div
                    key={listing.id}
                    className="absolute z-10 transition-transform duration-200"
                    style={{
                      top: listing.mapCoords.top,
                      left: listing.mapCoords.left,
                      transform: isHovered || isSelected ? 'scale(1.15) translate(-50%, -50%)' : 'scale(1) translate(-50%, -50%)',
                      transformOrigin: 'top left'
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedMapListing(listing);
                        setSearchQuery(listing.name);
                      }}
                      onMouseEnter={() => setHoveredMapListing(listing.id)}
                      onMouseLeave={() => setHoveredMapListing(null)}
                      className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-md border flex items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1952c4] border-[#1952c4] text-white ring-4 ring-[#1952c4]/20'
                          : isHovered
                          ? 'bg-[#1546a8] border-[#1546a8] text-white shadow-lg'
                          : 'bg-white border-[#1952c4]/45 text-[#1952c4]'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Rs. {(listing.price / 1000).toFixed(0)}k
                    </button>

                    {isSelected && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-48 bg-white border border-[#e2e8f0] p-2.5 rounded-2xl shadow-xl z-20 flex flex-col gap-1.5 animate-fadeIn">
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMapListing(null);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-slate-600 shadow-sm"
                          >
                            ✕
                          </button>
                          <img
                            src={listing.image}
                            alt=""
                            className="w-full h-20 rounded-xl object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 text-[12px] truncate">{listing.name}</h5>
                          <span className="text-[12px] font-extrabold text-[#1952c4] mt-0.5 block">Rs. {listing.price.toLocaleString()}/mo</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedListing(listing);
                          }}
                          className="w-full py-1 bg-[#ebf3ff] hover:bg-[#1952c4] hover:text-white text-[#1952c4] font-bold text-[10px] rounded-lg transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== HOW IT WORKS SECTION ===== */}
        <div className="my-20 border-t border-[#e2e8f0]/60 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-3">
              How BoardingFinder Works
            </h2>
            <p className="text-slate-500 text-[15px] font-normal">
              Simple steps to find your ideal boarding house
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[#1952c4] text-xs font-bold uppercase tracking-wider mb-1">Step 01</span>
                <h3 className="text-lg font-bold text-[#0f172a] mb-1.5">Search & Filter</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Search for boarding houses near your university. Filter by price, gender policy, facilities, and more.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[#1952c4] text-xs font-bold uppercase tracking-wider mb-1">Step 02</span>
                <h3 className="text-lg font-bold text-[#0f172a] mb-1.5">View & Compare</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Browse photos, read reviews from real students, and compare boarding houses side by side.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[#1952c4] text-xs font-bold uppercase tracking-wider mb-1">Step 03</span>
                <h3 className="text-lg font-bold text-[#0f172a] mb-1.5">Book Securely</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  Send a booking request directly to the owner and confirm your stay with secure payment options.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== OWN A BOARDING HOUSE CTA BANNER ===== */}
        <div className="bg-[#1952c4] rounded-[28px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-10 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-[40%] opacity-10 pointer-events-none hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="60" height="160" rx="10" stroke="white" strokeWidth="6"/>
              <rect x="120" y="40" width="60" height="120" rx="10" stroke="white" strokeWidth="6"/>
              <circle cx="50" cy="50" r="10" fill="white"/>
              <circle cx="50" cy="90" r="10" fill="white"/>
              <circle cx="50" cy="130" r="10" fill="white"/>
              <circle cx="150" cy="70" r="10" fill="white"/>
              <circle cx="150" cy="110" r="10" fill="white"/>
            </svg>
          </div>

          <div className="max-w-xl text-left relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Own a boarding house?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-normal">
              List your property and connect with thousands of students looking for a place near campus.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 flex-shrink-0 relative z-10">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-[#1952c4] font-bold rounded-xl transition-all shadow-sm text-sm cursor-pointer border-none font-medium"
            >
              List Your Property
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 border border-white hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm cursor-pointer bg-transparent font-medium"
            >
              Learn More
            </button>
          </div>
        </div>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#133076] text-white pt-16 pb-8 border-t border-[#1952c4]/20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Brand column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white shadow-sm border border-white/10">
                  <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2"/>
                    <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2"/>
                    <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
                <span className="font-bold text-[22px] tracking-tight">BoardingFinder</span>
              </div>
              <p className="text-[#cbd5e1] text-sm leading-relaxed max-w-sm font-normal">
                Find verified boarding houses near universities across Sri Lanka.
              </p>
            </div>

            {/* Students column */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-bold">For Students</h4>
              <ul className="flex flex-col gap-3 text-[#cbd5e1] text-sm font-normal">
                <li><Link to="/home" className="hover:text-white transition-colors">Search Listings</Link></li>
                <li><Link to="/home" className="hover:text-white transition-colors">Map View</Link></li>
                <li><Link to="/home" className="hover:text-white transition-colors">Saved Listings</Link></li>
                <li><Link to="/home" className="hover:text-white transition-colors">Reviews</Link></li>
              </ul>
            </div>

            {/* Owners column */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-bold">For Owners</h4>
              <ul className="flex flex-col gap-3 text-[#cbd5e1] text-sm font-normal">
                <li><Link to="/register" className="hover:text-white transition-colors">List Property</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Owner Dashboard</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-bold">Company</h4>
              <ul className="flex flex-col gap-3 text-[#cbd5e1] text-sm font-normal">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-[#1e40af]/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#94a3b8] text-xs font-normal">
              © 2026 BoardingFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== LISTING DETAILS MODAL ===== */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedListing(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          ></div>

          <div className="relative bg-white rounded-[32px] w-full max-w-4xl p-6 sm:p-8 md:p-10 shadow-2xl z-10 border border-[#e2e8f0]/80 flex flex-col gap-8 max-h-[90vh] overflow-y-auto animate-modalIn">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-base transition-colors cursor-pointer border-none"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-5">
                <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={selectedListing.image}
                    alt={selectedListing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <span className="text-[11px] font-bold text-[#1952c4] uppercase tracking-wider mb-2.5 block">
                    {selectedListing.university}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight leading-none mb-3">
                    {selectedListing.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#475569] font-semibold mb-5">
                    <span className="bg-[#f0f4f9] px-3 py-1 rounded-md">🛏️ {selectedListing.beds} {selectedListing.beds === 1 ? 'bed' : 'beds'}</span>
                    <span className="bg-[#f0f4f9] px-3 py-1 rounded-md">📍 {selectedListing.location}</span>
                    <span className="bg-[#f0f4f9] px-3 py-1 rounded-md">🚻 {selectedListing.gender}</span>
                    <span className="bg-[#ebf3ff] text-[#1952c4] px-3 py-1 rounded-md shadow-sm">⭐ {selectedListing.rating} ({selectedListing.reviews} reviews)</span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-base mb-2">Description</h4>
                  <p className="text-slate-500 text-[14px] leading-relaxed mb-6 font-normal">
                    {selectedListing.description}
                  </p>

                  <h4 className="font-bold text-slate-800 text-base mb-3.5">Included Amenities</h4>
                  <div className="grid grid-cols-2 gap-3.5">
                    {selectedListing.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[14px] text-slate-600 font-medium">
                        <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f4f9] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-[#e2e8f0]/40">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Book a Room</h3>
                  <p className="text-xs text-slate-400 mb-6">Coordinate direct viewing or reservation with verified owner</p>
                  
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl mb-6 shadow-sm border border-[#e2e8f0]/40">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rent Price</span>
                      <span className="text-2xl font-black text-[#1952c4]">
                        Rs. {selectedListing.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-slate-400 font-bold text-xs uppercase bg-[#f0f4f9] px-3 py-1.5 rounded-lg border border-[#e2e8f0]/30">per month</span>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert('Viewing Request Submitted! The owner will contact you shortly.');
                    setSelectedListing(null);
                  }} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">
                        Preferred Viewing Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#e2e8f0]/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">
                        Message to Landlord
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Hi! I am interested in booking a viewing slot..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#e2e8f0]/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px] resize-none"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 mt-2 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-2xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      Request Booking slot
                    </button>
                  </form>
                </div>

                <div className="mt-6 border-t border-[#e2e8f0]/60 pt-6 flex flex-col gap-3">
                  <button
                    onClick={() => alert('Launching Virtual VR Room Tour...')}
                    className="w-full py-3.5 border border-[#1952c4]/40 hover:bg-[#ebf3ff]/40 text-[#1952c4] font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer"
                  >
                    🕶️ View 3D Virtual Tour
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-semibold uppercase tracking-wider">
                    🔒 Payment Secured via BoardingFinder Escrow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;