import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createListing, updateListing, uploadListingPhotos, getListing } from '../services/api';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet marker icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OwnerListingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
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
    latitude: 6.9271, // default to Colombo
    longitude: 79.8612,

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
    photos: [],      // preview URLs for display
    photoFiles: [],   // actual File objects for upload
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'done', 'error'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch listing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        try {
          const data = await getListing(id);
          const listing = data.listing || data;

          let address = listing.location || '';
          let city = '';
          if (listing.location && listing.location.includes(',')) {
            const parts = listing.location.split(',');
            address = parts[0].trim();
            city = parts[1].trim();
          }

          let parsedAmenities = { wifi: false, ac: false, kitchen: false, laundry: false, parking: false, cctv: false };
          if (typeof listing.amenities === 'string') {
            try { parsedAmenities = JSON.parse(listing.amenities); } catch (e) { }
          } else if (typeof listing.amenities === 'object' && listing.amenities !== null) {
            parsedAmenities = { ...parsedAmenities, ...listing.amenities };
          }

          setFormData({
            propertyName: listing.title || '',
            propertyType: 'Dormitory',
            description: listing.description || '',
            address: address,
            city: city,
            nearestUniversity: '',
            distance: '',
            latitude: listing.latitude || 6.9271,
            longitude: listing.longitude || 79.8612,
            amenities: parsedAmenities,
            rules: { noSmoking: false, noPets: false, curfew: false },
            monthlyRent: listing.price || '',
            securityDeposit: listing.security_deposit || '',
            minimumStay: '6',
            photos: listing.image_urls || [],
            photoFiles: [],
          });
        } catch (err) {
          console.error("Failed to fetch listing:", err);
        }
      };
      fetchListing();
    }
  }, [id, isEditMode]);

  // Map Click Component
  const MapClickComponent = () => {
    useMapEvents({
      click(e) {
        setFormData(prev => ({ ...prev, latitude: e.latlng.lat, longitude: e.latlng.lng }));
      },
    });
    return null;
  };

  // Map Panner Component
  const MapPanner = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 14);
    }, [lat, lng, map]);
    return null;
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleMapSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        }));
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitting(true);
      setUploadStatus('');

      try {
        // Step 1: Upload photos to Google Drive (if any)
        let imageUrls = [];
        if (formData.photoFiles.length > 0) {
          setUploadStatus('uploading');
          const uploadResult = await uploadListingPhotos(formData.photoFiles);
          imageUrls = uploadResult.urls;
          setUploadStatus('done');
        }

        // Step 2: Create or Update the listing with Drive URLs
        const payload = {
          title: formData.propertyName,
          description: formData.description,
          price: formData.monthlyRent,
          security_deposit: formData.securityDeposit,
          location: `${formData.address}, ${formData.city}`,
          latitude: formData.latitude,
          longitude: formData.longitude,
          amenities: JSON.stringify(formData.amenities),
          image_urls: [...formData.photos.filter(p => p.startsWith('https://')), ...imageUrls]
        };

        if (isEditMode) {
          await updateListing(id, payload);
        } else {
          await createListing(payload);
        }

        setTimeout(() => {
          navigate('/owner-dashboard');
        }, 1500);
      } catch (err) {
        console.error("Failed to create listing:", err);
        setUploadStatus('error');
        setErrors(prev => ({ ...prev, submit: err.message || "Failed to create listing" }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Photo Upload Handler — stores File objects for real upload + preview URLs for display
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPreviews].slice(0, 5),
      photoFiles: [...prev.photoFiles, ...files].slice(0, 5)
    }));
  };

  const removePhoto = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(formData.photos[index]);
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoFiles: prev.photoFiles.filter((_, i) => i !== index)
    }));
  };

  const renderStepIndicator = () => (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center relative z-10 w-full">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep === step
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
      <div className="relative h-1.5 bg-slate-200 rounded-full mx-5 sm:mx-10 -mt-10 sm:-mt-16 mb-10 sm:mb-16 z-0">
        <div
          className="absolute top-0 left-0 h-full bg-[#10b981] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans antialiased text-[#0f172a] pb-20">
      {/* Top Bar */}
      <header className="bg-[#1e3a8a] text-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">Owner Dashboard</div>
            <div className="text-xl font-extrabold">Roberto Cruz</div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors cursor-pointer bg-transparent border-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-12">

        <div className="mb-8">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-[#1952c4] transition-colors font-semibold text-sm bg-transparent border-none cursor-pointer mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h1>
          <p className="text-slate-500 mt-2">{isEditMode ? 'Update your boarding house details.' : 'Add your boarding house details to start receiving bookings.'}</p>
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
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 cursor-pointer ${formData.propertyType === type
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

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Pin Exact Location on Map *</label>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      className="px-4 py-2 bg-[#ebf3ff] text-[#1952c4] font-bold text-sm rounded-xl border border-[#1952c4]/20 hover:bg-[#d6e5ff] transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                      Use My Current Location
                    </button>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search area (e.g. Kollupitiya)"
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1952c4]/20 text-sm"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleMapSearch(); } }}
                      />
                      <button
                        type="button"
                        onClick={handleMapSearch}
                        className="px-4 py-2 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl h-80 overflow-hidden border-2 border-slate-200 shadow-inner relative z-0">
                    <MapContainer
                      center={[formData.latitude, formData.longitude]}
                      zoom={13}
                      scrollWheelZoom={true}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[formData.latitude, formData.longitude]} />
                      <MapClickComponent />
                      <MapPanner lat={formData.latitude} lng={formData.longitude} />
                    </MapContainer>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg text-sm font-bold text-[#1952c4] pointer-events-none flex items-center gap-2 border border-[#1952c4]/10 z-[1000]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Click map to move pin
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">Selected Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
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
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.amenities[amenity.id]
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
                        <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
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
          {/* Upload Status Indicator */}
          {uploadStatus === 'uploading' && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200 flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading photos to Google Drive... This may take a moment.
            </div>
          )}
          {uploadStatus === 'done' && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-semibold border border-green-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Photos uploaded to Google Drive successfully!
            </div>
          )}
          {errors.submit && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-200">
              {errors.submit}
            </div>
          )}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border-none cursor-pointer ${currentStep === 1
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
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl font-bold text-sm bg-[#10b981] hover:bg-[#059669] text-white transition-colors border-none cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
                {isSubmitting ? 'Publishing...' : (isEditMode ? 'Update Listing' : 'Publish Listing')}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default OwnerListingForm;
