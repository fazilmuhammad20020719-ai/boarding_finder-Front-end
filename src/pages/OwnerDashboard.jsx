import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteListing } from '../services/api';

const OWNER_MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Juan Fernando",
    property: "Tranquil Lodge - Room 2B",
    avatar: "https://ui-avatars.com/api/?name=Juan+Fernando&background=e8f7ec&color=10b981",
    lastMessage: "Hi Sarah, just confirming if the WiFi is already set up?",
    time: "09:15 AM",
    unread: 1,
    online: true,
    messages: [
      { id: 101, sender: "them", text: "Hi Sarah, just confirming if the WiFi is already set up?", time: "09:15 AM", date: "Today" }
    ]
  },
  {
    id: 2,
    name: "Emily Chen",
    property: "BlueSky Residences - Studio",
    avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=ebf3ff&color=1952c4",
    lastMessage: "Thank you for the quick response!",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: 201, sender: "me", text: "Hi Emily, the maintenance guy will be there at 2 PM.", time: "02:00 PM", date: "Yesterday" },
      { id: 202, sender: "them", text: "Thank you for the quick response!", time: "02:15 PM", date: "Yesterday" }
    ]
  }
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState(OWNER_MOCK_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState(OWNER_MOCK_CONVERSATIONS[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [ownerBookings, setOwnerBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'listings') return;
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/listings/owner/mine`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        setListings(data.listings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [navigate, activeTab]);

  useEffect(() => {
    if (activeTab !== 'bookings') return;
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/bookings/owner-bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setOwnerBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, [navigate, activeTab]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteListing(id);
        setListings(prev => prev.filter(listing => listing.listing_id !== id));
      } catch (err) {
        console.error("Delete Error:", err);
        alert('Failed to delete listing: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");

      setOwnerBookings(prev => prev.map(b =>
        b.booking_id === bookingId ? { ...b, status } : b
      ));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today"
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeChatId) {
        return {
          ...conv,
          lastMessage: newMessage,
          time: "Just now",
          messages: [...conv.messages, newMsgObj]
        };
      }
      return conv;
    }));

    setNewMessage('');
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, unread: 0 } : conv
    ));
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      {/* Top Bar */}
      <header className="bg-[#1e3a8a] text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Owner Dashboard</div>
            <div className="text-sm font-extrabold">Roberto Cruz</div>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-2 justify-center flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'overview' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'listings' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'bookings' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-5 py-2.5 font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'messages' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Messages
          </button>
        </div>

        <div className="flex items-center justify-end w-1/4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors cursor-pointer bg-transparent border-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#e8f7ec] text-[#10b981] flex items-center justify-center text-2xl font-bold">
                LKR
              </div>
              <div>
                <div className="text-[22px] font-black text-[#0f172a]">LKR 38,500</div>
                <div className="text-xs font-semibold text-[#64748b]">Monthly Revenue</div>
                <div className="text-xs font-bold text-[#10b981] mt-1">+12% this month</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <div className="text-[22px] font-black text-[#0f172a]">12/15</div>
                <div className="text-xs font-semibold text-[#64748b]">Rooms Occupied</div>
                <div className="text-xs font-bold text-[#10b981] mt-1">80% occupancy</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#fff8e6] text-[#f59e0b] flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              </div>
              <div>
                <div className="text-[22px] font-black text-[#0f172a]">4.7★</div>
                <div className="text-xs font-semibold text-[#64748b]">Average Rating</div>
                <div className="text-xs font-bold text-[#10b981] mt-1">142 reviews</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]/60 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div>
                <div className="text-[22px] font-black text-[#0f172a]">23</div>
                <div className="text-xs font-semibold text-[#64748b]">Inquiries</div>
                <div className="text-xs font-bold text-[#10b981] mt-1">8 unanswered</div>
              </div>
            </div>

          </div>
        )}



        {/* Content Area */}
        {activeTab === 'listings' && (
          <div>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-medium">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1952c4]"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-[24px] p-12 text-center border border-[#e2e8f0]/60 shadow-sm">
                <div className="w-16 h-16 bg-[#ebf3ff] text-[#1952c4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-1">No listings found</h3>
                <p className="text-[#64748b] mb-6">You haven't added any properties yet.</p>
                <button
                  onClick={() => navigate('/add-listing')}
                  className="bg-[#1952c4] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1546a8] transition-colors border-none cursor-pointer"
                >
                  Add Your First Listing
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => navigate('/add-listing')}
                  className="w-full mb-8 bg-transparent rounded-3xl border-2 border-dashed border-[#cbd5e1] hover:border-[#1952c4] hover:bg-[#ebf3ff]/50 transition-all cursor-pointer py-8 flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-white text-slate-400 group-hover:text-[#1952c4] flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-[16px] font-bold text-[#64748b] group-hover:text-[#1952c4] transition-colors">Add New Listing</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div key={listing.listing_id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#e2e8f0]/60 flex flex-col">
                      <div className="h-48 bg-slate-200 relative">
                        <img
                          src={(listing.image_urls && listing.image_urls.length > 0)
                            ? (listing.image_urls[0].includes('drive.google.com/uc?id=')
                              ? listing.image_urls[0].replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1000'
                              : (listing.image_urls[0].startsWith('http') ? listing.image_urls[0] : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/${listing.image_urls[0].startsWith('/') ? listing.image_urls[0].substring(1) : listing.image_urls[0]}`)
                            )
                            : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800"}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-extrabold text-[#0f172a] mb-1 line-clamp-1">{listing.title}</h3>
                        <div className="text-sm font-medium text-[#64748b] mb-2 line-clamp-1">
                          {listing.location}
                        </div>
                        <div className="text-[17px] font-black text-[#1952c4] mb-4">
                          LKR {Number(listing.price).toLocaleString()} <span className="text-sm font-medium text-[#64748b]">/mo</span>
                        </div>

                        <div className="mt-auto grid grid-cols-3 gap-3">
                          <button
                            onClick={() => navigate(`/property/${listing.listing_id}`)}
                            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-[#10b981] bg-white border border-[#e2e8f0] rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/edit-listing/${listing.listing_id}`)}
                            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-[#1952c4] bg-white border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(listing.listing_id)}
                            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-white border border-[#e2e8f0] rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60 flex flex-col min-h-[400px]">
              <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Revenue — Last 6 Months</h3>
              {/* Mock Chart Area */}
              <div className="flex-grow flex items-end justify-between px-4 pb-8 relative">
                <div className="absolute bottom-16 left-4 right-4 border-b border-dashed border-[#e2e8f0]/80"></div>
                <div className="absolute bottom-32 left-4 right-4 border-b border-dashed border-[#e2e8f0]/80"></div>
                <div className="absolute bottom-48 left-4 right-4 border-b border-dashed border-[#e2e8f0]/80"></div>

                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-24"></div>
                  <div className="text-xs font-semibold text-slate-400">Jan</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-32"></div>
                  <div className="text-xs font-semibold text-slate-400">Feb</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-48"></div>
                  <div className="text-xs font-semibold text-slate-400">Mar</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-[#1952c4]/20 rounded-t-md h-40"></div>
                  <div className="text-xs font-semibold text-slate-400">Apr</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-slate-100 rounded-t-md h-56"></div>
                  <div className="text-xs font-semibold text-slate-400">May</div>
                </div>
                <div className="flex flex-col items-center gap-2 z-10 w-1/6">
                  <div className="w-8 md:w-12 bg-[#1952c4] rounded-t-md h-64"></div>
                  <div className="text-xs font-semibold text-slate-400">Jun</div>
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-[#e2e8f0]/60">
              <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-6">Pending Requests</h3>

              <div className="space-y-4">

                {/* Request 1 */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm">
                      M
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0f172a]">Maria Reyes</div>
                      <div className="text-xs text-[#64748b]">Room 3A • Jul 1, 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center hover:bg-[#d1f0db] transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                {/* Request 2 */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0f172a]">Ana Cruz</div>
                      <div className="text-xs text-[#64748b]">Room 1C • Jul 8, 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center hover:bg-[#d1f0db] transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                {/* Request 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-sm">
                      C
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0f172a]">Carlo Lim</div>
                      <div className="text-xs text-[#64748b]">Room 2B • Jul 12, 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#e8f7ec] text-[#10b981] flex items-center justify-center hover:bg-[#d1f0db] transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors border-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Bookings Area */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#f0f4f9] text-[#64748b] text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-5 rounded-tl-3xl">STUDENT</th>
                    <th className="px-6 py-5">LISTING</th>
                    <th className="px-6 py-5">PERIOD</th>
                    <th className="px-6 py-5">STATUS</th>
                    <th className="px-6 py-5">AMOUNT</th>
                    <th className="px-6 py-5 rounded-tr-3xl">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] font-medium text-[#0f172a]">
                  {bookingsLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading bookings...</td>
                    </tr>
                  ) : ownerBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No bookings found.</td>
                    </tr>
                  ) : (
                    ownerBookings.map(booking => (
                      <tr key={booking.booking_id} className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 font-bold">
                          {booking.seeker_name}
                          <div className="text-xs text-[#64748b] font-normal">{booking.seeker_email}</div>
                        </td>
                        <td className="px-6 py-5 text-[#64748b]">{booking.title}</td>
                        <td className="px-6 py-5 text-[#64748b]">
                          {new Date(booking.move_in_date).toLocaleDateString()}
                          <div className="text-xs">{booking.duration_months} Months</div>
                        </td>
                        <td className="px-6 py-5">
                          {booking.status === 'pending' && <span className="bg-[#fff8e6] text-[#f59e0b] px-3 py-1.5 rounded-full text-xs font-bold">pending</span>}
                          {booking.status === 'approved' && <span className="bg-[#e8f7ec] text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">approved</span>}
                          {booking.status === 'rejected' && <span className="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold">rejected</span>}
                          {booking.status === 'cancelled' && <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-xs font-bold">cancelled</span>}
                        </td>
                        <td className="px-6 py-5 font-bold text-[#1952c4]">LKR {Number(booking.total_amount).toLocaleString()}</td>
                        <td className="px-6 py-5">
                          {booking.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateBookingStatus(booking.booking_id, 'approved')} className="bg-[#1952c4] hover:bg-[#1546a8] text-white px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Approve</button>
                              <button onClick={() => handleUpdateBookingStatus(booking.booking_id, 'rejected')} className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none">Decline</button>
                            </div>
                          ) : (
                            <span className="text-[#94a3b8]">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Content Area */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 flex overflow-hidden min-h-[600px] h-[calc(100vh-250px)]">

            {/* Left Sidebar (Conversation List) */}
            <div className="w-full md:w-[350px] border-r border-[#e2e8f0]/60 flex flex-col bg-white">

              {/* Header */}
              <div className="p-5 border-b border-[#e2e8f0]/60">
                <h2 className="text-xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Student Messages</h2>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f4f7f9] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-grow overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No conversations found.</div>
                ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectChat(conv.id)}
                      className={`p-4 border-b border-[#e2e8f0]/40 cursor-pointer transition-colors hover:bg-slate-50 flex items-start gap-3 ${activeChatId === conv.id ? 'bg-[#ebf3ff]/50' : ''}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className={`text-[15px] font-bold truncate ${conv.unread > 0 ? 'text-[#0f172a]' : 'text-[#334155]'}`}>
                            {conv.name}
                          </h3>
                          <span className={`text-[11px] whitespace-nowrap ml-2 ${conv.unread > 0 ? 'text-[#1952c4] font-bold' : 'text-slate-400'}`}>
                            {conv.time}
                          </span>
                        </div>

                        <div className="text-[11px] font-bold text-[#1952c4] mb-1 truncate">
                          {conv.property}
                        </div>

                        <div className="flex justify-between items-center gap-2">
                          <p className={`text-[13px] truncate ${conv.unread > 0 ? 'font-semibold text-[#0f172a]' : 'text-slate-500'}`}>
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <div className="w-5 h-5 rounded-full bg-[#1952c4] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {conv.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Main Area (Active Chat) */}
            <div className="hidden md:flex flex-grow flex-col bg-[#f4f7f9]/30 h-full">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="h-[76px] px-6 border-b border-[#e2e8f0]/60 bg-white flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                        {activeChat.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-[16px] font-extrabold text-[#0f172a]">{activeChat.name}</h2>
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
                          {activeChat.property}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors border-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </button>
                      <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors border-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
                    {/* Date Divider */}
                    <div className="flex justify-center my-2">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {activeChat.messages[0]?.date || "Today"}
                      </span>
                    </div>

                    {activeChat.messages.map((msg, index) => {
                      const isMe = msg.sender === 'me';
                      const showDate = index > 0 && activeChat.messages[index - 1].date !== msg.date;

                      return (
                        <React.Fragment key={msg.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                {msg.date}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isMe
                                  ? 'bg-[#1952c4] text-white rounded-br-none'
                                  : 'bg-white border border-[#e2e8f0]/60 text-[#0f172a] rounded-bl-none'
                                  }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[11px] font-semibold text-slate-400 mt-1 mx-1">
                                {msg.time}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-[#e2e8f0]/60 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                      <button type="button" className="p-3 text-slate-400 hover:text-[#1952c4] transition-colors rounded-full hover:bg-slate-100 flex-shrink-0 border-none cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>

                      <div className="flex-grow bg-[#f4f7f9] rounded-2xl border border-transparent focus-within:border-[#1952c4]/30 focus-within:bg-white transition-all">
                        <textarea
                          rows="1"
                          placeholder="Type a message to the student..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                          className="w-full bg-transparent border-none px-4 py-3 text-[14px] text-[#0f172a] focus:outline-none resize-none max-h-32"
                          style={{ minHeight: '46px' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 border-none ${newMessage.trim()
                          ? 'bg-[#1952c4] text-white shadow-md hover:bg-[#1546a8] cursor-pointer'
                          : 'bg-[#e2e8f0] text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        <svg className="w-5 h-5 translate-x-0.5 -translate-y-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-transparent">
                  <div className="w-20 h-20 bg-[#ebf3ff] rounded-full flex items-center justify-center text-[#1952c4] mb-5 shadow-sm">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">Student Messages</h3>
                  <p className="text-slate-500 text-[15px] max-w-sm">Select a conversation from the sidebar to view details or send a new message to your tenants.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default OwnerDashboard;
