import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/Register";
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import ForgotPassword from './pages/ForgotPassword';
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
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
}

export default App;