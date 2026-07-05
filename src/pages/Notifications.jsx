import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking_approved',
    title: 'Booking Approved!',
    message: 'Roberto Cruz has approved your booking request for BlueSky Residences.',
    time: '2 hours ago',
    date: 'July 5, 2026',
    read: false,
    link: '/my-bookings',
    icon: (
      <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-[#e8f7ec]'
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message from Sarah',
    message: 'Hi Juan! Just checking what time you plan to move in next week?',
    time: '5 hours ago',
    date: 'July 5, 2026',
    read: false,
    link: '#',
    icon: (
      <svg className="w-5 h-5 text-[#1952c4]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    bgColor: 'bg-[#ebf3ff]'
  },
  {
    id: 3,
    type: 'payment_reminder',
    title: 'Upcoming Rent Due',
    message: 'Your monthly rent of Rs. 11,500 for Tranquil Lodge is due in 3 days.',
    time: '1 day ago',
    date: 'July 4, 2026',
    read: true,
    link: '/my-bookings',
    icon: (
      <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-[#fff8e6]'
  },
  {
    id: 4,
    type: 'system_alert',
    title: 'Security Deposit Refunded',
    message: 'Your security deposit of Rs. 18,500 for Metro Haven has been successfully refunded to your bank account.',
    time: '2 weeks ago',
    date: 'June 20, 2026',
    read: true,
    link: '#',
    icon: (
      <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-[#f5f3ff]'
  },
  {
    id: 5,
    type: 'system_alert',
    title: 'Welcome to BoardingFinder!',
    message: 'Complete your profile to get personalized recommendations for boarding houses near your university.',
    time: '1 month ago',
    date: 'June 5, 2026',
    read: true,
    link: '/profile',
    icon: (
      <svg className="w-5 h-5 text-[#0ea5e9]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    bgColor: 'bg-[#f0f9ff]'
  }
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) {}
    return 2;
  })();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 md:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Notifications</h1>
            <p className="text-[#64748b] font-medium text-sm">
              You have <span className="font-bold text-[#1952c4]">{unreadCount} unread</span> alerts.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-white rounded-full p-1 border border-[#e2e8f0]/80 shadow-sm flex">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer border-none ${
                  activeTab === 'all' ? 'bg-[#f4f7f9] text-[#0f172a]' : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('unread')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer border-none flex items-center gap-2 ${
                  activeTab === 'unread' ? 'bg-[#f4f7f9] text-[#0f172a]' : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'unread' ? 'bg-[#1952c4]' : 'bg-red-500'}`}></span>
                )}
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="hidden sm:block text-[#1952c4] hover:text-[#1546a8] text-sm font-bold hover:underline transition-all bg-transparent border-none cursor-pointer whitespace-nowrap"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#e2e8f0]/60 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#f4f7f9] rounded-2xl flex items-center justify-center text-[#94a3b8] mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">You're all caught up!</h3>
              <p className="text-[#64748b] text-sm max-w-xs mx-auto">
                {activeTab === 'unread' 
                  ? "You don't have any unread notifications right now." 
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link !== '#') navigate(notification.link);
                }}
                className={`relative bg-white rounded-2xl p-5 border transition-all cursor-pointer group flex items-start gap-4 ${
                  !notification.read 
                    ? 'border-[#1952c4]/30 shadow-md bg-gradient-to-r from-white to-[#f0f4ff]/40' 
                    : 'border-[#e2e8f0]/60 shadow-sm hover:border-[#cbd5e1]'
                }`}
              >
                {/* Unread dot indicator */}
                {!notification.read && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-[#1952c4] rounded-r-full"></div>
                )}
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${notification.bgColor}`}>
                  {notification.icon}
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h4 className={`text-[15px] font-bold ${!notification.read ? 'text-[#0f172a]' : 'text-[#334155]'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs font-semibold text-[#94a3b8] whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-2 ${!notification.read ? 'text-[#334155] font-medium' : 'text-[#64748b]'}`}>
                    {notification.message}
                  </p>
                  <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    {notification.date}
                  </div>
                </div>

                {/* Actions (Hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button 
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors border-none cursor-pointer"
                    title="Remove notification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
      </main>
    </div>
  );
};

export default Notifications;
