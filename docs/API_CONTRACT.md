# API Contract

Base URL: `/api/v1`

## Auth
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | /auth/register | Public | `{name, email, password, isStudent?, universityName?, avatarUrl?}` | `{user, token}` |
| POST | /auth/login | Public | `{email, password}` | `{user, token}` |
| POST | /auth/forgot-password | Public | `{email}` | `{message}` |
| GET | /auth/me | JWT | — | `{user}` |

## Users
| Method | Endpoint | Auth | Body/Query | Response |
|--------|----------|------|------------|----------|
| GET | /users | Admin | `?search=&filter=&page=` | `{users[], pagination}` |
| GET | /users/:id | JWT | — | `{user}` |
| PUT | /users/:id | JWT+Owner | `{name?, avatarUrl?, audioQuality?, downloadOnlyOnWifi?}` | `{user}` |
| PUT | /users/:id/plan | Admin | `{planName, isPro?, maxStorageMB?}` | `{user}` |
| PUT | /users/:id/status | Admin | `{status}` | `{user}` |
| DELETE | /users/:id | Admin | — | `{message}` |

## Tracks
| Method | Endpoint | Auth | Body/Query | Response |
|--------|----------|------|------------|----------|
| GET | /tracks | JWT | `?search=&genre=&language=&page=` | `{tracks[], pagination}` |
| GET | /tracks/:id | JWT | — | `{track}` |
| POST | /tracks | Admin | `{title, artist, genre, duration, audioPreset, ...}` | `{track}` |
| PUT | /tracks/:id | Admin | `{field: value, ...}` | `{track}` |
| DELETE | /tracks/:id | Admin | — | `{message}` |

## Albums
| Method | Endpoint | Auth | Body/Query | Response |
|--------|----------|------|------------|----------|
| GET | /albums | JWT | `?search=&page=` | `{albums[], pagination}` |
| GET | /albums/:id | JWT | — | `{album, tracks[]}` |
| POST | /albums | Admin | `{title, artist, coverUrl, ...}` | `{album}` |
| PUT | /albums/:id | Admin | `{field: value, ...}` | `{album}` |
| PUT | /albums/:id/poster | Admin | `{coverUrl, syncTracks?}` | `{album}` |
| DELETE | /albums/:id | Admin | — | `{message}` |

## Playlists
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | /playlists | JWT | — | `{playlists[]}` |
| GET | /playlists/:id | JWT | — | `{playlist}` |
| POST | /playlists | JWT | `{title, description?, trackIds?, coverUrl?}` | `{playlist}` |
| PUT | /playlists/:id | JWT+Owner | `{title?, description?, coverUrl?}` | `{playlist}` |
| PUT | /playlists/:id/tracks | JWT+Owner | `{action: 'add'|'remove', trackId}` | `{playlist}` |
| DELETE | /playlists/:id | JWT+Owner | — | `{message}` |

## Library
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | /library/liked | JWT | — | `{tracks[]}` |
| POST | /library/liked/:trackId | JWT | — | `{liked, trackId}` |
| DELETE | /library/liked/:trackId | JWT | — | `{liked, trackId}` |
| GET | /library/downloads | JWT | — | `{tracks[]}` |
| POST | /library/downloads/:trackId | JWT | — | `{downloaded, trackId}` |
| DELETE | /library/downloads/:trackId | JWT | — | `{downloaded, trackId}` |
| DELETE | /library/downloads | JWT | — | `{cleared}` |

## Support & FAQ
| Method | Endpoint | Auth | Body/Query | Response |
|--------|----------|------|------------|----------|
| GET | /faqs | Public | `?search=&category=` | `{faqs[]}` |
| POST | /support/tickets | JWT | `{subject, category, message, priority?}` | `{ticket}` |
| GET | /support/tickets | JWT | — | `{tickets[]}` |

## Admin
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | /admin/stats | Admin | — | `{users, content, support, recentActivity}` |
| GET | /admin/logs | Admin | `?page=` | `{logs[], pagination}` |
| POST | /admin/impersonate/:userId | Admin | — | `{user, token}` |
| POST | /admin/artwork/generate | Admin | `{prompt}` | Gemini API response |

## Standard Response Format

### Success
```json
{"success": true, "message": "...", "data": {...}}
```

### Error
```json
{"success": false, "message": "...", "code": "ERROR_CODE", "errors": []}
```

## Error Codes
`VALIDATION_ERROR` (400), `INVALID_CREDENTIALS` (401), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `DUPLICATE_ENTRY` (409), `ACCOUNT_SUSPENDED` (403), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500)
