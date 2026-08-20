import React from 'react';
import { Menu, Search, Sparkles } from 'lucide-react';
import { ScreenName, UserProfile } from '../types';

interface TopAppBarProps {
  onOpenMenu: () => void;
  onNavigate: (screen: ScreenName) => void;
  user: UserProfile;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  isPlaying?: boolean;
  onSecretAdminTrigger?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenMenu,
  onNavigate,
  user,
  searchQuery = '',
  onSearchChange,
  isPlaying = false,
  onSecretAdminTrigger,
}) => {
  const [logoClicks, setLogoClicks] = React.useState(0);
  const clickTimerRef = React.useRef<number | null>(null);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = window.setTimeout(() => {
        setLogoClicks(0);
      }, 2500);

      if (next >= 5) {
        if (onSecretAdminTrigger) {
          onSecretAdminTrigger();
        } else {
          onNavigate('admin');
        }
        return 0;
      }
      return next;
    });
  };

  return (
    <header 
      id="top-app-bar"
      className="w-full sticky top-0 z-40 bg-[#0a1000]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 border-b border-white/5"
    >
      {/* Left Branding / Menu */}
      <div className="flex items-center gap-3.5">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMenu}
          aria-label="Open Menu"
          className="md:hidden text-[#00fde7] hover:opacity-80 p-1.5 rounded-lg active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>

        <div 
          onClick={handleLogoClick}
          className="cursor-pointer flex items-center gap-2 group select-none"
          title="Saregama Music"
        >
          <h1 className="font-serif-heading font-bold text-2xl md:text-3xl text-[#00fde7] tracking-tight group-hover:opacity-90 transition-opacity">
            Saregama
          </h1>
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-[#00fde7] animate-pulse rounded-full" />
              <span className="w-1 h-4 bg-[#49dbf4] animate-pulse delay-75 rounded-full" />
              <span className="w-1 h-2 bg-[#cafd1e] animate-pulse delay-150 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Center Search Input (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
          <input
            type="text"
            id="desktop-quick-search-input"
            value={searchQuery}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            onFocus={() => onNavigate('search')}
            placeholder="Search Hindi songs, ragas, artists, albums..."
            className="w-full bg-[#141c00] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-[#cafd1e] placeholder:text-[#92b900] focus:border-[#00fde7] focus:ring-1 focus:ring-[#00fde7] outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions / Profile Avatar */}
      <div className="flex items-center gap-3">
        <button
          id="topbar-pro-badge-btn"
          onClick={() => onNavigate('premium')}
          className="hidden sm:flex items-center gap-1.5 bg-[#1f2a00] hover:bg-[#2c3a00] border border-[#00fde7]/30 text-[#00fde7] px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105"
        >
          <Sparkles size={13} className="text-[#ff5b5b]" />
          <span>Pro Membership</span>
        </button>

        <button
          id="topbar-profile-avatar-btn"
          onClick={() => onNavigate('profile')}
          aria-label="View Profile"
          className="w-9 h-9 rounded-full overflow-hidden border border-white/10 hover:border-[#00fde7] ring-1 ring-white/5 transition-all"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
