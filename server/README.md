# Minimal Casino Server

This folder contains a minimal development server for a toy online casino.

Current features:
- SQLite persistence (`server/casino.db`) so balances survive restarts
- Local username/password accounts

Quick start:

1. cd server
2. npm install
3. copy `.env.example` to `.env` and fill values
4. npm start

Server runs on `http://localhost:3000` and serves a simple static frontend at `/`.

APIs:
- `POST /api/register` { username, password } -> { token, user }
- `POST /api/login` { username, password } -> { token, user }
- `GET /api/me` (Bearer token) -> { id, username, balance }
- `POST /api/games/roulette` (Bearer) { bet, number } -> { outcome, won, payout, balance }
- `POST /api/games/slots` (Bearer) { bet } -> { symbols, multiplier, payout, balance }
