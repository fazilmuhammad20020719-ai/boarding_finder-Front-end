import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#e2e8f0]/60 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1952c4] to-[#10b981] flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              </div>
              <span className="text-xl font-extrabold text-[#0f172a] tracking-tight">Boarding<span className="text-[#1952c4]">Finder</span></span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Finding the perfect student accommodation has never been easier. Connect directly with owners, secure your stay, and focus on your studies.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[#0f172a] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/search" className="text-slate-500 hover:text-[#1952c4] text-sm transition-colors">Search Properties</Link></li>
              <li><Link to="/about" className="text-slate-500 hover:text-[#1952c4] text-sm transition-colors">About Us</Link></li>
              <li><Link to="/compare" className="text-slate-500 hover:text-[#1952c4] text-sm transition-colors">Compare Listings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[#0f172a] mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-slate-500 hover:text-[#1952c4] text-sm transition-colors">Help Center / FAQ</Link></li>
              <li><Link to="/terms" className="text-slate-500 hover:text-[#1952c4] text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/terms#privacy" className="text-slate-500 hover:text-[#1952c4] text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#e2e8f0]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} BoardingFinder. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-[#1952c4] hover:bg-[#ebf3ff] transition-all cursor-pointer border-none">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-[#1952c4] hover:bg-[#ebf3ff] transition-all cursor-pointer border-none">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
