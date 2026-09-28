import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations, getNotifications } from '../services/api';


const Navbar = ({ likedCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  React.useEffect(() => {
    if (isAuthenticated) {
      const fetchCounts = async () => {
        try {
          const [convRes, notifRes] = await Promise.all([
            getConversations(),
            getNotifications()
          ]);

          if (convRes && convRes.conversations) {
            const unreadMsgCount = convRes.conversations.reduce((sum, c) => sum + (parseInt(c.unread_count) || 0), 0);
            setUnreadMessages(unreadMsgCount);
          }

          if (Array.isArray(notifRes)) {
            const unreadNotifCount = notifRes.filter(n => !n.is_read).length;
            setUnreadNotifications(unreadNotifCount);
          }
        } catch (error) {
          console.error("Failed to fetch unread counts:", error);
        }
      };

      fetchCounts();
      const interval = setInterval(fetchCounts, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    logout();
    navigate('/login');
  };

  // Derive display values from the authenticated user
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const getLinkClass = (tabName) => {
    const targetPath = `/${tabName}`;
    const isActive = location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`);
    return isActive
      ? "relative text-[14px] font-medium text-[#FACC15] transition-colors px-4 py-1.5 after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-[#FACC15] after:rounded-full"
      : "text-[14px] font-medium text-gray-300 hover:text-white transition-colors px-4 py-1.5";
  };

  const getMobileLinkClass = (tabName) => {
    const targetPath = `/${tabName}`;
    const isActive = location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`);
    return isActive
      ? "text-[15px] font-semibold text-[#FACC15] bg-[#222] px-4 py-2.5 rounded-xl inline-block w-fit"
      : "text-[15px] font-semibold text-gray-300 hover:text-white py-2 border-b border-[#333]";
  };

  return (
    <nav className="w-full bg-black border-b border-[#222] shadow-sm z-50 sticky top-0 font-sans">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="font-bold text-[22px] text-white tracking-tight">BoardingFinder<span className="text-[#FACC15]">.</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden xl:flex items-center gap-1 bg-[#1A1A1A] rounded-full px-2 py-1.5 border border-[#333]">
              <Link to="/home" className={getLinkClass('home')}>
                Home
              </Link>
              <Link to="/search" className={getLinkClass('search')}>
                Search
              </Link>
              <Link to="/map" className={getLinkClass('map')}>
                Map View
              </Link>
              <Link to="/roommate-matcher" className={getLinkClass('roommate-matcher')}>
                Find a Roommate
              </Link>
              <Link to="/community-forum" className={getLinkClass('community-forum')}>
                Community Forum
              </Link>
              <Link to="/about" className={getLinkClass('about')}>
                About us
              </Link>
              <Link to="/contact" className={getLinkClass('contact')}>
                Contact us
              </Link>
            </div>
          )}

          {/* User Actions & Mobile Hamburger */}
          <div className="flex items-center gap-4 sm:gap-5">
            {isAuthenticated ? (
              <>
                {/* Messages Badge */}
                <Link to="/messages" className="relative cursor-pointer hover:scale-105 transition-transform block">
                  <svg className="w-6 h-6 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1.5 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-black"></span>
                  )}
                </Link>

                {/* Notifications Badge */}
                <Link to="/notifications" className="relative cursor-pointer hover:scale-105 transition-transform block">
                  <svg className="w-6 h-6 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1.5 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-black"></span>
                  )}
                </Link>

                {/* Saved Hearts Badge */}
                <Link to="/saved-homes" className="relative cursor-pointer hover:scale-105 transition-transform block">
                  <svg className="w-6 h-6 text-gray-300 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {likedCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black">
                      {likedCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
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

                  {/* Click Toggled Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      {/* Invisible backdrop click-handler to close menu when clicking outside */}
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      ></div>

                      <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/saved-homes"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          Saved Homes
                        </Link>
                        <Link
                          to="/roommate-matcher"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          Find a Roommate
                        </Link>
                        <Link
                          to="/my-bookings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          My Bookings
                        </Link>
                        <Link
                          to="/payment-history"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          Payment History
                        </Link>
                        <Link
                          to="/maintenance-portal"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          Maintenance Portal
                        </Link>
                        <Link
                          to="/support"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          Support & Help
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white"
                        >
                          Account Settings
                        </Link>
                        <hr className="border-[#333] my-1" />
                        <button
                          onClick={handleLogoutClick}
                          className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 sm:px-6 sm:py-2 border border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10 font-bold text-xs sm:text-sm rounded-full transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-[#FACC15] text-black hover:bg-[#EAB308] font-bold text-xs sm:text-sm rounded-full transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger Button for Mobile */}
            {isAuthenticated && (
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
            )}

          </div>
        </div>
      </div>

      {/* ===== MOBILE NAVIGATION DROPDOWN ===== */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-black border-b border-[#333] shadow-lg py-4 px-6 z-40 animate-slideDown">
          <div className="flex flex-col gap-2">
            <Link
              to="/home"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('home')}
            >
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('search')}
            >
              Search
            </Link>
            <Link
              to="/map"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('map')}
            >
              Map View
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('about')}
            >
              About us
            </Link>
            <Link
              to="/community-forum"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('community-forum')}
            >
              Community Forum
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('contact')}
            >
              Contact us
            </Link>
            <Link
              to="/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass('support')}
            >
              Support & Help
            </Link>
            {!isAuthenticated && (
              <div className="flex gap-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 border border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10 font-bold text-[15px] rounded-xl transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 bg-[#FACC15] text-black hover:bg-[#EAB308] font-bold text-[15px] rounded-xl transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
