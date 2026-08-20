import React, { useState } from 'react';
import { Track } from '../types';
import { 
  ChevronDown, 
  MoreVertical, 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Repeat, 
  Heart, 
  ListPlus, 
  Download, 
  Check, 
  Sliders, 
  Sparkles, 
  Volume2 
} from 'lucide-react';

interface FullScreenPlayerScreenProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  isLiked: boolean;
  onToggleLike: (trackId: string) => void;
  onDownloadTrack: (track: Track) => void;
  isDownloaded: boolean;
  onOpenPlaylistModal: (track: Track) => void;
  onPresetChange?: (preset: Track['audioPreset']) => void;
}

export const FullScreenPlayerScreen: React.FC<FullScreenPlayerScreenProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onClose,
  currentTime,
  duration,
  onSeek,
  isLiked,
  onToggleLike,
  onDownloadTrack,
  isDownloaded,
  onOpenPlaylistModal,
  onPresetChange,
}) => {
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [showSoundscapeMenu, setShowSoundscapeMenu] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleDownload = () => {
    onDownloadTrack(track);
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3000);
  };

  const soundPresets: { id: Track['audioPreset']; label: string; desc: string }[] = [
    { id: 'deep_ambient', label: 'Deep Cosmic Ambient', desc: 'Synthesized sine wave drone with warm reverb' },
    { id: 'binaural_flow', label: '40Hz Spatial Waves', desc: 'Cognitive brainwave carrier for immersive audio' },
    { id: 'lofi_synth', label: 'Warm Lo-Fi Chords', desc: 'Analog electric piano chords with vinyl flutter' },
    { id: 'piano_reverb', label: 'Cinematic Piano', desc: 'Minimalist resonant grand piano notes' },
    { id: 'rain_city', label: 'Monsoon Rain & Ambience', desc: 'Deep acoustic rain soundscape with gentle thunder' },
    { id: 'chill_pulse', label: 'Electronic Sub Pulse', desc: '120 BPM mellow rhythm with sub bass' },
  ];

  return (
    <div
      id="fullscreen-player-container"
      className="fixed inset-0 z-[100] bg-[#0a1000] text-[#cafd1e] player-gradient flex flex-col justify-between p-6 sm:p-8 md:p-12 overflow-y-auto"
    >
      {/* Top App Bar (Matching Image 7) */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between">
        <button
          id="fullscreen-close-btn"
          onClick={onClose}
          aria-label="Collapse Player"
          className="text-[#cafd1e] hover:text-[#00fde7] p-2 rounded-full hover:bg-white/5 transition-all active:scale-95"
        >
          <ChevronDown size={28} />
        </button>

        <div className="font-serif-heading font-extrabold text-xl md:text-2xl text-[#00fde7] tracking-tight">
          Saregama
        </div>

        <button
          id="fullscreen-more-btn"
          onClick={() => setShowSoundscapeMenu(!showSoundscapeMenu)}
          aria-label="Soundscape Options"
          className="text-[#cafd1e] hover:text-[#00fde7] p-2 rounded-full hover:bg-white/5 transition-all"
        >
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-4">
        {/* Album Art Centerpiece (Exact Mockup Styling) */}
        <div className="w-full aspect-square max-w-[340px] sm:max-w-[380px] rounded-2xl overflow-hidden ambient-album-glow relative group mb-8 border border-white/10">
          <img
            src={track.coverUrl}
            alt={track.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1000]/60 via-transparent to-transparent" />
          
          {isPlaying && (
            <div className="absolute bottom-3 right-3 bg-[#0a1000]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#00fde7]/40 flex items-center gap-1.5 text-xs text-[#00fde7]">
              <span className="w-2 h-2 rounded-full bg-[#00fde7] animate-ping" />
              <span>Live Synth Engine</span>
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="w-full text-center flex flex-col items-center mb-6">
          <h1 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-white mb-1.5 tracking-tight px-4 truncate max-w-full">
            {track.title}
          </h1>
          <h2 className="text-base sm:text-lg text-[#92b900] flex items-center justify-center gap-2">
            <span>{track.artist}</span>
            {track.isPro && (
              <span className="bg-[#ff5b5b] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                PRO
              </span>
            )}
          </h2>
        </div>

        {/* Playback Progress Seek Bar */}
        <div className="w-full flex flex-col gap-2 mb-6 px-2">
          <div
            id="fullscreen-seek-bar"
            onClick={handleSeekClick}
            className="h-1.5 sm:h-2 bg-[#1f2a00] rounded-full w-full relative cursor-pointer group"
          >
            <div
              style={{ width: `${progressPercent}%` }}
              className="absolute top-0 left-0 h-full bg-[#00fde7] rounded-full transition-all duration-150 group-hover:bg-[#49dbf4]"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_12px_#00fde7] -mr-1.5" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-[#92b900] font-medium px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Controls Row */}
        <div className="flex items-center justify-between w-full px-4 mb-6">
          <button
            id="fullscreen-shuffle-btn"
            onClick={() => setIsShuffle(!isShuffle)}
            aria-label="Toggle Shuffle"
            className={`p-2 transition-colors ${
              isShuffle ? 'text-[#00fde7]' : 'text-[#92b900] hover:text-[#cafd1e]'
            }`}
          >
            <Shuffle size={22} />
          </button>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              id="fullscreen-prev-btn"
              onClick={onPrev}
              aria-label="Previous Track"
              className="text-[#cafd1e] hover:text-[#00fde7] p-2 transition-transform active:scale-90"
            >
              <SkipBack size={32} fill="currentColor" />
            </button>

            {/* Big Circular Cyan Play/Pause Button */}
            <button
              id="fullscreen-main-play-pause-btn"
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-18 h-18 sm:w-20 sm:h-20 bg-[#00fde7] text-[#00443d] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,253,231,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause size={34} fill="#00443d" />
              ) : (
                <Play size={34} className="ml-1" fill="#00443d" />
              )}
            </button>

            <button
              id="fullscreen-next-btn"
              onClick={onNext}
              aria-label="Next Track"
              className="text-[#cafd1e] hover:text-[#00fde7] p-2 transition-transform active:scale-90"
            >
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>

          <button
            id="fullscreen-repeat-btn"
            onClick={() => setRepeatMode(repeatMode === 'all' ? 'one' : repeatMode === 'one' ? 'off' : 'all')}
            aria-label="Toggle Repeat"
            className={`p-2 transition-colors ${
              repeatMode !== 'off' ? 'text-[#00fde7]' : 'text-[#92b900] hover:text-[#cafd1e]'
            }`}
          >
            <Repeat size={22} />
          </button>
        </div>

        {/* Secondary Actions Row (Heart, Playlist Add, Download) */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 text-[#92b900]">
          <button
            id="fullscreen-fav-btn"
            onClick={() => onToggleLike(track.id)}
            aria-label="Like Track"
            className={`p-2 hover:scale-110 transition-transform ${
              isLiked ? 'text-[#ff5b5b]' : 'hover:text-[#ff5b5b]'
            }`}
          >
            <Heart size={24} fill={isLiked ? '#ff5b5b' : 'none'} />
          </button>

          <button
            id="fullscreen-add-playlist-btn"
            onClick={() => onOpenPlaylistModal(track)}
            aria-label="Add to Playlist"
            className="p-2 hover:text-[#00fde7] hover:scale-110 transition-transform"
          >
            <ListPlus size={24} />
          </button>

          <button
            id="fullscreen-download-btn"
            onClick={handleDownload}
            aria-label="Download Track Offline"
            className={`p-2 hover:scale-110 transition-transform ${
              isDownloaded ? 'text-[#00fde7]' : 'hover:text-[#00fde7]'
            }`}
          >
            {isDownloaded ? <Check size={24} /> : <Download size={24} />}
          </button>
        </div>
      </main>

      {/* Soundscape Synthesizer Drawer Modal */}
      {showSoundscapeMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#141c00] border border-[#00fde7]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-[#00fde7]" />
                <h3 className="font-serif-heading font-bold text-lg text-white">
                  Synthesizer Soundscape Mode
                </h3>
              </div>
              <button
                onClick={() => setShowSoundscapeMenu(false)}
                className="text-xs text-[#92b900] hover:text-white px-2 py-1"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#92b900] mb-4">
              Select real-time sound engine mode. The audio synthesizer automatically retunes to your chosen frequencies.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {soundPresets.map((preset) => {
                const isCurrent = track.audioPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      if (onPresetChange) onPresetChange(preset.id);
                      setShowSoundscapeMenu(false);
                    }}
                    className={`
                      w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3
                      ${isCurrent 
                        ? 'bg-[#00fde7]/10 border-[#00fde7] text-[#00fde7]' 
                        : 'bg-[#0f1600] border-white/5 text-[#cafd1e] hover:border-[#00fde7]/40'
                      }
                    `}
                  >
                    <Sparkles size={16} className={isCurrent ? 'text-[#00fde7] mt-0.5' : 'text-[#92b900] mt-0.5'} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{preset.label}</div>
                      <div className="text-xs text-[#92b900]">{preset.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Download Success Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#00fde7] text-[#00443d] font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in-up">
          <Check size={16} />
          <span>Track saved to Protected Offline Library</span>
        </div>
      )}
    </div>
  );
};
