import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OwnerListingForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    propertyName: '',
    propertyType: 'Dormitory', // Dormitory, Apartment, Room
    description: '',
    
    // Step 2: Location
    address: '',
    city: '',
    nearestUniversity: '',
    distance: '',
    
    // Step 3: Amenities
    amenities: {
      wifi: false,
      ac: false,
      kitchen: false,
      laundry: false,
      parking: false,
      cctv: false,
    },
    rules: {
      noSmoking: false,
      noPets: false,
      curfew: false,
    },
    
    // Step 4: Pricing
    monthlyRent: '',
    securityDeposit: '',
    minimumStay: '6', // months
    
    // Photos
    photos: []
  });

  const [errors, setErrors] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCheckboxChange = (category, field) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.propertyName.trim()) newErrors.propertyName = 'Property name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    } else if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.nearestUniversity.trim()) newErrors.nearestUniversity = 'Nearest university is required';
    } else if (currentStep === 4) {
      if (!formData.monthlyRent) newErrors.monthlyRent = 'Monthly rent is required';
      if (!formData.securityDeposit) newErrors.securityDeposit = 'Security deposit is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      // Show success briefly then navigate
      setTimeout(() => {
        navigate('/owner-dashboard');
      }, 1500);
    }
  };

  // Mock Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 5) // max 5 photos
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const renderStepIndicator = () => (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center relative z-10 w-full">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep === step 
                  ? 'bg-[#1952c4] text-white shadow-md shadow-[#1952c4]/30 ring-4 ring-[#ebf3ff]' 
                  : currentStep > step 
                    ? 'bg-[#10b981] text-white' 
                    : 'bg-white text-slate-400 border-2 border-slate-200'
              }`}
            >
              {currentStep > step ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : (
                step
              )}
            </div>
            <span className={`text-[11px] font-bold mt-3 hidden sm:block uppercase tracking-wider ${currentStep === step ? 'text-[#1952c4]' : currentStep > step ? 'text-[#10b981]' : 'text-slate-400'}`}>
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Location'}
              {step === 3 && 'Amenities'}
              {step === 4 && 'Pricing'}
              {step === 5 && 'Review'}
            </span>
          </div>
        ))}
      </div>
      {/* Progress Bar Line */}
      <div className="relative h-1.5 bg-slate-200 rounded-full mx-5 sm:mx-10 -mt-10 sm:-mt-16 z-0">
        <div 
          className="absolute top-0 left-0 h-full bg-[#10b981] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] pb-20">
      <Navbar isLoggedIn={true} onLogout={handleLogout} activeTab="" />

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-12">
        
        <div className="mb-8">
          <button 
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-[#1952c4] transition-colors font-semibold text-sm bg-transparent border-none cursor-pointer mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Create New Listing</h1>
          <p className="text-slate-500 mt-2">Add your boarding house details to start receiving bookings.</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-3xl shadow-sm border border-[#e2e8f0]/60 p-6 sm:p-10">
          
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">1. Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Name *</label>
                  <input 
                    type="text" 
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Tranquil Lodge, BlueSky Residences"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.propertyName ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all`}
                  />
                  {errors.propertyName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.propertyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Dormitory', 'Apartment', 'Private Room'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 cursor-pointer ${
                          formData.propertyType === type 
                            ? 'border-[#1952c4] bg-[#ebf3ff] text-[#1952c4]' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property, its vibe, and what makes it special..."
                    rows="4"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all resize-none`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.description}</p>}
                </div>
              </div>
            </div>
          )}


          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">2. Location Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Address *</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street name, Building number"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Colombo 03, Moratuwa"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Distance to University</label>
                    <input 
                      type="text" 
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      placeholder="e.g. 500m, 2km"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nearest University *</label>
                  <input 
                    type="text" 
                    name="nearestUniversity"
                    value={formData.nearestUniversity}
                    onChange={handleInputChange}
                    placeholder="e.g. University of Moratuwa"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.nearestUniversity ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all`}
                  />
                  {errors.nearestUniversity && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.nearestUniversity}</p>}
                </div>

                <div className="bg-slate-100 rounded-2xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 mt-4">
                  <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm font-bold text-slate-500">Map Pin Placement</span>
                  <span className="text-xs text-slate-400">(Map integration available in production)</span>
                </div>
              </div>
            </div>
          )}


          {/* STEP 3: AMENITIES & RULES */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">3. Amenities & Rules</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-4">Provided Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'wifi', label: 'Fast WiFi', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
                    { id: 'ac', label: 'Air Conditioning', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
                    { id: 'kitchen', label: 'Shared Kitchen', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
                    { id: 'laundry', label: 'Laundry', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                    { id: 'parking', label: 'Parking Space', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                    { id: 'cctv', label: 'CCTV Security', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                  ].map(amenity => (
                    <label 
                      key={amenity.id} 
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.amenities[amenity.id] 
                          ? 'border-[#1952c4] bg-[#ebf3ff] text-[#1952c4]' 
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.amenities[amenity.id]}
                        onChange={() => handleCheckboxChange('amenities', amenity.id)}
                      />
                      <svg className="w-7 h-7 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={amenity.icon} />
                      </svg>
                      <span className="text-xs font-bold text-center">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">House Rules</label>
                <div className="space-y-3">
                  {[
                    { id: 'noSmoking', label: 'No Smoking Inside' },
                    { id: 'noPets', label: 'No Pets Allowed' },
                    { id: 'curfew', label: 'Strict Curfew (10 PM)' },
                  ].map(rule => (
                    <label key={rule.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.rules[rule.id]}
                        onChange={() => handleCheckboxChange('rules', rule.id)}
                        className="w-5 h-5 text-[#1952c4] rounded border-slate-300 focus:ring-[#1952c4]"
                      />
                      <span className="text-sm font-semibold text-slate-700">{rule.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* STEP 4: PRICING & PHOTOS */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">4. Pricing & Photos</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Rent (LKR ) *</label>
                  <input 
                    type="number" 
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    placeholder="e.g. 15000"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.monthlyRent ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all`}
                  />
                  {errors.monthlyRent && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.monthlyRent}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Security Deposit (LKR ) *</label>
                  <input 
                    type="number" 
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="e.g. 30000"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.securityDeposit ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all`}
                  />
                  {errors.securityDeposit && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.securityDeposit}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Stay</label>
                <select 
                  name="minimumStay"
                  value={formData.minimumStay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 transition-all bg-white"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Photos</label>
                
                {/* Upload Zone */}
                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-4">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#1952c4] mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <p className="font-bold text-slate-700">Click or drag photos to upload</p>
                  <p className="text-xs text-slate-500 mt-1">JPEG, PNG up to 5MB (Max 5 photos)</p>
                </div>

                {/* Photo Previews */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {formData.photos.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                        <img src={src} alt={`Upload ${idx+1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-none cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* STEP 5: REVIEW */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#e8f7ec] rounded-full flex items-center justify-center text-[#10b981]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-[#0f172a]">Ready to Publish!</h2>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-extrabold text-[#0f172a] text-lg mb-1">{formData.propertyName}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-6">{formData.propertyType} • {formData.city}</p>

                <div className="space-y-4">
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium text-sm">Monthly Rent</span>
                    <span className="font-bold text-[#0f172a]">LKR {formData.monthlyRent}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium text-sm">Security Deposit</span>
                    <span className="font-bold text-[#0f172a]">LKR {formData.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium text-sm">Nearest University</span>
                    <span className="font-bold text-[#0f172a] text-right">{formData.nearestUniversity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium text-sm">Photos Uploaded</span>
                    <span className="font-bold text-[#0f172a]">{formData.photos.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-[#ebf3ff] text-[#1952c4] p-4 rounded-xl text-sm font-medium flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p>By publishing, you agree to our Terms of Service and Owner Guidelines. Your listing will be visible to students immediately.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e2e8f0]">
            <button 
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border-none cursor-pointer ${
                currentStep === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Back
            </button>

            {currentStep < totalSteps ? (
              <button 
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-xl font-bold text-sm bg-[#1952c4] hover:bg-[#1546a8] text-white transition-colors border-none cursor-pointer shadow-sm flex items-center gap-2"
              >
                Next Step
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl font-bold text-sm bg-[#10b981] hover:bg-[#059669] text-white transition-colors border-none cursor-pointer shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Publish Listing
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default OwnerListingForm;
