// Cash on Move-in: one payment per approved booking, confirmed by the owner.
// No online payment and no monthly rent tracking.
import React, { useState } from 'react';
import { setBookingPayment } from '../services/api';

const lkr = (n) => `LKR ${Number(n || 0).toLocaleString()}`;

/** Amount the student brings on move-in: first month's rent + security deposit. */
export const moveInAmount = (b) =>
  Number(b?.move_in_amount ?? (Number(b?.price ?? b?.monthly_rent ?? 0) + Number(b?.security_deposit ?? b?.price ?? b?.monthly_rent ?? 0)));

export const isPaid = (b) => b?.payment_status === 'paid';

/** Status pill shown to students, owners and admins. Only for approved bookings. */
export const PaymentBadge = ({ booking, className = '' }) => {
  if (!booking || booking.status !== 'approved') return null;
  if (isPaid(booking)) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}>
        ✓ Paid {lkr(booking.paid_amount)}
        {booking.paid_at && <span className="font-medium text-emerald-400/70">· {new Date(booking.paid_at).toLocaleDateString()}</span>}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}>
      Cash on move-in · {lkr(moveInAmount(booking))} due
    </span>
  );
};

/**
 * Owner/admin control: "Mark cash received" (with the amount, prefilled) and
 * "Undo" once paid. Calls onChange(updatedBooking) after saving.
 */
export const ConfirmCashButton = ({ booking, onChange }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(moveInAmount(booking)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!booking || booking.status !== 'approved') return null;

  const save = async (paid) => {
    setBusy(true);
    setError('');
    try {
      const res = await setBookingPayment(booking.booking_id, paid, paid ? Number(amount) : undefined);
      setOpen(false);
      onChange?.(res.booking);
    } catch (err) {
      setError(err.message || 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  if (isPaid(booking)) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => { if (window.confirm('Mark this move-in payment as NOT received?')) save(false); }}
        className="text-xs font-semibold text-white/50 hover:text-white underline bg-transparent border-none cursor-pointer disabled:opacity-50"
      >
        Undo payment
      </button>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 border-none cursor-pointer"
      >
        Mark cash received
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-white/60">Amount received (LKR)</span>
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-28 px-2 py-1 rounded-lg bg-black border border-white/20 text-white text-sm"
      />
      <button
        type="button"
        disabled={busy || amount === '' || Number(amount) < 0}
        onClick={() => save(true)}
        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 border-none cursor-pointer disabled:opacity-50"
      >
        {busy ? 'Saving…' : 'Confirm'}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-white/50 hover:text-white bg-transparent border-none cursor-pointer"
      >
        Cancel
      </button>
      {error && <span className="w-full text-xs text-red-400">{error}</span>}
    </div>
  );
};
