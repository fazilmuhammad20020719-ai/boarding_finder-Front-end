import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const PROMOTE_PLANS = [
  {
    id: 'basic',
    name: 'Basic Boost',
    price: 9.99,
    duration: '3 Days',
    features: ['Highlight tag on listing', 'Appears higher in standard searches'],
    color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
    badge: null
  },
  {
    id: 'premium',
    name: 'Premium Placement',
    price: 19.99,
    duration: '7 Days',
    features: ['Top 3 results guaranteed', 'Premium "Featured" ribbon', 'Included in weekly newsletter'],
    color: 'bg-purple-50 border-purple-200 hover:border-purple-500',
    badge: 'Most Popular'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Spotlight',
    price: 39.99,
    duration: '14 Days',
    features: ['#1 Result on Homepage', 'Push notification to matched seekers', 'Gold "Sponsored" ribbon', 'Dedicated social media shoutout'],
    color: 'bg-amber-50 border-amber-200 hover:border-amber-500',
    badge: 'Best Value'
  }
];

const PromoteProperty = () => {
  const [selectedProperty, setSelectedProperty] = useState('Sunset Apartment - Unit A');
  const [selectedPlan, setSelectedPlan] = useState(PROMOTE_PLANS[1]); // Default to Premium
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-[24px] shadow-xl border border-[#e2e8f0]/60 p-12 max-w-md w-full text-center flex flex-col items-center animate-fade-in-down">
           <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
               <polyline points="20 6 9 17 4 12" />
             </svg>
           </div>
           <h2 className="text-3xl font-black text-[#0f172a] mb-3">Boost Activated!</h2>
           <p className="text-[#64748b] mb-8">
             Your payment of <strong>${selectedPlan.price}</strong> was successful. <br/>
             <span className="font-bold text-[#0f172a]">{selectedProperty}</span> is now enjoying <span className="font-bold text-[#1952c4]">{selectedPlan.name}</span> benefits for the next {selectedPlan.duration}.
           </p>
           <Link to="/owner-dashboard" className="w-full">
             <button className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-colors text-sm">
               Return to Dashboard
             </button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link to="/owner-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] hover:text-[#1952c4] transition-colors mb-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Promote Your Listing</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Stand out from the crowd and fill your vacancies up to 3x faster.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Plans & Selection */}
          <div className="w-full lg:w-3/5 space-y-6">
            
            {/* Property Selector */}
            <div className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 p-6">
              <label className="block text-xs font-bold text-[#475569] tracking-wider mb-3 uppercase">Select Property to Boost</label>
              <select 
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-4 py-3 bg-[#f0f4f9] border border-[#e2e8f0]/40 rounded-xl text-[15px] font-bold text-[#0f172a] focus:ring-2 focus:ring-[#1952c4]/20 outline-none cursor-pointer shadow-inner"
              >
                <option>Sunset Apartment - Unit A</option>
                <option>Oceanview Studio</option>
                <option>Downtown Loft</option>
              </select>
            </div>

            {/* Pricing Plans */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">Choose a Boost Package</h3>
              
              {PROMOTE_PLANS.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative p-6 rounded-[24px] border-2 cursor-pointer transition-all ${plan.color} ${selectedPlan.id === plan.id ? 'ring-4 ring-opacity-20 shadow-md ring-[#1952c4] border-[#1952c4]' : 'opacity-80 hover:opacity-100'}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-6 bg-[#1952c4] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {plan.badge}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-[#0f172a]">{plan.name}</h4>
                      <p className="text-sm font-semibold text-[#64748b]">Duration: {plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#0f172a]">${plan.price}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#475569] font-medium">
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Selection Indicator */}
                  <div className={`mt-4 pt-4 border-t ${selectedPlan.id === plan.id ? 'border-[#1952c4]/20' : 'border-gray-200/60'} flex items-center gap-2`}>
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan.id === plan.id ? 'border-[#1952c4] bg-[#1952c4]' : 'border-gray-300'}`}>
                        {selectedPlan.id === plan.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                     </div>
                     <span className={`text-sm font-bold ${selectedPlan.id === plan.id ? 'text-[#1952c4]' : 'text-gray-500'}`}>
                       {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Checkout Mockup */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 p-6 md:p-8 sticky top-8">
               <h3 className="text-xl font-bold text-[#0f172a] mb-6">Payment Details</h3>
               
               {/* Order Summary */}
               <div className="bg-[#f8fafc] rounded-xl p-4 mb-6 border border-[#e2e8f0]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#475569]">Package:</span>
                    <span className="text-sm font-bold text-[#0f172a]">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#e2e8f0]">
                    <span className="text-sm font-semibold text-[#475569]">Duration:</span>
                    <span className="text-sm font-bold text-[#0f172a]">{selectedPlan.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-[#0f172a]">Total Amount:</span>
                    <span className="text-2xl font-black text-[#1952c4]">${selectedPlan.price}</span>
                  </div>
               </div>

               {/* Mock Card Form */}
               <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-1.5 uppercase">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      defaultValue="Nuha"
                      className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1952c4]/40"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-1.5 uppercase">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="•••• •••• •••• 4242"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#cbd5e1] rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1952c4]/40"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-1.5 uppercase">Expiry</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1952c4]/40"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-1.5 uppercase">CVC</label>
                      <input 
                        type="text" 
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 bg-white border border-[#cbd5e1] rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1952c4]/40"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-[#0f172a] hover:bg-black disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        `Pay LKR ${selectedPlan.price}`
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-[#94a3b8]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      <span className="text-[10px] uppercase font-bold tracking-wider">Secure 256-bit SSL Encryption</span>
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
