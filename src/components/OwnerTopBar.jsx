import React, { useState, useEffect } from 'react';
import BrandLogo from './Logo';
import UserAvatar from './UserAvatar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations, getNotifications } from '../services/api';
import { subscribe } from '../services/realtime';

// Owner top bar in the same style as the student Navbar:
// logo left, rounded pill of links in the middle, profile pill + dropdown right.
// Dashboard links open the matching Owner Dashboard tab. On the dashboard itself
// pass activeTab + onTabChange so the tabs switch without a page change.
const LINKS = [
  { label: 'Overview', tab: 'overview' },
  { label: 'My Listings', tab: 'listings' },
  { label: 'Bookings', tab: 'bookings' },
  { label: 'Messages', tab: 'messages' },
  { label: 'Maintenance', tab: 'maintenance' },
  { label: 'Payments', path: '/earnings' },
];

const MENU = [
  { to: '/profile', label: 'My Profile' },
  { to: '/my-listings', label: 'My Listings' },
  { to: '/add-listing', label: 'Add Listing' },
  { to: '/manage-reservations', label: 'Manage Reservations' },
  { to: '/earnings', label: 'Payments' },
  { to: '/settings', label: 'Account Settings' },
  { to: '/support', label: 'Help & Support' },
];

const linkClass = (active) =>
  active
    ? "relative text-[14px] font-medium text-[#FACC15] transition-colors px-4 py-1.5 bg-transparent border-none cursor-pointer whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-[#FACC15] after:rounded-full"
    : 'text-[14px] font-medium text-gray-300 hover:text-white transition-colors px-4 py-1.5 bg-transparent border-none cursor-pointer whitespace-nowrap';

const mobileLinkClass = (active) =>
  active
    ? 'text-left text-[15px] font-semibold text-[#FACC15] bg-[#222] px-4 py-2.5 rounded-xl inline-block w-fit border-none cursor-pointer'
    : 'text-left text-[15px] font-semibold text-gray-300 hover:text-white py-2 bg-transparent border-0 border-b border-solid border-[#333] cursor-pointer';

const OwnerTopBar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Same unread dots as the student Navbar
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [convRes, notifRes] = await Promise.all([getConversations(), getNotifications()]);
        if (convRes?.conversations) {
          setUnreadMessages(convRes.conversations.reduce((sum, c) => sum + (parseInt(c.unread_count) || 0), 0));
        }
        if (Array.isArray(notifRes)) setUnreadNotifications(notifRes.filter((n) => !n.is_read).length);
      } catch {
        // counts are optional
      }
    };
    fetchCounts();
    const offMessage = subscribe('message', fetchCounts);
    const offNotification = subscribe('notification', fetchCounts);
    const interval = setInterval(fetchCounts, 60000);
    return () => { clearInterval(interval); offMessage(); offNotification(); };
  }, []);

  const userName = user?.name || 'Owner';

  const isActive = (l) =>
    l.path ? location.pathname === l.path : location.pathname === '/owner-dashboard' && activeTab === l.tab;

  const go = (l) => {
    setIsMobileMenuOpen(false);
    if (l.path) navigate(l.path);
    else if (onTabChange) onTabChange(l.tab);
    else navigate('/owner-dashboard', { state: { tab: l.tab } });
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-black border-b border-[#222] shadow-sm z-50 sticky top-0 font-sans">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/owner-dashboard" onClick={() => onTabChange?.('overview')} className="flex items-center gap-2 sm:gap-3 min-w-0">
            <BrandLogo hideTextOnTiny />
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-1 bg-[#1A1A1A] rounded-full px-2 py-1.5 border border-[#333]">
            {LINKS.map((l) => (
              <button key={l.label} onClick={() => go(l)} className={linkClass(isActive(l))}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Notifications, profile, hamburger */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Messages (opens the dashboard Messages tab) */}
            <button onClick={() => go({ tab: 'messages' })} className="relative cursor-pointer hover:scale-105 transition-transform block bg-transparent border-none p-0" title="Messages">
              <svg className="w-6 h-6 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {unreadMessages > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-black"></span>
              )}
            </button>

            <Link to="/notifications" className="relative cursor-pointer hover:scale-105 transition-transform block">
              <svg className="w-6 h-6 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-black"></span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 border border-[#333] bg-[#1A1A1A] hover:bg-[#222] rounded-full text-white text-sm font-semibold transition-all cursor-pointer"
              >
                <UserAvatar user={user} className="w-7 h-7 text-xs shadow-sm" />
                <span className="hidden sm:inline">{userName.split(' ')[0]}</span>
                <svg className="w-3.5 h-3.5 fill-current text-gray-400 hidden sm:inline" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 bg-[#1A1A1A] border border-[#333] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    {MENU.map((m) => (
                      <Link key={m.to} to={m.to} onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#222] hover:text-white">
                        {m.label}
                      </Link>
                    ))}
                    <hr className="border-[#333] my-1" />
                    <button
                      onClick={handleLogout}
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
            {LINKS.map((l) => (
              <button key={l.label} onClick={() => go(l)} className={mobileLinkClass(isActive(l))}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default OwnerTopBar;
