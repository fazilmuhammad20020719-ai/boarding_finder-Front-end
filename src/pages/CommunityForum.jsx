import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MOCK_POSTS = [
  {
    id: 1,
    title: "Is the Downtown area safe for late-night walks?",
    author: "Jessica T.",
    avatar: "https://ui-avatars.com/api/?name=Jessica+T&background=ebf3ff&color=1952c4",
    category: "Neighborhood Advice",
    replies: 14,
    views: 342,
    time: "2 hours ago",
    excerpt: "I'm considering a place near 5th Avenue and often work late shifts. Just wondering what the vibe is like around 11 PM..."
  },
  {
    id: 2,
    title: "Best local coffee shops with good WiFi for studying?",
    author: "Muslima S.",
    avatar: "https://ui-avatars.com/api/?name=Muslima+S&background=e8f7ec&color=10b981",
    category: "Local Recommendations",
    replies: 8,
    views: 156,
    time: "5 hours ago",
    excerpt: "I need to get out of my room this weekend to finish a project. Any recommendations for cafes that don't mind you sitting for a few hours?"
  },
  {
    id: 3,
    title: "Anyone else dealing with loud construction on Oak Street?",
    author: "Krishnan L.",
    avatar: "https://ui-avatars.com/api/?name=Krishnan+L&background=fee2e2&color=ef4444",
    category: "General Discussion",
    replies: 22,
    views: 890,
    time: "1 day ago",
    excerpt: "The new high-rise construction starts at 6 AM every day. Is there any noise ordinance in this district?"
  },
  {
    id: 4,
    title: "Looking for moving boxes!",
    author: "Amanda B.",
    avatar: "https://ui-avatars.com/api/?name=Amanda+B&background=fef3c7&color=d97706",
    category: "Moving Tips",
    replies: 3,
    views: 45,
    time: "2 days ago",
    excerpt: "Hey everyone, I'm moving out next week and trying to avoid buying brand new boxes. Does anyone have some to spare?"
  }
];

const CATEGORIES = ["All Topics", "General Discussion", "Neighborhood Advice", "Local Recommendations", "Moving Tips"];

const CommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All Topics" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Community Board</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Connect with locals, ask questions, and share neighborhood advice.</p>
          </div>
          <button className="px-6 py-3 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Discussion
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar (Categories & Search) */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e2e8f0]/60 rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 shadow-sm"
              />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-[24px] border border-[#e2e8f0]/60 shadow-sm p-4">
              <h3 className="font-bold text-[#0f172a] mb-3 px-4 uppercase text-xs tracking-wider">Categories</h3>
              <ul className="space-y-1">
                {CATEGORIES.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        activeCategory === category
                          ? 'bg-[#ebf3ff] text-[#1952c4]'
                          : 'text-[#475569] hover:bg-slate-50 hover:text-[#0f172a]'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Stats (Mock) */}
            <div className="bg-white rounded-[24px] border border-[#e2e8f0]/60 shadow-sm p-6">
              <h3 className="font-bold text-[#0f172a] mb-4 uppercase text-xs tracking-wider">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#f0f4f9] text-[#64748b] text-xs font-bold rounded-lg cursor-pointer hover:bg-[#e2e8f0]">#safety</span>
                <span className="px-3 py-1 bg-[#f0f4f9] text-[#64748b] text-xs font-bold rounded-lg cursor-pointer hover:bg-[#e2e8f0]">#pets</span>
                <span className="px-3 py-1 bg-[#f0f4f9] text-[#64748b] text-xs font-bold rounded-lg cursor-pointer hover:bg-[#e2e8f0]">#parking</span>
                <span className="px-3 py-1 bg-[#f0f4f9] text-[#64748b] text-xs font-bold rounded-lg cursor-pointer hover:bg-[#e2e8f0]">#groceries</span>
              </div>
            </div>
          </div>

          {/* Right Main Content (Post List) */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-[24px] border border-[#e2e8f0]/60 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#e2e8f0]/60 flex justify-between items-center bg-slate-50">
                <span className="text-sm font-bold text-[#475569]">{activeCategory} Discussions</span>
                <select className="bg-transparent border-none text-sm font-semibold text-[#0f172a] focus:ring-0 cursor-pointer outline-none">
                  <option>Recent</option>
                  <option>Most Popular</option>
                  <option>Unanswered</option>
                </select>
              </div>

              <div className="divide-y divide-[#e2e8f0]/60">
                {filteredPosts.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-[#64748b]">No discussions found for this category or search.</p>
                  </div>
                ) : (
                  filteredPosts.map(post => (
                    <div key={post.id} className="p-6 hover:bg-[#f8fafc] transition-colors group cursor-pointer">
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                        {/* Avatar */}
                        <div className="shrink-0 hidden sm:block">
                          <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-[#e2e8f0]" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#1952c4] bg-[#ebf3ff] px-2 py-0.5 rounded-md">
                              {post.category}
                            </span>
                            <span className="text-xs text-[#94a3b8] flex items-center gap-1">
                              • Posted {post.time} by <span className="font-semibold text-[#64748b]">{post.author}</span>
                            </span>
                          </div>
                          
                          <h2 className="text-lg font-bold text-[#0f172a] mb-2 group-hover:text-[#1952c4] transition-colors">
                            {post.title}
                          </h2>
                          
                          <p className="text-[#475569] text-sm leading-relaxed mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-6 text-sm font-semibold text-[#64748b]">
                            <div className="flex items-center gap-1.5 hover:text-[#1952c4] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                              {post.replies} Replies
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              {post.views} Views
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination (Mock) */}
              {filteredPosts.length > 0 && (
                <div className="p-4 border-t border-[#e2e8f0]/60 flex justify-center bg-slate-50">
                   <button className="text-sm font-semibold text-[#1952c4] hover:underline">Load More Discussions</button>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default CommunityForum;
