import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { verifyOtp, resendOtp } from '../services/api';

const VerifyAccount = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const { user, refreshUser, isEmailVerified } = useAuth();
  const inputRefs = useRef([]);

  // If already verified, redirect to next step
  useEffect(() => {
    if (isEmailVerified) {
      navigate('/identity-verification');
    }
  }, [isEmailVerified, navigate]);

  // Handle countdown for resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    let currentIndex = 0;

    pastedData.forEach((char) => {
      if (!isNaN(char) && char !== ' ' && currentIndex < 6) {
        newOtp[currentIndex] = char;
        currentIndex++;
      }
    });

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(code);
      await refreshUser();
      setSubmitted(true);

      // Auto-redirect to document upload after 2 seconds
      setTimeout(() => navigate('/identity-verification'), 2000);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(30);
    setError('');
    try {
      await resendOtp();
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[440px]">

          {/* ===== CARD ===== */}
          <div className="bg-[#1A1A1A] border border-[#2a2a2a] rounded-[24px] p-8 sm:p-10 shadow-2xl flex flex-col items-center">
            {!submitted ? (
              <>
                {/* Mail Icon */}
                <div className="w-14 h-14 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[#FACC15]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                  </svg>
                </div>

                {/* Header */}
                <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-3 text-center">
                  Verify your email
                </h2>
                <p className="text-white/50 text-[14px] leading-relaxed mb-6 font-normal text-center">
                  We've sent a 6-digit verification code to{' '}
                  <strong className="text-white/80 font-semibold">{user?.email || 'your email'}</strong>.
                  {' '}Enter it below to confirm your account.
                </p>

                {/* Error Banner */}
                {error && (
                  <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-[12px] text-sm mb-5 text-center font-medium">
                    {error}
                  </div>
                )}

                {/* OTP Form */}
                <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
                  <div className="flex gap-2 justify-center mb-6 w-full">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#111] border border-[#333] rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all caret-[#FACC15]"
                        type="text"
                        name="otp"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] transition-colors text-[15px] tracking-wide shadow-sm mb-5 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Account'}
                  </button>
                </form>

                {/* Resend Code */}
                <div className="text-center text-[13px] text-white/30">
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="font-semibold text-white/20">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="font-bold text-[#FACC15] hover:text-[#EAB308] transition-colors bg-transparent border-0 cursor-pointer p-0"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                {/* Header */}
                <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-3 text-center">
                  Email Verified!
                </h2>
                <p className="text-white/50 text-[14px] leading-relaxed mb-7 font-normal text-center">
                  Your email has been verified. Now let's verify your identity by uploading your documents.
                </p>

                {/* Proceed Button */}
                <button
                  onClick={() => navigate('/identity-verification')}
                  className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] flex items-center justify-center gap-2 text-[15px] tracking-wide transition-all shadow-sm cursor-pointer border-none"
                >
                  Upload Documents →
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;

