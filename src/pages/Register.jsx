import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bgImage from 'C:/Users/A.S.F Nuha/.gemini/antigravity-ide/brain/171a4f1b-a721-46c5-8056-e2f868ece8ba/simple_boarding_house_1790525944006.png';
import LogoIcon from '../components/Logo';

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { register } = useAuth();

  // ── Validation helpers ──────────────────────────────────────
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const validateStep1 = () => {
    const errs = {};
    if (!name || name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    else if (name.trim().length > 100) errs.name = 'Name must not exceed 100 characters.';
    if (!email) errs.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Please enter a valid email address.';
    if (phone && phone.trim().length > 0 && !PHONE_REGEX.test(phone.trim())) errs.phone = 'Please enter a valid phone number.';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (role === 'student') {
      if (!university || university.trim().length < 2) errs.university = 'University must be at least 2 characters.';
      else if (university.trim().length > 200) errs.university = 'University must not exceed 200 characters.';
      if (!course || course.trim().length < 2) errs.course = 'Course must be at least 2 characters.';
      else if (course.trim().length > 200) errs.course = 'Course must not exceed 200 characters.';
      if (!studentId || studentId.trim().length < 2) errs.studentId = 'Student ID must be at least 2 characters.';
      else if (studentId.trim().length > 50) errs.studentId = 'Student ID must not exceed 50 characters.';
    }
    if (role === 'owner') {
      if (!propertyName || propertyName.trim().length < 2) errs.propertyName = 'Property name must be at least 2 characters.';
      else if (propertyName.trim().length > 200) errs.propertyName = 'Property name must not exceed 200 characters.';
      if (!permitNumber || permitNumber.trim().length < 2) errs.permitNumber = 'Permit number must be at least 2 characters.';
      else if (permitNumber.trim().length > 50) errs.permitNumber = 'Permit number must not exceed 50 characters.';
      if (!propertyAddress || propertyAddress.trim().length < 5) errs.propertyAddress = 'Address must be at least 5 characters.';
      else if (propertyAddress.trim().length > 500) errs.propertyAddress = 'Address must not exceed 500 characters.';
    }
    if (!password) errs.password = 'Password is required.';
    else if (passwordStrength < 5) errs.password = 'Password does not meet all complexity requirements.';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleNextOrRegister = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (step === 1) {
      if (!agreedToTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy');
        return;
      }
      const errs = validateStep1();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        setError(Object.values(errs)[0]);
        return;
      }
      setStep(2);
    } else {
      const errs = validateStep2();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        setError(Object.values(errs)[0]);
        return;
      }

      setIsLoading(true);
      try {
        const payload = {
          name, email, phone, password, role,
          ...(role === 'student' && { university, course, studentId }),
          ...(role === 'owner' && { propertyName, propertyType, permitNumber, propertyAddress }),
        };

        await register(payload);
        navigate('/verify-account');
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputCls = 'w-full px-3.5 py-2 rounded-xl bg-white border border-black text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-all text-sm';
  const labelCls = 'block text-[11px] font-bold text-black tracking-wider mb-1 uppercase';

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-sans antialiased overflow-x-hidden p-3 sm:p-5"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark blurred background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[620px]">
        {/* Centered White Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-2xl w-full">
          {/* Header */}
          <div className="text-center mb-3 flex flex-col items-center">
            <Link to="/" className="flex flex-col items-center gap-1 mb-1 hover:opacity-90 transition-opacity">
              <LogoIcon className="w-10 h-10" />
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="text-black">Boarding</span>
                <span className="text-[#EAB308]">Finder</span>
              </span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Join BoardingFinder for free
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 mb-4">
            <div className="flex-1 h-1.5 rounded-full bg-[#FACC15]" />
            <div className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#FACC15]' : 'bg-gray-200'}`} />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleNextOrRegister} className="w-full">
            {step === 1 ? (
              <div className="space-y-3.5">
                {/* Role Selector */}
                <div>
                  <label className={labelCls}>I Am A</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                    {[
                      { key: 'student', label: 'Student' },
                      { key: 'owner', label: 'Property Owner' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setRole(key)}
                        className={`py-2 px-4 rounded-lg font-bold flex items-center justify-center text-xs transition-all border-none cursor-pointer ${
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

                {/* 2-Column Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Saman Perera" className={`${inputCls} ${fieldErrors.name ? '!border-red-500' : ''}`} maxLength={100} required />
                    {fieldErrors.name && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.name}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="saman@mrt.ac.lk" className={`${inputCls} ${fieldErrors.email ? '!border-red-500' : ''}`} maxLength={254} required />
                    {fieldErrors.email && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 123 4567" className={`${inputCls} ${fieldErrors.phone ? '!border-red-500' : ''}`} maxLength={20} required />
                  {fieldErrors.phone && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.phone}</p>}
                </div>

                {/* Terms Agreement */}
                <label className="flex items-center gap-2.5 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#FACC15] focus:ring-[#FACC15] cursor-pointer accent-[#FACC15]"
                    required
                  />
                  <span className="text-xs text-gray-700 font-medium">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-3.5">
                {role === 'student' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>University</label>
                      <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="University of Moratuwa" className={`${inputCls} ${fieldErrors.university ? '!border-red-500' : ''}`} maxLength={200} required />
                      {fieldErrors.university && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.university}</p>}
                    </div>

                    <div>
                      <label className={labelCls}>Course</label>
                      <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="BSc Engineering" className={`${inputCls} ${fieldErrors.course ? '!border-red-500' : ''}`} maxLength={200} required />
                      {fieldErrors.course && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.course}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelCls}>Student ID</label>
                      <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="210123A" className={`${inputCls} ${fieldErrors.studentId ? '!border-red-500' : ''}`} maxLength={50} required />
                      {fieldErrors.studentId && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.studentId}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Property Name</label>
                      <input type="text" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} placeholder="Moratuwa Student Residency" className={`${inputCls} ${fieldErrors.propertyName ? '!border-red-500' : ''}`} maxLength={200} required />
                      {fieldErrors.propertyName && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.propertyName}</p>}
                    </div>

                    <div>
                      <label className={labelCls}>Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className={`${inputCls} cursor-pointer`}
                        required
                      >
                        <option value="dormitory">Dormitory</option>
                        <option value="apartment">Apartment</option>
                        <option value="bedspace">Bedspace</option>
                        <option value="room_for_rent">Room for Rent</option>
                        <option value="house">Single House</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Business Reg / TIN</label>
                      <input type="text" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} placeholder="BR-123456789" className={`${inputCls} ${fieldErrors.permitNumber ? '!border-red-500' : ''}`} maxLength={50} required />
                      {fieldErrors.permitNumber && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.permitNumber}</p>}
                    </div>

                    <div>
                      <label className={labelCls}>Property Address</label>
                      <input type="text" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="123 Katubedda Road, Moratuwa" className={`${inputCls} ${fieldErrors.propertyAddress ? '!border-red-500' : ''}`} maxLength={500} required />
                      {fieldErrors.propertyAddress && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.propertyAddress}</p>}
                    </div>
                  </div>
                )}

                {/* Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputCls} ${fieldErrors.password ? '!border-red-500' : ''}`} maxLength={128} required />
                    {fieldErrors.password && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.password}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`${inputCls} ${fieldErrors.confirmPassword ? '!border-red-500' : ''}`} maxLength={128} required />
                    {fieldErrors.confirmPassword && <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl text-xs transition-all border-none cursor-pointer"
                >
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold rounded-xl transition-all text-sm tracking-wide shadow-sm border-none flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : step === 1 ? (
                  <>Continue →</>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Sign In Footer Link */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;