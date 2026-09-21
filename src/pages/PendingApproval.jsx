import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { user, refreshUser, verificationStatus, isEmailVerified, hasUploadedDocs } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage('');
    const updatedUser = await refreshUser();
    setIsRefreshing(false);

    if (updatedUser?.verification_status === 'verified') {
      setRefreshMessage('🎉 Your account has been approved!');
      setTimeout(() => {
        navigate(updatedUser.role === 'owner' ? '/owner-dashboard' : '/home');
      }, 1500);
    } else if (updatedUser?.verification_status === 'rejected') {
      setRefreshMessage('Your verification was rejected. Please re-upload your documents.');
      setTimeout(() => navigate('/identity-verification'), 2000);
    } else {
      setRefreshMessage('Still under review. Please check back later.');
    }
  };

  const steps = [
    {
      label: 'Account Created',
      done: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Email Verified',
      done: isEmailVerified,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Documents Submitted',
      done: hasUploadedDocs,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Admin Review',
      done: verificationStatus === 'verified',
      active: verificationStatus === 'pending' && hasUploadedDocs,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased text-white">
      <Navbar />

      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[520px]">
          <div className="bg-[#1A1A1A] rounded-[24px] p-8 sm:p-10 shadow-2xl border border-[#2a2a2a] flex flex-col items-center">

            {/* Clock Icon */}
            <div className="w-16 h-16 bg-[#FACC15]/10 text-[#FACC15] rounded-full flex items-center justify-center mb-6 border border-[#FACC15]/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-[28px] font-bold text-white tracking-tight leading-none mb-3 text-center">
              Account Under Review
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed mb-8 font-normal text-center max-w-sm">
              Your documents have been submitted. An admin will review and verify your account within <strong className="text-white">24 hours</strong>.
            </p>

            {/* Progress Steps */}
            <div className="w-full space-y-3 mb-8">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    step.done
                      ? 'bg-[#10b981]/10 border-[#10b981]/30'
                      : step.active
                      ? 'bg-[#FACC15]/10 border-[#FACC15]/30'
                      : 'bg-[#111] border-[#333]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done
                      ? 'bg-[#10b981] text-black'
                      : step.active
                      ? 'bg-[#FACC15] text-black animate-pulse'
                      : 'bg-[#222] text-white/30'
                  }`}>
                    {step.done ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <div className={`text-[14px] font-bold ${
                      step.done ? 'text-[#10b981]' : step.active ? 'text-[#FACC15]' : 'text-white/40'
                    }`}>
                      {step.label}
                    </div>
                    {step.active && (
                      <div className="text-xs text-[#FACC15]/70 font-medium mt-0.5">In progress...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh Message */}
            {refreshMessage && (
              <div className={`w-full p-3 rounded-[12px] text-sm text-center font-medium mb-4 border ${
                refreshMessage.includes('approved') ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' :
                refreshMessage.includes('rejected') ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                'bg-[#111] text-white/60 border-[#333]'
              }`}>
                {refreshMessage}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] flex items-center justify-center gap-2 text-[15px] transition-all shadow-sm tracking-wide ${
                isRefreshing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Check Approval Status
                </>
              )}
            </button>

            <p className="text-center text-xs text-white/40 mt-5 font-medium">
              You'll be redirected automatically once approved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
