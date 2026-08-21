import React, { useState } from 'react';
import { Track, Playlist } from '../types';
import { X, Plus, Check, Music } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, selectedTrackIds: string[]) => void;
  tracks: Track[];
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  tracks,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['track-1', 'track-2']);

  if (!isOpen) return null;

  const toggleTrack = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim(), description.trim(), selectedIds);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141c00] border border-[#00fde7]/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in-up text-left">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Music size={20} className="text-[#00fde7]" />
            <h3 className="font-serif-heading font-bold text-xl text-white">
              Create New Playlist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#92b900] hover:text-white p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#92b900] font-semibold block mb-1">
              Playlist Name *
            </label>
            <input
              type="text"
              required
              id="new-playlist-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hindi Chill Vibes, Night Ragas"
              className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cafd1e] outline-none focus:border-[#00fde7]"
            />
          </div>

          <div>
            <label className="text-xs text-[#92b900] font-semibold block mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              id="new-playlist-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Soothing Hindi lo-fi and acoustic harmonies."
              className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cafd1e] outline-none focus:border-[#00fde7]"
            />
          </div>

          <div>
            <label className="text-xs text-[#92b900] font-semibold block mb-2">
              Select Initial Tracks ({selectedIds.length} chosen)
            </label>
            <div className="max-h-48 overflow-y-auto divide-y divide-white/5 bg-[#0a1000] rounded-xl border border-white/5 p-2 no-scrollbar">
              {tracks.map((t) => {
                const isChecked = selectedIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTrack(t.id)}
                    className="flex items-center justify-between p-2 hover:bg-[#192300] rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-[#0f1600]">
                        <img src={t.coverUrl} alt={t.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{t.title}</div>
                        <div className="text-[10px] text-[#92b900] truncate">{t.artist}</div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-[#00fde7] border-[#00fde7] text-[#00443d]'
                          : 'border-white/20'
                      }`}
                    >
                      {isChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-[#cafd1e] py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-create-playlist-btn"
              className="flex-1 bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#00fde7]/20"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
