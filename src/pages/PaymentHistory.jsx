import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const mockPayments = [
  {
    id: "TXN-8472910",
    date: "Jul 01, 2025",
    property: "BlueSky Residences",
    type: "Monthly Rent",
    amount: "Rs. 15,000",
    method: "Visa ending in •••• 4242",
    status: "Completed"
  },
  {
    id: "TXN-8472855",
    date: "Jun 01, 2025",
    property: "BlueSky Residences",
    type: "Monthly Rent",
    amount: "Rs. 15,000",
    method: "Visa ending in •••• 4242",
    status: "Completed"
  },
  {
    id: "TXN-8472512",
    date: "May 28, 2025",
    property: "BlueSky Residences",
    type: "Security Deposit",
    amount: "Rs. 30,000",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    id: "TXN-8472511",
    date: "May 28, 2025",
    property: "BlueSky Residences",
    type: "First Month Rent",
    amount: "Rs. 15,000",
    method: "Bank Transfer",
    status: "Completed"
  },
  {
    id: "TXN-8471102",
    date: "Dec 15, 2024",
    property: "Green Valley Dorms",
    type: "Booking Reservation",
    amount: "Rs. 5,000",
    method: "Mastercard ending in •••• 1234",
    status: "Refunded"
  }
];

const PaymentHistory = () => {
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
      case 'Pending': return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'Refunded': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col">
      <Navbar isLoggedIn={true} activeTab="" />

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Payment History</h1>
            <p className="text-slate-500 mt-2">View and download your past transaction receipts.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1952c4] hover:bg-[#1546a8] text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer text-sm border-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e2e8f0]/60">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Paid (This Year)</div>
            <div className="text-3xl font-black text-[#0f172a]">Rs. 75,000</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e2e8f0]/60">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Next Payment Due</div>
            <div className="text-3xl font-black text-[#f59e0b]">Rs. 15,000</div>
            <div className="text-sm font-semibold text-slate-500 mt-1">Due on Aug 01, 2025</div>
          </div>
          <div className="bg-[#1952c4] p-6 rounded-2xl shadow-sm border border-[#1952c4] text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="text-sm font-bold text-white/70 uppercase tracking-wider mb-2">Active Payment Method</div>
            <div className="text-xl font-bold flex items-center gap-3">
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#1A1F71"/><path d="M12.986 16.963h2.646l1.677-10.42h-2.646l-1.677 10.42zm11.396-10.2c-.417-.193-1.077-.4-1.855-.4-2.023 0-3.447 1.055-3.46 2.565-.022 1.114 1.026 1.737 1.804 2.115.795.385 1.062.632 1.062.977 0 .53-.65.772-1.25.772-.828 0-1.272-.124-1.954-.424l-.275-.128-.37 2.268c.484.22 1.385.412 2.316.42 2.164 0 3.56-1.045 3.585-2.665.01-1.348-1.253-1.84-1.84-2.12-.705-.347-1.14-.58-1.14-.932 0-.494.55-.785 1.206-.785.668 0 1.142.14 1.52.298l.183.085.47-2.146zm-9.395 10.2h2.825c.348 0 .65-.198.78-.507l3.32-8.543-1.202-1.37h-2.11c-.33 0-.61.137-.744.43L12.572 16.96h-2.585zm-2.88-10.155l-2.035 6.94-1.03-5.58c-.147-.648-.718-1.36-1.353-1.36H.488l-.066.304c1.28.274 2.73.93 3.614 1.638l3.18 8.058 2.65-10h-2.126z" fill="#fff"/></svg>
              •••• 4242
            </div>
            <button className="mt-3 text-xs font-bold text-white hover:text-white/80 transition-colors border-none bg-transparent cursor-pointer p-0">Update Method</button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-5 bg-slate-50 border-b border-[#e2e8f0]/60 font-bold text-xs text-slate-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="p-5 bg-slate-50 border-b border-[#e2e8f0]/60 font-bold text-xs text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="p-5 bg-slate-50 border-b border-[#e2e8f0]/60 font-bold text-xs text-slate-400 uppercase tracking-wider">Details</th>
                  <th className="p-5 bg-slate-50 border-b border-[#e2e8f0]/60 font-bold text-xs text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="p-5 bg-slate-50 border-b border-[#e2e8f0]/60 font-bold text-xs text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 bg-slate-50 border-b border-[#e2e8f0]/60 font-bold text-xs text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {mockPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-[#0f172a] text-sm">{payment.id}</td>
                    <td className="p-5 font-medium text-slate-500 text-sm">{payment.date}</td>
                    <td className="p-5">
                      <div className="font-bold text-[#0f172a] text-sm">{payment.type}</div>
                      <div className="font-medium text-slate-500 text-xs">{payment.property}</div>
                    </td>
                    <td className="p-5 font-extrabold text-[#0f172a]">{payment.amount}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {payment.status === 'Completed' && (
                        <button className="text-[#1952c4] hover:text-[#1546a8] font-bold text-sm bg-transparent border-none cursor-pointer p-2 hover:bg-[#ebf3ff] rounded-lg transition-colors flex items-center justify-end gap-1.5 ml-auto">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Mock) */}
          <div className="p-5 border-t border-[#e2e8f0]/60 flex items-center justify-between text-sm">
            <div className="text-slate-500 font-medium">Showing 1 to 5 of 12 entries</div>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] text-slate-400 bg-white cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1952c4] bg-[#1952c4] text-white font-bold cursor-pointer">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] text-slate-600 bg-white hover:bg-slate-50 cursor-pointer transition-colors font-bold">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] text-slate-600 bg-white hover:bg-slate-50 cursor-pointer transition-colors font-bold">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] text-slate-600 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

        </div>
        
      </main>
    </div>
  );
};

export default PaymentHistory;
