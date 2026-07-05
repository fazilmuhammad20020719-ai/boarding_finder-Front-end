import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_LISTINGS = [
  {
    id: 1,
    name: "Moratuwa Heights Dormitory",
    university: "University of Moratuwa",
    price: 12000,
    rating: 4.8,
    reviews: 24,
    type: "dormitory",
    amenities: ["Wifi", "AC", "Laundry", "24/7 Security"],
    distance: "5 mins walk",
    beds: 2,
    gender: "Co-ed",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600",
    description: "A comfortable and secure dormitory designed specifically for University of Moratuwa students. Features 24/7 security, high-speed fiber internet, and comfortable study halls.",
    mapCoords: { top: '35%', left: '28%' }
  },
  {
    id: 2,
    name: "Colombo Vista Bedspace",
    university: "University of Colombo",
    price: 15000,
    rating: 4.9,
    reviews: 18,
    type: "bedspace",
    amenities: ["Wifi", "Study Area", "Gym", "Lounge"],
    distance: "8 mins walk",
    beds: 1,
    gender: "Female only",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    description: "Located close to the University of Colombo, this premium bedspace offers quiet study rooms, a fully equipped gym, and friendly female-only lodging with modern security.",
    mapCoords: { top: '48%', left: '55%' }
  },
  {
    id: 3,
    name: "Jayewardenepura Residency Apartment",
    university: "University of Sri Jayewardenepura",
    price: 18000,
    rating: 4.6,
    reviews: 32,
    type: "apartment",
    amenities: ["Wifi", "AC", "Kitchen", "Pool", "Gym"],
    distance: "2 mins walk",
    beds: 2,
    gender: "Co-ed",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
    description: "Modern apartment spaces perfect for students who want premium amenities including a swimming pool, private kitchen, and top-tier security access codes near USJ.",
    mapCoords: { top: '75%', left: '38%' }
  },
  {
    id: 4,
    name: "Kelaniya Haven Bedspace",
    university: "University of Kelaniya",
    price: 8500,
    rating: 4.5,
    reviews: 15,
    type: "bedspace",
    amenities: ["Wifi", "Water Station", "Lounge", "Shared Kitchen"],
    distance: "10 mins walk",
    beds: 4,
    gender: "Male only",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600",
    description: "Affordable bedspace lodging for male Kelaniya students. A clean community area, unlimited drinking water, and high-speed Wi-Fi are fully included in the rent.",
    mapCoords: { top: '22%', left: '70%' }
  },
  {
    id: 5,
    name: "Moratuwa Cozy Suites",
    university: "University of Moratuwa",
    price: 16500,
    rating: 4.7,
    reviews: 9,
    type: "apartment",
    amenities: ["Wifi", "AC", "Kitchen", "Private Bath"],
    distance: "12 mins walk",
    beds: 1,
    gender: "Co-ed",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    description: "Spacious studio apartments near Moratuwa. Fully furnished with private kitchen and bathroom, perfect for students seeking privacy and a quiet study atmosphere.",
    mapCoords: { top: '28%', left: '42%' }
  },
  {
    id: 6,
    name: "Colombo Crest Dorm",
    university: "University of Colombo",
    price: 11000,
    rating: 4.7,
    reviews: 21,
    type: "dormitory",
    amenities: ["Wifi", "AC", "Study Hall", "Cafe"],
    distance: "4 mins walk",
    beds: 3,
    gender: "Co-ed",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
    description: "A lively student community dorm with shared study halls, fast fiber Wi-Fi, an in-house study cafe, and a convenient location just a short walk to UOC.",
    mapCoords: { top: '55%', left: '68%' }
  }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'dormitory', 'apartment', 'bedspace'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under_10k', '10k_to_15k', 'over_15k'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'map'
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Map interactive states
  const [hoveredMapListing, setHoveredMapListing] = useState(null);
  const [selectedMapListing, setSelectedMapListing] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Go back to Landing page
  };

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((listing) => {
      const matchesSearch =
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || listing.type === filterType;

      let matchesPrice = true;
      if (priceFilter === 'under_10k') {
        matchesPrice = listing.price < 10000;
      } else if (priceFilter === '10k_to_15k') {
        matchesPrice = listing.price >= 10000 && listing.price <= 15000;
      } else if (priceFilter === 'over_15k') {
        matchesPrice = listing.price > 15000;
      }

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchQuery, filterType, priceFilter]);

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-10">
        
        {/* ===== HERO / SEARCH SECTION ===== */}
        <div className="bg-[#1952c4] text-white py-12 px-6 sm:px-12 rounded-[32px] mb-8 relative overflow-hidden shadow-md">
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>

          <div className="max-w-3xl relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight mb-4">
              Find your home away <br />from campus
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 font-normal max-w-xl">
              Search verified student dormitories, bedspaces, and apartments near top universities in Sri Lanka.
            </p>

            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-white p-2 rounded-[20px] shadow-lg">
              <div className="flex items-center flex-grow px-3 gap-2">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by university, location, or name..."
                  className="w-full py-3 bg-transparent text-slate-800 placeholder-[#94a3b8] focus:outline-none text-[15px]"
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
              <button className="sm:px-8 py-3.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-[16px] transition-colors text-[15px] shadow-sm flex items-center justify-center gap-2">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ===== FILTERS & CONTROLS ===== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'All Listings' },
              { id: 'dormitory', label: 'Dormitories' },
              { id: 'apartment', label: 'Apartments' },
              { id: 'bedspace', label: 'Bedspaces' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer border ${
                  filterType === tab.id
                    ? 'bg-[#1952c4] border-[#1952c4] text-white'
                    : 'bg-white border-[#e2e8f0]/80 text-[#475569] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Price & View Mode Dropdowns */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Price Dropdown */}
            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="pl-5 pr-10 py-2.5 rounded-full bg-white border border-[#e2e8f0]/80 shadow-sm font-semibold text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 appearance-none cursor-pointer"
              >
                <option value="all">Any Price</option>
                <option value="under_10k">Under Rs. 10,000 /mo</option>
                <option value="10k_to_15k">Rs. 10,000 - Rs. 15,000 /mo</option>
                <option value="over_15k">Above Rs. 15,000 /mo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-full p-1 border border-[#e2e8f0]/80 shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#1952c4] text-white shadow-sm'
                    : 'text-[#475569] hover:bg-slate-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#1952c4] text-white shadow-sm'
                    : 'text-[#475569] hover:bg-slate-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Map View
              </button>
            </div>
          </div>
        </div>

        {/* ===== VIEW CONTENTS ===== */}
        {viewMode === 'list' ? (
          filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => setSelectedListing(listing)}
                  className="bg-white rounded-[24px] overflow-hidden border border-[#e2e8f0]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer"
                >
                  {/* Photo Overlay */}
                  <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Verified Tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/90 backdrop-blur-sm text-[#1952c4] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 fill-current text-[#1952c4]" viewBox="0 0 24 24">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Verified
                      </span>
                    </div>
                    {/* Gender tag */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-[#0f172a]/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {listing.gender}
                      </span>
                    </div>
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
                      
                      {/* Distance & Beds Info */}
                      <div className="flex items-center gap-4 text-[13px] text-slate-500 mb-4 font-medium">
                        <span className="flex items-center gap-1">
                          🛏️ {listing.beds} {listing.beds === 1 ? 'bed' : 'beds'}
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {listing.distance}
                        </span>
                      </div>

                      {/* Amenities Icons */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {listing.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-[#f0f4f9] text-[#475569] text-[11px] font-semibold px-2.5 py-1 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                        {listing.amenities.length > 3 && (
                          <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2 py-1 rounded-md">
                            +{listing.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div>
                      <div className="border-t border-[#e2e8f0]/60 my-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starting at</span>
                          <span className="text-lg font-extrabold text-[#0f172a] leading-none">
                            Rs. {listing.price.toLocaleString()}<span className="text-xs font-semibold text-slate-500">/mo</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-[#ebf3ff] px-2.5 py-1 rounded-full text-xs font-bold text-[#1952c4] shadow-sm">
                          ⭐ {listing.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-[#e2e8f0]/60">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-xl font-bold text-slate-800">No boarding houses found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
            </div>
          )
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
              {/* Stylized SVG Map Graphics */}
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

              {/* Dynamic Interactive Price Markers */}
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
                    {/* Custom Tag Marker */}
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

                    {/* Pop-up Box over Marker if Selected */}
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

      </main>

      {/* ===== LISTING DETAILS MODAL ===== */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setSelectedListing(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white rounded-[32px] w-full max-w-4xl p-6 sm:p-8 md:p-10 shadow-2xl z-10 border border-[#e2e8f0]/80 flex flex-col gap-8 max-h-[90vh] overflow-y-auto animate-modalIn">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-base transition-colors cursor-pointer border-none"
            >
              ✕
            </button>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Image & Details */}
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
                    <span className="bg-[#f0f4f9] px-3 py-1 rounded-md">📍 {selectedListing.distance}</span>
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

              {/* Right Column: Contact & Booking Form */}
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
                    
                    {/* Booking Date */}
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

                    {/* Messages */}
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

                    {/* Confirm Button */}
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