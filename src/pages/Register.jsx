import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Landing from './Landing';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('student'); // 'student' or 'owner'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [permitNumber, setPermitNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address format (e.g. name@example.com)');
      return;
    }

    if (phone.length !== 9) {
      setError('Phone number must be exactly 9 digits after +94');
      return;
    }
    
    if (role === 'owner' && !permitNumber) {
      setError('Please enter your Business Registration Number (BR Number)');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special symbol.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name, 
        email, 
        phone: '+94' + phone, 
        password, 
        role,
        // Send default empty values to prevent backend errors if it expects them
        university: '', 
        course: '', 
        studentId: '',
        propertyName: '', 
        propertyType: 'dormitory', 
        permitNumber: role === 'owner' ? permitNumber : '', 
        propertyAddress: ''
      };

      await register(payload);
      navigate('/verify-account');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setName(val);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhone(val);
  };

  return (
    <>
      {/* Background layer */}
      <div className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <Landing />
      </div>

      {/* Modal Foreground */}
      <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-6 sm:p-12 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-[500px] bg-white/60 backdrop-blur-lg border border-white shadow-[0_8px_30px_rgba(250,204,21,0.15)] rounded-3xl p-5 sm:p-6 my-auto relative z-10">
        
        {/* Close Button */}
        <Link to="/" className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors z-20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        
        {/* Brand */}
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="w-10 h-10 rounded-full bg-yellow-400/90 flex items-center justify-center text-black shadow-[0_0_15px_rgba(250,204,21,0.5)] border border-yellow-300 mb-4">
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2" />
              <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2" />
              <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2" />
              <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2" />
              <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2" />
              <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2">
            Create Account
          </h2>
          <p className="text-slate-600 text-[15px] font-medium">
            Join BoardingFinder for free
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="w-full space-y-3">
          
          {/* Role Selector */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
              I Am A
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-5 rounded-2xl border font-bold flex items-center justify-center gap-2 text-[15px] transition-all duration-200 ${role === 'student'
                    ? 'border-2 border-yellow-400 bg-white/80 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                    : 'border border-white/60 bg-white/40 hover:bg-white/60 text-slate-700 shadow-sm'
                  }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2 px-5 rounded-2xl border font-bold flex items-center justify-center gap-2 text-[15px] transition-all duration-200 ${role === 'owner'
                    ? 'border-2 border-yellow-400 bg-white/80 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                    : 'border border-white/60 bg-white/40 hover:bg-white/60 text-slate-700 shadow-sm'
                  }`}
              >
                🏠 Property Owner
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Muslima Faizer"
              className="w-full px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px]"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px]"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
              Phone Number
            </label>
            <div className="flex w-full rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/40 focus-within:border-yellow-400 transition-all text-[15px]">
              <div className="pl-4 pr-2 py-2.5 text-slate-600 font-bold border-r border-slate-300/30 flex items-center select-none">
                +94
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="771234567"
                className="w-full px-3 py-2.5 bg-transparent text-slate-800 placeholder-slate-400 font-semibold focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Business Registration Number */}
          {role === 'owner' && (
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
                Business Registration Number (BR Number)
              </label>
              <input
                type="text"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                placeholder="e.g. BR-123456789"
                className="w-full px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px]"
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-yellow-600 focus:outline-none cursor-pointer"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 tracking-wider mb-1 uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all text-[15px] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-yellow-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
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

          {/* Terms and Privacy Checkbox */}
          <div className="flex items-start gap-3 mt-3 mb-3">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 w-4 h-4 text-yellow-500 bg-white/80 border-slate-300 rounded focus:ring-yellow-400/50 focus:ring-2 cursor-pointer"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms" className="text-[13px] text-slate-600 font-bold leading-relaxed cursor-pointer select-none">
              I agree to the <Link to="/terms" className="text-yellow-600 hover:text-yellow-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-yellow-600 hover:text-yellow-500 hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold rounded-2xl transition-all text-base shadow-[0_4px_14px_rgba(250,204,21,0.4)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.6)] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Redirect */}
        <p className="text-center text-sm text-slate-600 mt-3 w-full font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-600 hover:text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;