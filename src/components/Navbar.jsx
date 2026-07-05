import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/Image/Logo.png';

const Navbar = ({ isLoggedIn = false, onLogout, likedCount = 2, activeTab = 'search' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  const getLinkClass = (tabName) => {
    const isActive = activeTab === tabName;
    return isActive
      ? "text-[15px] font-semibold text-[#1952c4] bg-[#ebf3ff] px-4 py-1.5 rounded-full shadow-sm transition-all"
      : "text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors px-4 py-1.5";
  };

  return (
    <nav className="w-full bg-white border-b border-[#e2e8f0]/80 shadow-sm z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#e2e8f0] bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <img src={logoImg} alt="BoardingFinder Logo" className="w-11 h-11 object-contain" />
            </div>
            <span className="font-bold text-[22px] text-[#0f172a] tracking-tight">BoardingFinder</span>
          </Link>

          {/* Desktop Navigation Links */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/home" className={getLinkClass('home')}>
                Home
              </Link>
              <Link to="/home" className={getLinkClass('search')}>
                Search
              </Link>
              <Link to="/map" className={getLinkClass('map')}>
                Map View
              </Link>
              <Link to="/home" className={getLinkClass('about')}>
                About us
              </Link>
              <Link to="/home" className={getLinkClass('contact')}>
                Contact us
              </Link>
            </div>
          )}

          {/* User Actions & Mobile Hamburger */}
          <div className="flex items-center gap-4 sm:gap-5">
            {isLoggedIn ? (
              <>
                {/* Saved Hearts Badge */}
                <Link to="/saved-homes" className="relative cursor-pointer hover:scale-105 transition-transform block">
                  <svg className="w-6 h-6 text-[#475569] hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {likedCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {likedCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 border border-[#e2e8f0] bg-slate-50 hover:bg-slate-100 rounded-full text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-xs shadow-sm">
                      J
                    </div>
                    <span className="hidden sm:inline">Juan</span>
                    <svg className="w-3.5 h-3.5 fill-current text-slate-500 hidden sm:inline" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </button>
                  
                  {/* Click Toggled Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      {/* Invisible backdrop click-handler to close menu when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      ></div>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-[#475569] hover:bg-slate-50"
                        >
                          My Profile
                        </Link>
                        <Link 
                          to="/saved-homes" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-[#475569] hover:bg-slate-50"
                        >
                          Saved Homes
                        </Link>
                        <hr className="border-[#e2e8f0] my-1" />
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogoutClick();
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="inline-block px-5 py-2 sm:px-6 sm:py-2.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger Button for Mobile */}
            {isLoggedIn && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer border-none bg-transparent"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ===== MOBILE NAVIGATION DROPDOWN ===== */}
      {isLoggedIn && isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-[#e2e8f0] shadow-lg py-4 px-6 z-40 animate-slideDown">
          <div className="flex flex-col gap-4">
            <Link 
              to="/home" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] py-2 border-b border-slate-100"
            >
              Home
            </Link>
            <Link 
              to="/home" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-[15px] font-semibold text-[#1952c4] bg-[#ebf3ff] px-4 py-2.5 rounded-xl shadow-sm inline-block w-fit"
            >
              Search
            </Link>
            <Link 
              to="/map" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] py-2 border-b border-slate-100"
            >
              Map View
            </Link>
            <Link 
              to="/home" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] py-2 border-b border-slate-100"
            >
              About us
            </Link>
            <Link 
              to="/home" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] py-2 border-b border-slate-100"
            >
              Contact us
            </Link>
            {!isLoggedIn && (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-[15px] font-semibold text-[#1952c4] bg-[#ebf3ff] px-4 py-2.5 rounded-xl shadow-sm inline-block w-fit text-center mt-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
