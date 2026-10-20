import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListingById } from '../services/api';

// image_urls may arrive as an array, a JSON string, or a comma/array-literal string
const parseImages = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return raw.replace(/^[{[]|[}\]]$/g, '').split(',').map(u => u.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
};

const toDisplayUrl = (url) =>
  url.includes('drive.google.com/uc?id=')
    ? url.replace('uc?id=', 'thumbnail?id=').replace('&export=view', '') + '&sz=w1920'
    : url;

// Convert share links into embeddable player URLs
const toEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.endsWith('youtube.com') && u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    if (u.hostname === 'vimeo.com') return `https://player.vimeo.com/video${u.pathname}`;
    return url; // Matterport, Kuula, Momento360 links are embeddable as-is
  } catch {
    return null;
  }
};

const VirtualTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [shareNote, setShareNote] = useState('');

  useEffect(() => {
    getListingById(id)
      .then((data) => setListing(data.listing || data))
      .catch((err) => setError(err.message || 'Failed to load listing'));
  }, [id]);

  const images = listing ? parseImages(listing.image_urls).map(toDisplayUrl) : [];
  const embedUrl = listing?.virtual_tour_url ? toEmbedUrl(listing.virtual_tour_url) : null;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareNote('Link copied!');
        setTimeout(() => setShareNote(''), 2000);
      }
    } catch {
      // user dismissed the share sheet
    }
  };

  if (error || !listing) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-sans text-white gap-4">
        <p className={error ? 'text-red-400' : 'text-white/60'}>{error || 'Loading tour...'}</p>
        {error && (
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border-none cursor-pointer text-white">Go back</button>
        )}
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans text-white overflow-hidden">

      {/* Background: photo walkthrough when there is no embedded tour */}
      {!embedUrl && activeImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={activeImage}
            alt={`${listing.title} photo ${activeIndex + 1}`}
            className="w-full h-full object-cover opacity-80 transition-opacity duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"></div>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border-none cursor-pointer text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">{listing.title}</h1>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]"></span>
              {embedUrl ? '360° / Video Tour' : 'Photo Tour'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {shareNote && <span className="text-sm text-[#FACC15]">{shareNote}</span>}
          <button onClick={handleShare} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 border-none cursor-pointer text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        </div>
      </div>

      {/* Main Tour Area */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-6">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${listing.title} virtual tour`}
            className="w-full h-full max-w-6xl rounded-2xl border border-white/10 bg-black"
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        ) : images.length === 0 ? (
          <p className="text-white/60">The owner hasn't added photos or a virtual tour for this property yet.</p>
        ) : images.length > 1 && (
          <div className="w-full flex justify-between">
            <button
              onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-none cursor-pointer text-white"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-none cursor-pointer text-white"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation (Photos) */}
      {!embedUrl && images.length > 0 && (
        <div className="relative z-10 p-6 pb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Photo {activeIndex + 1}
            <span className="text-white/50 text-sm font-normal">of {images.length}</span>
          </h3>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {images.map((src, idx) => (
              <button
                key={src + idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden transition-all duration-300 border-none p-0 cursor-pointer ${
                  activeIndex === idx
                    ? 'ring-2 ring-[#FACC15] ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTour;
