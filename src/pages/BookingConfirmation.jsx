import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_LISTINGS = [
  {
    id: 1, name: "Metro Haven", university: "University of Moratuwa", location: "Katubedda, Moratuwa",
    price: 18500, rating: 4.9, reviews: 203, type: "studio_unit", gender: "mixed",
    amenities: ["Wifi", "Parking", "Gym", "Pool"], distance: "0.2 km", beds: 2,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2, name: "BlueSky Residences", university: "University of Colombo", location: "Colombo 03",
    price: 13500, rating: 4.8, reviews: 142, type: "dormitory", gender: "mixed",
    amenities: ["Wifi", "Parking", "Laundry", "CCTV", "Meals"], distance: "0.3 km", beds: 4,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3, name: "Sunrise Apartments", university: "University of Kelaniya", location: "Kelaniya, Gampaha",
    price: 22500, rating: 4.7, reviews: 178, type: "studio_unit", gender: "mixed",
    amenities: ["Wifi", "Parking", "Gym", "CCTV"], distance: "0.1 km", beds: 1,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4, name: "Lakeside Suites", university: "University of Ruhuna", location: "Galle",
    price: 8500, rating: 4.6, reviews: 51, type: "dormitory", gender: "female",
    amenities: ["Wifi", "Meals", "Parking"], distance: "1.2 km", beds: 3,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5, name: "Tranquil Lodge", university: "University of Sri Jayewardenepura", location: "Nugegoda",
    price: 11500, rating: 4.5, reviews: 89, type: "boarding_house", gender: "female",
    amenities: ["Wifi", "Meals", "CCTV", "Curfew"], distance: "0.5 km", beds: 2,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6, name: "Scholars' Den", university: "University of Moratuwa", location: "Katubedda, Moratuwa",
    price: 9500, rating: 4.3, reviews: 67, type: "boarding_house", gender: "male",
    amenities: ["Wifi", "CCTV", "Laundry"], distance: "0.8 km", beds: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
  }
];

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showContent, setShowContent] = useState(false);
  const [checkAnimDone, setCheckAnimDone] = useState(false);
  const confettiRef = useRef(null);

  // Read booking details from URL search params
  const propertyId = parseInt(searchParams.get('propertyId') || '2');
  const duration = parseInt(searchParams.get('duration') || '6');
  const paymentMethod = searchParams.get('payment') || 'Cash on Move-in';
  const bookingName = searchParams.get('name') || 'Juan Fernando';
  const bookingEmail = searchParams.get('email') || 'juan.fernando@mrt.ac.lk';

  // Find the listing
  const localListings = localStorage.getItem('listings');
  let allListings = MOCK_LISTINGS;
  if (localListings) {
    try { allListings = JSON.parse(localListings); } catch (e) { /* fallback */ }
  }
  const listing = allListings.find(l => l.id === propertyId) || MOCK_LISTINGS[1];

  const securityDeposit = listing.price;
  const totalRent = listing.price * duration;
  const total = totalRent + securityDeposit;

  // Generate a booking reference
  const bookingRef = `BF-${new Date().getFullYear()}-${String(propertyId).padStart(3, '0')}${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const bookingDate = new Date().toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' });
  const bookingTime = new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });

  // Animate entrance
  useEffect(() => {
    const t1 = setTimeout(() => setCheckAnimDone(true), 800);
    const t2 = setTimeout(() => setShowContent(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Confetti effect
  useEffect(() => {
    if (!confettiRef.current) return;
    const canvas = confettiRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#1952c4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const particles = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      });
    }

    let animFrame;
    let frame = 0;
    const maxFrames = 180;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.rotationSpeed;
        if (frame > maxFrames - 60) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (frame < maxFrames) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) {}
    return 2;
  })();

  const timelineSteps = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Booking Submitted",
      desc: `Your booking request was submitted on ${bookingDate} at ${bookingTime}.`,
      status: "done"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: "Owner Notification",
      desc: "The property owner has been notified and will review your request.",
      status: "active"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Owner Response",
      desc: "Expect a response within 24 hours. You'll receive an email and notification.",
      status: "pending"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Move In!",
      desc: "Once approved, coordinate your move-in date with the owner.",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans antialiased text-[#0f172a]">
      {/* Confetti Canvas */}
      <canvas
        ref={confettiRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">

        {/* ===== SUCCESS HERO ===== */}
        <div className="text-center mb-10">
          {/* Animated Checkmark Circle */}
          <div className="relative mx-auto mb-6" style={{ width: 96, height: 96 }}>
            {/* Outer ring pulse */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.15)',
                animation: checkAnimDone ? 'confirmPulse 2s ease-in-out infinite' : 'none',
              }}
            />
            {/* Inner circle */}
            <div
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                transform: checkAnimDone ? 'scale(1)' : 'scale(0)',
                transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
              }}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: checkAnimDone ? 0 : 30,
                  transition: 'stroke-dashoffset 0.6s ease 0.3s',
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1
            className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.5s ease',
            }}
          >
            Booking Confirmed!
          </h1>
          <p
            className="text-[#64748b] font-medium text-[15px] max-w-md mx-auto leading-relaxed"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.5s ease 0.1s',
            }}
          >
            Your booking request for <span className="font-bold text-[#1952c4]">{listing.name}</span> has been successfully submitted. Here's your receipt.
          </p>
        </div>

        {/* ===== CONTENT GRID ===== */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s ease 0.2s',
          }}
        >
          {/* Booking Reference Banner */}
          <div className="bg-gradient-to-r from-[#1952c4] to-[#2563eb] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
            style={{ boxShadow: '0 8px 32px rgba(25,82,196,0.25)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-white/70 text-xs font-bold uppercase tracking-wider">Booking Reference</div>
                <div className="text-white text-xl font-black tracking-wide">{bookingRef}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-xs font-bold uppercase tracking-wider">Status</div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full mt-1">
                <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                <span className="text-white font-bold text-sm">Pending Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* ===== LEFT: RECEIPT DETAILS ===== */}
            <div className="lg:col-span-3 space-y-6">

              {/* Property Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-44 sm:h-auto flex-shrink-0 bg-slate-100">
                    <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">{listing.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-[#64748b] font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {listing.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#fff8e6] text-[#f59e0b] px-2.5 py-1 rounded-lg flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-sm font-bold">{listing.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {listing.amenities?.slice(0, 4).map(a => (
                        <span key={a} className="bg-[#f4f7f9] text-[#475569] text-xs font-semibold px-3 py-1 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60">
                <h3 className="text-[15px] font-extrabold text-[#0f172a] mb-5 tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1952c4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Booking Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Guest Name</div>
                    <div className="text-[15px] font-bold text-[#0f172a]">{bookingName}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Email</div>
                    <div className="text-[15px] font-bold text-[#0f172a]">{bookingEmail}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Duration</div>
                    <div className="text-[15px] font-bold text-[#0f172a]">{duration} months</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Payment Method</div>
                    <div className="text-[15px] font-bold text-[#0f172a]">{paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Booking Date</div>
                    <div className="text-[15px] font-bold text-[#0f172a]">{bookingDate}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Property Type</div>
                    <div className="text-[15px] font-bold text-[#0f172a] capitalize">{listing.type?.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60">
                <h3 className="text-[15px] font-extrabold text-[#0f172a] mb-5 tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1952c4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Payment Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#64748b] font-medium">Monthly Rent</span>
                    <span className="font-bold text-[#0f172a]">LKR {listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#64748b] font-medium">Duration</span>
                    <span className="font-bold text-[#0f172a]">× {duration} months</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#64748b] font-medium">Subtotal (Rent)</span>
                    <span className="font-bold text-[#0f172a]">LKR {totalRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#64748b] font-medium">Security Deposit (1 month)</span>
                    <span className="font-bold text-[#0f172a]">LKR {securityDeposit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#e2e8f0] my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-extrabold text-[#0f172a]">Total Amount</span>
                  <span className="text-[20px] font-black text-[#1952c4]">LKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ===== RIGHT: TIMELINE & ACTIONS ===== */}
            <div className="lg:col-span-2 space-y-6">

              {/* What Happens Next — Timeline */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60">
                <h3 className="text-[15px] font-extrabold text-[#0f172a] mb-6 tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1952c4]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  What Happens Next
                </h3>

                <div className="space-y-0">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      {/* Vertical line */}
                      {idx < timelineSteps.length - 1 && (
                        <div
                          className="absolute left-[19px] top-10 w-0.5 h-[calc(100%-8px)]"
                          style={{
                            background: step.status === 'done'
                              ? '#10b981'
                              : '#e2e8f0'
                          }}
                        />
                      )}
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                        style={{
                          background: step.status === 'done'
                            ? '#e8f7ec'
                            : step.status === 'active'
                              ? '#ebf3ff'
                              : '#f4f7f9',
                          color: step.status === 'done'
                            ? '#10b981'
                            : step.status === 'active'
                              ? '#1952c4'
                              : '#94a3b8',
                        }}
                      >
                        {step.icon}
                      </div>
                      {/* Text */}
                      <div className="pb-6">
                        <div className={`text-sm font-bold mb-0.5 ${step.status === 'pending' ? 'text-[#94a3b8]' : 'text-[#0f172a]'}`}>
                          {step.title}
                        </div>
                        <div className={`text-xs leading-relaxed ${step.status === 'pending' ? 'text-[#cbd5e1]' : 'text-[#64748b]'}`}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-br from-[#fff8e6] to-[#fffdf5] rounded-3xl p-5 border border-[#fde68a]/60">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#f59e0b] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#92400e] mb-1">Important</div>
                    <div className="text-xs text-[#a16207] leading-relaxed">
                      A confirmation email has been sent to <span className="font-bold">{bookingEmail}</span>. The property owner will review your request and respond within 24 hours.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full py-3.5 bg-white border-2 border-[#e2e8f0] hover:border-[#1952c4] text-[#0f172a] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-[14px]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>

                <button
                  onClick={() => navigate('/my-bookings')}
                  className="w-full py-3.5 bg-white border-2 border-[#e2e8f0] hover:border-[#1952c4] text-[#0f172a] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-[14px]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View My Bookings
                </button>

                <button
                  onClick={() => navigate('/home')}
                  className="w-full py-3.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors cursor-pointer border-none flex items-center justify-center gap-2 text-[14px] shadow-sm"
                  style={{ boxShadow: '0 4px 16px rgba(25,82,196,0.25)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </button>
              </div>

              {/* Help Card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e2e8f0]/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0e6ff] text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0f172a]">Need Help?</div>
                    <div className="text-xs text-[#64748b]">Our support team is here for you</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-2.5 bg-[#f4f7f9] hover:bg-[#e8ecf0] text-[#475569] font-semibold rounded-xl transition-colors cursor-pointer border-none text-[13px]"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Keyframe Styles */}
      <style>{`
        @keyframes confirmPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.25); opacity: 0; }
        }
        @media print {
          nav, button, canvas { display: none !important; }
          .bg-gradient-to-r { background: #1952c4 !important; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
