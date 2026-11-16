import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getMyTickets, createTicket } from '../services/api';

// Help & Support for students and owners: send a ticket to the admin team
// and follow the status of earlier tickets.

const STATUS_STYLE = {
  open: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  in_progress: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  closed: 'bg-white/5 text-white/50 border-white/10',
};

const STATUS_LABEL = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#111] border border-[#333] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15]/50 transition-all text-[14px]';

const icon = (d) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
);

const Support = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState(null); // { ok, text }
  const [filter, setFilter] = useState('all');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setNotice({ ok: false, text: 'Please add a subject and a description.' });
      return;
    }
    setIsSubmitting(true);
    setNotice(null);
    try {
      await createTicket(subject.trim(), description.trim());
      setSubject('');
      setDescription('');
      await fetchTickets();
      setNotice({ ok: true, text: 'Ticket sent. Our team will review it and update the status below.' });
    } catch (err) {
      setNotice({ ok: false, text: err.message || 'Could not send your ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const counts = tickets.reduce((acc, t) => ({ ...acc, [t.status]: (acc[t.status] || 0) + 1 }), {});
  const shown = tickets.filter((t) => filter === 'all' || t.status === filter);

  // Quick help links, different for owners and students
  const quickLinks = isOwner
    ? [
        { to: '/faq', title: 'FAQ', text: 'Answers about listings, bookings and cash payments.', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { to: '/manage-reservations', title: 'Booking issue?', text: 'Approve, reject or check payment for a booking.', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { to: '/my-listings', title: 'Listing problem?', text: 'Edit photos, price or availability of a listing.', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      ]
    : [
        { to: '/faq', title: 'FAQ', text: 'Answers about searching, booking and paying on move-in.', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { to: '/my-bookings', title: 'Booking issue?', text: 'Check the status of your booking requests.', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { to: '/maintenance-portal', title: 'Repair needed?', text: 'Send a maintenance request to your owner.', d: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085' },
      ];

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans antialiased text-white">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold text-[#FACC15] uppercase tracking-wider mb-2">Help & Support</div>
          <h1 className="text-3xl font-extrabold tracking-tight">How can we help?</h1>
          <p className="text-white/50 mt-2 max-w-2xl">
            {isOwner
              ? 'Report a problem with your listings, bookings or account. Our admin team reviews every ticket.'
              : 'Report a problem with a booking, a listing or your account. Our admin team reviews every ticket.'}
          </p>
        </div>

        {/* Quick help */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="group bg-[#1A1A1A] border border-[#333] hover:border-[#FACC15]/40 rounded-2xl p-5 flex gap-4 items-start transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center shrink-0">{icon(q.d)}</div>
              <div className="min-w-0">
                <div className="font-bold text-white group-hover:text-[#FACC15] transition-colors">{q.title}</div>
                <div className="text-sm text-white/50 mt-0.5">{q.text}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* New ticket */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-3xl border border-[#333] p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-white">Create a ticket</h2>
            <p className="text-sm text-white/50 mt-1 mb-6">Tell us what went wrong and we'll get back to you.</p>

            {notice && (
              <div className={`mb-5 p-3.5 rounded-xl text-sm font-semibold border ${notice.ok ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {notice.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isOwner ? 'e.g. Listing photos not showing' : 'e.g. Owner has not replied to my booking'}
                  maxLength={150}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What happened, which listing or booking it's about, and when."
                  rows={6}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending…' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          {/* My tickets */}
          <div className="lg:col-span-3 bg-[#1A1A1A] rounded-3xl border border-[#333] overflow-hidden">
            <div className="p-6 sm:px-8 border-b border-[#333] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">My tickets</h2>
                <p className="text-sm text-white/50 mt-1">{tickets.length} total</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                      filter === s ? 'bg-[#FACC15] text-black border-[#FACC15]' : 'bg-transparent text-white/60 border-[#333] hover:text-white'
                    }`}
                  >
                    {s === 'all' ? 'All' : STATUS_LABEL[s]}
                    {s !== 'all' && counts[s] ? ` (${counts[s]})` : ''}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-white/50">Loading your tickets…</div>
            ) : shown.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#111] border border-[#333] text-white/40 flex items-center justify-center mb-4">
                  {icon('M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z')}
                </div>
                <div className="font-bold text-white">{tickets.length === 0 ? 'No tickets yet' : 'No tickets with this status'}</div>
                <p className="text-sm text-white/50 mt-1">
                  {tickets.length === 0 ? 'Tickets you send will appear here with their status.' : 'Try another filter.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#333]">
                {shown.map((t) => (
                  <div key={t.ticket_id} className="p-6 sm:px-8 hover:bg-[#222]/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bold text-white break-words min-w-0">{t.subject}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${STATUS_STYLE[t.status] || STATUS_STYLE.closed}`}>
                        {STATUS_LABEL[t.status] || t.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-2 break-words whitespace-pre-wrap line-clamp-3">{t.description}</p>
                    <div className="text-xs text-white/40 mt-3">
                      #{t.ticket_id} · Sent {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
