import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] font-sans antialiased">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          {/* Card Container - Removed border classes to prevent browser rendering borders */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-md flex flex-col">
            {!submitted ? (
              <>
                {/* Envelope Icon */}
                <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3 text-center">
                  Forgot Password?
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-6 font-normal text-center">
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
              </>
            ) : (
              <>
                {/* Checkmark Circle Icon */}
                <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3 text-center">
                  Check your email
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-6 font-normal text-center">
                  We've sent a password reset link to <br />
                  <span className="font-bold text-[#1952c4]">{email}</span>
                </p>

                {/* Info Box */}
                <div className="bg-[#ebf3ff]/50 rounded-[16px] p-5 text-[13px] text-[#475569] leading-relaxed mb-6 text-left border border-[#e2e8f0]/40">
                  Didn't receive the email? Check your spam folder or make sure you entered the correct address.
                </div>

                {/* Back to Sign In Link */}
                <Link to="/login" className="w-full mb-4">
                  <button
                    type="button"
                    className="w-full py-4 border border-[#e2e8f0]/80 bg-white hover:bg-slate-50 text-[#475569] font-bold rounded-[16px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 shadow-sm"
                  >
                    <span>←</span> Back to Sign In
                  </button>
                </Link>

                {/* Resend Link */}
                <button
                  type="button"
                  onClick={() => alert(`Password reset link resent to ${email}`)}
                  className="text-[15px] font-semibold text-[#1952c4] hover:underline self-center bg-transparent border-0 cursor-pointer"
                >
                  Resend email
                </button>
              </>
            )}
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
