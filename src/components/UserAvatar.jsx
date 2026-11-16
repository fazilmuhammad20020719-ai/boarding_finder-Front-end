import React, { useState } from 'react';

// Shows the user's profile picture, or the first letter of their name when
// there is no picture (or it fails to load). Size and text size come from className.
const UserAvatar = ({ user, className = 'w-7 h-7 text-xs' }) => {
  const [broken, setBroken] = useState(false);
  const initial = (user?.name || '?').charAt(0).toUpperCase();
  const url = user?.avatar_url;

  if (url && !broken) {
    return (
      <img
        src={url}
        alt={user?.name ? `${user.name}'s profile picture` : 'Profile picture'}
        onError={() => setBroken(true)}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover shrink-0 bg-[#333] ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full bg-[#333] text-[#FACC15] flex items-center justify-center font-bold shrink-0 ${className}`}>
      {initial}
    </div>
  );
};

export default UserAvatar;
