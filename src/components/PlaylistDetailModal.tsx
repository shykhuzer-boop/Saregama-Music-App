import React from 'react';
import { Playlist, Track } from '../types';
import { X, Play, Trash2, Sparkles, Clock, Music } from 'lucide-react';

interface PlaylistDetailModalProps {
  playlist: Playlist | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
  onPlayAll: (playlist: Playlist) => void;
  onRemoveTrackFromPlaylist?: (playlistId: string, trackId: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({
  playlist,
  isOpen,
  onClose,
  onPlayTrack,
  onPlayAll,
  onRemoveTrackFromPlaylist,
  currentTrack,
  isPlaying,
}) => {
  if (!isOpen || !playlist) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141c00] border border-[#00fde7]/30 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up text-left">
        {/* Playlist Banner Header */}
        <div className="relative p-6 bg-gradient-to-b from-[#192300] to-[#141c00] border-b border-white/5 flex gap-4 items-end">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-[#0f1600] shadow-xl border border-white/10">
            <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold tracking-widest text-[#00fde7] uppercase">
              CURATED PLAYLIST
            </span>
            <h3 className="font-serif-heading font-extrabold text-xl sm:text-2xl text-white truncate mt-0.5">
              {playlist.title}
            </h3>
            <p className="text-xs text-[#92b900] line-clamp-2 mt-1">
              {playlist.description || 'Curated music collection with rich acoustic textures.'}
            </p>
            <div className="text-xs text-[#cafd1e] mt-2 font-medium">
              {playlist.tracks.length} tracks
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#92b900] hover:text-white p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Row */}
        <div className="p-4 bg-[#0f1600] flex items-center justify-between border-b border-white/5">
          <button
            onClick={() => onPlayAll(playlist)}
            className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold px-5 py-2 rounded-full text-xs flex items-center gap-2 transition-all shadow-md shadow-[#00fde7]/20 hover:scale-105 active:scale-95"
          >
            <Play size={15} fill="#00443d" />
            <span>Play All</span>
          </button>

          <span className="text-xs text-[#92b900] flex items-center gap-1">
            <Clock size={13} />
            <span>
              {Math.floor(playlist.tracks.reduce((acc, t) => acc + t.duration, 0) / 60)} mins total
            </span>
          </span>
        </div>

        {/* Tracks List */}
        <div className="p-4 overflow-y-auto divide-y divide-white/5 no-scrollbar flex-1">
          {playlist.tracks.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#92b900]">
              No tracks in this playlist yet. Add songs from Search or Home.
            </div>
          ) : (
            playlist.tracks.map((track, idx) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#192300] px-2 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-[#92b900] w-4 text-center">{idx + 1}</span>
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 relative bg-[#0f1600]">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <Play size={13} fill="#00fde7" className="text-[#00fde7]" />
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
                    {onRemoveTrackFromPlaylist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveTrackFromPlaylist(playlist.id, track.id);
                        }}
                        className="text-[#92b900] hover:text-[#ff5b5b] p-1 transition-colors"
                        title="Remove track"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
