import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Reuse mock data for this page so it doesn't break when refreshed
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

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [activeDuration, setActiveDuration] = useState('6mo');
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
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
      setListing(MOCK_LISTINGS[1]); // Fallback
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const getDurationMonths = () => {
    return parseInt(activeDuration.replace('mo', ''));
  };

  if (!listing) return <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center">Loading...</div>;

  const durationMonths = getDurationMonths();
  const securityDeposit = listing.price; // typically 1 month rent
  const total = (listing.price * durationMonths) + securityDeposit;

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={2} activeTab="" />
      {step === 3 ? (
        <main className="flex-grow flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-6 py-10 text-center">
          <div className="w-24 h-24 bg-[#e8f7ec] rounded-full flex items-center justify-center text-[#10b981] mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Booking Requested!</h1>
          <p className="text-[#64748b] mb-10 text-[15px] font-medium leading-relaxed max-w-md mx-auto">
            Your request for <span className="font-bold text-[#1952c4]">{listing.name}</span> has been sent. The owner will respond within 24 hours.
          </p>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 w-full mb-10 text-left max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#64748b] font-medium">Property</span>
                <span className="font-extrabold text-[#0f172a]">{listing.name}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#64748b] font-medium">Move-in</span>
                <span className="font-extrabold text-[#0f172a]">TBD</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#64748b] font-medium">Duration</span>
                <span className="font-extrabold text-[#0f172a]">{durationMonths} months</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#64748b] font-medium">Monthly Rent</span>
                <span className="font-extrabold text-[#0f172a]">Rs. {listing.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[15px] mt-4 pt-4 border-t border-[#e2e8f0]/80">
                <span className="text-[#64748b] font-bold">Total</span>
                <span className="font-black text-[#0f172a]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-md w-full mx-auto">
            <button 
              onClick={() => navigate('/home')}
              className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none text-[15px]"
            >
              Back to Home
            </button>
          </div>
        </main>
      ) : (
        <main className="flex-grow max-w-6xl w-full mx-auto px-6 md:px-12 py-10">
        
        {/* Back Button */}
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className="flex items-center gap-2 text-[#1952c4] font-semibold text-sm mb-6 hover:underline bg-transparent border-none cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Title and Progress Bar */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-3">Book Boarding</h1>
          <div className="flex gap-2">
            <div className="h-1.5 w-32 bg-[#1952c4] rounded-full"></div>
            <div className={`h-1.5 w-32 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#1952c4]' : 'bg-[#d8e5f8]'}`}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ===== LEFT COLUMN: FORM ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60">
              
              {step === 1 ? (
                <>
                  <h2 className="text-[17px] font-extrabold text-[#0f172a] mb-8 tracking-tight">Booking Details</h2>

                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    
                    {/* Row 1: Date and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">Move-In Date</label>
                        <input 
                          type="date" 
                          className="w-full bg-[#f4f7f9] border border-[#e2e8f0]/80 rounded-xl px-4 py-3.5 text-[15px] text-[#0f172a] font-medium focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4]" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">Duration</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['3mo', '6mo', '9mo', '12mo'].map(dur => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => setActiveDuration(dur)}
                              className={`py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                                activeDuration === dur 
                                  ? 'bg-[#ebf3ff] border-[#1952c4] text-[#1952c4]' 
                                  : 'bg-white border-[#e2e8f0] text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              {dur}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Juan Dela Cruz"
                        className="w-full bg-[#f4f7f9] border border-[#e2e8f0]/80 rounded-xl px-4 py-3.5 text-[15px] text-[#0f172a] font-medium focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4] placeholder-slate-400" 
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="juan@up.edu.ph"
                        className="w-full bg-[#f4f7f9] border border-[#e2e8f0]/80 rounded-xl px-4 py-3.5 text-[15px] text-[#0f172a] font-medium focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4] placeholder-slate-400" 
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+63 9XX XXX XXXX"
                        className="w-full bg-[#f4f7f9] border border-[#e2e8f0]/80 rounded-xl px-4 py-3.5 text-[15px] text-[#0f172a] font-medium focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4] placeholder-slate-400" 
                        required
                      />
                    </div>

                    {/* University */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">University & Course</label>
                      <input 
                        type="text" 
                        placeholder="UP Diliman — BS Computer Science"
                        className="w-full bg-[#f4f7f9] border border-[#e2e8f0]/80 rounded-xl px-4 py-3.5 text-[15px] text-[#0f172a] font-medium focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4] placeholder-slate-400" 
                        required
                      />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1952c4] tracking-wider mb-2 uppercase">Special Requests</label>
                      <textarea 
                        rows="3"
                        placeholder="Any special requirements..."
                        className="w-full bg-[#f4f7f9] border border-[#e2e8f0]/80 rounded-xl px-4 py-3.5 text-[15px] text-[#0f172a] font-medium focus:outline-none focus:border-[#1952c4] focus:ring-1 focus:ring-[#1952c4] placeholder-slate-400 resize-none" 
                      ></textarea>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button type="submit" className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none text-[15px]">
                        Continue to Payment 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>

                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-[17px] font-extrabold text-[#0f172a] mb-8 tracking-tight">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    {['GCash', 'PayMaya', 'Bank Transfer', 'Cash on Move-in'].map(method => (
                      <div 
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === method 
                            ? 'border-[#1952c4] bg-[#ebf3ff]' 
                            : 'border-[#e2e8f0]/80 bg-white hover:border-[#cbd5e1]'
                        }`}
                      >
                        <div className="font-bold text-[#0f172a]">{method}</div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-center text-slate-500 font-medium mb-6">
                    I agree to the <span className="text-[#1952c4] font-bold cursor-pointer hover:underline">Terms of Service</span> and house rules of {listing.name}.
                  </p>

                  <button 
                    onClick={() => {
                      if (!paymentMethod) {
                        alert('Please select a payment method');
                        return;
                      }
                      navigate(`/booking-confirmation?propertyId=${listing.id}&duration=${durationMonths}&payment=${encodeURIComponent(paymentMethod)}&name=${encodeURIComponent('Juan Fernando')}&email=${encodeURIComponent('juan.fernando@mrt.ac.lk')}`);
                    }}
                    className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none text-[15px]"
                  >
                    Confirm Booking
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ===== RIGHT COLUMN: SUMMARY ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 sticky top-28">
              
              {/* Property Image */}
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 mb-5">
                <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Property Name and Location */}
              <div className="mb-6">
                <h3 className="text-[19px] font-extrabold text-[#0f172a] mb-1">{listing.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-[#64748b] font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {listing.location}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#e2e8f0]/80 mb-5"></div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-[#64748b] font-medium">Monthly Rent</span>
                  <span className="font-extrabold text-[#0f172a]">Rs. {listing.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-[#64748b] font-medium">Duration</span>
                  <span className="font-extrabold text-[#0f172a]">{durationMonths} months</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-[#64748b] font-medium">Security Deposit</span>
                  <span className="font-extrabold text-[#0f172a]">Rs. {securityDeposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#e2e8f0]/80 mb-5"></div>

              {/* Total */}
              <div className="flex justify-between items-center text-lg">
                <span className="font-extrabold text-[#0f172a]">Total</span>
                <span className="font-black text-[#1952c4]">Rs. {total.toLocaleString()}</span>
              </div>

            </div>
          </div>

        </div>
        </main>
      )}
    </div>
  );
};

export default BookingPage;
