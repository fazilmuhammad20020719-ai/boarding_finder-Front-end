import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const IdentityVerification = () => {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 2) {
      setIsUploading(true);
      // Mock upload process
      setTimeout(() => {
        setIsUploading(false);
        setStep(3);
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[560px]">
          {/* Card Container */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-[#e2e8f0]/60 flex flex-col">
            
            {/* Step Indicators */}
            {step < 3 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className={`w-1/2 h-2 rounded-full ${step >= 1 ? 'bg-[#1952c4]' : 'bg-[#e2e8f0]'}`}></div>
                <div className={`w-1/2 h-2 rounded-full ${step >= 2 ? 'bg-[#1952c4]' : 'bg-[#e2e8f0]'}`}></div>
              </div>
            )}

            {/* STEP 1: Select Document Type */}
            {step === 1 && (
              <>
                <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                </div>

                <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3 text-center">
                  Verify Your Identity
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-8 font-normal text-center">
                  To keep our community safe, we need to verify your identity. Please select a valid government-issued document to upload.
                </p>

                <form onSubmit={handleNextStep} className="w-full space-y-4">
                  {/* Option 1 */}
                  <label className={`block border rounded-[16px] p-4 cursor-pointer transition-all ${
                    docType === 'passport' ? 'border-[#1952c4] bg-[#ebf3ff]/50 shadow-sm' : 'border-[#e2e8f0]/80 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="docType" 
                        value="passport" 
                        checked={docType === 'passport'}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-5 h-5 text-[#1952c4] focus:ring-[#1952c4]" 
                        required
                      />
                      <span className="font-semibold text-[15px]">Passport</span>
                    </div>
                  </label>

                  {/* Option 2 */}
                  <label className={`block border rounded-[16px] p-4 cursor-pointer transition-all ${
                    docType === 'drivers_license' ? 'border-[#1952c4] bg-[#ebf3ff]/50 shadow-sm' : 'border-[#e2e8f0]/80 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="docType" 
                        value="drivers_license" 
                        checked={docType === 'drivers_license'}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-5 h-5 text-[#1952c4] focus:ring-[#1952c4]" 
                      />
                      <span className="font-semibold text-[15px]">Driver's License</span>
                    </div>
                  </label>

                  {/* Option 3 */}
                  <label className={`block border rounded-[16px] p-4 cursor-pointer transition-all ${
                    docType === 'national_id' ? 'border-[#1952c4] bg-[#ebf3ff]/50 shadow-sm' : 'border-[#e2e8f0]/80 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="docType" 
                        value="national_id" 
                        checked={docType === 'national_id'}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-5 h-5 text-[#1952c4] focus:ring-[#1952c4]" 
                      />
                      <span className="font-semibold text-[15px]">National ID Card</span>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={!docType}
                    className="w-full py-4 mt-4 bg-[#1952c4] hover:bg-[#1546a8] disabled:bg-[#94a3b8] disabled:cursor-not-allowed text-white font-semibold rounded-[16px] transition-colors text-base shadow-sm"
                  >
                    Continue
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: Upload Documents */}
            {step === 2 && (
              <>
                <div className="w-14 h-14 bg-[#ebf3ff] text-[#1952c4] rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>

                <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-none mb-3 text-center">
                  Upload Photos
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-8 font-normal text-center">
                  Please upload clear photos of the front and back of your selected document. Make sure all text is readable.
                </p>

                <form onSubmit={handleNextStep} className="w-full space-y-6">
                  
                  {/* Front Upload */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#475569] tracking-wider mb-2 uppercase">
                      Front of Document
                    </label>
                    <div className="border-2 border-dashed border-[#cbd5e1] rounded-[20px] p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="mx-auto h-8 w-8 text-[#94a3b8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium text-[#1952c4]">Click to upload or drag and drop</p>
                      <p className="text-xs text-[#64748b] mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  {/* Back Upload */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#475569] tracking-wider mb-2 uppercase">
                      Back of Document
                    </label>
                    <div className="border-2 border-dashed border-[#cbd5e1] rounded-[20px] p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <svg className="mx-auto h-8 w-8 text-[#94a3b8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium text-[#1952c4]">Click to upload or drag and drop</p>
                      <p className="text-xs text-[#64748b] mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-bold rounded-[16px] transition-colors text-[15px] shadow-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-2/3 py-4 bg-[#1952c4] hover:bg-[#1546a8] disabled:bg-[#1952c4]/70 text-white font-bold rounded-[16px] flex items-center justify-center gap-2 transition-colors text-[15px] shadow-sm"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        "Submit Documents"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <>
                <div className="w-16 h-16 bg-[#ecfdf5] text-[#10b981] rounded-full flex items-center justify-center mb-6 self-center shadow-sm border border-[#a7f3d0]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2 className="text-[32px] font-black text-[#0f172a] tracking-tight leading-none mb-4 text-center">
                  Identity Verified!
                </h2>
                <div className="bg-[#f8fafc] rounded-[16px] p-5 text-[14px] text-[#475569] leading-relaxed mb-8 text-center border border-[#e2e8f0]/60 flex flex-col items-center gap-2">
                   <div className="bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                     Verified Badge Unlocked
                   </div>
                   <p className="mt-2">
                     Thank you for verifying your identity. Your profile now features a "Verified" badge, giving other users more confidence when booking with you.
                   </p>
                </div>

                <Link to="/profile" className="w-full">
                  <button
                    type="button"
                    className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-[16px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 shadow-sm"
                  >
                    Return to Profile
                  </button>
                </Link>
              </>
            )}
          </div>
          
          <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#64748b]">
             <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             Your data is securely encrypted and stored.
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
