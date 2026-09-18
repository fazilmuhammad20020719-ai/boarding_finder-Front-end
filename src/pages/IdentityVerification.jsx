import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadVerificationDocs } from '../services/api';
import Navbar from '../components/Navbar';

const IdentityVerification = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const isOwner = user?.role === 'owner';

  const [nicFile, setNicFile] = useState(null);
  const [secondFile, setSecondFile] = useState(null); // Student ID or BR
  const [nicPreview, setNicPreview] = useState(null);
  const [secondPreview, setSecondPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    const preview = URL.createObjectURL(file);
    if (type === 'nic') {
      setNicFile(file);
      setNicPreview(preview);
    } else {
      setSecondFile(file);
      setSecondPreview(preview);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nicFile || !secondFile) {
      setError('Please upload both required documents.');
      return;
    }

    setIsUploading(true);
    try {
      await uploadVerificationDocs([nicFile, secondFile]);
      await refreshUser();
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const FileUploadBox = ({ label, preview, onChange, inputId }) => (
    <div>
      <label className="block text-[11px] font-bold text-white/40 tracking-widest mb-2.5 uppercase">
        {label}
      </label>
      <label
        htmlFor={inputId}
        className="border-2 border-dashed border-[#333] rounded-[16px] p-6 text-center hover:border-[#FACC15]/40 hover:bg-[#FACC15]/5 transition-all cursor-pointer block"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-36 mx-auto rounded-xl object-contain" />
            <div className="mt-3 text-xs font-semibold text-emerald-400">✓ File selected — click to change</div>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-8 w-8 text-white/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-semibold text-[#FACC15]">Click to upload</p>
            <p className="text-xs text-white/30 mt-1">JPEG, PNG, WebP, or PDF (max 5MB)</p>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased">
      <Navbar />

      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[520px]">

          {/* ===== CARD ===== */}
          <div className="bg-[#1A1A1A] border border-[#2a2a2a] rounded-[24px] p-8 sm:p-10 shadow-2xl flex flex-col">

            {!submitted ? (
              <>
                {/* Icon */}
                <div className="w-14 h-14 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-2xl flex items-center justify-center mb-6 self-center">
                  <svg className="w-6 h-6 text-[#FACC15]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                </div>

                <h2 className="text-[26px] font-bold text-white tracking-tight leading-none mb-3 text-center">
                  Upload Verification Documents
                </h2>
                <p className="text-white/50 text-[14px] leading-relaxed mb-7 font-normal text-center">
                  {isOwner
                    ? 'Please upload your NIC (National Identity Card) and Business Registration (BR) document to verify property ownership.'
                    : 'Please upload your NIC (National Identity Card) and Student ID card to verify your student status.'}
                </p>

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-[12px] text-sm mb-5 text-center font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                  <FileUploadBox
                    label="NIC (National Identity Card)"
                    preview={nicPreview}
                    onChange={(e) => handleFileChange(e, 'nic')}
                    inputId="nic-upload"
                  />

                  <FileUploadBox
                    label={isOwner ? 'Business Registration (BR) Document' : 'Student ID Card'}
                    preview={secondPreview}
                    onChange={(e) => handleFileChange(e, 'second')}
                    inputId="second-upload"
                  />

                  <button
                    type="submit"
                    disabled={isUploading || !nicFile || !secondFile}
                    className={`w-full py-4 font-bold rounded-[14px] flex items-center justify-center gap-2 transition-colors text-[15px] tracking-wide shadow-sm mt-2 ${
                      isUploading || !nicFile || !secondFile
                        ? 'bg-[#FACC15]/30 text-black/40 cursor-not-allowed'
                        : 'bg-[#FACC15] hover:bg-[#EAB308] text-black cursor-pointer'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading Documents...
                      </>
                    ) : (
                      'Submit for Review'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 self-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2 className="text-[30px] font-bold text-white tracking-tight leading-none mb-4 text-center">
                  Documents Submitted!
                </h2>

                {/* Pending notice */}
                <div className="bg-[#FACC15]/5 border border-[#FACC15]/20 rounded-[16px] p-5 text-[13px] text-white/60 leading-relaxed mb-7 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-[#FACC15]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-[#FACC15] text-[13px]">Pending Admin Review</span>
                  </div>
                  <p>
                    Your documents have been submitted successfully. An admin will review and verify your account within{' '}
                    <strong className="text-white/80">24 hours</strong>.
                    {' '}You'll receive a notification once your account is approved.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/pending-approval')}
                  className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] flex items-center justify-center gap-2 text-[15px] tracking-wide transition-all shadow-sm cursor-pointer border-none"
                >
                  View Approval Status
                </button>
              </>
            )}
          </div>

          {/* Security footer */}
          <div className="text-center mt-5 flex items-center justify-center gap-2 text-xs font-medium text-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your data is securely encrypted and stored.
          </div>

        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
