import React from 'react';

// The user's avatar: the first letter of their name (profile pictures are not used).
const UserAvatar = ({ user, className = 'w-7 h-7 text-xs' }) => (
  <div className={`rounded-full bg-[#333] text-[#FACC15] flex items-center justify-center font-bold shrink-0 ${className}`}>
    {(user?.name || '?').charAt(0).toUpperCase()}
  </div>
);

export default UserAvatar;
