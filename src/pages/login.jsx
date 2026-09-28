import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [role, setRole] = useState('student'); // 'student', 'owner', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = await login({ email, password });

      // Redirect based on the role returned from the backend
      const userRole = data.user.role;
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    student: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account to continue',
      btnLabel: 'Sign In as Student',
    },
    owner: {
      title: 'Owner Portal',
      subtitle: 'Manage your listings and boarding houses',
      btnLabel: 'Sign In as Property Owner',
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'Access the administrative control center',
      btnLabel: 'Sign In as Administrator',
    },
  };

  const current = roleConfig[role];

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased">
      <Navbar />

      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[440px] flex flex-col items-center">

          {/* ===== BRAND HEADER ===== */}
          <div className="flex flex-col items-center mb-8 text-center w-full">
            {/* Role badge — mirrors Landing page pill style */}
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              <span className="text-xs font-semibold text-white/70 tracking-widest uppercase">
                {role} login
              </span>
            </div>

            <h2 className="text-[32px] font-bold text-white tracking-tight">
              {current.title}
            </h2>
            <p className="text-white/50 text-[15px] mt-2 font-normal">
              {current.subtitle}
            </p>
          </div>

          {/* ===== CARD ===== */}
          <div className="w-full bg-[#1A1A1A] border border-[#2a2a2a] rounded-[24px] p-7 shadow-2xl">

            {/* Error Banner */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* ===== FORM ===== */}
            <form onSubmit={handleLogin} className="w-full space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-white/40 tracking-widest mb-2.5 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="saman@mrt.ac.lk"
                  className="w-full px-5 py-4 rounded-[14px] bg-[#111] border border-[#333] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all text-[15px]"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#FACC15] hover:text-[#EAB308] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 pr-12 rounded-[14px] bg-[#111] border border-[#333] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all text-[15px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-[#FACC15] transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 mt-2 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] transition-colors text-[15px] tracking-wide shadow-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  current.btnLabel
                )}
              </button>
            </form>

            {/* ===== ROLE SWITCHER ===== */}
            <div className="mt-5 pt-5 border-t border-[#2a2a2a]">
              <p className="text-[11px] font-semibold text-white/30 tracking-widest uppercase text-center mb-3">
                Switch Role
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'student', label: 'Student' },
                  { key: 'owner', label: 'Owner' },
                  { key: 'admin', label: 'Admin' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setRole(key); setError(''); }}
                    className={`py-2.5 px-3 rounded-[12px] flex items-center justify-center text-xs font-semibold transition-all cursor-pointer border ${
                      role === key
                        ? 'bg-[#FACC15]/10 border-[#FACC15]/50 text-[#FACC15]'
                        : 'bg-transparent border-[#333] text-white/40 hover:border-[#444] hover:text-white/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== REGISTRATION FOOTER ===== */}
          <p className="text-center text-sm text-white/40 mt-6 w-full font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FACC15] font-semibold hover:text-[#EAB308] transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;