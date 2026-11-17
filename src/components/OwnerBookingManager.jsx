import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBookingStatus, updateBookingStay, generateLease } from '../services/api';
import { todayISO } from '../utils/dates';

// Owner booking management: approve/decline requests, cancel bookings, and
// record when each student actually arrived and left. Recording "left" ends
// the stay that day, so the bed becomes free for new bookings.

const fmt = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

// One status for each booking, combining the booking status with the stay dates
const stayStatus = (b) => {
  if (b.status === 'pending') return { key: 'requests', label: 'Request', cls: 'bg-amber-500/20 text-amber-500' };
  if (b.status === 'rejected') return { key: 'closed', label: 'Declined', cls: 'bg-red-500/20 text-red-500' };
  if (b.status === 'cancelled') return { key: 'closed', label: 'Cancelled', cls: 'bg-slate-500/20 text-slate-400' };
  if (b.left_on) return { key: 'left', label: 'Left', cls: 'bg-white/10 text-white/60' };
  if (b.arrived_on) return { key: 'staying', label: 'Staying', cls: 'bg-[#10b981]/20 text-[#10b981]' };
  return { key: 'upcoming', label: 'Upcoming', cls: 'bg-sky-500/20 text-sky-400' };
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'requests', label: 'Requests' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'staying', label: 'Staying' },
  { key: 'left', label: 'Left' },
  { key: 'closed', label: 'Cancelled / Declined' },
];

const pill = 'px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer border-none whitespace-nowrap disabled:opacity-50';

// Date cell: shows the recorded date, or a "Mark" button that opens a date picker
const StayDateCell = ({ value, canSet, label, min, onSave, onUndo, busy }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayISO());

  if (value) {
    return (
      <div>
        <div className="font-semibold text-white">{fmt(value)}</div>
        {onUndo && (
          <button onClick={onUndo} disabled={busy} className="text-[11px] text-white/40 hover:text-white underline bg-transparent border-none cursor-pointer p-0 mt-0.5">
            Undo
          </button>
        )}
      </div>
    );
  }
  if (!canSet) return <span className="text-white/30">—</span>;
  if (!open) {
    return (
      <button onClick={() => { setDate(todayISO()); setOpen(true); }} className={`${pill} bg-[#FACC15]/15 text-[#FACC15] hover:bg-[#FACC15]/25`}>
        {label}
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="date"
        value={date}
        min={min || undefined}
        max={todayISO()}
        onChange={(e) => setDate(e.target.value)}
        className="bg-[#111] border border-[#333] rounded-lg px-2 py-1 text-xs text-white"
        style={{ colorScheme: 'dark' }}
      />
      <button onClick={async () => { if (await onSave(date)) setOpen(false); }} disabled={busy || !date} className={`${pill} bg-[#FACC15] text-black hover:bg-[#EAB308] px-2.5`}>Save</button>
      <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white bg-transparent border-none cursor-pointer text-sm">✕</button>
    </div>
  );
};

const OwnerBookingManager = ({ bookings, setBookings, loading }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const patch = (id, fields) => setBookings((prev) => prev.map((b) => (b.booking_id === id ? { ...b, ...fields } : b)));

  const changeStatus = async (b, status) => {
    const ask = {
      approved: `Approve ${b.seeker_name}'s booking for ${b.title}?`,
      rejected: `Decline ${b.seeker_name}'s booking request?`,
      cancelled: `Cancel ${b.seeker_name}'s booking for ${b.title}? The student is notified and the bed becomes free. This can't be undone.`,
    }[status];
    if (!window.confirm(ask)) return;
    setBusyId(b.booking_id);
    try {
      await updateBookingStatus(b.booking_id, status);
      patch(b.booking_id, { status });
    } catch (err) {
      alert(err.message || 'Could not update the booking.');
    } finally {
      setBusyId(null);
    }
  };

  const stay = async (b, action, date) => {
    setBusyId(b.booking_id);
    try {
      const { booking } = await updateBookingStay(b.booking_id, action, date);
      const toText = (d) => (d ? String(d).slice(0, 10) : null);
      patch(b.booking_id, { arrived_on: toText(booking.arrived_at), left_on: toText(booking.left_at) });
      return true;
    } catch (err) {
      alert(err.message || 'Could not save the date.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const lease = async (b) => {
    try {
      await generateLease(b.booking_id);
      patch(b.booking_id, { lease_status: 'pending' });
    } catch (err) {
      alert(err.message || 'Failed to generate lease. Maybe one already exists?');
    }
  };

  const counts = bookings.reduce((acc, b) => { const k = stayStatus(b).key; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  const shown = bookings.filter((b) => filter === 'all' || stayStatus(b).key === filter);

  return (
    <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-sm border border-[#333]">
      <div className="p-6 border-b border-[#333] bg-[#222] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-extrabold text-white">Manage Bookings</h3>
          <p className="text-sm text-white/60">Approve requests, record when students arrive and leave, or cancel a booking.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${filter === f.key ? 'bg-[#FACC15] text-black border-[#FACC15]' : 'bg-transparent text-white/60 border-[#333] hover:text-white'}`}
            >
              {f.label}{f.key !== 'all' && counts[f.key] ? ` (${counts[f.key]})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-[#111] text-white/60 text-[11px] uppercase tracking-wider font-bold">
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">Listing</th>
              <th className="px-5 py-4">Planned stay</th>
              <th className="px-5 py-4">Arrived</th>
              <th className="px-5 py-4">Left</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[14px] font-medium text-white">
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-10 text-center text-white/60">Loading bookings...</td></tr>
            ) : shown.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-10 text-center text-white/60">{bookings.length ? 'No bookings in this view.' : 'No bookings yet.'}</td></tr>
            ) : (
              shown.map((b) => {
                const st = stayStatus(b);
                const approved = b.status === 'approved';
                const busy = busyId === b.booking_id;
                return (
                  <tr key={b.booking_id} className="border-b border-[#333] hover:bg-[#222] transition-colors align-top">
                    <td className="px-5 py-4">
                      <div className="font-bold">{b.seeker_name}</div>
                      <div className="text-xs text-white/50 font-normal">{b.seeker_email}</div>
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {b.title}
                      <div className="text-xs text-[#FACC15] font-bold mt-0.5">LKR {Number(b.total_amount).toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-4 text-white/70 whitespace-nowrap">
                      {fmt(b.move_in_on)} → {fmt(b.move_out_on)}
                      <div className="text-xs text-white/40">{b.duration_months} month{Number(b.duration_months) === 1 ? '' : 's'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StayDateCell
                        value={b.arrived_on}
                        canSet={approved}
                        label="Mark arrived"
                        busy={busy}
                        onSave={(d) => stay(b, 'arrived', d)}
                        onUndo={approved && !b.left_on ? () => stay(b, 'undo_arrived') : null}
                      />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StayDateCell
                        value={b.left_on}
                        canSet={approved && !!b.arrived_on}
                        label="Mark left"
                        min={b.arrived_on}
                        busy={busy}
                        onSave={(d) => stay(b, 'left', d)}
                        onUndo={approved ? () => stay(b, 'undo_left') : null}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => changeStatus(b, 'approved')} disabled={busy} className={`${pill} bg-[#FACC15] text-black hover:bg-[#EAB308]`}>Approve</button>
                            <button onClick={() => changeStatus(b, 'rejected')} disabled={busy} className={`${pill} bg-red-500/20 text-red-500 hover:bg-red-500/40`}>Decline</button>
                          </>
                        )}
                        {approved && !b.lease_status && (
                          <button onClick={() => lease(b)} className={`${pill} bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/40`}>Generate Lease</button>
                        )}
                        {approved && b.lease_status && (
                          <button onClick={() => navigate(`/digital-lease?booking_id=${b.booking_id}`)} className={`${pill} bg-white/10 text-white hover:bg-white/20`}>
                            {b.lease_status === 'signed' ? 'View Lease' : 'Lease Pending'}
                          </button>
                        )}
                        {/* Cancel before the student arrives; once they've moved in, record "left" instead */}
                        {approved && !b.arrived_on && (
                          <button onClick={() => changeStatus(b, 'cancelled')} disabled={busy} className={`${pill} bg-red-500/15 text-red-400 hover:bg-red-500/30`}>Cancel booking</button>
                        )}
                        {!['pending', 'approved'].includes(b.status) && <span className="text-white/30">—</span>}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerBookingManager;
