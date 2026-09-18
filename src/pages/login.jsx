import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Landing from './Landing';
import { useAuth } from '../context/AuthContext';

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

  

  

  return (
    <>
      {/* Background layer */}
      <div className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <Landing />
      </div>

      {/* Modal Foreground */}
      <div className="fixed inset-0 z-50 flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-md overflow-y-auto">
        <div className="w-full max-w-[440px] flex flex-col items-center bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(250,204,21,0.15)] rounded-3xl p-8 sm:p-10 relative my-auto">
          {/* Close Button */}
          <Link to="/" className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          {/* ===== BRAND HEADER ===== */}
          <div className="flex flex-col items-center mb-6 text-center w-full">
            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">
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

          {/* Error Banner */}
          {error && (
            <div className="mb-5 px-4 py-2 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-sm font-medium w-full">
              {error}
            </div>
          )}

          {/* ===== FORM SECTION ===== */}
          <form onSubmit={handleLogin} className="w-full">
            <div className="space-y-6">
              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-1 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="saman@mrt.ac.lk"
                  className="w-full px-5 py-2.5 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px]"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider uppercase">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-yellow-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-2.5 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px] pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-yellow-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold rounded-[16px] transition-all text-base shadow-[0_4px_14px_rgba(250,204,21,0.4)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.6)] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  {role === 'student' && 'Sign In as Student'}
                  {role === 'owner' && 'Sign In as Property Owner'}
                  {role === 'admin' && 'Sign In as Administrator'}
                </>
              )}
            </button>
          </form>

          {/* ===== ALTERNATIVE LOGINS ===== */}
          <div className="grid grid-cols-2 gap-4 mt-5 w-full">
            {role !== 'student' && (
              <button
                type="button"
                onClick={() => setRole('student')}
                className="py-2 px-5 border border-slate-900 bg-transparent hover:bg-slate-100/50 text-[#0f172a] font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer"
              >
                <span role="img" aria-label="student">🎓</span> Student Login
              </button>
            )}
            {role !== 'owner' && (
              <button
                type="button"
                onClick={() => setRole('owner')}
                className="py-2 px-5 border border-slate-900 bg-transparent hover:bg-slate-100/50 text-[#0f172a] font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer"
              >
                <span role="img" aria-label="owner">🏠</span> Owner Login
              </button>
            )}
            {role !== 'admin' && (
              <button
                type="button"
                onClick={() => setRole('admin')}
                className="py-2 px-5 border border-slate-900 bg-transparent hover:bg-slate-100/50 text-[#0f172a] font-semibold rounded-full flex items-center justify-center gap-2 text-sm transition-all duration-200 cursor-pointer"
              >
                <span role="img" aria-label="admin">⚙️</span> Admin Login
              </button>
            )}
          </div>

          {/* ===== REGISTRATION FOOTER ===== */}
          <p className="text-center text-sm text-[#64748b] mt-4 w-full font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;