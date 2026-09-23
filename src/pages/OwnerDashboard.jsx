import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteListing, getConversations, getMessages, sendMessage, markMessagesAsRead, getLinkedStudents, updateStudentStatus, getOwnerOverviewStats, getOwnerMaintenanceRequests, updateMaintenanceStatus } from '../services/api';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Messaging state
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // userId is derived directly from AuthContext — no localStorage needed
  const messagesEndRef = useRef(null);

  const [ownerBookings, setOwnerBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Student Management state
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Overview Stats state
  const [overviewStats, setOverviewStats] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Maintenance state
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'overview') return;
    const fetchOverview = async () => {
      setOverviewLoading(true);
      try {
        const data = await getOwnerOverviewStats();
        if (data.stats) {
          setOverviewStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch overview stats", err);
      } finally {
        setOverviewLoading(false);
      }
    };
    fetchOverview();
  }, [activeTab]);

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
        const parsedListings = (data.listings || []).map(listing => {
          let rawImages = listing.image_urls || listing.images;
          let parsedImages = [];
          if (Array.isArray(rawImages)) {
            parsedImages = rawImages;
          } else if (typeof rawImages === 'string') {
            try {
              parsedImages = JSON.parse(rawImages);
            } catch (e) {
              if (rawImages.startsWith('[') && rawImages.endsWith(']')) {
                parsedImages = rawImages.slice(1, -1).split(',').map(url => url.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
              } else {
                parsedImages = rawImages.split(',').map(url => url.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
              }
            }
          }

          let imageUrl = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";
          if (parsedImages.length > 0) {
            const firstImg = parsedImages[0];
            if (firstImg.includes('drive.google.com/uc?id=')) {
              imageUrl = firstImg.replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1000';
            } else if (firstImg.startsWith('http')) {
              imageUrl = firstImg;
            } else {
              const cleanUrl = firstImg.startsWith('/') ? firstImg.substring(1) : firstImg;
              const pathPrefix = cleanUrl.startsWith('images/') ? '' : 'images/';
              imageUrl = `/${pathPrefix}${cleanUrl}`;
            }
          }

          return {
            ...listing,
            parsed_image_url: imageUrl
          };
        });
        setListings(parsedListings);
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

  useEffect(() => {
    if (activeTab !== 'students') return;
    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        const data = await getLinkedStudents();
        setLinkedStudents(data.students || []);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'maintenance') return;
    const fetchMaintenance = async () => {
      setMaintenanceLoading(true);
      try {
        const data = await getOwnerMaintenanceRequests();
        setMaintenanceRequests(data || []);
      } catch (err) {
        console.error("Failed to fetch maintenance requests", err);
      } finally {
        setMaintenanceLoading(false);
      }
    };
    fetchMaintenance();
  }, [activeTab]);

  const handleUpdateMaintenanceTicket = async (ticketId, status) => {
    try {
      await updateMaintenanceStatus(ticketId, status);
      setMaintenanceRequests(prev => prev.map(t =>
        t.id === ticketId ? { ...t, status } : t
      ));
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

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

  const handleGenerateLease = async (bookingId) => {
    try {
      const { generateLease } = await import('../services/api');
      await generateLease(bookingId);
      alert("Lease generated successfully and is ready for the student to sign!");
      setOwnerBookings(prev => prev.map(b =>
        b.booking_id === bookingId ? { ...b, lease_status: 'pending' } : b
      ));
    } catch (err) {
      alert(err.message || "Failed to generate lease. Maybe one already exists?");
    }
  };

  const handleUpdateStudentStatus = async (studentId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this student's access?`)) return;

    try {
      await updateStudentStatus(studentId, action);
      // Optimistically update UI
      setLinkedStudents(prev => prev.map(s => {
        if (s.id !== studentId) return s;
        if (action === 'pause') return { ...s, account_status: 'paused' };
        if (action === 'reactivate') return { ...s, account_status: 'active' };
        if (action === 'remove') return { ...s, account_status: 'removed' };
        return s;
      }));
    } catch (err) {
      alert("Error updating student: " + err.message);
    }
  };



  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      if (res.conversations) {
        setConversations(res.conversations.map(c => ({
          id: c.conversation_id,
          name: c.other_name,
          property: c.property_title,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.other_name)}&background=e8f7ec&color=10b981`,
          lastMessage: c.last_message || "Start a conversation",
          time: c.last_message_time ? new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          unread: parseInt(c.unread_count) || 0,
          online: true,
          other_id: c.other_id,
          listing_id: c.listing_id
        })));
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const fetchMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await getMessages(chatId);
      if (res.messages) {
        // Use user.id from AuthContext — always accurate after login
        const currentUserId = user?.id;
        setMessages(res.messages.map(m => ({
          id: m.message_id,
          sender: m.sender_id == currentUserId ? "me" : "them",
          text: m.message_text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(m.created_at).toLocaleDateString()
        })));
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'messages' && activeChatId) {
      fetchMessages(activeChatId);
      const interval = setInterval(() => fetchMessages(activeChatId), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChatId, activeTab, user]);

  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    const msgText = newMessage.trim();
    setNewMessage('');

    // Optimistic UI update
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "me",
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    }]);

    try {
      await sendMessage({
        conversation_id: activeChatId,
        text: msgText
      });
      fetchConversations();
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  const handleSelectChat = async (id) => {
    setActiveChatId(id);
    try {
      await markMessagesAsRead(id);
      fetchConversations();
    } catch (err) { }
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
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      {/* Top Bar */}
      <header className="bg-black text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b border-[#333]">
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
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'overview' ? 'bg-[#FACC15] text-black shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'listings' ? 'bg-[#FACC15] text-black shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'bookings' ? 'bg-[#FACC15] text-black shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Bookings
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'messages' ? 'bg-[#FACC15] text-black shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Messages
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'students' ? 'bg-[#FACC15] text-black shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Students
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none ${activeTab === 'maintenance' ? 'bg-[#FACC15] text-black shadow-sm' : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Maintenance
          </button>
          <button
            onClick={() => navigate('/earnings')}
            className={`px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Earnings
          </button>
        </div>

        <div className="flex items-center justify-end w-1/4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/90 hover:text-[#FACC15] font-semibold transition-colors cursor-pointer bg-transparent border-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          overviewLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1952c4]"></div>
            </div>
          ) : overviewStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

              <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#10b981]/20 text-[#10b981] flex items-center justify-center text-2xl font-bold">
                  LKR
                </div>
                <div>
                  <div className="text-[22px] font-black text-white">LKR {Number(overviewStats.monthlyRevenue).toLocaleString()}</div>
                  <div className="text-xs font-semibold text-white/60">Monthly Revenue</div>
                  <div className="text-xs font-bold text-[#10b981] mt-1">This month</div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#1952c4]/20 text-[#1952c4] flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <div className="text-[22px] font-black text-white">{overviewStats.occupancy.occupied}/{overviewStats.occupancy.total}</div>
                  <div className="text-xs font-semibold text-white/60">Rooms Occupied</div>
                  <div className="text-xs font-bold text-[#10b981] mt-1">{overviewStats.occupancy.rate}% occupancy</div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                  <div className="text-[22px] font-black text-white">{overviewStats.reviews.average}★</div>
                  <div className="text-xs font-semibold text-white/60">Average Rating</div>
                  <div className="text-xs font-bold text-[#10b981] mt-1">{overviewStats.reviews.count} reviews</div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-sm border border-[#333] flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <div className="text-[22px] font-black text-white">{overviewStats.inquiries.total}</div>
                  <div className="text-xs font-semibold text-white/60">Inquiries</div>
                  <div className="text-xs font-bold text-[#10b981] mt-1">{overviewStats.inquiries.unanswered} unanswered</div>
                </div>
              </div>

            </div>
          ) : null
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FACC15]"></div>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-[24px] p-12 text-center border border-[#333] shadow-sm">
                <div className="w-16 h-16 bg-[#333] text-white/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No listings found</h3>
                <p className="text-white/60 mb-6">You haven't added any properties yet.</p>
                <button
                  onClick={() => navigate('/add-listing')}
                  className="bg-[#FACC15] text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#EAB308] transition-colors border-none cursor-pointer"
                >
                  Add Your First Listing
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => navigate('/add-listing')}
                  className="w-full mb-8 bg-transparent rounded-3xl border-2 border-dashed border-[#333] hover:border-[#FACC15] hover:bg-[#222] transition-all cursor-pointer py-8 flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#333] text-white/60 group-hover:text-[#FACC15] flex items-center justify-center transition-colors shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-[16px] font-bold text-white/60 group-hover:text-[#FACC15] transition-colors">Add New Listing</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div key={listing.listing_id} className="bg-[#1A1A1A] rounded-[24px] overflow-hidden shadow-sm border border-[#333] flex flex-col">
                      <div className="h-48 bg-slate-200 relative">
                        <img
                          src={listing.parsed_image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-extrabold text-white mb-1 line-clamp-1">{listing.title}</h3>
                        <div className="text-sm font-medium text-white/60 mb-2 line-clamp-1">
                          {listing.location}
                        </div>
                        <div className="text-[17px] font-black text-[#FACC15] mb-4">
                          LKR {Number(listing.price).toLocaleString()} <span className="text-sm font-medium text-white/60">/mo</span>
                        </div>

                        <div className="mt-auto grid grid-cols-3 gap-3">
                          <button
                            onClick={() => navigate(`/property/${listing.listing_id}`)}
                            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#111] border border-[#333] rounded-xl hover:bg-[#222] transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/edit-listing/${listing.listing_id}`)}
                            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-[#FACC15] bg-[#111] border border-[#333] rounded-xl hover:bg-[#222] transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(listing.listing_id)}
                            className="py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-[#111] border border-[#333] rounded-xl hover:bg-[#222] transition-colors cursor-pointer"
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

        {activeTab === 'overview' && !overviewLoading && overviewStats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-[#1A1A1A] rounded-3xl p-8 shadow-sm border border-[#333] flex flex-col min-h-[400px]">
              <h3 className="text-[17px] font-extrabold text-white mb-6">Revenue — Last 6 Months</h3>

              <div className="flex-grow flex items-end justify-between px-4 pb-8 relative">
                <div className="absolute bottom-16 left-4 right-4 border-b border-dashed border-[#333]"></div>
                <div className="absolute bottom-32 left-4 right-4 border-b border-dashed border-[#333]"></div>
                <div className="absolute bottom-48 left-4 right-4 border-b border-dashed border-[#333]"></div>

                {overviewStats.chartData.map((data, index) => {
                  const maxRevenue = Math.max(...overviewStats.chartData.map(d => d.revenue), 1000);
                  const heightPercent = (data.revenue / maxRevenue) * 100;
                  const isCurrentMonth = index === overviewStats.chartData.length - 1;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 z-10 w-1/6" title={`LKR ${data.revenue.toLocaleString()}`}>
                      <div
                        className={`w-8 md:w-12 rounded-t-md ${isCurrentMonth ? 'bg-[#FACC15]' : (data.revenue > 0 ? 'bg-[#FACC15]/20' : 'bg-[#333]')}`}
                        style={{ height: `${Math.max(heightPercent, 5)}%`, minHeight: '1rem' }}
                      ></div>
                      <div className="text-xs font-semibold text-white/60">{data.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Requests */}
            <div className="lg:col-span-1 bg-[#1A1A1A] rounded-3xl p-8 shadow-sm border border-[#333]">
              <h3 className="text-[17px] font-extrabold text-white mb-6">Pending Requests</h3>

              <div className="space-y-4">
                {overviewStats.pendingRequests.length === 0 ? (
                  <div className="text-sm text-white/60">No pending requests right now.</div>
                ) : (
                  overviewStats.pendingRequests.map(req => (
                    <div key={req.booking_id} className="flex items-center justify-between pb-4 border-b border-[#333]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FACC15]/20 text-[#FACC15] flex items-center justify-center font-bold text-sm">
                          {req.initial || req.seeker_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-white">{req.seeker_name}</div>
                          <div className="text-xs text-white/60">{req.listing_title} • {new Date(req.move_in_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          handleUpdateBookingStatus(req.booking_id, 'approved');
                          // Remove from pending locally to update UI
                          setOverviewStats(prev => ({
                            ...prev,
                            pendingRequests: prev.pendingRequests.filter(p => p.booking_id !== req.booking_id)
                          }));
                        }} className="w-8 h-8 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center hover:bg-[#10b981]/40 transition-colors border-none cursor-pointer" title="Approve">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </button>
                        <button onClick={() => {
                          handleUpdateBookingStatus(req.booking_id, 'rejected');
                          setOverviewStats(prev => ({
                            ...prev,
                            pendingRequests: prev.pendingRequests.filter(p => p.booking_id !== req.booking_id)
                          }));
                        }} className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/40 transition-colors border-none cursor-pointer" title="Decline">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Area */}
        {activeTab === 'bookings' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#222] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-5 rounded-tl-3xl">STUDENT</th>
                    <th className="px-6 py-5">LISTING</th>
                    <th className="px-6 py-5">PERIOD</th>
                    <th className="px-6 py-5">STATUS</th>
                    <th className="px-6 py-5">AMOUNT</th>
                    <th className="px-6 py-5 rounded-tr-3xl">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] font-medium text-white">
                  {bookingsLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-white/60">Loading bookings...</td>
                    </tr>
                  ) : ownerBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-white/60">No bookings found.</td>
                    </tr>
                  ) : (
                    ownerBookings.map(booking => (
                      <tr key={booking.booking_id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                        <td className="px-6 py-5 font-bold">
                          {booking.seeker_name}
                          <div className="text-xs text-white/60 font-normal">{booking.seeker_email}</div>
                        </td>
                        <td className="px-6 py-5 text-white/60">{booking.title}</td>
                        <td className="px-6 py-5 text-white/60">
                          {new Date(booking.move_in_date).toLocaleDateString()}
                          <div className="text-xs">{booking.duration_months} Months</div>
                        </td>
                        <td className="px-6 py-5">
                          {booking.status === 'pending' && <span className="bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold">pending</span>}
                          {booking.status === 'approved' && <span className="bg-[#10b981]/20 text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">approved</span>}
                          {booking.status === 'rejected' && <span className="bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold">rejected</span>}
                          {booking.status === 'cancelled' && <span className="bg-slate-500/20 text-slate-400 px-3 py-1.5 rounded-full text-xs font-bold">cancelled</span>}
                        </td>
                        <td className="px-6 py-5 font-bold text-[#FACC15]">LKR {Number(booking.total_amount).toLocaleString()}</td>
                        <td className="px-6 py-5">
                          {booking.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateBookingStatus(booking.booking_id, 'approved')} className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Approve</button>
                              <button onClick={() => handleUpdateBookingStatus(booking.booking_id, 'rejected')} className="bg-red-500/20 text-red-500 hover:bg-red-500/40 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none">Decline</button>
                            </div>
                          ) : booking.status === 'approved' ? (
                            <div className="flex gap-2">
                              {!booking.lease_status && (
                                <button onClick={() => handleGenerateLease(booking.booking_id)} className="bg-[#10b981]/20 hover:bg-[#10b981]/40 text-[#10b981] px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Generate Lease</button>
                              )}
                              {booking.lease_status === 'pending' && (
                                <button onClick={() => navigate(`/digital-lease?booking_id=${booking.booking_id}`)} className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-500 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">Lease Pending</button>
                              )}
                              {booking.lease_status === 'signed' && (
                                <button onClick={() => navigate(`/digital-lease?booking_id=${booking.booking_id}`)} className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer border-none shadow-sm">View Signed Lease</button>
                              )}
                            </div>
                          ) : (
                            <span className="text-white/40">—</span>
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

        {/* Manage Students Area */}
        {activeTab === 'students' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] bg-[#222] flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-extrabold text-white">Manage Student Access</h3>
                <p className="text-sm text-white/60">View and manage students currently linked to your active properties.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-5 rounded-tl-3xl">STUDENT</th>
                    <th className="px-6 py-5">UNIVERSITY / ID</th>
                    <th className="px-6 py-5">CURRENT LISTING</th>
                    <th className="px-6 py-5">ACCOUNT STATUS</th>
                    <th className="px-6 py-5 rounded-tr-3xl text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] font-medium text-white">
                  {studentsLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-white/60">Loading linked students...</td>
                    </tr>
                  ) : linkedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-white/60">No active students linked to your properties.</td>
                    </tr>
                  ) : (
                    linkedStudents.map(student => (
                      <tr key={student.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#FACC15]/20 text-[#FACC15] flex items-center justify-center font-bold text-sm shrink-0">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold">{student.name}</div>
                              <div className="text-xs text-white/60 font-normal">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-white/80">{student.university || 'N/A'}</div>
                          <div className="text-xs text-white/60 font-normal">ID: {student.student_id || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-5 text-white/60">{student.listing_title}</td>
                        <td className="px-6 py-5">
                          {student.account_status === 'active' && <span className="bg-[#10b981]/20 text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold">Active Access</span>}
                          {student.account_status === 'paused' && <span className="bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold">Paused</span>}
                          {student.account_status === 'removed' && <span className="bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold">Removed</span>}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex gap-2 justify-end">
                            {student.account_status === 'active' && (
                              <button
                                onClick={() => handleUpdateStudentStatus(student.id, 'pause')}
                                className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/40 px-4 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer border-none"
                              >
                                Pause
                              </button>
                            )}
                            {student.account_status === 'paused' && (
                              <button
                                onClick={() => handleUpdateStudentStatus(student.id, 'reactivate')}
                                className="bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/40 px-4 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer border-none"
                              >
                                Reactivate
                              </button>
                            )}
                            {student.account_status !== 'removed' && (
                              <button
                                onClick={() => handleUpdateStudentStatus(student.id, 'remove')}
                                className="bg-red-500/20 text-red-500 hover:bg-red-500/40 px-4 py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer border-none"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Maintenance Area */}
        {activeTab === 'maintenance' && (
          <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
            <div className="p-6 border-b border-[#333] bg-[#222] flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-extrabold text-white">Maintenance Requests</h3>
                <p className="text-sm text-white/60">Manage and update repair tickets submitted by your tenants.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-5 rounded-tl-3xl">TICKET INFO</th>
                    <th className="px-6 py-5">TENANT & PROPERTY</th>
                    <th className="px-6 py-5">ISSUE DETAILS</th>
                    <th className="px-6 py-5">STATUS</th>
                    <th className="px-6 py-5 rounded-tr-3xl text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] font-medium text-white">
                  {maintenanceLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-white/60">Loading maintenance requests...</td>
                    </tr>
                  ) : maintenanceRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-white/60">No maintenance requests from your tenants.</td>
                    </tr>
                  ) : (
                    maintenanceRequests.map(ticket => (
                      <tr key={ticket.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-white">{ticket.ticket_id}</div>
                          <div className="text-xs text-white/60 mt-1">{new Date(ticket.created_at).toLocaleDateString()}</div>
                          <span className={`inline-block mt-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${ticket.urgency === 'High' ? 'bg-red-500/20 text-red-500' :
                              ticket.urgency === 'Medium' ? 'bg-orange-500/20 text-orange-500' :
                                'bg-[#1952c4]/20 text-[#1952c4]'
                            }`}>
                            {ticket.urgency} Urgency
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-white">{ticket.student_name}</div>
                          <div className="text-xs text-white/60 font-normal">{ticket.property_name}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-white mb-1">{ticket.title} <span className="font-normal text-xs text-white/60">({ticket.category})</span></div>
                          <div className="text-sm text-white/80 line-clamp-2 max-w-sm">{ticket.description}</div>
                        </td>
                        <td className="px-6 py-5">
                          {ticket.status === 'Pending' && <span className="bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/20">Pending</span>}
                          {ticket.status === 'In Progress' && <span className="bg-[#1952c4]/20 text-[#1952c4] px-3 py-1.5 rounded-full text-xs font-bold border border-[#1952c4]/20">In Progress</span>}
                          {ticket.status === 'Resolved' && <span className="bg-[#10b981]/20 text-[#10b981] px-3 py-1.5 rounded-full text-xs font-bold border border-[#10b981]/20">Resolved</span>}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleUpdateMaintenanceTicket(ticket.id, e.target.value)}
                            className="bg-[#111] border border-[#333] text-sm font-bold text-white rounded-xl px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-[#FACC15]/20"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
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
          <div className="bg-[#1A1A1A] rounded-3xl shadow-sm border border-[#333] flex overflow-hidden min-h-[600px] h-[calc(100vh-250px)]">

            {/* Left Sidebar (Conversation List) */}
            <div className="w-full md:w-[350px] border-r border-[#333] flex flex-col bg-[#1A1A1A]">

              {/* Header */}
              <div className="p-5 border-b border-[#333]">
                <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight">Student Messages</h2>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-grow overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-white/60 text-sm">No conversations found.</div>
                ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectChat(conv.id)}
                      className={`p-4 border-b border-[#333] cursor-pointer transition-colors hover:bg-[#222] flex items-start gap-3 ${activeChatId === conv.id ? 'bg-[#FACC15]/20' : ''}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#1A1A1A] rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className={`text-[15px] font-bold truncate ${conv.unread > 0 ? 'text-white' : 'text-white/80'}`}>
                            {conv.name}
                          </h3>
                          <span className={`text-[11px] whitespace-nowrap ml-2 ${conv.unread > 0 ? 'text-[#FACC15] font-bold' : 'text-white/40'}`}>
                            {conv.time}
                          </span>
                        </div>

                        <div className="text-[11px] font-bold text-[#FACC15] mb-1 truncate">
                          {conv.property}
                        </div>

                        <div className="flex justify-between items-center gap-2">
                          <p className={`text-[13px] truncate ${conv.unread > 0 ? 'font-semibold text-white' : 'text-white/60'}`}>
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <div className="w-5 h-5 rounded-full bg-[#FACC15] text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">
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
            <div className="hidden md:flex flex-grow flex-col bg-black/30 h-full">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="h-[76px] px-6 border-b border-[#333] bg-[#1A1A1A] flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                        {activeChat.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10b981] border-2 border-[#1A1A1A] rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-[16px] font-extrabold text-white">{activeChat.name}</h2>
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/60">
                          {activeChat.property}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-full hover:bg-[#333] flex items-center justify-center text-white/60 transition-colors border-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </button>
                      <button className="w-9 h-9 rounded-full hover:bg-[#333] flex items-center justify-center text-white/60 transition-colors border-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
                    {/* Date Divider */}
                    <div className="flex justify-center my-2">
                      <span className="bg-[#333] text-white/60 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {messages && messages.length > 0 ? messages[0].date : "Today"}
                      </span>
                    </div>

                    {messages && messages.map((msg, index) => {
                      const isMe = msg.sender === 'me';
                      const showDate = index > 0 && messages[index - 1] && messages[index - 1].date !== msg.date;

                      return (
                        <React.Fragment key={msg.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="bg-[#333] text-white/60 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                {msg.date}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isMe
                                  ? 'bg-[#FACC15] text-black rounded-br-none'
                                  : 'bg-[#222] border border-[#333] text-white rounded-bl-none'
                                  }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[11px] font-semibold text-white/40 mt-1 mx-1">
                                {msg.time}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-[#1A1A1A] border-t border-[#333] flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                      <button type="button" className="p-3 text-white/40 hover:text-[#FACC15] transition-colors rounded-full hover:bg-[#333] flex-shrink-0 border-none cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>

                      <div className="flex-grow bg-[#111] rounded-2xl border border-transparent focus-within:border-[#FACC15]/30 focus-within:bg-[#222] transition-all">
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
                          className="w-full bg-transparent border-none px-4 py-3 text-[14px] text-white focus:outline-none resize-none max-h-32"
                          style={{ minHeight: '46px' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 border-none ${newMessage.trim()
                          ? 'bg-[#FACC15] text-black shadow-md hover:bg-[#EAB308] cursor-pointer'
                          : 'bg-[#333] text-white/40 cursor-not-allowed'
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
                  <div className="w-20 h-20 bg-[#FACC15]/20 rounded-full flex items-center justify-center text-[#FACC15] mb-5 shadow-sm">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Student Messages</h3>
                  <p className="text-white/60 text-[15px] max-w-sm">Select a conversation from the sidebar to view details or send a new message to your tenants.</p>
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
