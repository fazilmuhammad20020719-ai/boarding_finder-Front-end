import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getListingById, createBooking } from '../services/api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [activeDuration, setActiveDuration] = useState(searchParams.get('duration') || '6');
  const [moveInDate, setMoveInDate] = useState(searchParams.get('date') || '');

  // Pre-fill with logged-in user's profile data
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [university, setUniversity] = useState(
    user?.university ? `${user.university}${user.course ? ` — ${user.course}` : ''}` : ''
  );
  const [specialRequests, setSpecialRequests] = useState('');

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(id);
        const data = response.listing;

        let rawImages = data.image_urls || data.images;
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
        if (!Array.isArray(parsedImages)) parsedImages = [];

        let primaryImage = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";
        if (parsedImages.length > 0 && parsedImages[0]) {
          const firstImg = parsedImages[0];
          if (firstImg.includes('drive.google.com/uc?id=')) {
            primaryImage = firstImg.replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1000';
          } else if (firstImg.startsWith('http')) {
            if (firstImg.includes('drive.google.com/open?id=')) {
              const fileId = firstImg.split('id=')[1];
              primaryImage = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            } else {
              primaryImage = firstImg;
            }
          } else if (firstImg.startsWith('/')) {
            primaryImage = `http://localhost:5000${firstImg}`;
          } else {
            primaryImage = `http://localhost:5000/uploads/${firstImg}`;
          }
        }

        setListing({
          ...data,
          parsed_image_url: primaryImage
        });
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      }
    };
    fetchListing();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const getDurationMonths = () => {
    return parseInt(activeDuration);
  };

  if (!listing) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  const durationMonths = getDurationMonths();
  const rentPrice = parseFloat(listing.price) || 0;
  const securityDeposit = listing.security_deposit ? parseFloat(listing.security_deposit) : rentPrice;
  const total = (rentPrice * durationMonths) + securityDeposit;

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={2} activeTab="" />
      {step === 3 ? (
        <main className="flex-grow flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-6 py-10 text-center">
          <div className="w-24 h-24 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#10b981] mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Booking Requested!</h1>
          <p className="text-white/60 mb-10 text-[15px] font-medium leading-relaxed max-w-md mx-auto">
            Your request for <span className="font-bold text-[#FACC15]">{listing.name}</span> has been sent. The owner will respond within 24 hours.
          </p>

          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] w-full mb-10 text-left max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between text-[14px]">
                <span className="text-white/60 font-medium">Property</span>
                <span className="font-extrabold text-white">{listing.title}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-white/60 font-medium">Move-in</span>
                <span className="font-extrabold text-white">TBD</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-white/60 font-medium">Duration</span>
                <span className="font-extrabold text-white">{durationMonths} months</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-white/60 font-medium">Monthly Rent</span>
                <span className="font-extrabold text-white">LKR {rentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[15px] mt-4 pt-4 border-t border-[#333]">
                <span className="text-white/60 font-bold">Total</span>
                <span className="font-black text-white">LKR {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="max-w-md w-full mx-auto">
            <button
              onClick={() => navigate('/home')}
              className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none text-[15px]"
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
            className="flex items-center gap-2 text-[#FACC15] font-semibold text-sm mb-6 hover:underline bg-transparent border-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          {/* Title and Progress Bar */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Book Boarding</h1>
            <div className="flex gap-2">
              <div className="h-1.5 w-32 bg-[#FACC15] rounded-full"></div>
              <div className={`h-1.5 w-32 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#FACC15]' : 'bg-[#333]'}`}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ===== LEFT COLUMN: FORM ===== */}
            <div className="lg:col-span-2">
              <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-sm border border-[#333]">

                {step === 1 ? (
                  <>
                    <h2 className="text-[17px] font-extrabold text-white mb-8 tracking-tight">Booking Details</h2>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>

                      {/* Row 1: Date and Duration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">Move-In Date</label>
                          <input
                            type="date"
                            value={moveInDate}
                            onChange={(e) => setMoveInDate(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-white font-medium focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">Duration</label>
                          <div className="grid grid-cols-4 gap-2">
                            {['3mo', '6mo', '9mo', '12mo'].map(dur => (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => setActiveDuration(dur.replace('mo', ''))}
                                className={`py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${activeDuration === dur.replace('mo', '')
                                    ? 'bg-[#FACC15]/10 border-[#FACC15] text-[#FACC15]'
                                    : 'bg-[#111] border-[#333] text-white/50 hover:bg-[#222]'
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
                        <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Juan Dela Cruz"
                          className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-white font-medium focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] placeholder-white/40"
                          required
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="juan@up.edu.ph"
                          className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-white font-medium focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] placeholder-white/40"
                          required
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+63 9XX XXX XXXX"
                          className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-white font-medium focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] placeholder-white/40"
                          required
                        />
                      </div>

                      {/* University */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">University & Course</label>
                        <input
                          type="text"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="UP Diliman — BS Computer Science"
                          className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-white font-medium focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] placeholder-white/40"
                          required
                        />
                      </div>

                      {/* Special Requests */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#FACC15] tracking-wider mb-2 uppercase">Special Requests</label>
                        <textarea
                          rows="3"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="Any special requirements..."
                          className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-white font-medium focus:outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15] placeholder-white/40 resize-none"
                        ></textarea>
                      </div>

                      {/* Submit */}
                      <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none text-[15px]">
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
                    <h2 className="text-[17px] font-extrabold text-white mb-8 tracking-tight">Payment Method</h2>

                    <div className="space-y-4 mb-8">
                      {['GCash', 'PayMaya', 'Bank Transfer', 'Cash on Move-in'].map(method => (
                        <div
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === method
                              ? 'border-[#FACC15] bg-[#FACC15]/10 text-white'
                              : 'border-[#333] bg-[#111] hover:border-white/20 text-white/80'
                            }`}
                        >
                          <div className="font-bold">{method}</div>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-center text-white/50 font-medium mb-6">
                      I agree to the <span className="text-[#FACC15] font-bold cursor-pointer hover:underline">Terms of Service</span> and house rules of {listing.title}.
                    </p>

                    <button
                      disabled={isSubmitting}
                      onClick={async () => {
                        if (!paymentMethod) {
                          alert('Please select a payment method');
                          return;
                        }

                        setIsSubmitting(true);
                        try {
                          const messagePayload = `Name: ${fullName} | Email: ${email} | Phone: ${phone} | Uni: ${university} | Requests: ${specialRequests}`;

                          await createBooking({
                            listing_id: listing.listing_id || id,
                            move_in_date: moveInDate,
                            duration_months: durationMonths,
                            message: messagePayload
                          });

                          navigate(`/booking-confirmation?propertyId=${listing.listing_id || id}&duration=${durationMonths}&payment=${encodeURIComponent(paymentMethod)}&name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`);
                        } catch (err) {
                          console.error(err);
                          alert(err.message || 'Failed to create booking');
                          setIsSubmitting(false);
                        }
                      }}
                      className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none text-[15px] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ===== RIGHT COLUMN: SUMMARY ===== */}
            <div className="lg:col-span-1">
              <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] sticky top-28">

                {/* Property Image */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#111] mb-5">
                  <img
                    src={listing.parsed_image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600"; }}
                  />
                </div>

                {/* Property Name and Location */}
                <div className="mb-6">
                  <h3 className="text-[19px] font-extrabold text-white mb-1">{listing.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-white/60 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {listing.location}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#333] mb-5"></div>

                {/* Cost Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-white/60 font-medium">Monthly Rent</span>
                    <span className="font-extrabold text-white">LKR {rentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-white/60 font-medium">Duration</span>
                    <span className="font-extrabold text-white">{durationMonths} months</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-white/60 font-medium">Security Deposit</span>
                    <span className="font-extrabold text-white">LKR {securityDeposit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#333] mb-5"></div>

                {/* Total */}
                <div className="flex justify-between items-center text-lg">
                  <span className="font-extrabold text-white">Total</span>
                  <span className="font-black text-[#FACC15]">LKR {total.toLocaleString()}</span>
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
