import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-[#e2e8f0]/80 shadow-sm z-50">
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
          <div className="flex items-center" style={{ gap: '24px' }}>
            <Link to="/" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              Home
            </Link>
            <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              Search
            </Link>
            <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
              Map View
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
