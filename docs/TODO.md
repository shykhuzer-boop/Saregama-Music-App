# TODO

## Frontend (Next Phase)

### Screen Wiring
- [ ] `AuthScreen.tsx` — wire login/register forms to `authAPI`
- [ ] `App.tsx` — replace hardcoded mock data with `trackAPI.list`, `albumAPI.list`, `playlistAPI.list`
- [ ] `LibraryScreen` — wire liked/downloads to `libraryAPI`
- [ ] `ProfileScreen` — wire profile update to `userAPI.update`
- [ ] `AdminScreen` — wire stats, user list, logs to `adminAPI`
- [ ] `HelpScreen` — wire FAQs and ticket form to `supportAPI`
- [ ] `SearchScreen` — wire search to `trackAPI.list({ search })`

### State Management
- [ ] Replace all `useState` mock arrays with API-driven state
- [ ] Add loading states and error boundaries to all data-fetching screens
- [ ] Token persistence: load token on app start from localStorage

## Backend (Deferred / Enhancement)

### Not Yet Implemented
- [ ] Email service (currently simulated — DEC-006). Integrate Nodemailer/SendGrid for real password reset emails.
- [ ] Payment integration (currently plan toggle — DEC-004). Integrate Razorpay or Stripe for actual subscriptions.
- [ ] Student email verification (.edu domain check). Currently auto-verified on registration.
- [ ] Refresh token endpoint (`POST /auth/refresh`) — current tokens are 7d JWTs.
- [ ] File upload for avatars (currently URL strings only).
- [ ] Admin: ticket management endpoints (update status, respond to tickets).
- [ ] Admin: FAQ CRUD endpoints (create/update/delete FAQs).
- [ ] Pagination for playlists list endpoint.

### Testing
- [ ] Auth integration tests (register, login, JWT verification, suspended block)
- [ ] Authorization tests (admin-only routes, ownership checks)
- [ ] Library tests (like, download, storage limit, pro gate)
- [ ] Playlist ownership tests

## Infrastructure
- [ ] Docker setup (docker-compose with MongoDB + backend)
- [ ] CI/CD pipeline
- [ ] Production MongoDB Atlas configuration
- [ ] Environment-specific CORS configuration
