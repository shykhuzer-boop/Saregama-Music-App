import React from 'react';
import { Home, Search, Library as LibraryIcon, Award } from 'lucide-react';
import { ScreenName } from '../types';

interface BottomNavBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const tabs = [
    { id: 'home' as ScreenName, label: 'Home', icon: Home },
    { id: 'search' as ScreenName, label: 'Search', icon: Search },
    { id: 'library' as ScreenName, label: 'Library', icon: LibraryIcon },
    { id: 'premium' as ScreenName, label: 'Premium', icon: Award, hasBadge: true },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141c00]/95 backdrop-blur-lg border-t border-white/5 flex justify-around items-center h-16 px-2 pb-safe shadow-2xl"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;

        return (
          <button
            key={tab.id}
            id={`bottom-nav-tab-${tab.id}`}
            onClick={() => onNavigate(tab.id)}
            className={`
              flex flex-col items-center justify-center transition-all duration-200 relative
              ${isActive 
                ? 'bg-[#00fde7] text-[#00443d] rounded-full px-5 py-1 scale-95 shadow-md shadow-[#00fde7]/20 font-bold' 
                : 'text-[#92b900] hover:text-[#cafd1e] scale-95 active:scale-90 px-3 py-1'
              }
            `}
          >
            <Icon 
              size={20} 
              className={isActive ? 'text-[#00443d]' : 'text-[#92b900]'} 
            />
            <span className={`text-[11px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
            {tab.hasBadge && !isActive && (
              <span className="absolute top-1 right-2.5 w-2 h-2 bg-[#ff5b5b] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
