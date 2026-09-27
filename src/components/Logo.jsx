import React from 'react';
import isolatedLogoImg from 'C:/Users/A.S.F Nuha/.gemini/antigravity-ide/brain/171a4f1b-a721-46c5-8056-e2f868ece8ba/boarding_finder_pure_transparent_logo_1790532546132.png';

export const LogoIcon = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* SVG Vector Logo Icon with 100% transparent background */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Pin Ring in Yellow #FACC15 */}
        <path
          d="M50 10 C32 10 18 24 18 42 C18 64 50 90 50 90 C50 90 82 64 82 42 C82 24 68 10 50 10 Z"
          fill="#FACC15"
        />
        {/* Inner Circle dark background */}
        <circle cx="50" cy="40" r="22" fill="#111827" />
        {/* House Silhouette geometry in white */}
        <path
          d="M50 26 L34 38 V54 H44 V44 H56 V54 H66 V38 L50 26 Z"
          fill="#FFFFFF"
        />
        {/* Roof accent line in Yellow */}
        <path
          d="M50 22 L31 36 L34 40 L50 27 L66 40 L69 36 L50 22 Z"
          fill="#FACC15"
        />
      </svg>
    </div>
  );
};

export const LogoImage = ({ className = "w-10 h-10" }) => {
  return (
    <img
      src={isolatedLogoImg}
      alt="BoardingFinder Logo"
      className={`object-contain mix-blend-multiply ${className}`}
    />
  );
};

export default LogoIcon;
