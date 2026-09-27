import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllListings, getSavedListings } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom active icon
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// MapUpdater component to safely recenter map when selection changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
};

const MapViewPage = () => {
  const [listings, setListings] = useState([]);
  const [savedListingIds, setSavedListingIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [hoveredListingId, setHoveredListingId] = useState(null);
  const [selectedMapListing, setSelectedMapListing] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]); // Default Colombo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [allListings, savedItems] = await Promise.all([
          getAllListings(),
          localStorage.getItem("token") ? getSavedListings() : Promise.resolve([])
        ]);

        const savedIds = savedItems.map(item => item.listing_id);
        setSavedListingIds(savedIds);

        const listingsArray = allListings.listings || [];
        const mappedListings = listingsArray.map(dbListing => {
          let rawImages = dbListing.image_urls || dbListing.images;
          let parsedImages = [];
          if (Array.isArray(rawImages)) {
            parsedImages = rawImages;
          } else if (typeof rawImages === 'string') {
            try {
              const parsed = JSON.parse(rawImages);
              if (Array.isArray(parsed)) {
                parsedImages = parsed;
              } else {
                parsedImages = [String(parsed)];
              }
            } catch (e) {
              if (rawImages.startsWith('[') && rawImages.endsWith(']')) {
                parsedImages = rawImages.slice(1, -1).split(',').map(url => url.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
              } else {
                parsedImages = rawImages.split(',').map(url => url.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
              }
            }
          }
          if (!Array.isArray(parsedImages)) {
            parsedImages = [];
          }

          let displayImage = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";
          if (parsedImages.length > 0) {
            const firstImg = parsedImages[0];
            if (firstImg.includes('drive.google.com/uc?id=')) {
              displayImage = firstImg.replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1000';
            } else if (firstImg.startsWith('http')) {
              displayImage = firstImg;
            } else {
              const cleanUrl = firstImg.startsWith('/') ? firstImg.substring(1) : firstImg;
              const pathPrefix = cleanUrl.startsWith('images/') ? '' : 'images/';
              displayImage = `/${pathPrefix}${cleanUrl}`;
            }
          }

          return {
            id: dbListing.listing_id,
            name: dbListing.title,
            location: dbListing.location,
            price: Number(dbListing.price),
            rating: dbListing.avg_rating || 4.5,
            reviews: dbListing.review_count || 0,
            image: displayImage,
            latitude: dbListing.latitude || (6.9271 + (Math.random() - 0.5) * 0.1),
            longitude: dbListing.longitude || (79.8612 + (Math.random() - 0.5) * 0.1),
            liked: savedIds.includes(dbListing.listing_id),
            university: "Unknown",
            beds: 1,
            gender: "mixed",
            type: dbListing.type ? dbListing.type.replace('_', ' ') : 'Property',
          };
        });

        setListings(mappedListings);

        // Center on the first listing if available
        if (mappedListings.length > 0) {
          setMapCenter([mappedListings[0].latitude, mappedListings[0].longitude]);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter(listing =>
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listings, searchQuery]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleListingClick = (listing) => {
    setSelectedMapListing(listing);
    setMapCenter([listing.latitude, listing.longitude]);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-black font-sans antialiased text-white overflow-hidden">
        <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={savedListingIds.length} activeTab="map" />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#FACC15] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black font-sans antialiased text-white overflow-hidden">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={savedListingIds.length} activeTab="map" />

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">

        {/* LEFT MAP VIEW PANEL */}
        <div className="flex-grow h-full relative bg-[#1A1A1A] z-0">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapUpdater center={mapCenter} />

            {filteredListings.map((listing) => {
              const isSelected = selectedMapListing?.id === listing.id;
              const isHovered = hoveredListingId === listing.id;
              return (
                <Marker
                  key={listing.id}
                  position={[listing.latitude, listing.longitude]}
                  icon={isSelected || isHovered ? activeIcon : new L.Icon.Default()}
                  eventHandlers={{
                    click: () => handleListingClick(listing),
                    mouseover: () => setHoveredListingId(listing.id),
                    mouseout: () => setHoveredListingId(null)
                  }}
                >
                  <Popup>
                    <div className="w-48 flex flex-col gap-2">
                      <img src={listing.image} alt={listing.name} className="w-full h-24 rounded-lg object-cover" />
                      <h5 className="font-bold text-[13px] leading-tight text-black">{listing.name}</h5>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#FACC15]">LKR {listing.price.toLocaleString()}</span>
                        <span className="text-xs text-yellow-500 font-bold">★ {listing.rating}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/property/${listing.id}`)}
                        className="mt-1 py-1.5 w-full bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold rounded"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Top Control Bar Floating on Map */}
          <div className="absolute top-6 left-6 right-6 z-[1000] flex items-center gap-3">
            <div className="flex items-center flex-grow bg-[#1A1A1A] px-4 py-3 rounded-full shadow-md border border-[#333] max-w-md">
              <svg className="w-5 h-5 text-white/40 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search map..."
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-[15px] font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-white/40 hover:text-white font-bold ml-1.5"
                >
                  ✕
                </button>
              )}
            </div>

            <Link to="/home">
              <button className="flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black px-5 py-3 rounded-full font-bold shadow-md transition-colors whitespace-nowrap text-sm cursor-pointer border-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                List View
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE PANEL (All Listings) */}
        <div className="w-full lg:w-[420px] bg-[#1A1A1A] border-l border-[#333] flex flex-col h-full flex-shrink-0 z-10 shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-[#333]">
            <h3 className="text-xl font-bold text-white tracking-tight">All Listings</h3>
            <p className="text-sm text-white/60 mt-0.5">{filteredListings.length} boarding houses</p>
          </div>

          {/* Listings List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => {
                const isHovered = hoveredListingId === listing.id;
                const isSelected = selectedMapListing?.id === listing.id;
                return (
                  <div
                    key={listing.id}
                    onClick={() => handleListingClick(listing)}
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                    className={`p-4 rounded-3xl border transition-all duration-300 flex gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${isSelected
                        ? 'border-[#FACC15] bg-[#333]'
                        : isHovered
                          ? 'border-[#555] bg-[#222]'
                          : 'border-[#333] bg-[#111]'
                      }`}
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-grow overflow-hidden">
                      <div>
                        <h4 className="font-bold text-base text-white truncate hover:text-[#FACC15] capitalize">
                          {listing.name}
                        </h4>
                        <div className="flex items-center text-xs text-white/60 mt-1 truncate font-medium">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {listing.location}
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Monthly</span>
                          <span className="text-lg font-extrabold text-[#FACC15] leading-none">LKR {listing.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center bg-[#FACC15]/20 text-[#FACC15] px-2 py-0.5 rounded-md border border-transparent">
                          <svg className="w-3 h-3 mr-0.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="text-xs font-bold">{listing.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 pb-10">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-semibold text-lg text-white/60">No listings found</p>
                <p className="text-sm mt-1 text-white/40">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
