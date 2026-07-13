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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/identity-verification" element={<IdentityVerification />} />
      <Route path="/virtual-tour/:id" element={<VirtualTour />} />
      <Route path="/neighborhood/:id" element={<NeighborhoodDetails />} />
      <Route path="/roommate-matcher" element={<RoommateMatcher />} />
      <Route path="/community-forum" element={<CommunityForum />} />
      <Route path="/maintenance-portal" element={<MaintenancePortal />} />
      <Route path="/digital-lease" element={<DigitalLease />} />
      <Route path="/calendar" element={<CalendarManagement />} />
      <Route path="/promote" element={<PromoteProperty />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/saved-homes" element={<SavedHomesPage />} />
      <Route path="/map" element={<MapViewPage />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/book/:id" element={<BookingPage />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/add-listing" element={<OwnerListingForm />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/write-review" element={<ReviewPage />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<TermsPrivacy />} />
      <Route path="/compare" element={<CompareListings />} />
      <Route path="/payment-history" element={<PaymentHistory />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/manage-reservations" element={<ManageReservations />} />
      <Route path="/manage-listings" element={<ManageListings />} />
      <Route path="/manage-users" element={<ManageUsers />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;