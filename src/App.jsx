import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/Register";
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyAccount from './pages/VerifyAccount';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import IdentityVerification from './pages/IdentityVerification';
import VirtualTour from './pages/VirtualTour';
import NeighborhoodDetails from './pages/NeighborhoodDetails';
import RoommateMatcher from './pages/RoommateMatcher';
import CommunityForum from './pages/CommunityForum';
import MaintenancePortal from './pages/MaintenancePortal';
import DigitalLease from './pages/DigitalLease';
import CalendarManagement from './pages/CalendarManagement';
import PromoteProperty from './pages/PromoteProperty';
import ProfilePage from './pages/Profile';
import SavedHomesPage from './pages/SavedHomes';
import MapViewPage from './pages/MapView';
import PropertyDetails from './pages/PropertyDetails';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import OwnerListingForm from './pages/OwnerListingForm';
import Settings from './pages/Settings';
import ReviewPage from './pages/ReviewPage';
import FAQ from './pages/FAQ';
import TermsPrivacy from './pages/TermsPrivacy';
import CompareListings from './pages/CompareListings';
import PaymentHistory from './pages/PaymentHistory';
import Earnings from './pages/Earnings';
import ManageReservations from './pages/ManageReservations';
import ManageListings from './pages/ManageListings';
import ManageUsers from './pages/ManageUsers';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ─── Public Routes ─────────────────────── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<TermsPrivacy />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* ─── Protected Routes (any authenticated user) ── */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/saved-homes" element={<ProtectedRoute><SavedHomesPage /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><MapViewPage /></ProtectedRoute>} />
      <Route path="/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
      <Route path="/book/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/write-review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><CompareListings /></ProtectedRoute>} />
      <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
      <Route path="/identity-verification" element={<ProtectedRoute><IdentityVerification /></ProtectedRoute>} />
      <Route path="/virtual-tour/:id" element={<ProtectedRoute><VirtualTour /></ProtectedRoute>} />
      <Route path="/neighborhood/:id" element={<ProtectedRoute><NeighborhoodDetails /></ProtectedRoute>} />
      <Route path="/roommate-matcher" element={<ProtectedRoute><RoommateMatcher /></ProtectedRoute>} />
      <Route path="/community-forum" element={<ProtectedRoute><CommunityForum /></ProtectedRoute>} />
      <Route path="/maintenance-portal" element={<ProtectedRoute><MaintenancePortal /></ProtectedRoute>} />
      <Route path="/digital-lease" element={<ProtectedRoute><DigitalLease /></ProtectedRoute>} />

      {/* ─── Owner-only Routes ─────────────────── */}
      <Route path="/owner-dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/add-listing" element={<ProtectedRoute role="owner"><OwnerListingForm /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute role="owner"><CalendarManagement /></ProtectedRoute>} />
      <Route path="/promote" element={<ProtectedRoute role="owner"><PromoteProperty /></ProtectedRoute>} />
      <Route path="/earnings" element={<ProtectedRoute role="owner"><Earnings /></ProtectedRoute>} />
      <Route path="/manage-reservations" element={<ProtectedRoute role="owner"><ManageReservations /></ProtectedRoute>} />
      <Route path="/manage-listings" element={<ProtectedRoute role="owner"><ManageListings /></ProtectedRoute>} />

      {/* ─── Admin-only Routes ─────────────────── */}
      <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/manage-users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />

      {/* ─── 404 Catch-all ─────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;