import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams, Link } from 'react-router-dom';
import { getForumPostById, toggleForumUpvote, addForumComment } from '../services/api';

const ForumPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const data = await getForumPostById(id);
            setPost(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching post:", err);
            setError("Failed to load post. It may have been deleted.");
            setLoading(false);
        }
    };

    const handleUpvote = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to upvote");
            return;
        }
        try {
            const data = await toggleForumUpvote(id);
            // Update upvote count optimistically
            setPost(prev => ({
                ...prev,
                upvotes_count: data.upvoted
                    ? parseInt(prev.upvotes_count) + 1
                    : parseInt(prev.upvotes_count) - 1
            }));
        } catch (err) {
            console.error("Error toggling upvote:", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to comment");
            return;
        }

        try {
            const data = await addForumComment(id, newComment);

            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, data]
            }));
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
            alert("Failed to add comment");
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-white/60">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
                    <p className="text-white/60 mb-6">{error}</p>
                    <Link to="/community-forum" className="text-[#FACC15] font-semibold hover:underline">
                        &larr; Back to Forum
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black font-sans antialiased text-white">
            <Navbar />

            <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <Link to="/community-forum" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-[#FACC15] mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Discussions
                </Link>

                {/* Original Post */}
                <div className="bg-[#1A1A1A] rounded-[24px] border border-[#333] shadow-sm overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-black uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/20 px-3 py-1 rounded-md">
                                {post.category}
                            </span>
                            <span className="text-sm text-white/40 flex items-center gap-1">
                                • {formatDate(post.created_at)}
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#333]">
                            <img
                                src={post.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`}
                                alt={post.author_name}
                                className="w-12 h-12 rounded-full border border-[#333]"
                            />
                            <div>
                                <p className="font-bold text-white">{post.author_name}</p>
                                <p className="text-sm text-white/60">Original Poster</p>
                            </div>
                        </div>

                        <div className="prose max-w-none text-white/80 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-[#222] border-t border-[#333] flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm font-semibold text-white/60">
                            <button
                                onClick={handleUpvote}
                                className="flex items-center gap-2 hover:text-[#FACC15] transition-colors group cursor-pointer"
                            >
                                <svg className="w-5 h-5 group-hover:fill-[#FACC15]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                {post.upvotes_count || 0} Upvotes
                            </button>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                {post.comments.length} Replies
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-white/40 flex items-center gap-1.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {post.views} Views
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-[#333] pb-2">
                        Discussion ({post.comments.length})
                    </h3>

                    <div className="space-y-6">
                        {post.comments.length === 0 ? (
                            <p className="text-white/60 text-center py-6">No replies yet. Be the first to answer!</p>
                        ) : (
                            post.comments.map(comment => (
                                <div key={comment.id} className="flex gap-4 p-6 bg-[#1A1A1A] rounded-2xl shadow-sm border border-[#333]">
                                    <div className="shrink-0 hidden sm:block">
                                        <img
                                            src={comment.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author_name)}&background=random`}
                                            alt={comment.author_name}
                                            className="w-10 h-10 rounded-full border border-[#333]"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-baseline justify-between mb-2">
                                            <h4 className="font-bold text-white">{comment.author_name}</h4>
                                            <span className="text-xs font-semibold text-white/40">{formatDate(comment.created_at)}</span>
                                        </div>
                                        <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-[15px]">
                                            {comment.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add Comment Form */}
                <div className="bg-[#1A1A1A] rounded-2xl shadow-sm border border-[#333] p-6">
                    <h4 className="font-bold text-white mb-4 text-lg">Leave a Reply</h4>
                    <form onSubmit={handleAddComment}>
                        <textarea
                            required
                            rows="4"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl focus:ring-2 focus:ring-[#FACC15] outline-none mb-4 resize-none"
                            placeholder="Share your thoughts or answer the question..."
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#FACC15] text-black font-bold rounded-lg hover:bg-[#EAB308] transition-colors shadow-sm cursor-pointer"
                            >
                                Post Reply
                            </button>
                        </div>
                    </form>
                </div>

            </main>
        </div>
    );
};

export default ForumPost;
