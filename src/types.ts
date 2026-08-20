export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: 'Lo-Fi' | 'Binaural' | 'Ambient' | 'Indie' | 'Electronic' | 'Classical' | 'Pop' | 'Soundtrack' | 'Hindi & Bollywood' | 'Classical & Ragas' | 'Sufi & Devotional';
  duration: number; // in seconds
  coverUrl: string;
  isPro?: boolean;
  isDownloaded?: boolean;
  binauralFreq?: number; // e.g. 40Hz Gamma for focus, 10Hz Alpha for relax
  audioPreset: 'lofi_synth' | 'binaural_flow' | 'deep_ambient' | 'piano_reverb' | 'rain_city' | 'chill_pulse' | 'hindi_acoustic' | 'bollywood_lofi' | 'sufi_meditation' | 'binaural_om';
  description?: string;
  language?: 'Hindi' | 'Sanskrit' | 'English' | 'Instrumental';
  ragaTime?: 'Dawn (Bhairav)' | 'Morning (Todi)' | 'Afternoon (Sarang)' | 'Sunset/Evening (Yaman)' | 'Midnight (Darbari)';
  moodTag?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  trackCount: number;
  isPro?: boolean;
  isDownloaded?: boolean;
  genre: string;
  year: number;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  tracks: Track[];
  isCustom?: boolean;
  isPro?: boolean;
}

export type ScreenName = 
  | 'welcome' 
  | 'auth' 
  | 'home' 
  | 'search' 
  | 'library' 
  | 'premium' 
  | 'player' 
  | 'profile' 
  | 'settings' 
  | 'history' 
  | 'help' 
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
  planName: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'suspended';
  offlineStorageUsedMB: number;
  maxStorageMB: number;
  audioQuality: 'Normal (160kbps)' | 'High (320kbps)' | 'Hi-Res Lossless (FLAC)';
  downloadOnlyOnWifi: boolean;
  joinedDate: string;
  lastActive: string;
  isStudentVerified: boolean;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'audio' | 'downloads' | 'billing' | 'account' | 'feature' | 'bug';
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  adminName: string;
  targetUser?: string;
  details: string;
  type: 'user_edit' | 'user_delete' | 'user_add' | 'plan_change' | 'system';
}
