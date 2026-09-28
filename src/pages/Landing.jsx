import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/Image/Image.png';
import Navbar from '../components/Navbar';
import { getStats } from '../services/api';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('userLoggedIn') === 'true');
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data.stats);
      } catch (err) {
        console.error('Stats fetch error:', err);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
  };

  const formatStat = (value, suffix = '') => {
    if (value === null || value === undefined) return '...';
    return value.toLocaleString() + suffix;
  };

  const statCards = stats
    ? [
      { value: formatStat(stats.activeListings, '+'), label: 'Listings' },
      { value: formatStat(stats.partnerUniversities), label: 'Universities' },
      { value: formatStat(stats.studentsPlaced, '+'), label: 'Students' },
    ]
    : [
      { value: '...', label: 'Listings' },
      { value: '...', label: 'Universities' },
      { value: '...', label: 'Students' },
    ];

  return (
    <div className="relative min-h-screen w-full bg-black font-sans antialiased overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} activeTab="home" />

      {/* ===== HERO SECTION ===== */}
      <main
        className="min-h-screen w-full flex items-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark overlay to match topbar's dark tone */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* Subtle yellow glow accent — echoes the topbar's #FACC15 accent */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full bg-[#FACC15]/5 blur-3xl pointer-events-none z-0" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col justify-center h-full">
          <div className="max-w-2xl text-left">

            {/* Live badge — mirrors Navbar's pill style */}
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse" />
              <span className="text-xs font-semibold text-white/90 tracking-wide">
                {statsLoading
                  ? 'Loading listings...'
                  : `${formatStat(stats?.activeListings, '+')} verified listings available`}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.1] tracking-tight text-white">
              Find the perfect <br />
              boarding house <br />
              near your <span className="text-[#FACC15]">campus</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/70 max-w-md leading-relaxed font-normal">
              Connect with verified boarding house owners near top universities across Sri Lanka.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isLoggedIn ? (
                <Link
                  to="/home"
                  className="px-7 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-full shadow-lg transition-all text-center text-sm tracking-wide"
                >
                  Explore Boarding Houses →
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-7 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-full shadow-lg transition-all text-center text-sm tracking-wide"
                  >
                    Get Started →
                  </Link>

                </>
              )}
            </div>

            {/* Stats Row — live data from backend */}
            <div className="mt-12 flex flex-wrap gap-3 md:gap-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1A1A1A]/80 backdrop-blur-md border border-[#333] rounded-2xl px-6 py-4 min-w-[120px] flex-1 sm:flex-initial hover:border-[#FACC15]/40 transition-colors"
                >
                  <div className={`text-2xl md:text-[28px] font-bold text-white tracking-tight transition-opacity duration-300 ${statsLoading ? 'opacity-40' : 'opacity-100'}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 mt-1 font-normal uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

