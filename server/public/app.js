// Auto-detect: si Live Server (5500), appeler Express sur le port 3000
const API_BASE = location.port === '3000' ? '' : 'http://localhost:3000';

const API = {
  register: API_BASE + '/api/register',
  login: API_BASE + '/api/login',
  me: API_BASE + '/api/me',
  roulette: API_BASE + '/api/games/roulette',
  slots: API_BASE + '/api/games/slots'
};

function setMsg(el, msg, err) { el.textContent = msg; el.style.color = err ? 'crimson' : 'initial'; }

function tokenHeaders() {
  const t = localStorage.getItem('token');
  return t ? { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function post(path, body) {
  const res = await fetch(path, { method: 'POST', headers: tokenHeaders(), body: JSON.stringify(body) });
  return res.json();
}

document.getElementById('btn-register').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('auth-msg');
  setMsg(msg, '...');
  const res = await post(API.register, { username, password });
  if (res.token) {
    localStorage.setItem('token', res.token);
    setMsg(msg, 'Registered.');
    // Redirect to homepage after registration
    window.location.href = '/index.html';
  } else setMsg(msg, res.error || 'error', true);
});

document.getElementById('btn-login').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('auth-msg');
  setMsg(msg, '...');
  const res = await post(API.login, { username, password });
  if (res.token) {
    localStorage.setItem('token', res.token);
    setMsg(msg, 'Logged in.');
    // Redirect to homepage after login
    window.location.href = '/index.html';
  } else setMsg(msg, res.error || 'error', true);
});

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  location.reload();
});

document.getElementById('btn-set-jetons').addEventListener('click', async () => {
  const amount = parseInt(document.getElementById('jetons-amount').value);
  const msg = document.getElementById('jetons-msg');
  if (isNaN(amount) || amount < 0) {
    setMsg(msg, 'Montant invalide', true);
    return;
  }
  try {
    const res = await fetch(API_BASE + '/api/sync-balance', {
      method: 'POST',
      headers: tokenHeaders(),
      body: JSON.stringify({ balance: amount })
    });
    if (res.ok) {
      setMsg(msg, 'Jetons mis à jour: ' + amount);
      await loadMe();
    } else {
      setMsg(msg, 'Erreur', true);
    }
  } catch (e) {
    setMsg(msg, 'Erreur réseau', true);
  }
});

document.getElementById('btn-roulette').addEventListener('click', async () => {
  const bet = document.getElementById('roulette-bet').value;
  const number = document.getElementById('roulette-number').value;
  const res = await post(API.roulette, { bet, number });
  const el = document.getElementById('roulette-result');
  if (res.error) setMsg(el, res.error, true);
  else setMsg(el, `Outcome: ${res.outcome} — ${res.won ? 'Gagné' : 'Perdu'} — Solde: ${res.balance}`);
  await loadMe();
});

document.getElementById('btn-slots').addEventListener('click', async () => {
  const bet = document.getElementById('slots-bet').value;
  const res = await post(API.slots, { bet });
  const el = document.getElementById('slots-result');
  if (res.error) setMsg(el, res.error, true);
  else {
    el.textContent = res.symbols.join(' ')+`  — x${res.multiplier} — Solde: ${res.balance}`;
  }
  await loadMe();
});

async function loadMe() {
  const meCard = document.getElementById('me');
  const gamesCard = document.getElementById('games');
  try {
    const res = await fetch(API.me, { headers: tokenHeaders() });
    if (!res.ok) throw new Error('not auth');
    const data = await res.json();
    document.getElementById('me-username').textContent = data.username;
    document.getElementById('me-balance').textContent = data.balance;
    meCard.style.display = 'block';
    gamesCard.style.display = 'block';
    document.getElementById('auth').style.display = 'none';
  } catch (err) {
    meCard.style.display = 'none';
    gamesCard.style.display = 'none';
    document.getElementById('auth').style.display = 'block';
  }
}

loadMe();
