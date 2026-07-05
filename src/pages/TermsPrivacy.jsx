import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPrivacy = () => {
  const [activeSection, setActiveSection] = useState('terms');

  // Handle smooth scrolling when clicking sidebar links
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Account for fixed headers if any
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Optional: Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['terms', 'privacy', 'refunds', 'data'];
      const scrollPosition = window.scrollY + 200; // Offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] flex flex-col">
      <Navbar isLoggedIn={false} activeTab="" />

      {/* Hero Header */}
      <div className="bg-[#0f172a] py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">Legal & Privacy</h1>
        <p className="text-slate-400 max-w-xl mx-auto px-6">
          Everything you need to know about our terms of service, how we handle your data, and our policies. Last updated on July 1, 2025.
        </p>
      </div>

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 md:px-8 py-12 flex flex-col md:flex-row gap-12">
        
        {/* Sticky Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-8 bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]/60">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contents</h3>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('terms')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border-none ${activeSection === 'terms' ? 'bg-[#ebf3ff] text-[#1952c4]' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
              >
                1. Terms of Service
              </button>
              <button 
                onClick={() => scrollToSection('privacy')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border-none ${activeSection === 'privacy' ? 'bg-[#ebf3ff] text-[#1952c4]' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
              >
                2. Privacy Policy
              </button>
              <button 
                onClick={() => scrollToSection('refunds')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border-none ${activeSection === 'refunds' ? 'bg-[#ebf3ff] text-[#1952c4]' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
              >
                3. Refund Policy
              </button>
              <button 
                onClick={() => scrollToSection('data')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border-none ${activeSection === 'data' ? 'bg-[#ebf3ff] text-[#1952c4]' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
              >
                4. User Data & Deletion
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e2e8f0]/60 prose prose-slate max-w-none">
          
          <section id="terms" className="mb-16 scroll-mt-8">
            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-6 pb-4 border-b border-slate-200">1. Terms of Service</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Welcome to BoardingFinder. By accessing our platform, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
            </p>
            <h4 className="text-lg font-bold text-[#0f172a] mt-6 mb-3">1.1 User Responsibilities</h4>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
              <li>You must be at least 18 years old or a registered university student to use this service.</li>
              <li>You are responsible for maintaining the confidentiality of your account information.</li>
              <li>Any information you provide, including property details or personal information, must be accurate and up-to-date.</li>
            </ul>
            <h4 className="text-lg font-bold text-[#0f172a] mt-6 mb-3">1.2 Prohibited Activities</h4>
            <p className="text-slate-600 leading-relaxed">
              Users are strictly prohibited from posting fraudulent listings, engaging in discriminatory practices, or using the platform to conduct any illegal activities. BoardingFinder reserves the right to suspend or terminate accounts that violate these terms without prior notice.
            </p>
          </section>

          <section id="privacy" className="mb-16 scroll-mt-8">
            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-6 pb-4 border-b border-slate-200">2. Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your privacy is critically important to us. This policy outlines how we collect, use, and protect your personal information.
            </p>
            <h4 className="text-lg font-bold text-[#0f172a] mt-6 mb-3">2.1 Information We Collect</h4>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect information you provide directly to us when you create an account, update your profile, or communicate with other users. This includes your name, email address, phone number, and university details.
            </p>
            <h4 className="text-lg font-bold text-[#0f172a] mt-6 mb-3">2.2 How We Use Your Information</h4>
            <p className="text-slate-600 leading-relaxed">
              We use the collected data to provide, maintain, and improve our services. We do not sell your personal data to third parties. We may share necessary details with property owners strictly for the purpose of facilitating your booking.
            </p>
          </section>

          <section id="refunds" className="mb-16 scroll-mt-8">
            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-6 pb-4 border-b border-slate-200">3. Refund Policy</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We understand that plans change. Our standard refund policy aims to be fair to both students and property owners.
            </p>
            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200 mb-6">
              <h4 className="font-bold text-[#0f172a] mb-2">Standard Cancellation Timeline</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Within 48 hours of booking</span>
                  <span className="font-bold text-[#10b981]">100% Refund</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>14+ days before move-in</span>
                  <span className="font-bold text-[#0f172a]">Full Deposit Refund (minus fees)</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Less than 14 days before move-in</span>
                  <span className="font-bold text-red-500">Non-refundable Deposit</span>
                </li>
              </ul>
            </div>
          </section>

          <section id="data" className="scroll-mt-8">
            <h2 className="text-2xl font-extrabold text-[#0f172a] mb-6 pb-4 border-b border-slate-200">4. User Data & Deletion</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Under the GDPR and local privacy laws, you have the right to request a copy of your data or ask for your account to be permanently deleted.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              You can initiate an account deletion from your Account Settings page. Upon deletion, all your personal data, saved homes, and booking history will be permanently erased from our active servers within 30 days.
            </p>
            
            <div className="mt-8 p-6 bg-[#ebf3ff] rounded-2xl border border-[#1952c4]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#1952c4]">Need to contact our legal team?</h4>
                <p className="text-sm text-[#1952c4]/80 mt-1">For specific privacy concerns, reach out to us directly.</p>
              </div>
              <button className="px-6 py-2.5 bg-white text-[#1952c4] font-bold rounded-xl shadow-sm border-none cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap">
                Email Legal Team
              </button>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPrivacy;
