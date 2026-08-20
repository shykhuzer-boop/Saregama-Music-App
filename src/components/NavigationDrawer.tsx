import React from 'react';
import { ScreenName, UserProfile } from '../types';
import { 
  User, 
  Download, 
  History, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  Home, 
  Search, 
  Library as LibraryIcon,
  X,
  ShieldCheck,
  ShieldAlert,
  LogOut
} from 'lucide-react';

interface NavigationDrawerProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  user: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentScreen,
  onNavigate,
  user,
  isOpenMobile,
  onCloseMobile,
  onLogout
}) => {
  const [secretClickCount, setSecretClickCount] = React.useState(0);
  const secretClickTimerRef = React.useRef<number | null>(null);

  // Nav items without public admin exposure
  const navItems = [
    { id: 'home' as ScreenName, label: 'Home', icon: Home },
    { id: 'search' as ScreenName, label: 'Search', icon: Search },
    { id: 'library' as ScreenName, label: 'Library', icon: LibraryIcon },
    { id: 'profile' as ScreenName, label: 'My Profile', icon: User },
    { id: 'library' as ScreenName, label: 'Downloads', icon: Download },
    { id: 'history' as ScreenName, label: 'History', icon: History },
    { id: 'premium' as ScreenName, label: 'Pro Membership', icon: Sparkles, badge: 'PRO' },
    { id: 'help' as ScreenName, label: 'Help & FAQ', icon: HelpCircle },
  ];

  // If user is explicitly an admin, show a secluded, discreet item
  const isAdminUser = user.role === 'admin' || user.email === 'admin@saregama.com';

  const handleNavClick = (screen: ScreenName) => {
    onNavigate(screen);
    onCloseMobile();
  };

  const handleSecretLogoClick = () => {
    setSecretClickCount((prev) => {
      const next = prev + 1;
      if (secretClickTimerRef.current) clearTimeout(secretClickTimerRef.current);
      secretClickTimerRef.current = window.setTimeout(() => {
        setSecretClickCount(0);
      }, 2500);

      if (next >= 5) {
        handleNavClick('admin');
        return 0;
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div 
          id="mobile-drawer-backdrop"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-navigation-sidebar"
        className={`
          fixed inset-y-0 left-0 z-[80] w-64 bg-[#141c00] border-r border-white/5 shadow-2xl flex flex-col p-4
          transition-transform duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="flex md:hidden justify-between items-center mb-4 pb-2 border-b border-white/10">
          <span 
            onClick={handleSecretLogoClick}
            className="font-serif-heading font-bold text-xl text-[#00fde7] cursor-pointer select-none"
          >
            Saregama
          </span>
          <button 
            id="close-drawer-btn"
            onClick={onCloseMobile} 
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Header */}
        <div 
          id="sidebar-user-profile"
          onClick={() => handleNavClick('profile')}
          className="flex items-center gap-3.5 mb-5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#00fde7]/30 ring-2 ring-[#00fde7]/10">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="font-semibold text-sm text-white truncate">{user.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-[#92b900] truncate">
                {user.role === 'admin' ? 'Master Admin' : user.planName}
              </span>
              {user.isPro && (
                <span className="bg-[#ff5b5b] text-white px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase">
                  PRO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 flex-grow overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.label}
                id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left relative group
                  ${isActive 
                    ? 'bg-[#00fde7] text-[#00443d] font-bold shadow-md shadow-[#00fde7]/10' 
                    : 'text-[#92b900] hover:text-[#cafd1e] hover:bg-[#1f2a00]'
                  }
                `}
              >
                <Icon 
                  size={19} 
                  className={
                    isActive 
                      ? 'text-[#00443d]' 
                      : 'text-[#92b900] group-hover:text-[#cafd1e]'
                  } 
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isActive 
                      ? 'bg-[#00443d] text-[#00fde7]' 
                      : 'bg-[#ff5b5b] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-2 border-t border-white/5" />

          {onLogout && (
            <button
              id="nav-item-logout"
              onClick={onLogout}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#92b900] hover:text-[#ff5b5b] hover:bg-[#3a0d0d]/30 transition-colors text-left"
            >
              <LogOut size={16} />
              <span>Switch / Sign Out</span>
            </button>
          )}
        </nav>

        {/* Offline & Focus Mode Status Card with Secluded Secret Trigger */}
        <div className="mt-auto pt-3">
          <div className="bg-[#192300] border border-white/5 rounded-xl p-3 text-xs relative group">
            <div className="flex items-center justify-between text-[#cafd1e] mb-1">
              <span className="font-semibold flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#00fde7]" /> Ad-Free Active
              </span>
              <span className="text-[10px] text-[#00fde7]">Lossless</span>
            </div>
            <p className="text-[11px] text-[#92b900] leading-snug">
              Protected offline storage & 40Hz binaural audio active.
            </p>

            {/* Secret Inconspicuous Supervisor Keyhole Trigger */}
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#92b900]/70">
              <span 
                onClick={handleSecretLogoClick}
                className="cursor-pointer hover:text-[#cafd1e] select-none transition-colors"
                title="Saregama Music Engine"
              >
                v2.4.1 • Core Audio
              </span>
              <button
                id="secret-supervisor-keyhole-btn"
                onClick={handleSecretLogoClick}
                className="w-4 h-4 rounded-full flex items-center justify-center text-white/20 hover:text-[#ffb700] hover:bg-white/5 transition-all"
                title="Supervisor Access Gate"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-[#ffb700]" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
