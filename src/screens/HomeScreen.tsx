import React, { useState, useEffect } from 'react';
import { Track, UserProfile } from '../types';
import {
  Play,
  Pause,
  PlayCircle,
  Radio,
  Flame,
  Sparkles,
  Timer,
  Clock,
  Volume2,
  Headphones,
  Compass,
  CheckCircle2,
  RotateCcw,
  Zap,
  Music2,
  Disc3,
  Waves,
  Moon
} from 'lucide-react';

interface HomeScreenProps {
  user: UserProfile;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onOpenPlaylist: (playlistId: string) => void;
  onNavigateSearch: () => void;
  tracks: Track[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onOpenPlaylist,
  tracks,
}) => {
  // --- STATE FOR PLAYBACK & SLEEP TIMER ---
  const [timerSeconds, setTimerSeconds] = useState<number>(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // in minutes
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  // --- TIME OF DAY / RAGA PRAHAR DETECTION ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Sleep / Playback Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Timer finished - auto reset
      setTimerSeconds(selectedDuration * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, selectedDuration]);

  const toggleTimer = () => {
    if (!isTimerRunning && !isPlaying && hindiLofiHeroTrack) {
      // Auto-start music if not playing
      onPlayTrack(hindiLofiHeroTrack);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSelectDuration = (mins: number) => {
    setSelectedDuration(mins);
    setIsTimerRunning(false);
    setTimerSeconds(mins * 60);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine current Prahar & greeting based on real hour
  const currentHour = currentTime.getHours();
  let timeGreeting = 'Good Morning';
  let praharInfo = {
    raga: 'Raag Bhairav / Bhairavi',
    benefit: 'Dawn Melodies & Harmonious Awakening',
    timeLabel: 'Pratham Prahar (Dawn)',
    trackKey: 'track-hi-2'
  };

  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = 'Good Afternoon';
    praharInfo = {
      raga: 'Raag Sarang / Shuddh Sarang',
      benefit: 'Mid-Day Classical Melodies & Relaxation',
      timeLabel: 'Madhyahna Prahar (Afternoon)',
      trackKey: 'track-hi-1'
    };
  } else if (currentHour >= 17 && currentHour < 21) {
    timeGreeting = 'Good Evening';
    praharInfo = {
      raga: 'Raag Yaman / Kalyan',
      benefit: 'Sunset Strings & Peaceful Harmony',
      timeLabel: 'Sandhya Prahar (Sunset/Evening)',
      trackKey: 'track-hi-6'
    };
  } else if (currentHour >= 21 || currentHour < 4) {
    timeGreeting = 'Good Night';
    praharInfo = {
      raga: 'Raag Darbari / Malkauns',
      benefit: 'Late Night Melodies & Deep Solitude',
      timeLabel: 'Nishitha Prahar (Midnight)',
      trackKey: 'track-hi-4'
    };
  }

  // Key track lookups
  const hindiLofiHeroTrack = tracks.find(t => t.id === 'track-hi-1') || tracks[0];
  const ragaHeroTrack = tracks.find(t => t.id === praharInfo.trackKey) || tracks[1];
  const deepAmbientTrack = tracks.find(t => t.id === 'track-4') || tracks[3];
  const harmonicResonanceTrack = tracks.find(t => t.id === 'track-2') || tracks[1];
  const midnightCityTrack = tracks.find(t => t.id === 'track-3') || tracks[2];

  // Hindi specific lists
  const hindiTracks = tracks.filter(t => t.language === 'Hindi' || t.genre === 'Hindi & Bollywood');
  const classicalRagasTracks = tracks.filter(t => t.genre === 'Classical & Ragas' || t.genre === 'Sufi & Devotional');

  return (
    <div id="home-screen-container" className="flex flex-col gap-8 pb-36 max-w-7xl mx-auto w-full">
      {/* 1. TOP GREETING & REAL-TIME PRAHAR BANNER */}
      <section id="welcome-greeting-section" className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-gradient-to-r from-[#141c00] via-[#182200] to-[#0f1600] p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow orb in background */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#00fde7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#cafd1e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-left">
          <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#1e2b00] border border-[#00fde7]/30 text-xs text-[#00fde7] font-medium shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00fde7] animate-pulse" />
            <span>Saregama Lossless Audio Matrix • Active</span>
            <span className="text-white/30">•</span>
            <span className="text-[#cafd1e]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h2 className="font-serif-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            {timeGreeting}, <span className="text-[#00fde7]">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-sm text-[#92b900] mt-1.5 flex items-center gap-2">
            <Sparkles size={16} className="text-[#cafd1e] shrink-0" />
            <span>Immersive Hindi & Bollywood hits, Indian Classical Ragas & high-fidelity soundscapes.</span>
          </p>
        </div>

        {/* Real-time Indian Raga Prahar Sync Widget */}
        <div className="relative z-10 shrink-0 bg-[#0a1000]/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#00fde7]/20 flex items-center gap-3.5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00fde7]/20 to-[#cafd1e]/20 border border-[#00fde7]/40 flex items-center justify-center text-[#00fde7] shrink-0">
            <Waves size={24} className={isPlaying ? 'animate-pulse text-[#cafd1e]' : ''} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#00fde7]/10 text-[#00fde7] border border-[#00fde7]/20">
                {praharInfo.timeLabel}
              </span>
            </div>
            <p className="text-xs font-bold text-white mt-1">{praharInfo.raga}</p>
            <p className="text-[11px] text-[#92b900] line-clamp-1">{praharInfo.benefit}</p>
          </div>
          <button
            onClick={() => onPlayTrack(ragaHeroTrack)}
            title={`Play ${praharInfo.raga}`}
            className="w-10 h-10 rounded-full bg-[#00fde7] hover:bg-[#cafd1e] text-[#00443d] flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            {currentTrack?.id === ragaHeroTrack.id && isPlaying ? (
              <Pause size={18} fill="#00443d" />
            ) : (
              <Play size={18} className="ml-0.5" fill="#00443d" />
            )}
          </button>
        </div>
      </section>

      {/* 2. MOOD & GENRE FILTER PILLS */}
      <section id="mood-filters-section" className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: '🔥 Top Trending Songs' },
          { id: 'hindi', label: '🇮🇳 Hindi & Bollywood Hits' },
          { id: 'ragas', label: '🪕 Indian Classical Ragas' },
          { id: 'sufi', label: '✨ Sufi Sanctuary (432Hz)' },
          { id: 'binaural', label: '🧠 Binaural & Ambient' },
          { id: 'lofi', label: '☕ Late Night Chill & Lo-Fi' },
        ].map((pill) => {
          const isActive = selectedMoodFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedMoodFilter(pill.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border whitespace-nowrap shadow-sm ${
                isActive
                  ? 'bg-[#00fde7] text-[#00443d] border-[#00fde7] shadow-md shadow-[#00fde7]/20 scale-105'
                  : 'bg-[#141c00] text-[#cafd1e] border-white/10 hover:border-[#00fde7]/40 hover:bg-[#192300]'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </section>

      {/* 3. HERO SPOTLIGHT & PLAYBACK SLEEP TIMER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Spotlight: Kesariya Lo-Fi / Featured Bollywood Hit (Spans 7 cols) */}
        <div
          id="hindi-lofi-hero-banner"
          className="lg:col-span-7 bg-gradient-to-br from-[#1a2400] via-[#141c00] to-[#0a1000] rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl flex flex-col justify-between group min-h-[340px] text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1000]/90 via-[#0a1000]/60 to-transparent z-10" />
          <img
            src={hindiLofiHeroTrack.coverUrl}
            alt={hindiLofiHeroTrack.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700 pointer-events-none"
          />

          {/* Top Tag & Acoustic Badge */}
          <div className="relative z-20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                <Flame size={13} className="text-amber-400" />
                <span>#1 Trending in India</span>
              </span>
              <span className="bg-[#00fde7]/20 text-[#00fde7] border border-[#00fde7]/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                40Hz ACOUSTIC MASTER
              </span>
            </div>

            {/* Visualizer audio bars when playing */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-5 px-2.5 py-1 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="w-1 bg-[#00fde7] rounded-full animate-[bounce_0.8s_infinite_100ms] h-4" />
                <span className="w-1 bg-[#cafd1e] rounded-full animate-[bounce_0.8s_infinite_300ms] h-3" />
                <span className="w-1 bg-[#00fde7] rounded-full animate-[bounce_0.8s_infinite_200ms] h-5" />
                <span className="w-1 bg-[#cafd1e] rounded-full animate-[bounce_0.8s_infinite_400ms] h-2" />
              </div>
            )}
          </div>

          {/* Title and Metadata */}
          <div className="relative z-20 my-6">
            <h3 className="font-serif-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#00fde7] transition-colors leading-tight">
              {hindiLofiHeroTrack.title}
            </h3>
            <p className="text-sm sm:text-base text-[#cafd1e] font-medium mt-1">
              {hindiLofiHeroTrack.artist}
            </p>
            <p className="text-xs sm:text-sm text-[#92b900] mt-2 max-w-lg leading-relaxed line-clamp-2">
              {hindiLofiHeroTrack.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-20 flex flex-wrap items-center gap-3">
            <button
              id="hero-play-hindi-track-btn"
              onClick={() => onPlayTrack(hindiLofiHeroTrack)}
              className="bg-[#00fde7] hover:bg-[#cafd1e] text-[#00443d] px-6 py-3 rounded-full font-bold text-sm shadow-xl shadow-[#00fde7]/20 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              {currentTrack?.id === hindiLofiHeroTrack.id && isPlaying ? (
                <>
                  <Pause size={18} fill="#00443d" />
                  <span>Pause Music Stream</span>
                </>
              ) : (
                <>
                  <Play size={18} className="ml-0.5" fill="#00443d" />
                  <span>Start Hindi Lo-Fi Stream</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenPlaylist('pl-hindi-lofi')}
              className="bg-[#141c00]/80 hover:bg-[#1f2a00] text-[#cafd1e] border border-white/10 hover:border-[#00fde7]/40 px-5 py-3 rounded-full font-semibold text-xs transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Disc3 size={16} className="text-[#00fde7]" />
              <span>Explore Bollywood Lo-Fi Album</span>
            </button>
          </div>
        </div>

        {/* Smart Playback & Sleep Timer Widget (Spans 5 cols) */}
        <div
          id="sleep-timer-card"
          className="lg:col-span-5 bg-[#141c00] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden text-left"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center text-[#00fde7]">
                <Moon size={18} />
              </div>
              <div>
                <h4 className="font-serif-heading font-bold text-white text-base">Sleep & Playback Timer</h4>
                <p className="text-[11px] text-[#92b900]">Auto-fade playback for bedtime & relaxation</p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex bg-[#0a1000] p-1 rounded-xl border border-white/5">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSelectDuration(mins)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDuration === mins ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Digital Timer Display */}
          <div className="text-center my-4 py-4 px-6 bg-[#0a1000]/60 rounded-2xl border border-white/5 relative">
            <span className="font-mono font-black text-5xl sm:text-6xl text-white tracking-widest block drop-shadow-md">
              {formatTimer(timerSeconds)}
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-[#00fde7] animate-ping' : 'bg-[#92b900]'}`} />
              <span className="text-xs font-medium text-[#92b900]">
                {isTimerRunning ? 'Timer active • Auto-fading at zero' : 'Set listening duration'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              id="playback-timer-toggle-btn"
              onClick={toggleTimer}
              className={`flex-1 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-black'
                  : 'bg-[#00fde7] hover:bg-[#cafd1e] text-[#00443d]'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause size={16} fill="currentColor" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  <span>Start {selectedDuration}m Listening Timer</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleSelectDuration(selectedDuration)}
              title="Reset Timer"
              className="p-3 rounded-full bg-[#1e2b00] hover:bg-[#283800] text-[#92b900] hover:text-white border border-white/10 transition-all"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HINDI & BOLLYWOOD SECTION */}
      <section id="hindi-bollywood-section" className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase">
                Trending In India
              </span>
            </div>
            <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-white mt-1 flex items-center gap-2">
              <span>🇮🇳 Hindi & Bollywood Melodies</span>
            </h3>
          </div>
          <button
            onClick={() => onOpenPlaylist('pl-hindi-lofi')}
            className="text-xs text-[#00fde7] hover:text-[#cafd1e] hover:underline font-bold transition-colors"
          >
            See all Hindi tracks →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {hindiTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                id={`track-card-${track.id}`}
                onClick={() => onPlayTrack(track)}
                className={`bg-[#141c00] rounded-2xl p-3 border transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg relative hover:-translate-y-1 ${
                  isThisPlaying ? 'border-[#00fde7] bg-[#192300]' : 'border-white/5 hover:border-[#00fde7]/40'
                }`}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#0f1600]">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {track.isPro && (
                    <span className="absolute top-2 right-2 bg-[#ff5b5b] text-white px-2 py-0.5 rounded-md text-[9px] font-extrabold z-10 uppercase tracking-wider shadow-md">
                      PRO
                    </span>
                  )}
                  {track.moodTag && (
                    <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[#cafd1e] px-2 py-0.5 rounded text-[10px] font-semibold z-10">
                      {track.moodTag}
                    </span>
                  )}
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                      isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="w-12 h-12 bg-[#00fde7] rounded-full flex items-center justify-center text-[#00443d] shadow-xl transform transition-transform group-hover:scale-110">
                      {isThisPlaying ? <Pause size={20} fill="#00443d" /> : <Play size={20} className="ml-0.5" fill="#00443d" />}
                    </div>
                  </div>
                </div>

                <div className="px-1 pb-1 text-left">
                  <h4 className="font-bold text-sm text-white group-hover:text-[#00fde7] transition-colors truncate">
                    {track.title}
                  </h4>
                  <p className="text-xs text-[#92b900] truncate mt-0.5 font-medium">
                    {track.artist}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#cafd1e]/70 mt-2 pt-2 border-t border-white/5">
                    <span>{track.genre}</span>
                    <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SACRED INDIAN RAGAS & ACOUSTIC HERITAGE SECTION */}
      <section id="sacred-ragas-section" className="bg-gradient-to-br from-[#121800] to-[#0a1000] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl text-left">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2700] border border-[#cafd1e]/30 text-xs text-[#cafd1e] font-semibold mb-2">
              <Compass size={14} />
              <span>Time-of-Day Indian Prahar Traditions</span>
            </div>
            <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-white">
              Sacred Indian Ragas & Acoustic Heritage (Bansuri, Sitar, Tanpura)
            </h3>
            <p className="text-xs sm:text-sm text-[#92b900] mt-1">
              Timeless melodies curated to match the natural circadian rhythm of dawn, day, twilight, and night.
            </p>
          </div>

          <button
            onClick={() => onOpenPlaylist('pl-ragas-focus')}
            className="shrink-0 bg-[#1e2b00] hover:bg-[#00fde7] hover:text-[#00443d] border border-[#00fde7]/30 text-[#00fde7] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>View All Ragas</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classicalRagasTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`bg-[#0e1400] rounded-2xl p-3.5 border transition-all duration-300 flex items-center gap-4 group cursor-pointer hover:border-[#00fde7]/50 ${
                  isThisPlaying ? 'border-[#00fde7] bg-[#162000]' : 'border-white/5'
                }`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0a1000]">
                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <div className="w-8 h-8 rounded-full bg-[#00fde7] flex items-center justify-center text-[#00443d]">
                      {isThisPlaying ? <Pause size={14} fill="#00443d" /> : <Play size={14} className="ml-0.5" fill="#00443d" />}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {track.ragaTime && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#cafd1e]/10 text-[#cafd1e] border border-[#cafd1e]/20">
                        {track.ragaTime.split(' ')[0]}
                      </span>
                    )}
                    {track.binauralFreq && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00fde7]/10 text-[#00fde7]">
                        {track.binauralFreq}Hz
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#00fde7] transition-colors truncate mt-1">
                    {track.title}
                  </h4>
                  <p className="text-xs text-[#92b900] truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. JUMP BACK IN */}
      <section id="jump-back-in-section" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heading font-bold text-xl md:text-2xl text-[#cafd1e] flex items-center gap-2">
            <PlayCircle size={22} className="text-[#00fde7]" fill="#00fde7" stroke="#0a1000" />
            <span>Jump Back In</span>
          </h3>
          <span className="text-xs text-[#92b900]">Curated for Your Listening Pleasure</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Large Hero Card: Deep Ambient Horizons */}
          <div
            id="jump-back-hero-card"
            onClick={() => onPlayTrack(deepAmbientTrack)}
            className="col-span-2 row-span-2 relative group rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#00fde7]/40 transition-all duration-300 min-h-[220px] md:min-h-[300px] shadow-xl text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1000] via-[#0a1000]/60 to-transparent z-10" />
            <img
              src={deepAmbientTrack.coverUrl}
              alt={deepAmbientTrack.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute bottom-0 left-0 p-4 md:p-6 z-20 w-full text-left">
              <span className="bg-[#00fde7]/20 text-[#00fde7] border border-[#00fde7]/40 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider mb-2 inline-block backdrop-blur-md uppercase">
                ALBUM
              </span>
              <h4 className="font-serif-heading font-extrabold text-2xl md:text-3xl text-white mb-1 group-hover:text-[#00fde7] transition-colors">
                {deepAmbientTrack.title}
              </h4>
              <p className="text-xs md:text-sm text-[#92b900] line-clamp-1">
                {deepAmbientTrack.description || 'Ambient textures & subtle beats for rich atmospheric listening.'}
              </p>
            </div>

            <button
              id="jump-back-hero-play-btn"
              aria-label={`Play ${deepAmbientTrack.title}`}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-30 shadow-2xl transition-all duration-300 ${
                currentTrack?.id === deepAmbientTrack.id && isPlaying
                  ? 'bg-[#00fde7] text-[#00443d] opacity-100 scale-100'
                  : 'bg-[#00fde7] text-[#00443d] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
              }`}
            >
              <Play size={28} className="ml-1" fill="#00443d" />
            </button>
          </div>

          {/* Standard Card 1: Harmonic Resonance */}
          <div
            id="jump-back-card-cognitive"
            onClick={() => onPlayTrack(harmonicResonanceTrack)}
            className="bg-[#141c00] rounded-2xl p-2.5 border border-white/5 hover:border-[#00fde7]/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg text-left"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#0f1600]">
              <img
                src={harmonicResonanceTrack.coverUrl}
                alt={harmonicResonanceTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                  currentTrack?.id === harmonicResonanceTrack.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <div className="w-11 h-11 bg-[#00fde7] rounded-full flex items-center justify-center text-[#00443d] shadow-lg">
                  <Play size={22} className="ml-0.5" fill="#00443d" />
                </div>
              </div>
            </div>

            <div className="px-1 pb-1 text-left">
              <h4 className="font-semibold text-sm md:text-base text-white group-hover:text-[#00fde7] transition-colors truncate">
                {harmonicResonanceTrack.title}
              </h4>
              <p className="text-xs text-[#92b900] truncate mt-0.5">Binaural Waves • 40Hz</p>
            </div>
          </div>

          {/* Standard Card 2: Midnight City Lights (with PRO badge) */}
          <div
            id="jump-back-card-midnight"
            onClick={() => onPlayTrack(midnightCityTrack)}
            className="bg-[#141c00] rounded-2xl p-2.5 border border-white/5 hover:border-[#00fde7]/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg relative text-left"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#0f1600]">
              <img
                src={midnightCityTrack.coverUrl}
                alt={midnightCityTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 bg-[#ff5b5b] text-white px-2 py-0.5 rounded-md text-[10px] font-bold z-10 uppercase tracking-wide shadow-md">
                PRO
              </span>
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                  currentTrack?.id === midnightCityTrack.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <div className="w-11 h-11 bg-[#00fde7] rounded-full flex items-center justify-center text-[#00443d] shadow-lg">
                  <Play size={22} className="ml-0.5" fill="#00443d" />
                </div>
              </div>
            </div>

            <div className="px-1 pb-1 text-left">
              <h4 className="font-semibold text-sm md:text-base text-white group-hover:text-[#00fde7] transition-colors truncate">
                {midnightCityTrack.title}
              </h4>
              <p className="text-xs text-[#92b900] truncate mt-0.5">Lo-Fi Synth</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOSSLESS AUDIO MASTER SECTION */}
      <section className="bg-[#141c00] border border-white/5 rounded-2xl p-5 md:p-6 shadow-xl text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center text-[#00fde7] shrink-0">
              <Headphones size={26} />
            </div>
            <div>
              <h4 className="font-serif-heading font-bold text-lg text-white">
                Lossless Master Quality Audio & Spatial Sound
              </h4>
              <p className="text-xs md:text-sm text-[#92b900] max-w-xl mt-1 leading-relaxed">
                Mastered at studio-grade 320kbps & FLAC lossless fidelity with analog warmth, pure 432Hz and 40Hz acoustic layers, preserving the nuanced resonance of sitars, bansuri flutes, and vinyl warmth.
              </p>
            </div>
          </div>

          <button
            onClick={() => onPlayTrack(hindiLofiHeroTrack)}
            className="shrink-0 bg-[#1f2a00] hover:bg-[#00fde7] hover:text-[#00443d] border border-[#00fde7]/40 text-[#00fde7] px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2"
          >
            <Play size={14} fill="currentColor" />
            <span>Play Lossless Hindi Lo-Fi Stream</span>
          </button>
        </div>
      </section>
    </div>
  );
};
