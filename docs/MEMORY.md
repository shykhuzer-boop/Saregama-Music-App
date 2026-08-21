# PROJECT MEMORY

## Current State
- Backend: **COMPLETE** — all modules implemented, syntax-verified, zero load errors
- Database: 7 models, seed script ready
- Frontend: API client (`apiService.ts`) exists; screens not yet wired to API
- Phase: Backend complete — next is frontend wiring

## Completed Modules
- Config: env, database, logger
- Models: User, Track, Album, Playlist, SupportTicket, AdminLog, FAQ
- Middleware: auth (JWT), role (adminOnly), errorHandler, validateRequest, proGateMiddleware (BR-009)
- Validators: auth, user, track, playlist, support
- Services: auth, user, track, album, playlist, library, support, admin (with stats)
- Controllers: auth, user, track, album, playlist, library, support, admin
- Routes: auth, user, track, album, playlist, library, support, faq (split), admin
- Seed: 6 users, 16 tracks, 4 albums, 4 playlists, 7 FAQs, 4 logs
- Frontend API client: apiService.ts with typed wrappers for all endpoints

## Important Decisions
- DEC-001: MongoDB + Mongoose
- DEC-002: JWT stateless auth (7d expiry)
- DEC-003: Separate backend package (backend/)
- DEC-004: Plan upgrade = status toggle (no payment)
- DEC-005: No audio file storage (Web Audio API synthesis only)
- DEC-006: Simulated email (forgot-password always returns success)
- DEC-007: Gemini AI proxied through backend (POST /admin/artwork/generate)
- DEC-008: Soft delete = status:suspended
- DEC-009: FAQ and support routes split into faqRoutes.js + supportRoutes.js

## Important Constraints
- No real payment processing
- No real email service
- No audio file storage
- MongoDB must be running locally (mongodb://localhost:27017/saregama) or Atlas URI in .env
- PowerShell: use background process tool for node commands

## Known Issues
- None (all syntax errors and duplicate index warnings resolved)

## API Endpoints (complete)
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
GET    /api/v1/auth/me

GET    /api/v1/users              (admin)
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
PUT    /api/v1/users/:id/plan     (admin)
PUT    /api/v1/users/:id/status   (admin)
DELETE /api/v1/users/:id          (admin)

GET    /api/v1/tracks             ?search=&genre=&language=&page=
GET    /api/v1/tracks/:id
POST   /api/v1/tracks             (admin)
PUT    /api/v1/tracks/:id         (admin)
DELETE /api/v1/tracks/:id         (admin)

GET    /api/v1/albums             ?search=&page=
GET    /api/v1/albums/:id
POST   /api/v1/albums             (admin)
PUT    /api/v1/albums/:id         (admin)
PUT    /api/v1/albums/:id/poster  (admin)
DELETE /api/v1/albums/:id         (admin)

GET    /api/v1/playlists
GET    /api/v1/playlists/:id
POST   /api/v1/playlists
PUT    /api/v1/playlists/:id
PUT    /api/v1/playlists/:id/tracks
DELETE /api/v1/playlists/:id

GET    /api/v1/library/liked
POST   /api/v1/library/liked/:trackId
DELETE /api/v1/library/liked/:trackId
GET    /api/v1/library/downloads
POST   /api/v1/library/downloads/:trackId  (BR-009 pro gate enforced in service)
DELETE /api/v1/library/downloads/:trackId
DELETE /api/v1/library/downloads

GET    /api/v1/faqs               ?search=&category= (public)
POST   /api/v1/support/tickets
GET    /api/v1/support/tickets

GET    /api/v1/admin/stats        (admin)
GET    /api/v1/admin/logs         (admin)
POST   /api/v1/admin/impersonate/:userId (admin)
POST   /api/v1/admin/artwork/generate   (admin)

GET    /api/v1/health
```

## Project Structure
```
Saregama-Music-App/
├── frontend/          # React 19 + TypeScript + Vite + TailwindCSS 4
│   ├── src/           # App source (components, screens, services, data)
│   ├── vite.config.ts # Dev proxy: /api → localhost:5000
│   └── package.json
├── backend/           # Node.js + Express + MongoDB
│   ├── src/           # config, models, routes, controllers, services, middleware
│   └── package.json
└── docs/              # API_CONTRACT, BUSINESS_RULES, DECISIONS, etc.
```

## Demo Accounts (after seed)
- Admin:   admin@saregama.com / admin123
- User:    deepak.kumar@saregama.com / password123
- Student: aanya.sharma@stanford.edu / student123

## Next Actions
1. Run `npm install --prefix frontend` to install frontend deps
2. Wire AuthScreen.tsx to authAPI.login / authAPI.register
2. Wire App.tsx data fetching to trackAPI.list, albumAPI.list, playlistAPI.list
3. Wire LibraryScreen to libraryAPI
4. Wire AdminScreen to adminAPI (stats, users, logs)
5. Wire HelpScreen to supportAPI (FAQs, tickets)
6. Start MongoDB + run seed: `cd backend && node src/seeds/seed.js`
7. Start backend: `cd backend && npm run dev`

## Important Files
- `frontend/src/services/apiService.ts` — Frontend API client (all endpoints)
- `frontend/src/App.tsx` — Main app orchestrator (needs API wiring)
- `frontend/vite.config.ts` — Dev proxy /api → localhost:5000
- `backend/src/app.js` — Express app, all routes registered
- `backend/src/server.js` — HTTP server bootstrap
- `backend/src/config/env.js` — All env vars with defaults
- `backend/src/seeds/seed.js` — Database seeder
- `backend/.env` — Local dev config (not committed)
- `backend/.env.example` — Template for new environments
- `docs/API_CONTRACT.md` — Full API reference
- `docs/BUSINESS_RULES.md` — 12 business rules
- `docs/DECISIONS.md` — Architecture decisions log
