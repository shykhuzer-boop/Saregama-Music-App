# Business Rules

## BR-001 — Suspended Account Blocking
Suspended users cannot log in. Auth endpoint must check `status !== 'suspended'`.

## BR-002 — Email Uniqueness
Email addresses must be unique across all users (case-insensitive).

## BR-003 — Password Minimum Length
Passwords must be at least 6 characters.

## BR-004 — Student Plan Perks
Student-verified users receive: `isPro: true`, `planName: 'Student 4-Year Pass'`, `maxStorageMB: 32000`, `audioQuality: 'Hi-Res Lossless (FLAC)'`.

## BR-005 — Free Tier Defaults
Non-student registrations default to: `isPro: false`, `planName: 'Free Tier'`, `maxStorageMB: 8000`, `audioQuality: 'High (320kbps)'`.

## BR-006 — Admin Portal Access
Only users with `role: 'admin'` OR email `admin@saregama.com` can access admin features. Non-admin users can enter via a passkey (`saregama-admin-2026`).

## BR-007 — Download Storage Tracking
Each download adds ~45MB to `offlineStorageUsedMB`. Remove download subtracts ~45MB (minimum 0). Clear all resets to 0.

## BR-008 — Playlist Ownership
Users can only modify/delete playlists where `isCustom: true` AND they are the creator. System playlists are read-only for regular users.

## BR-009 — Pro Content Gating
Tracks and playlists marked `isPro: true` require the user to have `isPro: true` for download access. Streaming may be unrestricted.

## BR-010 — Admin Audit Logging
All admin actions (user edit, delete, plan change, status change) must generate an `AdminLog` entry with timestamp, admin name, target user, and action details.

## BR-011 — Plan Upgrade Effect
Upgrading to Pro sets: `isPro: true`, `maxStorageMB: 64000`.

## BR-012 — Fallback Login
If a sign-in email is not found but is a valid email format, a new user account is auto-created with Free Tier defaults. (This matches existing frontend behavior.)
