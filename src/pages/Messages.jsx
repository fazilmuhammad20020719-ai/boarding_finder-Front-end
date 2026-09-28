import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '../services/api';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileViewList, setIsMobileViewList] = useState(true);
  // userId derived from AuthContext — no localStorage needed
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      if (res.conversations) {
        setConversations(res.conversations.map(c => ({
          id: c.conversation_id,
          name: c.other_name,
          property: c.property_title || "Roommate Connection",
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
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
      const interval = setInterval(() => fetchMessages(activeChatId), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChatId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    setIsMobileViewList(false);
    try {
      await markMessagesAsRead(id);
      fetchConversations();
    } catch (err) { }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const filteredConversations = conversations.filter(c =>
    (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.property && c.property.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) { }
    return 2;
  })();

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white h-screen overflow-hidden">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-0 sm:px-6 md:px-8 py-0 sm:py-6 h-[calc(100vh-80px)] flex flex-col">

        <div className="bg-[#1A1A1A] sm:rounded-3xl shadow-sm border-x sm:border border-[#333] flex-grow flex overflow-hidden h-full">

          {/* ===== LEFT SIDEBAR (CONVERSATION LIST) ===== */}
          <div className={`w-full md:w-80 lg:w-[350px] border-r border-[#333] flex flex-col bg-[#1A1A1A] ${!isMobileViewList ? 'hidden md:flex' : 'flex'}`}>

            {/* Header */}
            <div className="p-5 border-b border-[#333]">
              <h1 className="text-2xl font-extrabold text-white mb-4 tracking-tight">Messages</h1>

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
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-white/50 text-sm">No conversations found.</div>
              ) : (
                filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectChat(conv.id)}
                    className={`p-4 border-b border-[#333] cursor-pointer transition-colors hover:bg-[#111] flex items-start gap-3 ${activeChatId === conv.id ? 'bg-[#FACC15]/10' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#1A1A1A] rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-[15px] font-bold truncate ${conv.unread > 0 ? 'text-white' : 'text-white/70'}`}>
                          {conv.name}
                        </h3>
                        <span className={`text-[11px] whitespace-nowrap ml-2 ${conv.unread > 0 ? 'text-[#FACC15] font-bold' : 'text-white/50'}`}>
                          {conv.time}
                        </span>
                      </div>

                      <div className="text-[11px] font-bold text-[#FACC15] mb-1 truncate">
                        {conv.property}
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <p className={`text-[13px] truncate ${conv.unread > 0 ? 'font-semibold text-white' : 'text-white/50'}`}>
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


          {/* ===== RIGHT MAIN AREA (ACTIVE CHAT) ===== */}
          <div className={`flex-grow flex flex-col bg-black/50 h-full ${isMobileViewList ? 'hidden md:flex' : 'flex w-full md:w-auto'}`}>

            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="h-[76px] px-6 border-b border-[#333] bg-[#1A1A1A] flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsMobileViewList(true)}
                      className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[#111] text-white/60"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

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
                    <button className="w-9 h-9 rounded-full hover:bg-[#111] flex items-center justify-center text-white/60 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </button>
                    <button className="w-9 h-9 rounded-full hover:bg-[#111] flex items-center justify-center text-white/60 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {/* Date Divider */}
                  <div className="flex justify-center my-2">
                    <span className="bg-[#111] text-white/50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {messages[0]?.date || "Today"}
                    </span>
                  </div>

                  {messages.map((msg, index) => {
                    const isMe = msg.sender === 'me';
                    // Check if date changed
                    const showDate = index > 0 && messages[index - 1].date !== msg.date;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="bg-[#111] text-white/50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              {msg.date}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isMe
                                  ? 'bg-[#FACC15] text-black rounded-br-none'
                                  : 'bg-[#1A1A1A] border border-[#333] text-white rounded-bl-none'
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
                    <button type="button" className="p-3 text-white/50 hover:text-[#FACC15] transition-colors rounded-full hover:bg-[#111] flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>

                    <div className="flex-grow bg-[#111] rounded-2xl border border-transparent focus-within:border-[#FACC15]/30 focus-within:bg-black transition-all">
                      <textarea
                        rows="1"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        className="w-full bg-transparent border-none px-4 py-3 text-[14px] text-white focus:outline-none resize-none max-h-32 custom-scrollbar"
                        style={{ minHeight: '46px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`p-3 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${newMessage.trim()
                          ? 'bg-[#FACC15] text-black shadow-md hover:bg-[#EAB308] cursor-pointer'
                          : 'bg-[#333] text-white/30 cursor-not-allowed'
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
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-[#1A1A1A] md:bg-transparent">
                <div className="w-20 h-20 bg-[#1A1A1A] md:bg-[#FACC15]/10 rounded-full flex items-center justify-center text-white/20 md:text-[#FACC15] mb-5 shadow-sm">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
                <p className="text-white/50 text-[15px] max-w-sm">Select a conversation from the sidebar to view details or start a new message.</p>
              </div>
            )}

          </div>

        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  );
};

export default Messages;
