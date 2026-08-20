import React, { useState } from 'react';
import { Track, Album, Playlist } from '../types';
import { downloadedAlbums } from '../data/musicData';
import { 
  Plus, 
  CheckCircle, 
  Play, 
  Trash2, 
  FolderPlus, 
  DownloadCloud, 
  HardDrive, 
  ListMusic, 
  History as HistoryIcon,
  Check
} from 'lucide-react';

interface LibraryScreenProps {
  tracks: Track[];
  playlists: Playlist[];
  albums?: Album[];
  onPlayTrack: (track: Track) => void;
  onOpenPlaylist: (playlist: Playlist) => void;
  onCreatePlaylistOpen: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onRemoveDownload: (trackId: string) => void;
  onTogglePlay: () => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  tracks,
  playlists,
  albums: propAlbums,
  onPlayTrack,
  onOpenPlaylist,
  onCreatePlaylistOpen,
  currentTrack,
  isPlaying,
  onRemoveDownload,
  onTogglePlay,
}) => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'downloads' | 'history'>('downloads');
  const albums = propAlbums || downloadedAlbums;

  const downloadedTracks = tracks.filter(t => t.isDownloaded);

  const handlePlayAlbum = (album: Album) => {
    // find first track of album or first track in general
    const matchedTrack = tracks.find(t => t.album === album.title || t.title.toLowerCase().includes(album.title.toLowerCase())) || tracks[0];
    onPlayTrack(matchedTrack);
  };

  return (
    <div id="library-screen-container" className="flex flex-col gap-6 pb-32">
      {/* Page Title & Tab Navigation (Matching Image 9) */}
      <div className="flex flex-col gap-4">
        <h2 className="font-serif-heading font-extrabold text-3xl md:text-4xl text-[#cafd1e] tracking-tight text-left">
          Library
        </h2>

        {/* Tab Buttons */}
        <div className="flex space-x-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
          <button
            id="library-tab-playlists"
            onClick={() => setActiveTab('playlists')}
            className={`
              px-4 py-2 text-sm md:text-base font-semibold transition-all whitespace-nowrap
              ${activeTab === 'playlists'
                ? 'text-[#00fde7] border-b-2 border-[#00fde7]'
                : 'text-[#92b900] hover:text-[#cafd1e]'
              }
            `}
          >
            Playlists ({playlists.length})
          </button>

          <button
            id="library-tab-downloads"
            onClick={() => setActiveTab('downloads')}
            className={`
              px-4 py-2 text-sm md:text-base font-semibold transition-all whitespace-nowrap
              ${activeTab === 'downloads'
                ? 'text-[#00fde7] border-b-2 border-[#00fde7]'
                : 'text-[#92b900] hover:text-[#cafd1e]'
              }
            `}
          >
            Downloads ({downloadedTracks.length})
          </button>

          <button
            id="library-tab-history"
            onClick={() => setActiveTab('history')}
            className={`
              px-4 py-2 text-sm md:text-base font-semibold transition-all whitespace-nowrap
              ${activeTab === 'history'
                ? 'text-[#00fde7] border-b-2 border-[#00fde7]'
                : 'text-[#92b900] hover:text-[#cafd1e]'
              }
            `}
          >
            History
          </button>
        </div>
      </div>

      {/* Quick Actions (Create Playlist Button) */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="library-create-playlist-btn"
          onClick={onCreatePlaylistOpen}
          className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all shadow-md shadow-[#00fde7]/20 hover:scale-105 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Create Playlist</span>
        </button>

        {/* Offline storage badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#92b900] bg-[#141c00] px-3 py-1.5 rounded-xl border border-white/5">
          <HardDrive size={14} className="text-[#00fde7]" />
          <span>Protected Storage: 4.28 GB / 64 GB</span>
        </div>
      </div>

      {/* TAB 1: DOWNLOADS TAB (Exact Mockup Match for Image 9) */}
      {activeTab === 'downloads' && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-serif-heading font-bold text-lg md:text-xl text-[#cafd1e] mb-4 text-left">
              Downloaded Albums
            </h3>

            {/* Bento Grid Layout for Downloaded Albums */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {albums.map((album) => (
                <div
                  key={album.id}
                  id={`downloaded-album-card-${album.id}`}
                  onClick={() => handlePlayAlbum(album)}
                  className="bg-[#141c00] rounded-2xl p-2.5 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer border border-white/5 hover:border-[#00fde7]/40 relative shadow-lg"
                >
                  {/* Album Cover Art with Play Button Hover */}
                  <div className="aspect-square rounded-xl overflow-hidden relative mb-2.5 bg-[#0f1600]">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 bg-[#00fde7] rounded-full flex items-center justify-center text-[#00443d] shadow-xl">
                        <Play size={20} className="ml-0.5" fill="#00443d" />
                      </div>
                    </div>

                    {/* Offline Indicator Icon (Top Right) */}
                    <div className="absolute top-2 right-2 bg-[#192300]/90 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-sm flex items-center justify-center">
                      <CheckCircle size={14} className="text-[#49dbf4]" fill="#00fde7" stroke="#00443d" />
                    </div>
                  </div>

                  {/* Album Title & Artist */}
                  <div className="px-1 text-left">
                    <div className="font-semibold text-sm text-white group-hover:text-[#00fde7] truncate mb-0.5 flex items-center gap-1.5">
                      <span>{album.title}</span>
                      {album.isPro && (
                        <span className="bg-[#ff5b5b] text-white text-[8px] px-1 py-0.2 rounded font-bold uppercase">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#92b900] truncate">
                      {album.artist}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Downloaded Tracks List */}
          <div className="bg-[#141c00] rounded-2xl p-5 border border-white/5 shadow-xl">
            <h4 className="font-serif-heading font-bold text-base md:text-lg text-white mb-3 text-left flex items-center gap-2">
              <DownloadCloud size={18} className="text-[#00fde7]" />
              <span>Offline Tracks Ready for Playback</span>
            </h4>

            <div className="divide-y divide-white/5">
              {downloadedTracks.map((track, idx) => (
                <div
                  key={track.id}
                  id={`downloaded-track-row-${track.id}`}
                  onClick={() => onPlayTrack(track)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-[#192300] px-2 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-[#92b900] w-4 text-center">{idx + 1}</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative bg-[#0f1600]">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={14} fill="#00fde7" className="text-[#00fde7]" />
                      </div>
                    </div>
                    <div className="truncate text-left">
                      <p className="text-sm font-semibold text-white group-hover:text-[#00fde7] truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-[#92b900] truncate">
                        {track.artist} • {track.genre}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#92b900]">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDownload(track.id);
                      }}
                      title="Remove from offline downloads"
                      className="text-[#92b900] hover:text-[#ff5b5b] p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLAYLISTS TAB */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onOpenPlaylist(pl)}
              className="bg-[#141c00] rounded-2xl p-4 border border-white/5 hover:border-[#00fde7]/40 transition-all group cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div className="aspect-video rounded-xl overflow-hidden mb-3 relative bg-[#0f1600]">
                <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 text-xs font-semibold text-[#00fde7]">
                  {pl.tracks.length} Tracks
                </div>
              </div>

              <div className="text-left">
                <h4 className="font-serif-heading font-bold text-base text-white group-hover:text-[#00fde7] truncate">
                  {pl.title}
                </h4>
                <p className="text-xs text-[#92b900] line-clamp-2 mt-1">
                  {pl.description || 'Custom curated music playlist.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-[#141c00] rounded-2xl p-5 border border-white/5 shadow-xl">
          <h3 className="font-serif-heading font-bold text-lg text-white mb-4 text-left flex items-center gap-2">
            <HistoryIcon size={18} className="text-[#00fde7]" />
            <span>Listening History</span>
          </h3>

          <div className="divide-y divide-white/5">
            {(tracks || []).slice(0, 5).map((track, i) => (
              <div
                key={`history-${track.id}`}
                onClick={() => onPlayTrack(track)}
                className="py-3 flex items-center justify-between hover:bg-[#192300] px-2 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#0f1600]">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-sm font-semibold text-white group-hover:text-[#00fde7] truncate">
                      {track.title}
                    </p>
                    <p className="text-xs text-[#92b900] truncate">
                      Listened {i === 0 ? 'Just now' : `${i * 45} mins ago`} • {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#00fde7] bg-[#1f2a00] px-2 py-0.5 rounded">
                    Completed 100%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
