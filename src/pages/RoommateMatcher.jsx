import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getRoommateMatches, getMyRoommateProfile, updateRoommateProfile, passRoommateProfile, sendMessage, sendRoommateConnectionRequest, getRoommateConnectionRequests, getAcceptedRoommateConnections, respondToRoommateConnectionRequest, disconnectRoommate } from '../services/api';

const RoommateMatcher = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    budgetMax: '',
    ageMax: '',
    location: '',
    occupation: ''
  });
  const [myProfile, setMyProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    occupation: '',
    budget_min: '',
    budget_max: '',
    location: '',
    gender: 'Other',
    preferred_gender: 'Any',
    bio: '',
    tags: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesRes, profileRes, requestsRes, connectionsRes] = await Promise.all([
        getRoommateMatches(),
        getMyRoommateProfile(),
        getRoommateConnectionRequests(),
        getAcceptedRoommateConnections()
      ]);

      setProfiles(matchesRes.matches || []);
      setPendingRequests(requestsRes.requests || []);
      setSentRequests(requestsRes.sentRequests || []);
      setAcceptedConnections(connectionsRes.connections || []);

      if (profileRes.profile) {
        setMyProfile(profileRes.profile);
        setFormData({
          age: profileRes.profile.age || '',
          occupation: profileRes.profile.occupation || '',
          budget_min: profileRes.profile.budget_min || '',
          budget_max: profileRes.profile.budget_max || '',
          location: profileRes.profile.location || '',
          gender: profileRes.profile.gender || 'Other',
          preferred_gender: profileRes.profile.preferred_gender || 'Any',
          bio: profileRes.profile.bio || '',
          tags: profileRes.profile.tags ? profileRes.profile.tags.join(', ') : ''
        });
      }
    } catch (error) {
      console.error("Error fetching roommate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (profile, action) => {
    if (action === 'pass') {
      try {
        // Optimistic UI update
        setProfiles(prev => prev.filter(p => p.user_id !== profile.user_id));
        // Permanent backend save
        await passRoommateProfile(profile.user_id);
      } catch (err) {
        console.error("Failed to pass profile", err);
        // Optional: you could revert the UI state here if it fails
      }
    } else if (action === 'connect') {
      try {
        setProfiles(prev => prev.filter(p => p.user_id !== profile.user_id));
        await sendRoommateConnectionRequest(profile.user_id);
        alert("Connection request sent!");
      } catch (err) {
        console.error("Failed to send connection request", err);
        alert("Failed to send connection request.");
      }
    }
  };

  const handleRespond = async (connectionId, action) => {
    try {
      await respondToRoommateConnectionRequest(connectionId, action);
      fetchData();
    } catch (err) {
      console.error("Failed to respond to request", err);
      alert("Failed to update request.");
    }
  };

  const handleMessage = async (userId) => {
    try {
      await sendMessage({
        receiver_id: userId,
        text: "Hi! I accepted your connection request on the Roommate Matcher."
      });
      navigate('/messages');
    } catch (err) {
      console.error("Failed to start conversation", err);
      alert("Failed to start chat.");
    }
  };

  const handleDisconnect = async (connectionId) => {
    if (!window.confirm("Are you sure you want to remove this roommate connection?")) return;
    try {
      await disconnectRoommate(connectionId);
      setAcceptedConnections(prev => prev.filter(c => c.connection_id !== connectionId));
      setSentRequests(prev => prev.filter(c => c.connection_id !== connectionId));
      setPendingRequests(prev => prev.filter(c => c.connection_id !== connectionId));
    } catch (err) {
      console.error("Failed to disconnect", err);
      alert("Failed to disconnect. Please try again.");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setIsSaving(true);
    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const result = await updateRoommateProfile(dataToSubmit);
      if (result && result.message) {
        setIsModalOpen(false);
        fetchData();
      } else {
        setSaveError('Unexpected response from server. Please try again.');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveError(error.message || 'Failed to save profile. Check if the backend server is running.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    if (filters.budgetMax && parseInt(p.budget_min) > parseInt(filters.budgetMax)) return false;
    if (filters.ageMax && p.age > parseInt(filters.ageMax)) return false;
    if (filters.location && (!p.location || !p.location.toLowerCase().includes(filters.location.toLowerCase()))) return false;
    if (filters.occupation && (!p.occupation || !p.occupation.toLowerCase().includes(filters.occupation.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight">Roommate Matcher</h1>
              <span className="bg-[#FACC15] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Beta
              </span>
            </div>
            <p className="text-white/60 mt-1 text-[15px]">Find compatible roommates to share costs based on lifestyle preferences.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-[#1A1A1A] border border-[#333] hover:bg-[#111] text-white font-bold rounded-xl shadow-sm transition-all text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            {myProfile ? "Edit My Seeker Profile" : "Create Seeker Profile"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#333] pb-2">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-2 font-bold transition-colors ${activeTab === 'discover' ? 'text-[#FACC15] border-b-2 border-[#FACC15]' : 'text-white/50 hover:text-white'}`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`pb-2 font-bold transition-colors flex items-center gap-2 ${activeTab === 'connections' ? 'text-[#FACC15] border-b-2 border-[#FACC15]' : 'text-white/50 hover:text-white'}`}
          >
            My Connections
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'discover' ? (
          <>
            {/* Filter Bar */}
            <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-[#333] shadow-sm mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Max Budget</label>
                  <input type="number" placeholder="e.g. 20000" value={filters.budgetMax} onChange={e => setFilters({ ...filters, budgetMax: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Max Age</label>
                  <input type="number" placeholder="e.g. 25" value={filters.ageMax} onChange={e => setFilters({ ...filters, ageMax: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Location</label>
                  <input type="text" placeholder="e.g. Colombo" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Occupation</label>
                  <select value={filters.occupation} onChange={e => setFilters({ ...filters, occupation: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none">
                    <option value="">Any</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <button onClick={() => setFilters({ budgetMax: '', ageMax: '', location: '', occupation: '' })} className="px-4 py-2 text-sm font-bold text-white/60 hover:text-white transition-colors rounded-xl border border-[#333] bg-[#111] hover:bg-[#222]">
                  Clear
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-[#333] flex justify-between items-center">
                <p className="text-white/70 text-sm font-medium">
                  Showing <span className="font-bold text-[#FACC15]">{filteredProfiles.length}</span> matches based on your filters
                </p>
              </div>
            </div>

            {/* Roommate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-12 text-center text-white/50 font-bold">Loading matches...</div>
              ) : filteredProfiles.length === 0 ? (
                <div className="col-span-full bg-[#1A1A1A] rounded-[24px] p-12 text-center border border-[#333] shadow-sm">
                  <div className="w-16 h-16 bg-black text-white/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No more profiles</h3>
                  <p className="text-white/50">You've reviewed all potential roommates matching your criteria. Try expanding your search filters.</p>
                </div>
              ) : (
                filteredProfiles.map(profile => (
                  <div key={profile.profile_id} className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    {/* Card Header (Avatar & Match Score) */}
                    <div className="p-6 pb-0 flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <img src={profile.avatar_url || "https://ui-avatars.com/api/?name=User"} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] shadow-sm" />
                        <div>
                          <h2 className="text-xl font-bold text-white">{profile.name}, {profile.age} <span className="text-white/60 text-sm font-normal">({profile.gender || 'Other'})</span></h2>
                          <p className="text-white/60 text-sm font-medium">{profile.occupation}</p>
                          {profile.location && (
                            <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {profile.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#10b981]/20 relative bg-black/20">
                          <svg className="absolute inset-0 w-full h-full text-[#10b981]" viewBox="0 0 36 36">
                            <path
                              className="text-white/10"
                              strokeWidth="3"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-[#10b981]"
                              strokeWidth="3"
                              strokeDasharray={`${profile.matchScore || 50}, 100`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="text-xs font-black text-white z-10">{profile.matchScore || 50}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="mb-4">
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Budget</p>
                        <p className="text-lg font-black text-[#10b981]">LKR {profile.budget_min} - {profile.budget_max}/mo</p>
                      </div>

                      <p className="text-white/70 text-sm leading-relaxed mb-6 italic line-clamp-3">
                        "{profile.bio}"
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {(profile.tags || []).map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-[#111] text-white/60 text-[11px] font-bold rounded-lg border border-[#333]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex border-t border-[#333]">
                      <button
                        onClick={() => handleAction(profile, 'pass')}
                        className="flex-1 py-4 text-center font-bold text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-colors border-r border-[#333] flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Pass
                      </button>
                      <button
                        onClick={() => handleAction(profile, 'connect')}
                        className="flex-1 py-4 text-center font-bold text-[#FACC15] hover:bg-[#FACC15]/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Connect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {/* Pending Requests */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-white">Pending Requests ({pendingRequests.length})</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-white/50 bg-[#1A1A1A] p-6 rounded-[24px] border border-[#333] shadow-sm">No pending connection requests.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequests.map(req => (
                    <div key={req.connection_id} className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={req.avatar_url || "https://ui-avatars.com/api/?name=User"} alt={req.name} className="w-12 h-12 rounded-full border border-[#333]" />
                        <div>
                          <h3 className="font-bold text-white">{req.name}, {req.age}</h3>
                          <p className="text-xs text-white/50">{req.occupation}</p>
                        </div>
                      </div>
                      <p className="text-sm italic text-white/70 line-clamp-2 mb-4">"{req.bio}"</p>
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => handleRespond(req.connection_id, 'accepted')} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 font-bold py-2 rounded-xl text-sm transition-colors">Accept</button>
                        <button onClick={() => handleRespond(req.connection_id, 'rejected')} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold py-2 rounded-xl text-sm transition-colors">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-white">Sent Requests ({sentRequests.length})</h2>
              {sentRequests.length === 0 ? (
                <p className="text-white/50 bg-[#1A1A1A] p-6 rounded-[24px] border border-[#333] shadow-sm">You haven't sent any connection requests yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sentRequests.map(req => (
                    <div key={req.connection_id} className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={req.avatar_url || "https://ui-avatars.com/api/?name=User"} alt={req.name} className="w-12 h-12 rounded-full border border-[#333]" />
                        <div>
                          <h3 className="font-bold text-white">{req.name}, {req.age}</h3>
                          <p className="text-xs text-white/50">{req.occupation}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm italic text-white/70 line-clamp-2">"{req.bio}"</p>
                      </div>
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => handleDisconnect(req.connection_id)} className="w-full bg-black border border-[#333] hover:border-red-500/30 text-white/50 hover:text-red-500 hover:bg-red-500/10 font-bold py-2 rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accepted Connections */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-white">My Roommates ({acceptedConnections.length})</h2>
              {acceptedConnections.length === 0 ? (
                <p className="text-white/50 bg-[#1A1A1A] p-6 rounded-[24px] border border-[#333] shadow-sm">You have no accepted connections yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {acceptedConnections.map(conn => (
                    <div key={conn.connection_id} className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] p-6 flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={conn.avatar_url || "https://ui-avatars.com/api/?name=User"} alt={conn.name} className="w-12 h-12 rounded-full border border-[#333]" />
                        <div>
                          <h3 className="font-bold text-white">{conn.name}, {conn.age}</h3>
                          <p className="text-xs text-white/50">{conn.occupation}</p>
                        </div>
                      </div>
                      <div className="mt-auto flex flex-col gap-2">
                        <button onClick={() => handleMessage(conn.user_id)} className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold py-3 rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          Message
                        </button>
                        <button onClick={() => handleDisconnect(conn.connection_id)} className="w-full bg-transparent border border-red-500/30 hover:bg-red-500/10 text-red-500 hover:text-red-500 font-bold py-2 rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#1A1A1A] rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-[#333]">
            <div className="px-6 py-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-extrabold text-white">Seeker Profile</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Age</label>
                  <input required type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Occupation</label>
                  <input required type="text" value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Min Budget (LKR)</label>
                  <input required type="number" value={formData.budget_min} onChange={e => setFormData({ ...formData, budget_min: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Max Budget (LKR)</label>
                  <input required type="number" value={formData.budget_max} onChange={e => setFormData({ ...formData, budget_max: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Gender</label>
                  <select required value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Preferred Roommate Gender</label>
                  <select required value={formData.preferred_gender} onChange={e => setFormData({ ...formData, preferred_gender: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none">
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Preferred Location</label>
                <input required type="text" placeholder="e.g. Colombo, Kandy" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Bio</label>
                <textarea required rows="3" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none resize-none"></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Lifestyle Tags (comma separated)</label>
                <input required type="text" placeholder="e.g. Non-smoker, Early bird, Clean" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2 bg-[#111] text-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#FACC15]/50 outline-none" />
              </div>
              {saveError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 font-medium">
                  ⚠️ {saveError}
                </div>
              )}
              <button type="submit" disabled={isSaving} className="w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-[#333] disabled:text-white/30 text-black font-bold rounded-xl shadow-md transition-colors">
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoommateMatcher;
