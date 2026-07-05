import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [role, setRole] = useState('student'); // 'student', 'owner', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      alert(`Successfully signed in as ${role === 'student' ? 'Student' : role === 'owner' ? 'Property Owner' : 'Administrator'}`);
      navigate('/home'); // Login success -> Home page
    } else {
      alert('Please fill all fields');
    }
  };

  const handleGoogleLogin = () => {
    alert(`Signing in with Google as ${role === 'student' ? 'Student' : role === 'owner' ? 'Property Owner' : 'Administrator'}...`);
    navigate('/home');
  };

  const handleFacebookLogin = () => {
    alert(`Signing in with Facebook as ${role === 'student' ? 'Student' : role === 'owner' ? 'Property Owner' : 'Administrator'}...`);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f0f4f9] font-sans antialiased">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* ===== BRAND HEADER ===== */}
        <div className="flex flex-col items-center mb-8 text-center w-full">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-full bg-[#1952c4] flex items-center justify-center text-white shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2"/>
                <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </div>
            <span className="font-bold text-[22px] text-[#0f172a] tracking-tight">BoardingFinder</span>
          </div>

          <h2 className="text-[32px] font-bold text-[#0f172a] mt-8 tracking-tight">
            {role === 'student' && 'Welcome back'}
            {role === 'owner' && 'Owner Portal'}
            {role === 'admin' && 'Admin Portal'}
          </h2>
          <p className="text-[#64748b] text-[15px] mt-1.5 font-normal">
            {role === 'student' && 'Sign in to your account to continue'}
            {role === 'owner' && 'Manage your listings and boarding houses'}
            {role === 'admin' && 'Access the administrative control center'}
          </p>
        </div>

        {/* ===== FORM SECTION ===== */}
        <form onSubmit={handleLogin} className="w-full">
          <div className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@university.edu.ph"
                className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider uppercase">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-[#1952c4] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-6 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-[16px] transition-colors text-base shadow-sm cursor-pointer"
          >
            {role === 'student' && 'Sign In as Student'}
            {role === 'owner' && 'Sign In as Property Owner'}
            {role === 'admin' && 'Sign In as Administrator'}
          </button>
        </form>

        {/* ===== ALTERNATIVE LOGINS ===== */}
        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
          {role !== 'student' && (
            <button
              type="button"
              onClick={() => setRole('student')}
              className="py-3 px-5 border border-slate-900 bg-transparent hover:bg-slate-100/50 text-[#0f172a] font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer"
            >
              <span role="img" aria-label="student">🎓</span> Student Login
            </button>
          )}
          {role !== 'owner' && (
            <button
              type="button"
              onClick={() => setRole('owner')}
              className="py-3 px-5 border border-slate-900 bg-transparent hover:bg-slate-100/50 text-[#0f172a] font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer"
            >
              <span role="img" aria-label="owner">🏠</span> Owner Login
            </button>
          )}
          {role !== 'admin' && (
            <button
              type="button"
              onClick={() => setRole('admin')}
              className="py-3 px-5 border border-slate-900 bg-transparent hover:bg-slate-100/50 text-[#0f172a] font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer"
            >
              <span role="img" aria-label="admin">⚙️</span> Admin Login
            </button>
          )}
        </div>

        {/* ===== SOCIAL DIVIDER ===== */}
        <div className="relative flex py-6 items-center w-full">
          <div className="flex-grow border-t border-[#e2e8f0]/80"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-[#64748b] tracking-wide bg-transparent">
            or continue with
          </span>
          <div className="flex-grow border-t border-[#e2e8f0]/80"></div>
        </div>

        {/* ===== SOCIAL BUTTONS ===== */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 border border-[#e2e8f0]/80 bg-white hover:bg-slate-50 text-[#0f172a] font-semibold rounded-[16px] text-sm transition-all shadow-sm duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 border border-[#e2e8f0]/80 bg-white hover:bg-slate-50 text-[#0f172a] font-semibold rounded-[16px] text-sm transition-all shadow-sm duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* ===== REGISTRATION FOOTER ===== */}
        <p className="text-center text-sm text-[#64748b] mt-8 w-full font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#1952c4] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;