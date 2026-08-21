# Saregama Music App

Ad-free, high-fidelity music streaming platform featuring Hindi & Bollywood hits, Indian classical ragas, binaural beats, and a Web Audio synthesizer engine.

## Project Structure

```
Saregama-Music-App/
├── frontend/          # React 19 + TypeScript + Vite + TailwindCSS 4
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Full-page screen components
│   │   ├── services/      # API client (apiService.ts), audio engine
│   │   ├── data/          # Static seed/mock data
│   │   ├── App.tsx        # Root component + routing
│   │   ├── types.ts       # Shared TypeScript types
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   ├── vite.config.ts     # Dev server + /api proxy → localhost:5000
│   └── tsconfig.json
│
├── backend/           # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/        # env, database, logger
│   │   ├── models/        # Mongoose models (7)
│   │   ├── routes/        # Express routers (9)
│   │   ├── controllers/   # Request handlers (8)
│   │   ├── services/      # Business logic (8)
│   │   ├── middlewares/   # auth, role, validation, proGate, errorHandler
│   │   ├── validators/    # express-validator chains (5)
│   │   ├── utils/         # apiResponse, constants
│   │   ├── seeds/         # Database seeder
│   │   ├── app.js         # Express app
│   │   └── server.js      # HTTP server bootstrap
│   ├── .env.example
│   └── package.json
│
├── docs/              # Architecture & context docs
│   ├── API_CONTRACT.md
│   ├── BUSINESS_RULES.md
│   ├── CHANGELOG.md
│   ├── CONTEXT.md
│   ├── DATABASE.md
│   ├── DECISIONS.md
│   ├── MEMORY.md
│   ├── SECURITY.md
│   └── TODO.md
│
└── package.json       # Root monorepo scripts
```

## Prerequisites

- Node.js ≥ 18
- MongoDB running locally on port 27017 (or set `MONGODB_URI` to an Atlas URI)

## Setup

### 1. Install dependencies

```bash
# Install both frontend and backend
npm run install:all

# Or individually
npm install --prefix frontend
npm install --prefix backend
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — set MONGODB_URI, JWT_SECRET, GEMINI_API_KEY (optional)
```

### 3. Seed the database

```bash
npm run seed
```

This creates demo accounts:

| Role    | Email                          | Password    |
|---------|--------------------------------|-------------|
| Admin   | admin@saregama.com             | admin123    |
| User    | deepak.kumar@saregama.com      | password123 |
| Student | aanya.sharma@stanford.edu      | student123  |

### 4. Start development servers

In two separate terminals:

```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 3000)
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000).

The frontend proxies all `/api/*` requests to `http://localhost:5000` automatically.

## API

Backend REST API base: `http://localhost:5000/api/v1`

Health check: `GET /api/v1/health`

See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) for the full endpoint reference.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, TypeScript, Vite, TailwindCSS 4, Lucide React, Motion |
| Backend   | Node.js, Express 4, Mongoose 8          |
| Database  | MongoDB                                 |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| AI        | Google Gemini API (artwork generation)  |
