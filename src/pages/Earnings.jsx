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
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Earnings & Payouts</h1>
            <p className="text-[#64748b] mt-1 text-[15px]">Manage your revenue, track transactions, and view payout methods.</p>
          </div>
          <Link to="/owner-dashboard">
            <button className="px-5 py-2.5 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#475569] font-semibold rounded-xl shadow-sm transition-all text-sm cursor-pointer">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#64748b] font-semibold text-sm uppercase tracking-wider">Total Revenue</span>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#0f172a]">LKR {totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#64748b] font-semibold text-sm uppercase tracking-wider">Pending Payouts</span>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#0f172a]">LKR {pendingPayouts.toLocaleString()}</h3>
              <p className="text-sm text-[#64748b] font-medium mt-1">Expected soon</p>
            </div>
          </div>

          {/* Payout Method */}
          <div className="bg-[#1e3a8a] text-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">Payout Method</span>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-[#1e3a8a] font-black text-xs italic">BANK</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">•••• 5894</h3>
                  <p className="text-xs text-white/70">Primary Account</p>
                </div>
              </div>
              <button className="mt-4 text-sm font-semibold text-white/90 hover:text-white underline decoration-white/30 hover:decoration-white transition-all cursor-pointer bg-transparent border-none">
                Update Method
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#e2e8f0]/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-[#e2e8f0]/60 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0f172a]">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#475569] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Tenant</th>
                  <th className="px-6 py-4 font-semibold">Property</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">Loading ledger...</td>
                  </tr>
                ) : ledger.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">No transactions found.</td>
                  </tr>
                ) : (
                  ledger.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#0f172a]">{tx.transaction_id}</td>
                      <td className="px-6 py-4 text-sm text-[#475569]">{tx.student_name}</td>
                      <td className="px-6 py-4 text-sm text-[#64748b]">{tx.property_name}</td>
                      <td className="px-6 py-4 text-sm text-[#64748b]">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0f172a] text-right">
                        LKR {Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.status?.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
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
