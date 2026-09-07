import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { uploadVerificationDocs } from '../services/api';

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
      <label className="block text-[12px] font-bold text-[#475569] tracking-wider mb-2 uppercase">
        {label}
      </label>
      <label
        htmlFor={inputId}
        className="border-2 border-dashed border-[#cbd5e1] rounded-[20px] p-6 text-center hover:bg-slate-50 hover:border-[#1952c4]/40 transition-all cursor-pointer block"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-36 mx-auto rounded-xl object-contain" />
            <div className="mt-3 text-xs font-semibold text-[#10b981]">✓ File selected — click to change</div>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-8 w-8 text-[#94a3b8] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-[#1952c4]">Click to upload</p>
            <p className="text-xs text-[#64748b] mt-1">JPEG, PNG, WebP, or PDF (max 5MB)</p>
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
    <div className="min-h-screen flex flex-col bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[560px]">
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-[#e2e8f0]/60 flex flex-col">

            {!submitted ? (
              <>
                {/* Icon */}
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
                  Upload Verification Documents
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mb-8 font-normal text-center">
                  {isOwner
                    ? 'Please upload your NIC (National Identity Card) and Business Registration (BR) document to verify property ownership.'
                    : 'Please upload your NIC (National Identity Card) and Student ID card to verify your student status.'}
                </p>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <FileUploadBox
                    label="NIC (National Identity Card)"
                    preview={nicPreview}
                    onChange={(e) => handleFileChange(e, 'nic')}
                    inputId="nic-upload"
                  />

                  <FileUploadBox
                    label={isOwner ? "Business Registration (BR) Document" : "Student ID Card"}
                    preview={secondPreview}
                    onChange={(e) => handleFileChange(e, 'second')}
                    inputId="second-upload"
                  />

                  <button
                    type="submit"
                    disabled={isUploading || !nicFile || !secondFile}
                    className={`w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] disabled:bg-[#94a3b8] disabled:cursor-not-allowed text-white font-bold rounded-[16px] flex items-center justify-center gap-2 transition-colors text-[15px] shadow-sm ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                {/* Success State */}
                <div className="w-16 h-16 bg-[#ecfdf5] text-[#10b981] rounded-full flex items-center justify-center mb-6 self-center shadow-sm border border-[#a7f3d0]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2 className="text-[32px] font-black text-[#0f172a] tracking-tight leading-none mb-4 text-center">
                  Documents Submitted!
                </h2>

                <div className="bg-[#fff8e6] rounded-[16px] p-5 text-[14px] text-[#92400e] leading-relaxed mb-8 text-center border border-[#f59e0b]/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-[#f59e0b]">Pending Admin Review</span>
                  </div>
                  <p>
                    Your documents have been submitted successfully. An admin will review and verify your account within <strong>24 hours</strong>.
                    You'll receive a notification once your account is approved.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/pending-approval')}
                  className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-[16px] flex items-center justify-center gap-2 text-[15px] transition-all duration-200 shadow-sm cursor-pointer border-none"
                >
                  View Approval Status
                </button>
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
