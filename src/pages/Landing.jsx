import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/Image/Image.png';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans antialiased overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-white flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6"/>
                  <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7"/>
                  <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7"/>
                  <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7"/>
                  <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7"/>
                  <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7"/>
                </svg>
              </div>
              <span className="font-semibold text-2xl text-white tracking-tight">
                BoardingFinder
              </span>
            </div>

            {/* Sign In button */}
            <Link to="/login">
              <button className="px-6 py-2 text-sm font-medium text-white border border-white rounded-full hover:bg-white/10 transition-all duration-200">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

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