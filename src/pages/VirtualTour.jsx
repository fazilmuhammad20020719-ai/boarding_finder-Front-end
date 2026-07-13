import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOUR_ROOMS = [
  { id: 'living', name: 'Living Area', image: 'https://images.unsplash.com/photo-1493809842364-4c81cbac9ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { id: 'kitchen', name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { id: 'bedroom', name: 'Master Bedroom', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { id: 'bathroom', name: 'Bathroom', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
];

const VirtualTour = () => {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState(TOUR_ROOMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans text-white overflow-hidden">
      
      {/* Background Image (Mocking 360 view) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={activeRoom.image} 
          alt={activeRoom.name} 
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isPlaying ? 'opacity-90 scale-105' : 'opacity-70 scale-100'} cursor-grab active:cursor-grabbing`}
          style={{ transitionProperty: 'opacity, transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"></div>
      </div>

      {/* Top Header Navigation */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Sunset Apartment - Unit A</h1>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live 360° Tour
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        </div>
      </div>

      {/* Main Tour Interaction Area */}
      <div className="relative z-10 flex-grow flex items-center justify-center">
        {/* Interactive 360 Element (Mock) */}
        <div className="text-center">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 transition-all transform hover:scale-105 border border-white/30"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
            ) : (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            Drag to pan 360°
          </div>
        </div>

        {/* Mock Hotspot */}
        <div className="absolute top-1/3 left-1/4 group">
          <div className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-bounce">
            <div className="w-3 h-3 bg-[#1952c4] rounded-full"></div>
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-[#0f172a] text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            View Details
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Rooms) */}
      <div className="relative z-10 p-6 pb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          {activeRoom.name}
          <span className="text-white/50 text-sm font-normal">({TOUR_ROOMS.indexOf(activeRoom) + 1} of {TOUR_ROOMS.length})</span>
        </h3>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {TOUR_ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                activeRoom.id === room.id 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <span className="absolute bottom-2 left-2 right-2 text-xs font-bold text-center leading-tight truncate">
                {room.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
