import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ReviewPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Specific ratings
  const [categories, setCategories] = useState({
    cleanliness: 0,
    location: 0,
    facilities: 0,
    value: 0
  });

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide an overall rating");
      return;
    }
    // Mock submission - navigate back to bookings
    navigate('/my-bookings');
  };

  const handleCategoryRating = (category, value) => {
    setCategories(prev => ({ ...prev, [category]: value }));
  };

  // Star SVG component
  const StarIcon = ({ filled, onMouseEnter, onMouseLeave, onClick }) => (
    <svg
      className={`w-10 h-10 sm:w-12 sm:h-12 cursor-pointer transition-all ${filled ? 'text-[#f59e0b]' : 'text-slate-200'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const SmallStar = ({ filled, onClick }) => (
    <svg
      className={`w-6 h-6 cursor-pointer transition-colors ${filled ? 'text-[#f59e0b]' : 'text-slate-200'}`}
      onClick={onClick}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] pb-20">
      <Navbar isLoggedIn={true} onLogout={handleLogout} activeTab="" />

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-12">

        <button
          onClick={() => navigate('/my-bookings')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1952c4] transition-colors font-semibold text-sm bg-transparent border-none cursor-pointer mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Bookings
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 overflow-hidden">

          {/* Header Summary */}
          <div className="bg-[#1952c4] p-8 text-white flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <div className="w-24 h-24 rounded-2xl bg-white/20 border border-white/30 p-1 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=200" alt="Property" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Write a Review for</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">BlueSky Residences</h1>
              <p className="text-white/80 font-medium">Stayed: Jan 2025 - Jun 2025 (6 Months)</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>

              {/* Overall Rating */}
              <div className="flex flex-col items-center justify-center py-8 border-b border-[#e2e8f0]/60">
                <h2 className="text-xl font-bold text-[#0f172a] mb-2">How was your stay overall?</h2>
                <p className="text-slate-500 text-sm mb-6">Click a star to rate</p>
                <div className="flex gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      filled={star <= (hoveredRating || rating)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Specific Categories */}
              <div className="py-8 border-b border-[#e2e8f0]/60">
                <h3 className="font-bold text-[#0f172a] mb-6">Rate specific aspects (optional)</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { key: 'cleanliness', label: 'Cleanliness' },
                    { key: 'location', label: 'Location' },
                    { key: 'facilities', label: 'Facilities' },
                    { key: 'value', label: 'Value for Money' }
                  ].map((category) => (
                    <div key={category.key} className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{category.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <SmallStar
                            key={star}
                            filled={star <= categories[category.key]}
                            onClick={() => handleCategoryRating(category.key, star)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Written Review */}
              <div className="py-8">
                <h3 className="font-bold text-[#0f172a] mb-2">Write your review</h3>
                <p className="text-slate-500 text-sm mb-4">Share your experience with future students. What did you like? What could be improved?</p>

                <textarea
                  rows="5"
                  placeholder="The room was very spacious and the owner was friendly..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white resize-none"
                ></textarea>
                <div className="text-right text-xs font-semibold text-slate-400 mt-2">
                  {reviewText.length} characters
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-bookings')}
                  className="px-6 py-3 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-[#e2e8f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rating === 0}
                  className={`px-8 py-3 font-bold rounded-xl transition-colors border-none shadow-sm flex items-center gap-2 ${rating === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#1952c4] hover:bg-[#1546a8] text-white cursor-pointer'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ReviewPage;
