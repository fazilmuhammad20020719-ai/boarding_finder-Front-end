import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { getOwnerLedger } from '../services/api';

const Earnings = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalRevenue = ledger.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingPayouts = ledger.filter(p => p.status === 'Pending').reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Earnings & Payouts</h1>
            <p className="text-white/60 mt-1 text-[15px]">Manage your revenue, track transactions, and view payout methods.</p>
          </div>
          <Link to="/owner-dashboard">
            <button className="px-5 py-2.5 bg-[#111] border border-[#333] hover:bg-[#222] text-white font-semibold rounded-xl shadow-sm transition-all text-sm cursor-pointer">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-[#1A1A1A] p-6 rounded-[24px] shadow-sm border border-[#333] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 font-semibold text-sm uppercase tracking-wider">Total Revenue</span>
              <div className="w-10 h-10 bg-[#10b981]/20 text-[#10b981] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">LKR {totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-[#1A1A1A] p-6 rounded-[24px] shadow-sm border border-[#333] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 font-semibold text-sm uppercase tracking-wider">Pending Payouts</span>
              <div className="w-10 h-10 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">LKR {pendingPayouts.toLocaleString()}</h3>
              <p className="text-sm text-white/60 font-medium mt-1">Expected soon</p>
            </div>
          </div>

          {/* Payout Method */}
          <div className="bg-[#111] border border-[#333] text-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-white/60 font-semibold text-sm uppercase tracking-wider">Payout Method</span>
              <div className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-[#222] rounded flex items-center justify-center">
                  <span className="text-[#FACC15] font-black text-xs italic">BANK</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">•••• 5894</h3>
                  <p className="text-xs text-white/60">Primary Account</p>
                </div>
              </div>
              <button className="mt-4 text-sm font-semibold text-[#FACC15] underline decoration-[#FACC15]/30 hover:decoration-[#FACC15] transition-all cursor-pointer bg-transparent border-none">
                Update Method
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#1A1A1A] rounded-[24px] shadow-sm border border-[#333] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#333] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] text-white/60 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Tenant</th>
                  <th className="px-6 py-4 font-semibold">Property</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/40">Loading ledger...</td>
                  </tr>
                ) : ledger.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/40">No transactions found.</td>
                  </tr>
                ) : (
                  ledger.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#111] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{tx.transaction_id}</td>
                      <td className="px-6 py-4 text-sm text-white/80">{tx.student_name}</td>
                      <td className="px-6 py-4 text-sm text-white/60">{tx.property_name}</td>
                      <td className="px-6 py-4 text-sm text-white/60">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#FACC15] text-right">
                        LKR {Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.status?.toLowerCase() === 'completed'
                            ? 'bg-[#10b981]/20 text-[#10b981]'
                            : 'bg-orange-500/20 text-orange-500'
                          }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Earnings;
