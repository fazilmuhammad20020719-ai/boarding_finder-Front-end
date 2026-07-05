import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Password reset link sent to ${email}`);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] font-sans antialiased">
      {/* ===== WHITE TOP NAVBAR ===== */}
      <nav className="w-full bg-white border-b border-[#e2e8f0]/80 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1952c4] flex items-center justify-center text-white shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2"/>
                  <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </div>
              <span className="font-bold text-[22px] text-[#0f172a] tracking-tight">BoardingFinder</span>
            </Link>

            {/* Navigation Links with inline styles for bulletproof layout */}
            <div className="flex items-center" style={{ gap: '24px' }}>
              <Link to="/" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
                Home
              </Link>
              <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
                Search
              </Link>
              <Link to="/home" className="text-[15px] font-semibold text-[#475569] hover:text-[#1952c4] transition-colors">
                Map View
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          {/* Card Container - Removed border classes to prevent browser rendering borders */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-md flex flex-col">
            {/* Envelope Icon */}
            <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>

            {/* Header Texts */}
            <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3">
              Forgot Password?
            </h2>
            <p className="text-[#64748b] text-[15px] leading-relaxed mb-6 font-normal">
              No worries! Enter your registered email and we'll send you a reset link.
            </p>

            {/* Reset Form */}
            <form onSubmit={handleReset} className="w-full">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-[16px] bg-[#f0f4f9] border border-[#e2e8f0]/40 text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 mt-6 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-[16px] transition-colors text-base shadow-sm"
              >
                Send Reset Link
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-6 items-center w-full">
              <div className="flex-grow border-t border-[#e2e8f0]/80"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-[#94a3b8] bg-white">
                or
              </span>
              <div className="flex-grow border-t border-[#e2e8f0]/80"></div>
            </div>

            {/* Back to Sign In Link */}
            <Link to="/login" className="w-full">
              <button
                type="button"
                className="w-full py-4 border border-[#e2e8f0]/80 bg-white hover:bg-slate-50 text-[#475569] font-bold rounded-[16px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 shadow-sm"
              >
                <span>←</span> Back to Sign In
              </button>
            </Link>
          </div>

          {/* Footer informational text */}
          <p className="text-center text-[13px] text-[#64748b] mt-8 w-full font-medium">
            No payment charged until approved by owner
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
