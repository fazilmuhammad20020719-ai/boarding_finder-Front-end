import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ContactUs = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Logged-in users go to the ticketed support centre; guests sign in first
  const handleLiveSupport = () => navigate(isAuthenticated ? '/support' : '/login');

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white flex flex-col">
      <Navbar activeTab="contact" />

      <main className="flex-grow pt-16 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-white/70 text-lg font-medium max-w-xl mx-auto">
            Have a question, feedback, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

          {/* Contact Information */}
            <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-sm border border-[#333]">
              <h3 className="text-xl font-extrabold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white/50 mb-1">Email</div>
                    <div className="text-white font-semibold">support@boardingfinder.lk</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white/50 mb-1">Phone</div>
                    <div className="text-white font-semibold">+94 25 226 6512</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#9333ea]/10 text-[#9333ea] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white/50 mb-1">Address</div>
                    <div className="text-white font-semibold">Rajarata University of Sri Lanka,<br />Mihintale, Anuradhapura</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-[#111] border border-[#333] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FACC15]/10 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Need Immediate Help?</h3>
              <p className="text-white/50 text-sm font-medium mb-6 relative z-10">Our support team is available 24/7 to help you with booking emergencies.</p>
              <button onClick={handleLiveSupport} className="bg-[#FACC15] text-black w-full py-3 rounded-xl font-bold text-sm hover:bg-[#EAB308] transition-colors cursor-pointer border-none shadow-sm relative z-10">
                Contact Support
              </button>
            </div>
        </div>

      </main>
    </div>
  );
};

export default ContactUs;
