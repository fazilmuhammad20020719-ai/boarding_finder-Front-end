import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/Image/Image.png';
import Navbar from '../components/Navbar';
import logoImg from '../assets/Image/Logo.png';

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
    <div className="relative min-h-screen w-full bg-black font-sans antialiased overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <div className="relative z-50">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} activeTab="home" transparent={true} />
      </div>

      {/* ===== HERO SECTION ===== */}
      <main className="min-h-screen w-full flex items-center relative overflow-hidden">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        
        {/* Semi-transparent Black Overlay for Strong Text Contrast (15-25% opacity) */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col justify-center h-full">
          <div className="max-w-3xl text-left">

            {/* HERO TYPOGRAPHY */}
            <h1 className="text-5xl sm:text-6xl md:text-[72px] font-extrabold uppercase leading-[1.05] tracking-tight text-white mb-6">
              Find the <span className="text-yellow-400">perfect</span> <br />
              <span className="text-yellow-400">boarding house</span> <br />
              near your campus
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed mb-10 font-medium">
              Connect with verified boarding house owners near top universities across the Philippines. Secure your stay instantly.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-5">
              {isLoggedIn ? (
                <Link 
                  to="/home" 
                  className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold uppercase tracking-wide rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Explore Boarding Houses ➔
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold uppercase tracking-wide rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Get Started ➔
                </Link>
              )}
            </div>

            {/* STATS ROW */}
            <div className="mt-16 flex flex-wrap gap-5">
              {/* Card 1 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl px-8 py-6 min-w-[140px] flex-1 sm:flex-initial text-center md:text-left">
                <div className="text-4xl font-extrabold text-yellow-400 tracking-tight">
                  1,240+
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">
                  Listings
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl px-8 py-6 min-w-[140px] flex-1 sm:flex-initial text-center md:text-left">
                <div className="text-4xl font-extrabold text-yellow-400 tracking-tight">
                  48
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">
                  Universities
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl px-8 py-6 min-w-[140px] flex-1 sm:flex-initial text-center md:text-left">
                <div className="text-4xl font-extrabold text-yellow-400 tracking-tight">
                  8,400+
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">
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