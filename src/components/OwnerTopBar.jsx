import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// The owner's top bar (same look as the Owner Dashboard header).
// Used on shared pages such as /property/:id when an owner is signed in.
const tabClass = 'px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10';

const icon = (d) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
);

const TABS = [
  { label: 'Overview', tab: 'overview', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { label: 'My Listings', tab: 'listings', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { label: 'Bookings', tab: 'bookings', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { label: 'Messages', tab: 'messages', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'Students', tab: 'students', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { label: 'Maintenance', tab: 'maintenance', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Payments', path: '/earnings', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const OwnerTopBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const go = (t) => (t.path ? navigate(t.path) : navigate('/owner-dashboard', { state: { tab: t.tab } }));

  return (
    <header className="bg-black text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b border-[#333] font-sans">
      <button onClick={() => navigate('/owner-dashboard')} className="flex items-center gap-4 lg:w-1/4 bg-transparent border-none text-white cursor-pointer text-left p-0">
        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={TABS[1].d} /></svg>
        </div>
        <div>
          <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Owner Dashboard</div>
          <div className="text-sm font-extrabold">{user?.name || 'Owner'}</div>
        </div>
      </button>

      <div className="hidden lg:flex items-center gap-2 justify-center flex-1">
        {TABS.map((t) => (
          <button key={t.label} onClick={() => go(t)} className={tabClass}>
            {icon(t.d)}
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end lg:w-1/4">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-white/90 hover:text-[#FACC15] font-semibold transition-colors cursor-pointer bg-transparent border-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default OwnerTopBar;
