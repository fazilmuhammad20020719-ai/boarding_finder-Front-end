import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/Image/Image.png';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('userLoggedIn') === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans antialiased overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} activeTab="home" />

      {/* ===== HERO SECTION ===== */}
      <main
        className="min-h-screen w-full flex items-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col justify-center h-full">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.1] tracking-tight text-white">
              Find the perfect <br />
              boarding house <br />
              near your campus
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/80 max-w-md leading-relaxed">
              Connect with verified boarding house owners near top universities across the Philippines.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {isLoggedIn ? (
                <Link 
                  to="/home" 
                  className="px-8 py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-full shadow-lg transition-all text-center text-sm"
                >
                  Explore Boarding Houses ➔
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-[#0f172a] font-bold rounded-full shadow-lg transition-all text-center text-sm"
                >
                  Get Started ➔
                </Link>
              )}
            </div>

            {/* Stats Row */}
            <div className="mt-12 flex flex-wrap gap-4 md:gap-5">
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-5 min-w-[130px] md:min-w-[150px] flex-1 sm:flex-initial">
                <div className="text-3xl md:text-[32px] font-bold text-white tracking-tight">
                  1,240+
                </div>
                <div className="text-xs md:text-sm text-white/60 mt-1.5 font-normal">
                  Listings
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-5 min-w-[130px] md:min-w-[150px] flex-1 sm:flex-initial">
                <div className="text-3xl md:text-[32px] font-bold text-white tracking-tight">
                  48
                </div>
                <div className="text-xs md:text-sm text-white/60 mt-1.5 font-normal">
                  Universities
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-5 min-w-[130px] md:min-w-[150px] flex-1 sm:flex-initial">
                <div className="text-3xl md:text-[32px] font-bold text-white tracking-tight">
                  8,400+
                </div>
                <div className="text-xs md:text-sm text-white/60 mt-1.5 font-normal">
                  Students
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;