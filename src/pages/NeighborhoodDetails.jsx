import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import { getNeighborhoodDetails } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom POI Icon generator
const createPOIIcon = (colorHex) => {
  return new L.DivIcon({
    className: 'custom-poi-icon',
    html: `<div style="background-color: ${colorHex}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const CATEGORIES = ["All", "Education", "Transit", "Groceries", "Healthcare"];

const NeighborhoodDetails = () => {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [listing, setListing] = useState(null);
  const [poiData, setPoiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      try {
        const data = await getNeighborhoodDetails(id);
        setListing(data.listing);
        setPoiData(data.pois);
      } catch (error) {
        console.error("Failed to fetch neighborhood data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchNeighborhoodData();
  }, [id]);

  const filteredPOIs = activeCategory === "All"
    ? poiData
    : poiData.filter(poi => poi.category === activeCategory);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Education': return { classes: 'text-blue-600 bg-blue-100', hex: '#2563eb' };
      case 'Transit': return { classes: 'text-orange-600 bg-orange-100', hex: '#ea580c' };
      case 'Groceries': return { classes: 'text-green-600 bg-green-100', hex: '#16a34a' };
      case 'Healthcare': return { classes: 'text-red-600 bg-red-100', hex: '#dc2626' };
      default: return { classes: 'text-gray-600 bg-gray-100', hex: '#475569' };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col items-center justify-center">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#1952c4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-slate-700 mb-2">Listing Not Found</h2>
          <Link to="/home" className="text-[#1952c4] font-bold hover:underline">Back to Search</Link>
        </div>
      </div>
    );
  }

  const mapCenter = [listing.latitude, listing.longitude];

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow flex flex-col md:flex-row relative">

        {/* Left Side: Map Area (Leaflet) */}
        <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative z-0">
          <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Listing Marker */}
            <Marker position={mapCenter}>
              <Popup>
                <div className="font-bold text-center">{listing.title}</div>
                <div className="text-xs text-gray-500 text-center">{listing.location}</div>
              </Popup>
            </Marker>

            {/* 1km Radius Circle */}
            <Circle
              center={mapCenter}
              pathOptions={{ fillColor: '#1952c4', fillOpacity: 0.1, color: '#1952c4', weight: 1 }}
              radius={1000}
            />

            {/* POI Markers */}
            {filteredPOIs.map((poi) => (
              <Marker
                key={poi.id}
                position={[poi.latitude, poi.longitude]}
                icon={createPOIIcon(getCategoryColor(poi.category).hex)}
              >
                <Popup>
                  <div className="font-bold">{poi.name}</div>
                  <div className="text-xs text-gray-500">{poi.category} • {poi.distance}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Side: Details Panel */}
        <div className="w-full md:w-1/3 bg-white border-l border-[#e2e8f0]/80 flex flex-col h-[50vh] md:h-[calc(100vh-80px)] z-10 shadow-xl">
          {/* Panel Header */}
          <div className="p-6 border-b border-[#e2e8f0]/80">
            <Link to={`/property/${listing.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] hover:text-[#1952c4] transition-colors mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Property
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0f172a] capitalize">Neighborhood Guide</h1>
            <p className="text-sm text-[#64748b] mt-1 capitalize">Explore what's around {listing.title}.</p>
          </div>

          {/* Category Filters */}
          <div className="px-6 py-4 border-b border-[#e2e8f0]/80 overflow-x-auto no-scrollbar flex gap-2 flex-shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(poi.category).classes}`}>
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
