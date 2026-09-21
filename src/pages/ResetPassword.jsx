import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError('');
    setSubmitted(true);
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
                {/* Lock Icon */}
                <div className="w-14 h-14 bg-[#FACC15]/10 text-[#FACC15] rounded-2xl flex items-center justify-center mb-6 self-center border border-[#FACC15]/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-3 text-center">
                  Reset Password
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6 font-normal text-center">
                  Please enter your new password below.
                </p>

                {error && (
                  <div className="mb-5 px-4 py-3 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                {/* Reset Form */}
                <form onSubmit={handleReset} className="w-full">
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-white/40 tracking-widest mb-2.5 uppercase">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 rounded-[14px] bg-[#111] border border-[#333] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all text-[15px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/40 tracking-widest mb-2.5 uppercase">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 rounded-[14px] bg-[#111] border border-[#333] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all text-[15px]"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 mt-6 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] transition-colors text-[15px] tracking-wide shadow-sm"
                  >
                    Reset Password
                  </button>
                </form>
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
                  Password Reset Successfully
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6 font-normal text-center">
                  Your password has been changed successfully. You can now login with your new password.
                </p>

                {/* Back to Sign In Link */}
                <Link to="/login" className="w-full mb-4">
                  <button
                    type="button"
                    className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] flex items-center justify-center gap-2 text-[15px] tracking-wide transition-all duration-200 shadow-sm"
                  >
                    Continue to Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
