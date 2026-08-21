# CHANGELOG

## [1.0.0] — 2026-08-21 — Backend Complete

### Added
- Express application bootstrap (`app.js`, `server.js`)
- MongoDB connection with graceful shutdown (`config/database.js`)
- Structured logger (`config/logger.js`)
- Environment configuration with defaults (`config/env.js`)

**Models**
- `User` — auth, plan, storage, preferences, liked/downloaded track refs
- `Track` — full music metadata, text search index, genre/language indexes
- `Album` — metadata, cover, genre, year
- `Playlist` — system + custom playlists, track refs
- `SupportTicket` — category, priority, status lifecycle
- `AdminLog` — audit trail for all admin actions
- `FAQ` — searchable FAQ entries with tags and categories

**Middleware**
- `authMiddleware` — JWT verification, user attach, suspended-account block
- `roleMiddleware` — `adminOnly` / `authorize(...roles)` RBAC
- `proGateMiddleware` — BR-009 pro content gating (sync + async variants)
- `errorHandler` — centralized error normalization (Mongoose, JWT, custom)
- `validateRequest` — express-validator result formatter

**Validators**
- `authValidator` — register, login, forgot-password
- `userValidator` — updateProfile, updatePlan, updateStatus
- `trackValidator` — createTrack, updateTrack
- `playlistValidator` — createPlaylist, updatePlaylistTracks
- `supportValidator` — createTicket (new)

**Services**
- `authService` — register (BR-004/005), login (BR-001/012), getMe, forgotPassword
- `userService` — listUsers, getUserById, updateUser, updatePlan (BR-011), updateStatus (BR-010), deleteUser (DEC-008)
- `trackService` — listTracks (search/genre/language/pagination), getTrackById, CRUD
- `albumService` — listAlbums, getAlbumById with tracks, updateAlbumPoster (sync tracks), CRUD
- `playlistService` — listPlaylists (system+user), createPlaylist (BR-008), updatePlaylist, updatePlaylistTracks, deletePlaylist
- `libraryService` — likedTracks, downloadTrack (BR-007 storage + BR-009 pro gate), removeDownload, clearAllDownloads
- `supportService` — listFAQs (search+category), createTicket, getUserTickets
- `adminService` — getStats (dashboard aggregates), getLogs, impersonateUser (BR-006), generateArtwork (DEC-007)

**Controllers** — 8 controllers mapping 1:1 to services

**Routes**
- `POST /api/v1/auth/register|login|forgot-password`, `GET /auth/me`
- `GET|PUT|DELETE /api/v1/users/:id`, plan/status sub-routes
- `GET|POST|PUT|DELETE /api/v1/tracks/:id`
- `GET|POST|PUT|DELETE /api/v1/albums/:id`, `/poster`
- `GET|POST|PUT|DELETE /api/v1/playlists/:id`, `/tracks`
- `GET|POST|DELETE /api/v1/library/liked/:trackId`, `/downloads/:trackId`
- `GET /api/v1/faqs` (public)
- `POST|GET /api/v1/support/tickets`
- `GET /api/v1/admin/stats|logs`, `POST /impersonate/:userId`, `/artwork/generate`
- `GET /api/v1/health`

**Utilities**
- `ApiResponse` — standardized success/error/created/notFound helpers
- `constants` — genres, presets, languages, raga times, ticket enums, roles

**Seed**
- 6 demo users (admin, pro, student, free, pending, suspended)
- 16 tracks across 6 genres
- 4 albums
- 4 system playlists
- 7 FAQs
- 4 admin log entries

**Frontend**
- `src/services/apiService.ts` — typed API client for all 30+ endpoints
- `vite.config.ts` — proxy `/api` → `localhost:5000`

### Fixed
- Duplicate Mongoose index warning on `User.email` (removed explicit `userSchema.index({ email: 1 })` — `unique: true` creates it)
- Route conflict: `supportRoutes` was aliased to both `/support` and `/faqs` — split into dedicated `faqRoutes.js`

### Security
- Helmet security headers
- CORS configured from env
- Global + auth-specific rate limiting
- JWT-only auth (no sessions)
- bcrypt password hashing (10 rounds)
- Input validation on all write endpoints
- Admin role enforcement on all admin routes
- Object-level ownership checks on playlists
- Pro content gating on downloads (BR-009)
- Suspended account blocking at auth + middleware layers
- No secrets in codebase — `.env.example` provided
