import React from 'react';
import { Track } from '../types';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  Volume2, 
  VolumeX, 
  Maximize2 
} from 'lucide-react';

interface GlobalPlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenFullScreen: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isLiked: boolean;
  onToggleLike: (trackId: string) => void;
}

export const GlobalPlayerBar: React.FC<GlobalPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onOpenFullScreen,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isLiked,
  onToggleLike,
}) => {
  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div
      id="global-playback-bar"
      className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 z-40 bg-[#141c00]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl flex flex-col transition-all"
    >
      {/* Top Progress Bar */}
      <div
        id="player-progress-bar-container"
        onClick={handleProgressBarClick}
        className="w-full h-1.5 bg-[#1f2a00] hover:h-2.5 transition-all cursor-pointer relative group"
      >
        <div
          id="player-progress-fill"
          style={{ width: `${progressPercent}%` }}
          className="h-full bg-[#00fde7] relative transition-all duration-150 group-hover:bg-[#49dbf4]"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#00fde7] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main Bar Controls */}
      <div className="flex items-center justify-between px-3 md:px-6 py-2.5 h-16 md:h-18">
        {/* Left: Now Playing Info (Clickable to open Full Screen) */}
        <div 
          id="mini-player-track-info"
          onClick={onOpenFullScreen}
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#0f1600] relative border border-white/5 group-hover:scale-105 transition-transform">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="truncate text-left">
            <div className="font-semibold text-sm text-white group-hover:text-[#00fde7] transition-colors truncate flex items-center gap-1.5">
              <span>{currentTrack.title}</span>
              {currentTrack.isPro && (
                <span className="bg-[#ff5b5b] text-white text-[8px] px-1 py-0.2 rounded font-bold uppercase">
                  PRO
                </span>
              )}
            </div>
            <div className="text-xs text-[#92b900] truncate">
              {currentTrack.artist} • <span className="text-[#cafd1e]/80">{currentTrack.genre}</span>
            </div>
          </div>

          <button
            id="mini-player-like-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(currentTrack.id);
            }}
            className={`hidden sm:flex ml-2 p-1.5 rounded-full transition-colors ${
              isLiked ? 'text-[#ff5b5b]' : 'text-[#92b900] hover:text-white'
            }`}
          >
            <Heart size={18} fill={isLiked ? '#ff5b5b' : 'none'} />
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button
            id="mini-player-prev-btn"
            onClick={onPrev}
            aria-label="Previous Track"
            className="text-[#cafd1e] hover:text-[#00fde7] p-1.5 rounded-full transition-colors active:scale-95"
          >
            <SkipBack size={20} />
          </button>

          <button
            id="mini-player-play-pause-btn"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#00fde7] text-[#00443d] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-[#00fde7]/20 font-bold"
          >
            {isPlaying ? (
              <Pause size={20} fill="#00443d" />
            ) : (
              <Play size={20} className="ml-0.5" fill="#00443d" />
            )}
          </button>

          <button
            id="mini-player-next-btn"
            onClick={onNext}
            aria-label="Next Track"
            className="text-[#cafd1e] hover:text-[#00fde7] p-1.5 rounded-full transition-colors active:scale-95"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Right: Volume & Expand (Desktop) */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-3.5">
          <button
            id="mini-player-mute-btn"
            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
            className="text-[#92b900] hover:text-[#00fde7] transition-colors"
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div className="w-24 h-1.5 bg-[#1f2a00] rounded-full overflow-hidden relative cursor-pointer group">
            <input
              type="range"
              id="mini-player-volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-full opacity-0 absolute inset-0 cursor-pointer z-10"
            />
            <div
              style={{ width: `${volume * 100}%` }}
              className="h-full bg-[#cafd1e] group-hover:bg-[#00fde7] transition-colors"
            />
          </div>

          <button
            id="mini-player-expand-btn"
            onClick={onOpenFullScreen}
            aria-label="Open Fullscreen Player"
            className="text-[#92b900] hover:text-[#00fde7] p-1.5 rounded-lg hover:bg-white/5 transition-all ml-1"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
