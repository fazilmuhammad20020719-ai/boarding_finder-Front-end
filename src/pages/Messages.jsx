import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Muslima",
    property: "Tranquil Lodge",
    avatar: "https://ui-avatars.com/api/?name=Muslima+de+Silva&background=e8f7ec&color=10b981",
    lastMessage: "Hi Muslima! The room is ready for you to move in next week.",
    time: "10:30 AM",
    unread: 2,
    online: true,
    messages: [
      { id: 101, sender: "me", text: "Hi Muslima, just confirming if the WiFi is already set up?", time: "09:15 AM", date: "Today" },
      { id: 102, sender: "them", text: "Yes, we upgraded to a 100Mbps connection last month.", time: "09:45 AM", date: "Today" },
      { id: 103, sender: "me", text: "That's great! I'll be arriving around 2 PM on Monday.", time: "10:00 AM", date: "Today" },
      { id: 104, sender: "them", text: "Perfect. I'll be there to hand over the keys.", time: "10:25 AM", date: "Today" },
      { id: 105, sender: "them", text: "Hi Muslima! The room is ready for you to move in next week.", time: "10:30 AM", date: "Today" }
    ]
  },
  {
    id: 2,
    name: "Nuha",
    property: "BlueSky Residences",
    avatar: "https://ui-avatars.com/api/?name=Fazil&background=ebf3ff&color=1952c4",
    lastMessage: "Please send the copy of your university ID.",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: 201, sender: "them", text: "Hello, I've received your booking request for BlueSky.", time: "02:00 PM", date: "Yesterday" },
      { id: 202, sender: "me", text: "Hi Fazil! Let me know what else you need from me.", time: "02:15 PM", date: "Yesterday" },
      { id: 203, sender: "them", text: "Please send the copy of your university ID.", time: "02:30 PM", date: "Yesterday" }
    ]
  },
  {
    id: 3,
    name: "Krishnan",
    property: "Metro Haven",
    avatar: "https://ui-avatars.com/api/?name=Naja&background=f4f7f9&color=64748b",
    lastMessage: "Your security deposit refund has been processed.",
    time: "Jun 20",
    unread: 0,
    online: false,
    messages: [
      { id: 301, sender: "them", text: "Thank you for staying with us. We hope you had a great time.", time: "10:00 AM", date: "Jun 19" },
      { id: 302, sender: "me", text: "Yes, it was a good experience. When will I receive the deposit?", time: "11:30 AM", date: "Jun 19" },
      { id: 303, sender: "them", text: "Your security deposit refund has been processed.", time: "09:00 AM", date: "Jun 20" }
    ]
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState(MOCK_CONVERSATIONS[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileViewList, setIsMobileViewList] = useState(true); // Toggle between list and chat on mobile

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
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
    setIsMobileViewList(false); // Switch to chat view on mobile

    // Muslima as read
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, unread: 0 } : conv
    ));
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) { }
    return 2;
  })();

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans antialiased text-[#0f172a] h-screen overflow-hidden">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-0 sm:px-6 md:px-8 py-0 sm:py-6 h-[calc(100vh-80px)] flex flex-col">

        <div className="bg-white sm:rounded-3xl shadow-sm border-x sm:border border-[#e2e8f0]/60 flex-grow flex overflow-hidden h-full">

          {/* ===== LEFT SIDEBAR (CONVERSATION LIST) ===== */}
          <div className={`w-full md:w-80 lg:w-[350px] border-r border-[#e2e8f0]/60 flex flex-col bg-white ${!isMobileViewList ? 'hidden md:flex' : 'flex'}`}>

            {/* Header */}
            <div className="p-5 border-b border-[#e2e8f0]/60">
              <h1 className="text-2xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Messages</h1>

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
            <div className="flex-grow overflow-y-auto custom-scrollbar">
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


          {/* ===== RIGHT MAIN AREA (ACTIVE CHAT) ===== */}
          <div className={`flex-grow flex flex-col bg-[#f4f7f9]/30 h-full ${isMobileViewList ? 'hidden md:flex' : 'flex w-full md:w-auto'}`}>

            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="h-[76px] px-6 border-b border-[#e2e8f0]/60 bg-white flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsMobileViewList(true)}
                      className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

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
                    <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </button>
                    <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  {/* Date Divider */}
                  <div className="flex justify-center my-2">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {activeChat.messages[0]?.date || "Today"}
                    </span>
                  </div>

                  {activeChat.messages.map((msg, index) => {
                    const isMe = msg.sender === 'me';
                    // Check if date changed
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
                    <button type="button" className="p-3 text-slate-400 hover:text-[#1952c4] transition-colors rounded-full hover:bg-slate-100 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>

                    <div className="flex-grow bg-[#f4f7f9] rounded-2xl border border-transparent focus-within:border-[#1952c4]/30 focus-within:bg-white transition-all">
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
                        className="w-full bg-transparent border-none px-4 py-3 text-[14px] text-[#0f172a] focus:outline-none resize-none max-h-32 custom-scrollbar"
                        style={{ minHeight: '46px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`p-3 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${newMessage.trim()
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
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white md:bg-transparent">
                <div className="w-20 h-20 bg-white md:bg-[#ebf3ff] rounded-full flex items-center justify-center text-slate-300 md:text-[#1952c4] mb-5 shadow-sm">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-2">Your Messages</h3>
                <p className="text-slate-500 text-[15px] max-w-sm">Select a conversation from the sidebar to view details or start a new message.</p>
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
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Messages;
