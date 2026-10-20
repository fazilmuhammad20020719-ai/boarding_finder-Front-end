import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPaymentOrder } from '../services/api';

/**
 * Landing page after PayHere redirects back (return_url / cancel_url).
 * The redirect itself proves nothing — we show the status recorded by the
 * server from PayHere's signed notification, polling briefly while pending.
 */
const PaymentResult = ({ cancelled = false }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Missing order reference.');
      return;
    }
    let attempts = 0;
    let timer;
    const poll = async () => {
      try {
        const data = await getPaymentOrder(orderId);
        setOrder(data);
        // PayHere's notification can arrive a few seconds after the redirect
        if (data.status === 'pending' && !cancelled && attempts++ < 10) {
          timer = setTimeout(poll, 3000);
        }
      } catch (err) {
        setError(err.message || 'Could not load payment status.');
      }
    };
    poll();
    return () => clearTimeout(timer);
  }, [orderId, cancelled]);

  const status = error ? 'error' : !order ? 'loading' : order.status;
  const isSuccess = status === 'success';
  const isPending = status === 'pending' && !cancelled;
  const backLink = order?.purpose === 'promotion' ? '/owner-dashboard' : '/payment-history';

  const title = isSuccess ? 'Payment Successful'
    : isPending || status === 'loading' ? 'Confirming Payment...'
    : status === 'error' ? 'Something Went Wrong'
    : 'Payment Not Completed';

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white">
      <Navbar />
      <main className="flex items-center justify-center p-6 py-20">
        <div className="bg-[#1A1A1A] rounded-[24px] shadow-xl border border-[#333] p-10 max-w-md w-full text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isSuccess ? 'bg-[#10b981]/20 text-[#10b981]' : isPending || status === 'loading' ? 'bg-[#FACC15]/20 text-[#FACC15]' : 'bg-red-500/20 text-red-500'
          }`}>
            {isSuccess ? (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            ) : isPending || status === 'loading' ? (
              <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            ) : (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>

          <h1 className="text-3xl font-black mb-3">{title}</h1>

          {error && <p className="text-white/60 mb-6">{error}</p>}

          {order && (
            <div className="bg-[#111] rounded-xl p-4 mb-6 border border-[#333] text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-white/50">Order</span><span className="font-mono">{order.order_id}</span></div>
              {order.property_name && <div className="flex justify-between"><span className="text-white/50">Property</span><span className="font-semibold">{order.property_name}</span></div>}
              <div className="flex justify-between"><span className="text-white/50">For</span><span className="font-semibold">{order.payment_type}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Amount</span><span className="font-bold text-[#FACC15]">{order.currency} {Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            </div>
          )}

          {!isSuccess && !isPending && status !== 'loading' && (
            <p className="text-white/60 mb-6 text-sm">
              {cancelled ? 'You cancelled the payment. No money was taken.' : 'The payment was not completed. You can try again.'}
            </p>
          )}
          {isPending && order && (
            <p className="text-white/60 mb-6 text-sm">We're waiting for confirmation from PayHere. This usually takes a few seconds.</p>
          )}

          <Link to={backLink} className="block">
            <button className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors text-sm border-none cursor-pointer">
              {isSuccess ? 'Continue' : 'Back'}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PaymentResult;
