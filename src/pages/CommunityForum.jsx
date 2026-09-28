import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { getForumPosts, createForumPost } from '../services/api';

const CATEGORIES = ["All Topics", "General Discussion", "Neighborhood Advice", "Local Recommendations", "Moving Tips"];

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General Discussion' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getForumPosts(activeCategory, searchQuery);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to create a post");
        navigate("/login");
        return;
      }
      await createForumPost(newPost);
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', category: 'General Discussion' });
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Community Board</h1>
            <p className="text-white/60 mt-1 text-[15px]">Connect with locals, ask questions, and share neighborhood advice.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl shadow-sm transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
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
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] shadow-sm text-white"
              />
            </div>

            {/* Categories */}
            <div className="bg-[#1A1A1A] rounded-[24px] border border-[#333] shadow-sm p-4">
              <h3 className="font-bold text-white mb-3 px-4 uppercase text-xs tracking-wider">Categories</h3>
              <ul className="space-y-1">
                {CATEGORIES.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeCategory === category
                          ? 'bg-[#FACC15] text-black'
                          : 'text-white/60 hover:bg-[#333] hover:text-white'
                        }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Tags */}
            <div className="bg-[#1A1A1A] rounded-[24px] border border-[#333] shadow-sm p-6">
              <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#333] text-white/60 text-xs font-bold rounded-lg cursor-pointer hover:bg-[#444]">#safety</span>
                <span className="px-3 py-1 bg-[#333] text-white/60 text-xs font-bold rounded-lg cursor-pointer hover:bg-[#444]">#pets</span>
                <span className="px-3 py-1 bg-[#333] text-white/60 text-xs font-bold rounded-lg cursor-pointer hover:bg-[#444]">#parking</span>
                <span className="px-3 py-1 bg-[#333] text-white/60 text-xs font-bold rounded-lg cursor-pointer hover:bg-[#444]">#groceries</span>
              </div>
            </div>
          </div>

          {/* Right Main Content (Post List) */}
          <div className="w-full lg:w-3/4">
            <div className="bg-[#1A1A1A] rounded-[24px] border border-[#333] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#222]">
                <span className="text-sm font-bold text-white">{activeCategory} Discussions</span>
              </div>

              <div className="divide-y divide-[#333]">
                {loading ? (
                  <div className="p-12 text-center">
                    <p className="text-white/60">Loading discussions...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-white/60">No discussions found for this category or search.</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <Link to={`/community-forum/${post.id}`} key={post.id} className="block p-6 hover:bg-[#222] transition-colors group cursor-pointer">
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                        {/* Avatar */}
                        <div className="shrink-0 hidden sm:block">
                          <img
                            src={post.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`}
                            alt={post.author_name}
                            className="w-12 h-12 rounded-full border border-[#333]"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/20 px-2 py-0.5 rounded-md">
                              {post.category}
                            </span>
                            <span className="text-xs text-white/40 flex items-center gap-1">
                              • Posted {formatDate(post.created_at)} by <span className="font-semibold text-white/60">{post.author_name}</span>
                            </span>
                          </div>

                          <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#FACC15] transition-colors">
                            {post.title}
                          </h2>

                          <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-6 text-sm font-semibold text-white/60">
                            <div className="flex items-center gap-1.5 hover:text-[#FACC15] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                              {post.replies_count || 0} Replies
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                              {post.upvotes_count || 0} Upvotes
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              {post.views} Views
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for New Post */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-white">New Discussion</h2>
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white/60 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:ring-2 focus:ring-[#FACC15] outline-none text-white"
                    placeholder="E.g., Looking for a roommate in downtown"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white/60 mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:ring-2 focus:ring-[#FACC15] outline-none text-white"
                  >
                    {CATEGORIES.filter(c => c !== "All Topics").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white/60 mb-1">Content</label>
                  <textarea
                    required
                    rows="5"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg focus:ring-2 focus:ring-[#FACC15] outline-none text-white"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 font-semibold text-white/60 hover:bg-[#333] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FACC15] text-black font-bold rounded-lg hover:bg-[#EAB308] transition-colors shadow-sm cursor-pointer"
                  >
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CommunityForum;
