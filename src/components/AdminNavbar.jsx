import React, { useState } from 'react';
import BrandLogo from './Logo';
import { Link } from 'react-router-dom';

// Admin top bar in the same style as the student Navbar:
// logo left, rounded pill of section links in the middle, profile pill + dropdown right.
// The links switch the Admin Dashboard tabs instead of changing the route.
const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'verifications', label: 'Verifications' },
  { key: 'users', label: 'Users' },
  { key: 'listings', label: 'Listings' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'announcements', label: 'Announcements' },
];

const linkClass = (active) =>
  active
    ? "relative text-[14px] font-medium text-[#FACC15] transition-colors px-4 py-1.5 bg-transparent border-none cursor-pointer after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-[#FACC15] after:rounded-full"
    : 'text-[14px] font-medium text-gray-300 hover:text-white transition-colors px-4 py-1.5 bg-transparent border-none cursor-pointer';

const mobileLinkClass = (active) =>
  active
    ? 'text-left text-[15px] font-semibold text-[#FACC15] bg-[#222] px-4 py-2.5 rounded-xl inline-block w-fit border-none cursor-pointer'
    : 'text-left text-[15px] font-semibold text-gray-300 hover:text-white py-2 bg-transparent border-0 border-b border-solid border-[#333] cursor-pointer';

const AdminNavbar = ({ activeTab, onTabChange, pendingCount = 0, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const userName = user?.name || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  const go = (key) => {
    onTabChange(key);
    setIsMobileMenuOpen(false);
  };

  const badge = (t) =>
    t.key === 'verifications' && pendingCount > 0 ? (
      <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
    ) : null;

  return (
    <nav className="w-full bg-black border-b border-[#222] shadow-sm z-50 sticky top-0 font-sans">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <button onClick={() => go('overview')} className="flex items-center gap-2 sm:gap-3 min-w-0 bg-transparent border-none cursor-pointer p-0">
            <BrandLogo hideTextOnTiny />
          </button>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-1 bg-[#1A1A1A] rounded-full px-2 py-1.5 border border-[#333]">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => go(t.key)} className={linkClass(activeTab === t.key)}>
                {t.label}
                {badge(t)}
              </button>
            ))}
          </div>

          {/* Profile + hamburger */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 border border-[#333] bg-[#1A1A1A] hover:bg-[#222] rounded-full text-white text-sm font-semibold transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#333] text-[#FACC15] flex items-center justify-center font-bold text-xs shadow-sm">
                  {userInitial}
                </div>
                <span className="hidden sm:inline">{userName.split(' ')[0]}</span>
                <svg className="w-3.5 h-3.5 fill-current text-gray-400 hidden sm:inline" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white">
                      My Profile
                    </Link>
                    <Link to="/settings" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white">
                      Account Settings
                    </Link>
                    <hr className="border-[#333] my-1" />
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }}
                      className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 bg-transparent border-none cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-gray-400 hover:bg-[#222] hover:text-white transition-all cursor-pointer border-none bg-transparent"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-black border-b border-[#333] shadow-lg py-4 px-6 z-40 animate-slideDown">
          <div className="flex flex-col gap-2">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => go(t.key)} className={mobileLinkClass(activeTab === t.key)}>
                {t.label}
                {badge(t)}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
