# Saregama Music App — Project Context

## Project
**Saregama** — Ad-free, high-fidelity music streaming platform

## Purpose
Hindi & Bollywood hits, Indian classical ragas, offline downloads, losslessly mastered audio with binaural beats and synthesizer soundscapes.

## Target Users
- Music enthusiasts (Hindi, Bollywood, Classical, Sufi)
- Students (4-year free academic pass)
- Audiophiles seeking lossless FLAC streaming
- Meditation/focus seekers (40Hz binaural beats)

## Core Modules
1. **Authentication** — Register, login, forgot password, JWT
2. **Music Catalog** — Tracks, albums, genres, search
3. **Playlists** — System + custom user playlists
4. **Library** — Likes, downloads, offline storage tracking
5. **Premium Plans** — Student, Pro, Lifetime tiers
6. **Admin Portal** — User management, artwork studio, audit logs
7. **Help/FAQ** — FAQ search, support ticket submission
8. **Audio Engine** — Web Audio API synthesizer (client-side)

## Technology Stack
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (access tokens) + bcryptjs
- **AI**: Google Gemini API (artwork generation, server-proxied)
- **UI Libraries**: Lucide React (icons), Motion (animations)

## Architecture
Frontend (React SPA) → REST API (Express) → Services → MongoDB

## Auth Strategy
JWT bearer tokens, bcrypt password hashing, role-based middleware

## Authorization
- `user` role: CRUD own profile, playlists, library
- `admin` role: Full user management, content management, audit logs

## Current Phase
Backend implementation — Phase 2 (infrastructure setup)

## Constraints
- No real audio file storage (synthesizer-based audio engine)
- Payment integration deferred (plan upgrades are status toggles)
- Email service simulated (no SendGrid/Nodemailer yet)
