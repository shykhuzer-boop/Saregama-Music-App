import React, { useState, useMemo } from 'react';
import { Track } from '../types';
import { searchCategories, recentSearchItems } from '../data/musicData';
import { Search as SearchIcon, X, Play, Music, Mic, Radio } from 'lucide-react';

interface SearchScreenProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  tracks,
  onPlayTrack,
  searchQuery,
  onSearchChange,
  currentTrack,
  isPlaying,
}) => {
  const [recents, setRecents] = useState(recentSearchItems);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Filtered tracks based on query and genre
  const filteredResults = useMemo(() => {
    let list = tracks;
    if (selectedGenre) {
      list = list.filter(t => t.genre.toLowerCase() === selectedGenre.toLowerCase());
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.genre.toLowerCase().includes(q) ||
          (t.album && t.album.toLowerCase().includes(q))
      );
    }
    return list;
  }, [tracks, searchQuery, selectedGenre]);

  const handleClearRecents = () => {
    setRecents([]);
  };

  const handleCategoryClick = (catTitle: string) => {
    if (selectedGenre === catTitle) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(catTitle);
    }
  };

  return (
    <div id="search-screen-container" className="flex flex-col gap-8 pb-32">
      {/* Global Search Bar Section (Exact Mockup Design) */}
      <section id="search-input-section" className="relative w-full max-w-3xl mx-auto z-20">
        <div className="relative group">
          <SearchIcon
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92b900] group-focus-within:text-[#00fde7] transition-colors"
          />
          <input
            type="text"
            id="main-search-bar-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-[#141c00] rounded-full py-4 pl-12 pr-12 text-[#cafd1e] placeholder:text-[#92b900] border border-white/5 focus:border-[#00fde7] focus:ring-2 focus:ring-[#00fde7]/20 focus:outline-none transition-all duration-300 text-base shadow-xl"
          />
          {searchQuery.length > 0 && (
            <button
              id="clear-search-query-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92b900] hover:text-[#00fde7] transition-colors p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown Preview */}
        {searchQuery.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-[#141c00] border border-[#00fde7]/30 rounded-2xl shadow-2xl overflow-hidden z-30 flex flex-col divide-y divide-white/5 animate-fade-in-up">
            <div className="p-3.5 bg-[#192300] flex justify-between items-center text-xs">
              <span className="font-semibold text-white">
                Matching Tracks & Artists ({filteredResults.length})
              </span>
              <span className="text-[#00fde7]">Live Catalog</span>
            </div>

            {filteredResults.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#92b900]">
                No tracks matching &quot;{searchQuery}&quot;. Try searching &apos;Hindi&apos;, &apos;Ragas&apos;, &apos;Sufi&apos;, or &apos;Lo-Fi&apos;.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto no-scrollbar">
                {filteredResults.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => {
                      onPlayTrack(track);
                      onSearchChange('');
                    }}
                    className="flex items-center gap-3.5 p-3 hover:bg-[#1f2a00] cursor-pointer transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#0f1600] relative">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} fill="#00fde7" className="text-[#00fde7]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-semibold text-white group-hover:text-[#00fde7] truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-[#92b900] truncate">
                        {track.artist} • {track.genre}
                      </div>
                    </div>
                    {track.isPro && (
                      <span className="bg-[#ff5b5b] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                        PRO
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Selected Genre Filter indicator */}
      {selectedGenre && (
        <div className="flex items-center gap-2 bg-[#192300] border border-[#00fde7]/30 px-4 py-2 rounded-xl text-sm self-start">
          <span className="text-xs text-[#92b900]">Filtered by:</span>
          <span className="font-bold text-[#00fde7]">{selectedGenre}</span>
          <button
            onClick={() => setSelectedGenre(null)}
            className="p-1 hover:text-white text-[#92b900]"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Recent Searches (Horizontal Carousel matching Mockup Screen 5) */}
      {recents.length > 0 && !selectedGenre && (
        <section id="recent-searches-section" className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif-heading font-bold text-xl md:text-2xl text-[#cafd1e]">
              Recent searches
            </h2>
            <button
              id="clear-all-recents-btn"
              onClick={handleClearRecents}
              className="text-xs font-semibold text-[#00fde7] hover:text-[#49dbf4] transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {recents.map((item) => {
              const matchedTrack = tracks.find(t => t.id === item.trackId) || tracks[0];
              const isThisPlaying = currentTrack?.id === matchedTrack.id && isPlaying;

              return (
                <div
                  key={item.id}
                  id={`recent-search-${item.id}`}
                  onClick={() => onPlayTrack(matchedTrack)}
                  className="shrink-0 w-32 md:w-36 flex flex-col gap-2 group cursor-pointer"
                >
                  <div
                    className={`
                      w-32 h-32 md:w-36 md:h-36 bg-[#141c00] overflow-hidden relative shadow-md group-hover:-translate-y-1 transition-all duration-300 border border-white/5
                      ${item.isArtist ? 'rounded-full' : 'rounded-2xl'}
                    `}
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <button
                      id={`play-recent-${item.id}`}
                      aria-label={`Play ${item.title}`}
                      className={`
                        absolute bottom-2.5 right-2.5 w-9 h-9 bg-[#00fde7] rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                        ${isThisPlaying 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                        }
                      `}
                    >
                      <Play size={18} className="ml-0.5" fill="#00443d" />
                    </button>
                  </div>
                  <div className="text-left px-0.5">
                    <p className="font-semibold text-sm text-white group-hover:text-[#00fde7] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#92b900] truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Browse All (Bento Grid matching Screen 5) */}
      <section id="browse-all-categories-section" className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="font-serif-heading font-bold text-xl md:text-2xl text-[#cafd1e]">
            Browse all
          </h2>
          <span className="text-xs text-[#92b900]">6 Curated Categories</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[130px] md:auto-rows-[170px]">
          {searchCategories.map((cat) => {
            const isSelected = selectedGenre === cat.title;
            return (
              <div
                key={cat.id}
                id={`browse-cat-${cat.id}`}
                onClick={() => handleCategoryClick(cat.title)}
                className={`
                  ${cat.isSpan2 ? 'col-span-2' : 'col-span-1'} row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer border transition-all duration-300
                  ${isSelected ? 'border-[#00fde7] ring-2 ring-[#00fde7]/30' : 'border-white/5 hover:border-[#00fde7]/50'}
                  bg-gradient-to-br ${cat.gradient}
                `}
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 opacity-40 group-hover:opacity-65 transition-opacity duration-500">
                  <img
                    src={cat.coverUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Details */}
                <div className="relative h-full p-4 md:p-5 flex flex-col justify-end text-left z-10">
                  {cat.tag && (
                    <span className="bg-black/60 text-[#00fde7] border border-[#00fde7]/30 font-semibold text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md self-start mb-2 uppercase tracking-wide">
                      {cat.tag}
                    </span>
                  )}
                  <h3 className="font-serif-heading font-extrabold text-lg md:text-2xl text-white drop-shadow-md group-hover:text-[#00fde7] transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
