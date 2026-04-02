# 📐 Architecture Technique du Projet - ACF Skysino

## 📂 Structure des Fichiers

```
server/
├── server-simple.js              # Serveur Express principal
├── config.js                     # 🔑 Configuration centralisée (LIRE EN PREMIER)
├── package.json                  # Dépendances npm
├── ARCHITECTURE.md              # Ce fichier
├── api/                         # Routes API modulaires
│   ├── auth.js                  # Routes authentification
│   ├── shop.js                  # Routes boutique/skins
│   └── awareness.js             # Routes notifications
├── data.js                      # Gestion des données (legacy)
├── db.js                        # Gestion base de données (legacy)
├── userModel.js                 # Modèle utilisateur (legacy)
└── public/
    ├── index.html               # 🏠 Page d'accueil (épurée)
    ├── styles.css               # 🎨 CSS centralisé (tous les styles généraux)
    ├── pages/                   # 📄 Fichiers HTML des pages
    │   ├── shop.html            # Boutique des skins
    │   ├── blackjack.html       # Jeu: Blackjack
    │   ├── poker.html           # Jeu: Poker
    │   ├── roulette.html        # Jeu: Roulette
    │   └── slots.html           # Jeu: Machines à sous
    ├── scripts/                 # 🔧 JavaScript séparé des HTML
    │   ├── main.js              # Logique principale commune
    │   ├── shop.js              # Logique boutique
    │   ├── games.js             # Logique jeux (chargement skin)
    │   ├── auth.js              # Logique authentification
    │   └── utils.js             # Fonctions utilitaires
    ├── skins/                   # 🎭 Fichiers CSS des 12 skins
    │   ├── skin-0-night-black.css
    │   ├── skin-1-gold.css
    │   ├── skin-2-cyberpunk.css
    │   ├── skin-3-ocean-blue.css
    │   ├── skin-4-fire.css
    │   ├── skin-5-forest-green.css
    │   ├── skin-6-purple-royal.css
    │   ├── skin-7-pink-neon.css
    │   ├── skin-8-glacier-mono.css
    │   ├── skin-9-sunset.css
    │   ├── skin-10-matrix.css
    │   └── skin-11-cosmos.css
    └── assets/                  # 🖼️ Images et ressources
```

## 🔑 Configuration Centralisée

**Fichier important:** `server/config.js`

Ce fichier contient TOUTES les constantes du projet:
- Liste des skins avec IDs, noms, couleurs
- Liste des jeux disponibles
- Endpoints API
- Variables CSS

**À utiliser dans le code:**
```javascript
// Dans un script serveur:
const config = require('./config.js');
console.log(config.skins); // Accède à la liste des skins

// Dans un script client (navigateur):
console.log(CONFIG.api.shop.getSkins); // Accède aux endpoints
```

## 🌐 Endpoints API

### Authentification (`/api/auth`)
```
POST   /api/auth/register    - Créer un compte
POST   /api/auth/login       - Se connecter
POST   /api/auth/logout      - Se déconnecter
```

### Boutique (`/api/shop`)
```
GET    /api/shop/skins       - Obtenir liste des skins
POST   /api/shop/buy         - Acheter un skin
GET    /api/shop/inventory   - Obtenir inventaire utilisateur
```

### Notifications (`/api/awareness`)
```
GET    /api/awareness/items  - Obtenir les notifications
POST   /api/awareness/mark-read - Marquer comme lue
```

## 🎨 Système de Skins

### Structure d'un Skin

Chaque fichier `skin-N-name.css` contient:
```css
:root {
  --bg-a: #...;           /* Couleur de fond principale */
  --bg-b: #...;           /* Couleur de fond secondaire */
  --accent: #...;         /* Couleur d'accent principale */
  --accent-2: #...;       /* Couleur d'accent secondaire */
  --muted: #...;          /* Couleur texte/élément discret */
}

/* CSS rules pour tous les éléments */
body { background: ... }
.btn { background: ... }
input { border: ... }
/* etc. */
```

### Activation d'un Skin (Client)

Le skin actif est stocké dans `localStorage`:
```javascript
// Charger un skin (index 0 = 'night-black')
localStorage.setItem('activeSkin', '0');

// Appliquer le CSS du skin
const skinId = parseInt(localStorage.getItem('activeSkin') || '0');
const cssFile = `/skins/skin-${skinId}-${CONFIG.skinNames[skinId]}.css`;
document.getElementById('skin-css').href = cssFile;
```

## 📄 Pages HTML

### Conventions
- Fichiers HTML sont **épurés** (pas de `<script>` ou `<style>` inline)
- Tous les scripts sont dans `/scripts/` avec le même nom que la page
- CSS global vient de `/styles.css`
- CSS du skin se charge dynamiquement via `<link id="skin-css">`

### Structure Minimale d'une Page
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre de la Page</title>
  <link rel="stylesheet" href="/styles.css">
  <link id="skin-css" rel="stylesheet" href="">
</head>
<body>
  <!-- Contenu HTML pur -->
  
  <script src="/scripts/main.js"></script>
  <script src="/scripts/page-specifique.js"></script>
</body>
</html>
```

## 🔧 Scripts JavaScript

### `main.js` - Chargé sur TOUTES les pages
- Initialisation globale
- Chargement du skin actif
- Authentification utilisateur
- Utilitaires communs

### `shop.js` - Logique de la boutique
- Affichage de la liste des skins
- Achat de skins
- Affichage de l'inventaire

### `games.js` - Logique des jeux
- Chargement et application du skin
- Logique commune à tous les jeux

### `auth.js` - Authentification
- Formulaires login/register
- Gestion des tokens

### `utils.js` - Fonctions utilitaires
- `fetchAPI(endpoint, options)` - Requête API avec gestion d'erreur
- `getSkinCSS(skinId)` - Obtient le chemin CSS du skin
- `debounce(fn, delay)` - Debouncing
- etc.

## 🔄 Flux de Données

```
User Action (clic bouton)
    ↓
Script client (/scripts/...)
    ↓
Appel API (via utils.fetchAPI)
    ↓
Serveur (server-simple.js)
    ↓
Route API (/api/...)
    ↓
Réponse JSON
    ↓
Script client met à jour le DOM
```

## 🎯 Workflow pour Ajouter une Nouvelle Fonctionnalité

**Exemple: Ajouter un nouvel endpoint API**

1. ✅ Ajouter à `config.js`:
```javascript
api: {
  mon_feature: {
    endpoint: '/api/mon-feature/action'
  }
}
```

2. ✅ Créer le endpoint dans `server-simple.js` ou `api/mon-feature.js`:
```javascript
app.get('/api/mon-feature/action', (req, res) => {
  // logique
});
```

3. ✅ Utiliser dans script client:
```javascript
fetch(CONFIG.api.mon_feature.endpoint).then(r => r.json())
```

## 📊 Dépendances Inter-fichiers

```
index.html
  → main.js
  → styles.css
  → skin-X.css (dynamique)

shop.html
  → main.js
  → shop.js
  → styles.css
  → skin-X.css (dynamique)

games (blackjack.html, poker.html, roulette.html, slots.html)
  → main.js
  → games.js
  → styles.css (+ CSS inline pour jeu spécifique)
  → skin-X.css (dynamique)

main.js
  → config.js (lecteur)
  → utils.js

shop.js
  → config.js (lecteur)
  → utils.js
```

## ⚡ Points Clés pour le Travail IA

### À FAIRE ✅
- Lire d'abord `config.js` pour comprendre la structure
- Utiliser `CONFIG` (global) dans les scripts client
- Utiliser `config` (module) dans les scripts serveur
- Placer constantes/endpoints dans `config.js`
- Vérifier `ARCHITECTURE.md` avant de modifier

### À NE PAS FAIRE ❌
- Mettre du JavaScript ou CSS inline dans les HTML
- Créer de nouvelles constantes ailleurs que dans `config.js`
- Ajouter des endpoints sans les documenter dans `config.js`
- Modifier la structure sans mettre à jour `ARCHITECTURE.md`

## 🐛 Debugging

- **Serveur ne démarre pas?** → Vérifier `server-simple.js` et les imports
- **Skin ne charge pas?** → Vérifier `localStorage.getItem('activeSkin')`
- **API ne répond pas?** → Vérifier `CONFIG.api` et endpoint URL
- **CSS ne s'applique pas?** → Vérifier `styles.css` et ordre des `<link>`

## 📝 Notes

- Le projet utilise une architecture simple pour être entièrement généré par IA
- Pas de build step, transpiler ou dépendances complexes
- Tout est vanilla JavaScript + CSS
- localStorage gère la persistance utilisateur côté client

---

**Version:** 2.0  
**Dernière mise à jour:** 2 Avril 2026  
**Optimisé pour:** Travail IA autonome
