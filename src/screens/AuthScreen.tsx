import React, { useState } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { UserProfile } from '../types';
import { defaultUsers } from '../data/userData';

interface AuthScreenProps {
  onSuccess: (user: UserProfile) => void;
  onBackToWelcome: () => void;
  initialMode?: 'signin' | 'signup';
  usersList: UserProfile[];
  onRegisterUser?: (newUser: UserProfile) => void;
}

const sampleAvatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCTVysCsPTB733wYArFpqx3fAbENEOoTdMjn_pxLd2D75tMqzQNEfe35uARZ8HkpbC4968EIdwct-Be_WO5lvPjEZ-s2Nuasa2aCtOEow39k6ypuCqSM7TlR4z4rJSc4XNIG1iMd1Dsr-KYFg69gmv0s_4V5TeJlyftVTyrfO6Ilde9d6upbrFDzC44FZxOvBZxHhaiwr32Drh2TANB-9O4rDIz-34ifAgZDDUNkkfb2L_qXiYbEQgb',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbPVyOIRZNcFei-hKUELpm2V6OTGQAlBCQM2DY2UbAUGjVnUwmrzIJSO0kd7B7EvxhOUym8ww0nePBnZu0406Bsl9K78dy_DKbQBDJDxGYfp1zUWdb1DO_JmCoKpX5RQBp9NX4vO_DVQf2SAFGJOL4KiEnY84Gl5mKTVE72uv_T6SCS7Je5sg4UfUy8tD_H6VGKa2D8p0sr-CX02mbad4IO6eZdthbuEOSvne-TVolo2APTtZmfbF',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-7Mq3HGGOfHEMSNB94rMHA0ZbDZXNJ3jpfFF4yG6e0O4LrNT1Wan7HFIiHEmWoQp2mj1CI-AsSO4hjdPIbPn834DtJegnihkH5Xuh5Rej39AXmlKzdp8ES9_NJPhs7pinqUaUi2MnZUOtJTzBVtYUJrLSyxczE6iDjHHgM0Hc5S7dBz_7OCI4o1SmYMsGYgcmsHsTq0SdvyEWpTKvaNNcaw-1WHqKfqGTEpzjiP5VW7UBLMweX17-',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEv0f9Iw72Cli1Tlo7sMEkZrNvR8QtnUiq8-F6oXCai_CgcxrwAj-Mktcp7xl3hDBiothjBITalOXWOdMfRAJY1gTmkBlYJbr0gcLLr1MnpYp_qC5avqUDxhSPzXjRrxhf8bDO2aiXvIozXz3DR4XZ7u592UDAyRkqbzkvmmehFlG5RF9BbMVpuM-hcnlIOnuatXMx02SzNpkVjkk1Rqf5HQQ3hnp8DdP2T10FusrdE-XCW3eIwWY'
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onBackToWelcome,
  initialMode = 'signin',
  usersList = defaultUsers,
  onRegisterUser
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('deepak.kumar@saregama.com');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [isStudent, setIsStudent] = useState(true);
  const [universityName, setUniversityName] = useState('Stanford University');
  const [selectedAvatar, setSelectedAvatar] = useState(sampleAvatars[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Errors & Modals
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC5MQV-SRgDrT91DXM7MZI7Ckm6GVxwuKvh9gGtPjZfw80KYJGI8C2VjFQyMRVMjjDJV1bI6Z3d_eBu1eg7FRmxM6upV-CZn1UTkJOJxnGnAiN1XLnGiWiO17_0QJjgxm9DAz8bySqnv4dguhgKa_tusxoWdhd-MHGTKiSGN7yFOigTUTLIPIcVpg-VAolY3YZ3iFXl6YGog3lZM4Q1FFx0OvBFjk6aZd1ayzJzM-YnRcHW33paa7x3';

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = signInEmail.trim().toLowerCase();
    const userFound = usersList.find((u) => u.email.toLowerCase() === emailTrimmed);

    if (!userFound) {
      // Allow fallback creation or login if demo email
      if (emailTrimmed.includes('@')) {
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: emailTrimmed.split('@')[0].replace('.', ' ').toUpperCase(),
          email: emailTrimmed,
          avatarUrl: sampleAvatars[0],
          isPro: false,
          planName: 'Free Tier',
          role: 'user',
          status: 'active',
          offlineStorageUsedMB: 0,
          maxStorageMB: 8000,
          audioQuality: 'High (320kbps)',
          downloadOnlyOnWifi: true,
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now',
          isStudentVerified: false
        };
        if (onRegisterUser) onRegisterUser(newUser);
        onSuccess(newUser);
        return;
      }
      setErrorMessage('Account not found. Please check your email or click Sign Up.');
      return;
    }

    if (userFound.status === 'suspended') {
      setErrorMessage('This account has been suspended by the Saregama Administrator. Please contact support.');
      return;
    }

    // Success login
    setSuccessMessage(`Welcome back, ${userFound.name}!`);
    setTimeout(() => {
      onSuccess(userFound);
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    // Check if email already registered
    const existing = usersList.find((u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase());
    if (existing) {
      setErrorMessage('An account with this email already exists. Please sign in instead.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      avatarUrl: selectedAvatar,
      isPro: isStudent,
      planName: isStudent ? 'Student 4-Year Pass' : 'Free Tier',
      role: 'user',
      status: 'active',
      offlineStorageUsedMB: 0,
      maxStorageMB: isStudent ? 32000 : 8000,
      audioQuality: isStudent ? 'Hi-Res Lossless (FLAC)' : 'High (320kbps)',
      downloadOnlyOnWifi: true,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      isStudentVerified: isStudent
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    }

    setSuccessMessage('Account created successfully! Loading your library...');
    setTimeout(() => {
      onSuccess(newUser);
    }, 500);
  };

  const handleQuickLogin = (email: string) => {
    const user = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase()) || defaultUsers[0];
    onSuccess(user);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#0a1000] text-[#cafd1e]">
      {/* Background Image with Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div
          className="w-full h-full bg-cover bg-center absolute inset-0 filter blur-sm scale-105"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <button
          onClick={onBackToWelcome}
          className="flex items-center gap-2 text-sm text-[#92b900] hover:text-[#00fde7] transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-serif-heading font-extrabold text-2xl text-[#00fde7] tracking-tight">
            Saregama
          </span>
          <span className="bg-[#1f2a00] border border-[#00fde7]/30 text-[#00fde7] px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
            SECURE ACCESS
          </span>
        </div>
      </header>

      {/* Main Authentication Canvas */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row items-center justify-center gap-10 flex-1">
        
        {/* Left Side: Brand Narrative & Quick Demo Access */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 max-w-lg">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#141c00]/90 border border-[#00fde7]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00fde7] mb-3 shadow-lg">
              <Sparkles size={14} className="text-[#ff5b5b]" />
              <span>Zero-Distraction Audio Engine</span>
            </div>
            <h1 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Sign in to your ad-free music space.
            </h1>
            <p className="text-sm sm:text-base text-[#92b900] mt-2 leading-relaxed">
              Resume your offline lossless downloads, curated playlists, and custom synthesizer soundscapes.
            </p>
          </div>

          {/* Quick Demo Test Access Cards */}
          <div className="bg-[#141c00]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#cafd1e] uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={14} className="text-[#00fde7]" /> Instant 1-Click Demo Profiles
              </span>
              <span className="text-[10px] text-[#92b900]">No typing needed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                id="quick-login-deepak"
                onClick={() => handleQuickLogin('deepak.kumar@saregama.com')}
                className="p-3 bg-[#192300] hover:bg-[#233000] border border-white/5 hover:border-[#00fde7]/50 rounded-xl text-left transition-all group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#00fde7]/40 shrink-0">
                  <img
                    src={defaultUsers[0].avatarUrl}
                    alt="Deepak"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-[#00fde7] truncate">
                    Deepak Kumar
                  </div>
                  <div className="text-[10px] text-[#00fde7] flex items-center gap-1">
                    <span>Student Pro</span> • <span>64GB</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                id="quick-login-aanya"
                onClick={() => handleQuickLogin('aanya.sharma@stanford.edu')}
                className="p-3 bg-[#192300] hover:bg-[#233000] border border-white/5 hover:border-[#00fde7]/50 rounded-xl text-left transition-all group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#00fde7]/40 shrink-0">
                  <img
                    src={defaultUsers[2].avatarUrl}
                    alt="Aanya"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-[#00fde7] truncate">
                    Aanya Sharma
                  </div>
                  <div className="text-[10px] text-[#cafd1e] flex items-center gap-1">
                    <span>4-Year Student</span> • <span>32GB</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Value Perks */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#92b900]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00fde7] shrink-0" />
              <span>Offline FLAC Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00fde7] shrink-0" />
              <span>40Hz Binaural Beats</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00fde7] shrink-0" />
              <span>Zero Commercials</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#00fde7] shrink-0" />
              <span>Local Encryption</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="w-full lg:w-1/2 max-w-md bg-[#141c00]/95 border border-[#00fde7]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          
          {/* Sign In / Sign Up Mode Switcher */}
          <div className="flex bg-[#0a1000] p-1 rounded-2xl border border-white/10 mb-6">
            <button
              id="auth-tab-signin"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-[#00fde7] text-[#00443d] shadow-md'
                  : 'text-[#92b900] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-signup"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-[#00fde7] text-[#00443d] shadow-md'
                  : 'text-[#92b900] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-[#3a0d0d] border border-[#ff5b5b]/50 rounded-xl flex items-start gap-2.5 text-xs text-[#ff9999] animate-shake">
              <AlertCircle size={16} className="text-[#ff5b5b] shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-[#003828] border border-[#00fde7]/50 rounded-xl flex items-center gap-2.5 text-xs text-[#00fde7] animate-pulse">
              <CheckCircle2 size={16} className="text-[#00fde7] shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="deepak.kumar@saregama.com"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-[#cafd1e] placeholder:text-[#92b900]/60 outline-none focus:border-[#00fde7] focus:ring-1 focus:ring-[#00fde7] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#cafd1e]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(signInEmail);
                      setShowForgotPasswordModal(true);
                    }}
                    className="text-xs text-[#00fde7] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                  <input
                    id="signin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-[#cafd1e] placeholder:text-[#92b900]/60 outline-none focus:border-[#00fde7] focus:ring-1 focus:ring-[#00fde7] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#92b900] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#92b900]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0a1000] border-white/20 text-[#00fde7] focus:ring-0 accent-[#00fde7]"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                id="signin-submit-btn"
                className="w-full mt-2 bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-base rounded-xl py-3.5 transition-all shadow-[0px_4px_20px_rgba(0,253,231,0.25)] hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Sign In to Saregama</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <UserIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Aanya Sharma"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#cafd1e] placeholder:text-[#92b900]/60 outline-none focus:border-[#00fde7] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="aanya@university.edu"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#cafd1e] placeholder:text-[#92b900]/60 outline-none focus:border-[#00fde7] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                  Create Password (min. 6 chars)
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#92b900]" />
                  <input
                    id="signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#cafd1e] placeholder:text-[#92b900]/60 outline-none focus:border-[#00fde7] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#92b900] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Student Verification Perks Toggle */}
              <div className="p-3 bg-[#192300] border border-[#00fde7]/30 rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="signup-student-checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-[#0a1000] border-white/20 text-[#00fde7] focus:ring-0 accent-[#00fde7]"
                />
                <label htmlFor="signup-student-checkbox" className="text-xs cursor-pointer">
                  <div className="font-bold text-[#00fde7] flex items-center gap-1.5">
                    <GraduationCap size={15} /> Student & Academic Tier (4-Year Free Pass)
                  </div>
                  <div className="text-[11px] text-[#92b900] mt-0.5">
                    Grants 32GB offline lossless storage & unlimited 40Hz gamma synthesizer presets.
                  </div>
                </label>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-[#92b900] uppercase mb-1.5">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-2.5">
                  {sampleAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        selectedAvatar === url
                          ? 'border-[#00fde7] scale-110 ring-2 ring-[#00fde7]/20'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 text-[11px] text-[#92b900] pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#0a1000] border-white/20 accent-[#00fde7]"
                />
                <span>I agree to Saregama's Ad-Free Terms of Service & Privacy Policy</span>
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                className="w-full bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-base rounded-xl py-3.5 transition-all shadow-[0px_4px_20px_rgba(0,253,231,0.25)] hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Create Account & Start Listening</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141c00] border border-[#00fde7]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="font-serif-heading font-bold text-xl text-[#00fde7] mb-2">
              Reset Your Password
            </h3>
            <p className="text-xs text-[#92b900] mb-4">
              Enter your registered email address. We will send a secure one-time login link.
            </p>

            {resetSent ? (
              <div className="p-3.5 bg-[#003828] border border-[#00fde7]/50 rounded-xl mb-4 text-xs text-[#00fde7] flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Password reset link sent to {forgotEmail}! Check your inbox.</span>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="deepak.kumar@saregama.com"
                  className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cafd1e] outline-none focus:border-[#00fde7]"
                />
              </div>
            )}

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setResetSent(false);
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-[#cafd1e] py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setResetSent(true);
                    }
                  }}
                  className="flex-1 bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
