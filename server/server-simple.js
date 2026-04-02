// Serveur HTTP simple sans dépendances - compatible Node 6+
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var PORT = process.env.PORT || 3000;
var PUBLIC_DIR = path.join(__dirname, 'public');

var mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Simple in-memory database
var db = {
  users: {},
  awareItems: [
    // Budget (< 1000€)
    { id: 1, name: 'AirPods Pro', price: 300, description: 'Écouteurs sans fil haut de gamme', category: 'Tech' },
    { id: 2, name: 'Nintendo Switch OLED', price: 350, description: 'Console portable Nintendo', category: 'Gaming' },
    { id: 3, name: 'Casque Bose', price: 400, description: 'Casque audio premium', category: 'Tech' },
    { id: 4, name: 'Drone DJI Mini', price: 450, description: 'Petit drone professionnel', category: 'Tech' },
    { id: 5, name: 'GoPro Hero 11', price: 500, description: 'Caméra d\'action ultra HD', category: 'Photo' },
    { id: 6, name: 'Vélo gravel premium', price: 800, description: 'Vélo haute performance', category: 'Sport' },
    { id: 7, name: 'Parapente biplace', price: 900, description: 'Expérience parapente guidée', category: 'Sport' },
    
    // Mid-range (1000-5000€)
    { id: 8, name: 'iPhone 15 Pro Max', price: 1500, description: 'Dernier iPhone premium', category: 'Tech' },
    { id: 9, name: 'iMac 24"', price: 1500, description: 'iMac haute performance', category: 'Tech' },
    { id: 10, name: 'MacBook Air M3', price: 1800, description: 'Laptop ultra-fin et puissant', category: 'Tech' },
    { id: 11, name: 'iPad Pro 12.9"', price: 1200, description: 'Tablette professionnelle', category: 'Tech' },
    { id: 12, name: 'Watch Ultra Apple', price: 900, description: 'Montre connectée premium', category: 'Tech' },
    { id: 13, name: 'Imprimante 3D Prusa', price: 3500, description: 'Imprimante 3D professionnelle', category: 'Tech' },
    { id: 14, name: 'Jeu de cuisine pro', price: 2500, description: 'Batterie de cuisine 20 pièces', category: 'Maison' },
    { id: 15, name: 'MacBook Pro', price: 3000, description: 'MacBook Pro 16 pouces', category: 'Tech' },
    { id: 16, name: 'Vélo électrique premium', price: 5000, description: 'Vélo électrique haut de gamme', category: 'Sport' },
    { id: 17, name: 'Week-end luxe', price: 5000, description: 'Hôtel 5 étoiles + activités', category: 'Voyage' },
    
    // Premium (5000-20000€)
    { id: 18, name: 'Tesla Model 3', price: 10000, description: 'Voiture électrique', category: 'Auto' },
    { id: 19, name: 'Appareil photo Nikon Z9', price: 8000, description: 'Appareil photo professionnel', category: 'Photo' },
    { id: 20, name: 'Cuisine équipée', price: 12000, description: 'Cuisine moderne tout équipée', category: 'Maison' },
    { id: 21, name: 'Montre Rolex', price: 15000, description: 'Montre de luxe suisse', category: 'Mode' },
    { id: 22, name: 'Home Cinéma premium', price: 18000, description: 'Système home cinéma 7.1', category: 'Loisirs' },
    { id: 23, name: 'Saxophone Yanagisawa', price: 10000, description: 'Saxophone professionnel', category: 'Musique' },
    { id: 24, name: 'Piano numérique Roland', price: 12000, description: 'Piano numérique haute gamme', category: 'Musique' },
    
    // Luxury (20000-60000€)
    { id: 25, name: 'Croisière Méditerranée', price: 25000, description: 'Croisière 2 semaines luxe', category: 'Voyage' },
    { id: 26, name: 'Sejour à Dubaï', price: 30000, description: 'Hôtel 5 étoiles + activités', category: 'Voyage' },
    { id: 27, name: 'Home Cinéma', price: 30000, description: 'Système cinéma 4K complet', category: 'Loisirs' },
    { id: 28, name: 'Montre Omega Seamaster', price: 12000, description: 'Montre de luxe suisse', category: 'Mode' },
    { id: 29, name: 'Sac Hermès Birkin', price: 15000, description: 'Sac à main de luxe', category: 'Mode' },
    { id: 30, name: 'Jet ski Seadoo', price: 25000, description: 'Jet ski haute performance', category: 'Sport' },
    { id: 31, name: 'Voiture Tesla Model S', price: 35000, description: 'Berline électrique luxe', category: 'Auto' },
    { id: 32, name: 'Vacances aux Maldives', price: 40000, description: '3 semaines de rêve', category: 'Voyage' },
    
    // Ultra-luxury (60000€+)
    { id: 33, name: 'Tour du monde', price: 75000, description: 'Voyage 6 mois autour du monde', category: 'Voyage' },
    { id: 34, name: 'Aston Martin Vantage', price: 100000, description: 'Voiture de luxe britannique', category: 'Auto' },
    { id: 35, name: 'Mercedes G-Class', price: 90000, description: 'SUV de luxe allemand', category: 'Auto' },
    { id: 36, name: 'Ferrari F8 Tributo', price: 250000, description: 'Supercar italienne', category: 'Auto' },
    { id: 37, name: 'Yacht privé (location 1 mois)', price: 150000, description: 'Croisière privée', category: 'Voyage' },
    { id: 38, name: 'Montre Patek Philippe', price: 80000, description: 'Montre de collectionneurs', category: 'Mode' },
    { id: 39, name: 'Studio d\'enregistrement', price: 120000, description: 'Studio home recording pro', category: 'Musique' },
    { id: 40, name: 'Lamborghini Huracán', price: 200000, description: 'Supercar italienne', category: 'Auto' },
    { id: 41, name: 'Villa au bord de mer', price: 500000, description: 'Maison luxe avec plage', category: 'Immobilier' },
    { id: 42, name: 'Penthouse à Paris', price: 1000000, description: 'Penthouse 5 étages', category: 'Immobilier' }
  ]
};

// Simple token management
var tokens = {};

function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function validateToken(token) {
  return tokens[token] || null;
}

var server = http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  var method = req.method;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS for CORS
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api/register' && method === 'POST') {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try {
        var data = JSON.parse(body);
        var username = data.username;
        var password = data.password;

        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Champs requis' }));
          return;
        }

        if (db.users[username]) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Utilisateur déjà existant' }));
          return;
        }

        var token = generateToken();
        db.users[username] = {
          password: password,
          balance: 100000,
          token: token
        };
        tokens[token] = username;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          token: token,
          username: username,
          balance: 100000
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    });
    return;
  }

  if (pathname === '/api/login' && method === 'POST') {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try {
        var data = JSON.parse(body);
        var username = data.username;
        var password = data.password;

        if (!db.users[username]) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Utilisateur inconnu' }));
          return;
        }

        if (db.users[username].password !== password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Mot de passe incorrect' }));
          return;
        }

        var token = db.users[username].token;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          token: token,
          username: username,
          balance: db.users[username].balance
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    });
    return;
  }

  if (pathname === '/api/me' && method === 'GET') {
    var auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing token' }));
      return;
    }

    var token = auth.substring(7);
    var username = validateToken(token);
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid token' }));
      return;
    }

    var user = db.users[username];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      username: username,
      balance: user.balance
    }));
    return;
  }

  if (pathname === '/api/sync-balance' && method === 'POST') {
    var auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing token' }));
      return;
    }

    var token = auth.substring(7);
    var username = validateToken(token);
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid token' }));
      return;
    }

    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try {
        var data = JSON.parse(body);
        var balance = data.balance;

        if (typeof balance !== 'number' || balance < 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'invalid balance' }));
          return;
        }

        db.users[username].balance = balance;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ balance: balance }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    });
    return;
  }

  if (pathname === '/api/bonus/recovery' && method === 'POST') {
    var auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing token' }));
      return;
    }

    var token = auth.substring(7);
    var username = validateToken(token);
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid token' }));
      return;
    }

    var user = db.users[username];
    if (user.balance > 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'bonus disponible uniquement a 0 credit', balance: user.balance }));
      return;
    }

    user.balance += 10000;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ granted: 10000, balance: user.balance }));
    return;
  }

  if (pathname === '/api/awareness/items' && method === 'POST') {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try {
        var data = JSON.parse(body);
        var lossAmount = data.lossAmount || 0;
        var items = db.awareItems.filter(function(item) {
          return item.price <= lossAmount;
        }).sort(function(a, b) {
          return b.price - a.price;
        }).slice(0, 5);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ items: items, totalLoss: lossAmount }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    });
    return;
  }

  // Static file serving
  var filePath = path.join(PUBLIC_DIR, pathname);
  if (pathname === '/') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  fs.stat(filePath, function(err, stat) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    if (stat.isFile()) {
      var ext = path.extname(filePath).toLowerCase();
      var contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });
});

server.listen(PORT, function() {
  console.log('Serveur SKYSINO running sur http://localhost:' + PORT);
  console.log('Ouvrez http://localhost:' + PORT + ' dans votre navigateur');
});
