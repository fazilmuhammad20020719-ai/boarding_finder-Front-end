// pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth states here (if needed)
    navigate('/'); // Go back to Landing page
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-2xl text-center border border-white/60">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-4xl font-bold text-gray-800">Welcome to BoardingFinder!</h1>
        <p className="text-gray-500 mt-2 text-lg">You have successfully logged in.</p>
        <p className="text-gray-400 text-sm mt-1">Find your perfect boarding house near campus.</p>

        <button
          onClick={handleLogout}
          className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-200/60 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;