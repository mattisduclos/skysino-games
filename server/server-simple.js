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
    { id: 26, name: 'Séjour à Dubaï', price: 30000, description: 'Hôtel 5 étoiles + activités', category: 'Voyage' },
    { id: 27, name: 'Home Cinéma 4K', price: 30000, description: 'Système cinéma 4K complet', category: 'Loisirs' },
    { id: 28, name: 'Montre Omega Seamaster', price: 12000, description: 'Montre de luxe suisse', category: 'Mode' },
    { id: 29, name: 'Sac Hermès Birkin', price: 15000, description: 'Sac à main de luxe', category: 'Mode' },
    { id: 30, name: 'Jet ski Seadoo', price: 25000, description: 'Jet ski haute performance', category: 'Sport' },
    { id: 31, name: 'Tesla Model S', price: 35000, description: 'Berline électrique luxe', category: 'Auto' },
    { id: 32, name: 'Vacances aux Maldives', price: 40000, description: '3 semaines de rêve', category: 'Voyage' },
    { id: 33, name: 'Porsche 911 Carrera', price: 50000, description: 'Voiture de sport allemande', category: 'Auto' },
    { id: 34, name: 'Bateau à moteur Azimut', price: 55000, description: 'Bateau de luxe', category: 'Loisirs' },
    
    // Ultra-luxury (60000-200000€)
    { id: 35, name: 'Tour du monde', price: 75000, description: 'Voyage 6 mois autour du monde', category: 'Voyage' },
    { id: 36, name: 'Aston Martin Vantage', price: 100000, description: 'Voiture de luxe britannique', category: 'Auto' },
    { id: 37, name: 'Mercedes G-Class', price: 90000, description: 'SUV de luxe allemand', category: 'Auto' },
    { id: 38, name: 'Ferrari F8 Tributo', price: 250000, description: 'Supercar italienne', category: 'Auto' },
    { id: 39, name: 'Yacht privé (location 1 mois)', price: 150000, description: 'Croisière privée', category: 'Voyage' },
    { id: 40, name: 'Montre Patek Philippe', price: 80000, description: 'Montre de collectionneurs', category: 'Mode' },
    { id: 41, name: 'Studio d\'enregistrement', price: 120000, description: 'Studio home recording pro', category: 'Musique' },
    { id: 42, name: 'Lamborghini Huracán', price: 200000, description: 'Supercar italienne', category: 'Auto' },
    
    // Mega-luxury (200000€+)
    { id: 43, name: 'Villa à Côte d\'Azur', price: 350000, description: 'Villa 5 chambres vue mer', category: 'Immobilier' },
    { id: 44, name: 'Jet privé Cessna', price: 500000, description: 'Avion privé avec équipage', category: 'Aviation' },
    { id: 45, name: 'Yacht 50 mètres', price: 600000, description: 'Yacht de luxe ultra-moderne', category: 'Loisirs' },
    { id: 46, name: 'Penthouse à Paris', price: 1000000, description: 'Penthouse 5 étages Marais', category: 'Immobilier' },
    { id: 47, name: 'Rolls-Royce Phantom', price: 450000, description: 'Voiture de prestige ultime', category: 'Auto' },
    { id: 48, name: 'Château en Provence', price: 800000, description: 'Château historique 15 pièces', category: 'Immobilier' },
    { id: 49, name: 'Île privée aux Caraïbes', price: 2500000, description: 'Île 10 hectares avec resort', category: 'Immobilier' },
    { id: 50, name: 'Hôtel 5 étoiles une semaine', price: 150000, description: 'Suite présidentielle tout compris', category: 'Voyage' },
    { id: 51, name: 'Avion de chasse collector', price: 1200000, description: 'Mirage 2000 restauré', category: 'Aviation' },
    { id: 52, name: 'Villa à Monaco', price: 950000, description: 'Propriété de prestige Côte d\'Azur', category: 'Immobilier' },
    { id: 53, name: 'Mégayacht 80 mètres', price: 5000000, description: 'Super yacht avec hélipad', category: 'Loisirs' },
    { id: 54, name: 'Château anglais', price: 2000000, description: 'Manoir Tudor 50 pièces', category: 'Immobilier' },
    { id: 55, name: 'Collection de voitures (10x)', price: 3000000, description: 'Ferrari, Lamborghini, Bugatti...', category: 'Auto' },
    { id: 56, name: 'Île privée Maldives', price: 4000000, description: 'Resort 5 étoiles complet', category: 'Immobilier' },
    { id: 57, name: 'Palais à Dubaï', price: 10000000, description: 'Palais 50 pièces vue Burj Khalifa', category: 'Immobilier' },
    
    // Ultra-Mega-Prestige (10M-1B€)
    { id: 58, name: 'Château de Versailles réplique', price: 25000000, description: 'Château complet 200 pièces', category: 'Immobilier' },
    { id: 59, name: 'Collection d\'art complet', price: 50000000, description: 'Monet, Picasso, Van Gogh originals', category: 'Art' },
    { id: 60, name: 'Îles Grecques privées (5 îles)', price: 75000000, description: 'Archipel avec hôtels et resorts', category: 'Immobilier' },
    { id: 61, name: 'Constellation de propriétés mondiale', price: 100000000, description: 'Penthouses dans 10 villes (NY, Londres, Tokyo...)', category: 'Immobilier' },
    { id: 62, name: 'Domaine viticole complet', price: 80000000, description: 'Vignobles Bordeaux + Bourgogne', category: 'Immobilier' },
    { id: 63, name: 'Flotte de supercars (50)', price: 120000000, description: 'Les 50 plus beaux hypercars du monde', category: 'Auto' },
    { id: 64, name: 'Paire de Bugatti La Voiture Noire', price: 55000000, description: 'Voiture la plus chère du monde (x2)', category: 'Auto' },
    { id: 65, name: 'Île privée New Zealand', price: 150000000, description: 'Île 500 hectares avec aéroport', category: 'Immobilier' },
    { id: 66, name: 'Musée privé international', price: 200000000, description: 'Musée complet avec chef-d\'oeuvres', category: 'Art' },
    { id: 67, name: 'Réseau d\'hôtels luxe (20)', price: 250000000, description: 'Chaîne hôtelière 5 étoiles mondiale', category: 'Immobilier' },
    { id: 68, name: 'Station spatiale privée', price: 500000000, description: 'Vaisseau spatial personnel complet', category: 'Aviation' },
    { id: 69, name: 'Île artificielle personnalisée', price: 300000000, description: 'Île créée sur mesure aux Maldives', category: 'Immobilier' },
    { id: 70, name: 'Football Club (Manchester/Liverpool)', price: 400000000, description: 'Club de Premier League entier', category: 'Sport' },
    { id: 71, name: 'Château Loire + vignobles', price: 350000000, description: 'Domaine historique complet France', category: 'Immobilier' },
    { id: 72, name: 'Île des Caïmans (achat)', price: 600000000, description: 'Archipel paradisiaque complet', category: 'Immobilier' },
    { id: 73, name: 'Parc d\'attractions Disneyland', price: 800000000, description: 'Parc complet avec propriété foncière', category: 'Loisirs' },
    { id: 74, name: 'Banque privée entière', price: 750000000, description: 'Institution bancaire avec actifs', category: 'Finance' },
    { id: 75, name: 'Studio de cinéma (Paramount)', price: 900000000, description: 'Studio cinéma complet avec lots', category: 'Loisirs' },
    { id: 76, name: 'Petite nation (Monaco achat)', price: 950000000, description: 'Achat d\'une micro-nation européenne', category: 'Immobilier' },
    { id: 77, name: 'Palais du Louvre reproduction', price: 1000000000, description: 'Réplique exacte du Louvre avec collections', category: 'Immobilier' }
  ],
  skins: [
    { id: 1, name: 'Mode Nuit Noir', icon: '🌙', description: 'Thème sombre minimaliste', price: 2500, cssFile: '/skins/skin-1-night-black.css' },
    { id: 2, name: 'Or Métallique', icon: '✨', description: 'Interface dorée luxueuse', price: 5000, cssFile: '/skins/skin-2-gold.css' },
    { id: 3, name: 'Cyberpunk Néon', icon: '🤖', description: 'Couleurs néon futuristes', price: 7500, cssFile: '/skins/skin-3-cyberpunk.css' },
    { id: 4, name: 'Bleu Océan', icon: '🌊', description: 'Thème bleu océan apaisé', price: 3500, cssFile: '/skins/skin-4-ocean-blue.css' },
    { id: 5, name: 'Feu Ardent', icon: '🔥', description: 'Couleurs chaudes et dynamiques', price: 4500, cssFile: '/skins/skin-5-fire.css' },
    { id: 6, name: 'Forêt Verte', icon: '🌲', description: 'Thème vert nature', price: 3000, cssFile: '/skins/skin-6-forest-green.css' },
    { id: 7, name: 'Pourpre Royal', icon: '👑', description: 'Interface royale en pourpre', price: 6000, cssFile: '/skins/skin-7-purple-royal.css' },
    { id: 8, name: 'Rose Neon', icon: '💫', description: 'Esthétique vaporwave', price: 5500, cssFile: '/skins/skin-8-pink-neon.css' },
    { id: 9, name: 'Monochrome Glacier', icon: '❄️', description: 'Blanc et gris glacial', price: 4000, cssFile: '/skins/skin-9-glacier-mono.css' },
    { id: 10, name: 'Sunset Paradise', icon: '🌅', description: 'Coucher de soleil tropical', price: 5500, cssFile: '/skins/skin-10-sunset.css' },
    { id: 11, name: 'Matrice Code', icon: '💻', description: 'Effet Matrix vert', price: 7000, cssFile: '/skins/skin-11-matrix.css' },
    { id: 12, name: 'Galaxie Cosmos', icon: '🌌', description: 'Univers étoilé infini', price: 8000, cssFile: '/skins/skin-12-cosmos.css' }
  ]
};
db.users.ownedSkins = db.users.ownedSkins || {};

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
      res.end(JSON.stringify({ error: 'bonus disponible uniquement à 0 crédit', balance: user.balance }));
      return;
    }

    user.balance += 5000;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ granted: 5000, balance: user.balance }));
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

  // Shop endpoints
  if (pathname === '/api/shop/skins' && method === 'GET') {
    var authHeader = req.headers['authorization'] || '';
    var token = authHeader.split(' ')[1];
    var username = validateToken(token);
    
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    
    var ownedSkins = db.users.ownedSkins[username] || [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ skins: db.skins, ownedSkins: ownedSkins }));
    return;
  }

  if (pathname === '/api/shop/buy' && method === 'POST') {
    var authHeader = req.headers['authorization'] || '';
    var token = authHeader.split(' ')[1];
    var username = validateToken(token);
    
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
      try {
        var data = JSON.parse(body);
        var skinId = data.skinId;
        var price = data.price;
        var user = db.users[username];
        
        // Check if user already owns this skin
        var ownedSkins = db.users.ownedSkins[username] || [];
        if (ownedSkins.indexOf(skinId) !== -1) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Vous possédez déjà ce skin' }));
          return;
        }
        
        // Check balance
        if (user.balance < price) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Solde insuffisant' }));
          return;
        }
        
        // Deduct balance and add skin
        user.balance -= price;
        if (!db.users.ownedSkins[username]) {
          db.users.ownedSkins[username] = [];
        }
        db.users.ownedSkins[username].push(skinId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ balance: user.balance, skinId: skinId }));
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
