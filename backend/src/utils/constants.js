/**
 * Application-wide constants
 */

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const USER_STATUSES = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
};

const AUDIO_QUALITIES = [
  'Normal (160kbps)',
  'High (320kbps)',
  'Hi-Res Lossless (FLAC)',
];

const GENRES = [
  'Lo-Fi',
  'Binaural',
  'Ambient',
  'Indie',
  'Electronic',
  'Classical',
  'Pop',
  'Soundtrack',
  'Hindi & Bollywood',
  'Classical & Ragas',
  'Sufi & Devotional',
];

const AUDIO_PRESETS = [
  'lofi_synth',
  'binaural_flow',
  'deep_ambient',
  'piano_reverb',
  'rain_city',
  'chill_pulse',
  'hindi_acoustic',
  'bollywood_lofi',
  'sufi_meditation',
  'binaural_om',
];

const LANGUAGES = ['Hindi', 'Sanskrit', 'English', 'Instrumental'];

const RAGA_TIMES = [
  'Dawn (Bhairav)',
  'Morning (Todi)',
  'Afternoon (Sarang)',
  'Sunset/Evening (Yaman)',
  'Midnight (Darbari)',
];

const TICKET_CATEGORIES = ['audio', 'downloads', 'billing', 'account', 'feature', 'bug'];

const TICKET_PRIORITIES = ['low', 'medium', 'high'];

const TICKET_STATUSES = ['open', 'in_progress', 'resolved'];

const ADMIN_LOG_TYPES = ['user_edit', 'user_delete', 'user_add', 'plan_change', 'system'];

const DOWNLOAD_SIZE_MB = 45; // Approximate size per track download

module.exports = {
  USER_ROLES,
  USER_STATUSES,
  AUDIO_QUALITIES,
  GENRES,
  AUDIO_PRESETS,
  LANGUAGES,
  RAGA_TIMES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  ADMIN_LOG_TYPES,
  DOWNLOAD_SIZE_MB,
};
