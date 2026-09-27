import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSavedListings, removeSavedListing } from '../services/api';

const CheckIcon = () => (
  <svg className="w-6 h-6 text-[#10b981] mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-6 h-6 text-white/20 mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CompareListings = () => {
  const navigate = useNavigate();
  const [compareData, setCompareData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedForComparison = async () => {
      try {
        if (!localStorage.getItem("token")) {
          setIsLoading(false);
          return;
        }

        const data = await getSavedListings();
        // Limit to 3 for comparison view
        const top3 = data.slice(0, 3);

        const mappedData = top3.map(item => {
          let amenitiesList = [];
          if (Array.isArray(item.amenities)) {
            amenitiesList = item.amenities;
          } else if (typeof item.amenities === 'string') {
            try {
              const parsed = JSON.parse(item.amenities);
              if (Array.isArray(parsed)) {
                amenitiesList = parsed;
              } else if (typeof parsed === 'object' && parsed !== null) {
                amenitiesList = Object.keys(parsed).filter(key => parsed[key]);
              }
            } catch (e) {
              amenitiesList = item.amenities ? item.amenities.split(',') : [];
            }
          }
          if (!Array.isArray(amenitiesList)) amenitiesList = [];

          // Map amenities to specific checks
          const hasWifi = amenitiesList.some(a => (typeof a === 'string' && a.toLowerCase().includes('wifi')));
          const hasAc = amenitiesList.some(a => (typeof a === 'string' && a.toLowerCase().includes('ac') || a.toLowerCase().includes('air')));
          const hasKitchen = amenitiesList.some(a => (typeof a === 'string' && a.toLowerCase().includes('kitchen')));
          const hasParking = amenitiesList.some(a => (typeof a === 'string' && a.toLowerCase().includes('parking')));

          const displayImage = item.image_urls && item.image_urls.length > 0
            ? (item.image_urls[0].startsWith('http') ? item.image_urls[0] : `http://localhost:5000${item.image_urls[0]}`)
            : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";

          return {
            id: item.listing_id,
            name: item.title,
            image: displayImage,
            price: `LKR ${Number(item.price).toLocaleString()}`,
            distance: item.distance || "N/A",
            type: (item.type || "").replace('_', ' '),
            rating: item.avg_rating || item.rating || 4.5,
            reviews: item.review_count || item.reviews || 0,
            amenities: { wifi: hasWifi, ac: hasAc, kitchen: hasKitchen, parking: hasParking },
            availableDate: item.status === 'booked' ? 'Fully Booked' : 'Immediate',
            deposit: "1 Month" // Can be mapped to real DB field if it exists
          };
        });

        setCompareData(mappedData);
      } catch (err) {
        console.error("Failed to fetch saved listings for comparison:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedForComparison();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeSavedListing(id);
      setCompareData(compareData.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to remove saved listing", err);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white pb-20">
      <Navbar activeTab="" />

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <button
              onClick={() => navigate('/saved')}
              className="flex items-center gap-2 text-white/50 hover:text-[#FACC15] transition-colors font-semibold text-sm bg-transparent border-none cursor-pointer mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Saved Homes
            </button>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Compare Properties</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#FACC15] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : compareData.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-3xl shadow-sm border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold text-white mb-2">No Properties to Compare</h2>
            <p className="text-white/60 mb-6">Save some properties to your favorites to compare them here.</p>
            <button onClick={() => navigate('/search')} className="bg-[#FACC15] text-black px-6 py-3 rounded-full font-bold shadow-sm hover:bg-[#EAB308] transition-colors">
              Find Properties
            </button>
          </div>
        ) : (
          <div className="bg-[#1A1A1A] rounded-3xl shadow-sm border border-[#333] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">

              {/* Header / Images Row */}
              <thead>
                <tr>
                  <th className="p-6 bg-[#111] border-b border-[#333] w-1/4 align-bottom">
                    <div className="text-white/50 font-medium text-sm">Comparing your saved properties side-by-side.</div>
                  </th>
                  {compareData.map((item) => (
                    <th key={item.id} className="p-6 border-b border-l border-[#333] w-1/4 align-top relative group">
                      <button onClick={() => handleRemove(item.id)} className="absolute top-8 right-8 w-8 h-8 bg-black/90 backdrop-blur border border-[#333] rounded-full text-white/50 hover:text-red-500 hover:border-red-500 flex items-center justify-center transition-all cursor-pointer shadow-sm z-10 opacity-0 group-hover:opacity-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <div className="rounded-2xl overflow-hidden aspect-video mb-4 relative cursor-pointer" onClick={() => navigate(`/property/${item.id}`)}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-extrabold text-lg text-white mb-1 leading-tight capitalize">{item.name}</h3>
                      <div className="flex items-center gap-1 text-sm font-bold text-[#FACC15] mb-4">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {item.rating} <span className="text-white/40 font-normal">({item.reviews})</span>
                      </div>
                      <button onClick={() => navigate(`/property/${item.id}`)} className="w-full py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors cursor-pointer text-sm border-none shadow-sm">
                        View Details
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Core Info Rows */}
              <tbody>
                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80">Monthly Rent</td>
                  {compareData.map((item) => (
                    <td key={`price-${item.id}`} className="p-6 border-b border-l border-[#333] text-center font-extrabold text-[#FACC15] text-lg">
                      {item.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80">Room Type</td>
                  {compareData.map((item) => (
                    <td key={`type-${item.id}`} className="p-6 border-b border-l border-[#333] text-center font-semibold text-white capitalize">
                      {item.type}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80">Distance to Uni</td>
                  {compareData.map((item) => (
                    <td key={`dist-${item.id}`} className="p-6 border-b border-l border-[#333] text-center font-semibold text-white/70">
                      {item.distance}
                    </td>
                  ))}
                </tr>

                {/* Amenities Divider */}
                <tr>
                  <td colSpan={compareData.length + 1} className="p-4 bg-black/40 border-b border-[#333] font-black text-xs text-white/40 uppercase tracking-widest text-center">
                    Amenities Included
                  </td>
                </tr>

                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80 flex items-center gap-2">
                    WiFi
                  </td>
                  {compareData.map((item) => (
                    <td key={`wifi-${item.id}`} className="p-6 border-b border-l border-[#333] text-center">
                      {item.amenities.wifi ? <CheckIcon /> : <CrossIcon />}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80 flex items-center gap-2">
                    Air Conditioning
                  </td>
                  {compareData.map((item) => (
                    <td key={`ac-${item.id}`} className="p-6 border-b border-l border-[#333] text-center">
                      {item.amenities.ac ? <CheckIcon /> : <CrossIcon />}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80 flex items-center gap-2">
                    Kitchen Access
                  </td>
                  {compareData.map((item) => (
                    <td key={`kit-${item.id}`} className="p-6 border-b border-l border-[#333] text-center">
                      {item.amenities.kitchen ? <CheckIcon /> : <CrossIcon />}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80 flex items-center gap-2">
                    Parking Space
                  </td>
                  {compareData.map((item) => (
                    <td key={`park-${item.id}`} className="p-6 border-b border-l border-[#333] text-center">
                      {item.amenities.parking ? <CheckIcon /> : <CrossIcon />}
                    </td>
                  ))}
                </tr>

                {/* Policy Divider */}
                <tr>
                  <td colSpan={compareData.length + 1} className="p-4 bg-black/40 border-b border-[#333] font-black text-xs text-white/40 uppercase tracking-widest text-center">
                    Terms & Policies
                  </td>
                </tr>

                <tr>
                  <td className="p-6 bg-[#111] border-b border-[#333] font-bold text-white/80">Security Deposit</td>
                  {compareData.map((item) => (
                    <td key={`dep-${item.id}`} className="p-6 border-b border-l border-[#333] text-center font-semibold text-white/70">
                      {item.deposit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-[#111] border-b-0 border-[#333] font-bold text-white/80">Availability</td>
                  {compareData.map((item) => (
                    <td key={`avail-${item.id}`} className="p-6 border-b-0 border-l border-[#333] text-center font-semibold text-[#10b981]">
                      {item.availableDate}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompareListings;
