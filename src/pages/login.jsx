import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bgImage from 'C:/Users/A.S.F Nuha/.gemini/antigravity-ide/brain/171a4f1b-a721-46c5-8056-e2f868ece8ba/simple_boarding_house_1790525944006.png';

import LogoIcon from '../components/Logo';

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
      const data = await login({ email, password, role });

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
      title: 'Welcome Back',
      subtitle: 'Sign in as a student to continue',
      btnLabel: 'Sign In as Student',
    },
    owner: {
      title: 'Owner Portal',
      subtitle: 'Manage your listings and properties',
      btnLabel: 'Sign In as Property Owner',
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'Access the administrative dashboard',
      btnLabel: 'Sign In as Administrator',
    },
  };

  const current = roleConfig[role];

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-sans antialiased overflow-x-hidden p-4 sm:p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark blurred background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Centered White Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl w-full">
          {/* Header */}
          <div className="text-center mb-5 flex flex-col items-center">
            <Link to="/" className="flex flex-col items-center gap-1 mb-2 hover:opacity-90 transition-opacity">
              <LogoIcon className="w-11 h-11" />
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-black">Boarding</span>
                <span className="text-[#EAB308]">Finder</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-1">
              {current.title}
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {current.subtitle}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saman@mrt.ac.lk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-black uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-black text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-black transition-colors focus:outline-none cursor-pointer border-none bg-transparent"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Yellow Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-all text-sm tracking-wide shadow-sm border-none flex items-center justify-center gap-2 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          {/* Role Switcher */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-2">
              Select Login Role
            </p>
            <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-xl">
              {[
                { key: 'student', label: 'Student' },
                { key: 'owner', label: 'Owner' },
                { key: 'admin', label: 'Admin' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setRole(key); setError(''); }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    role === key
                      ? 'bg-[#FACC15] text-black shadow-sm'
                      : 'text-gray-600 hover:text-black bg-transparent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-5 text-center pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;