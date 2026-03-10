# Minimal Casino Server

This folder contains a minimal development server for a toy online casino.

Current features:
- SQLite persistence outside project folder (default: `%APPDATA%\\Skysino\\casino.db`)
- Local username/password accounts

Quick start:

1. cd server
2. npm install
3. copy `.env.example` to `.env` and fill values
4. npm start

Server runs on `http://localhost:3000` and serves a simple static frontend at `/`.

Data persistence and updates:
- Player progression is stored outside the project folder, so replacing project files (for example via USB update) does not reset balances.
- You can override database location with `DATABASE_PATH` in `.env`.

APIs:
- `POST /api/register` { username, password } -> { token, user }
- `POST /api/login` { username, password } -> { token, user }
- `GET /api/me` (Bearer token) -> { id, username, balance }
- `POST /api/games/roulette` (Bearer) { bet, number } -> { outcome, won, payout, balance }
- `POST /api/games/slots` (Bearer) { bet } -> { symbols, multiplier, payout, balance }
