import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOwnerLedger } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PaymentBadge, ConfirmCashButton, isPaid, moveInAmount } from '../components/CashPayment';

const Earnings = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const data = await getOwnerLedger();
        setLedger(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  const received = ledger.filter(isPaid).reduce((sum, b) => sum + Number(b.paid_amount || 0), 0);
  const due = ledger.filter((b) => !isPaid(b)).reduce((sum, b) => sum + moveInAmount(b), 0);
  // Keep the row but take the new payment fields from the server response
  const updateRow = (id, u) => setLedger((rows) => rows.map((r) => (r.booking_id === id
    ? { ...r, payment_status: u.payment_status, paid_amount: u.paid_amount, paid_at: u.paid_at } : r)));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      {/* Top Bar */}
      <header className="bg-black text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b border-[#333]">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Owner Dashboard</div>
            <div className="text-sm font-extrabold">{user?.name || "Owner"}</div>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-2 justify-center flex-1">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Overview
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            My Listings
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Bookings
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Calendar
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Messages
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Students
          </button>
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-transparent text-white/70 hover:text-white hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Maintenance
          </button>
          <button
            className="px-3 py-2.5 text-sm whitespace-nowrap font-bold cursor-pointer flex items-center gap-2 rounded-xl transition-all border-none bg-[#FACC15] text-black shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Payments
          </button>
        </div>

        <div className="flex items-center justify-end w-1/4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/90 hover:text-[#FACC15] font-semibold transition-colors cursor-pointer bg-transparent border-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Move-in Payments</h1>
            <p className="text-white/60 mt-1 text-[15px]">Students pay in cash when they move in. Mark each payment once you receive it.</p>
          </div>
          <Link to="/owner-dashboard">
            <button className="px-5 py-2.5 bg-[#111] border border-[#333] hover:bg-[#222] text-white font-semibold rounded-xl shadow-sm transition-all text-sm cursor-pointer">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] p-5 rounded-[20px] border border-[#333]">
            <div className="text-white/60 font-semibold text-xs uppercase tracking-wider mb-2">Cash received</div>
            <div className="text-2xl font-bold text-emerald-400">LKR {received.toLocaleString()}</div>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-[20px] border border-[#333]">
            <div className="text-white/60 font-semibold text-xs uppercase tracking-wider mb-2">Still to collect</div>
            <div className="text-2xl font-bold text-amber-400">LKR {due.toLocaleString()}</div>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-[20px] border border-[#333]">
            <div className="text-white/60 font-semibold text-xs uppercase tracking-wider mb-2">Payment method</div>
            <div className="text-2xl font-bold text-white">Cash on Move-in</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-[24px] border border-[#333] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#333]">
            <h2 className="text-lg font-bold text-white">Approved bookings</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-white/40">Loading…</div>
          ) : ledger.length === 0 ? (
            <div className="p-8 text-center text-white/40">No approved bookings yet.</div>
          ) : (
            <div className="divide-y divide-[#333]">
              {ledger.map((b) => (
                <div key={b.booking_id} className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{b.student_name} <span className="text-white/40 font-medium">· {b.property_name}</span></div>
                    <div className="text-sm text-white/60 mt-0.5">
                      Move-in {new Date(b.move_in_date).toLocaleDateString()} · {b.duration_months} month{b.duration_months === 1 ? "" : "s"}
                      {b.student_phone ? <> · {b.student_phone}</> : null}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      Due on move-in: LKR {Number(b.monthly_rent).toLocaleString()} rent + LKR {Number(b.security_deposit).toLocaleString()} deposit
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <PaymentBadge booking={b} />
                    <ConfirmCashButton booking={b} onChange={(u) => updateRow(b.booking_id, u)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Earnings;
