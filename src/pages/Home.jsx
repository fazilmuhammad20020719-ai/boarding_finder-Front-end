import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllListings, getSavedListings, addSavedListing, removeSavedListing, getStats } from '../services/api';

// Remove MOCK_LISTINGS and map from API instead
const mapListing = (dbListing) => {
  let parsedAmenities = [];
  if (Array.isArray(dbListing.amenities)) {
    parsedAmenities = dbListing.amenities;
  } else if (typeof dbListing.amenities === 'string') {
    try {
      const parsed = JSON.parse(dbListing.amenities);
      if (Array.isArray(parsed)) {
        parsedAmenities = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        parsedAmenities = Object.keys(parsed).filter(key => parsed[key]);
      } else {
        parsedAmenities = [String(parsed)];
      }
    } catch (e) {
      if (dbListing.amenities.startsWith('{') && dbListing.amenities.endsWith('}')) {
        parsedAmenities = dbListing.amenities.slice(1, -1).split(',').map(a => {
          const key = a.split(':')[0];
          return key ? key.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '') : '';
        }).filter(Boolean);
      } else {
        parsedAmenities = dbListing.amenities.split(',').map(a => a.trim()).filter(Boolean);
      }
    }
  }

  if (!Array.isArray(parsedAmenities)) {
    parsedAmenities = [];
  }

  let rawImages = dbListing.image_urls || dbListing.images;
  let parsedImages = [];
  if (Array.isArray(rawImages)) {
    parsedImages = rawImages;
  } else if (typeof rawImages === 'string') {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed)) {
        parsedImages = parsed;
      } else {
        parsedImages = [String(parsed)];
      }
    } catch (e) {
      if (rawImages.startsWith('[') && rawImages.endsWith(']')) {
        parsedImages = rawImages.slice(1, -1).split(',').map(url => url.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
      } else {
        parsedImages = rawImages.split(',').map(url => url.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
      }
    }
  }

  if (!Array.isArray(parsedImages)) {
    parsedImages = [];
  }

  let imageUrl = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";
  if (parsedImages.length > 0) {
    const firstImg = parsedImages[0];
    if (firstImg.includes('drive.google.com/uc?id=')) {
      imageUrl = firstImg.replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1000';
    } else if (firstImg.startsWith('http')) {
      imageUrl = firstImg;
    } else {
      const cleanUrl = firstImg.startsWith('/') ? firstImg.substring(1) : firstImg;
      const pathPrefix = cleanUrl.startsWith('images/') ? '' : 'images/';
      imageUrl = `/${pathPrefix}${cleanUrl}`;
    }
  }

  return {
    id: dbListing.listing_id,
    name: dbListing.title,
    university: dbListing.university || 'Nearby University',
    location: dbListing.location,
    price: Number(dbListing.price) || 0,
    rating: dbListing.rating || 0,
    reviews: dbListing.reviews || 0,
    type: dbListing.type || 'boarding_house',
    gender: dbListing.gender || 'mixed',
    amenities: parsedAmenities,
    distance: dbListing.distance || 'N/A',
    beds: dbListing.beds || 1,
    image: imageUrl,
    isFullyBooked: dbListing.status === 'booked',
    liked: false
  };
};

const UNIVERSITIES = [
  { name: "UOC", listings: 12, icon: "🎓", color: "#1952c4" },
  { name: "UOP", listings: 9, icon: "🏛️", color: "#7c3aed" },
  { name: "UOM", listings: 11, icon: "⚙️", color: "#059669" },
  { name: "UOK", listings: 14, icon: "📚", color: "#d97706" },
  { name: "USJ", listings: 34, icon: "💡", color: "#2563eb" },
  { name: "UOR", listings: 8, icon: "🏫", color: "#e11d48" }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, savedData] = await Promise.all([
          getAllListings(),
          localStorage.getItem("token") ? getSavedListings().catch(() => []) : Promise.resolve([])
        ]);

        if (listingsData.listings) {
          const savedIds = new Set(savedData.map(l => l.listing_id));
          const mapped = listingsData.listings.map(mapListing);
          setListings(mapped.map(l => ({ ...l, liked: savedIds.has(l.id) })));
        }

        // 4. Fetch Stats
        try {
          const statsData = await getStats();
          if (statsData?.stats) {
            setStats(statsData.stats);
          }
        } catch (statsErr) {
          console.error("Failed to load stats", statsErr);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const likedCount = useMemo(() => listings.filter(l => l.liked).length, [listings]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="home" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-[#111] via-[#1A1A1A] to-black border-b border-[#333] text-white overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-[#FACC15]/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/90">{stats ? `${stats.activeListings}+` : "0+"} verified listings available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.1] tracking-tight text-white max-w-2xl mb-4">
            Find Your Home<br />Near Campus
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-lg mb-8 font-normal leading-relaxed">
            Discover verified boarding houses, dormitories, and studio units close to top universities in Sri Lanka.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 bg-[#1A1A1A] border border-[#333] rounded-2xl shadow-2xl p-2 max-w-2xl mb-6">
            <svg className="w-5 h-5 text-white/50 ml-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university, location, or boarding name..."
              className="flex-grow py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-[15px]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl text-sm transition-all flex-shrink-0 cursor-pointer border-none"
            >
              Search Now
            </button>
          </form>

          {/* Popular filters chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-xs font-semibold mr-1">Popular:</span>
            {["Anuradhapura", "Colombo", "Nugegoda", "Peradeniya"].map((chip) => (
              <button
                key={chip}
                onClick={() => navigate('/search')}
                className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: stats ? `${stats.activeListings}+` : "0+", label: "Active listings" },
              { value: stats ? `${stats.partnerUniversities}` : "0", label: "Partner universities" },
              { value: stats ? `${stats.studentsPlaced}+` : "0+", label: "Students placed" },
              { value: stats ? `${stats.avgRating}★` : "0.0★", label: "Average rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-xs mt-1 font-normal">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow">

        {/* ===== BROWSE BY UNIVERSITY ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Browse by University</h2>
              <p className="text-white/50 text-sm mt-1 font-normal">Find boarding houses near your campus</p>
            </div>
            <Link to="/search" className="text-sm font-bold text-[#FACC15] hover:underline flex items-center gap-1">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {UNIVERSITIES.map((uni) => (
              <button
                key={uni.name}
                onClick={() => navigate('/search')}
                className="flex flex-col items-center gap-3 p-4 bg-[#1A1A1A] rounded-2xl border border-[#2a2a2a] shadow-sm hover:border-[#FACC15]/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm bg-[#111]"
                >
                  {uni.icon}
                </div>
                <div className="text-center">
                  <div className="text-[13px] font-bold text-white group-hover:text-[#FACC15] transition-colors leading-tight">{uni.name}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">{uni.listings} listings</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ===== FEATURED LISTINGS ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Featured Listings</h2>
              <p className="text-white/50 text-sm mt-1 font-normal">Top-rated boarding houses this month</p>
            </div>
            <Link to="/search" className="text-sm font-bold text-[#FACC15] hover:underline flex items-center gap-1">
              See all listings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1952c4]"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                No listings available right now.
              </div>
            ) : listings.slice(0, 6).map((listing) => (
              <div
                key={listing.id}
                onClick={() => navigate(`/property/${listing.id}`)}
                className="bg-[#1A1A1A] rounded-[24px] overflow-hidden border border-[#2a2a2a] shadow-sm hover:border-[#333] transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer relative"
              >
                {/* Photo */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
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

                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="bg-[#1952c4] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                      LKR {listing.price.toLocaleString()}/mo
                    </span>
                    <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md capitalize ${listing.gender === 'female'
                      ? 'bg-[#ea4335] text-white'
                      : listing.gender === 'male'
                        ? 'bg-[#4285f4] text-white'
                        : 'bg-[#845ef7] text-white'
                      }`}>
                      {listing.gender}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!localStorage.getItem("token")) {
                        alert("Please login to save properties.");
                        return;
                      }
                      try {
                        if (listing.liked) {
                          await removeSavedListing(listing.id);
                        } else {
                          await addSavedListing(listing.id);
                        }
                        setListings(listings.map(l => l.id === listing.id ? { ...l, liked: !l.liked } : l));
                      } catch (err) {
                        console.error("Failed to toggle save status", err);
                      }
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
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-[#FACC15] uppercase tracking-wider truncate">
                        {listing.university}
                      </span>
                      <span className="bg-[#111] text-white/70 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0 border border-[#333]">
                        {listing.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#FACC15] transition-colors line-clamp-1 mb-1.5">
                      {listing.name}
                    </h3>

                    <div className="flex items-center justify-between text-[12px] text-white/50 mb-3 font-semibold">
                      <span className="truncate">📍 {listing.location}</span>
                      <span className="flex-shrink-0 text-[#FACC15] font-bold">📏 {listing.distance}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-[#111] text-white/70 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#333]"
                        >
                          {amenity}
                        </span>
                      ))}
                      {listing.amenities.length > 3 && (
                        <span className="bg-[#111] text-white/70 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#333]">
                          +{listing.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-[#333] pt-3 flex justify-between items-center">
                    <div className="flex items-center gap-1 font-bold text-[13px] text-white">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.floor(listing.rating) ? "text-[#FACC15]" : "text-white/20"}>★</span>
                      ))}
                      <span className="text-white ml-1">{listing.rating}</span>
                      <span className="text-white/40 font-normal text-xs">({listing.reviews})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/compare'); }}
                        className="text-xs font-bold text-white/60 hover:text-[#FACC15] transition-colors border border-[#333] rounded-md px-2 py-1 bg-transparent cursor-pointer"
                      >
                        Compare
                      </button>
                      <span className="text-xs font-bold text-[#FACC15]">View details ➔</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="bg-[#111] py-16 border-t border-[#2a2a2a]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">How BoardingFinder Works</h2>
              <p className="text-white/50 text-[15px] font-normal">Simple steps to find your ideal boarding house</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  step: "Step 01",
                  title: "Search & Filter",
                  desc: "Search for boarding houses near your university. Filter by price, gender policy, facilities, and more.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  ),
                },
                {
                  step: "Step 02",
                  title: "View & Compare",
                  desc: "Browse photos, read reviews from real students, and compare boarding houses side by side.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ),
                },
                {
                  step: "Step 03",
                  title: "Book Securely",
                  desc: "Send a booking request directly to the owner and confirm your stay with secure payment options.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 11 2 2 4-4" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center flex-shrink-0 border border-[#FACC15]/20">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[#FACC15] text-xs font-bold uppercase tracking-wider mb-1 block">{item.step}</span>
                    <h3 className="text-lg font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black text-white pt-16 pb-8 border-t border-[#333] mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white shadow-sm border border-white/10">
                  <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                    <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2" />
                    <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                <span className="font-bold text-[22px] tracking-tight">BoardingFinder</span>
              </div>
              <p className="text-[#cbd5e1] text-sm leading-relaxed max-w-sm font-normal">
                Find verified boarding houses near universities across Sri Lanka.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Students</h4>
              <ul className="flex flex-col gap-3 text-[#cbd5e1] text-sm font-normal">
                <li><Link to="/search" className="hover:text-white transition-colors">Search Listings</Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Map View</Link></li>
                <li><Link to="/saved-homes" className="hover:text-white transition-colors">Saved Listings</Link></li>
                <li><Link to="/home" className="hover:text-white transition-colors">Reviews</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Owners</h4>
              <ul className="flex flex-col gap-3 text-[#cbd5e1] text-sm font-normal">
                <li><Link to="/register" className="hover:text-white transition-colors">List Property</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Owner Dashboard</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="flex flex-col gap-3 text-[#cbd5e1] text-sm font-normal">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs font-normal">
              © 2026 BoardingFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;