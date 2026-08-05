import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Build profile state from the authenticated user
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    course: '',
    studentId: '',
    role: '',
    propertyName: '',
    propertyType: '',
    permitNumber: '',
    propertyAddress: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [bookingRequests, setBookingRequests] = useState([]);

  // Liked count state for Navbar
  const [likedCount, setLikedCount] = useState(0);

  // Populate profile from authenticated user
  useEffect(() => {
    if (user) {
      const mapped = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        university: user.university || '',
        course: user.course || '',
        studentId: user.student_id || '',
        role: user.role || '',
        propertyName: user.property_name || '',
        propertyType: user.property_type || '',
        permitNumber: user.permit_number || '',
        propertyAddress: user.property_address || '',
      };
      setProfile(mapped);
      setEditForm(mapped);
    }
  }, [user]);

  useEffect(() => {
    // Read liked listings from localStorage to show badge count
    const localListings = localStorage.getItem('listings');
    if (localListings) {
      const parsed = JSON.parse(localListings);
      setLikedCount(parsed.filter(l => l.liked).length);
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      await updateUser({
        name: editForm.name,
        phone: editForm.phone,
        university: editForm.university,
        course: editForm.course,
        propertyName: editForm.propertyName,
        propertyType: editForm.propertyType,
        permitNumber: editForm.permitNumber,
        propertyAddress: editForm.propertyAddress,
      });
      setProfile(editForm);
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const isStudent = profile.role === 'student';
  const isOwner = profile.role === 'owner';

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar likedCount={likedCount} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Account & Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isOwner ? 'Manage your owner details and property information.' : 'Manage your student details and view your booking statuses.'}
          </p>
        </div>

        {/* Save success/error message */}
        {saveMessage && (
          <div className={`mb-6 px-4 py-3 rounded-[12px] text-sm font-medium ${
            saveMessage.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="bg-white rounded-[28px] border border-[#e2e8f0]/60 p-8 shadow-sm flex flex-col items-center text-center">

            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-black text-3xl shadow-md mb-4 border border-[#e2e8f0]">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 justify-center">
              {profile.name}
              <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✓ Verified
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
              {isStudent ? profile.studentId : profile.role}
            </p>

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
              {isStudent && (
                <>
                  <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                    <span className="text-lg">🏫</span>
                    <span>{profile.university || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                    <span className="text-lg">📚</span>
                    <span>{profile.course || 'Not specified'}</span>
                  </div>
                </>
              )}
              {isOwner && (
                <>
                  <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                    <span className="text-lg">🏠</span>
                    <span>{profile.propertyName || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                    <span className="text-lg">📋</span>
                    <span>{profile.propertyType || 'Not specified'}</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                <span className="text-lg">📧</span>
                <span>{profile.email}</span>
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
                    disabled={isSaving}
                    className={`px-4 py-2 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
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

                {/* Email Address (read-only) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none text-[14px]"
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

                {/* Role Badge */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Account Type
                  </label>
                  <div className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[14px] capitalize">
                    {profile.role === 'student' ? '🎓 Student' : '🏠 Property Owner'}
                  </div>
                </div>

              </div>

              <div className="w-full border-t border-slate-100 my-6"></div>

              {/* Student-specific fields */}
              {isStudent && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Course
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editForm.course : profile.course}
                        onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={profile.studentId}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none text-[14px]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Owner-specific fields */}
              {isOwner && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Property Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Property Name
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editForm.propertyName : profile.propertyName}
                        onChange={(e) => setEditForm({ ...editForm, propertyName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Property Type
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editForm.propertyType : profile.propertyType}
                        onChange={(e) => setEditForm({ ...editForm, propertyType: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px] capitalize"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Permit Number
                      </label>
                      <input
                        type="text"
                        value={profile.permitNumber}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Property Address
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editForm.propertyAddress : profile.propertyAddress}
                        onChange={(e) => setEditForm({ ...editForm, propertyAddress: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-[14px]"
                      />
                    </div>
                  </div>
                </>
              )}

            </form>
          </div>

        </div>

        {/* ===== BOOKING REQUESTS SECTION ===== */}
        {isStudent && (
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
              <p className="text-slate-400 text-sm">No active booking requests yet.</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default ProfilePage;
