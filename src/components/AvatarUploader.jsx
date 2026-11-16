import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar, removeAvatar } from '../services/api';
import UserAvatar from './UserAvatar';

const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Large profile picture with Upload / Remove. Saves straight to the server and
// updates the signed-in user so every nav bar shows the new picture.
const AvatarUploader = ({ layout = 'row' }) => {
  const { user, patchUser } = useAuth();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!TYPES.includes(file.type)) return setError('Please choose a JPG, PNG or WebP image.');
    if (file.size > MAX_BYTES) return setError('Profile picture must be under 3MB.');

    setBusy(true);
    setError('');
    try {
      const data = await uploadAvatar(file);
      patchUser({ avatar_url: data.avatar_url });
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async () => {
    setBusy(true);
    setError('');
    try {
      await removeAvatar();
      patchUser({ avatar_url: null });
    } catch (err) {
      setError(err.message || 'Could not remove the picture.');
    } finally {
      setBusy(false);
    }
  };

  const isColumn = layout === 'column';

  return (
    <div className={`flex ${isColumn ? 'flex-col items-center text-center' : 'flex-col sm:flex-row items-center sm:items-start text-center sm:text-left'} gap-5`}>
      <div className="relative">
        <UserAvatar user={user} className="w-24 h-24 text-3xl border border-[#FACC15]/30" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title="Change profile picture"
          className="absolute bottom-0 right-0 w-8 h-8 bg-[#111] border border-[#333] rounded-full flex items-center justify-center text-white/60 hover:text-[#FACC15] transition-colors cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
        {busy && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-[#FACC15]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        )}
      </div>

      {!isColumn && (
        <div>
          <h3 className="font-bold text-white text-lg">Profile Picture</h3>
          <p className="text-sm text-white/50 mt-1 mb-3">JPG, PNG or WebP. Max 3MB.</p>
          <div className="flex gap-3 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="px-4 py-2 bg-[#111] hover:bg-[#222] text-white text-sm font-bold rounded-lg transition-colors border border-[#333] cursor-pointer disabled:opacity-50"
            >
              {user?.avatar_url ? 'Change' : 'Upload'}
            </button>
            {user?.avatar_url && (
              <button
                type="button"
                onClick={onRemove}
                disabled={busy}
                className="px-4 py-2 bg-transparent text-red-500 hover:bg-red-500/10 text-sm font-bold rounded-lg transition-colors border border-transparent cursor-pointer disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
      )}
      {isColumn && error && <p className="text-xs text-red-400 -mt-2">{error}</p>}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPick} />
    </div>
  );
};

export default AvatarUploader;
