import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_LISTINGS = [
  {
    id: 1,
    name: "BlueSky Residences",
    location: "Diliman, Quezon City",
    price: 4500,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=300",
    mapCoords: { top: '38%', left: '23%' },
    liked: false,
    university: "UP Diliman",
    beds: 4,
    gender: "mixed",
    type: "dormitory",
    amenities: ["Wifi", "Parking", "Laundry", "CCTV"],
    description: "A premium student community residence close to UP Diliman. Fully managed with shared study spaces, laundry services, and high-security CCTV cameras."
  },
  {
    id: 2,
    name: "Tranquil Lodge",
    location: "Sampaloc, Manila",
    price: 3800,
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=300",
    mapCoords: { top: '56%', left: '42%' },
    liked: true,
    university: "UST Manila",
    beds: 2,
    gender: "female",
    type: "boarding_house",
    amenities: ["Wifi", "Meals", "CCTV", "Curfew"],
    description: "A quiet, secure boarding house for girls near UST. High-speed Wi-Fi, healthy meals, safety CCTV, and standard student curfew policies are maintained."
  },
  {
    id: 3,
    name: "Metro Haven",
    location: "Taft Avenue, Manila",
    price: 6200,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300",
    mapCoords: { top: '44%', left: '49%' },
    liked: false,
    university: "DLSU Manila",
    beds: 2,
    gender: "mixed",
    type: "studio_unit",
    amenities: ["Wifi", "Parking", "Gym", "Pool"],
    description: "A secure studio unit located right next to Taft Avenue. Features top-tier student amenities including a swimming pool and modern fitness center."
  },
  {
    id: 4,
    name: "Scholars' Den",
    location: "España Blvd, Manila",
    price: 3200,
    rating: 4.3,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=300",
    mapCoords: { top: '64%', left: '29%' },
    liked: false,
    university: "FEU Manila",
    beds: 2,
    gender: "male",
    type: "boarding_house",
    amenities: ["Wifi", "CCTV", "Laundry"],
    description: "Affordable male-only boarding house near FEU. Ideal for students wanting a budget-friendly bedspace with laundry access."
  },
  {
    id: 5,
    name: "Lakeside Suites",
    location: "Calamba, Laguna",
    price: 2900,
    rating: 4.6,
    reviews: 51,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=300",
    mapCoords: { top: '30%', left: '42%' },
    liked: true,
    university: "UP Los Baños",
    beds: 3,
    gender: "female",
    type: "dormitory",
    amenities: ["Wifi", "Meals", "Parking"],
    description: "Cozy female-only shared dormitory suites. Overlooks scenic areas and includes daily home-cooked meals in the rent."
  },
  {
    id: 6,
    name: "Sunrise Apartments",
    location: "Calamba, Laguna",
    price: 7500,
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=300",
    mapCoords: { top: '48%', left: '59%' },
    liked: false,
    university: "UP Los Baños",
    beds: 1,
    gender: "mixed",
    type: "studio_unit",
    amenities: ["Wifi", "Parking", "Gym", "CCTV"],
    description: "A private studio room perfect for individuals wanting silent study spaces. Offers high-speed Wi-Fi and 24/7 CCTV surveillance near the campus."
  }
];

const MapViewPage = () => {
  const [listings, setListings] = useState(() => {
    const local = localStorage.getItem('listings');
    if (local) {
      try {
        // Map the loaded listings or use fallback if structure is different
        const parsed = JSON.parse(local);
        if (parsed.length > 0 && parsed[0].mapCoords) return parsed;
      } catch (e) {}
    }
    return MOCK_LISTINGS;
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [hoveredListingId, setHoveredListingId] = useState(null);
  const [selectedMapListing, setSelectedMapListing] = useState(null);
  const navigate = useNavigate();

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('listings', JSON.stringify(listings));
  }, [listings]);

  // Filter listings based on search
  const filteredListings = useMemo(() => {
    return listings.filter(listing => 
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.university.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listings, searchQuery]);

  const handleLogout = () => {
    navigate('/');
  };

  const likedCount = useMemo(() => {
    return listings.filter(l => l.liked).length;
  }, [listings]);

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] font-sans antialiased text-[#0f172a] overflow-hidden">
      {/* Navbar */}
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="map" />

      {/* Main Content Layout */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT MAP VIEW PANEL */}
        <div className="flex-grow h-full relative bg-[#e2e8f0] overflow-hidden">
          
          {/* Map Image Background (Road map simulation) */}
          <div className="absolute inset-0 z-0">
            {/* Styled vector map graphics inside SVG to look clean and high quality */}
            <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700">
              {/* Landmass background color */}
              <rect width="100%" height="100%" fill="#e8eff9" />
              
              {/* Waterways / River */}
              <path d="M-100 200 C 300 220, 250 450, 800 550 L1100 550 L1100 750 L-100 750 Z" fill="#b9d5fc" />
              
              {/* Primary Roads */}
              <path d="M 120 -50 L 120 750 M 520 -50 L 520 750 M -50 180 L 1050 180 M -50 480 L 1050 480" stroke="white" strokeWidth="16" strokeLinecap="round" />
              <path d="M 120 -50 L 120 750 M 520 -50 L 520 750 M -50 180 L 1050 180 M -50 480 L 1050 480" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,6" />
              
              {/* Secondary Streets */}
              <path d="M 320 -50 L 320 750 M 780 -50 L 780 750 M -50 320 L 1050 320 M -50 50 L 1050 50" stroke="white" strokeWidth="10" strokeLinecap="round" />
              <path d="M 320 -50 L 320 750 M 780 -50 L 780 750 M -50 320 L 1050 320 M -50 50 L 1050 50" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />

              {/* Park zones */}
              <rect x="50" y="80" width="220" height="70" rx="12" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" />
              <text x="65" y="110" fill="#166534" className="text-[12px] font-bold tracking-wider" opacity="0.6">QUEZON CITY ZONE</text>
              
              <rect x="550" y="240" width="200" height="180" rx="12" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
              <text x="565" y="270" fill="#1d4ed8" className="text-[12px] font-bold tracking-wider" opacity="0.6">MANILA BAY ZONE</text>

              {/* Surrounding City Labels */}
              <text x="140" y="230" fill="#64748b" className="text-[28px] font-extrabold" opacity="0.15">BAMBERG</text>
              <text x="440" y="120" fill="#64748b" className="text-[28px] font-extrabold" opacity="0.15">BAYREUTH</text>
              <text x="560" y="440" fill="#64748b" className="text-[28px] font-extrabold" opacity="0.15">PEGNITZ</text>
              <text x="150" y="550" fill="#64748b" className="text-[28px] font-extrabold" opacity="0.15">ERLANGEN</text>
            </svg>
          </div>

          {/* Interactive Overlay Price Markers */}
          {filteredListings.map((listing) => {
            const isHovered = hoveredListingId === listing.id;
            const isSelected = selectedMapListing?.id === listing.id;
            return (
              <div
                key={listing.id}
                className="absolute z-10 transition-all duration-300"
                style={{
                  top: listing.mapCoords.top,
                  left: listing.mapCoords.left,
                  transform: isHovered || isSelected ? 'scale(1.12) translate(-50%, -50%)' : 'scale(1) translate(-50%, -50%)',
                  transformOrigin: 'center center'
                }}
              >
                <button
                  onClick={() => {
                    setSelectedMapListing(listing === selectedMapListing ? null : listing);
                  }}
                  onMouseEnter={() => setHoveredListingId(listing.id)}
                  onMouseLeave={() => setHoveredListingId(null)}
                  className={`px-3.5 py-2 rounded-full font-bold text-[13px] shadow-lg border-2 flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1952c4] border-[#1952c4] text-white ring-4 ring-[#1952c4]/20'
                      : isHovered
                      ? 'bg-[#1546a8] border-[#1546a8] text-white shadow-xl'
                      : 'bg-white border-[#e2e8f0] text-slate-800 hover:border-slate-300'
                  }`}
                >
                  LKR {(listing.price / 1000).toFixed(1)}k
                </button>

                {/* Map Mini Popup Info */}
                {isSelected && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-48 bg-white border border-[#e2e8f0] p-2.5 rounded-2xl shadow-xl z-20 flex flex-col gap-2.5 animate-fadeIn">
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
                      <span className="text-[12px] font-extrabold text-[#1952c4] mt-0.5 block">LKR {listing.price.toLocaleString()}/mo</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/property/${listing.id}`);
                      }}
                      className="w-full py-1.5 bg-[#ebf3ff] hover:bg-[#1952c4] hover:text-white text-[#1952c4] font-bold text-[11px] rounded-lg transition-all border-none cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Top Control Bar Floating on Map */}
          <div className="absolute top-6 left-6 right-6 z-20 flex items-center gap-3">
            {/* Search Input Bar */}
            <div className="flex items-center flex-grow bg-white px-4 py-3 rounded-full shadow-md border border-[#e2e8f0] max-w-md">
              <svg className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search map..."
                className="w-full bg-transparent text-slate-800 placeholder-[#94a3b8] focus:outline-none text-[15px] font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 font-bold ml-1.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* List View Toggle Button */}
            <Link to="/home">
              <button className="px-5 py-3 bg-white hover:bg-slate-50 text-[#0f172a] font-bold text-sm rounded-full shadow-md border border-[#e2e8f0] flex items-center gap-2 transition-all cursor-pointer">
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round" />
                </svg>
                List View
              </button>
            </Link>
          </div>

        </div>

        {/* RIGHT SIDE PANEL (All Listings) */}
        <div className="w-full lg:w-[420px] bg-white border-l border-[#e2e8f0] flex flex-col h-full flex-shrink-0 z-10 shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-[#e2e8f0]/80">
            <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">All Listings</h3>
            <p className="text-sm text-slate-500 mt-0.5">{filteredListings.length} boarding houses</p>
          </div>

          {/* Listings List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => {
                const isHovered = hoveredListingId === listing.id;
                const isSelected = selectedMapListing?.id === listing.id;
                return (
                  <div
                    key={listing.id}
                    onClick={() => navigate(`/property/${listing.id}`)}
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-[#1952c4] bg-[#ebf3ff]/40'
                        : isHovered
                        ? 'border-slate-300 bg-slate-50'
                        : 'border-[#e2e8f0] bg-white'
                    }`}
                  >
                    {/* Listing Image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Listing Details */}
                    <div className="flex flex-col justify-between flex-grow overflow-hidden">
                      <div>
                        <h4 className="font-bold text-base text-[#0f172a] truncate group-hover:text-[#1952c4]">
                          {listing.name}
                        </h4>
                        <div className="flex items-center text-slate-500 text-xs mt-1 font-semibold">
                          <span className="mr-1">📍</span>
                          <span className="truncate">{listing.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-extrabold text-[#1952c4]">
                          LKR {listing.price.toLocaleString()}
                          <span className="text-[11px] text-slate-400 font-normal">/mo</span>
                        </span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                          ⭐ {listing.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <span className="text-4xl block mb-3">🔍</span>
                <h4 className="text-slate-800 font-bold">No results found</h4>
                <p className="text-slate-400 text-xs mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MapViewPage;
