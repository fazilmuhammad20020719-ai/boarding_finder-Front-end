import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../services/api';

const getIconForType = (type) => {
  switch (type) {
    case 'booking_approved':
      return (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#10b981]/20">
          <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'message':
      return (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#FACC15]/20">
          <svg className="w-5 h-5 text-[#FACC15]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      );
    case 'payment_reminder':
      return (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#f59e0b]/20">
          <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case 'system_alert':
    default:
      return (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#8b5cf6]/20">
          <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.is_read) return;

    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) { console.error(err); }
  };

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) { }
    return 2;
  })();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.is_read;
    return true;
  });

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 md:px-8 py-10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Notifications</h1>
            <p className="text-white/60 font-medium text-sm">
              You have <span className="font-bold text-[#FACC15]">{unreadCount} unread</span> alerts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#1A1A1A] rounded-full p-1 border border-[#333] shadow-sm flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer border-none ${activeTab === 'all' ? 'bg-[#FACC15] text-black' : 'bg-transparent text-white/60 hover:text-white'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer border-none flex items-center gap-2 ${activeTab === 'unread' ? 'bg-[#FACC15] text-black' : 'bg-transparent text-white/60 hover:text-white'
                  }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className={`w-2 h-2 rounded-full ${activeTab === 'unread' ? 'bg-black' : 'bg-red-500'}`}></span>
                )}
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="hidden sm:block text-[#FACC15] hover:text-[#EAB308] text-sm font-bold hover:underline transition-all bg-transparent border-none cursor-pointer whitespace-nowrap"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-white/50">Loading...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-3xl p-12 text-center shadow-sm border border-[#333] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white/50 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">You're all caught up!</h3>
              <p className="text-white/50 text-sm max-w-xs mx-auto">
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
                  if (notification.link && notification.link !== '#') navigate(notification.link);
                }}
                className={`relative bg-[#1A1A1A] rounded-2xl p-5 border transition-all cursor-pointer group flex items-start gap-4 ${!notification.is_read
                    ? 'border-[#FACC15]/50 shadow-md bg-gradient-to-r from-[#1A1A1A] to-[#FACC15]/10'
                    : 'border-[#333] shadow-sm hover:border-[#444]'
                  }`}
              >
                {/* Unread dot indicator */}
                {!notification.is_read && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-[#FACC15] rounded-r-full"></div>
                )}

                {/* Icon */}
                {getIconForType(notification.type)}

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h4 className={`text-[15px] font-bold ${!notification.is_read ? 'text-white' : 'text-white/70'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs font-semibold text-white/40 whitespace-nowrap">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-2 ${!notification.is_read ? 'text-white/90 font-medium' : 'text-white/50'}`}>
                    {notification.message}
                  </p>
                  <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions (Hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="w-8 h-8 rounded-full bg-black hover:bg-red-500/10 text-white/50 hover:text-red-500 flex items-center justify-center transition-colors border-none cursor-pointer"
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
