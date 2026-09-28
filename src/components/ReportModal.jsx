import React, { useState, useEffect } from 'react';

const ReportModal = ({ isOpen, onClose, targetType = 'Listing', targetName = 'this item' }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      // Reset state after closing animation
      setTimeout(() => {
        setSubmitted(false);
        setReason('');
        setDetails('');
      }, 300);
    }, 200); // match transition duration
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    
    // In a real application, submit the report to an API here.
    
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  if (!isOpen && !isAnimating) return null;

  const reportReasons = targetType.toLowerCase() === 'user' 
    ? [
        "Abusive or inappropriate behavior",
        "Spam or scam account",
        "Fake profile or impersonation",
        "Other"
      ]
    : [
        "Fraudulent or fake listing",
        "Inaccurate photos or description",
        "Property is unavailable",
        "Discriminatory rules",
        "Other"
      ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-md bg-[#1A1A1A] border border-[#333] rounded-[24px] shadow-2xl overflow-hidden transform transition-transform duration-200 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {!submitted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#111]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report {targetType}
              </h3>
              <button 
                onClick={handleClose}
                className="text-white/40 hover:text-white hover:bg-[#222] p-1.5 rounded-full transition-colors border-none bg-transparent cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-white/60 text-sm mb-5">
                Why are you reporting <span className="font-semibold text-white">{targetName}</span>? Your report will be kept strictly anonymous.
              </p>

              <div className="space-y-3 mb-6">
                {reportReasons.map((r, idx) => (
                  <label key={idx} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                    reason === r ? 'border-red-500 bg-red-500/10' : 'border-[#333] hover:bg-[#222]'
                  }`}>
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={r} 
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-red-600 focus:ring-red-500 border-[#333] bg-[#111]"
                    />
                    <span className={`text-sm ${reason === r ? 'font-semibold text-red-400' : 'text-white/60'}`}>
                      {r}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-bold text-white/60 tracking-wider mb-2 uppercase">
                  Additional Details (Optional)
                </label>
                <textarea 
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide any other relevant information to help admins investigate..."
                  className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-[#111] transition-all resize-none"
                ></textarea>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/3 py-3 bg-[#111] border border-[#333] hover:bg-[#222] text-white/80 font-bold rounded-[12px] transition-colors text-sm shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason}
                  className="w-2/3 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:text-white/40 disabled:cursor-not-allowed text-white font-bold rounded-[12px] transition-colors text-sm shadow-sm cursor-pointer border-none"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#10b981]/20 text-[#10b981] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Report Submitted</h3>
            <p className="text-white/60 text-sm">
              Thank you for keeping our community safe. Our admins will review your report shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
