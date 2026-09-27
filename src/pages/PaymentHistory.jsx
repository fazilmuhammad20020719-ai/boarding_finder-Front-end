import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPaymentHistory, processPayment, getMyBookings } from '../services/api';

const PaymentHistory = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBookings, setActiveBookings] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    booking_id: '',
    amount: '',
    payment_type: 'Monthly Rent',
    method: 'Visa ending in •••• 4242'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getPaymentHistory();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      // Filter for approved bookings
      const approved = res.bookings.filter(b => b.status === 'approved' || b.status === 'pending');
      setActiveBookings(approved);
      if (approved.length > 0) {
        setPaymentForm(prev => ({ ...prev, booking_id: approved[0].booking_id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchBookings();
  }, []);

  const handleMakePayment = async (e) => {
    e.preventDefault();
    if (!paymentForm.booking_id || !paymentForm.amount) {
      alert("Please select a booking and enter an amount.");
      return;
    }

    setIsProcessing(true);
    try {
      await processPayment(paymentForm);
      alert("Payment processed successfully!");
      setIsModalOpen(false);
      fetchHistory(); // Refresh history
      setPaymentForm(prev => ({ ...prev, amount: '' })); // Reset amount
    } catch (err) {
      alert(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
      case 'pending': return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'refunded': return 'bg-[#333] text-white/60 border-[#444]';
      case 'failed': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-[#333] text-white/60 border-[#444]';
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white flex flex-col">
      <Navbar activeTab="" />

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12">

        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Payment History</h1>
            <p className="text-white/60 mt-2">View and download your past transaction receipts.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl shadow-sm transition-colors cursor-pointer text-sm border-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Make Payment
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-[#333]">
            <div className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Total Paid (All Time)</div>
            <div className="text-3xl font-black text-white">LKR {totalPaid.toLocaleString()}</div>
          </div>
          <div className="bg-[#111] p-6 rounded-2xl shadow-sm border border-[#333] text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#333]/30 rounded-full blur-xl pointer-events-none"></div>
            <div className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">Active Payment Method</div>
            <div className="text-xl font-bold flex items-center gap-3 text-[#FACC15]">
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#222" /><path d="M12.986 16.963h2.646l1.677-10.42h-2.646l-1.677 10.42zm11.396-10.2c-.417-.193-1.077-.4-1.855-.4-2.023 0-3.447 1.055-3.46 2.565-.022 1.114 1.026 1.737 1.804 2.115.795.385 1.062.632 1.062.977 0 .53-.65.772-1.25.772-.828 0-1.272-.124-1.954-.424l-.275-.128-.37 2.268c.484.22 1.385.412 2.316.42 2.164 0 3.56-1.045 3.585-2.665.01-1.348-1.253-1.84-1.84-2.12-.705-.347-1.14-.58-1.14-.932 0-.494.55-.785 1.206-.785.668 0 1.142.14 1.52.298l.183.085.47-2.146zm-9.395 10.2h2.825c.348 0 .65-.198.78-.507l3.32-8.543-1.202-1.37h-2.11c-.33 0-.61.137-.744.43L12.572 16.96h-2.585zm-2.88-10.155l-2.035 6.94-1.03-5.58c-.147-.648-.718-1.36-1.353-1.36H.488l-.066.304c1.28.274 2.73.93 3.614 1.638l3.18 8.058 2.65-10h-2.126z" fill="#FACC15" /></svg>
              •••• 4242
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#1A1A1A] rounded-3xl shadow-sm border border-[#333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-5 bg-[#111] border-b border-[#333] font-bold text-xs text-white/60 uppercase tracking-wider">Transaction ID</th>
                  <th className="p-5 bg-[#111] border-b border-[#333] font-bold text-xs text-white/60 uppercase tracking-wider">Date</th>
                  <th className="p-5 bg-[#111] border-b border-[#333] font-bold text-xs text-white/60 uppercase tracking-wider">Details</th>
                  <th className="p-5 bg-[#111] border-b border-[#333] font-bold text-xs text-white/60 uppercase tracking-wider">Amount</th>
                  <th className="p-5 bg-[#111] border-b border-[#333] font-bold text-xs text-white/60 uppercase tracking-wider">Status</th>
                  <th className="p-5 bg-[#111] border-b border-[#333] font-bold text-xs text-white/60 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/40">Loading...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-white/40">No payment history found.</td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr key={index} className="hover:bg-[#111] transition-colors">
                      <td className="p-5 font-bold text-white text-sm">{payment.transaction_id}</td>
                      <td className="p-5 font-medium text-white/80 text-sm">{new Date(payment.created_at).toLocaleDateString()}</td>
                      <td className="p-5">
                        <div className="font-bold text-white text-sm">{payment.payment_type}</div>
                        <div className="font-medium text-white/60 text-xs">{payment.property_name}</div>
                      </td>
                      <td className="p-5 font-extrabold text-[#FACC15]">LKR {Number(payment.amount).toLocaleString()}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button className="text-[#FACC15] hover:text-black font-bold text-sm bg-transparent border-none cursor-pointer p-2 hover:bg-[#FACC15] rounded-lg transition-colors inline-flex items-center justify-end gap-1.5 ml-auto">
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Make Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#333]">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Make Payment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white bg-transparent border-none cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleMakePayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-white/80 mb-1">Select Booking</label>
                <select
                  className="w-full p-3 border border-[#333] bg-[#111] text-white rounded-xl focus:ring-2 focus:ring-[#FACC15]/20 outline-none"
                  value={paymentForm.booking_id}
                  onChange={(e) => setPaymentForm({ ...paymentForm, booking_id: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a booking</option>
                  {activeBookings.map(b => (
                    <option key={b.booking_id} value={b.booking_id}>
                      {b.title} - LKR {Number(b.price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-1">Payment Type</label>
                <select
                  className="w-full p-3 border border-[#333] bg-[#111] text-white rounded-xl focus:ring-2 focus:ring-[#FACC15]/20 outline-none"
                  value={paymentForm.payment_type}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_type: e.target.value })}
                >
                  <option>First Month Rent</option>
                  <option>Monthly Rent</option>
                  <option>Security Deposit</option>
                  <option>Utility Bill</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-1">Amount (LKR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 15000"
                  className="w-full p-3 border border-[#333] bg-[#111] text-white rounded-xl focus:ring-2 focus:ring-[#FACC15]/20 outline-none placeholder-white/40"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-1">Payment Method</label>
                <select
                  className="w-full p-3 border border-[#333] bg-[#111] text-white rounded-xl focus:ring-2 focus:ring-[#FACC15]/20 outline-none"
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                >
                  <option>Visa ending in •••• 4242</option>
                  <option>Mastercard ending in •••• 8812</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#333] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#333] hover:bg-[#444] text-white/80 font-bold rounded-xl transition-colors border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-70 text-black font-bold rounded-xl shadow-sm transition-colors border-none cursor-pointer flex justify-center items-center gap-2"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
