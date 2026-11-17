// Payment before arrival. There is no online gateway: the student pays the owner
// by bank transfer or cash, and the owner (or an admin) records each payment.
//
// Booking amount = first month's rent + security deposit.
//   Arrival within 3 days   → full amount by the day after arrival
//   Arrival in 4–5 days     → at least 20% by the day after arrival
//   Arrival 6+ days away    → at least 20% within 5 days of approval
// A booking is CONFIRMED once the required amount is paid; if the deadline
// passes first, the server cancels it automatically.
import React, { useState } from 'react';
import { addBookingPayment, deleteBookingPayment, getBookingPayments } from '../services/api';
import { todayISO } from '../utils/dates';

export const lkr = (n) => `LKR ${Number(n || 0).toLocaleString()}`;
const shortDate = (iso) => (iso ? new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const METHOD_LABEL = { cash: 'Cash', bank_transfer: 'Bank transfer', other: 'Other' };

/** Booking amount: first month's rent + deposit (stored when the booking was approved). */
export const moveInAmount = (b) =>
  Number(b?.booking_amount ?? b?.move_in_amount ?? (Number(b?.price ?? b?.monthly_rent ?? 0) + Number(b?.security_deposit ?? b?.price ?? b?.monthly_rent ?? 0)));

export const paidAmount = (b) => Number(b?.paid_amount || 0);
export const isPaid = (b) => b?.payment_status === 'paid';
export const deadlineOf = (b) => b?.payment_deadline_on || (typeof b?.payment_deadline === 'string' ? b.payment_deadline.slice(0, 10) : null);
/** Approved and the required amount (full or 20% advance) has been paid. */
export const isConfirmed = (b) =>
  b?.status === 'approved' && (isPaid(b) || (b?.required_amount != null && paidAmount(b) >= Number(b.required_amount)));

/** One-line description of what the student still has to pay, and by when. */
export const paymentDueText = (b) => {
  const total = moveInAmount(b);
  const deadline = deadlineOf(b);
  if (!deadline || b?.required_amount == null) return `${lkr(total)} due (first month + deposit)`;
  if (b.payment_plan === 'full') return `Pay ${lkr(total)} in full by ${shortDate(deadline)}`;
  return `Pay at least ${lkr(b.required_amount)} (20% advance) of ${lkr(total)} by ${shortDate(deadline)}`;
};

const pillCls = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap';

/** Status pill for students, owners and admins. */
export const PaymentBadge = ({ booking, className = '' }) => {
  if (!booking) return null;
  if (booking.status === 'rejected' && booking.rejection_reason === 'payment_overdue') {
    return <span className={`${pillCls} bg-red-500/15 text-red-400 border-red-500/30 ${className}`}>Cancelled · payment not received</span>;
  }
  if (booking.status !== 'approved') return null;

  const total = moveInAmount(booking);
  const paid = paidAmount(booking);
  if (isPaid(booking)) {
    return <span className={`${pillCls} bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ${className}`}>✓ Paid in full · {lkr(paid || total)}</span>;
  }
  if (isConfirmed(booking)) {
    return <span className={`${pillCls} bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ${className}`}>✓ Confirmed · paid {lkr(paid)} of {lkr(total)}</span>;
  }
  const deadline = deadlineOf(booking);
  const overdue = deadline && deadline < todayISO();
  return (
    <span className={`${pillCls} ${overdue ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'} ${className}`}>
      {overdue ? 'Payment overdue' : 'Awaiting payment'}
      {paid > 0 && ` · paid ${lkr(paid)}`}
      {deadline && booking.required_amount != null && ` · min ${lkr(booking.required_amount)} by ${shortDate(deadline)}`}
    </span>
  );
};

const inputCls = 'px-2.5 py-1.5 rounded-lg bg-black border border-white/20 text-white text-sm';

/**
 * Owner/admin control: record a payment (amount, date, method, reference),
 * see the payments recorded so far and remove one entered by mistake.
 * Calls onChange(updatedBooking) after each change.
 */
export const ConfirmCashButton = ({ booking, onChange }) => {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [payments, setPayments] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ amount: '', paid_on: todayISO(), method: 'bank_transfer', reference: '' });

  if (!booking || booking.status !== 'approved') return null;

  const total = moveInAmount(booking);
  const paid = paidAmount(booking);
  const balance = Math.max(0, total - paid);
  // Suggest what's still needed to confirm the booking, or the remaining balance
  const suggested = !isConfirmed(booking) && booking.required_amount != null
    ? Math.max(0, Number(booking.required_amount) - paid)
    : balance;

  const loadPayments = async () => {
    try { setPayments(await getBookingPayments(booking.booking_id)); } catch { setPayments([]); }
  };

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await addBookingPayment(booking.booking_id, { ...form, amount: Number(form.amount) });
      setOpen(false);
      onChange?.(res.booking);
      if (showHistory) loadPayments();
    } catch (err) {
      setError(err.message || 'Could not record the payment');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Remove the payment of ${lkr(p.amount)} on ${shortDate(p.paid_on)}?`)) return;
    setBusy(true);
    try {
      const res = await deleteBookingPayment(booking.booking_id, p.payment_id);
      onChange?.(res.booking);
      loadPayments();
    } catch (err) {
      alert(err.message || 'Could not remove the payment');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {balance > 0 && !open && (
          <button
            type="button"
            onClick={() => { setForm({ amount: String(suggested || balance), paid_on: todayISO(), method: 'bank_transfer', reference: '' }); setError(''); setOpen(true); }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 border-none cursor-pointer"
          >
            Record payment
          </button>
        )}
        {paid > 0 && (
          <button
            type="button"
            onClick={() => { const next = !showHistory; setShowHistory(next); if (next) loadPayments(); }}
            className="text-xs font-semibold text-white/50 hover:text-white underline bg-transparent border-none cursor-pointer"
          >
            {showHistory ? 'Hide payments' : 'Payments'}
          </button>
        )}
      </div>

      {open && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#111] border border-[#333] min-w-[260px]">
          <div className="text-[11px] text-white/50">Balance {lkr(balance)}{!isConfirmed(booking) && booking.required_amount != null ? ` · ${lkr(suggested)} more confirms the booking` : ''}</div>
          <div className="flex gap-2">
            <input type="number" min="1" max={balance} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={`${inputCls} w-28`} placeholder="Amount" />
            <input type="date" max={todayISO()} value={form.paid_on} onChange={(e) => setForm({ ...form, paid_on: e.target.value })} className={inputCls} style={{ colorScheme: 'dark' }} />
          </div>
          <div className="flex gap-2">
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputCls} style={{ colorScheme: 'dark' }}>
              <option value="bank_transfer">Bank transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
            <input type="text" maxLength={100} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className={`${inputCls} flex-1 min-w-0`} placeholder="Reference / slip no." />
          </div>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              disabled={busy || !form.amount || Number(form.amount) <= 0}
              onClick={save}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 border-none cursor-pointer disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save payment'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-white/50 hover:text-white bg-transparent border-none cursor-pointer">Cancel</button>
          </div>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}

      {showHistory && (
        <div className="w-full text-xs text-white/70 space-y-1">
          {payments === null ? 'Loading…' : payments.length === 0 ? 'No payments recorded.' : payments.map((p) => (
            <div key={p.payment_id} className="flex items-center justify-between gap-3 bg-[#111] border border-[#333] rounded-lg px-2.5 py-1.5">
              <span>
                <b className="text-white">{lkr(p.amount)}</b> · {shortDate(p.paid_on)} · {METHOD_LABEL[p.method] || p.method}
                {p.reference && <span className="text-white/40"> · {p.reference}</span>}
              </span>
              <button type="button" disabled={busy} onClick={() => remove(p)} className="text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
