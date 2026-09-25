import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyTickets, createTicket } from '../services/api';

const Support = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !description) {
            alert("Subject and description are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createTicket(subject, description);
            setSubject('');
            setDescription('');
            await fetchTickets();
            alert("Ticket submitted successfully! Support will review it shortly.");
        } catch (err) {
            alert(err.message || 'Failed to submit ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold text-white mb-2">Support & Help Center</h1>
            <p className="text-white/60 mb-10">Submit a bug report, complaint, or ask for help. Our team is here for you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Create Ticket Form */}
                <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#333] shadow-sm">
                    <h2 className="text-xl font-bold text-white mb-6">Create New Ticket</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-white/60 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Brief description of the issue"
                                className="w-full bg-[#111] text-white border border-[#333] rounded-xl p-3 focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15]/30 transition-all outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white/60 mb-2">Detailed Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide as much detail as possible..."
                                className="w-full bg-[#111] text-white border border-[#333] rounded-xl p-3 h-32 resize-none focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15]/30 transition-all outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </form>
                </div>

                {/* Previous Tickets */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6">Your Previous Tickets</h2>

                    {loading ? (
                        <div className="text-white/60">Loading tickets...</div>
                    ) : tickets.length === 0 ? (
                        <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#333] text-center text-white/60">
                            You haven't submitted any tickets yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map(ticket => (
                                <div key={ticket.ticket_id} className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#333] flex flex-col gap-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-bold text-white break-words">{ticket.subject}</h3>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider whitespace-nowrap ${ticket.status === 'open' ? 'bg-amber-500/20 text-amber-500' :
                                                ticket.status === 'in_progress' ? 'bg-[#60a5fa]/20 text-[#60a5fa]' :
                                                    ticket.status === 'resolved' ? 'bg-[#10b981]/20 text-[#10b981]' :
                                                        'bg-[#333] text-white/60'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/70 line-clamp-2 break-words">{ticket.description}</p>
                                    <div className="text-xs text-white/40 mt-1">Submitted on {new Date(ticket.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Support;
