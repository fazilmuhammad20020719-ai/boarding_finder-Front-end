import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const DigitalLease = () => {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSign = (e) => {
    e.preventDefault();
    if (!signature || !agreed) return;

    setIsSubmitting(true);
    // Simulate API call to save digital signature
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Move to success step
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col">
      <Navbar />

      {/* Top Banner */}
      <div className="bg-[#1e3a8a] text-white py-4 px-6 md:px-8 shadow-md relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Lease Agreement Signing</h1>
          <p className="text-white/70 text-sm mt-0.5">Sunset Apartment - Unit A (12-Month Lease)</p>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-2 text-sm font-bold">
          <div className={`flex items-center gap-1 ${step >= 1 ? 'text-white' : 'text-white/40'}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
            Review
          </div>
          <div className="w-4 h-0.5 bg-white/20"></div>
          <div className={`flex items-center gap-1 ${step >= 2 ? 'text-white' : 'text-white/40'}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            Sign
          </div>
          <div className="w-4 h-0.5 bg-white/20"></div>
          <div className={`flex items-center gap-1 ${step >= 3 ? 'text-[#10b981]' : 'text-white/40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#10b981] text-white' : 'bg-white/20'}`}>
              {step >= 3 ? '✓' : '3'}
            </span>
            Complete
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 gap-6">
        
        {step < 3 ? (
          <>
            {/* Left Side: Document Viewer (Mock) */}
            <div className="w-full lg:w-2/3 bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-[#e2e8f0]/60 bg-slate-50 flex justify-between items-center">
                <span className="text-sm font-bold text-[#475569]">Standard_Lease_Agreement.pdf</span>
                <div className="flex gap-2">
                  <button className="p-1.5 text-[#64748b] hover:bg-[#e2e8f0] rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                  <button className="p-1.5 text-[#64748b] hover:bg-[#e2e8f0] rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-grow bg-[#f8fafc] p-6 overflow-y-auto relative h-[50vh] lg:h-auto">
                 {/* Mock Document Content */}
                 <div className="bg-white shadow-md p-8 md:p-12 mx-auto max-w-2xl min-h-full border border-gray-200">
                    <h2 className="text-2xl font-black text-center mb-6">RESIDENTIAL LEASE AGREEMENT</h2>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      This Residential Lease Agreement ("Agreement") made this 1st day of August, 2026 is between <strong>Roberto Cruz</strong> ("Landlord") and <strong>Tenant Name</strong> ("Tenant").
                    </p>
                    <h3 className="font-bold mt-6 mb-2">1. PROPERTY</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      The Landlord agrees to lease to the Tenant the property located at Sunset Apartment, Unit A, hereinafter referred to as the "Premises".
                    </p>
                    <h3 className="font-bold mt-6 mb-2">2. TERM</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      The lease term will begin on August 15, 2026, and will terminate on August 14, 2027.
                    </p>
                    <h3 className="font-bold mt-6 mb-2">3. RENT</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      Tenant agrees to pay Landlord rent in the amount of $1,200.00 per month, payable in advance on the 1st day of each calendar month.
                    </p>
                    <div className="h-64 flex items-center justify-center border-t border-gray-300 mt-12 pt-8">
                       <p className="text-gray-400 italic">... Continued on next page ...</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Side: Signing Panel */}
            <div className="w-full lg:w-1/3 bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 p-6 md:p-8 flex flex-col">
              {step === 1 ? (
                <>
                  <div className="w-16 h-16 bg-[#ebf3ff] text-[#1952c4] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#bfdbfe]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Review Document</h2>
                  <p className="text-[#475569] text-sm leading-relaxed mb-8">
                    Please carefully read through the lease agreement in the viewer. Once you have reviewed and agree to the terms, proceed to the signing phase.
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-all text-sm"
                    >
                      I have read the document
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSign} className="flex flex-col h-full">
                  <div className="w-16 h-16 bg-[#ebf3ff] text-[#1952c4] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#bfdbfe]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Sign Agreement</h2>
                  <p className="text-[#475569] text-sm leading-relaxed mb-6">
                    Type your full legal name to electronically sign this document. This digital signature is legally binding.
                  </p>

                  <div className="mb-6">
                    <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2 uppercase">Your Electronic Signature</label>
                    <input 
                      type="text" 
                      required
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Type your full name"
                      className="w-full px-4 py-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-lg font-signature focus:ring-2 focus:ring-[#1952c4]/40 outline-none text-[#1e3a8a] italic"
                      style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-3 border border-[#e2e8f0] rounded-xl hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#1952c4] rounded focus:ring-[#1952c4]" 
                    />
                    <span className="text-xs text-[#475569] font-medium leading-relaxed">
                      I agree that my typed name above acts as my electronic signature and is the legal equivalent of my manual signature.
                    </span>
                  </label>
                  
                  <div className="mt-auto pt-6 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-bold rounded-xl transition-colors text-sm"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={!signature || !agreed || isSubmitting}
                      className="w-2/3 py-4 bg-[#10b981] hover:bg-[#059669] disabled:bg-[#a7f3d0] disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing...
                        </>
                      ) : (
                        "Sign & Complete"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        ) : (
          /* Step 3: Success State */
          <div className="w-full max-w-3xl mx-auto bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 p-12 flex flex-col items-center text-center mt-8">
             <div className="w-24 h-24 bg-[#ecfdf5] text-[#10b981] rounded-full flex items-center justify-center mb-8 shadow-sm border-[4px] border-[#a7f3d0]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
             </div>
             <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Lease Signed Successfully!</h2>
             <p className="text-[#475569] text-lg max-w-lg mb-8">
               Your digital signature has been recorded and the lease agreement is now legally binding. A copy of the signed document has been emailed to you and the landlord.
             </p>
             
             <div className="bg-[#f8fafc] w-full max-w-md p-6 rounded-2xl border border-[#e2e8f0] mb-8 text-left">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Signature Details</p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-[#0f172a]">Signer:</span>
                  <span className="text-lg italic font-signature text-[#1e3a8a]">{signature}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-[#0f172a]">Timestamp:</span>
                  <span className="text-sm text-[#475569]">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#0f172a]">IP Address:</span>
                  <span className="text-sm text-[#475569]">192.168.1.1</span>
                </div>
             </div>

             <div className="flex gap-4 w-full max-w-md">
                <button className="flex-1 py-4 bg-white border-2 border-[#1952c4] text-[#1952c4] hover:bg-[#ebf3ff] font-bold rounded-xl transition-colors text-sm">
                  Download PDF
                </button>
                <Link to="/profile" className="flex-1">
                  <button className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-colors text-sm">
                    Return to Dashboard
                  </button>
                </Link>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DigitalLease;
