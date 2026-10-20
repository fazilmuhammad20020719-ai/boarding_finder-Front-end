import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { getMyListings, getPromotionPlans, getPaymentConfig, startPromotionCheckout, redirectToPayHere } from '../services/api';

const PROMOTE_PLANS = [
  {
    id: 'basic',
    name: 'Basic Boost',
    duration: '3 Days',
    features: ['Highlight tag on listing', 'Appears higher in standard searches'],
    color: 'bg-[#111] border-[#333] hover:border-blue-500',
    badge: null
  },
  {
    id: 'premium',
    name: 'Premium Placement',
    duration: '7 Days',
    features: ['Top 3 results guaranteed', 'Premium "Featured" ribbon', 'Included in weekly newsletter'],
    color: 'bg-[#111] border-[#333] hover:border-[#FACC15]',
    badge: 'Most Popular'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Spotlight',
    duration: '14 Days',
    features: ['#1 Result on Homepage', 'Push notification to matched seekers', 'Gold "Sponsored" ribbon', 'Dedicated social media shoutout'],
    color: 'bg-[#111] border-[#333] hover:border-amber-500',
    badge: 'Best Value'
  }
];

const PromoteProperty = () => {
  const [listings, setListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState('');
  const [plans, setPlans] = useState(PROMOTE_PLANS);
  const [currency, setCurrency] = useState('LKR');
  const [selectedPlan, setSelectedPlan] = useState(PROMOTE_PLANS[1]); // Default to Premium
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyListings()
      .then((data) => {
        const mine = data.listings || [];
        setListings(mine);
        if (mine.length > 0) setSelectedListingId(String(mine[0].listing_id));
      })
      .catch((err) => setError(err.message || 'Failed to load your listings'));

    // Prices come from the server so they cannot be tampered with client-side
    getPromotionPlans()
      .then((data) => {
        setCurrency(data.currency);
        const merged = PROMOTE_PLANS.map((plan) => {
          const server = data.plans.find((p) => p.id === plan.id);
          return server ? { ...plan, price: server.price, duration: `${server.days} Days` } : plan;
        });
        setPlans(merged);
        setSelectedPlan((prev) => merged.find((p) => p.id === prev.id) || merged[0]);
      })
      .catch(() => {});

    getPaymentConfig()
      .then((cfg) => setPaymentsEnabled(cfg.enabled))
      .catch(() => setPaymentsEnabled(false));
  }, []);

  const formatPrice = (price) => price == null ? '—' : `${currency} ${Number(price).toLocaleString()}`;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedListingId) {
      setError('Please select a listing to promote.');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const checkout = await startPromotionCheckout({ listing_id: Number(selectedListingId), plan_id: selectedPlan.id });
      redirectToPayHere(checkout); // leaves the page
    } catch (err) {
      setError(err.message || 'Failed to start payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/owner-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors mb-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Promote Your Listing</h1>
            <p className="text-white/60 mt-1 text-[15px]">Stand out from the crowd and fill your vacancies up to 3x faster.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Plans & Selection */}
          <div className="w-full lg:w-3/5 space-y-6">
            
            {/* Property Selector */}
            <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6">
              <label className="block text-xs font-bold text-white/60 tracking-wider mb-3 uppercase">Select Property to Boost</label>
              <select 
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-[15px] font-bold text-white focus:ring-2 focus:ring-[#FACC15]/20 outline-none cursor-pointer shadow-inner"
              >
                {listings.length === 0 && <option value="">No listings yet — add one first</option>}
                {listings.map((l) => (
                  <option key={l.listing_id} value={l.listing_id}>{l.title}</option>
                ))}
              </select>
            </div>

            {/* Pricing Plans */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Choose a Boost Package</h3>
              
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative p-6 rounded-[24px] border-2 cursor-pointer transition-all ${plan.color} ${selectedPlan.id === plan.id ? 'ring-4 ring-opacity-20 shadow-md ring-[#FACC15] border-[#FACC15]' : 'opacity-80 hover:opacity-100'}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-6 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {plan.badge}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <p className="text-sm font-semibold text-white/60">Duration: {plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{formatPrice(plan.price)}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-white/60 font-medium">
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Selection Indicator */}
                  <div className={`mt-4 pt-4 border-t ${selectedPlan.id === plan.id ? 'border-[#FACC15]/20' : 'border-[#333]'} flex items-center gap-2`}>
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan.id === plan.id ? 'border-[#FACC15] bg-[#FACC15]' : 'border-[#333]'}`}>
                        {selectedPlan.id === plan.id && <div className="w-2 h-2 rounded-full bg-black"></div>}
                     </div>
                     <span className={`text-sm font-bold ${selectedPlan.id === plan.id ? 'text-[#FACC15]' : 'text-white/40'}`}>
                       {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Checkout */}
          <div className="w-full lg:w-2/5">
            <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 md:p-8 sticky top-8">
               <h3 className="text-xl font-bold text-white mb-6">Payment Details</h3>
               
               {/* Order Summary */}
               <div className="bg-[#111] rounded-xl p-4 mb-6 border border-[#333]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-white/60">Package:</span>
                    <span className="text-sm font-bold text-white">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#333]">
                    <span className="text-sm font-semibold text-white/60">Duration:</span>
                    <span className="text-sm font-bold text-white">{selectedPlan.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Amount:</span>
                    <span className="text-2xl font-black text-[#FACC15]">{formatPrice(selectedPlan.price)}</span>
                  </div>
               </div>

               {/* Card details are entered on PayHere's secure hosted page, never here */}
               <form onSubmit={handlePayment} className="space-y-4">
                  <p className="text-sm text-white/60">
                    You'll be redirected to PayHere to pay securely by card, eZ Cash, mCash or bank transfer.
                  </p>
                  {!paymentsEnabled && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                      Online payments are not configured yet. Please contact support.
                    </div>
                  )}
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isProcessing || !paymentsEnabled || !selectedListingId}
                      className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-slate-700 disabled:text-white/40 disabled:cursor-not-allowed text-black font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 border-none"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Redirecting to PayHere...
                        </>
                      ) : (
                        `Pay ${formatPrice(selectedPlan.price)}`
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-white/40">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      <span className="text-[10px] uppercase font-bold tracking-wider">Secured by PayHere</span>
                    </div>
                  </div>
               </form>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PromoteProperty;
