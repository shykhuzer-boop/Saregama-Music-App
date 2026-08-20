import React, { useState } from 'react';
import { UserProfile, Track } from '../types';
import { 
  User, 
  Mail, 
  Sparkles, 
  HardDrive, 
  Volume2, 
  Wifi, 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  Sliders, 
  Check, 
  Radio
} from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigatePremium: () => void;
  tracks: Track[];
  onClearOfflineData: () => void;
  onNavigateAdmin?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigatePremium,
  tracks,
  onClearOfflineData,
  onNavigateAdmin,
}) => {
  const [name, setName] = useState(user.name);
  const [isSaved, setIsSaved] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const secretClickTimer = React.useRef<number | null>(null);

  const downloadedCount = tracks.filter(t => t.isDownloaded).length;
  const storagePercent = Math.min(100, Math.round((user.offlineStorageUsedMB / user.maxStorageMB) * 100));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSecretVersionClick = () => {
    setSecretClicks((prev) => {
      const next = prev + 1;
      if (secretClickTimer.current) clearTimeout(secretClickTimer.current);
      secretClickTimer.current = window.setTimeout(() => setSecretClicks(0), 2000);
      if (next >= 5) {
        if (onNavigateAdmin) onNavigateAdmin();
        return 0;
      }
      return next;
    });
  };

  return (
    <div id="profile-screen-container" className="flex flex-col gap-8 pb-32 max-w-3xl mx-auto text-left">
      {/* Profile Header Hero */}
      <div className="bg-[#141c00] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#00fde7]/40 ring-4 ring-[#00fde7]/10 shadow-2xl">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </div>
          {user.isPro && (
            <span className="absolute bottom-0 right-0 bg-[#ff5b5b] text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              PRO
            </span>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif-heading font-extrabold text-2xl md:text-3xl text-white">
                {user.name}
              </h2>
              <p className="text-xs text-[#92b900] mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={13} />
                <span>{user.email}</span>
              </p>
            </div>

            <button
              onClick={onNavigatePremium}
              className="inline-flex items-center gap-1.5 bg-[#192300] hover:bg-[#00fde7] hover:text-[#00443d] border border-[#00fde7]/30 text-[#00fde7] px-4 py-1.5 rounded-full text-xs font-bold transition-all self-center sm:self-auto"
            >
              <Sparkles size={13} className="text-[#ff5b5b]" />
              <span>{user.planName}</span>
            </button>
          </div>

          <p className="text-xs text-[#cafd1e] mt-4 leading-relaxed bg-[#0a1000] p-3 rounded-xl border border-white/5">
            🎓 Student ID Verified: Continuous Ad-Free Music Streaming with Lossless Master Audio enabled.
          </p>
        </div>
      </div>

      {/* Account Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#141c00] rounded-3xl p-6 border border-white/5 space-y-4">
        <h3 className="font-serif-heading font-bold text-lg text-white mb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#92b900] font-semibold block mb-1.5">Full Name</label>
            <input
              type="text"
              id="profile-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cafd1e] outline-none focus:border-[#00fde7]"
            />
          </div>

          <div>
            <label className="text-xs text-[#92b900] font-semibold block mb-1.5">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-[#0a1000]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#92b900] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {isSaved ? (
            <span className="text-xs text-[#00fde7] flex items-center gap-1">
              <Check size={14} /> Changes saved successfully
            </span>
          ) : <span />}

          <button
            type="submit"
            id="save-profile-btn"
            className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#00fde7]/20"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Audio Streaming & Download Quality */}
      <div className="bg-[#141c00] rounded-3xl p-6 border border-white/5 space-y-5">
        <h3 className="font-serif-heading font-bold text-lg text-white flex items-center gap-2">
          <Volume2 size={18} className="text-[#00fde7]" />
          <span>Playback & Audio Quality</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['Normal (160kbps)', 'High (320kbps)', 'Hi-Res Lossless (FLAC)'] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onUpdateUser({ audioQuality: q })}
              className={`
                p-3.5 rounded-2xl border text-left transition-all
                ${user.audioQuality === q
                  ? 'bg-[#00fde7]/10 border-[#00fde7] text-[#00fde7]'
                  : 'bg-[#0a1000] border-white/5 text-[#cafd1e] hover:border-white/20'
                }
              `}
            >
              <div className="text-xs font-bold">{q}</div>
              <div className="text-[10px] text-[#92b900] mt-1">
                {q.includes('FLAC') ? '24-bit Studio Master' : q.includes('320') ? 'Crystal High Fidelity' : 'Data Saver'}
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            <Wifi size={18} className="text-[#00fde7]" />
            <div>
              <div className="text-xs font-semibold text-white">Download only on Wi-Fi</div>
              <div className="text-[10px] text-[#92b900]">Prevent cellular data usage when downloading albums</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateUser({ downloadOnlyOnWifi: !user.downloadOnlyOnWifi })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              user.downloadOnlyOnWifi ? 'bg-[#00fde7]' : 'bg-[#1f2a00]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#00443d] transition-transform ${
                user.downloadOnlyOnWifi ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Protected Storage Management */}
      <div className="bg-[#141c00] rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif-heading font-bold text-lg text-white flex items-center gap-2">
            <HardDrive size={18} className="text-[#00fde7]" />
            <span>Protected Offline Storage</span>
          </h3>
          <span className="text-xs text-[#00fde7] font-semibold">
            {downloadedCount} Albums & Tracks
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-[#92b900] mb-1.5">
            <span>{(user.offlineStorageUsedMB / 1024).toFixed(2)} GB used</span>
            <span>{(user.maxStorageMB / 1024).toFixed(0)} GB total</span>
          </div>
          <div className="w-full h-2 bg-[#0a1000] rounded-full overflow-hidden">
            <div style={{ width: `${storagePercent}%` }} className="h-full bg-[#00fde7] rounded-full" />
          </div>
        </div>

        <button
          type="button"
          onClick={onClearOfflineData}
          className="text-xs text-[#ff5b5b] hover:underline flex items-center gap-1.5 pt-1"
        >
          <Trash2 size={13} />
          <span>Clear offline cache to free up disk space</span>
        </button>
      </div>

      {/* Account Actions & Secluded Admin Portal Entry */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-semibold text-[#ff5b5b] hover:bg-[#ff5b5b]/10 px-4 py-2.5 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out of Saregama</span>
        </button>

        <div className="flex items-center gap-2">
          <span 
            onClick={handleSecretVersionClick}
            className="text-[11px] text-[#92b900] cursor-pointer hover:text-[#cafd1e] select-none transition-colors"
            title="Saregama Music Architecture"
          >
            Saregama v2.4 • Build 2026.08
          </span>
        </div>
      </div>
    </div>
  );
};
