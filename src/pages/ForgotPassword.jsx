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
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          {/* Card Container */}
          <div className="bg-[#1A1A1A] border border-[#2a2a2a] rounded-[24px] p-8 sm:p-10 shadow-2xl flex flex-col">
            {!submitted ? (
              <>
                {/* Envelope Icon */}
                <div className="w-14 h-14 bg-[#FACC15]/10 text-[#FACC15] rounded-2xl flex items-center justify-center mb-6 self-center border border-[#FACC15]/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-3 text-center">
                  Forgot Password?
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6 font-normal text-center">
                  No worries! Enter your registered email and we'll send you a reset link.
                </p>

                {/* Reset Form */}
                <form onSubmit={handleReset} className="w-full">
                  <div>
                    <label className="block text-[11px] font-bold text-white/40 tracking-widest mb-2.5 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-5 py-4 rounded-[14px] bg-[#111] border border-[#333] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all text-[15px]"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 mt-6 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] transition-colors text-[15px] tracking-wide shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex py-6 items-center w-full">
                  <div className="flex-grow border-t border-[#333]"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-white/40 bg-[#1A1A1A] px-2">
                    or
                  </span>
                  <div className="flex-grow border-t border-[#333]"></div>
                </div>

                {/* Back to Sign In Link */}
                <Link to="/login" className="w-full">
                  <button
                    type="button"
                    className="w-full py-4 border border-[#333] bg-transparent hover:border-[#444] hover:text-white/80 text-white/60 font-bold rounded-[14px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 cursor-pointer"
                  >
                    <span>←</span> Back to Sign In
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* Checkmark Circle Icon */}
                <div className="w-14 h-14 bg-[#FACC15]/10 text-[#FACC15] rounded-2xl flex items-center justify-center mb-6 self-center border border-[#FACC15]/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-3 text-center">
                  Check your email
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6 font-normal text-center">
                  We've sent a password reset link to <br />
                  <span className="font-bold text-[#FACC15]">{email}</span>
                </p>

                {/* Info Box */}
                <div className="bg-[#FACC15]/5 rounded-[14px] p-5 text-[13px] text-white/60 leading-relaxed mb-6 text-left border border-[#FACC15]/20">
                  Didn't receive the email? Check your spam folder or make sure you entered the correct address.
                </div>

                {/* Back to Sign In Link */}
                <Link to="/login" className="w-full mb-4">
                  <button
                    type="button"
                    className="w-full py-4 border border-[#333] bg-transparent hover:border-[#444] hover:text-white/80 text-white/60 font-bold rounded-[14px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 cursor-pointer"
                  >
                    <span>←</span> Back to Sign In
                  </button>
                </Link>

                {/* Resend Link */}
                <button
                  type="button"
                  onClick={() => alert(`Password reset link resent to ${email}`)}
                  className="text-[15px] font-semibold text-[#FACC15] hover:text-[#EAB308] hover:underline self-center bg-transparent border-0 cursor-pointer transition-colors"
                >
                  Resend email
                </button>
              </>
            )}
          </div>

          {/* Footer informational text */}
          <p className="text-center text-[13px] text-white/40 mt-8 w-full font-medium">
            No payment charged until approved by owner
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
