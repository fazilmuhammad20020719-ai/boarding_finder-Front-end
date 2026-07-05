import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../assets/Image/Image.png';

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
  const [propertyAddress, setPropertyAddress] = useState('');

  // Common Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleNextOrRegister = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (name && email && phone) {
        setStep(2);
      } else {
        alert('Please fill all fields');
      }
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      // Validation based on role
      if (role === 'student') {
        if (university && course && studentId && password) {
          alert('Account created successfully! Please login.');
          navigate('/login');
        } else {
          alert('Please fill all fields');
        }
      } else {
        if (propertyName && propertyAddress && password) {
          alert('Account created successfully! Please login.');
          navigate('/login');
        } else {
          alert('Please fill all fields');
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans antialiased bg-[#f0f4f9]">
      {/* ===== LEFT HERO SECTION ===== */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Blue Tint Overlay */}
        <div className="absolute inset-0 bg-[#1952c4]/85 mix-blend-multiply z-0"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 13.5C15 12.6716 15.6716 12 16.5 12H23.5C24.3284 12 25 12.6716 25 13.5V28H15V13.5Z" stroke="currentColor" strokeWidth="2"/>
              <line x1="18.3" y1="12" x2="18.3" y2="28" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="21.7" y1="12" x2="21.7" y2="28" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="15" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="15" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </div>
          <span className="font-bold text-[22px] tracking-tight">BoardingFinder</span>
        </div>

        {/* Text at Bottom */}
        <div className="relative z-10 max-w-md mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
            Join thousands of <br />students & owners
          </h1>
          <p className="text-white/80 text-[16px] leading-relaxed font-normal">
            Create your free account and start finding or listing boarding houses near universities.
          </p>
        </div>
      </div>

      {/* ===== RIGHT FORM SECTION ===== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 bg-[#f0f4f9]">
        <div className="w-full max-w-[460px] flex flex-col">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => step === 2 ? setStep(1) : navigate('/login')}
            className="flex items-center gap-2 text-slate-500 hover:text-[#1952c4] font-semibold text-[15px] mb-6 self-start transition-colors"
          >
            <span>←</span> Back
          </button>

          {/* Progress Indicator */}
          <div className="w-full flex gap-3 mb-2">
            <div className="flex-grow h-1.5 rounded-full bg-[#1952c4]"></div>
            <div className={`flex-grow h-1.5 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-[#1952c4]' : 'bg-[#e2e8f0]'}`}></div>
          </div>
          <span className="text-slate-400 text-xs font-semibold mb-6 block">
            Step {step} of 2
          </span>

          {/* Form Header */}
          <h2 className="text-[32px] font-bold text-[#0f172a] tracking-tight leading-none mb-3">
            Create Account
          </h2>
          <p className="text-[#64748b] text-[15px] mb-8 font-normal">
            Join BoardingFinder for free
          </p>

          {/* Form */}
          <form onSubmit={handleNextOrRegister} className="w-full">
            {step === 1 ? (
              <div className="space-y-5">
                {/* Role Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    I Am A
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`py-3.5 px-5 rounded-[16px] border font-semibold flex items-center justify-center gap-2 text-[15px] transition-all duration-200 ${
                        role === 'student'
                          ? 'border-2 border-[#1952c4] bg-[#ebf3ff] text-[#1952c4] shadow-sm'
                          : 'border border-[#e2e8f0]/80 bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('owner')}
                      className={`py-3.5 px-5 rounded-[16px] border font-semibold flex items-center justify-center gap-2 text-[15px] transition-all duration-200 ${
                        role === 'owner'
                          ? 'border-2 border-[#1952c4] bg-[#ebf3ff] text-[#1952c4] shadow-sm'
                          : 'border border-[#e2e8f0]/80 bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      🏠 Property Owner
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                    required
                  />
                </div>

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

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {role === 'student' ? (
                  <>
                    {/* University */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        University
                      </label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="University of the Philippines Diliman"
                        className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                        required
                      />
                    </div>

                    {/* Course */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Course
                      </label>
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="BS Computer Science"
                        className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                        required
                      />
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="2021-12345"
                        className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Property Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Property Name
                      </label>
                      <input
                        type="text"
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        placeholder="Diliman Boarding House"
                        className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                        required
                      />
                    </div>

                    {/* Property Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                        Property Address
                      </label>
                      <input
                        type="text"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        placeholder="123 Katipunan Ave, Quezon City"
                        className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] tracking-wider mb-2.5 uppercase">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-[16px] bg-white border border-[#e2e8f0]/80 shadow-sm text-slate-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 focus:border-[#1952c4] transition-all text-[15px]"
                    required
                  />
                </div>
              </div>
            )}

            {/* Terms and Privacy */}
            <p className="text-[13px] text-[#64748b] mt-5 mb-5 text-left font-medium leading-relaxed">
              I agree to the <Link to="/terms" className="text-[#1952c4] font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#1952c4] font-semibold hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#1952c4] hover:bg-[#1546a8] text-white font-semibold rounded-[16px] transition-colors text-base shadow-sm font-medium flex items-center justify-center gap-2"
            >
              {step === 1 ? (
                <>
                  Continue <span className="text-lg">→</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Redirect */}
          <p className="text-center text-sm text-[#64748b] mt-8 w-full font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1952c4] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;