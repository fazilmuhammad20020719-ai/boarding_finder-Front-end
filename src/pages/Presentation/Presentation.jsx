import React, { useState, useEffect, useCallback } from 'react';
import './Presentation.css';

const TOTAL_SLIDES = 7;

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (animating || index < 0 || index >= TOTAL_SLIDES || index === current) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, current]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const progressPct = ((current + 1) / TOTAL_SLIDES) * 100;

  return (
    <div className="pres-root">
      {/* Progress */}
      <div className="pres-progress"><div className="pres-progress-fill" style={{ width: `${progressPct}%` }} /></div>

      {/* Counter */}
      <div className="pres-counter">{current + 1} / {TOTAL_SLIDES}</div>

      {/* Arrows */}
      {current > 0 && (
        <button className="pres-arrow pres-arrow-prev" onClick={prev}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      {current < TOTAL_SLIDES - 1 && (
        <button className="pres-arrow pres-arrow-next" onClick={next}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}

      {/* Dots */}
      <div className="pres-dots">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} className={`pres-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} />
        ))}
      </div>

      {/* ===================== SLIDES ===================== */}

      {/* SLIDE 1 — Introduction */}
      <div className={`pres-slide${current === 0 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o1" /><div className="orb o2" /><div className="orb o3" /></div>
        <div className="pres-body intro-body">
          <span className="pres-badge">Final Year Project Presentation</span>
          <h1 className="intro-title">Boarding<span className="grad">Finder</span></h1>
          <p className="intro-sub">A Smart Boarding Place Discovery &amp; Management Platform</p>

          <div className="intro-cards">
            <div className="intro-card"><div className="ic-icon">👨‍🎓</div><h3>Students</h3><p>Search, compare &amp; book verified boarding places near universities</p></div>
            <div className="intro-card"><div className="ic-icon">🏠</div><h3>Property Owners</h3><p>List, manage &amp; rent properties with powerful analytics tools</p></div>
            <div className="intro-card"><div className="ic-icon">🛡️</div><h3>Administrators</h3><p>Oversee platform operations, verify users &amp; moderate content</p></div>
          </div>

          <div className="tech-row">
            {['React.js','Node.js','Express.js','PostgreSQL','JWT Auth','CSRF Protection'].map(t => <span key={t} className="tech-tag">{t}</span>)}
          </div>
        </div>
      </div>

      {/* SLIDE 2 — Problem Statement */}
      <div className={`pres-slide${current === 1 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o4" /><div className="orb o5" /></div>
        <div className="pres-body">
          <span className="sec-num">02</span>
          <h2 className="sec-title">Problem <span className="grad">Statement</span></h2>

          <div className="prob-grid">
            <div className="prob-col">
              <div className="prob-head"><span className="prob-ico">👨‍🎓</span><h3>Student Challenges</h3></div>
              <ul className="prob-list">
                <li><span className="dot red" />No centralized platform — relying on word of mouth &amp; social media</li>
                <li><span className="dot red" />Cannot verify legitimacy of properties or owners before committing</li>
                <li><span className="dot red" />Safety concerns — no reviews, ratings, or neighborhood info</li>
                <li><span className="dot red" />No formal booking, lease, or payment tracking — leading to disputes</li>
                <li><span className="dot red" />Time &amp; money wasted physically visiting multiple locations</li>
              </ul>
            </div>
            <div className="prob-col">
              <div className="prob-head"><span className="prob-ico">🏠</span><h3>Owner Challenges</h3></div>
              <ul className="prob-list">
                <li><span className="dot orange" />No efficient digital tool to list and manage properties</li>
                <li><span className="dot orange" />Difficulty reaching tenants beyond local advertising</li>
                <li><span className="dot orange" />No system to track bookings, payments, or maintenance</li>
                <li><span className="dot orange" />Manual lease agreements — time-consuming and error-prone</li>
              </ul>
              <div className="prob-head" style={{ marginTop: '1.2rem' }}><span className="prob-ico">🌐</span><h3>Market Gap</h3></div>
              <ul className="prob-list">
                <li><span className="dot yellow" />Existing platforms are generic, not tailored for student boarding</li>
                <li><span className="dot yellow" />No community features, roommate matching, or verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 3 — Proposed Solution */}
      <div className={`pres-slide${current === 2 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o1" /><div className="orb o6" /></div>
        <div className="pres-body">
          <span className="sec-num">03</span>
          <h2 className="sec-title">Proposed <span className="grad">Solution</span></h2>

          <div className="sol-grid">
            {[
              { n: '01', t: 'Smart Search & Discovery', items: ['Advanced filters (location, price, amenities)', 'Interactive map view with markers', 'Neighborhood details & safety info', 'Side-by-side listing comparison'] },
              { n: '02', t: 'Secure User Verification', items: ['Email OTP verification', 'Identity document upload & admin review', 'Status tracking (Pending → Verified)'] },
              { n: '03', t: 'End-to-End Booking', items: ['Booking requests with dates & messages', 'Owner approve/reject workflow', 'Digital lease generation & e-signing', 'Payment processing & transaction history'] },
              { n: '04', t: 'Communication & Community', items: ['Real-time messaging system', 'Community forum with posts & comments', 'Roommate matching system', 'Review & rating system'] },
              { n: '05', t: 'Owner Management Tools', items: ['Analytics dashboard (revenue, occupancy)', 'Calendar & availability management', 'Maintenance request tracking', 'Earnings ledger & payment records'] },
              { n: '06', t: 'Admin Control Panel', items: ['Platform-wide analytics & reporting', 'User verification & moderation', 'Listing approval workflow', 'Broadcast announcements & settings'] },
            ].map(c => (
              <div className="sol-card" key={c.n}>
                <span className="sol-num">{c.n}</span>
                <h4>{c.t}</h4>
                <ul>{c.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLIDE 4 — Project Objectives */}
      <div className={`pres-slide${current === 3 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o2" /><div className="orb o5" /></div>
        <div className="pres-body">
          <span className="sec-num">04</span>
          <h2 className="sec-title">Project <span className="grad">Objectives</span></h2>

          <div className="obj-section">
            <h3 className="obj-group-label primary-label">Primary Objectives</h3>
            {[
              'Develop a centralized web-based platform connecting students seeking boarding accommodations with verified property owners.',
              'Provide a secure and trustworthy environment through multi-level user verification (email OTP, document upload, admin approval).',
              'Digitize the entire boarding lifecycle — from searching and booking to lease signing and payments.',
            ].map((txt, i) => (
              <div className="obj-item primary" key={i}><div className="obj-num">{i + 1}</div><p>{txt}</p></div>
            ))}

            <h3 className="obj-group-label secondary-label">Secondary Objectives</h3>
            <div className="obj-sec-grid">
              {[
                'Empower owners with digital tools for listing management, booking control, and financial tracking.',
                'Build community-driven features with forums, roommate matching, reviews, and ratings.',
                'Provide administrators with comprehensive tools for governance, moderation, and management.',
                'Ensure data security through JWT auth, CSRF protection, validation, and role-based access.',
                'Deliver a responsive, modern, and user-friendly interface across all devices.',
              ].map((txt, i) => (
                <div className="obj-item secondary" key={i}><div className="obj-num sec">{i + 4}</div><p>{txt}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 5 — Functional Requirements */}
      <div className={`pres-slide${current === 4 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o3" /><div className="orb o4" /></div>
        <div className="pres-body">
          <span className="sec-num">05</span>
          <h2 className="sec-title">Functional <span className="grad">Requirements</span></h2>

          <div className="fr-grid">
            {[
              { id: 'FR-01', t: 'Registration & Auth', d: 'Role-specific registration, email OTP, JWT login, forgot/reset password' },
              { id: 'FR-02', t: 'Identity Verification', d: 'Document upload, admin review & approval, verification status tracking' },
              { id: 'FR-03', t: 'Listing Management', d: 'Create, edit, pause, duplicate, delete listings with photo upload & analytics' },
              { id: 'FR-04', t: 'Search & Discovery', d: 'Filters, map view, neighborhood details, side-by-side comparison' },
              { id: 'FR-05', t: 'Booking System', d: 'Submit requests, approve/reject, status tracking (pending/approved/rejected)' },
              { id: 'FR-06', t: 'Digital Lease', d: 'Auto-generated lease agreements, digital e-signing, terms & conditions' },
              { id: 'FR-07', t: 'Payment System', d: 'Mock payments, transaction IDs, payment history & owner earnings ledger' },
              { id: 'FR-08', t: 'Messaging', d: 'Inbox-style messaging, conversation threads, read/unread indicators' },
              { id: 'FR-09', t: 'Reviews & Ratings', d: 'Star ratings (1-5), text reviews, average calculation, admin moderation' },
              { id: 'FR-10', t: 'Maintenance Requests', d: 'Submit tickets, owner status updates, automated notifications' },
              { id: 'FR-11', t: 'Community Forum', d: 'Create posts, comment, upvote, category filters, search' },
              { id: 'FR-12', t: 'Roommate Matcher', d: 'Profile creation, budget & preference matching, browse matches' },
              { id: 'FR-13', t: 'Notifications', d: 'In-app alerts, mark read, delete, admin broadcast announcements' },
              { id: 'FR-14', t: 'Calendar Management', d: 'Booking calendar view, manual date blocking, block reasons' },
              { id: 'FR-15', t: 'Admin Dashboard', d: 'Platform analytics, user/listing/booking/review moderation, settings' },
              { id: 'FR-16', t: 'Saved Listings', d: 'Save/favorite listings, dedicated saved homes page' },
              { id: 'FR-17', t: 'Support Tickets', d: 'Submit support issues with subject & description, status tracking' },
              { id: 'FR-18', t: 'Report System', d: 'Report inappropriate listings with reason selection modal' },
            ].map(fr => (
              <div className="fr-card" key={fr.id}>
                <span className="fr-id">{fr.id}</span>
                <h4>{fr.t}</h4>
                <p>{fr.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLIDE 6 — Non-Functional Requirements */}
      <div className={`pres-slide${current === 5 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o6" /><div className="orb o1" /></div>
        <div className="pres-body">
          <span className="sec-num">06</span>
          <h2 className="sec-title">Non-Functional <span className="grad">Requirements</span></h2>

          <div className="nfr-grid">
            {[
              { icon: '🔒', t: 'Security', items: ['JWT token authentication', 'CSRF protection middleware', 'bcrypt password hashing', 'Input validation & XSS sanitization', 'Role-based access control'] },
              { icon: '⚡', t: 'Performance', items: ['Database indexing on key columns', 'Optimized SQL with JOINs', 'File upload size limits (5MB)'] },
              { icon: '🎨', t: 'Usability', items: ['Modern responsive React UI', 'Role-based navigation menus', 'Clear error messages & validation', 'Consistent design language'] },
              { icon: '🛡️', t: 'Reliability', items: ['Global error handler', 'Graceful DB failure handling', 'Auto-migration on startup'] },
              { icon: '📈', t: 'Scalability', items: ['Modular MVC-like architecture', 'PostgreSQL connection pooling', 'Stateless API design'] },
              { icon: '🔧', t: 'Maintainability', items: ['Clean directory structure', 'Separation of concerns', 'Environment-based .env config'] },
              { icon: '🌐', t: 'Availability', items: ['Multi-origin CORS support', 'PM2 auto-restart on failure'] },
              { icon: '🗄️', t: 'Data Integrity', items: ['Foreign keys & cascading deletes', 'Unique constraints', 'CHECK constraints on fields'] },
            ].map(nfr => (
              <div className="nfr-card" key={nfr.t}>
                <div className="nfr-icon">{nfr.icon}</div>
                <h4>{nfr.t}</h4>
                <ul>{nfr.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLIDE 7 — Conclusion */}
      <div className={`pres-slide${current === 6 ? ' active' : ''}`}>
        <div className="pres-orbs"><div className="orb o2" /><div className="orb o3" /><div className="orb o5" /></div>
        <div className="pres-body conclusion-body">
          <span className="sec-num">07</span>
          <h2 className="sec-title">Conclusion</h2>

          <div className="concl-summary">
            <p>BoardingFinder successfully delivers a <strong>comprehensive, secure, and user-friendly platform</strong> that digitizes the entire student boarding accommodation lifecycle.</p>
          </div>

          <div className="achieve-grid">
            {[
              'Fully functional three-role system with distinct dashboards',
              'End-to-end workflow: discovery → booking → lease → payment',
              'Strong security: JWT, CSRF, OTP, role-based access control',
              'Community features: forums, roommate matching, reviews',
              'Comprehensive admin tools for governance & moderation',
            ].map((a, i) => (
              <div className="achieve-item" key={i}><span className="achieve-check">✓</span><p>{a}</p></div>
            ))}
          </div>

          <div className="future-section">
            <h3>Future Enhancements</h3>
            <div className="future-tags">
              {['💳 Real Payment Gateways','🤖 AI Roommate Matching','📱 Mobile App','💬 WebSocket Chat','📊 Predictive Analytics'].map(f => <span key={f} className="future-tag">{f}</span>)}
            </div>
          </div>

          <div className="thank-you">
            <h2>Thank You</h2>
            <p>Questions &amp; Answers</p>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="pres-hint">Use <kbd>←</kbd> <kbd>→</kbd> arrow keys to navigate</div>
    </div>
  );
}
