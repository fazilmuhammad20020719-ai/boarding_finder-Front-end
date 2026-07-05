import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MOCK_ROOMMATES = [
  {
    id: "RM-1",
    name: "Alex",
    age: 22,
    occupation: "Student",
    budget: "$400 - $550/mo",
    matchScore: 92,
    avatar: "https://ui-avatars.com/api/?name=Alex&background=ebf3ff&color=1952c4",
    bio: "Hi! I'm a third-year engineering student. Looking for a quiet place to study and sleep. I keep things very clean and respect personal space.",
    tags: ["Non-smoker", "Early bird", "Very tidy", "Quiet"]
  },
  {
    id: "RM-2",
    name: "Samantha",
    age: 25,
    occupation: "Graphic Designer",
    budget: "$500 - $700/mo",
    matchScore: 85,
    avatar: "https://ui-avatars.com/api/?name=Samantha&background=e8f7ec&color=10b981",
    bio: "Working professional who occasionally works from home. I love cooking and don't mind sharing meals. Have a small, friendly cat.",
    tags: ["Has Pets", "Night owl", "Social", "Clean"]
  },
  {
    id: "RM-3",
    name: "David",
    age: 24,
    occupation: "Software Dev",
    budget: "$600 - $800/mo",
    matchScore: 78,
    avatar: "https://ui-avatars.com/api/?name=David&background=fef3c7&color=d97706",
    bio: "Mostly at the office during the week. Weekends I'm usually out hiking or playing games. Easy going and flexible.",
    tags: ["Non-smoker", "Gamer", "Relaxed", "Occasional drinker"]
  },
  {
    id: "RM-4",
    name: "Mia",
    age: 21,
    occupation: "Student",
    budget: "$350 - $450/mo",
    matchScore: 95,
    avatar: "https://ui-avatars.com/api/?name=Mia&background=fee2e2&color=ef4444",
    bio: "Nursing student looking for a chill roommate to split a 2-bedroom. I study a lot but love watching movies in my downtime.",
    tags: ["Student", "Non-smoker", "Early bird", "Clean"]
  }
];

const RoommateMatcher = () => {
  const [profiles, setProfiles] = useState(MOCK_ROOMMATES);
  
  const handleAction = (id, action) => {
    // action could be 'message' or 'pass'
    if (action === 'pass') {
      setProfiles(prev => prev.filter(p => p.id !== id));
    } else {
      alert(`Opening chat with roommate ID: ${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight">Roommate Matcher</h1>
              <span className="bg-gradient-to-r from-[#1952c4] to-[#3b82f6] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Beta
              </span>
            </div>
            <p className="text-[#64748b] mt-1 text-[15px]">Find compatible roommates to share costs based on lifestyle preferences.</p>
          </div>
          <button className="px-5 py-2.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-bold rounded-xl shadow-sm transition-all text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit My Seeker Profile
          </button>
        </div>

        {/* Filters/Matches Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-[20px] border border-[#e2e8f0]/60 shadow-sm mb-8 gap-4">
          <p className="text-[#475569] font-medium">
            Showing <span className="font-bold text-[#0f172a]">{profiles.length} potential matches</span> in your area
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#64748b]">Sort by:</span>
            <select className="bg-[#f0f4f9] border-none rounded-xl px-4 py-2 text-sm font-bold text-[#0f172a] focus:ring-0 cursor-pointer outline-none">
              <option>Highest Match %</option>
              <option>Lowest Budget</option>
              <option>Newest Profiles</option>
            </select>
          </div>
        </div>

        {/* Roommate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.length === 0 ? (
            <div className="col-span-full bg-white rounded-[24px] p-12 text-center border border-[#e2e8f0]/60 shadow-sm">
              <div className="w-16 h-16 bg-[#f0f4f9] text-[#94a3b8] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-1">No more profiles</h3>
              <p className="text-[#64748b]">You've reviewed all potential roommates in your area. Try expanding your search criteria.</p>
            </div>
          ) : (
            profiles.map(profile => (
              <div key={profile.id} className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                {/* Card Header (Avatar & Match Score) */}
                <div className="p-6 pb-0 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <h2 className="text-xl font-bold text-[#0f172a]">{profile.name}, {profile.age}</h2>
                      <p className="text-[#64748b] text-sm font-medium">{profile.occupation}</p>
                    </div>
                  </div>
                  
                  {/* Match Score Badge */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-green-100 relative">
                       <svg className="absolute inset-0 w-full h-full text-green-500" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-green-500"
                            strokeWidth="3"
                            strokeDasharray={`${profile.matchScore}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                       </svg>
                       <span className="text-xs font-black text-[#0f172a] z-10">{profile.matchScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-lg font-black text-[#10b981]">{profile.budget}</p>
                  </div>

                  <p className="text-[#475569] text-sm leading-relaxed mb-6 italic line-clamp-3">
                    "{profile.bio}"
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {profile.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-[#f0f4f9] text-[#475569] text-[11px] font-bold rounded-lg border border-[#e2e8f0]/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex border-t border-[#e2e8f0]/60">
                  <button 
                    onClick={() => handleAction(profile.id, 'pass')}
                    className="flex-1 py-4 text-center font-bold text-[#64748b] hover:bg-red-50 hover:text-red-600 transition-colors border-r border-[#e2e8f0]/60 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Pass
                  </button>
                  <button 
                    onClick={() => handleAction(profile.id, 'message')}
                    className="flex-1 py-4 text-center font-bold text-[#1952c4] hover:bg-[#ebf3ff] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default RoommateMatcher;
