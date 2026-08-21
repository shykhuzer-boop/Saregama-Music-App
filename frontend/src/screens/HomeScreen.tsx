import React, { useState, useEffect } from 'react';
import { Track, UserProfile } from '../types';
import {
  Play,
  Pause,
  PlayCircle,
  Flame,
  Sparkles,
  Headphones,
  Compass,
  Disc3,
  Waves,
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

// Filter pill definitions — id maps to a filter function
const FILTER_PILLS = [
  { id: 'all',      label: '🔥 Top Trending Songs' },
  { id: 'hindi',    label: '🇮🇳 Hindi & Bollywood Hits' },
  { id: 'ragas',    label: '🪕 Indian Classical Ragas' },
  { id: 'sufi',     label: '✨ Sufi Sanctuary (432Hz)' },
  { id: 'binaural', label: '🧠 Binaural & Ambient' },
  { id: 'lofi',     label: '☕ Late Night Lo-Fi' },
] as const;

type FilterId = typeof FILTER_PILLS[number]['id'];

function filterTracks(tracks: Track[], filter: FilterId): Track[] {
  switch (filter) {
    case 'hindi':
      return tracks.filter(t => t.genre === 'Hindi & Bollywood');
    case 'ragas':
      return tracks.filter(t => t.genre === 'Classical & Ragas');
    case 'sufi':
      return tracks.filter(t => t.genre === 'Sufi & Devotional');
    case 'binaural':
      return tracks.filter(t => t.genre === 'Binaural' || t.genre === 'Ambient');
    case 'lofi':
      return tracks.filter(t =>
        t.genre === 'Lo-Fi' ||
        t.audioPreset === 'bollywood_lofi' ||
        t.moodTag?.toLowerCase().includes('lo-fi') ||
        t.moodTag?.toLowerCase().includes('lofi')
      );
    case 'all':
    default:
      return tracks;
  }
}

// Section label per active filter
function sectionLabel(filter: FilterId): { heading: string; subheading: string; badge: string } {
  switch (filter) {
    case 'hindi':    return { heading: '🇮🇳 Hindi & Bollywood Melodies', subheading: 'Trending hits from Bollywood', badge: 'Trending In India' };
    case 'ragas':    return { heading: '🪕 Sacred Indian Ragas', subheading: 'Timeless classical melodies aligned with the time of day', badge: 'Classical Heritage' };
    case 'sufi':     return { heading: '✨ Sufi Sanctuary', subheading: '432Hz harmonic tuning & devotional compositions', badge: '432Hz Calm' };
    case 'binaural': return { heading: '🧠 Binaural & Ambient', subheading: 'Frequency-tuned audio for focus, flow and relaxation', badge: 'Immersive Audio' };
    case 'lofi':     return { heading: '☕ Late Night Lo-Fi', subheading: 'Mellow acoustic chillhop for evenings and study sessions', badge: 'Chill Vibes' };
    default:         return { heading: '🔥 Top Trending Tracks', subheading: 'The best of Hindi, Classical, Sufi and Ambient — all in one', badge: 'All Genres' };
  }
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onOpenPlaylist,
  tracks,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Time-of-day greeting & raga prahar
  const hour = currentTime.getHours();
  let greeting = 'Good Morning';
  let prahar = { raga: 'Raag Bhairav / Bhairavi', benefit: 'Dawn Melodies & Harmonious Awakening', label: 'Pratham Prahar (Dawn)', trackId: 'track-hi-2' };

  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
    prahar = { raga: 'Raag Sarang / Shuddh Sarang', benefit: 'Mid-Day Classical Melodies & Relaxation', label: 'Madhyahna Prahar (Afternoon)', trackId: 'track-hi-1' };
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening';
    prahar = { raga: 'Raag Yaman / Kalyan', benefit: 'Sunset Strings & Peaceful Harmony', label: 'Sandhya Prahar (Sunset/Evening)', trackId: 'track-hi-6' };
  } else if (hour >= 21 || hour < 4) {
    greeting = 'Good Night';
    prahar = { raga: 'Raag Darbari / Malkauns', benefit: 'Late Night Melodies & Deep Solitude', label: 'Nishitha Prahar (Midnight)', trackId: 'track-hi-19' };
  }

  const ragaHeroTrack = tracks.find(t => t.id === prahar.trackId) ?? tracks[0];
  const heroTrack     = tracks.find(t => t.id === 'track-hi-1') ?? tracks[0];
  const jumpBackTracks = tracks.slice(0, 4);

  // Filtered track list for the main section
  const filteredTracks = filterTracks(tracks, activeFilter);
  const { heading, subheading, badge } = sectionLabel(activeFilter);

  // For the "Jump Back In" hero card pick a binaural/ambient track
  const ambientTrack = tracks.find(t => t.genre === 'Binaural' || t.id === 'track-4') ?? tracks[tracks.length - 1];

  return (
    <div className="flex flex-col gap-8 pb-36 max-w-7xl mx-auto w-full">

      {/* ── 1. GREETING BANNER ──────────────────────────────────────────── */}
      <section className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-gradient-to-r from-[#141c00] via-[#182200] to-[#0f1600] p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#00fde7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#cafd1e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-left">
          <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#1e2b00] border border-[#00fde7]/30 text-xs text-[#00fde7] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#00fde7] animate-pulse" />
            <span>Saregama Lossless Audio Matrix • Active</span>
            <span className="text-white/30">•</span>
            <span className="text-[#cafd1e]">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="font-serif-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            {greeting}, <span className="text-[#00fde7]">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-sm text-[#92b900] mt-1.5 flex items-center gap-2">
            <Sparkles size={16} className="text-[#cafd1e] shrink-0" />
            <span>Immersive Hindi & Bollywood hits, Indian Classical Ragas & high-fidelity soundscapes.</span>
          </p>
        </div>

        {/* Raga Prahar widget */}
        <div className="relative z-10 shrink-0 bg-[#0a1000]/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#00fde7]/20 flex items-center gap-3.5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00fde7]/20 to-[#cafd1e]/20 border border-[#00fde7]/40 flex items-center justify-center text-[#00fde7] shrink-0">
            <Waves size={24} className={isPlaying ? 'animate-pulse text-[#cafd1e]' : ''} />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#00fde7]/10 text-[#00fde7] border border-[#00fde7]/20">
              {prahar.label}
            </span>
            <p className="text-xs font-bold text-white mt-1">{prahar.raga}</p>
            <p className="text-[11px] text-[#92b900] line-clamp-1">{prahar.benefit}</p>
          </div>
          <button
            onClick={() => onPlayTrack(ragaHeroTrack)}
            className="w-10 h-10 rounded-full bg-[#00fde7] hover:bg-[#cafd1e] text-[#00443d] flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            {currentTrack?.id === ragaHeroTrack.id && isPlaying
              ? <Pause size={18} fill="#00443d" />
              : <Play size={18} className="ml-0.5" fill="#00443d" />}
          </button>
        </div>
      </section>

      {/* ── 2. FILTER PILLS ──────────────────────────────────────────────── */}
      <section className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {FILTER_PILLS.map(pill => {
          const active = activeFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border whitespace-nowrap shadow-sm ${
                active
                  ? 'bg-[#00fde7] text-[#00443d] border-[#00fde7] shadow-md shadow-[#00fde7]/20 scale-105'
                  : 'bg-[#141c00] text-[#cafd1e] border-white/10 hover:border-[#00fde7]/40 hover:bg-[#192300]'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </section>

      {/* ── 3. HERO SPOTLIGHT (hidden when a specific filter is active) ──── */}
      {activeFilter === 'all' && (
        <section
          className="bg-gradient-to-br from-[#1a2400] via-[#141c00] to-[#0a1000] rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl flex flex-col justify-between group min-h-[300px] text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1000]/90 via-[#0a1000]/60 to-transparent z-10" />
          <img
            src={heroTrack.coverUrl}
            alt={heroTrack.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700 pointer-events-none"
          />

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
            {isPlaying && (
              <div className="flex items-end gap-1 h-5 px-2.5 py-1 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="w-1 bg-[#00fde7] rounded-full animate-[bounce_0.8s_infinite_100ms] h-4" />
                <span className="w-1 bg-[#cafd1e] rounded-full animate-[bounce_0.8s_infinite_300ms] h-3" />
                <span className="w-1 bg-[#00fde7] rounded-full animate-[bounce_0.8s_infinite_200ms] h-5" />
                <span className="w-1 bg-[#cafd1e] rounded-full animate-[bounce_0.8s_infinite_400ms] h-2" />
              </div>
            )}
          </div>

          <div className="relative z-20 my-6">
            <h3 className="font-serif-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#00fde7] transition-colors leading-tight">
              {heroTrack.title}
            </h3>
            <p className="text-sm sm:text-base text-[#cafd1e] font-medium mt-1">{heroTrack.artist}</p>
            <p className="text-xs sm:text-sm text-[#92b900] mt-2 max-w-lg leading-relaxed line-clamp-2">
              {heroTrack.description}
            </p>
          </div>

          <div className="relative z-20 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayTrack(heroTrack)}
              className="bg-[#00fde7] hover:bg-[#cafd1e] text-[#00443d] px-6 py-3 rounded-full font-bold text-sm shadow-xl shadow-[#00fde7]/20 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              {currentTrack?.id === heroTrack.id && isPlaying
                ? <><Pause size={18} fill="#00443d" /><span>Pause</span></>
                : <><Play size={18} className="ml-0.5" fill="#00443d" /><span>Play Now</span></>}
            </button>
            <button
              onClick={() => onOpenPlaylist('pl-hindi-lofi')}
              className="bg-[#141c00]/80 hover:bg-[#1f2a00] text-[#cafd1e] border border-white/10 hover:border-[#00fde7]/40 px-5 py-3 rounded-full font-semibold text-xs transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Disc3 size={16} className="text-[#00fde7]" />
              <span>Explore Bollywood Lo-Fi Album</span>
            </button>
          </div>
        </section>
      )}

      {/* ── 4. FILTERED / MAIN TRACK GRID ────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase">
              {badge}
            </span>
            <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-white mt-1">{heading}</h3>
            <p className="text-xs text-[#92b900] mt-0.5">{subheading}</p>
          </div>
          <button
            onClick={() => onOpenPlaylist('pl-hindi-lofi')}
            className="text-xs text-[#00fde7] hover:text-[#cafd1e] hover:underline font-bold transition-colors"
          >
            See all →
          </button>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="py-16 text-center text-[#92b900] text-sm">
            No tracks found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTracks.map(track => {
              const playing = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className={`bg-[#141c00] rounded-2xl p-3 border transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg relative hover:-translate-y-1 ${
                    playing ? 'border-[#00fde7] bg-[#192300]' : 'border-white/5 hover:border-[#00fde7]/40'
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
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="w-12 h-12 bg-[#00fde7] rounded-full flex items-center justify-center text-[#00443d] shadow-xl transform transition-transform group-hover:scale-110">
                        {playing ? <Pause size={20} fill="#00443d" /> : <Play size={20} className="ml-0.5" fill="#00443d" />}
                      </div>
                    </div>
                  </div>

                  <div className="px-1 pb-1 text-left">
                    <h4 className="font-bold text-sm text-white group-hover:text-[#00fde7] transition-colors truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-[#92b900] truncate mt-0.5 font-medium">{track.artist}</p>
                    <div className="flex items-center justify-between text-[11px] text-[#cafd1e]/70 mt-2 pt-2 border-t border-white/5">
                      <span className="truncate">{track.genre}</span>
                      <span className="shrink-0 ml-1">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 5. JUMP BACK IN (only on 'all' filter) ───────────────────────── */}
      {activeFilter === 'all' && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading font-bold text-xl md:text-2xl text-[#cafd1e] flex items-center gap-2">
              <PlayCircle size={22} className="text-[#00fde7]" fill="#00fde7" stroke="#0a1000" />
              <span>Jump Back In</span>
            </h3>
            <span className="text-xs text-[#92b900]">Curated for Your Listening Pleasure</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Large hero card */}
            <div
              onClick={() => onPlayTrack(ambientTrack)}
              className="col-span-2 row-span-2 relative group rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#00fde7]/40 transition-all duration-300 min-h-[220px] md:min-h-[300px] shadow-xl text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1000] via-[#0a1000]/60 to-transparent z-10" />
              <img
                src={ambientTrack.coverUrl}
                alt={ambientTrack.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 z-20 w-full">
                <span className="bg-[#00fde7]/20 text-[#00fde7] border border-[#00fde7]/40 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider mb-2 inline-block backdrop-blur-md uppercase">
                  Featured
                </span>
                <h4 className="font-serif-heading font-extrabold text-2xl md:text-3xl text-white mb-1 group-hover:text-[#00fde7] transition-colors">
                  {ambientTrack.title}
                </h4>
                <p className="text-xs md:text-sm text-[#92b900] line-clamp-1">
                  {ambientTrack.description ?? ambientTrack.artist}
                </p>
              </div>
              <button
                aria-label={`Play ${ambientTrack.title}`}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-30 shadow-2xl transition-all duration-300 bg-[#00fde7] text-[#00443d] ${
                  currentTrack?.id === ambientTrack.id && isPlaying
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
                }`}
              >
                <Play size={28} className="ml-1" fill="#00443d" />
              </button>
            </div>

            {/* Smaller cards */}
            {jumpBackTracks.filter(t => t.id !== ambientTrack.id).slice(0, 2).map(track => {
              const playing = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className="bg-[#141c00] rounded-2xl p-2.5 border border-white/5 hover:border-[#00fde7]/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg text-left"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#0f1600]">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="w-11 h-11 bg-[#00fde7] rounded-full flex items-center justify-center text-[#00443d] shadow-lg">
                        {playing ? <Pause size={20} fill="#00443d" /> : <Play size={20} className="ml-0.5" fill="#00443d" />}
                      </div>
                    </div>
                  </div>
                  <div className="px-1 pb-1">
                    <h4 className="font-semibold text-sm text-white group-hover:text-[#00fde7] transition-colors truncate">{track.title}</h4>
                    <p className="text-xs text-[#92b900] truncate mt-0.5">{track.moodTag ?? track.genre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. CLASSICAL RAGAS (always visible on 'all', hidden otherwise since tracks already shown) ── */}
      {activeFilter === 'all' && (
        <section className="bg-gradient-to-br from-[#121800] to-[#0a1000] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl text-left">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2700] border border-[#cafd1e]/30 text-xs text-[#cafd1e] font-semibold mb-2">
                <Compass size={14} />
                <span>Time-of-Day Indian Prahar Traditions</span>
              </div>
              <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-white">
                Sacred Indian Ragas & Acoustic Heritage
              </h3>
              <p className="text-xs sm:text-sm text-[#92b900] mt-1">
                Timeless melodies curated to match the natural circadian rhythm of dawn, day, twilight, and night.
              </p>
            </div>
            <button
              onClick={() => onOpenPlaylist('pl-ragas-focus')}
              className="shrink-0 bg-[#1e2b00] hover:bg-[#00fde7] hover:text-[#00443d] border border-[#00fde7]/30 text-[#00fde7] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>View All Ragas</span><span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.filter(t => t.genre === 'Classical & Ragas' || t.genre === 'Sufi & Devotional').slice(0, 6).map(track => {
              const playing = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className={`bg-[#0e1400] rounded-2xl p-3.5 border transition-all duration-300 flex items-center gap-4 group cursor-pointer hover:border-[#00fde7]/50 ${
                    playing ? 'border-[#00fde7] bg-[#162000]' : 'border-white/5'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0a1000]">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      <div className="w-8 h-8 rounded-full bg-[#00fde7] flex items-center justify-center text-[#00443d]">
                        {playing ? <Pause size={14} fill="#00443d" /> : <Play size={14} className="ml-0.5" fill="#00443d" />}
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
                    <h4 className="font-bold text-sm text-white group-hover:text-[#00fde7] transition-colors truncate mt-1">{track.title}</h4>
                    <p className="text-xs text-[#92b900] truncate mt-0.5">{track.artist}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 7. LOSSLESS QUALITY BANNER ───────────────────────────────────── */}
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
            onClick={() => onPlayTrack(heroTrack)}
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
