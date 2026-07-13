import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    amenities: ["Wifi", "Parking", "Laundry", "CCTV", "Meals"],
    distance: "0.3 km",
    beds: 4,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
    description: "Modern dormitory just 3 minutes walk from UP Diliman Gate 1. All rooms are air-conditioned with individual study areas. Common lounge, rooftop garden, and 24/7 security guard on duty. Perfect for students who value safety and convenience.",
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
    isFullyBooked: false,
    liked: false
  }
];

const REVIEWS = [
  { id: 1, name: "Nuha", date: "March 2025", initial: "A", rating: 5, text: "Very clean and the owner is super accommodating. WiFi is fast enough for video calls. Highly recommended!" },
  { id: 2, name: "Fazil", date: "Feb 2025", initial: "M", rating: 4, text: "Great location, just a 5-minute walk to campus. Room is a bit small but very clean." },
  { id: 3, name: "Naja", date: "Jan 2025", initial: "S", rating: 5, text: "Best boarding house I've stayed in. Homey atmosphere and safe neighborhood." },
  { id: 4, name: "Farha", date: "Dec 2024", initial: "R", rating: 4, text: "Good value for money. Internet could be faster during peak hours but overall satisfied." }
];

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [activeDuration, setActiveDuration] = useState('6 mo');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch from localStorage or use fallback
    const local = localStorage.getItem('listings');
    let allListings = MOCK_LISTINGS;
    if (local) {
      try {
        allListings = JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse listings', e);
      }
    }
    const found = allListings.find(l => l.id.toString() === id);
    if (found) {
      setListing(found);
    } else {
      setListing(MOCK_LISTINGS[1]); // Fallback to BlueSky for demo if not found
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  if (!listing) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={2} activeTab="" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-6">
        {/* ===== BREADCRUMBS ===== */}
        <div className="flex items-center gap-2 text-sm text-[#64748b] font-medium mb-6">
          <Link to="/home" className="hover:text-[#1952c4] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/search" className="hover:text-[#1952c4] transition-colors">Search</Link>
          <span>›</span>
          <span className="text-[#0f172a] font-semibold">{listing.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ===== LEFT COLUMN: DETAILS ===== */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Images */}
            <div className="flex flex-col gap-3">
              <div className="w-full h-[400px] rounded-[24px] overflow-hidden bg-slate-200">
                <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-200 border-2 border-[#1952c4]">
                  <img src={listing.image} alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-200 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                  <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300" alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-200 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                  <img src="https://images.unsplash.com/photo-1502672260266-1c1e5240980c?auto=format&fit=crop&q=80&w=300" alt="thumb" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Header & Badges */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a]">{listing.name}</h1>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-full hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-600 bg-white shadow-sm cursor-pointer">
                  <svg className={`w-4 h-4 ${listing.liked ? 'text-red-500 fill-current' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-slate-500 font-medium mb-4">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {listing.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  {listing.university}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-md font-bold text-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {listing.rating} <span className="text-amber-600/70 ml-1 font-medium">({listing.reviews} reviews)</span>
                </div>
                <span className="bg-purple-50 text-purple-600 font-bold text-[13px] px-3 py-1 rounded-md capitalize">{listing.gender}</span>
                <span className="bg-blue-50 text-blue-600 font-bold text-[13px] px-3 py-1 rounded-md capitalize">{listing.type.replace('_', ' ')}</span>
                <span className="bg-slate-100 text-slate-500 font-bold text-[13px] px-3 py-1 rounded-md">{listing.distance} from campus</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#f0f4f9] rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-1 border border-[#e2e8f0]/50">
                <svg className="w-6 h-6 text-[#1952c4] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="font-extrabold text-[#0f172a]">{listing.beds} Rooms</span>
                <span className="text-xs font-semibold text-[#1952c4]">Available</span>
              </div>
              <div className="bg-[#f0f4f9] rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-1 border border-[#e2e8f0]/50">
                <svg className="w-6 h-6 text-[#1952c4] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                <span className="font-extrabold text-[#0f172a]">1 Bathroom</span>
                <span className="text-xs font-semibold text-slate-400">Included</span>
              </div>
              <div className="bg-[#f0f4f9] rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-1 border border-[#e2e8f0]/50">
                <svg className="w-6 h-6 text-[#1952c4] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="font-extrabold text-[#0f172a]">{listing.distance}</span>
                <span className="text-xs font-semibold text-slate-400">from campus</span>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-3">About this place</h3>
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-4">Facilities & Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {listing.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-full shadow-sm text-[14px] font-semibold text-[#0f172a]">
                    <svg className="w-4 h-4 text-[#1952c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0f172a]">Location</h3>
                <button className="text-[#1952c4] text-sm font-bold flex items-center gap-1 hover:underline">
                  Open map <span className="text-lg leading-none">›</span>
                </button>
              </div>
              <div className="w-full h-48 bg-slate-200 rounded-2xl overflow-hidden relative border border-[#e2e8f0]">
                {/* Simulated Map Background */}
                <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 400 200">
                  <path d="M0,50 Q100,80 200,40 T400,60" fill="none" stroke="#94a3b8" strokeWidth="4" />
                  <path d="M0,150 Q150,180 250,120 T400,160" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                  <path d="M100,0 L120,200" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <path d="M300,0 L280,200" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="200" cy="100" r="6" fill="#1952c4" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-[#1952c4] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#1546a8] transition-colors flex items-center gap-2 cursor-pointer border-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    View on Full Map
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0f172a]">Reviews</h3>
                <button className="text-[#1952c4] text-sm font-bold flex items-center gap-1 hover:underline">
                  All {listing.reviews} reviews <span className="text-lg leading-none">›</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REVIEWS.map(review => (
                  <div key={review.id} className="bg-white p-5 rounded-2xl border border-[#e2e8f0]/80 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] font-bold flex items-center justify-center">
                          {review.initial}
                        </div>
                        <div>
                          <div className="font-bold text-[#0f172a] text-sm">{review.name}</div>
                          <div className="text-xs text-slate-400">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400 text-sm">
                        {Array.from({length: 5}).map((_, i) => (
                          <span key={i} className={i < review.rating ? "" : "text-slate-200"}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ===== RIGHT COLUMN: BOOKING CARD ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-[#e2e8f0]/60 sticky top-28">
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-black text-[#1952c4]">LKR {listing.price.toLocaleString()}</span>
                <span className="text-slate-400 font-medium ml-1">/ month</span>
              </div>

              {/* Rating Mini */}
              <div className="flex items-center gap-1.5 mb-6 text-sm">
                <div className="flex text-amber-400">★★★★★</div>
                <span className="font-bold text-[#0f172a]">{listing.rating}</span>
                <span className="text-slate-400 underline">({listing.reviews})</span>
              </div>

              {/* Owner Info */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#ebf3ff] text-[#1952c4] font-bold flex items-center justify-center text-lg">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-[#0f172a] text-sm">Maria Santos</div>
                    <div className="text-xs text-slate-400">Property Owner</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-full bg-[#f0f4f9] text-[#1952c4] flex items-center justify-center hover:bg-[#e1e9f5] transition-colors border-none cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                  <button className="w-9 h-9 rounded-full bg-[#f0f4f9] text-[#1952c4] flex items-center justify-center hover:bg-[#e1e9f5] transition-colors border-none cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </div>

              {listing.isFullyBooked ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-4 border border-red-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <h4 className="text-lg font-extrabold text-[#0f172a] mb-1.5">Fully Booked</h4>
                  <p className="text-sm text-slate-500 font-medium mb-6">Check back later or save to get notified</p>
                  <button className="w-full py-3.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#1952c4] font-bold rounded-xl transition-colors shadow-sm cursor-pointer">
                    Save for Later
                  </button>
                </div>
              ) : (
                <>
                  {/* Booking Form */}
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748b] tracking-wider mb-2 uppercase">Move-In Date</label>
                      <input type="date" className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4]" />
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748b] tracking-wider mb-2 uppercase">Duration</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['3 mo', '6 mo', '9 mo', '12 mo'].map(dur => (
                          <button
                            key={dur}
                            onClick={() => setActiveDuration(dur)}
                            className={`py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${activeDuration === dur ? 'bg-[#ebf3ff] border-[#1952c4] text-[#1952c4]' : 'bg-white border-[#e2e8f0] text-slate-500 hover:bg-slate-50'}`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate(`/book/${listing.id}`)}
                      className="w-full py-3.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-3.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#0f172a] font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </>
              )}
              
              <p className="text-center text-xs text-slate-400 mt-5 font-medium">
                No payment charged until approved by owner
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ===== SEND INQUIRY MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl z-10 animate-modalIn border border-slate-100">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-slate-50 hover:bg-slate-100 text-[#1952c4] rounded-full flex items-center justify-center font-bold text-sm transition-colors cursor-pointer border-none">
              ✕
            </button>
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-0.5">Send Inquiry</h3>
            <p className="text-[13px] text-[#1952c4] mb-6">{listing.name}</p>
            
            <textarea
              rows="4"
              placeholder="Type your message to the owner..."
              className="w-full px-4 py-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1952c4] focus:border-[#1952c4] text-[14px] resize-none mb-4 font-medium"
            ></textarea>
            
            <button onClick={() => { alert('Inquiry sent!'); setIsModalOpen(false); }} className="w-full py-3.5 bg-[#96baf7] hover:bg-[#1952c4] text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none mb-4">
              Send
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-medium">
              No payment charged until approved by owner
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
