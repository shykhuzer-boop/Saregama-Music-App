import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  FileImage, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Disc, 
  Music, 
  Download, 
  Layers, 
  Link2, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { Album, Track } from '../types';

interface AdminArtworkStudioProps {
  albums: Album[];
  tracks: Track[];
  onUpdateAlbumPoster: (albumId: string, newCoverUrl: string, syncTracks?: boolean) => void;
  onUpdateTrackPoster: (trackId: string, newCoverUrl: string) => void;
  onAddAlbum: (newAlbum: Album) => void;
  onUpdateAlbumDetails?: (updatedAlbum: Album) => void;
  onShowToast: (message: string) => void;
  onLogAction: (action: string, target: string, details: string, type: 'user_edit' | 'user_delete' | 'user_add' | 'plan_change' | 'system') => void;
}

// Curated high-res artwork presets for quick testing/selection
const curatedArtworkPresets = [
  {
    id: 'preset-1',
    title: 'Vintage Bollywood Vinyl',
    genre: 'Retro Hindi & Lo-Fi',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2'
  },
  {
    id: 'preset-2',
    title: 'Sacred Dawn Ragas & Sitar',
    genre: 'Classical & Vedic',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6'
  },
  {
    id: 'preset-3',
    title: 'Sufi Sanctuary Harmonies',
    genre: 'Sufi & Devotional',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY'
  },
  {
    id: 'preset-4',
    title: 'Monsoon Acoustic Tape',
    genre: 'Unplugged & Lo-Fi',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj'
  },
  {
    id: 'preset-5',
    title: 'Midnight Golden Era Melodies',
    genre: 'Vintage Nostalgia',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VpL5HGR4Dx6jRdpZNTA-rhNXOd6UuhEejghRKOKDT4Keh1BxHVicDpS1TrX5-fRsr3aDzV452oLpA4dcMH0KaLOz_sjgNJgkgQSI3d82jpDGha7Ng8wtx-KouUz6REPAE5l1nJE0H-rluZh7sO4D-8if4LeDUy3OyxNoLPqRImpD11T7H7g6aOEUMhPJ_A-1CMBgSK6XyCir8uGi_k4cNgz2M-HJNt5F0uPkUDVpFqc-3Zlz7-ez'
  },
  {
    id: 'preset-6',
    title: 'Vedic 432Hz Om & Chants',
    genre: 'Binaural & Spiritual',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyMPn0XbNXNVnsNMt6zhvFyVMiMrGkKixx91vS6dLavzrvnoeUOR0X3wmXnFg5ikqufDNCRrHH7KBgziqROMnKehgwgP6ptPcYr4usRG4Hlfki4TQAAhnhA5EsyHeGPxoYfoiSgjdeWlTJcVDgpOR9HPyjEo6EIppAS2XZ4oJZ6vTXXISJav37HQj1w5vswtvpV592jdGAZsUBvQcGlcKY7lkG1oshQKUHD7bRaWJEnX-Dhqe5iB4'
  }
];

export const AdminArtworkStudio: React.FC<AdminArtworkStudioProps> = ({
  albums,
  tracks,
  onUpdateAlbumPoster,
  onUpdateTrackPoster,
  onAddAlbum,
  onUpdateAlbumDetails,
  onShowToast,
  onLogAction,
}) => {
  // Target Selection Mode
  const [targetType, setTargetType] = useState<'album' | 'track' | 'new_album'>('album');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albums[0]?.id || '');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || '');
  const [syncTracksWithAlbum, setSyncTracksWithAlbum] = useState<boolean>(true);

  // Upload Input Mode
  const [uploadSource, setUploadSource] = useState<'file' | 'url' | 'preset'>('file');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Album Form State
  const [newAlbumTitle, setNewAlbumTitle] = useState<string>('');
  const [newAlbumArtist, setNewAlbumArtist] = useState<string>('');
  const [newAlbumGenre, setNewAlbumGenre] = useState<string>('Hindi & Bollywood');
  const [newAlbumYear, setNewAlbumYear] = useState<number>(2026);
  const [newAlbumTrackCount, setNewAlbumTrackCount] = useState<number>(8);
  const [newAlbumIsPro, setNewAlbumIsPro] = useState<boolean>(false);

  // Edit Existing Album Modal
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  // Currently selected Album & Track objects
  const currentSelectedAlbum = albums.find(a => a.id === selectedAlbumId) || albums[0];
  const currentSelectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];

  // Derive preview poster image
  const activePosterUrl = uploadedImagePreview || 
    (uploadSource === 'url' && customImageUrl.trim() ? customImageUrl.trim() : null) ||
    (targetType === 'album' ? currentSelectedAlbum?.coverUrl : currentSelectedTrack?.coverUrl) ||
    curatedArtworkPresets[0].url;

  // Handle Local File Reading via HTML5 FileReader (Base64)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    // Calculate readable file size
    const sizeKB = Math.round(file.size / 1024);
    const formattedSize = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImagePreview(result);
      setUploadedFileName(file.name);
      setUploadedFileSize(formattedSize);
      onShowToast(`Poster "${file.name}" loaded successfully into preview.`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Preset Selection
  const handleSelectPreset = (presetUrl: string, presetTitle: string) => {
    setUploadedImagePreview(presetUrl);
    setUploadedFileName(`Preset: ${presetTitle}`);
    setUploadedFileSize('High-Res Studio Asset');
    onShowToast(`Selected preset poster "${presetTitle}".`);
  };

  // Apply Artwork Submission
  const handleApplyArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = uploadedImagePreview || (uploadSource === 'url' ? customImageUrl.trim() : null);

    if (!finalImageUrl) {
      alert('Please upload an image file or provide a valid image URL before applying.');
      return;
    }

    if (targetType === 'album') {
      if (!currentSelectedAlbum) return;
      onUpdateAlbumPoster(currentSelectedAlbum.id, finalImageUrl, syncTracksWithAlbum);
      onLogAction(
        'Album Poster Updated',
        currentSelectedAlbum.title,
        `Replaced album artwork (${syncTracksWithAlbum ? 'synced with all tracks' : 'album only'})`,
        'system'
      );
      onShowToast(`Poster successfully applied to album "${currentSelectedAlbum.title}"!`);
    } else if (targetType === 'track') {
      if (!currentSelectedTrack) return;
      onUpdateTrackPoster(currentSelectedTrack.id, finalImageUrl);
      onLogAction(
        'Track Artwork Updated',
        currentSelectedTrack.title,
        `Replaced single track artwork`,
        'system'
      );
      onShowToast(`Poster successfully applied to track "${currentSelectedTrack.title}"!`);
    } else if (targetType === 'new_album') {
      if (!newAlbumTitle.trim() || !newAlbumArtist.trim()) {
        alert('Please provide album title and artist name.');
        return;
      }

      const newAlbum: Album = {
        id: `alb-${Date.now()}`,
        title: newAlbumTitle.trim(),
        artist: newAlbumArtist.trim(),
        coverUrl: finalImageUrl,
        trackCount: newAlbumTrackCount,
        genre: newAlbumGenre,
        year: newAlbumYear,
        isPro: newAlbumIsPro,
        isDownloaded: true
      };

      onAddAlbum(newAlbum);
      onLogAction(
        'New Album Registered',
        newAlbum.title,
        `Created album with custom uploaded poster (${newAlbum.artist})`,
        'system'
      );
      onShowToast(`New album "${newAlbum.title}" created with uploaded poster!`);
      
      // Reset new album fields
      setNewAlbumTitle('');
      setNewAlbumArtist('');
      setTargetType('album');
      setSelectedAlbumId(newAlbum.id);
    }
  };

  // Quick action from album grid
  const handleQuickUploadForAlbum = (album: Album) => {
    setTargetType('album');
    setSelectedAlbumId(album.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast(`Target album set to "${album.title}". Upload or paste poster below.`);
  };

  // Quick action for saving edited album
  const handleSaveAlbumEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum || !onUpdateAlbumDetails) return;
    onUpdateAlbumDetails(editingAlbum);
    onLogAction('Album Metadata Edited', editingAlbum.title, `Updated artist/genre/year details`, 'system');
    onShowToast(`Album details for "${editingAlbum.title}" saved.`);
    setEditingAlbum(null);
  };

  return (
    <div id="admin-artwork-studio" className="space-y-8 text-left">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#192600] via-[#141c00] to-[#0a1000] border border-[#00fde7]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00443d]/60 border border-[#00fde7]/40 px-3.5 py-1 rounded-full text-xs font-bold text-[#00fde7] mb-2.5">
              <FileImage size={14} />
              <span>Saregama Album Artwork & Poster Studio</span>
            </div>
            <h2 className="font-serif-heading font-extrabold text-2xl sm:text-3xl text-white">
              Music Poster & Cover Art Uploader
            </h2>
            <p className="text-xs sm:text-sm text-[#92b900] mt-1 max-w-2xl">
              Upload custom album posters from your local device or paste web URLs. Automatically synchronize cover artwork with respective albums, tracks, and playlists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTargetType('new_album');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#cafd1e] hover:bg-[#b8e815] text-[#141c00] font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
            >
              <Plus size={16} />
              <span>Register New Album</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Grid (Uploader + Live Vinyl Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: Upload & Configuration Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <form onSubmit={handleApplyArtwork} className="space-y-6">
            {/* Step 1: Target Selector (Album vs Single Track vs New Album) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#cafd1e] uppercase tracking-wider flex items-center gap-1.5">
                  <Disc size={14} className="text-[#00fde7]" />
                  <span>1. Choose Target Music Item</span>
                </label>
                <span className="text-[11px] text-[#92b900]">Where to apply artwork</span>
              </div>

              {/* Target Type Switcher Buttons */}
              <div className="grid grid-cols-3 gap-2 bg-[#0a1000] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetType('album')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    targetType === 'album'
                      ? 'bg-[#00fde7] text-[#00443d] shadow-sm'
                      : 'text-[#92b900] hover:text-white'
                  }`}
                >
                  <Disc size={14} />
                  <span>Full Album</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('track')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    targetType === 'track'
                      ? 'bg-[#00fde7] text-[#00443d] shadow-sm'
                      : 'text-[#92b900] hover:text-white'
                  }`}
                >
                  <Music size={14} />
                  <span>Single Track</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('new_album')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    targetType === 'new_album'
                      ? 'bg-[#cafd1e] text-[#141c00] shadow-sm'
                      : 'text-[#92b900] hover:text-white'
                  }`}
                >
                  <Plus size={14} />
                  <span>New Album</span>
                </button>
              </div>

              {/* Target Specific Selectors */}
              <div className="mt-3">
                {targetType === 'album' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#92b900]">Select Album from Catalog:</label>
                    <select
                      id="admin-target-album-select"
                      value={selectedAlbumId}
                      onChange={(e) => setSelectedAlbumId(e.target.value)}
                      className="w-full bg-[#0a1000] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-[#00fde7]"
                    >
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.title} — {album.artist} ({album.genre}, {album.year})
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 mt-2 cursor-pointer select-none text-xs text-[#cafd1e]">
                      <input
                        type="checkbox"
                        checked={syncTracksWithAlbum}
                        onChange={(e) => setSyncTracksWithAlbum(e.target.checked)}
                        className="w-4 h-4 rounded text-[#00fde7] accent-[#00fde7] bg-[#0a1000]"
                      />
                      <span>Auto-synchronize all {tracks.filter(t => t.album === currentSelectedAlbum?.title).length || 'associated'} tracks in this album with this poster</span>
                    </label>
                  </div>
                )}

                {targetType === 'track' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#92b900]">Select Individual Track:</label>
                    <select
                      id="admin-target-track-select"
                      value={selectedTrackId}
                      onChange={(e) => setSelectedTrackId(e.target.value)}
                      className="w-full bg-[#0a1000] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-[#00fde7]"
                    >
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.title} — {track.artist} ({track.album || 'Single'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === 'new_album' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#0a1000] rounded-2xl border border-white/5 text-xs">
                    <div>
                      <label className="block text-[11px] text-[#92b900] mb-1">Album Title *</label>
                      <input
                        type="text"
                        required
                        value={newAlbumTitle}
                        onChange={(e) => setNewAlbumTitle(e.target.value)}
                        placeholder="e.g. Sufi Night Harmonies"
                        className="w-full bg-[#141c00] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#92b900] mb-1">Artist Name(s) *</label>
                      <input
                        type="text"
                        required
                        value={newAlbumArtist}
                        onChange={(e) => setNewAlbumArtist(e.target.value)}
                        placeholder="e.g. Javed Ali & Saregama Ensemble"
                        className="w-full bg-[#141c00] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#92b900] mb-1">Genre</label>
                      <select
                        value={newAlbumGenre}
                        onChange={(e) => setNewAlbumGenre(e.target.value)}
                        className="w-full bg-[#141c00] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                      >
                        <option value="Hindi & Bollywood">Hindi & Bollywood</option>
                        <option value="Classical & Ragas">Classical & Ragas</option>
                        <option value="Sufi & Devotional">Sufi & Devotional</option>
                        <option value="Lo-Fi & Chillout">Lo-Fi & Chillout</option>
                        <option value="Hindi Acoustic Lounge">Hindi Acoustic Lounge</option>
                        <option value="Soundtrack & Ambience">Soundtrack & Ambience</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#92b900] mb-1">Year</label>
                        <input
                          type="number"
                          value={newAlbumYear}
                          onChange={(e) => setNewAlbumYear(Number(e.target.value))}
                          className="w-full bg-[#141c00] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#92b900] mb-1">Track Count</label>
                        <input
                          type="number"
                          value={newAlbumTrackCount}
                          onChange={(e) => setNewAlbumTrackCount(Number(e.target.value))}
                          className="w-full bg-[#141c00] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Upload Source Mode (Local File Upload / URL / Presets) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#cafd1e] uppercase tracking-wider flex items-center gap-1.5">
                  <Upload size={14} className="text-[#00fde7]" />
                  <span>2. Upload Poster Artwork</span>
                </label>
                <div className="flex items-center gap-1 bg-[#0a1000] p-0.5 rounded-lg border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUploadSource('file')}
                    className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                      uploadSource === 'file' ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                    }`}
                  >
                    Local File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('url')}
                    className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                      uploadSource === 'url' ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('preset')}
                    className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                      uploadSource === 'preset' ? 'bg-[#00fde7] text-[#00443d]' : 'text-[#92b900] hover:text-white'
                    }`}
                  >
                    Studio Presets
                  </button>
                </div>
              </div>

              {/* Mode A: Drag & Drop / File Input */}
              {uploadSource === 'file' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-[#00fde7] bg-[#00fde7]/10'
                      : 'border-white/20 hover:border-[#00fde7]/60 bg-[#0a1000]/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml, image/jpg"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-full bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center mx-auto mb-3 text-[#00fde7]">
                    <Upload size={22} />
                  </div>

                  <p className="text-sm font-bold text-white mb-1">
                    Drag and drop your album poster here
                  </p>
                  <p className="text-xs text-[#92b900] mb-3">
                    Supports high-resolution PNG, JPG, WEBP, or SVG (1:1 square recommended)
                  </p>

                  <button
                    type="button"
                    className="bg-[#1e2b00] hover:bg-[#2c3d00] text-[#00fde7] border border-[#00fde7]/30 px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                  >
                    <FileImage size={14} />
                    <span>Browse Files on Device</span>
                  </button>

                  {uploadedFileName && (
                    <div className="mt-4 p-2.5 bg-[#141c00] border border-[#00fde7]/30 rounded-xl inline-flex items-center gap-2 text-xs text-[#00fde7]">
                      <CheckCircle2 size={15} />
                      <span className="font-semibold truncate max-w-xs">{uploadedFileName}</span>
                      {uploadedFileSize && <span className="text-[#92b900]">({uploadedFileSize})</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Mode B: Image URL Input */}
              {uploadSource === 'url' && (
                <div className="space-y-3 p-4 bg-[#0a1000] rounded-2xl border border-white/10">
                  <label className="block text-[11px] text-[#92b900]">Paste Poster Image Direct URL:</label>
                  <div className="relative">
                    <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => {
                        setCustomImageUrl(e.target.value);
                        setUploadedImagePreview(null);
                      }}
                      placeholder="https://images.example.com/album-artwork.jpg"
                      className="w-full bg-[#141c00] border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-[#00fde7]"
                    />
                  </div>
                  <p className="text-[11px] text-[#92b900]">
                    Direct web links to CDN images, unsplash posters, or artwork assets.
                  </p>
                </div>
              )}

              {/* Mode C: Curated Studio Presets */}
              {uploadSource === 'preset' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-[#0a1000] rounded-2xl border border-white/10 max-h-56 overflow-y-auto no-scrollbar">
                  {curatedArtworkPresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.url, preset.title)}
                      className="group cursor-pointer p-2 rounded-xl bg-[#141c00] border border-white/5 hover:border-[#00fde7] transition-all flex flex-col"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden relative mb-1.5 bg-black">
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Check size={18} className="text-[#00fde7]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-white truncate">{preset.title}</span>
                      <span className="text-[9px] text-[#92b900] truncate">{preset.genre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit / Apply Button */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setUploadedImagePreview(null);
                  setUploadedFileName(null);
                  setUploadedFileSize(null);
                  setCustomImageUrl('');
                  onShowToast('Artwork uploader reset to original.');
                }}
                className="text-xs text-[#92b900] hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={13} />
                <span>Reset to Default</span>
              </button>

              <button
                type="submit"
                id="admin-apply-artwork-btn"
                className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#00fde7]/20 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 size={17} />
                <span>
                  {targetType === 'new_album'
                    ? 'Create Album with Poster'
                    : targetType === 'album'
                    ? `Save Poster to "${currentSelectedAlbum?.title || 'Album'}"`
                    : `Save Poster to "${currentSelectedTrack?.title || 'Track'}"`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Live Vinyl / CD Sleeve Preview Frame (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl text-left flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-extrabold text-[#00fde7] tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>REAL-TIME 1:1 POSTER PREVIEW</span>
                </span>
                <span className="text-[10px] bg-[#0a1000] text-[#cafd1e] px-2 py-0.5 rounded-full border border-white/10">
                  Hi-Res Ready
                </span>
              </div>

              {/* Square Vinyl / Album Artwork Frame */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 group">
                <img
                  src={activePosterUrl}
                  alt="Poster Preview"
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Vinyl Record Peeking Out Behind Effect */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#00fde7] flex items-center gap-1.5 border border-white/10">
                  <Disc size={12} className="animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Vinyl Master</span>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
                  <span className="text-[10px] font-bold text-[#00fde7] uppercase tracking-wider">
                    {targetType === 'new_album'
                      ? (newAlbumGenre || 'New Release')
                      : targetType === 'album'
                      ? currentSelectedAlbum?.genre
                      : currentSelectedTrack?.genre}
                  </span>
                  <h4 className="font-serif-heading font-extrabold text-lg text-white truncate">
                    {targetType === 'new_album'
                      ? (newAlbumTitle || 'Untitled Album')
                      : targetType === 'album'
                      ? currentSelectedAlbum?.title
                      : currentSelectedTrack?.title}
                  </h4>
                  <p className="text-xs text-[#92b900] truncate">
                    {targetType === 'new_album'
                      ? (newAlbumArtist || 'Artist Name')
                      : targetType === 'album'
                      ? currentSelectedAlbum?.artist
                      : currentSelectedTrack?.artist}
                  </p>
                </div>
              </div>
            </div>

            {/* Poster Specifications */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-[#92b900]">
                <span>Aspect Ratio:</span>
                <span className="text-white font-semibold">1:1 Square (Cover Art Standard)</span>
              </div>
              <div className="flex justify-between text-[#92b900]">
                <span>Active Target:</span>
                <span className="text-[#cafd1e] font-semibold truncate max-w-[200px]">
                  {targetType === 'new_album' ? 'New Album Creation' : targetType === 'album' ? currentSelectedAlbum?.title : currentSelectedTrack?.title}
                </span>
              </div>
              <div className="flex justify-between text-[#92b900]">
                <span>Status:</span>
                <span className="text-[#00fde7] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Ready to Deploy</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CATALOG ALBUMS POSTER GRID */}
      <section className="bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif-heading font-bold text-xl text-white flex items-center gap-2">
              <Layers size={20} className="text-[#00fde7]" />
              <span>Catalog Albums & Associated Posters ({albums.length})</span>
            </h3>
            <p className="text-xs text-[#92b900] mt-0.5">
              Browse all albums in the Saregama vault. Click &quot;Change Poster&quot; on any card to update its artwork.
            </p>
          </div>
        </div>

        {/* Album Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.map((album) => {
            const matchingTracks = tracks.filter(t => t.album === album.title || t.album === album.id);
            return (
              <div
                key={album.id}
                className="bg-[#0a1000] border border-white/5 hover:border-[#00fde7]/40 rounded-2xl p-4 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Poster Image Container */}
                  <div className="aspect-square rounded-xl overflow-hidden relative mb-3 bg-black">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {album.isPro && (
                      <span className="absolute top-2 right-2 bg-[#ff5b5b] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                        PRO
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-[#cafd1e] font-semibold">
                      {matchingTracks.length} Songs Linked
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-white truncate group-hover:text-[#00fde7] transition-colors">
                    {album.title}
                  </h4>
                  <p className="text-xs text-[#92b900] truncate mt-0.5">
                    {album.artist}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[#92b900] mt-2">
                    <span className="bg-[#141c00] px-2 py-0.5 rounded border border-white/5">{album.genre}</span>
                    <span>{album.year}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleQuickUploadForAlbum(album)}
                    className="flex-1 bg-[#192300] hover:bg-[#233000] text-[#00fde7] border border-[#00fde7]/30 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Upload size={13} />
                    <span>Change Poster</span>
                  </button>

                  <button
                    onClick={() => setEditingAlbum(album)}
                    title="Edit Album Metadata"
                    className="p-1.5 bg-[#141c00] hover:bg-white/10 text-[#cafd1e] rounded-lg border border-white/5 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: INDIVIDUAL TRACK POSTER OVERVIEW */}
      <section className="bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="font-serif-heading font-bold text-xl text-white mb-4 flex items-center gap-2">
          <Music size={20} className="text-[#00fde7]" />
          <span>Track-Level Artwork Directory ({tracks.length})</span>
        </h3>

        <div className="divide-y divide-white/5 max-h-96 overflow-y-auto no-scrollbar">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="py-3 px-2 hover:bg-white/[0.02] rounded-xl flex items-center justify-between gap-4 transition-colors text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate text-sm flex items-center gap-2">
                    <span>{track.title}</span>
                    {track.moodTag && (
                      <span className="text-[9px] text-[#cafd1e] bg-[#192300] border border-[#cafd1e]/20 px-1.5 py-0.2 rounded">
                        {track.moodTag}
                      </span>
                    )}
                  </div>
                  <div className="text-[#92b900] truncate mt-0.5">
                    {track.artist} • <span className="text-white/70">{track.album || 'Single'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setTargetType('track');
                    setSelectedTrackId(track.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onShowToast(`Selected track "${track.title}" for poster update.`);
                  }}
                  className="bg-[#0a1000] hover:bg-[#192300] text-[#00fde7] border border-white/10 hover:border-[#00fde7]/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Upload size={13} />
                  <span>Update Artwork</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: EDIT ALBUM METADATA */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141c00] border border-[#00fde7]/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-serif-heading font-bold text-xl text-[#00fde7] flex items-center gap-2">
                <Edit3 size={20} />
                <span>Edit Album Details</span>
              </h3>
              <button
                onClick={() => setEditingAlbum(null)}
                className="text-[#92b900] hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAlbumEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] text-[#92b900] mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={editingAlbum.title}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00fde7]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#92b900] mb-1">Artist Name</label>
                <input
                  type="text"
                  required
                  value={editingAlbum.artist}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, artist: e.target.value })}
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#00fde7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#92b900] mb-1">Genre</label>
                  <input
                    type="text"
                    value={editingAlbum.genre}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, genre: e.target.value })}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#92b900] mb-1">Release Year</label>
                  <input
                    type="number"
                    value={editingAlbum.year}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, year: Number(e.target.value) })}
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00fde7]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00fde7] text-[#00443d] rounded-xl font-bold hover:bg-[#49dbf4]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
