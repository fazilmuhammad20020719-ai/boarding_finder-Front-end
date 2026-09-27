import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getLeaseByBookingId, signLease } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DigitalLease = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchLease = async () => {
      try {
        const data = await getLeaseByBookingId(bookingId);
        setLease(data);
        if (data.status === 'signed') {
          setStep(3); // Already signed
          setSignature(data.student_signature);
        }
      } catch (err) {
        console.error("Error fetching lease:", err);
        setError(err.message || "Failed to fetch lease details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLease();
  }, [bookingId]);

  const handleSign = async (e) => {
    e.preventDefault();
    if (!signature || !agreed || !lease) return;

    setIsSubmitting(true);
    try {
      await signLease(lease.id, signature);
      setLease(prev => ({ ...prev, status: 'signed', student_signature: signature, signed_at: new Date().toISOString() }));
      setStep(3);
    } catch (err) {
      alert(err.message || "Failed to sign lease");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FACC15]"></div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="min-h-screen bg-black flex flex-col font-sans text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-[#1A1A1A] p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-[#333]">
            <div className="text-red-500 mb-4 flex justify-center">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Lease Not Found</h2>
            <p className="text-white/60 mb-6">{error || "The landlord has not generated a lease for this booking yet."}</p>
            <button onClick={() => navigate('/my-bookings')} className="px-6 py-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(lease.start_date).toLocaleDateString();
  const endDate = new Date(lease.end_date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white flex flex-col">
      <Navbar />

      {/* Top Banner */}
      <div className="bg-[#111] border-b border-[#333] text-white py-4 px-6 md:px-8 shadow-sm relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Lease Agreement Signing</h1>
          <p className="text-white/70 text-sm mt-0.5">{lease.property_name} ({lease.property_address})</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 text-sm font-bold">
          <div className={`flex items-center gap-1 ${step >= 1 ? 'text-white' : 'text-white/40'}`}>
            <span className="w-5 h-5 rounded-full bg-[#333] flex items-center justify-center text-xs">1</span>
            Review
          </div>
          <div className="w-4 h-0.5 bg-[#333]"></div>
          <div className={`flex items-center gap-1 ${step >= 2 ? 'text-white' : 'text-white/40'}`}>
            <span className="w-5 h-5 rounded-full bg-[#333] flex items-center justify-center text-xs">2</span>
            Sign
          </div>
          <div className="w-4 h-0.5 bg-[#333]"></div>
          <div className={`flex items-center gap-1 ${step >= 3 ? 'text-[#FACC15]' : 'text-white/40'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#FACC15] text-black' : 'bg-[#333]'}`}>
              {step >= 3 ? '✓' : '3'}
            </span>
            Complete
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 gap-6">

        {step < 3 ? (
          <>
            {/* Left Side: Document Viewer */}
            <div className="w-full lg:w-2/3 bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-[#333] bg-[#222] flex justify-between items-center">
                <span className="text-sm font-bold text-white">Standard_Lease_Agreement.pdf</span>
              </div>

              <div className="flex-grow bg-black p-6 overflow-y-auto relative h-[50vh] lg:h-auto custom-scrollbar">
                {/* Document Content */}
                <div className="bg-[#111] shadow-md p-8 md:p-12 mx-auto max-w-2xl min-h-full border border-[#333]">
                  <h2 className="text-2xl font-black text-center mb-6 text-white">RESIDENTIAL LEASE AGREEMENT</h2>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    This Residential Lease Agreement ("Agreement") made this <strong className="text-white">{new Date().toLocaleDateString()}</strong> is between <strong className="text-white">{lease.owner_name}</strong> ("Landlord") and <strong className="text-white">{lease.student_name}</strong> ("Tenant").
                  </p>
                  <h3 className="font-bold mt-6 mb-2 text-white">1. PROPERTY</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    The Landlord agrees to lease to the Tenant the property located at {lease.property_address} ({lease.property_name}), hereinafter referred to as the "Premises".
                  </p>
                  <h3 className="font-bold mt-6 mb-2 text-white">2. TERM</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    The lease term will begin on <strong className="text-white">{startDate}</strong>, and will terminate on <strong className="text-white">{endDate}</strong>.
                  </p>
                  <h3 className="font-bold mt-6 mb-2 text-white">3. RENT</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    Tenant agrees to pay Landlord rent in the amount of <strong className="text-[#FACC15]">LKR {Number(lease.rent_amount).toLocaleString()}</strong> per month, payable in advance on the 1st day of each calendar month.
                  </p>
                  <h3 className="font-bold mt-6 mb-2 text-white">4. TERMS</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    {lease.terms}
                  </p>
                  <div className="h-32 flex items-center justify-center border-t border-[#333] mt-12 pt-8">
                    <p className="text-white/40 italic">... End of Document ...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Signing Panel */}
            <div className="w-full lg:w-1/3 bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 md:p-8 flex flex-col">
              {step === 1 ? (
                <>
                  <div className="w-16 h-16 bg-[#FACC15]/20 text-[#FACC15] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Review Document</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    Please carefully read through the lease agreement in the viewer. Once you have reviewed and agree to the terms, proceed to the signing phase.
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl shadow-sm transition-all text-sm cursor-pointer"
                    >
                      I have read the document
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSign} className="flex flex-col h-full">
                  <div className="w-16 h-16 bg-[#FACC15]/20 text-[#FACC15] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sign Agreement</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    Type your full legal name to electronically sign this document. This digital signature is legally binding.
                  </p>

                  <div className="mb-6">
                    <label className="block text-[11px] font-bold text-white/40 tracking-wider mb-2 uppercase">Your Electronic Signature</label>
                    <input
                      type="text"
                      required
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Type your full name"
                      className="w-full px-4 py-4 bg-[#111] border border-[#333] rounded-xl text-lg font-signature focus:ring-2 focus:ring-[#FACC15] outline-none text-[#FACC15] italic"
                      style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-3 border border-[#333] rounded-xl hover:bg-[#222] transition-colors">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#FACC15] bg-[#111] border-[#333] rounded focus:ring-[#FACC15]"
                    />
                    <span className="text-xs text-white/60 font-medium leading-relaxed">
                      I agree that my typed name above acts as my electronic signature and is the legal equivalent of my manual signature.
                    </span>
                  </label>

                  <div className="mt-auto pt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 bg-[#111] border border-[#333] hover:bg-[#222] text-white font-bold rounded-xl transition-colors text-sm cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!signature || !agreed || isSubmitting}
                      className="w-2/3 py-4 bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-[#FACC15]/50 disabled:cursor-not-allowed text-black font-bold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          /* Step 3: Success State (or already signed) */
          <div className="w-full max-w-3xl mx-auto bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-12 flex flex-col items-center text-center mt-8">
            <div className="w-24 h-24 bg-[#FACC15]/20 text-[#FACC15] rounded-full flex items-center justify-center mb-8">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">Lease Signed Successfully!</h2>
            <p className="text-white/60 text-lg max-w-lg mb-8">
              Your digital signature has been recorded and the lease agreement is now legally binding. A copy of the signed document has been saved.
            </p>

            <div className="bg-[#111] w-full max-w-md p-6 rounded-2xl border border-[#333] mb-8 text-left">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Signature Details</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-white">Signer:</span>
                <span className="text-lg italic font-signature text-[#FACC15]" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}>{lease.student_signature}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-white">Timestamp:</span>
                <span className="text-sm text-white/60">{new Date(lease.signed_at || new Date()).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <Link to={user?.role === 'owner' ? "/owner-dashboard" : "/my-bookings"} className="flex-1">
                <button className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl shadow-sm transition-colors text-sm cursor-pointer">
                  Return to Bookings
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
