# Minimal Casino Server

This folder contains a minimal development server for a toy online casino. It is intentionally small and stores all data in memory — do NOT use in production.

Quick start:

1. cd server
2. npm install
3. npm start

Server runs on `http://localhost:3000` and serves a simple static frontend at `/`.

APIs:
- `POST /api/register` { username, password } -> { token, user }
- `POST /api/login` { username, password } -> { token, user }
- `GET /api/me` (Bearer token) -> { id, username, balance }
- `POST /api/games/roulette` (Bearer) { bet, number } -> { outcome, won, payout, balance }
- `POST /api/games/slots` (Bearer) { bet } -> { symbols, multiplier, payout, balance }
