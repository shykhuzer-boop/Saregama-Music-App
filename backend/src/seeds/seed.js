/**
 * Database Seed Script
 * Migrates all existing hardcoded frontend data into MongoDB.
 *
 * Usage: cd backend && node src/seeds/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/database');
const logger = require('../config/logger');

// Models
const User = require('../models/User');
const Track = require('../models/Track');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const FAQ = require('../models/FAQ');
const AdminLog = require('../models/AdminLog');

// ==============================================
// SEED DATA (from src/data/userData.ts and musicData.ts)
// ==============================================

const seedUsers = [
  {
    name: 'Deepak Kumar',
    email: 'deepak.kumar@saregama.com',
    passwordHash: 'password123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTVysCsPTB733wYArFpqx3fAbENEOoTdMjn_pxLd2D75tMqzQNEfe35uARZ8HkpbC4968EIdwct-Be_WO5lvPjEZ-s2Nuasa2aCtOEow39k6ypuCqSM7TlR4z4rJSc4XNIG1iMd1Dsr-KYFg69gmv0s_4V5TeJlyftVTyrfO6Ilde9d6upbrFDzC44FZxOvBZxHhaiwr32Drh2TANB-9O4rDIz-34ifAgZDDUNkkfb2L_qXiYbEQgb',
    isPro: true,
    planName: 'Pro Annual Membership',
    role: 'user',
    status: 'active',
    offlineStorageUsedMB: 4280,
    maxStorageMB: 64000,
    audioQuality: 'Hi-Res Lossless (FLAC)',
    downloadOnlyOnWifi: true,
    isStudentVerified: true,
  },
  {
    name: 'Admin Supervisor',
    email: 'admin@saregama.com',
    passwordHash: 'admin123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDy7BKK6z9RXjgGAISdjuPvupN0Gq_PHpCT8l3VHEG5jM3Hx3xyOiTyKqRTKeSu4ZN0tsH1biNwpLaF37kMoHoy13IPqU-rP1cK4bJYqDyZ801KJNgjp_6qXJ1WuNG4ql1U8IFBZwzfjrRMIbeykH_KtxcXUQXInC11KzVDQMwGEd0r0m9Y01hh4M_QkoSVY1XPdugCsQxBgEtl4KN-Fcv9ufnEZoNWlKxWcmJcs17t8Shi3VspQYx',
    isPro: true,
    planName: 'Master Admin Access',
    role: 'admin',
    status: 'active',
    offlineStorageUsedMB: 1240,
    maxStorageMB: 128000,
    audioQuality: 'Hi-Res Lossless (FLAC)',
    downloadOnlyOnWifi: false,
    isStudentVerified: false,
  },
  {
    name: 'Aanya Sharma',
    email: 'aanya.sharma@stanford.edu',
    passwordHash: 'student123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbPVyOIRZNcFei-hKUELpm2V6OTGQAlBCQM2DY2UbAUGjVnUwmrzIJSO0kd7B7EvxhOUym8ww0nePBnZu0406Bsl9K78dy_DKbQBDJDxGYfp1zUWdb1DO_JmCoKpX5RQBp9NX4vO_DVQf2SAFGJOL4KiEnY84Gl5mKTVE72uv_T6SCS7Je5sg4UfUy8tD_H6VGKa2D8p0sr-CX02mbad4IO6eZdthbuEOSvne-TVolo2APTtZmfbF',
    isPro: true,
    planName: 'Student Annual Pass',
    role: 'user',
    status: 'active',
    offlineStorageUsedMB: 8120,
    maxStorageMB: 32000,
    audioQuality: 'High (320kbps)',
    downloadOnlyOnWifi: true,
    isStudentVerified: true,
    universityName: 'Stanford University',
  },
  {
    name: 'Rohan Deshmukh',
    email: 'rohan.d@mit.edu',
    passwordHash: 'password123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-7Mq3HGGOfHEMSNB94rMHA0ZbDZXNJ3jpfFF4yG6e0O4LrNT1Wan7HFIiHEmWoQp2mj1CI-AsSO4hjdPIbPn834DtJegnihkH5Xuh5Rej39AXmlKzdp8ES9_NJPhs7pinqUaUi2MnZUOtJTzBVtYUJrLSyxczE6iDjHHgM0Hc5S7dBz_7OCI4o1SmYMsGYgcmsHsTq0SdvyEWpTKvaNNcaw-1WHqKfqGTEpzjiP5VW7UBLMweX17-',
    isPro: false,
    planName: 'Free Tier',
    role: 'user',
    status: 'active',
    offlineStorageUsedMB: 450,
    maxStorageMB: 2000,
    audioQuality: 'Normal (160kbps)',
    downloadOnlyOnWifi: true,
    isStudentVerified: false,
  },
  {
    name: 'Vikram Mehta',
    email: 'vikram.mehta@devlabs.io',
    passwordHash: 'password123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY',
    isPro: true,
    planName: 'Pro Monthly Pass',
    role: 'user',
    status: 'pending',
    offlineStorageUsedMB: 1900,
    maxStorageMB: 16000,
    audioQuality: 'Hi-Res Lossless (FLAC)',
    downloadOnlyOnWifi: false,
    isStudentVerified: false,
  },
  {
    name: 'Zoya Khan',
    email: 'zoya.spammer@tempmail.org',
    passwordHash: 'password123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj',
    isPro: false,
    planName: 'Suspended Account',
    role: 'user',
    status: 'suspended',
    offlineStorageUsedMB: 0,
    maxStorageMB: 0,
    audioQuality: 'Normal (160kbps)',
    downloadOnlyOnWifi: true,
    isStudentVerified: false,
  },
];

const seedTracks = [
  { title: 'Kesariya (Lo-Fi Acoustic Reprise)', artist: 'Arijit Singh • Saregama Lo-Fi Labs', album: 'Bollywood Lo-Fi Chillout', genre: 'Hindi & Bollywood', duration: 228, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2', isPro: false, binauralFreq: 40, audioPreset: 'bollywood_lofi', description: 'Nostalgic acoustic guitar, warm vinyl crackle, and soft rainfall.', language: 'Hindi', moodTag: 'Acoustic Lo-Fi' },
  { title: 'Raag Bhairavi (Dawn Awakening & Saraswati Dhun)', artist: 'Pt. Hariprasad Chaurasia & Zakir Hussain', album: 'Sacred Indian Classical Ragas', genre: 'Classical & Ragas', duration: 380, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6', isPro: true, binauralFreq: 40, audioPreset: 'sufi_meditation', description: 'Soulful bansuri flute and meditative tanpura drone.', language: 'Instrumental', ragaTime: 'Dawn (Bhairav)', moodTag: 'Dawn Serenity' },
  { title: 'Kun Faya Kun (Meditative Sufi Ambient)', artist: 'A.R. Rahman, Javed Ali & Mohit Chauhan', album: 'Sufi Sanctuary Harmonies', genre: 'Sufi & Devotional', duration: 345, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY', isPro: false, audioPreset: 'sufi_meditation', description: '432Hz harmonic tuning, ethereal acoustic harmonium.', language: 'Hindi', moodTag: 'Soulful Peace' },
  { title: 'Lag Ja Gale (Midnight Vinyl Lo-Fi)', artist: 'Lata Mangeshkar & Saregama Retro Vault', album: 'Golden Era Vintage Lo-Fi', genre: 'Hindi & Bollywood', duration: 210, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VpL5HGR4Dx6jRdpZNTA-rhNXOd6UuhEejghRKOKDT4Keh1BxHVicDpS1TrX5-fRsr3aDzV452oLpA4dcMH0KaLOz_sjgNJgkgQSI3d82jpDGha7Ng8wtx-KouUz6REPAE5l1nJE0H-rluZh7sO4D-8if4LeDUy3OyxNoLPqRImpD11T7H7g6aOEUMhPJ_A-1CMBgSK6XyCir8uGi_k4cNgz2M-HJNt5F0uPkUDVpFqc-3Zlz7-ez', isPro: false, audioPreset: 'bollywood_lofi', description: 'Timeless vintage melody reimagined with mellow Rhodes chords.', language: 'Hindi', moodTag: 'Vintage Nostalgia' },
  { title: 'Tum Mile (Late Night Acoustic Lounge)', artist: 'Pritam & Neeraj Shridhar', album: 'Bollywood Unplugged Lounge', genre: 'Hindi & Bollywood', duration: 250, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj', isPro: true, audioPreset: 'hindi_acoustic', description: 'Fingerstyle acoustic guitar for relaxed evening listening.', language: 'Hindi', moodTag: 'Late Night Acoustic' },
  { title: 'Raag Yaman (Sunset Sitar & Harmonies)', artist: 'Pt. Ravi Shankar & Anoushka Shankar', album: 'Sacred Indian Classical Ragas', genre: 'Classical & Ragas', duration: 410, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBetDCrUDGES8YDNb4bjIIffp_bX5e9jsOEIYc8coc7vOZI_brYzGkiQt2qYiWPNbcGBU0p1EZw1vh0CwATuKrJRads8N77akeNOZohawW4sK8xIY9p3QaORDj7V1Z1I8s2kvUAT5HRbg4C4kNl17nm_1dsBG1VKuNC8lLnE8cXC3X83G7uW44saVrV98f_ZsG1vyrbQkCgvdMTQDgqf9ckiQtzihHtTIkJWdsLgydMcT7-3hsqxgp', isPro: false, audioPreset: 'hindi_acoustic', description: 'Harmonious evening raga strings.', language: 'Instrumental', ragaTime: 'Sunset/Evening (Yaman)', moodTag: 'Evening Harmony' },
  { title: 'Apna Bana Le (Acoustic Chillhop)', artist: 'Arijit Singh & Sachin-Jigar', album: 'Bollywood Lo-Fi Chillout', genre: 'Hindi & Bollywood', duration: 215, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDHoEYSZVySzLU36I681oiQJQw2SBTJK7nHF3TFx9VzITAPjJzjEpSOd3qQUR4fsnlDATu23ShhF3LCPD9lHlJHYHHCiGep8SlYRyYOzd5TxGmZ0s-_AgGPtn2OwaVN4DqP48QGc0Ru14btNA9HNtmNpuWo0mvui9c4swy7XsdquwVkyYm80hexE2HrJFXSJrnvkt1l5zkOsayMhP1ttvR-81nLmCzDUMmrQ9sM8wnQaIYY3tzi6cO', isPro: false, audioPreset: 'bollywood_lofi', description: 'Gentle piano accents with 72 BPM chillhop pulse.', language: 'Hindi', moodTag: 'Mellow Chillhop' },
  { title: 'Gayatri Mantra (Sacred 432Hz Vedic Chant)', artist: 'Sanskrit Heritage Project & Anuradha Paudwal', album: 'Vedic Meditative Chants', genre: 'Sufi & Devotional', duration: 300, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyMPn0XbNXNVnsNMt6zhvFyVMiMrGkKixx91vS6dLavzrvnoeUOR0X3wmXnFg5ikqufDNCRrHH7KBgziqROMnKehgwgP6ptPcYr4usRG4Hlfki4TQAAhnhA5EsyHeGPxoYfoiSgjdeWlTJcVDgpOR9HPyjEo6EIppAS2XZ4oJZ6vTXXISJav37HQj1w5vswtvpV592jdGAZsUBvQcGlcKY7lkG1oshQKUHD7bRaWJEnX-Dhqe5iB4', isPro: true, binauralFreq: 40, audioPreset: 'binaural_om', description: '136.1Hz Cosmic Om baseline with ancient Sanskrit chanting.', language: 'Sanskrit', moodTag: 'Spiritual Calm' },
  { title: 'Kahani (Bansuri & Monsoon Rain Reprise)', artist: 'Pritam & Paras Nath', album: 'Bollywood Unplugged Lounge', genre: 'Hindi & Bollywood', duration: 240, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhcXA-gFdbpjRi-mNts7aPF_1b4qBntRZ8Qisa6V8NkYbwfraQJYi3G3miaNd4qP1pXIsdYK8d6KG7kIeplk7A2MljOa07gSDGh83EtmPUT3ipVUH7zyok1x9mHc95b-I4FtFn7vc_eVVXVZDJAaeCYIWK-rhZJl1CujSo2fLbFaZ89yPzLKWwNQfSPv1ht1OBDYGyh6qoWudbSl1wAWfrlbBHbAWmYoaI58ITFMlpNH6Addrm3S_f', isPro: false, audioPreset: 'sufi_meditation', description: 'Gentle bamboo flute with distant monsoon thunder.', language: 'Instrumental', moodTag: 'Monsoon Solitude' },
  { title: 'Pee Loon (Coffeehouse Acoustic Unplugged)', artist: 'Mohit Chauhan', album: 'Bollywood Unplugged Lounge', genre: 'Hindi & Bollywood', duration: 260, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDy7BKK6z9RXjgGAISdjuPvupN0Gq_PHpCT8l3VHEG5jM3Hx3xyOiTyKqRTKeSu4ZN0tsH1biNwpLaF37kMoHoy13IPqU-rP1cK4bJYqDyZ801KJNgjp_6qXJ1WuNG4ql1U8IFBZwzfjrRMIbeykH_KtxcXUQXInC11KzVDQMwGEd0r0m9Y01hh4M_QkoSVY1XPdugCsQxBgEtl4KN-Fcv9ufnEZoNWlKxWcmJcs17t8Shi3VspQYx', isPro: false, audioPreset: 'hindi_acoustic', description: 'Mellow fingerstyle acoustic guitar and smooth vocals.', language: 'Hindi', moodTag: 'Coffeehouse Chill' },
  { title: 'Chaudhvin Ka Chand (Lo-Fi Ghazal Chill)', artist: 'Mohammed Rafi & Saregama Vault', album: 'Golden Era Vintage Lo-Fi', genre: 'Hindi & Bollywood', duration: 215, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VpL5HGR4Dx6jRdpZNTA-rhNXOd6UuhEejghRKOKDT4Keh1BxHVicDpS1TrX5-fRsr3aDzV452oLpA4dcMH0KaLOz_sjgNJgkgQSI3d82jpDGha7Ng8wtx-KouUz6REPAE5l1nJE0H-rluZh7sO4D-8if4LeDUy3OyxNoLPqRImpD11T7H7g6aOEUMhPJ_A-1CMBgSK6XyCir8uGi_k4cNgz2M-HJNt5F0uPkUDVpFqc-3Zlz7-ez', isPro: false, audioPreset: 'bollywood_lofi', description: 'Golden vintage harmonium remastered with warm analog saturation.', language: 'Hindi', moodTag: 'Vintage Ghazal' },
  { title: 'Cosmic Symphony (Live)', artist: 'A.R. Rahman', album: 'Cosmic Odyssey', genre: 'Soundtrack', duration: 230, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2', isPro: true, binauralFreq: 40, audioPreset: 'deep_ambient', description: 'Expansive live cinematic orchestration.' },
  { title: 'Harmonic Resonance (40Hz)', artist: 'Arjun Mehra', album: 'NeuroSonic', genre: 'Binaural', duration: 275, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyMPn0XbNXNVnsNMt6zhvFyVMiMrGkKixx91vS6dLavzrvnoeUOR0X3wmXnFg5ikqufDNCRrHH7KBgziqROMnKehgwgP6ptPcYr4usRG4Hlfki4TQAAhnhA5EsyHeGPxoYfoiSgjdeWlTJcVDgpOR9HPyjEo6EIppAS2XZ4oJZ6vTXXISJav37HQj1w5vswtvpV592jdGAZsUBvQcGlcKY7lkG1oshQKUHD7bRaWJEnX-Dhqe5iB4', isPro: false, binauralFreq: 40, audioPreset: 'binaural_flow', description: '40Hz Gamma frequency waves for auditory immersion.' },
  { title: 'Midnight City Lights', artist: 'Saregama Lofi Labs', album: 'Midnight City Lights', genre: 'Lo-Fi', duration: 195, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDHoEYSZVySzLU36I681oiQJQw2SBTJK7nHF3TFx9VzITAPjJzjEpSOd3qQUR4fsnlDATu23ShhF3LCPD9lHlJHYHHCiGep8SlYRyYOzd5TxGmZ0s-_AgGPtn2OwaVN4DqP48QGc0Ru14btNA9HNtmNpuWo0mvui9c4swy7XsdquwVkyYm80hexE2HrJFXSJrnvkt1l5zkOsayMhP1ttvR-81nLmCzDUMmrQ9sM8wnQaIYY3tzi6cO', isPro: true, audioPreset: 'lofi_synth', description: 'Warm analog synthesizers, gentle city rain.' },
  { title: 'Deep Ambient Horizons', artist: 'Aura Soundscapes', album: 'Ambient Horizons Mix', genre: 'Ambient', duration: 310, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhcXA-gFdbpjRi-mNts7aPF_1b4qBntRZ8Qisa6V8NkYbwfraQJYi3G3miaNd4qP1pXIsdYK8d6KG7kIeplk7A2MljOa07gSDGh83EtmPUT3ipVUH7zyok1x9mHc95b-I4FtFn7vc_eVVXVZDJAaeCYIWK-rhZJl1CujSo2fLbFaZ89yPzLKWwNQfSPv1ht1OBDYGyh6qoWudbSl1wAWfrlbBHbAWmYoaI58ITFMlpNH6Addrm3S_f', isPro: false, audioPreset: 'rain_city', description: 'Ambient textures & subtle beats.' },
  { title: 'Interstellar Time Echoes', artist: 'Hans Zimmer Tribute', album: 'Cinematic Soundscapes', genre: 'Soundtrack', duration: 330, coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDExdVdSVf1dXPfFKhd3iQzIjmFkEBFv-45zz_GZRxCqOqRohAYKPv9gb4p0ulWSzvj1V8zxwH1zauTuzzECIQNmnZ1OBhMQdulJuXPjQ5CyUN1WvnoEmrY-fvcYMBDVPIWV_cAXIHQLDmAB6aIzlTKe-ZYOWE0jXn6y5dK6EhFltipe2cWnO4j3xb3kFLxaqm2ZIK5_jHwnzm0zbONBoKS8Zpl8JVKovOF5CHU85KmdFJ-3T9fZDyy', isPro: true, audioPreset: 'deep_ambient', description: 'Grand organ and ticking momentum creating majestic space.' },
];

const seedAlbums = [
  { title: 'Bollywood Lo-Fi Chillout', artist: 'Arijit Singh, Sachin-Jigar & Saregama Labs', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNt-rgEekjRMr1yBmhzIlgBHFFB_A_OwH96mQdCzjPF4pFWiHnd9MYsgzzZJ1Krr06pESrswrshDxNPhFa4t2dVO1jgqiWHlS32i-vta7u6Lx4o_I2gP9LrkOz60JQkd2sPMuRY46Qy6VkQBy7OdZgD5tbUPbzXBPKJxWMIkEme3r38fOiiojl-SvFs-c4J4H0Eof-CYxD1OaG-ki5h0MT_6W_0pOjpIwV4_1Yzd6dpHNw1DhxgEf2', trackCount: 12, isPro: false, genre: 'Hindi & Bollywood Lo-Fi', year: 2026 },
  { title: 'Sacred Indian Classical Ragas', artist: 'Pt. Hariprasad Chaurasia & Ravi Shankar', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NOcjPJ8LZAjbyX3PW1hoCLxdL89cD88DcjaLPQgleUA_0SKJJfMPd4LZSIDWu_K5WZ8Fw6YWgtIPN0PEIuV-_0yOopQpcVh35uBUUG1oJuQd-iXSlTS1qQkC2q7CzBqJCRUDjpIQOjay-neF9jpNa7jiPHOo7-T3CnWMDW7lL-ngCOkMZRR_-NnxcEVO_4vJuHBTXFSC98YcsJOa6AOQUXLekjOzsa5tsEN1WHZPL9ENhCClaK_6', trackCount: 8, isPro: true, genre: 'Classical & Ragas', year: 2026 },
  { title: 'Bollywood Unplugged Lounge', artist: 'Pritam, Mohit Chauhan & Paras Nath', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOM4Whv19urEAc1PbU0UD2u0BZS0QQxPbFTcGilxDoa2VXRVKIvJ6PN_7_BvwuE_Tg_xh0-k-wbhinGby6WfjEbdzt8Xb15Ew_f7mZ5IcLxlWUDyeRgRKjH70l1mkJr-qBYzY2l1Ka3nX8942rVvJDuIWfqzJsA0tojwl07dBfeoE7keCvBN_sS_0vDjrCcTY8HwoywOZFivnlcCjHKk0q4Uxber9FSHQyASB2jD73CQOP4gTDjaqj', trackCount: 10, isPro: false, genre: 'Hindi Acoustic', year: 2026 },
  { title: 'Midnight City Lights', artist: 'Saregama Lofi', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDHoEYSZVySzLU36I681oiQJQw2SBTJK7nHF3TFx9VzITAPjJzjEpSOd3qQUR4fsnlDATu23ShhF3LCPD9lHlJHYHHCiGep8SlYRyYOzd5TxGmZ0s-_AgGPtn2OwaVN4DqP48QGc0Ru14btNA9HNtmNpuWo0mvui9c4swy7XsdquwVkyYm80hexE2HrJFXSJrnvkt1l5zkOsayMhP1ttvR-81nLmCzDUMmrQ9sM8wnQaIYY3tzi6cO', trackCount: 8, isPro: false, genre: 'Lo-Fi', year: 2026 },
];

const seedFAQs = [
  { category: 'Offline & Storage', question: 'How do offline downloads work on Saregama?', answer: 'When you click the download icon on any track or album, Saregama caches the uncompressed audio streams directly into your device\'s secure local storage.', tags: ['download', 'offline', 'storage', 'airplane', 'wifi'] },
  { category: '40Hz Binaural Science', question: 'What are 40Hz Binaural Beats and how do they enhance listening?', answer: '40Hz Gamma wave oscillations stimulate neural audio synchronization. When listened to through stereo headphones, the subtle frequency difference creates an immersive spatial sound field.', tags: ['binaural', 'gamma', '40hz', 'science', 'headphones'] },
  { category: 'Pro & Subscriptions', question: 'What is included in the Pro Membership?', answer: 'The Pro tier includes unlimited ad-free listening, 40Hz Gamma wave soundscapes, Hi-Res FLAC Lossless audio, up to 64GB of offline storage, and custom synthesizer soundscapes.', tags: ['pro', 'student', 'pricing', 'features'] },
  { category: 'Audio & Sound Engine', question: 'How do I switch between synthesizer soundscapes?', answer: 'Open the Full-Screen Player by tapping the bottom player bar. Under "Soundscape Synthesizer", switch between Lo-Fi Synth, Binaural Gamma, Deep Ambient, Piano Reverb, Rain City, and Chill Pulse.', tags: ['synth', 'presets', 'soundscape', 'player'] },
  { category: 'Offline & Storage', question: 'How do I free up storage or clear offline cache?', answer: 'Navigate to "My Profile" or "Settings" and look for the Offline Storage meter. Click "Clear Offline Cache" to restore your device space.', tags: ['clear cache', 'storage limit', 'free space'] },
  { category: 'Account & Privacy', question: 'How can I change my password or profile picture?', answer: 'Go to your Profile screen and click "Edit Profile". You can update your display name, email, audio quality, and avatar.', tags: ['profile', 'password', 'avatar', 'account'] },
  { category: 'Keyboard Shortcuts', question: 'Are there keyboard shortcuts for rapid navigation?', answer: 'Yes! Press [Space] to toggle Play/Pause, [M] to mute, [Arrow keys] to seek, and [F] for Full-Screen Player.', tags: ['shortcuts', 'hotkeys', 'keyboard'] },
];

const seedAdminLogs = [
  { action: 'Plan Upgrade', adminName: 'Admin Supervisor', targetUser: 'Aanya Sharma', details: 'Verified Stanford .edu student account & activated Student Annual Pass with 32GB offline quota.', type: 'plan_change' },
  { action: 'Account Suspended', adminName: 'Admin Supervisor', targetUser: 'Zoya Khan', details: 'Detected automated scraping bot activity. Banned IP and suspended account.', type: 'user_edit' },
  { action: 'User Registered', adminName: 'System Auth', targetUser: 'Vikram Mehta', details: 'New user registration via Web Client. Verification email dispatched.', type: 'user_add' },
  { action: 'Storage Limit Adjusted', adminName: 'Admin Supervisor', targetUser: 'Deepak Kumar', details: 'Expanded lossless offline cache quota to 64,000 MB.', type: 'user_edit' },
];

// ==============================================
// SEED EXECUTION
// ==============================================

const seedDatabase = async () => {
  try {
    await connectDB();

    logger.info('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Track.deleteMany({}),
      Album.deleteMany({}),
      Playlist.deleteMany({}),
      FAQ.deleteMany({}),
      AdminLog.deleteMany({}),
    ]);

    // Seed Users (passwords will be hashed by pre-save hook)
    logger.info('Seeding users...');
    const users = await User.create(seedUsers);
    logger.info(`  ✓ ${users.length} users created`);

    // Seed Tracks
    logger.info('Seeding tracks...');
    const tracks = await Track.create(seedTracks);
    logger.info(`  ✓ ${tracks.length} tracks created`);

    // Seed Albums
    logger.info('Seeding albums...');
    const albums = await Album.create(seedAlbums);
    logger.info(`  ✓ ${albums.length} albums created`);

    // Seed Playlists (with track references)
    logger.info('Seeding playlists...');
    const playlists = await Playlist.create([
      {
        title: 'Bollywood Lo-Fi Chillout',
        description: 'Kesariya, Lag Ja Gale & soothing Hindi acoustic tracks with gentle rain & tape flutter.',
        coverUrl: tracks[0].coverUrl,
        tracks: [tracks[0]._id, tracks[3]._id, tracks[4]._id, tracks[6]._id, tracks[10]._id],
        isCustom: false,
        isPro: false,
      },
      {
        title: 'Vedic Ragas & Classical Heritage',
        description: 'Time-of-day Indian classical frequencies celebrating timeless melodic tradition.',
        coverUrl: tracks[1].coverUrl,
        tracks: [tracks[1]._id, tracks[5]._id, tracks[7]._id, tracks[8]._id],
        isCustom: false,
        isPro: true,
      },
      {
        title: 'Sufi Sanctuary & 432Hz Harmonies',
        description: 'Kun Faya Kun, bansuri flute sweeps, and harmonic acoustic tanpura drones.',
        coverUrl: tracks[2].coverUrl,
        tracks: [tracks[2]._id, tracks[8]._id, tracks[9]._id, tracks[1]._id],
        isCustom: false,
        isPro: false,
      },
      {
        title: 'Ambient Horizons & Relaxing Beats',
        description: 'Ambient textures & subtle beats for pure acoustic relaxation.',
        coverUrl: tracks[14].coverUrl,
        tracks: [tracks[0]._id, tracks[1]._id, tracks[11]._id, tracks[12]._id, tracks[14]._id],
        isCustom: false,
        isPro: false,
      },
    ]);
    logger.info(`  ✓ ${playlists.length} playlists created`);

    // Seed FAQs
    logger.info('Seeding FAQs...');
    const faqs = await FAQ.create(seedFAQs);
    logger.info(`  ✓ ${faqs.length} FAQs created`);

    // Seed Admin Logs
    logger.info('Seeding admin logs...');
    const logs = await AdminLog.create(seedAdminLogs);
    logger.info(`  ✓ ${logs.length} admin logs created`);

    logger.info('');
    logger.info('========================================');
    logger.info('  DATABASE SEEDED SUCCESSFULLY');
    logger.info('========================================');
    logger.info('');
    logger.info('Demo Accounts:');
    logger.info('  Admin:   admin@saregama.com / admin123');
    logger.info('  User:    deepak.kumar@saregama.com / password123');
    logger.info('  Student: aanya.sharma@stanford.edu / student123');
    logger.info('');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
