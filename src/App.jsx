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
import OwnerDashboard from './pages/OwnerDashboard';

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
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
    </Routes>
  );
}

export default App;