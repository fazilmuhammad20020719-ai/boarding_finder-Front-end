import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AvatarUploader from '../components/AvatarUploader';
import { useAuth } from '../context/AuthContext';
import { updatePreferences, changePassword, deleteAccount } from '../services/api';

// Settings for every role. Everything here is saved on the server:
// account details (updateUser), profile picture, notification + privacy
// preferences, password change and account deletion.

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15]/50 transition-all bg-[#111] focus:bg-black text-white disabled:opacity-50';

const ROLE_LABEL = { student: '🎓 Student', owner: '🏠 Property Owner', admin: '🛡️ System Administrator' };

// Must match NOTIFICATION_KEYS / PRIVACY_KEYS in backend/controllers/auth/accountSettings.js.
// Switching one off stops those notifications (in the app and by email).
const NOTIFICATION_OPTIONS = {
  student: [
    { id: 'bookingUpdates', title: 'Booking Updates', text: 'When an owner approves, rejects or cancels your booking, or confirms your move-in payment.' },
    { id: 'maintenance', title: 'Maintenance Updates', text: 'When the status of your repair request changes.' },
    { id: 'announcements', title: 'Announcements', text: 'Platform news and updates from the BoardingFinder team.' },
  ],
  owner: [
    { id: 'newBookings', title: 'Booking Requests', text: 'New booking requests, cancellations and when a room becomes fully booked.' },
    { id: 'maintenance', title: 'Maintenance Requests', text: 'When a tenant submits a new repair request.' },
    { id: 'reviews', title: 'New Reviews', text: 'When a student reviews one of your listings.' },
    { id: 'announcements', title: 'Announcements', text: 'Platform news and updates from the BoardingFinder team.' },
  ],
  admin: [
    { id: 'verifications', title: 'New Verifications', text: 'When a user uploads identity documents for review.' },
    { id: 'newListings', title: 'New Listings', text: 'When an owner publishes a new listing.' },
    { id: 'reports', title: 'Support & Reports', text: 'New support tickets, Contact Us messages and reports.' },
  ],
};

const PRIVACY_OPTIONS = {
  student: [
    { id: 'profileVisible', title: 'Show My Student Details', text: 'Let owners of the rooms you book see your university, course and student ID.' },
  ],
  owner: [
    { id: 'showPhone', title: 'Show My Phone Number', text: 'Show your phone number to signed-in students on your listing pages.' },
  ],
  admin: [],
};

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-[#333] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FACC15]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FACC15]"></div>
  </label>
);

// Missing key = switched on
const readPrefs = (options, saved) => {
  const out = {};
  options.forEach((o) => { out[o.id] = saved?.[o.id] !== false; });
  return out;
};

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser, patchUser, clearSession } = useAuth();
  const role = user?.role === 'owner' || user?.role === 'admin' ? user.role : 'student';

  const [activeTab, setActiveTab] = useState('account');
  const [message, setMessage] = useState(null); // { ok, text }
  const [isSaving, setIsSaving] = useState(false);

  // Account form
  const [form, setForm] = useState({});
  // Preferences
  const [notifications, setNotifications] = useState({});
  const [privacy, setPrivacy] = useState({});
  // Password
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  // Delete account
  const [del, setDel] = useState({ open: false, password: '', confirm: '' });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      university: user.university || '',
      course: user.course || '',
      propertyName: user.property_name || '',
      propertyType: user.property_type || '',
      permitNumber: user.permit_number || '',
      propertyAddress: user.property_address || '',
    });
    setNotifications(readPrefs(NOTIFICATION_OPTIONS[role], user.notification_prefs));
    setPrivacy(readPrefs(PRIVACY_OPTIONS[role], user.privacy_prefs));
  }, [user, role]);

  const flash = (ok, text) => {
    setMessage({ ok, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const saveAccount = async () => {
    const payload = { name: form.name, phone: form.phone };
    if (role === 'student') Object.assign(payload, { university: form.university, course: form.course });
    if (role === 'owner') {
      Object.assign(payload, {
        propertyName: form.propertyName,
        propertyType: form.propertyType,
        permitNumber: form.permitNumber,
        propertyAddress: form.propertyAddress,
      });
    }
    await updateUser(payload);
    flash(true, 'Account details saved.');
  };

  const savePreferences = async () => {
    const data = await updatePreferences(notifications, privacy);
    patchUser({ notification_prefs: data.notification_prefs, privacy_prefs: data.privacy_prefs });
    flash(true, 'Preferences saved.');
  };

  const savePassword = async () => {
    if (pw.next !== pw.confirm) {
      flash(false, 'The new passwords do not match.');
      return;
    }
    const data = await changePassword(pw.current, pw.next);
    setPw({ current: '', next: '', confirm: '' });
    flash(true, data.message || 'Password changed.');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'account') await saveAccount();
      else if (activeTab === 'security') await savePassword();
      else await savePreferences();
    } catch (err) {
      flash(false, err.message || 'Could not save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (del.confirm !== 'DELETE') {
      flash(false, 'Type DELETE to confirm.');
      return;
    }
    setIsSaving(true);
    try {
      await deleteAccount(del.password);
      clearSession();
      navigate('/login', { replace: true });
    } catch (err) {
      flash(false, err.message || 'Could not delete your account.');
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account details', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'security', label: 'Password & Security', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', label: 'Notifications', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    ...(PRIVACY_OPTIONS[role].length
      ? [{ id: 'privacy', label: 'Privacy', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }]
      : []),
  ];

  const field = (key, label, props = {}) => (
    <div>
      <label className="block text-sm font-bold text-white/70 mb-2">{label}</label>
      <input
        type="text"
        value={form[key] ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={inputClass}
        {...props}
      />
    </div>
  );

  const optionList = (options, values, setValues) => (
    <div className="space-y-4">
      {options.map((o) => (
        <div key={o.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#333] hover:bg-[#111] transition-colors">
          <div>
            <h4 className="font-bold text-white text-[15px]">{o.title}</h4>
            <p className="text-sm text-white/50 mt-1">{o.text}</p>
          </div>
          <Toggle checked={!!values[o.id]} onChange={(v) => setValues({ ...values, [o.id]: v })} />
        </div>
      ))}
    </div>
  );

  const subtitle = {
    student: 'Manage your student account, security and notifications.',
    owner: 'Manage your owner account, property details, security and notifications.',
    admin: 'Manage your administrator account, security and alerts.',
  }[role];

  const saveLabel = activeTab === 'security' ? 'Change Password' : 'Save Changes';

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-white/50 mt-2">{subtitle}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setMessage(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all border-none cursor-pointer text-left ${
                  activeTab === t.id ? 'bg-[#FACC15] text-black shadow-md' : 'bg-transparent text-white/60 hover:bg-[#111] hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={t.d} /></svg>
                {t.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-grow bg-[#1A1A1A] rounded-3xl shadow-sm border border-[#333] p-8 min-w-0">
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${message.ok ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave}>
              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>

                  <div className="mb-8 pb-8 border-b border-[#333]">
                    <AvatarUploader />
                    <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-bold bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30">
                      {ROLE_LABEL[role]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {field('name', 'Full Name')}
                    {field('phone', 'Phone Number', { type: 'tel' })}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-white/70 mb-2">Email Address</label>
                      <input type="email" value={user?.email || ''} disabled className={inputClass} />
                      <p className="text-xs text-white/40 mt-1.5">Your email is your login and can't be changed here.</p>
                    </div>
                  </div>

                  {role === 'student' && (
                    <>
                      <h3 className="text-base font-bold text-white mt-8 mb-4">Student Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {field('university', 'University')}
                        {field('course', 'Course')}
                      </div>
                    </>
                  )}

                  {role === 'owner' && (
                    <>
                      <h3 className="text-base font-bold text-white mt-8 mb-4">Property Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {field('propertyName', 'Property Name')}
                        {field('propertyType', 'Property Type')}
                        {field('permitNumber', 'Permit Number')}
                        {field('propertyAddress', 'Property Address')}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SECURITY */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Password & Security</h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-white/70 mb-2">Current Password</label>
                      <input type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-white/70 mb-2">New Password</label>
                        <input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white/70 mb-2">Confirm New Password</label>
                        <input type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                    <p className="text-xs text-white/40">
                      At least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.
                      Changing it signs you out on your other devices.
                    </p>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Notification Preferences</h2>
                  <p className="text-sm text-white/50 mb-6">Switched-off notifications aren't sent to you in the app or by email. Account and security messages are always sent.</p>
                  {optionList(NOTIFICATION_OPTIONS[role], notifications, setNotifications)}
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === 'privacy' && PRIVACY_OPTIONS[role].length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Privacy Controls</h2>
                  {optionList(PRIVACY_OPTIONS[role], privacy, setPrivacy)}
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-[#333] flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors cursor-pointer border-none shadow-sm flex items-center gap-2 text-sm disabled:opacity-60"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {isSaving ? 'Saving…' : saveLabel}
                </button>
              </div>
            </form>

            {/* Delete account (students and owners) */}
            {activeTab === 'security' && role !== 'admin' && (
              <div className="mt-10 p-5 rounded-2xl border border-red-500/30">
                <h4 className="font-bold text-red-500 text-[15px]">Delete Account</h4>
                <p className="text-sm text-white/50 mt-1">
                  {role === 'owner'
                    ? 'Your listings go offline, pending booking requests are cancelled and you can no longer sign in. This cannot be undone.'
                    : 'Your pending booking requests are cancelled and you can no longer sign in. This cannot be undone.'}
                </p>

                {!del.open ? (
                  <button
                    type="button"
                    onClick={() => setDel({ open: true, password: '', confirm: '' })}
                    className="mt-4 px-5 py-2.5 bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Delete my account
                  </button>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-white/70 mb-2">Your password</label>
                      <input type="password" autoComplete="current-password" value={del.password} onChange={(e) => setDel({ ...del, password: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/70 mb-2">Type <span className="text-red-400">DELETE</span> to confirm</label>
                      <input type="text" value={del.confirm} onChange={(e) => setDel({ ...del, confirm: e.target.value })} className={inputClass} />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSaving || !del.password || del.confirm !== 'DELETE'}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors cursor-pointer border-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Permanently delete account
                      </button>
                      <button
                        type="button"
                        onClick={() => setDel({ open: false, password: '', confirm: '' })}
                        className="px-5 py-2.5 bg-transparent border border-[#333] text-white/70 hover:text-white font-bold rounded-xl cursor-pointer text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
