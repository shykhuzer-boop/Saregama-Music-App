import { Track, Album, Playlist, UserProfile } from '../types';

export const initialUser: UserProfile = {
  id: 'usr-1',
  name: 'Deepak Kumar',
  email: 'deepak.kumar@saregama.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTVysCsPTB733wYArFpqx3fAbENEOoTdMjn_pxLd2D75tMqzQNEfe35uARZ8HkpbC4968EIdwct-Be_WO5lvPjEZ-s2Nuasa2aCtOEow39k6ypuCqSM7TlR4z4rJSc4XNIG1iMd1Dsr-KYFg69gmv0s_4V5TeJlyftVTyrfO6Ilde9d6upbrFDzC44FZxOvBZxHhaiwr32Drh2TANB-9O4rDIz-34ifAgZDDUNkkfb2L_qXiYbEQgb',
  isPro: true,
  planName: 'Pro Annual Membership',
  role: 'user',
  status: 'active',
  offlineStorageUsedMB: 4280,
  maxStorageMB: 64000,
  audioQuality: 'Hi-Res Lossless (FLAC)',
  downloadOnlyOnWifi: true,
  joinedDate: '2025-11-12',
  lastActive: 'Just now',
  isStudentVerified: true,
};

export const allTracks: Track[] = [
  // --- HINDI & BOLLYWOOD TRACKS ---
  {
    id: 'track-hi-1',
    title: 'Kesariya (Lo-Fi Acoustic Reprise)',
    artist: 'Arijit Singh • Saregama Lo-Fi Labs',
    album: 'Bollywood Lo-Fi Chillout',
    genre: 'Hindi & Bollywood',
    duration: 228, // 3:48
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2',
    isPro: false,
    isDownloaded: true,
    binauralFreq: 40,
    audioPreset: 'bollywood_lofi',
    description: 'Nostalgic acoustic guitar, warm vinyl crackle, and soft rainfall curated for a soothing listening experience.',
    language: 'Hindi',
    moodTag: 'Acoustic Lo-Fi'
  },
  {
    id: 'track-hi-2',
    title: 'Raag Bhairavi (Dawn Awakening & Saraswati Dhun)',
    artist: 'Pt. Hariprasad Chaurasia & Zakir Hussain',
    album: 'Sacred Indian Classical Ragas',
    genre: 'Classical & Ragas',
    duration: 380, // 6:20
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6',
    isPro: true,
    isDownloaded: true,
    binauralFreq: 40,
    audioPreset: 'sufi_meditation',
    description: 'Soulful bansuri flute and meditative tanpura drone celebrating the serene morning sunrise.',
    language: 'Instrumental',
    ragaTime: 'Dawn (Bhairav)',
    moodTag: 'Dawn Serenity'
  },
  {
    id: 'track-hi-3',
    title: 'Kun Faya Kun (Meditative Sufi Ambient)',
    artist: 'A.R. Rahman, Javed Ali & Mohit Chauhan',
    album: 'Sufi Sanctuary Harmonies',
    genre: 'Sufi & Devotional',
    duration: 345, // 5:45
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY',
    isPro: false,
    isDownloaded: true,
    audioPreset: 'sufi_meditation',
    description: '432Hz harmonic tuning, ethereal acoustic harmonium, and ambient choir for pure peace.',
    language: 'Hindi',
    moodTag: 'Soulful Peace'
  },
  {
    id: 'track-hi-4',
    title: 'Lag Ja Gale (Midnight Vinyl Lo-Fi)',
    artist: 'Lata Mangeshkar & Saregama Retro Vault',
    album: 'Golden Era Vintage Lo-Fi',
    genre: 'Hindi & Bollywood',
    duration: 210, // 3:30
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VpL5HGR4Dx6jRdpZNTA-rhNXOd6UuhEejghRKOKDT4Keh1BxHVicDpS1TrX5-fRsr3aDzV452oLpA4dcMH0KaLOz_sjgNJgkgQSI3d82jpDGha7Ng8wtx-KouUz6REPAE5l1nJE0H-rluZh7sO4D-8if4LeDUy3OyxNoLPqRImpD11T7H7g6aOEUMhPJ_A-1CMBgSK6XyCir8uGi_k4cNgz2M-HJNt5F0uPkUDVpFqc-3Zlz7-ez',
    isPro: false,
    isDownloaded: true,
    audioPreset: 'bollywood_lofi',
    description: 'Timeless vintage melody reimagined with mellow Rhodes chords, subtle cassette tape hiss, and rain.',
    language: 'Hindi',
    moodTag: 'Vintage Nostalgia'
  },
  {
    id: 'track-hi-5',
    title: 'Tum Mile (Late Night Acoustic Lounge)',
    artist: 'Pritam & Neeraj Shridhar',
    album: 'Bollywood Unplugged Lounge',
    genre: 'Hindi & Bollywood',
    duration: 250, // 4:10
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj',
    isPro: true,
    isDownloaded: true,
    audioPreset: 'hindi_acoustic',
    description: 'Fingerstyle acoustic guitar and warm mellow tempo for relaxed evening listening.',
    language: 'Hindi',
    moodTag: 'Late Night Acoustic'
  },
  {
    id: 'track-hi-6',
    title: 'Raag Yaman (Sunset Sitar & Harmonies)',
    artist: 'Pt. Ravi Shankar & Anoushka Shankar',
    album: 'Sacred Indian Classical Ragas',
    genre: 'Classical & Ragas',
    duration: 410, // 6:50
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBetDCrUDGES8YDNb4bjIIffp_bX5e9jsOEIYc8coc7vOZI_brYzGkiQt2qYiWPNbcGBU0p1EZw1vh0CwATuKrJRads8N77akeNOZohawW4sK8xIY9p3QaORDj7V1Z1I8s2kvUAT5HRbg4C4kNl17nm_1dsBG1VKuNC8lLnE8cXC3X83G7uW44saVrV98f_ZsG1vyrbQkCgvdMTQDgqf9ckiQtzihHtTIkJWdsLgydMcT7-3hsqxgp',
    isPro: false,
    isDownloaded: true,
    audioPreset: 'hindi_acoustic',
    description: 'Harmonious evening raga strings providing tranquil serenity during twilight hours.',
    language: 'Instrumental',
    ragaTime: 'Sunset/Evening (Yaman)',
    moodTag: 'Evening Harmony'
  },
  {
    id: 'track-hi-7',
    title: 'Apna Bana Le (Acoustic Chillhop)',
    artist: 'Arijit Singh & Sachin-Jigar',
    album: 'Bollywood Lo-Fi Chillout',
    genre: 'Hindi & Bollywood',
    duration: 215, // 3:35
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDHoEYSZVySzLU36I681oiQJQw2SBTJK7nHF3TFx9VzITAPjJzjEpSOd3qQUR4fsnlDATu23ShhF3LCPD9lHlJHYHHCiGep8SlYRyYOzd5TxGmZ0s-_AgGPtn2OwaVN4DqP48QGc0Ru14btNA9HNtmNpuWo0mvui9c4swy7XsdquwVkyYm80hexE2HrJFXSJrnvkt1l5zkOsayMhP1ttvR-81nLmCzDUMmrQ9sM8wnQaIYY3tzi6cO',
    isPro: false,
    isDownloaded: false,
    audioPreset: 'bollywood_lofi',
    description: 'Gentle piano accents with 72 BPM chillhop pulse for a relaxed, uplifting vibe.',
    language: 'Hindi',
    moodTag: 'Mellow Chillhop'
  },
  {
    id: 'track-hi-8',
    title: 'Gayatri Mantra (Sacred 432Hz Vedic Chant)',
    artist: 'Sanskrit Heritage Project & Anuradha Paudwal',
    album: 'Vedic Meditative Chants',
    genre: 'Sufi & Devotional',
    duration: 300, // 5:00
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyMPn0XbNXNVnsNMt6zhvFyVMiMrGkKixx91vS6dLavzrvnoeUOR0X3wmXnFg5ikqufDNCRrHH7KBgziqROMnKehgwgP6ptPcYr4usRG4Hlfki4TQAAhnhA5EsyHeGPxoYfoiSgjdeWlTJcVDgpOR9HPyjEo6EIppAS2XZ4oJZ6vTXXISJav37HQj1w5vswtvpV592jdGAZsUBvQcGlcKY7lkG1oshQKUHD7bRaWJEnX-Dhqe5iB4',
    isPro: true,
    isDownloaded: true,
    binauralFreq: 40,
    audioPreset: 'binaural_om',
    description: '136.1Hz Cosmic Om baseline layered with rhythmic ancient Sanskrit chanting for deep spiritual calmness.',
    language: 'Sanskrit',
    moodTag: 'Spiritual Calm'
  },
  {
    id: 'track-hi-9',
    title: 'Kahani (Bansuri & Monsoon Rain Reprise)',
    artist: 'Pritam & Paras Nath',
    album: 'Bollywood Unplugged Lounge',
    genre: 'Hindi & Bollywood',
    duration: 240, // 4:00
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhcXA-gFdbpjRi-mNts7aPF_1b4qBntRZ8Qisa6V8NkYbwfraQJYi3G3miaNd4qP1pXIsdYK8d6KG7kIeplk7A2MljOa07gSDGh83EtmPUT3ipVUH7zyok1x9mHc95b-I4FtFn7vc_eVVXVZDJAaeCYIWK-rhZJl1CujSo2fLbFaZ89yPzLKWwNQfSPv1ht1OBDYGyh6qoWudbSl1wAWfrlbBHbAWmYoaI58ITFMlpNH6Addrm3S_f',
    isPro: false,
    isDownloaded: true,
    audioPreset: 'sufi_meditation',
    description: 'Gentle bamboo flute interwoven with distant monsoon thunder for peaceful listening.',
    language: 'Instrumental',
    moodTag: 'Monsoon Solitude'
  },
  {
    id: 'track-hi-10',
    title: 'Pee Loon (Coffeehouse Acoustic Unplugged)',
    artist: 'Mohit Chauhan',
    album: 'Bollywood Unplugged Lounge',
    genre: 'Hindi & Bollywood',
    duration: 260, // 4:20
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDy7BKK6z9RXjgGAISdjuPvupN0Gq_PHpCT8l3VHEG5jM3Hx3xyOiTyKqRTKeSu4ZN0tsH1biNwpLaF37kMoHoy13IPqU-rP1cK4bJYqDyZ801KJNgjp_6qXJ1WuNG4ql1U8IFBZwzfjrRMIbeykH_KtxcXUQXInC11KzVDQMwGEd0r0m9Y01hh4M_QkoSVY1XPdugCsQxBgEtl4KN-Fcv9ufnEZoNWlKxWcmJcs17t8Shi3VspQYx',
    isPro: false,
    isDownloaded: false,
    audioPreset: 'hindi_acoustic',
    description: 'Mellow fingerstyle acoustic guitar and smooth vocals recorded in a dry acoustic studio.',
    language: 'Hindi',
    moodTag: 'Coffeehouse Chill'
  },
  {
    id: 'track-hi-11',
    title: 'Chaudhvin Ka Chand (Lo-Fi Ghazal Chill)',
    artist: 'Mohammed Rafi & Saregama Vault',
    album: 'Golden Era Vintage Lo-Fi',
    genre: 'Hindi & Bollywood',
    duration: 215,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VpL5HGR4Dx6jRdpZNTA-rhNXOd6UuhEejghRKOKDT4Keh1BxHVicDpS1TrX5-fRsr3aDzV452oLpA4dcMH0KaLOz_sjgNJgkgQSI3d82jpDGha7Ng8wtx-KouUz6REPAE5l1nJE0H-rluZh7sO4D-8if4LeDUy3OyxNoLPqRImpD11T7H7g6aOEUMhPJ_A-1CMBgSK6XyCir8uGi_k4cNgz2M-HJNt5F0uPkUDVpFqc-3Zlz7-ez',
    isPro: false,
    isDownloaded: true,
    audioPreset: 'bollywood_lofi',
    description: 'Golden vintage harmonium and poetic cadence remastered with warm analog saturation.',
    language: 'Hindi',
    moodTag: 'Vintage Ghazal'
  },

  // --- GLOBAL BINAURAL & SOUNDTRACK HIGHLIGHTS ---
  {
    id: 'track-1',
    title: 'Cosmic Symphony (Live)',
    artist: 'A.R. Rahman',
    album: 'Cosmic Odyssey',
    genre: 'Soundtrack',
    duration: 230, // 3:50
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2',
    isPro: true,
    isDownloaded: true,
    binauralFreq: 40,
    audioPreset: 'deep_ambient',
    description: 'Expansive live cinematic orchestration blended with sub-bass ambient tones for rich immersion.'
  },
  {
    id: 'track-2',
    title: 'Harmonic Resonance (40Hz)',
    artist: 'Arjun Mehra',
    album: 'NeuroSonic',
    genre: 'Binaural',
    duration: 275, // 4:35
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyMPn0XbNXNVnsNMt6zhvFyVMiMrGkKixx91vS6dLavzrvnoeUOR0X3wmXnFg5ikqufDNCRrHH7KBgziqROMnKehgwgP6ptPcYr4usRG4Hlfki4TQAAhnhA5EsyHeGPxoYfoiSgjdeWlTJcVDgpOR9HPyjEo6EIppAS2XZ4oJZ6vTXXISJav37HQj1w5vswtvpV592jdGAZsUBvQcGlcKY7lkG1oshQKUHD7bRaWJEnX-Dhqe5iB4',
    isPro: false,
    isDownloaded: true,
    binauralFreq: 40,
    audioPreset: 'binaural_flow',
    description: '40Hz Gamma frequency waves mathematically tuned for auditory immersion and deep flow.'
  },
  {
    id: 'track-3',
    title: 'Midnight City Lights',
    artist: 'Saregama Lofi Labs',
    album: 'Midnight City Lights',
    genre: 'Lo-Fi',
    duration: 195, // 3:15
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDHoEYSZVySzLU36I681oiQJQw2SBTJK7nHF3TFx9VzITAPjJzjEpSOd3qQUR4fsnlDATu23ShhF3LCPD9lHlJHYHHCiGep8SlYRyYOzd5TxGmZ0s-_AgGPtn2OwaVN4DqP48QGc0Ru14btNA9HNtmNpuWo0mvui9c4swy7XsdquwVkyYm80hexE2HrJFXSJrnvkt1l5zkOsayMhP1ttvR-81nLmCzDUMmrQ9sM8wnQaIYY3tzi6cO',
    isPro: true,
    isDownloaded: true,
    audioPreset: 'lofi_synth',
    description: 'Warm analog synthesizers, gentle city rain, and tape flutter for nighttime relaxation.'
  },
  {
    id: 'track-4',
    title: 'Deep Ambient Horizons',
    artist: 'Aura Soundscapes',
    album: 'Ambient Horizons Mix',
    genre: 'Ambient',
    duration: 310, // 5:10
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhcXA-gFdbpjRi-mNts7aPF_1b4qBntRZ8Qisa6V8NkYbwfraQJYi3G3miaNd4qP1pXIsdYK8d6KG7kIeplk7A2MljOa07gSDGh83EtmPUT3ipVUH7zyok1x9mHc95b-I4FtFn7vc_eVVXVZDJAaeCYIWK-rhZJl1CujSo2fLbFaZ89yPzLKWwNQfSPv1ht1OBDYGyh6qoWudbSl1wAWfrlbBHbAWmYoaI58ITFMlpNH6Addrm3S_f',
    isPro: false,
    isDownloaded: false,
    audioPreset: 'rain_city',
    description: 'Ambient textures & subtle beats for rich atmospheric listening.'
  },
  {
    id: 'track-8',
    title: 'Interstellar Time Echoes',
    artist: 'Hans Zimmer Tribute',
    album: 'Cinematic Soundscapes',
    genre: 'Soundtrack',
    duration: 330,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDExdVdSVf1dXPfFKhd3iQzIjmFkEBFv-45zz_GZRxCqOqRohAYKPv9gb4p0ulWSzvj1V8zxwH1zauTuzzECIQNmnZ1OBhMQdulJuXPjQ5CyUN1WvnoEmrY-fvcYMBDVPIWV_cAXIHQLDmAB6aIzlTKe-ZYOWE0jXn6y5dK6EhFltipe2cWnO4j3xb3kFLxaqm2ZIK5_jHwnzm0zbONBoKS8Zpl8JVKovOF5CHU85KmdFJ-3T9fZDyy',
    isPro: true,
    isDownloaded: false,
    audioPreset: 'deep_ambient',
    description: 'Grand organ and ticking momentum creating majestic cinematic space.'
  }
];

export const downloadedAlbums: Album[] = [
  {
    id: 'alb-hi-1',
    title: 'Bollywood Lo-Fi Chillout',
    artist: 'Arijit Singh, Sachin-Jigar & Saregama Labs',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2',
    trackCount: 12,
    isPro: false,
    isDownloaded: true,
    genre: 'Hindi & Bollywood Lo-Fi',
    year: 2026
  },
  {
    id: 'alb-hi-2',
    title: 'Sacred Indian Classical Ragas',
    artist: 'Pt. Hariprasad Chaurasia & Ravi Shankar',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6',
    trackCount: 8,
    isPro: true,
    isDownloaded: true,
    genre: 'Classical & Ragas',
    year: 2026
  },
  {
    id: 'alb-hi-3',
    title: 'Bollywood Unplugged Lounge',
    artist: 'Pritam, Mohit Chauhan & Paras Nath',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj',
    trackCount: 10,
    isPro: false,
    isDownloaded: true,
    genre: 'Hindi Acoustic',
    year: 2026
  },
  {
    id: 'alb-1',
    title: 'Midnight City Lights',
    artist: 'Saregama Lofi',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDHoEYSZVySzLU36I681oiQJQw2SBTJK7nHF3TFx9VzITAPjJzjEpSOd3qQUR4fsnlDATu23ShhF3LCPD9lHlJHYHHCiGep8SlYRyYOzd5TxGmZ0s-_AgGPtn2OwaVN4DqP48QGc0Ru14btNA9HNtmNpuWo0mvui9c4swy7XsdquwVkyYm80hexE2HrJFXSJrnvkt1l5zkOsayMhP1ttvR-81nLmCzDUMmrQ9sM8wnQaIYY3tzi6cO',
    trackCount: 8,
    isPro: false,
    isDownloaded: true,
    genre: 'Lo-Fi',
    year: 2026
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: 'pl-hindi-lofi',
    title: 'Bollywood Lo-Fi Chillout',
    description: 'Kesariya, Lag Ja Gale & soothing Hindi acoustic tracks with gentle rain & tape flutter.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2',
    tracks: [allTracks[0], allTracks[3], allTracks[4], allTracks[6], allTracks[10]],
    isPro: false
  },
  {
    id: 'pl-ragas-focus',
    title: 'Vedic Ragas & Classical Heritage',
    description: 'Time-of-day Indian classical frequencies celebrating timeless melodic tradition.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6',
    tracks: [allTracks[1], allTracks[5], allTracks[7], allTracks[8]],
    isPro: true
  },
  {
    id: 'pl-sufi-deep',
    title: 'Sufi Sanctuary & 432Hz Harmonies',
    description: 'Kun Faya Kun, bansuri flute sweeps, and harmonic acoustic tanpura drones.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY',
    tracks: [allTracks[2], allTracks[8], allTracks[9], allTracks[1]],
    isPro: false
  },
  {
    id: 'pl-1',
    title: 'Ambient Horizons & Relaxing Beats',
    description: 'Ambient textures & subtle beats for pure acoustic relaxation.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhcXA-gFdbpjRi-mNts7aPF_1b4qBntRZ8Qisa6V8NkYbwfraQJYi3G3miaNd4qP1pXIsdYK8d6KG7kIeplk7A2MljOa07gSDGh83EtmPUT3ipVUH7zyok1x9mHc95b-I4FtFn7vc_eVVXVZDJAaeCYIWK-rhZJl1CujSo2fLbFaZ89yPzLKWwNQfSPv1ht1OBDYGyh6qoWudbSl1wAWfrlbBHbAWmYoaI58ITFMlpNH6Addrm3S_f',
    tracks: [allTracks[0], allTracks[1], allTracks[11], allTracks[12], allTracks[14]],
    isPro: false
  }
];

export const searchCategories = [
  {
    id: 'cat-hindi',
    title: 'Hindi & Bollywood',
    gradient: 'from-amber-900 to-rose-950',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2',
    isSpan2: true,
    tag: 'Top Trending'
  },
  {
    id: 'cat-ragas',
    title: 'Classical & Ragas',
    gradient: 'from-emerald-950 to-teal-900',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6',
    isSpan2: false,
    tag: 'Time of Day'
  },
  {
    id: 'cat-sufi',
    title: 'Sufi & Devotional',
    gradient: 'from-indigo-950 to-purple-950',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY',
    isSpan2: false,
    tag: '432Hz Calm'
  },
  {
    id: 'cat-chill',
    title: 'Chill & Lo-Fi',
    gradient: 'from-blue-900 to-indigo-900',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj',
    isSpan2: true,
    tag: 'Relaxing Beats'
  },
  {
    id: 'cat-binaural',
    title: 'Binaural & Ambient',
    gradient: 'from-cyan-950 to-blue-900',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyMPn0XbNXNVnsNMt6zhvFyVMiMrGkKixx91vS6dLavzrvnoeUOR0X3wmXnFg5ikqufDNCRrHH7KBgziqROMnKehgwgP6ptPcYr4usRG4Hlfki4TQAAhnhA5EsyHeGPxoYfoiSgjdeWlTJcVDgpOR9HPyjEo6EIppAS2XZ4oJZ6vTXXISJav37HQj1w5vswtvpV592jdGAZsUBvQcGlcKY7lkG1oshQKUHD7bRaWJEnX-Dhqe5iB4',
    isSpan2: false,
    tag: 'Immersive Audio'
  },
  {
    id: 'cat-soundtrack',
    title: 'Soundtracks',
    gradient: 'from-slate-800 to-gray-900',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDExdVdSVf1dXPfFKhd3iQzIjmFkEBFv-45zz_GZRxCqOqRohAYKPv9gb4p0ulWSzvj1V8zxwH1zauTuzzECIQNmnZ1OBhMQdulJuXPjQ5CyUN1WvnoEmrY-fvcYMBDVPIWV_cAXIHQLDmAB6aIzlTKe-ZYOWE0jXn6y5dK6EhFltipe2cWnO4j3xb3kFLxaqm2ZIK5_jHwnzm0zbONBoKS8Zpl8JVKovOF5CHU85KmdFJ-3T9fZDyy',
    isSpan2: false,
    tag: 'Cinematic'
  }
];

export const recentSearchItems = [
  {
    id: 'rec-1',
    title: 'Kesariya (Lo-Fi Acoustic)',
    subtitle: 'Track • Arijit Singh',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2',
    trackId: 'track-hi-1',
    isArtist: false
  },
  {
    id: 'rec-2',
    title: 'Pt. Hariprasad Chaurasia',
    subtitle: 'Artist • Classical Bansuri',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6',
    trackId: 'track-hi-2',
    isArtist: true
  },
  {
    id: 'rec-3',
    title: 'A.R. Rahman',
    subtitle: 'Composer • Sufi & Soundtracks',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY',
    trackId: 'track-hi-3',
    isArtist: true
  }
];
