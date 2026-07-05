import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const VerifyAccount = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

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

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    
    // Simulate verification
    setError('');
    setSubmitted(true);
    
    // In a real app, you would verify the OTP via API here.
    // setTimeout(() => navigate('/home'), 2000);
  };

  const handleResend = () => {
    setResendTimer(30);
    // Add logic to resend OTP to user's email
    alert('Verification code resent to your email.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] font-sans antialiased">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          {/* Card Container */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-md flex flex-col">
            {!submitted ? (
              <>
                {/* Mail Icon */}
                <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3 text-center">
                  Verify your email
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-6 font-normal text-center">
                  We've sent a 6-digit verification code to your email address. Enter it below to confirm your account.
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">
                    {error}
                  </div>
                )}

                {/* OTP Form */}
                <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
                  <div className="flex gap-2 justify-center mb-6 w-full">
                    {otp.map((data, index) => (
                      <input
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#f0f4f9] border border-[#e2e8f0]/40 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all"
                        type="text"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-[16px] transition-colors text-base shadow-sm mb-6"
                  >
                    Verify Account
                  </button>
                </form>

                {/* Resend Code Section */}
                <div className="text-center text-[14px] text-[#64748b]">
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="font-semibold text-[#94a3b8]">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="font-bold text-[#1952c4] hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                {/* Header Texts */}
                <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3 text-center">
                  Email Verified!
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-6 font-normal text-center">
                  Your email has been successfully verified. You can now access all features of the platform.
                </p>

                {/* Proceed Button */}
                <Link to="/home" className="w-full">
                  <button
                    type="button"
                    className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-[16px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 shadow-sm"
                  >
                    Go to Home Page
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

export default VerifyAccount;
