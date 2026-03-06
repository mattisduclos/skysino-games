const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const connectDB = require('./db');
const User = require('./userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const STARTING_BALANCE = 1000; // crédits de départ

const app = express();
app.use(cors());
app.use(bodyParser());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

connectDB().then(() => {
  console.log('MongoDB connecté');
});

function generateToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.get(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Champs requis' });
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'Utilisateur déjà existant' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash });
  const token = generateToken(user._id);
  res.json({ token, username: user.username, balance: user.balance });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Utilisateur inconnu' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
  const token = generateToken(user._id);
  res.json({ token, username: user.username, balance: user.balance });
});

// Profil
app.get('/api/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json({ username: user.username, balance: user.balance });
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
  req.user.balance -= betAmount;
  if (payout > 0) req.user.balance += betAmount + payout;

  res.json({ outcome, won: payout > 0, payout, balance: req.user.balance });
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

  req.user.balance -= betAmount;
  let payout = 0;
  if (multiplier > 0) {
    payout = betAmount * multiplier;
    req.user.balance += betAmount + payout;
  }

  res.json({ symbols: [a,b,c], multiplier, payout, balance: req.user.balance });
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
  
  req.user.balance -= betAmount;
  let payout = 0;
  if (won) {
    payout = betAmount * 2;
    req.user.balance += betAmount + payout;
  }

  res.json({ hand: playerHand, dealer_hand: dealerHand, won, payout, balance: req.user.balance });
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
  
  req.user.balance -= betAmount;
  let payout = 0;
  if (won) {
    payout = playerScore === 21 ? betAmount * 2.5 : betAmount;
    req.user.balance += betAmount + payout;
  }

  res.json({ hand: playerScore, dealer_hand: dealerScore, won, payout, balance: req.user.balance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Minimal casino server listening on http://localhost:${PORT}`);
});
