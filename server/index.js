const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('express').json();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const STARTING_BALANCE = 100000; // crédits de départ
const LEGACY_DB_PATH = path.join(__dirname, 'casino.db');
const DEFAULT_DB_PATH = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Skysino', 'casino.db');
const DB_PATH = process.env.DATABASE_PATH || DEFAULT_DB_PATH;

function prepareDatabaseFile() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  // One-time migration: keep existing local progress when adopting new DB location.
  if (DB_PATH !== LEGACY_DB_PATH && !fs.existsSync(DB_PATH) && fs.existsSync(LEGACY_DB_PATH)) {
    fs.copyFileSync(LEGACY_DB_PATH, DB_PATH);
  }
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser);

prepareDatabaseFile();
const db = new sqlite3.Database(DB_PATH);

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
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

function initDb() {
  return dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT,
      balance INTEGER NOT NULL DEFAULT 1000,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).then(function() {
    return dbRun(`
      CREATE TABLE IF NOT EXISTS awareness_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        category TEXT
      )
    `);
  }).then(function() {
    return dbGet('SELECT COUNT(*) as count FROM awareness_items');
  }).then(function(count) {
    if (count && count.count === 0) {
      const items = [
        { name: 'iMac', price: 1500, description: 'iMac haute performance', category: 'Tech' },
        { name: 'Home Cinéma', price: 30000, description: 'Système home cinéma premium', category: 'Loisirs' },
        { name: 'Tour du monde', price: 75000, description: 'Voyage autour du monde', category: 'Voyage' },
        { name: 'Aston Martin Vantage (2018)', price: 100000, description: 'Voiture de luxe', category: 'Auto' },
        { name: 'MacBook Pro', price: 3000, description: 'MacBook Pro 16 pouces', category: 'Tech' },
        { name: 'iPhone 15 Pro Max', price: 1500, description: 'Dernier iPhone premium', category: 'Tech' },
        { name: 'PS5 Premium', price: 500, description: 'Console PlayStation 5', category: 'Gaming' },
        { name: 'Vélo électrique haut de gamme', price: 5000, description: 'Vélo électrique premium', category: 'Sport' },
        { name: 'Week-end luxe à Paris', price: 5000, description: 'Hôtel 5 étoiles + activités', category: 'Voyage' },
        { name: 'Montre Rolex', price: 15000, description: 'Montre de luxe suisse', category: 'Mode' },
        { name: 'Croisière en Méditerranée', price: 50000, description: 'Croisière 2 semaines', category: 'Voyage' }
      ];
      return items.reduce(function(promise, item) {
        return promise.then(function() {
          return dbRun(
            'INSERT INTO awareness_items (name, price, description, category) VALUES (?, ?, ?, ?)',
            [item.name, item.price, item.description, item.category]
          );
        });
      }, Promise.resolve());
    }
  });
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

function getUserById(id) {
  return dbGet('SELECT * FROM users WHERE id = ?', [id]).then(function(row) {
    return rowToUser(row);
  });
}

function getUserByUsername(username) {
  return dbGet('SELECT * FROM users WHERE username = ?', [username]).then(function(row) {
    return rowToUser(row);
  });
}

function createUser(params) {
  var username = params.username;
  var password = params.password;
  var balance = params.balance !== undefined ? params.balance : STARTING_BALANCE;
  var id = uuidv4();
  
  return dbRun(
    'INSERT INTO users (id, username, password, balance) VALUES (?, ?, ?, ?)',
    [id, username, password, balance]
  ).then(function() {
    return getUserById(id);
  });
}

function setUserBalance(userId, balance) {
  return dbRun('UPDATE users SET balance = ? WHERE id = ?', [balance, userId]);
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

function authMiddleware(req, res, next) {
  var auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  var token = auth.slice(7);
  try {
    var payload = jwt.verify(token, JWT_SECRET);
    getUserById(payload.sub).then(function(user) {
      if (!user) return res.status(401).json({ error: 'Invalid token' });
      req.user = user;
      next();
    }).catch(function(err) {
      return res.status(401).json({ error: 'Invalid token' });
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Register
app.post('/api/register', function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) return res.status(400).json({ error: 'Champs requis' });
    
    getUserByUsername(username).then(function(existing) {
      if (existing) return res.status(400).json({ error: 'Utilisateur déjà existant' });
      return bcrypt.hash(password, 10).then(function(hash) {
        return createUser({ username: username, password: hash, balance: STARTING_BALANCE }).then(function(user) {
          var token = generateToken(user._id);
          res.json({ token: token, username: user.username, balance: user.balance });
        });
      });
    }).catch(function(err) {
      res.status(500).json({ error: 'database error' });
    });
  } catch (err) {
    res.status(500).json({ error: 'database error' });
  }
});

// Login
app.post('/api/login', function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    
    getUserByUsername(username).then(function(user) {
      if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
      return bcrypt.compare(password, user.password).then(function(valid) {
        if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
        var token = generateToken(user._id);
        res.json({ token: token, username: user.username, balance: user.balance });
      });
    }).catch(function(err) {
      res.status(500).json({ error: 'database error' });
    });
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

// Get awareness items based on loss amount
app.post('/api/awareness/items', authMiddleware, function(req, res) {
  try {
    var lossAmount = (req.body || {}).lossAmount;
    var loss = Number(lossAmount) || 0;
    
    if (loss <= 0) {
      return res.status(400).json({ error: 'invalid loss amount' });
    }

    // Get items that player could afford with lost amount
    db.all(
      'SELECT * FROM awareness_items WHERE price <= ? ORDER BY price DESC LIMIT 5',
      [loss],
      function(err, rows) {
        if (err) {
          res.status(500).json({ error: 'database error' });
        } else {
          res.json({ items: rows || [], totalLoss: loss });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'database error' });
  }
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
