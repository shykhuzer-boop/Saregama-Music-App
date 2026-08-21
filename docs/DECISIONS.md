# Architecture Decision Log

## DEC-001 — MongoDB over PostgreSQL

**Decision**: Use MongoDB with Mongoose ODM  
**Why**: Track documents have variable fields (`ragaTime`, `binauralFreq`, `moodTag`, `language`) that map naturally to flexible document schemas. The existing TypeScript interfaces already resemble documents, not relational tables.  
**Alternatives**: PostgreSQL with JSONB columns  
**Impact**: Simpler schema evolution, no migrations needed for optional fields  
**Date**: 2026-08-21  

## DEC-002 — JWT over Session-based Auth

**Decision**: Use JWT bearer tokens for authentication  
**Why**: The React SPA frontend requires stateless auth. JWT avoids server-side session storage and works well with REST APIs. The existing frontend already expects token-based flow.  
**Alternatives**: Express sessions with cookies  
**Impact**: No session store needed, simpler horizontal scaling  
**Date**: 2026-08-21  

## DEC-003 — Separate Backend Package

**Decision**: Create a standalone `backend/` directory with its own `package.json`  
**Why**: The frontend is a Vite/React app. Mixing backend dependencies (mongoose, bcrypt) into the frontend package creates unnecessary coupling. Separate packages enable independent deployment.  
**Alternatives**: Monorepo with shared package.json  
**Impact**: Requires running frontend and backend separately in development  
**Date**: 2026-08-21  

## DEC-004 — Plan Upgrade as Status Toggle

**Decision**: Premium plan upgrades are implemented as simple status changes (no payment processing)  
**Why**: No payment provider credentials available. The frontend currently handles upgrades as instant in-memory state changes. (ASSUMPTION)  
**Alternatives**: Stripe/Razorpay integration  
**Impact**: No real payment validation; plan changes are trust-based for now  
**Date**: 2026-08-21  

## DEC-005 — Synthesizer Audio Only (No File Storage)

**Decision**: Audio playback remains client-side via Web Audio API synthesis  
**Why**: The existing `audioService.ts` generates all sounds programmatically. There are no actual audio files to serve. (ASSUMPTION)  
**Alternatives**: S3/Cloudinary audio file storage  
**Impact**: Backend does not serve audio streams  
**Date**: 2026-08-21  

## DEC-006 — Simulated Email Service

**Decision**: Password reset and support ticket confirmation emails are simulated (API returns success without sending)  
**Why**: No email service credentials available. Frontend currently mocks this behavior. (ASSUMPTION)  
**Alternatives**: SendGrid, Nodemailer  
**Impact**: No real email delivery; API contract is ready for future integration  
**Date**: 2026-08-21  

## DEC-007 — Gemini AI Calls Proxied Through Backend

**Decision**: Admin artwork generation calls are proxied through the backend API  
**Why**: Protects the Gemini API key from client-side exposure. The existing `.env.example` already references `GEMINI_API_KEY` as a server-side secret.  
**Alternatives**: Direct client-side Gemini API calls  
**Impact**: Adds `/api/v1/admin/artwork/generate` endpoint  
**Date**: 2026-08-21  

## DEC-008 — Soft Delete Strategy

**Decision**: Use `status: 'suspended'` for user deactivation instead of hard delete  
**Why**: The existing frontend data model already uses `status: 'suspended'` for banned users (see Zoya Khan in seed data). Admin logs reference deleted user names.  
**Alternatives**: Hard delete with cascade  
**Impact**: Suspended users remain in database, cannot login  
**Date**: 2026-08-21  
