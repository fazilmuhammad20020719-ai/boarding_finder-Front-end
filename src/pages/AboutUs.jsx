import React from 'react';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-[#0f172a] flex flex-col">
      <Navbar isLoggedIn={true} activeTab="about" />

      <main className="flex-grow pt-16 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ebf3ff] text-[#1952c4] text-xs font-bold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Connecting Students with Safe, Affordable Housing.
          </h1>
          <p className="text-[#475569] text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            BoardingFinder was created with a single goal: to simplify the process of finding verified student accommodation across Sri Lanka, giving peace of mind to both students and parents.
          </p>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#e2e8f0]/60 relative h-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
              alt="Students collaborating" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-white text-2xl font-bold mb-2">Built by students, for students.</div>
              <div className="text-white/80 font-medium">We understand the struggle because we lived it.</div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] mb-3">The Problem</h2>
              <p className="text-[#475569] font-medium leading-relaxed">
                Every year, thousands of university students struggle to find decent boarding houses. They rely on word-of-mouth, outdated social media posts, and physical signboards. This process is exhausting, unsafe, and often leads to scams or poor living conditions.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-extrabold text-[#1952c4] mb-3">Our Solution</h2>
              <p className="text-[#475569] font-medium leading-relaxed">
                We built a centralized platform where property owners can easily list their spaces, and students can search, filter, and book verified accommodations securely. We prioritize transparency with reviews, accurate pricing, and direct owner communication.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#e2e8f0]">
              <div>
                <div className="text-3xl font-black text-[#0f172a] mb-1">5,000+</div>
                <div className="text-sm font-bold text-[#64748b]">Students Helped</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#0f172a] mb-1">1,200+</div>
                <div className="text-sm font-bold text-[#64748b]">Verified Listings</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="bg-[#1952c4] rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden shadow-xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-3xl font-extrabold text-white mb-4 relative z-10">Ready to find your next home?</h2>
            <p className="text-white/80 font-medium mb-8 max-w-xl mx-auto relative z-10 text-lg">
              Join thousands of students who have already found their perfect boarding house through BoardingFinder.
            </p>
            <a href="/search" className="inline-block bg-white text-[#1952c4] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-md relative z-10">
              Start Searching
            </a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutUs;
