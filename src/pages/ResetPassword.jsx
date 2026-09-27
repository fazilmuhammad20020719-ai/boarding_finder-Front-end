import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from 'C:/Users/A.S.F Nuha/.gemini/antigravity-ide/brain/171a4f1b-a721-46c5-8056-e2f868ece8ba/simple_boarding_house_1790525944006.png';
import LogoIcon from '../components/Logo';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleReset = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (passwordStrength < 5) {
      setError("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.");
      return;
    }
    setError('');
    setSubmitted(true);
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
                  Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                  Please enter your new password below.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all"
                    maxLength={128}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all"
                    maxLength={128}
                    required
                  />
                  {confirmPassword.length > 0 && password === confirmPassword && (
                    <p className="text-emerald-700 text-xs mt-1 font-bold">✓ Passwords match</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-all text-sm tracking-wide shadow-sm border-none cursor-pointer mt-2"
                >
                  RESET PASSWORD
                </button>
              </form>

              {/* Back to Sign In Link */}
              <div className="mt-5 text-center pt-3 border-t border-gray-100">
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
                  Password Reset Successfully
                </h1>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Your password has been changed successfully. You can now login with your new password.
                </p>
              </div>

              {/* Back to Sign In Link */}
              <Link to="/login" className="w-full">
                <button
                  type="button"
                  className="w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-all text-sm border-none shadow-sm cursor-pointer"
                >
                  Continue to Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
