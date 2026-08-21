import React from 'react';
import { 
  Play, 
  Sparkles, 
  Radio, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  Disc3,
  Waves,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { Track } from '../types';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onQuickPlay?: (track: Track) => void;
  onLogin?: () => void;
  onNavigateAuth?: (mode: 'signin' | 'signup') => void;
  featuredTracks?: Track[];
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onQuickPlay,
  onLogin,
  onNavigateAuth,
  featuredTracks = [],
}) => {
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC5MQV-SRgDrT91DXM7MZI7Ckm6GVxwuKvh9gGtPjZfw80KYJGI8C2VjFQyMRVMjjDJV1bI6Z3d_eBu1eg7FRmxM6upV-CZn1UTkJOJxnGnAiN1XLnGiWiO17_0QJjgxm9DAz8bySqnv4dguhgKa_tusxoWdhd-MHGTKiSGN7yFOigTUTLIPIcVpg-VAolY3YZ3iFXl6YGog3lZM4Q1FFx0OvBFjk6aZd1ayzJzM-YnRcHW33paa7x3';

  const handlePlayPreview = (track?: Track) => {
    if (track && onQuickPlay) {
      onQuickPlay(track);
    } else {
      onGetStarted();
    }
  };

  return (
    <div id="welcome-screen-container" className="flex flex-col gap-10 pb-28 max-w-6xl mx-auto text-left">
      {/* Hero Showcase Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#182300] via-[#141c00] to-[#0a1000] border border-white/10 shadow-2xl p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1000] via-[#0a1000]/70 to-transparent z-10" />
        <img
          src={heroImage}
          alt="Saregama Music"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />

        <div className="relative z-20 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1f2c00] border border-[#00fde7]/30 text-xs font-bold text-[#00fde7] uppercase tracking-wider mb-4 shadow-md">
            <Sparkles size={14} className="text-[#00fde7]" />
            <span>Pure Music & Soundscapes</span>
          </div>

          <h1 className="font-serif-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Music for <span className="text-[#00fde7]">Every Mood</span> & Soul.
          </h1>

          <p className="text-sm sm:text-base text-[#92b900] mt-4 leading-relaxed max-w-lg">
            A dependable, distraction-free environment for pure music, Hindi & Bollywood Lo-Fi, classical Indian ragas, and losslessly mastered soundscapes. Built for audiophiles and music lovers.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              id="welcome-get-started-btn"
              onClick={onGetStarted}
              className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-xl shadow-[#00fde7]/20 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <span>Explore Saregama</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handlePlayPreview(featuredTracks[0])}
              className="bg-[#141c00]/80 hover:bg-[#1f2a00] text-[#cafd1e] border border-white/10 hover:border-[#00fde7]/40 px-6 py-4 rounded-full font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Play size={16} fill="currentColor" />
              <span>Preview Hindi Lo-Fi Stream</span>
            </button>
          </div>

          {/* Quick Metrics / Value Props */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-white/5">
            <div>
              <div className="font-serif-heading font-extrabold text-xl sm:text-2xl text-white">40Hz</div>
              <div className="text-[11px] text-[#92b900] mt-0.5">Binaural Sound</div>
            </div>
            <div>
              <div className="font-serif-heading font-extrabold text-xl sm:text-2xl text-[#00fde7]">0 Ads</div>
              <div className="text-[11px] text-[#92b900] mt-0.5">Zero Interruptions</div>
            </div>
            <div>
              <div className="font-serif-heading font-extrabold text-xl sm:text-2xl text-white">FLAC</div>
              <div className="text-[11px] text-[#92b900] mt-0.5">Hi-Res Lossless</div>
            </div>
          </div>
        </div>

        {/* Floating Mini Vinyl Artwork Showcase */}
        <div className="relative z-20 w-full max-w-sm lg:max-w-md shrink-0">
          <div className="bg-[#141c00]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Disc3 size={16} className="text-[#00fde7] animate-spin" />
                <span>Now Streaming in Lossless</span>
              </div>
              <span className="text-[10px] text-[#00fde7] bg-[#00fde7]/10 px-2 py-0.5 rounded-full font-semibold">
                320 kbps Studio
              </span>
            </div>

            <div className="space-y-2.5">
              {(featuredTracks || []).slice(0, 3).map((track, i) => (
                <div
                  key={track.id}
                  onClick={() => handlePlayPreview(track)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0a1000] border border-white/5 hover:border-[#00fde7]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={track.coverUrl} alt={track.title} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-bold text-white group-hover:text-[#00fde7] transition-colors truncate">
                        {track.title}
                      </div>
                      <div className="text-[11px] text-[#92b900] truncate mt-0.5">
                        {track.artist}
                      </div>
                    </div>
                  </div>

                  <button className="w-8 h-8 rounded-full bg-[#1e2b00] group-hover:bg-[#00fde7] group-hover:text-[#00443d] text-[#cafd1e] flex items-center justify-center transition-colors shrink-0 ml-2">
                    <Play size={14} className="ml-0.5" fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141c00] rounded-3xl p-6 border border-white/5 text-left space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center text-[#00fde7]">
            <Waves size={24} />
          </div>
          <h3 className="font-serif-heading font-bold text-lg text-white">
            Time-of-Day Raga Prahar
          </h3>
          <p className="text-xs text-[#92b900] leading-relaxed">
            Automatic circadian synchronization playing dawn ragas in the morning, sunset sitar during twilight, and soothing midnight ragas at night.
          </p>
        </div>

        <div className="bg-[#141c00] rounded-3xl p-6 border border-white/5 text-left space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center text-[#00fde7]">
            <Headphones size={24} />
          </div>
          <h3 className="font-serif-heading font-bold text-lg text-white">
            Lossless Master Quality
          </h3>
          <p className="text-xs text-[#92b900] leading-relaxed">
            Crystal clear 320 kbps and FLAC lossless streams preserving every acoustic nuance of bansuri flutes, sitar strings, and warm vinyl texture.
          </p>
        </div>

        <div className="bg-[#141c00] rounded-3xl p-6 border border-white/5 text-left space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center text-[#00fde7]">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-serif-heading font-bold text-lg text-white">
            Protected Offline Vault
          </h3>
          <p className="text-xs text-[#92b900] leading-relaxed">
            Download your favorite Bollywood Lo-Fi tracks and classical albums directly into encrypted local storage for uninterrupted listening anywhere.
          </p>
        </div>
      </section>
    </div>
  );
};
