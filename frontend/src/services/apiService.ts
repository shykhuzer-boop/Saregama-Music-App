/**
 * Saregama API Service Client
 * Centralized API client for all backend communication.
 * Handles JWT token injection, error normalization, and typed responses.
 */

const API_BASE = '/api/v1';

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('saregama_token', token);
  } else {
    localStorage.removeItem('saregama_token');
  }
};

export const getAuthToken = (): string | null => {
  if (!authToken) {
    authToken = localStorage.getItem('saregama_token');
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('saregama_token');
};

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message: string; code?: string; errors?: Array<{ field: string; message: string }> }> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      // Handle 401 — token expired
      if (response.status === 401) {
        clearAuthToken();
      }
      return {
        success: false,
        message: json.message || 'Request failed',
        code: json.code || 'UNKNOWN_ERROR',
        errors: json.errors || [],
      };
    }

    return json;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  }
}

// ========================================
// AUTH APIs
// ========================================

export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    isStudent?: boolean;
    universityName?: string;
    avatarUrl?: string;
  }) => apiFetch<{ user: any; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (email: string, password: string) =>
    apiFetch<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiFetch<{ user: any }>('/auth/me'),

  forgotPassword: (email: string) =>
    apiFetch<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ========================================
// USER APIs
// ========================================

export const userAPI = {
  list: (params?: { search?: string; filter?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.filter) qs.set('filter', params.filter);
    if (params?.page) qs.set('page', String(params.page));
    return apiFetch<{ users: any[]; pagination: any }>(`/users?${qs.toString()}`);
  },

  getById: (id: string) => apiFetch<{ user: any }>(`/users/${id}`),

  update: (id: string, data: Record<string, any>) =>
    apiFetch<{ user: any }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePlan: (id: string, data: { planName: string; isPro?: boolean; maxStorageMB?: number }) =>
    apiFetch<{ user: any }>(`/users/${id}/plan`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiFetch<{ user: any }>(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiFetch<null>(`/users/${id}`, { method: 'DELETE' }),
};

// ========================================
// TRACK APIs
// ========================================

export const trackAPI = {
  list: (params?: { search?: string; genre?: string; language?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.genre) qs.set('genre', params.genre);
    if (params?.language) qs.set('language', params.language);
    if (params?.page) qs.set('page', String(params.page));
    return apiFetch<{ tracks: any[]; pagination: any }>(`/tracks?${qs.toString()}`);
  },

  getById: (id: string) => apiFetch<{ track: any }>(`/tracks/${id}`),

  create: (data: Record<string, any>) =>
    apiFetch<{ track: any }>('/tracks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, any>) =>
    apiFetch<{ track: any }>(`/tracks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<null>(`/tracks/${id}`, { method: 'DELETE' }),
};

// ========================================
// ALBUM APIs
// ========================================

export const albumAPI = {
  list: (params?: { search?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    return apiFetch<{ albums: any[]; pagination: any }>(`/albums?${qs.toString()}`);
  },

  getById: (id: string) => apiFetch<{ album: any; tracks: any[] }>(`/albums/${id}`),

  create: (data: Record<string, any>) =>
    apiFetch<{ album: any }>('/albums', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, any>) =>
    apiFetch<{ album: any }>(`/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePoster: (id: string, coverUrl: string, syncTracks = true) =>
    apiFetch<{ album: any }>(`/albums/${id}/poster`, {
      method: 'PUT',
      body: JSON.stringify({ coverUrl, syncTracks }),
    }),

  delete: (id: string) =>
    apiFetch<null>(`/albums/${id}`, { method: 'DELETE' }),
};

// ========================================
// PLAYLIST APIs
// ========================================

export const playlistAPI = {
  list: () => apiFetch<{ playlists: any[] }>('/playlists'),

  getById: (id: string) => apiFetch<{ playlist: any }>(`/playlists/${id}`),

  create: (data: { title: string; description?: string; trackIds?: string[]; coverUrl?: string }) =>
    apiFetch<{ playlist: any }>('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, any>) =>
    apiFetch<{ playlist: any }>(`/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  addTrack: (playlistId: string, trackId: string) =>
    apiFetch<{ playlist: any }>(`/playlists/${playlistId}/tracks`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'add', trackId }),
    }),

  removeTrack: (playlistId: string, trackId: string) =>
    apiFetch<{ playlist: any }>(`/playlists/${playlistId}/tracks`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'remove', trackId }),
    }),

  delete: (id: string) =>
    apiFetch<null>(`/playlists/${id}`, { method: 'DELETE' }),
};

// ========================================
// LIBRARY APIs
// ========================================

export const libraryAPI = {
  getLikedTracks: () => apiFetch<{ tracks: any[] }>('/library/liked'),

  likeTrack: (trackId: string) =>
    apiFetch<{ liked: boolean; trackId: string }>(`/library/liked/${trackId}`, {
      method: 'POST',
    }),

  unlikeTrack: (trackId: string) =>
    apiFetch<{ liked: boolean; trackId: string }>(`/library/liked/${trackId}`, {
      method: 'DELETE',
    }),

  getDownloadedTracks: () => apiFetch<{ tracks: any[] }>('/library/downloads'),

  downloadTrack: (trackId: string) =>
    apiFetch<{ downloaded: boolean; trackId: string }>(`/library/downloads/${trackId}`, {
      method: 'POST',
    }),

  removeDownload: (trackId: string) =>
    apiFetch<{ downloaded: boolean; trackId: string }>(`/library/downloads/${trackId}`, {
      method: 'DELETE',
    }),

  clearAllDownloads: () =>
    apiFetch<{ cleared: boolean }>('/library/downloads', { method: 'DELETE' }),
};

// ========================================
// SUPPORT / FAQ APIs
// ========================================

export const supportAPI = {
  listFAQs: (params?: { search?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.category) qs.set('category', params.category);
    return apiFetch<{ faqs: any[] }>(`/faqs?${qs.toString()}`);
  },

  createTicket: (data: {
    subject: string;
    category: string;
    message: string;
    priority?: string;
  }) =>
    apiFetch<{ ticket: any }>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyTickets: () => apiFetch<{ tickets: any[] }>('/support/tickets'),
};

// ========================================
// ADMIN APIs
// ========================================

export const adminAPI = {
  getStats: () =>
    apiFetch<{
      users: { total: number; pro: number; student: number; suspended: number; free: number };
      content: { tracks: number; albums: number; playlists: number };
      support: { openTickets: number };
      recentActivity: any[];
    }>('/admin/stats'),

  getLogs: (params?: { page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    return apiFetch<{ logs: any[]; pagination: any }>(`/admin/logs?${qs.toString()}`);
  },

  impersonateUser: (userId: string) =>
    apiFetch<{ user: any; token: string }>(`/admin/impersonate/${userId}`, {
      method: 'POST',
    }),

  generateArtwork: (prompt: string) =>
    apiFetch<any>('/admin/artwork/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
};

// ========================================
// HEALTH CHECK
// ========================================

export const healthCheck = () =>
  apiFetch<{ environment: string; timestamp: string }>('/health');
