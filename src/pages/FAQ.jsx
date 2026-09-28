import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#333] rounded-2xl mb-4 bg-[#1A1A1A] overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center bg-transparent border-none cursor-pointer group"
      >
        <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-[#FACC15]' : 'text-white group-hover:text-[#FACC15]'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-[#FACC15]/10 text-[#FACC15] rotate-180' : 'bg-[#111] text-white/40 group-hover:bg-[#FACC15]/10 group-hover:text-[#FACC15]'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>
      <div 
        className={`px-6 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-white/70 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = {
    students: [
      {
        q: "How do I book a boarding house?",
        a: "Booking is simple! Once you find a property you like, click the 'Apply' or 'Book' button. You'll need to fill out a brief application form. The owner will review it, and once approved, you can complete your payment to secure the room."
      },
      {
        q: "Are the utility bills included in the rent?",
        a: "It depends on the property. Some owners include water and electricity in the monthly rent, while others have separate meters. Always check the 'Amenities & Rules' section on the listing page to be sure."
      },
      {
        q: "What happens if I need to cancel my booking?",
        a: "Cancellations made within 48 hours of booking are fully refundable. After that, cancellation policies vary by owner. Usually, you may lose a portion of your security deposit. Please review the specific property's cancellation policy before booking."
      },
      {
        q: "Can I visit the property before paying?",
        a: "Yes! We strongly encourage scheduling a visit. You can use the 'Contact Owner' button to message the owner directly and arrange a suitable time to view the property in person."
      }
    ],
    owners: [
      {
        q: "How much does it cost to list a property?",
        a: "Listing your property on BoardingFinder is currently free! We only take a small service fee (3%) when a booking is successfully completed through our platform."
      },
      {
        q: "How do I get paid?",
        a: "Once a student completes their booking and moves in, the funds are held safely by our system for 24 hours. After that, they are transferred directly to your linked bank account."
      },
      {
        q: "Can I reject an applicant?",
        a: "Absolutely. As an owner, you have full control over who stays at your property. You can review a student's profile and message them before deciding to approve or reject their application."
      }
    ]
  };

  const filteredFaqs = faqs[activeCategory].filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black font-sans antialiased text-white flex flex-col">
      <Navbar activeTab="" />

      {/* Hero Section */}
      <div className="bg-[#111] border-b border-[#333] py-16 text-center relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FACC15]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">How can we help?</h1>
          
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-2xl pl-12 pr-4 py-4 text-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/20 focus:border-[#FACC15] shadow-lg transition-all"
            />
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-12">
        
        {/* Category Toggles */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#111] border border-[#333] p-1 rounded-2xl inline-flex shadow-inner">
            <button 
              onClick={() => setActiveCategory('students')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all border-none cursor-pointer ${
                activeCategory === 'students' 
                  ? 'bg-[#FACC15] text-black shadow-sm' 
                  : 'bg-transparent text-white/50 hover:text-white'
              }`}
            >
              For Students
            </button>
            <button 
              onClick={() => setActiveCategory('owners')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all border-none cursor-pointer ${
                activeCategory === 'owners' 
                  ? 'bg-[#FACC15] text-black shadow-sm' 
                  : 'bg-transparent text-white/50 hover:text-white'
              }`}
            >
              For Owners
            </button>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} />
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-[#333] mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
              <p className="text-white/50">We couldn't find any questions matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Contact Support Block */}
        <div className="mt-16 bg-[#111] border border-[#333] rounded-3xl p-8 text-center">
          <h3 className="text-xl font-extrabold text-[#FACC15] mb-3">Still have questions?</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">If you couldn't find what you're looking for, our support team is ready to help you out.</p>
          <button className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-8 py-3 rounded-xl font-bold transition-colors border-none cursor-pointer shadow-sm">
            Contact Support
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
