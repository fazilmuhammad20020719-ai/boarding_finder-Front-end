import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgImage from 'C:/Users/A.S.F Nuha/.gemini/antigravity-ide/brain/171a4f1b-a721-46c5-8056-e2f868ece8ba/simple_boarding_house_1790525944006.png';
import LogoIcon from '../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-sans antialiased overflow-x-hidden p-4 sm:p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark blurred background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Centered White Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl w-full">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-5 flex flex-col items-center">
                <Link to="/" className="flex flex-col items-center gap-1 mb-2 hover:opacity-90 transition-opacity">
                  <LogoIcon className="w-11 h-11" />
                  <span className="text-2xl font-extrabold tracking-tight">
                    <span className="text-black">Boarding</span>
                    <span className="text-[#EAB308]">Finder</span>
                  </span>
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-1">
                  Forgot Password?
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium leading-relaxed">
                  Enter your registered email and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Reset Form */}
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-all text-sm tracking-wide shadow-sm border-none cursor-pointer mt-2"
                >
                  RESET PASSWORD
                </button>
              </form>

              {/* Back to Login Footer */}
              <div className="mt-5 text-center pt-4 border-t border-gray-100">
                <Link to="/login" className="text-xs text-blue-600 font-bold hover:underline">
                  ← Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                  Check your email
                </h1>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  We've sent a password reset link to <br />
                  <span className="font-bold text-black">{email}</span>
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-amber-50 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed mb-5 border border-amber-200 font-medium">
                Didn't receive the email? Check your spam folder or make sure you entered the correct address.
              </div>

              {/* Back to Sign In Link */}
              <Link to="/login" className="w-full">
                <button
                  type="button"
                  className="w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-all text-sm border-none shadow-sm cursor-pointer mb-3"
                >
                  Back to Sign In
                </button>
              </Link>

              {/* Resend Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => alert(`Password reset link resent to ${email}`)}
                  className="text-xs font-bold text-black hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Resend email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
