const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('express').json;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const STARTING_BALANCE = 1000; // crédits de départ
const DB_PATH = path.join(__dirname, 'casino.db');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser());

const db = new sqlite3.Database(DB_PATH);

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

async function initDb() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT,
      balance INTEGER NOT NULL DEFAULT 1000,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function rowToUser(row) {
  if (!row) return null;
  return {
    _id: row.id,
    username: row.username,
    password: row.password,
    balance: row.balance
  };
}

async function getUserById(id) {
  const row = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  return rowToUser(row);
}

async function getUserByUsername(username) {
  const row = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
  return rowToUser(row);
}

async function createUser({ username, password = null, balance = STARTING_BALANCE }) {
  const id = uuidv4();
  await dbRun(
    'INSERT INTO users (id, username, password, balance) VALUES (?, ?, ?, ?)',
    [id, username, password, balance]
  );
  return getUserById(id);
}

async function setUserBalance(userId, balance) {
  await dbRun('UPDATE users SET balance = ? WHERE id = ?', [balance, userId]);
}

// Dev safety: avoid stale frontend files across machines/browser sessions.
app.use((req, res, next) => {
  if (/(\.html|\.css|\.js)$/i.test(req.path)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

function generateToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Champs requis' });
    const existing = await getUserByUsername(username);
    if (existing) return res.status(400).json({ error: 'Utilisateur déjà existant' });
    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({ username, password: hash, balance: STARTING_BALANCE });
    const token = generateToken(user._id);
    res.json({ token, username: user.username, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: 'database error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
    const token = generateToken(user._id);
    res.json({ token, username: user.username, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: 'database error' });
  }
});

// Profil
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ username: req.user.username, balance: req.user.balance });
});

// Sync balance from client-side games
app.post('/api/sync-balance', authMiddleware, (req, res) => {
  const { balance } = req.body || {};
  if (typeof balance !== 'number' || !Number.isFinite(balance) || balance < 0) {
    return res.status(400).json({ error: 'invalid balance' });
  }
  setUserBalance(req.user._id, balance)
    .then(() => res.json({ balance }))
    .catch(() => res.status(500).json({ error: 'database error' }));
});

// Recovery credit: grant +100 only when the player is at 0 credit.
app.post('/api/bonus/recovery', authMiddleware, (req, res) => {
  if (req.user.balance > 0) {
    return res.status(400).json({ error: 'bonus disponible uniquement a 0 credit', balance: req.user.balance });
  }
  const nextBalance = req.user.balance + 100;
  setUserBalance(req.user._id, nextBalance)
    .then(() => res.json({ granted: 100, balance: nextBalance }))
    .catch(() => res.status(500).json({ error: 'database error' }));
});

// Rouletter: bet on a number 0-36
app.post('/api/games/roulette', authMiddleware, (req, res) => {
  const { bet, number } = req.body || {};
  const betAmount = Number(bet) || 0;
  const chosen = Number(number);
  if (!Number.isFinite(betAmount) || betAmount <= 0) return res.status(400).json({ error: 'invalid bet' });
  if (!Number.isFinite(chosen) || chosen < 0 || chosen > 36) return res.status(400).json({ error: 'number must be 0-36' });
  if (req.user.balance < betAmount) return res.status(400).json({ error: 'insufficient balance' });

  const outcome = Math.floor(Math.random() * 37); // 0..36
  let payout = 0;
  if (outcome === chosen) {
    payout = betAmount * 35; // win 35:1 + original bet (we'll add original)
  }
  // update balance: subtract bet, then add payout + original bet if any
  let nextBalance = req.user.balance - betAmount;
  if (payout > 0) nextBalance += betAmount + payout;

  setUserBalance(req.user._id, nextBalance)
    .then(() => res.json({ outcome, won: payout > 0, payout, balance: nextBalance }))
    .catch(() => res.status(500).json({ error: 'database error' }));
});

// Slots: 3 symbols, payout rules: 3 equal -> 10x, 2 equal -> 2x
app.post('/api/games/slots', authMiddleware, (req, res) => {
  const { bet } = req.body || {};
  const betAmount = Number(bet) || 0;
  if (!Number.isFinite(betAmount) || betAmount <= 0) return res.status(400).json({ error: 'invalid bet' });
  if (req.user.balance < betAmount) return res.status(400).json({ error: 'insufficient balance' });

  const symbols = ['🍒','🍋','🔔','⭐','7'];
  const a = symbols[Math.floor(Math.random() * symbols.length)];
  const b = symbols[Math.floor(Math.random() * symbols.length)];
  const c = symbols[Math.floor(Math.random() * symbols.length)];

  let multiplier = 0;
  if (a === b && b === c) multiplier = 10;
  else if (a === b || b === c || a === c) multiplier = 2;

  let nextBalance = req.user.balance - betAmount;
  let payout = 0;
  if (multiplier > 0) {
    payout = betAmount * multiplier;
    nextBalance += betAmount + payout;
  }

  setUserBalance(req.user._id, nextBalance)
    .then(() => res.json({ symbols: [a,b,c], multiplier, payout, balance: nextBalance }))
    .catch(() => res.status(500).json({ error: 'database error' }));
});

// Poker: simple demo with random win
app.post('/api/games/poker', authMiddleware, (req, res) => {
  const { bet } = req.body || {};
  const betAmount = Number(bet) || 0;
  if (!Number.isFinite(betAmount) || betAmount <= 0) return res.status(400).json({ error: 'invalid bet' });
  if (req.user.balance < betAmount) return res.status(400).json({ error: 'insufficient balance' });

  const hands = ['Paire d\'As', 'Couleur', 'Suite', 'Brelan', 'Deux paires', 'Carte haute'];
  const playerHand = hands[Math.floor(Math.random() * hands.length)];
  const dealerHand = hands[Math.floor(Math.random() * hands.length)];
  const won = Math.random() > 0.5;
  
  let nextBalance = req.user.balance - betAmount;
  let payout = 0;
  if (won) {
    payout = betAmount * 2;
    nextBalance += betAmount + payout;
  }

  setUserBalance(req.user._id, nextBalance)
    .then(() => res.json({ hand: playerHand, dealer_hand: dealerHand, won, payout, balance: nextBalance }))
    .catch(() => res.status(500).json({ error: 'database error' }));
});

// Blackjack: simple demo
app.post('/api/games/blackjack', authMiddleware, (req, res) => {
  const { bet } = req.body || {};
  const betAmount = Number(bet) || 0;
  if (!Number.isFinite(betAmount) || betAmount <= 0) return res.status(400).json({ error: 'invalid bet' });
  if (req.user.balance < betAmount) return res.status(400).json({ error: 'insufficient balance' });

  const playerScore = Math.floor(Math.random() * 12) + 10; // 10-21
  const dealerScore = Math.floor(Math.random() * 12) + 10;
  const won = playerScore > dealerScore && playerScore <= 21;
  
  let nextBalance = req.user.balance - betAmount;
  let payout = 0;
  if (won) {
    payout = playerScore === 21 ? betAmount * 2.5 : betAmount;
    nextBalance += betAmount + payout;
  }

  setUserBalance(req.user._id, nextBalance)
    .then(() => res.json({ hand: playerScore, dealer_hand: dealerScore, won, payout, balance: nextBalance }))
    .catch(() => res.status(500).json({ error: 'database error' }));
});

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Minimal casino server listening on http://localhost:${PORT}`);
      console.log(`SQLite database: ${DB_PATH}`);
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
