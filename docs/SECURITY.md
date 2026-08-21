# Security

## Authentication
- JWT bearer tokens in `Authorization: Bearer <token>` header
- Tokens expire after 7 days (`JWT_EXPIRES_IN=7d`)
- Passwords hashed with bcryptjs (10 salt rounds)

## Authorization
- Role-based: `admin` and `user` roles enforced via middleware
- Object-level: Users can only modify own profiles, playlists, library
- Admin actions require `role: 'admin'`

## Input Validation
- All inputs validated via express-validator before reaching controllers
- Email format, string lengths, enum values, ObjectId format

## Rate Limiting
- Global: 100 requests per 15 minutes per IP
- Auth endpoints: 10 requests per 15 minutes per IP

## CORS
- Allowed origins: `http://localhost:3000` (dev), configurable via `CORS_ORIGIN`

## Security Headers
- Helmet.js for standard security headers (CSP, X-Frame-Options, etc.)

## Sensitive Data
Never expose in API responses:
- `passwordHash`
- `__v` (Mongoose version key)
- JWT secret
- Database credentials
- Gemini API key

## Environment Secrets
All secrets stored in `.env` (never committed):
- `JWT_SECRET`
- `MONGODB_URI`
- `GEMINI_API_KEY`

## Password Policy
- Minimum 6 characters (matching frontend validation)
- Hashed with bcrypt before storage
- Never returned in API responses
