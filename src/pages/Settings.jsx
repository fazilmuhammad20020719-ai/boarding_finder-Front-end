import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const likedCount = (() => {
    try {
      const l = localStorage.getItem('listings');
      if (l) return JSON.parse(l).filter(x => x.liked).length;
    } catch (e) {}
    return 2;
  })();

  const renderTabButton = (id, icon, label) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all border-none cursor-pointer text-left ${
        activeTab === id 
          ? 'bg-[#1952c4] text-white shadow-md' 
          : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <div dangerouslySetInnerHTML={{ __html: icon }} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans antialiased text-[#0f172a]">
      <Navbar isLoggedIn={true} onLogout={handleLogout} likedCount={likedCount} activeTab="" />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 md:px-8 py-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-2">Manage your account preferences, security, and notifications.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            {renderTabButton('account', '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>', 'Account details')}
            {renderTabButton('security', '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>', 'Password & Security')}
            {renderTabButton('notifications', '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>', 'Notifications')}
            {renderTabButton('privacy', '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>', 'Privacy')}
          </div>

          {/* Main Content Area */}
          <div className="flex-grow bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 p-8">
            
            {showSuccess && (
              <div className="mb-6 bg-[#e8f7ec] text-[#10b981] p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in border border-[#10b981]/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Settings saved successfully!
              </div>
            )}

            <form onSubmit={handleSave}>

              {/* ACCOUNT SETTINGS */}
              {activeTab === 'account' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-[#0f172a] mb-6">Account Details</h2>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-[#e2e8f0]/60">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-[#ebf3ff] text-[#1952c4] flex items-center justify-center font-bold text-3xl shadow-sm">
                        J
                      </div>
                      <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#e2e8f0] rounded-full shadow-sm flex items-center justify-center text-slate-500 hover:text-[#1952c4] transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-bold text-[#0f172a] text-lg">Profile Picture</h3>
                      <p className="text-sm text-slate-500 mt-1 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                      <div className="flex gap-3 justify-center sm:justify-start">
                        <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors border-none cursor-pointer">Upload New</button>
                        <button type="button" className="px-4 py-2 bg-transparent text-red-500 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors border-none cursor-pointer">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                      <input type="text" defaultValue="Juan" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                      <input type="text" defaultValue="Fernando" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" defaultValue="juan.fernando@mrt.ac.lk" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+94 77 123 4567" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                  </div>
                </div>
              )}


              {/* SECURITY SETTINGS */}
              {activeTab === 'security' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-[#0f172a] mb-6">Password & Security</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                  </div>

                  <div className="mb-8 pb-8 border-b border-[#e2e8f0]/60">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-slate-50 focus:bg-white" />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0f172a] mb-2 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button type="button" className="px-5 py-2.5 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors cursor-pointer text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}


              {/* NOTIFICATIONS SETTINGS */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-[#0f172a] mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-[15px]">Booking Updates</h4>
                        <p className="text-sm text-slate-500 mt-1">Receive notifications when your booking status changes (approved, rejected).</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1952c4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-[15px]">Direct Messages</h4>
                        <p className="text-sm text-slate-500 mt-1">Get an email when a boarding owner sends you a new message.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1952c4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-[15px]">Marketing Emails</h4>
                        <p className="text-sm text-slate-500 mt-1">Receive emails about new features, promotions, and boarding tips.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1952c4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}


              {/* PRIVACY SETTINGS */}
              {activeTab === 'privacy' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-[#0f172a] mb-6">Privacy Controls</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-[15px]">Profile Visibility</h4>
                        <p className="text-sm text-slate-500 mt-1">Allow boarding owners to see your profile details when you apply.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1952c4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1952c4]"></div>
                      </label>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-[15px]">Show Online Status</h4>
                        <p className="text-sm text-slate-500 mt-1">Show when you are currently active in the messaging system.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1952c4]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1952c4]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}


              {/* Save Button (Always visible at the bottom) */}
              <div className="mt-10 pt-6 border-t border-[#e2e8f0]/60 flex justify-end">
                <button type="submit" className="px-8 py-3 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl transition-colors cursor-pointer border-none shadow-sm flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
