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
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden transform transition-transform duration-200 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {!submitted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]/60 bg-slate-50">
              <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report {targetType}
              </h3>
              <button 
                onClick={handleClose}
                className="text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#e2e8f0] p-1.5 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-[#475569] text-sm mb-5">
                Why are you reporting <span className="font-semibold text-[#0f172a]">{targetName}</span>? Your report will be kept strictly anonymous.
              </p>

              <div className="space-y-3 mb-6">
                {reportReasons.map((r, idx) => (
                  <label key={idx} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                    reason === r ? 'border-red-500 bg-red-50' : 'border-[#e2e8f0] hover:bg-slate-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={r} 
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className={`text-sm ${reason === r ? 'font-semibold text-red-900' : 'text-[#475569]'}`}>
                      {r}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">
                  Additional Details (Optional)
                </label>
                <textarea 
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide any other relevant information to help admins investigate..."
                  className="w-full px-4 py-3 bg-[#f0f4f9] border border-[#e2e8f0]/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/3 py-3 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-bold rounded-[12px] transition-colors text-sm shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason}
                  className="w-2/3 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold rounded-[12px] transition-colors text-sm shadow-sm"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Report Submitted</h3>
            <p className="text-[#64748b] text-sm">
              Thank you for keeping our community safe. Our admins will review your report shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
