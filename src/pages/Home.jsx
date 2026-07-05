import React, { useState, useMemo } from 'react';
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
    isFullyBooked: false,
    liked: false
  }
];

const UNIVERSITIES = [
  { name: "UP Diliman", listings: 12, icon: "🎓", color: "#1952c4" },
  { name: "UST", listings: 9, icon: "🏛️", color: "#7c3aed" },
  { name: "De La Salle", listings: 11, icon: "📚", color: "#059669" },
  { name: "Ateneo", listings: 14, icon: "🦅", color: "#d97706" },
  { name: "FEU", listings: 34, icon: "🔵", color: "#2563eb" },
  { name: "DLSU-D", listings: 8, icon: "🏫", color: "#dc2626" },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [listings, setListings] = useState(MOCK_LISTINGS);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="home" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-[#0f2d7a] via-[#1952c4] to-[#2563eb] text-white overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-[#3b82f6]/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/90">1,240+ verified listings available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.1] tracking-tight text-white max-w-2xl mb-4">
            Find Your Home<br />Near Campus
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-lg mb-8 font-normal leading-relaxed">
            Discover verified boarding houses, dormitories, and studio units close to top Philippine universities.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mb-6">
            <svg className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university, location, or boarding name..."
              className="flex-grow py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-[15px]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl text-sm transition-all flex-shrink-0 cursor-pointer border-none"
            >
              Search Now
            </button>
          </form>

          {/* Popular filters chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-xs font-semibold mr-1">Popular:</span>
            {["Diliman QC", "UP La Salle Taft", "Katipunan Area"].map((chip) => (
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
              { value: "1,240+", label: "Active listings" },
              { value: "48", label: "Partner universities" },
              { value: "8,400+", label: "Students placed" },
              { value: "4.7★", label: "Average rating" },
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
              <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Browse by University</h2>
              <p className="text-slate-500 text-sm mt-1 font-normal">Find boarding houses near your campus</p>
            </div>
            <Link to="/search" className="text-sm font-bold text-[#1952c4] hover:underline flex items-center gap-1">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {UNIVERSITIES.map((uni) => (
              <button
                key={uni.name}
                onClick={() => navigate('/search')}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-[#e2e8f0]/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
                  style={{ backgroundColor: `${uni.color}15` }}
                >
                  {uni.icon}
                </div>
                <div className="text-center">
                  <div className="text-[13px] font-bold text-[#0f172a] group-hover:text-[#1952c4] transition-colors leading-tight">{uni.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{uni.listings} listings</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ===== FEATURED LISTINGS ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Featured Listings</h2>
              <p className="text-slate-500 text-sm mt-1 font-normal">Top-rated boarding houses this month</p>
            </div>
            <Link to="/search" className="text-sm font-bold text-[#1952c4] hover:underline flex items-center gap-1">
              See all listings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => navigate(`/property/${listing.id}`)}
                className="bg-white rounded-[24px] overflow-hidden border border-[#e2e8f0]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer relative"
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
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
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-[#1952c4] uppercase tracking-wider truncate">
                        {listing.university}
                      </span>
                      <span className="bg-slate-100 text-[#475569] text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0">
                        {listing.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#1952c4] transition-colors line-clamp-1 mb-1.5">
                      {listing.name}
                    </h3>

                    <div className="flex items-center justify-between text-[12px] text-slate-500 mb-3 font-semibold">
                      <span className="truncate">📍 {listing.location}</span>
                      <span className="flex-shrink-0 text-[#1952c4] font-bold">📏 {listing.distance}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f0f4f9] text-[#475569] text-[11px] font-semibold px-2.5 py-1 rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                      {listing.amenities.length > 3 && (
                        <span className="bg-[#f0f4f9] text-[#475569] text-[11px] font-semibold px-2.5 py-1 rounded-md">
                          +{listing.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-[#e2e8f0]/60 pt-3 flex justify-between items-center">
                    <div className="flex items-center gap-1 font-bold text-[13px] text-slate-700">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.floor(listing.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                      ))}
                      <span className="text-[#0f172a] ml-1">{listing.rating}</span>
                      <span className="text-slate-400 font-normal text-xs">({listing.reviews})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/compare'); }}
                        className="text-xs font-bold text-slate-500 hover:text-[#1952c4] transition-colors border border-slate-200 rounded-md px-2 py-1 bg-white cursor-pointer"
                      >
                        Compare
                      </button>
                      <span className="text-xs font-bold text-[#1952c4]">View details ➔</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="bg-white py-16 border-t border-[#e2e8f0]/60">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-2">How BoardingFinder Works</h2>
              <p className="text-slate-500 text-[15px] font-normal">Simple steps to find your ideal boarding house</p>
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
                  <div className="w-12 h-12 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[#1952c4] text-xs font-bold uppercase tracking-wider mb-1 block">{item.step}</span>
                    <h3 className="text-lg font-bold text-[#0f172a] mb-1.5">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OWN A BOARDING HOUSE CTA ===== */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-14">
          <div className="bg-[#1952c4] rounded-[28px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-[40%] opacity-10 pointer-events-none hidden md:block">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
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
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Own a boarding house?</h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-normal">
                List your property and connect with thousands of students looking for a place near campus.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 flex-shrink-0 relative z-10">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-[#1952c4] font-bold rounded-xl transition-all shadow-sm text-sm cursor-pointer border-none"
              >
                List Your Property
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 border border-white hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm cursor-pointer bg-transparent"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#133076] text-white pt-16 pb-8 border-t border-[#1952c4]/20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white shadow-sm border border-white/10">
                  <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
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

          <div className="border-t border-[#1e40af]/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#94a3b8] text-xs font-normal">
              © 2026 BoardingFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;