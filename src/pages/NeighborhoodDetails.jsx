import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const POI_DATA = [
  { id: 1, name: "City University Campus", category: "Education", distance: "5 min walk", time: 5, icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
  { id: 2, name: "Central Station", category: "Transit", distance: "12 min walk", time: 12, icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
  { id: 3, name: "Fresh Market Grocery", category: "Groceries", distance: "3 min walk", time: 3, icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
  { id: 4, name: "General Hospital", category: "Healthcare", distance: "15 min bus", time: 15, icon: "M19 14l-7 7m0 0l-7-7m7 7V3" }, // Using a generic icon, will replace in rendering
  { id: 5, name: "Downtown Public Library", category: "Education", distance: "10 min walk", time: 10, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: 6, name: "Oak Street Bus Stop", category: "Transit", distance: "2 min walk", time: 2, icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
];

const CATEGORIES = ["All", "Education", "Transit", "Groceries", "Healthcare"];

const NeighborhoodDetails = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPOIs = activeCategory === "All" 
    ? POI_DATA 
    : POI_DATA.filter(poi => poi.category === activeCategory);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Education': return 'text-blue-600 bg-blue-100';
      case 'Transit': return 'text-orange-600 bg-orange-100';
      case 'Groceries': return 'text-green-600 bg-green-100';
      case 'Healthcare': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Education': 
        return <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />;
      case 'Transit': 
        return <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />;
      case 'Groceries': 
        return <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />;
      case 'Healthcare': 
        return <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
      default: 
        return <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow flex flex-col md:flex-row relative">
        
        {/* Left Side: Map Area (Mockup) */}
        <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative bg-[#e5e3df]">
          {/* Static Map Image Placeholder - usually you'd use Google Maps or Mapbox here */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Neighborhood Map" 
            className="w-full h-full object-cover opacity-60"
          />
          
          {/* Mock Map UI Overlay */}
          <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>

          {/* Central Property Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
             <div className="bg-[#1952c4] text-white px-3 py-1.5 rounded-lg shadow-lg font-bold text-sm mb-1 whitespace-nowrap">
               Sunset Apartment
             </div>
             <div className="w-4 h-4 bg-[#1952c4] rotate-45 transform -mt-2"></div>
             <div className="w-16 h-16 bg-[#1952c4]/20 rounded-full absolute top-6 animate-ping pointer-events-none"></div>
          </div>

          {/* POI Markers */}
          {filteredPOIs.map((poi, index) => (
            <div 
              key={poi.id} 
              className="absolute group cursor-pointer transition-transform hover:scale-110 z-10 flex flex-col items-center"
              style={{
                top: `${30 + (index * 15) % 40}%`, 
                left: `${20 + (index * 25) % 60}%`
              }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${getCategoryColor(poi.category).split(' ')[1]} ${getCategoryColor(poi.category).split(' ')[0]}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  {getCategoryIcon(poi.category)}
                </svg>
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-full mt-2 bg-white px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap flex flex-col items-center">
                <span className="text-xs font-bold text-[#0f172a]">{poi.name}</span>
                <span className="text-[10px] font-semibold text-[#64748b]">{poi.distance}</span>
                <div className="w-2 h-2 bg-white rotate-45 absolute -top-1"></div>
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-[#0f172a] hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-[#0f172a] hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            </button>
          </div>
        </div>

        {/* Right Side: Details Panel */}
        <div className="w-full md:w-1/3 bg-white border-l border-[#e2e8f0]/80 flex flex-col h-[50vh] md:h-[calc(100vh-80px)]">
          {/* Panel Header */}
          <div className="p-6 border-b border-[#e2e8f0]/80">
            <Link to="/property/1" className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] hover:text-[#1952c4] transition-colors mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Property
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0f172a]">Neighborhood Guide</h1>
            <p className="text-sm text-[#64748b] mt-1">Explore what's around Sunset Apartment.</p>
          </div>

          {/* Category Filters */}
          <div className="px-6 py-4 border-b border-[#e2e8f0]/80 overflow-x-auto no-scrollbar flex gap-2 flex-shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#0f172a] text-white shadow-sm' 
                    : 'bg-[#f0f4f9] text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* POI List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {filteredPOIs.length === 0 ? (
               <p className="text-[#64748b] text-center text-sm py-4">No places found for this category.</p>
            ) : (
              filteredPOIs.sort((a, b) => a.time - b.time).map(poi => (
                <div key={poi.id} className="flex items-center gap-4 p-4 rounded-[16px] border border-[#e2e8f0]/60 hover:border-[#1952c4]/40 hover:bg-[#ebf3ff]/30 transition-colors group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(poi.category)}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {getCategoryIcon(poi.category)}
                    </svg>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-[#0f172a] truncate text-sm">{poi.name}</h3>
                    <p className="text-xs text-[#64748b] mt-0.5">{poi.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1952c4] bg-[#ebf3ff] px-2.5 py-1 rounded-full whitespace-nowrap">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {poi.distance}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer gradient for scroll affordance */}
          <div className="h-12 bg-gradient-to-t from-white to-transparent absolute bottom-0 left-0 right-0 pointer-events-none md:hidden"></div>
        </div>
      </main>
    </div>
  );
};

export default NeighborhoodDetails;
