import React from 'react';

// The one BoardingFinder logo used across the app: the logo image + "BoardingFinder."
// textClassName sets the word colour (white on dark bars, black on light footers).
// hideTextOnTiny hides the word on very narrow phones so nav icons still fit.
const BrandLogo = ({ textClassName = 'text-white', hideTextOnTiny = false, showText = true }) => (
  <span className="flex items-center gap-2 sm:gap-3 min-w-0">
    <img src="/logo.jpg" alt="BoardingFinder Logo" className="w-8 h-8 rounded-md shrink-0" />
    {showText && (
      <span className={`font-bold text-lg sm:text-[22px] tracking-tight truncate ${textClassName} ${hideTextOnTiny ? 'hidden min-[400px]:inline' : ''}`}>
        BoardingFinder<span className="text-[#FACC15]">.</span>
      </span>
    )}
  </span>
);

export default BrandLogo;
