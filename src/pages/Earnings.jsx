import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OwnerTopBar from '../components/OwnerTopBar';
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
      <OwnerTopBar />

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
