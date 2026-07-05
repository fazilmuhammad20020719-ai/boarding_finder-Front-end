import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock data for comparison
const compareData = [
  {
    id: 1,
    name: "BlueSky Residences",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
    price: "LKR 15,000",
    distance: "1.2 km from Uni",
    type: "Single Room",
    rating: 4.8,
    reviews: 24,
    amenities: { wifi: true, ac: false, kitchen: true, parking: false, laundry: true },
    availableDate: "Immediate",
    deposit: "2 Months"
  },
  {
    id: 2,
    name: "Green Valley Dorms",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e52504437?auto=format&fit=crop&q=80&w=400",
    price: "LKR 12,000",
    distance: "2.5 km from Uni",
    type: "Shared (2 pax)",
    rating: 4.2,
    reviews: 18,
    amenities: { wifi: true, ac: false, kitchen: false, parking: true, laundry: true },
    availableDate: "From Sept 1st",
    deposit: "1 Month"
  },
  {
    id: 3,
    name: "Urban Elite Suites",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=400",
    price: "LKR 25,000",
    distance: "0.5 km from Uni",
    type: "Studio Apartment",
    rating: 4.9,
    reviews: 42,
    amenities: { wifi: true, ac: true, kitchen: true, parking: true, laundry: true },
    availableDate: "Immediate",
    deposit: "3 Months"
  }
];

const CheckIcon = () => (
  <svg className="w-6 h-6 text-[#10b981] mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-6 h-6 text-slate-300 mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CompareListings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] pb-20">
      <Navbar isLoggedIn={true} activeTab="" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button 
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 text-slate-500 hover:text-[#1952c4] transition-colors font-semibold text-sm bg-transparent border-none cursor-pointer mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Search
            </button>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Compare Properties</h1>
          </div>
          <button className="bg-white border border-[#e2e8f0] text-slate-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            Clear All
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            
            {/* Header / Images Row */}
            <thead>
              <tr>
                <th className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 w-1/4 align-bottom">
                  <div className="text-slate-500 font-medium text-sm">Select up to 3 properties to compare side-by-side.</div>
                </th>
                {compareData.map((item) => (
                  <th key={item.id} className="p-6 border-b border-l border-[#e2e8f0]/60 w-1/4 align-top relative group">
                    <button className="absolute top-8 right-8 w-8 h-8 bg-white/90 backdrop-blur border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm z-10 opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="rounded-2xl overflow-hidden aspect-video mb-4 relative cursor-pointer" onClick={() => navigate(`/property/${item.id}`)}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-extrabold text-lg text-[#0f172a] mb-1 leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#f59e0b] mb-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {item.rating} <span className="text-slate-400 font-normal">({item.reviews})</span>
                    </div>
                    <button className="w-full py-2.5 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors cursor-pointer text-sm border-none shadow-sm">
                      View Details
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Core Info Rows */}
            <tbody>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700">Monthly Rent</td>
                {compareData.map((item) => (
                  <td key={`price-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center font-extrabold text-[#1952c4] text-lg">
                    {item.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700">Room Type</td>
                {compareData.map((item) => (
                  <td key={`type-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center font-semibold text-[#0f172a]">
                    {item.type}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700">Distance to Uni</td>
                {compareData.map((item) => (
                  <td key={`dist-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center font-semibold text-slate-600">
                    {item.distance}
                  </td>
                ))}
              </tr>

              {/* Amenities Divider */}
              <tr>
                <td colSpan="4" className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0]/60 font-black text-xs text-slate-400 uppercase tracking-widest text-center">
                  Amenities Included
                </td>
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700 flex items-center gap-2">
                  High-Speed WiFi
                </td>
                {compareData.map((item) => (
                  <td key={`wifi-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center bg-slate-50/20">
                    {item.amenities.wifi ? <CheckIcon /> : <CrossIcon />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700 flex items-center gap-2">
                  Air Conditioning
                </td>
                {compareData.map((item) => (
                  <td key={`ac-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center">
                    {item.amenities.ac ? <CheckIcon /> : <CrossIcon />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700 flex items-center gap-2">
                  Kitchen Access
                </td>
                {compareData.map((item) => (
                  <td key={`kit-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center bg-slate-50/20">
                    {item.amenities.kitchen ? <CheckIcon /> : <CrossIcon />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700 flex items-center gap-2">
                  Parking Space
                </td>
                {compareData.map((item) => (
                  <td key={`park-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center">
                    {item.amenities.parking ? <CheckIcon /> : <CrossIcon />}
                  </td>
                ))}
              </tr>

              {/* Policy Divider */}
              <tr>
                <td colSpan="4" className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0]/60 font-black text-xs text-slate-400 uppercase tracking-widest text-center">
                  Terms & Policies
                </td>
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/50 border-b border-[#e2e8f0]/60 font-bold text-slate-700">Security Deposit</td>
                {compareData.map((item) => (
                  <td key={`dep-${item.id}`} className="p-6 border-b border-l border-[#e2e8f0]/60 text-center font-semibold text-slate-600">
                    {item.deposit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 bg-slate-50/50 border-b-0 border-[#e2e8f0]/60 font-bold text-slate-700">Availability</td>
                {compareData.map((item) => (
                  <td key={`avail-${item.id}`} className="p-6 border-b-0 border-l border-[#e2e8f0]/60 text-center font-semibold text-[#10b981]">
                    {item.availableDate}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CompareListings;
