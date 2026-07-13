import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();

  // Load profile from localStorage or fallback
  const [profile, setProfile] = useState(() => {
    const localProfile = localStorage.getItem('studentProfile');
    if (localProfile) {
      return JSON.parse(localProfile);
    }
    return {
      name: "Krishnan",
      email: "nuha@mrt.ac.lk",
      phone: "+94 77 123 4567",
      university: "University of Moratuwa",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      address: "125/A, Galle Road, Colombo 03",
      studentId: "UOM-CS-2024-0042",
      gender: "Male"
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      propertyName: "Lakeside Suites",
      date: "2026-07-12",
      status: "Pending Landlord Review",
      price: 8500
    }
  ]);

  // Liked count state for Navbar
  const [likedCount, setLikedCount] = useState(2);

  useEffect(() => {
    // Read liked listings from localStorage to show badge count
    const localListings = localStorage.getItem('listings');
    if (localListings) {
      const parsed = JSON.parse(localListings);
      setLikedCount(parsed.filter(l => l.liked).length);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem('studentProfile', JSON.stringify(editForm));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Account & Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your student details and view your booking statuses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="bg-white rounded-[28px] border border-[#e2e8f0]/60 p-8 shadow-sm flex flex-col items-center text-center">

            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-black text-3xl shadow-md mb-4 border border-[#e2e8f0]">
              {profile.name.charAt(0)}
            </div>

            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 justify-center">
              {profile.name}
              <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✓ Verified
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{profile.studentId}</p>

            <div className="w-full border-t border-slate-100 my-6"></div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-[#f0f4f9] rounded-2xl p-3 flex flex-col items-center">
                <span className="text-2xl font-black text-[#1952c4]">{likedCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Saved Homes</span>
              </div>
              <div className="bg-[#f0f4f9] rounded-2xl p-3 flex flex-col items-center">
                <span className="text-2xl font-black text-amber-500">{bookingRequests.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Bookings</span>
              </div>
            </div>

            <div className="w-full border-t border-slate-100 my-6"></div>

            {/* Side menu / info */}
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                <span className="text-lg">🏫</span>
                <span>{profile.university}</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                <span className="text-lg">📚</span>
                <span>{profile.department}</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                <span className="text-lg">🎓</span>
                <span>{profile.year}</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAILS FORM */}
          <div className="lg:col-span-2 bg-white rounded-[28px] border border-[#e2e8f0]/60 p-8 shadow-sm">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-[#1952c4]/45 text-[#1952c4] font-bold text-xs rounded-xl hover:bg-[#ebf3ff]/40 transition-all cursor-pointer bg-transparent"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditForm({ ...profile });
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Full name */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editForm.name : profile.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={isEditing ? editForm.email : profile.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editForm.phone : profile.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Gender
                  </label>
                  <select
                    value={isEditing ? editForm.gender : profile.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px] appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              </div>

              {/* Home Address */}
              <div>
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                  Home Address
                </label>
                <input
                  type="text"
                  value={isEditing ? editForm.address : profile.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                />
              </div>

              <div className="w-full border-t border-slate-100 my-6"></div>

              <h3 className="text-lg font-bold text-slate-800 mb-6">Academic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* University */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    University
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editForm.university : profile.university}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Department / Course
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editForm.department : profile.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                  />
                </div>
              </div>

            </form>
          </div>

        </div>

        {/* ===== BOOKING REQUESTS SECTION ===== */}
        <div className="bg-white rounded-[28px] border border-[#e2e8f0]/60 p-8 shadow-sm mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">My Booking Requests</h3>
          {bookingRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                    <th className="pb-3.5">Property</th>
                    <th className="pb-3.5">Preferred Date</th>
                    <th className="pb-3.5">Monthly Rent</th>
                    <th className="pb-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px] text-slate-700">
                  {bookingRequests.map((request) => (
                    <tr key={request.id} className="align-middle">
                      <td className="py-4 font-bold text-slate-800">{request.propertyName}</td>
                      <td className="py-4">{request.date}</td>
                      <td className="py-4 font-semibold text-[#1952c4]">LKR {request.price.toLocaleString()}</td>
                      <td className="py-4">
                        <span className="bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No active booking slots requested yet.</p>
          )}
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;
