import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/Register";
import HomePage from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ProfilePage from './pages/Profile';
import SavedHomesPage from './pages/SavedHomes';
import MapViewPage from './pages/MapView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/saved-homes" element={<SavedHomesPage />} />
      <Route path="/map" element={<MapViewPage />} />
    </Routes>
  );
}

export default App;