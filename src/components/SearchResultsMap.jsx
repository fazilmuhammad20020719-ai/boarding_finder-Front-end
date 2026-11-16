import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Real map for the Search page: one price pin per listing at the location the
// owner saved. Listings without a saved location are counted, not guessed.

const COLOMBO = [6.9271, 79.8612];

const hasCoords = (l) => Number.isFinite(Number(l.lat)) && Number.isFinite(Number(l.lng)) && Number(l.lat) !== 0;

// Price pill marker, styled like the rest of the app
const priceIcon = (price, active) =>
  L.divIcon({
    className: '',
    iconSize: null,
    html: `<div style="transform:translate(-50%,-100%);display:inline-flex;align-items:center;gap:4px;white-space:nowrap;
      padding:6px 10px;border-radius:9999px;font:700 12px/1 system-ui,sans-serif;cursor:pointer;
      box-shadow:0 4px 12px rgba(0,0,0,.35);
      ${active ? 'background:#FACC15;color:#000;border:1px solid #FACC15;' : 'background:#1A1A1A;color:#FACC15;border:1px solid #333;'}">
      LKR ${Math.round(price / 1000)}k</div>`,
  });

// Fit the view to the pins whenever the result set changes
const FitToListings = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 15);
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);
  return null;
};

// Pan to the listing picked in the sidebar
const FlyToSelected = ({ listing }) => {
  const map = useMap();
  useEffect(() => {
    if (listing && hasCoords(listing)) map.flyTo([Number(listing.lat), Number(listing.lng)], Math.max(map.getZoom(), 15));
  }, [map, listing]);
  return null;
};

const SearchResultsMap = ({ listings, hoveredId, selected, onSelect, onHover, onOpen }) => {
  const mapped = useMemo(() => listings.filter(hasCoords), [listings]);
  const points = useMemo(() => mapped.map((l) => [Number(l.lat), Number(l.lng)]), [mapped]);
  const missing = listings.length - mapped.length;

  return (
    <div className="w-full h-full relative">
      <MapContainer center={points[0] || COLOMBO} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FitToListings points={points} />
        <FlyToSelected listing={selected} />

        {mapped.map((l) => (
          <Marker
            key={l.id}
            position={[Number(l.lat), Number(l.lng)]}
            icon={priceIcon(l.price, hoveredId === l.id || selected?.id === l.id)}
            zIndexOffset={hoveredId === l.id || selected?.id === l.id ? 1000 : 0}
            eventHandlers={{
              click: () => onSelect(l),
              mouseover: () => onHover(l.id),
              mouseout: () => onHover(null),
            }}
          >
            <Popup>
              <div className="w-48 flex flex-col gap-2">
                {l.image && <img src={l.image} alt={l.name} className="w-full h-24 rounded-lg object-cover" />}
                <h5 className="font-bold text-[13px] leading-tight text-black">{l.name}</h5>
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-black">LKR {l.price.toLocaleString()}/mo</span>
                  <span className="text-xs text-amber-600 font-bold">★ {l.rating}</span>
                </div>
                <button
                  onClick={() => onOpen(l)}
                  className="mt-1 py-1.5 w-full bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold rounded border-none cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {missing > 0 && (
        <span className="absolute bottom-4 left-4 z-[500] bg-[#1A1A1A]/90 border border-[#333] text-[11px] text-white/60 font-semibold px-3 py-1.5 rounded-md">
          {missing} listing{missing === 1 ? '' : 's'} without a map location
        </span>
      )}
      {listings.length > 0 && mapped.length === 0 && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
          <div className="bg-[#1A1A1A]/95 border border-[#333] rounded-2xl px-5 py-4 text-sm text-white/70 text-center">
            None of these listings have a map location yet.
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsMap;
