import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] font-sans antialiased">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px]">
          {/* Card Container */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-md flex flex-col items-center text-center">
            {/* Warning / Shield Icon */}
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            {/* Header Texts */}
            <h1 className="text-[32px] font-black text-[#0f172a] tracking-tight leading-none mb-4">
              Access Denied
            </h1>
            <p className="text-[#64748b] text-[15px] leading-relaxed mb-8 font-normal">
              You do not have the necessary permissions to view this page. If you believe this is an error, please contact support.
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

export default Unauthorized;
