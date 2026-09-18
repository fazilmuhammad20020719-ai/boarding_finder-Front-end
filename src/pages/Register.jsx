import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('student'); // 'student' or 'owner'

  // Step 1 Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2 Fields (Student)
  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [studentId, setStudentId] = useState('');

  // Step 2 Fields (Property Owner)
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('dormitory');
  const [permitNumber, setPermitNumber] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');

  // Common Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleNextOrRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (name && email && phone) {
        setStep(2);
      } else {
        setError('Please fill all fields');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Validate role-specific fields
      if (role === 'student' && (!university || !course || !studentId || !password)) {
        setError('Please fill all fields');
        return;
      }
      if (role === 'owner' && (!propertyName || !propertyType || !permitNumber || !propertyAddress || !password)) {
        setError('Please fill all fields');
        return;
      }

      // Build payload and call API
      setIsLoading(true);
      try {
        const payload = {
          name, email, phone, password, role,
          ...(role === 'student' && { university, course, studentId }),
          ...(role === 'owner' && { propertyName, propertyType, permitNumber, propertyAddress }),
        };

        await register(payload);

        // Redirect to email verification page (all users must verify first)
        navigate('/verify-account');
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Shared styles
  const inputCls = 'w-full px-5 py-4 rounded-[14px] bg-[#111] border border-[#333] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/60 transition-all text-[15px]';
  const labelCls = 'block text-[11px] font-bold text-white/40 tracking-widest mb-2.5 uppercase';

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans antialiased">

      {/* ===== TOP NAV ===== */}
      <div className="w-full border-b border-[#222] px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-[20px] text-white tracking-tight">
          BoardingFinder<span className="text-[#FACC15]">.</span>
        </Link>
        <p className="text-sm text-white/40 font-medium hidden sm:block">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FACC15] font-semibold hover:text-[#EAB308] transition-colors">
            Sign In
          </Link>
        </p>
      </div>

      {/* ===== MAIN ===== */}
      <div className="flex-grow flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[480px] flex flex-col">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => step === 2 ? setStep(1) : navigate('/login')}
            className="flex items-center gap-2 text-white/40 hover:text-[#FACC15] font-semibold text-[14px] mb-6 self-start transition-colors cursor-pointer"
          >
            <span>←</span> Back
          </button>

          {/* Progress Bar */}
          <div className="w-full flex gap-2 mb-2">
            <div className="flex-grow h-1 rounded-full bg-[#FACC15]" />
            <div className={`flex-grow h-1 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#FACC15]' : 'bg-[#333]'}`} />
          </div>
          <span className="text-white/30 text-xs font-semibold mb-7 block tracking-widest uppercase">
            Step {step} of 2
          </span>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              <span className="text-xs font-semibold text-white/70 tracking-widest uppercase">Free Account</span>
            </div>
            <h2 className="text-[32px] font-bold text-white tracking-tight leading-none mb-2">
              Create Account
            </h2>
            <p className="text-white/50 text-[15px] font-normal">
              Join BoardingFinder for free
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

            <form onSubmit={handleNextOrRegister} className="w-full">
              {step === 1 ? (
                <div className="space-y-5">
                  {/* Role Selector */}
                  <div>
                    <label className={labelCls}>I Am A</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'student', label: 'Student' },
                        { key: 'owner', label: 'Property Owner' },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setRole(key)}
                          className={`py-3 px-5 rounded-[12px] border font-semibold flex items-center justify-center text-[14px] transition-all duration-200 cursor-pointer ${
                            role === key
                              ? 'border-[#FACC15]/50 bg-[#FACC15]/10 text-[#FACC15]'
                              : 'border-[#333] bg-transparent text-white/40 hover:border-[#444] hover:text-white/60'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Saman Perera" className={inputCls} required />
                  </div>

                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="saman@mrt.ac.lk" className={inputCls} required />
                  </div>

                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 123 4567" className={inputCls} required />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {role === 'student' ? (
                    <>
                      <div>
                        <label className={labelCls}>University</label>
                        <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="University of Moratuwa" className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Course</label>
                        <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="BSc Engineering" className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Student ID</label>
                        <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="210123A" className={inputCls} required />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className={labelCls}>Property Name</label>
                        <input type="text" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} placeholder="e.g. Moratuwa Student Residency" className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Property Type</label>
                        <div className="relative">
                          <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className={`${inputCls} appearance-none pr-10`}
                            style={{ colorScheme: 'dark' }}
                            required
                          >
                            <option value="dormitory">Dormitory</option>
                            <option value="apartment">Apartment</option>
                            <option value="bedspace">Bedspace</option>
                            <option value="room_for_rent">Room for Rent</option>
                            <option value="house">Single House</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Business Registration / TIN</label>
                        <input type="text" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} placeholder="e.g. BR-123456789" className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Property Address</label>
                        <input type="text" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="e.g. 123 Katubedda Road, Moratuwa" className={inputCls} required />
                      </div>
                    </>
                  )}

                  <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
                  </div>
                </div>
              )}

              {/* Terms */}
              <p className="text-[12px] text-white/30 mt-5 mb-5 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-[#FACC15] font-semibold hover:text-[#EAB308] transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#FACC15] font-semibold hover:text-[#EAB308] transition-colors">Privacy Policy</Link>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-[14px] transition-colors text-[15px] tracking-wide shadow-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : step === 1 ? (
                  <>Continue <span className="text-lg">→</span></>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          {/* Mobile footer */}
          <p className="text-center text-sm text-white/40 mt-6 w-full font-medium sm:hidden">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FACC15] font-semibold hover:text-[#EAB308] transition-colors">Sign In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;