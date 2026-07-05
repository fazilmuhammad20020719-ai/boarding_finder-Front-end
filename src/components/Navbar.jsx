import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn = false, onLogout, likedCount = 2 }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="w-full bg-white border-b border-[#e2e8f0]/80 shadow-sm z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1952c4] flex items-center justify-center text-white shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2"/>
                <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </div>
            <span className="font-bold text-[22px] text-[#0f172a] tracking-tight">BoardingFinder</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              Home
            </Link>
            <Link to="/home" className="text-[15px] font-semibold text-[#1952c4] bg-[#ebf3ff] px-4 py-1.5 rounded-full shadow-sm transition-all">
              Search
            </Link>
            <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              Map View
            </Link>
            <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              About us
            </Link>
            <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              Contact us
            </Link>

            {isLoggedIn && (
              <>
                <div className="w-[1px] h-6 bg-[#e2e8f0]"></div>
                <div className="flex items-center gap-5">
                  {/* Saved Hearts Badge */}
                  <div className="relative cursor-pointer hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-[#475569] hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {likedCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                        {likedCount}
                      </span>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-2.5 px-3 py-1.5 border border-[#e2e8f0] bg-slate-50 hover:bg-slate-100 rounded-full text-slate-700 text-sm font-semibold transition-all cursor-pointer">
                      <div className="w-7 h-7 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-xs shadow-sm">
                        J
                      </div>
                      <span>Juan</span>
                      <svg className="w-3.5 h-3.5 fill-current text-slate-500" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </button>
                    {/* Hover Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
                      <Link to="/home" className="block px-4 py-2 text-sm text-[#475569] hover:bg-slate-50">My Profile</Link>
                      <Link to="/home" className="block px-4 py-2 text-sm text-[#475569] hover:bg-slate-50">Saved Homes</Link>
                      <hr className="border-[#e2e8f0] my-1" />
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
