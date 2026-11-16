import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { requestPasswordReset } from '../services/api';

// Settings for every role. Account details come from the signed-in user and are
// saved with updateUser(); the fields shown depend on the role (student, owner, admin).
// Notification and privacy switches are remembered on this device.

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15]/50 transition-all bg-[#111] focus:bg-black text-white disabled:opacity-50';

const ROLE_LABEL = { student: '🎓 Student', owner: '🏠 Property Owner', admin: '🛡️ System Administrator' };

// Notification options per role
const NOTIFICATION_OPTIONS = {
  student: [
    { id: 'bookingUpdates', title: 'Booking Updates', text: 'When an owner approves or rejects your booking request.', on: true },
    { id: 'messages', title: 'Direct Messages', text: 'When a boarding owner sends you a new message.', on: true },
    { id: 'maintenance', title: 'Maintenance Updates', text: 'When the status of your repair request changes.', on: true },
    { id: 'announcements', title: 'Announcements', text: 'Platform news and updates from BoardingFinder.', on: false },
  ],
  owner: [
    { id: 'newBookings', title: 'New Booking Requests', text: 'When a student requests to book one of your listings.', on: true },
    { id: 'messages', title: 'Direct Messages', text: 'When a student sends you a new message.', on: true },
    { id: 'maintenance', title: 'Maintenance Requests', text: 'When a tenant submits a new repair request.', on: true },
    { id: 'reviews', title: 'New Reviews', text: 'When a student leaves a review on your listing.', on: true },
    { id: 'announcements', title: 'Announcements', text: 'Platform news and updates from BoardingFinder.', on: false },
  ],
  admin: [
    { id: 'verifications', title: 'New Verifications', text: 'When a user uploads documents for identity verification.', on: true },
    { id: 'newListings', title: 'New Listings', text: 'When an owner publishes a new listing.', on: true },
    { id: 'reports', title: 'Reports & Complaints', text: 'When a user reports a listing or another user.', on: true },
  ],
};

// Privacy options per role (admins have none)
const PRIVACY_OPTIONS = {
  student: [
    { id: 'profileVisible', title: 'Profile Visibility', text: 'Let boarding owners see your university and course when you send a booking request.', on: true },
    { id: 'onlineStatus', title: 'Show Online Status', text: 'Show when you are active in Messages.', on: true },
  ],
  owner: [
    { id: 'showPhone', title: 'Show Phone Number', text: 'Show your phone number to students on your listings.', on: true },
    { id: 'onlineStatus', title: 'Show Online Status', text: 'Show when you are active in Messages.', on: true },
  ],
  admin: [],
};

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="w-11 h-6 bg-[#333] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FACC15]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FACC15]"></div>
  </label>
);

const Settings = () => {
  const { user, updateUser } = useAuth();
  const role = user?.role === 'owner' || user?.role === 'admin' ? user.role : 'student';

  const [activeTab, setActiveTab] = useState('account');
  const [message, setMessage] = useState(null); // { ok: boolean, text: string }
  const [isSaving, setIsSaving] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Account form, filled from the signed-in user
  const [form, setForm] = useState({});
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
  }, [user]);

  // Notification + privacy switches, remembered per user on this device
  const prefsKey = `bf-settings-${user?.id || user?.user_id || 'me'}`;
  const defaults = () => {
    const d = {};
    [...NOTIFICATION_OPTIONS[role], ...PRIVACY_OPTIONS[role]].forEach((o) => { d[o.id] = o.on; });
    return d;
  };
  const [prefs, setPrefs] = useState(defaults);
  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(prefsKey) || 'null'); } catch { saved = null; }
    setPrefs({ ...defaults(), ...(saved || {}) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsKey, role]);

  const flash = (ok, text) => {
    setMessage({ ok, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (activeTab === 'account') {
      setIsSaving(true);
      try {
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
      } catch (err) {
        flash(false, err.message || 'Could not save your details.');
      } finally {
        setIsSaving(false);
      }
      return;
    }
    try { localStorage.setItem(prefsKey, JSON.stringify(prefs)); } catch { /* storage may be blocked */ }
    flash(true, 'Preferences saved.');
  };

  const sendReset = async () => {
    try {
      await requestPasswordReset(user.email);
      setResetSent(true);
    } catch (err) {
      flash(false, err.message || 'Could not send the reset link.');
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

  const optionList = (options) => (
    <div className="space-y-4">
      {options.map((o) => (
        <div key={o.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#333] hover:bg-[#111] transition-colors">
          <div>
            <h4 className="font-bold text-white text-[15px]">{o.title}</h4>
            <p className="text-sm text-white/50 mt-1">{o.text}</p>
          </div>
          <Toggle checked={!!prefs[o.id]} onChange={(v) => setPrefs({ ...prefs, [o.id]: v })} />
        </div>
      ))}
    </div>
  );

  const subtitle = {
    student: 'Manage your student account, security and notifications.',
    owner: 'Manage your owner account, property details, security and notifications.',
    admin: 'Manage your administrator account, security and alerts.',
  }[role];

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
                onClick={() => setActiveTab(t.id)}
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

                  <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#333]">
                    <div className="w-20 h-20 rounded-full bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center font-black text-3xl border border-[#FACC15]/30 shrink-0">
                      {(user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-lg truncate">{user?.name}</div>
                      <div className="text-sm text-white/50 truncate">{user?.email}</div>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30">
                        {ROLE_LABEL[role]}
                      </span>
                    </div>
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
                  <div className="p-5 rounded-2xl border border-[#333] mb-6">
                    <h4 className="font-bold text-white text-[15px]">Change Password</h4>
                    <p className="text-sm text-white/50 mt-1 mb-4">
                      We'll email a secure reset link to <span className="text-white">{user?.email}</span>. Open it to choose a new password.
                    </p>
                    {resetSent ? (
                      <div className="text-sm font-bold text-[#10b981]">Reset link sent. Check your inbox.</div>
                    ) : (
                      <button type="button" onClick={sendReset} className="px-5 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors cursor-pointer border-none text-sm">
                        Send Reset Link
                      </button>
                    )}
                  </div>

                  {role !== 'admin' && (
                    <div className="p-5 rounded-2xl border border-red-500/30">
                      <h4 className="font-bold text-red-500 text-[15px]">Close Account</h4>
                      <p className="text-sm text-white/50 mt-1 mb-4">
                        {role === 'owner'
                          ? 'To close your owner account and remove your listings, contact our support team.'
                          : 'To close your account and remove your data, contact our support team.'}
                      </p>
                      <Link to="/contact" className="inline-block px-5 py-2.5 border border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold rounded-xl transition-colors text-sm">
                        Contact Support
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  {optionList(NOTIFICATION_OPTIONS[role])}
                </div>
              )}

              {/* PRIVACY (students and owners) */}
              {activeTab === 'privacy' && PRIVACY_OPTIONS[role].length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Privacy Controls</h2>
                  {optionList(PRIVACY_OPTIONS[role])}
                </div>
              )}

              {/* Save (not needed on the security tab) */}
              {activeTab !== 'security' && (
                <div className="mt-10 pt-6 border-t border-[#333] flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors cursor-pointer border-none shadow-sm flex items-center gap-2 text-sm disabled:opacity-60"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
