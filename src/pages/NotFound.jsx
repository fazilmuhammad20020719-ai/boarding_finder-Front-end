import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] font-sans antialiased">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          {/* Card Container */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-md flex flex-col items-center text-center">
            {/* 404 Icon / Illustration */}
            <div className="w-20 h-20 bg-[#ebf3ff] text-[#1952c4] rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>

            {/* Header Texts */}
            <h1 className="text-[48px] font-black text-[#0f172a] tracking-tight leading-none mb-4">
              404
            </h1>
            <h2 className="text-[24px] font-bold text-[#0f172a] tracking-tight leading-none mb-3">
              Page Not Found
            </h2>
            <p className="text-[#64748b] text-[15px] leading-relaxed mb-8 font-normal">
              Oops! We can't seem to find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            {/* Back to Home Button */}
            <Link to="/" className="w-full">
              <button
                type="button"
                className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-[16px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 shadow-sm"
              >
                <span>←</span> Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
