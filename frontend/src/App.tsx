import React, { useState, useEffect, useRef } from 'react';
import { ScreenName, Track, Playlist, UserProfile, Album } from './types';
import { initialUser, allTracks, initialPlaylists, downloadedAlbums } from './data/musicData';
import { defaultUsers } from './data/userData';
import { audioEngine } from './services/audioService';
import { authAPI, getAuthToken, clearAuthToken, setAuthToken } from './services/apiService';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { HelpFAQScreen } from './screens/HelpFAQScreen';
import { AdminPortalScreen } from './screens/AdminPortalScreen';
import { FullScreenPlayerScreen } from './screens/FullScreenPlayerScreen';
import { NavigationDrawer } from './components/NavigationDrawer';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { GlobalPlayerBar } from './components/GlobalPlayerBar';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { PlaylistDetailModal } from './components/PlaylistDetailModal';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState<boolean>(false);

  // User & User Management State
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('saregama_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultUsers;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('saregama_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialUser;
  });

  // Save usersList to storage
  useEffect(() => {
    try {
      localStorage.setItem('saregama_users', JSON.stringify(usersList));
    } catch {
      // ignore
    }
  }, [usersList]);

  // Save current user to storage
  useEffect(() => {
    try {
      localStorage.setItem('saregama_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Tracks & Playlists State
  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('saregama_tracks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return allTracks;
  });

  // Albums State with persistence
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('saregama_albums');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return downloadedAlbums;
  });

  // Save tracks to storage
  useEffect(() => {
    try {
      localStorage.setItem('saregama_tracks', JSON.stringify(tracks));
    } catch {
      // ignore
    }
  }, [tracks]);

  // Save albums to storage
  useEffect(() => {
    try {
      localStorage.setItem('saregama_albums', JSON.stringify(albums));
    } catch {
      // ignore
    }
  }, [albums]);

  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(['track-1', 'track-2', 'track-3']);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [activePlaylistModal, setActivePlaylistModal] = useState<Playlist | null>(null);

  // Playback State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(allTracks[0]); // Cosmic Symphony (Live)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(105); // 1:45 matching mockup
  const [duration, setDuration] = useState<number>(230); // 3:50 matching mockup
  const [volume, setVolume] = useState<number>(0.8);

  const timerRef = useRef<number | null>(null);

  // Audio Playback Engine Integration
  useEffect(() => {
    if (isPlaying && currentTrack) {
      audioEngine.playPreset(currentTrack.audioPreset);
    } else {
      audioEngine.pause();
    }
  }, [isPlaying, currentTrack]);

  // Volume synchronization
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  // Timer Tick for playback progression
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  // Global Supervisor Secret Key Combination Listener (Ctrl + Shift + A, Alt + Shift + A, or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for secret key combination: (Ctrl + Shift + A) or (Alt + Shift + A) or (Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentScreen('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Playback Handler Functions
  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setDuration(track.duration);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (!currentTrack) {
      if (tracks.length > 0) {
        handlePlayTrack(tracks[0]);
      }
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handlePlayTrack(tracks[prevIndex]);
  };

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handlePlayTrack(tracks[nextIndex]);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, seconds)));
  };

  const handleToggleLike = (trackId: string) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleDownloadTrack = (track: Track) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === track.id ? { ...t, isDownloaded: true } : t))
    );
    setUser((prev) => ({
      ...prev,
      offlineStorageUsedMB: prev.offlineStorageUsedMB + 45,
    }));
  };

  const handleRemoveDownload = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isDownloaded: false } : t))
    );
    setUser((prev) => ({
      ...prev,
      offlineStorageUsedMB: Math.max(0, prev.offlineStorageUsedMB - 45),
    }));
  };

  const handleClearOfflineData = () => {
    setTracks((prev) => prev.map((t) => ({ ...t, isDownloaded: false })));
    setUser((prev) => ({ ...prev, offlineStorageUsedMB: 0 }));
  };

  const handleCreatePlaylist = (
    title: string,
    description: string,
    selectedTrackIds: string[]
  ) => {
    const chosenTracks = tracks.filter((t) => selectedTrackIds.includes(t.id));
    const newPl: Playlist = {
      id: `pl-custom-${Date.now()}`,
      title,
      description,
      coverUrl: chosenTracks[0]?.coverUrl || tracks[0].coverUrl,
      tracks: chosenTracks,
      isCustom: true,
    };
    setPlaylists([newPl, ...playlists]);
    setActivePlaylistModal(newPl);
  };

  const handleRemoveTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            tracks: pl.tracks.filter((t) => t.id !== trackId),
          };
        }
        return pl;
      })
    );
    if (activePlaylistModal && activePlaylistModal.id === playlistId) {
      setActivePlaylistModal((prev) =>
        prev ? { ...prev, tracks: prev.tracks.filter((t) => t.id !== trackId) } : null
      );
    }
  };

  const handlePlayAllPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      handlePlayTrack(playlist.tracks[0]);
    }
  };

  const handlePresetChange = (preset: Track['audioPreset']) => {
    if (currentTrack) {
      const updatedTrack = { ...currentTrack, audioPreset: preset };
      setCurrentTrack(updatedTrack);
      setTracks((prev) => prev.map((t) => (t.id === updatedTrack.id ? updatedTrack : t)));
      audioEngine.playPreset(preset);
    }
  };

  // Auth & User Management Handlers
  const handleAuthSuccess = (authedUser: UserProfile) => {
    setUser(authedUser);
    setCurrentScreen('home');
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    setUsersList((prev) => [newUser, ...prev]);
  };

  const handleLogout = () => {
    setIsPlaying(false);
    audioEngine.pause();
    clearAuthToken();
    setCurrentScreen('welcome');
  };

  const handleImpersonateUser = (impersonatedUser: UserProfile) => {
    setUser(impersonatedUser);
    setCurrentScreen('home');
  };

  // Album Artwork & Poster Handlers
  const handleUpdateAlbumPoster = (albumId: string, newCoverUrl: string, syncTracks = true) => {
    setAlbums((prev) =>
      prev.map((alb) => (alb.id === albumId ? { ...alb, coverUrl: newCoverUrl } : alb))
    );
    const targetAlbum = albums.find((a) => a.id === albumId);
    if (syncTracks && targetAlbum) {
      setTracks((prev) =>
        prev.map((t) => {
          if (t.album === targetAlbum.title || t.id.startsWith(albumId)) {
            return { ...t, coverUrl: newCoverUrl };
          }
          return t;
        })
      );
      if (currentTrack && (currentTrack.album === targetAlbum.title || currentTrack.id.startsWith(albumId))) {
        setCurrentTrack((prev) => (prev ? { ...prev, coverUrl: newCoverUrl } : null));
      }
    }
  };

  const handleUpdateTrackPoster = (trackId: string, newCoverUrl: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, coverUrl: newCoverUrl } : t))
    );
    if (currentTrack && currentTrack.id === trackId) {
      setCurrentTrack((prev) => (prev ? { ...prev, coverUrl: newCoverUrl } : null));
    }
  };

  const handleAddAlbum = (newAlbum: Album) => {
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleAddTrack = (newTrack: Track) => {
    setTracks((prev) => [newTrack, ...prev]);
  };

  const handleUpdateAlbumDetails = (updatedAlbum: Album) => {
    setAlbums((prev) =>
      prev.map((alb) => (alb.id === updatedAlbum.id ? updatedAlbum : alb))
    );
  };

  // 1. WELCOME SCREEN
  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen
        featuredTracks={tracks}
        onQuickPlay={(track) => {
          handlePlayTrack(track);
          setCurrentScreen('home');
        }}
        onGetStarted={() => {
          setAuthInitialMode('signup');
          setCurrentScreen('auth');
        }}
        onLogin={() => {
          setAuthInitialMode('signin');
          setCurrentScreen('auth');
        }}
        onNavigateAuth={(mode) => {
          setAuthInitialMode(mode);
          setCurrentScreen('auth');
        }}
      />
    );
  }

  // 2. AUTH SCREEN (Sign In / Sign Up)
  if (currentScreen === 'auth') {
    return (
      <AuthScreen
        initialMode={authInitialMode}
        usersList={usersList}
        onSuccess={handleAuthSuccess}
        onRegisterUser={handleRegisterUser}
        onBackToWelcome={() => setCurrentScreen('welcome')}
      />
    );
  }

  // 3. MAIN APPLICATION INTERFACE
  return (
    <div className="bg-[#0a1000] text-[#cafd1e] min-h-screen flex flex-col antialiased selection:bg-[#00fde7] selection:text-[#00443d]">
      {/* Desktop Persistent Sidebar Navigation */}
      <NavigationDrawer
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        isOpenMobile={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main App Canvas Container */}
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        {/* Top App Bar */}
        <TopAppBar
          onOpenMenu={() => setIsMobileDrawerOpen(true)}
          onNavigate={(screen) => {
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          user={user}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentScreen !== 'search') {
              setCurrentScreen('search');
            }
          }}
          isPlaying={isPlaying}
          onSecretAdminTrigger={() => {
            setCurrentScreen('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Dynamic Screen View Content */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8">
          {currentScreen === 'home' && (
            <HomeScreen
              user={user}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onOpenPlaylist={(id) => {
                const found = playlists.find((p) => p.id === id);
                if (found) setActivePlaylistModal(found);
              }}
              onNavigateSearch={() => setCurrentScreen('search')}
              tracks={tracks}
            />
          )}

          {currentScreen === 'search' && (
            <SearchScreen
              tracks={tracks}
              onPlayTrack={handlePlayTrack}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          )}

          {currentScreen === 'library' && (
            <LibraryScreen
              tracks={tracks}
              playlists={playlists}
              onPlayTrack={handlePlayTrack}
              onOpenPlaylist={(pl) => setActivePlaylistModal(pl)}
              onCreatePlaylistOpen={() => setIsCreatePlaylistOpen(true)}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onRemoveDownload={handleRemoveDownload}
              onTogglePlay={handleTogglePlay}
            />
          )}

          {currentScreen === 'premium' && (
            <PremiumScreen
              user={user}
              onUpgradePlan={(planName) => {
                const updated = {
                  ...user,
                  isPro: true,
                  planName: `${planName} Active`,
                  maxStorageMB: 64000
                };
                setUser(updated);
                setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
              }}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateUser={(updated) => {
                const updatedUser = { ...user, ...updated };
                setUser(updatedUser);
                setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
              }}
              onLogout={handleLogout}
              onNavigatePremium={() => setCurrentScreen('premium')}
              tracks={tracks}
              onClearOfflineData={handleClearOfflineData}
              onNavigateAdmin={() => {
                setCurrentScreen('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentScreen === 'settings' && (
            <ProfileScreen
              user={user}
              onUpdateUser={(updated) => {
                const updatedUser = { ...user, ...updated };
                setUser(updatedUser);
                setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
              }}
              onLogout={handleLogout}
              onNavigatePremium={() => setCurrentScreen('premium')}
              tracks={tracks}
              onClearOfflineData={handleClearOfflineData}
              onNavigateAdmin={() => {
                setCurrentScreen('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentScreen === 'help' && (
            <HelpFAQScreen user={user} />
          )}

          {currentScreen === 'admin' && (
            <AdminPortalScreen
              currentUser={user}
              usersList={usersList}
              onUpdateUsersList={setUsersList}
              onImpersonateUser={handleImpersonateUser}
              onExitAdmin={() => setCurrentScreen('home')}
              albums={albums}
              onUpdateAlbums={setAlbums}
              tracks={tracks}
              onUpdateTracks={setTracks}
              onUpdateAlbumPoster={handleUpdateAlbumPoster}
              onUpdateTrackPoster={handleUpdateTrackPoster}
              onAddAlbum={handleAddAlbum}
              onUpdateAlbumDetails={handleUpdateAlbumDetails}
              onAddTrack={handleAddTrack}
            />
          )}

          {currentScreen === 'history' && (
            <LibraryScreen
              tracks={tracks}
              playlists={playlists}
              albums={albums}
              onPlayTrack={handlePlayTrack}
              onOpenPlaylist={(pl) => setActivePlaylistModal(pl)}
              onCreatePlaylistOpen={() => setIsCreatePlaylistOpen(true)}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onRemoveDownload={handleRemoveDownload}
              onTogglePlay={handleTogglePlay}
            />
          )}
        </main>
      </div>

      {/* Global Persistent Playback Bar */}
      <GlobalPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onOpenFullScreen={() => setIsFullScreenPlayerOpen(true)}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={setVolume}
        isLiked={currentTrack ? likedTrackIds.includes(currentTrack.id) : false}
        onToggleLike={handleToggleLike}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Full-Screen Player Modal Overlay */}
      {isFullScreenPlayerOpen && currentTrack && (
        <FullScreenPlayerScreen
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onPrev={handlePrevTrack}
          onNext={handleNextTrack}
          onClose={() => setIsFullScreenPlayerOpen(false)}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          isLiked={likedTrackIds.includes(currentTrack.id)}
          onToggleLike={handleToggleLike}
          onDownloadTrack={handleDownloadTrack}
          isDownloaded={!!currentTrack.isDownloaded}
          onOpenPlaylistModal={() => setIsCreatePlaylistOpen(true)}
          onPresetChange={handlePresetChange}
        />
      )}

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
        tracks={tracks}
      />

      {/* Playlist Detail Inspection Modal */}
      <PlaylistDetailModal
        playlist={activePlaylistModal}
        isOpen={!!activePlaylistModal}
        onClose={() => setActivePlaylistModal(null)}
        onPlayTrack={handlePlayTrack}
        onPlayAll={handlePlayAllPlaylist}
        onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
      />
    </div>
  );
}
