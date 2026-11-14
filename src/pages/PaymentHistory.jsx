import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPaymentHistory } from '../services/api';
import { PaymentBadge, isPaid, moveInAmount } from '../components/CashPayment';

// Student view of move-in payments. Payment is Cash on Move-in only: the
// student pays the owner in person and the owner confirms it in the system.
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPaymentHistory()
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Could not load payments'))
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = payments.filter(isPaid).reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
  const totalDue = payments.filter((p) => !isPaid(p)).reduce((sum, p) => sum + moveInAmount(p), 0);

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white flex flex-col">
      <Navbar activeTab="" />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Payments</h1>
          <p className="text-white/60 mt-2">
            You pay the owner in cash when you move in. The owner confirms it here once received.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#333]">
            <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Paid (confirmed)</div>
            <div className="text-2xl font-black text-emerald-400">LKR {totalPaid.toLocaleString()}</div>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#333]">
            <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">To pay on move-in</div>
            <div className="text-2xl font-black text-amber-400">LKR {totalDue.toLocaleString()}</div>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#333]">
            <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Payment method</div>
            <div className="text-2xl font-black text-white">Cash on Move-in</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl border border-[#333] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white/40">Loading…</div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-white/50">
              No approved bookings yet. Once an owner approves your booking, the move-in payment shows here.
              <div className="mt-4">
                <Link to="/my-bookings" className="text-[#FACC15] font-bold">Go to My Bookings</Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#333]">
              {payments.map((p) => (
                <div key={p.booking_id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{p.property_name}</div>
                    <div className="text-sm text-white/60 mt-0.5">
                      Owner: {p.owner_name} · Move-in {new Date(p.move_in_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      LKR {Number(p.monthly_rent).toLocaleString()} first month + LKR {Number(p.security_deposit).toLocaleString()} deposit, paid in cash
                    </div>
                  </div>
                  <PaymentBadge booking={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentHistory;
