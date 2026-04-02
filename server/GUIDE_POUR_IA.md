# 🤖 Guide pour IA - Comment Travailler sur ce Projet

Ce guide explique comment **tu** (IA) dois travailler sur ce projet pour maximiser la fluidité et l'efficacité.

## 📍 LIRE EN PREMIER

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Structure complète du projet
2. **[config.js](./config.js)** - Toutes les constantes en un seul endroit
3. **Ce fichier** - Instructions de travail

---

## 🎯 Workflow Optimal pour IA

### Avant de Modifier Quoi Que Ce Soit

```javascript
// 1. Lire la structure du projet
// $ Ouvrir ARCHITECTURE.md
// $ Lire config.js en entier

// 2. Identifier ce que tu dois modifier
// $ Pages HTML? → Dans /public/pages/ ou /public/index.html
// $ JavaScript? → Dans /public/scripts/
// $ Styles CSS? → Dans /public/styles.css
// $ Skins? → Dans /public/skins/skin-N-name.css
// $ Routes API? → Dans server-simple.js ou api/

// 3. Vérifier config.js pour les constantes
// $ Endpoints API? → config.api.*
// $ Noms de skins? → config.skinNames
// $ Jeux disponibles? → config.games
```

### Processus de Modification

```
1. LIRE le/les fichier(s) concerné(s)
   ↓
2. IDENTIFIER ce qui doit changer
   ↓
3. VÉRIFIER config.js pour les constantes
   ↓
4. MODIFIER avec replace_string_in_file
   ↓
5. TESTER (voir section "Testing")
```

---

## 📂 Où Chercher et Modifier?

### ❓ "Je dois modifier la page d'accueil"

**HTML:** [/public/index.html](/public/index.html)
**Logique JS:** [/public/scripts/main.js](/public/scripts/main.js)
**Style CSS:** [/public/styles.css](/public/styles.css)

```bash
# Tes actions:
1. Lire index.html (structure HTML)
2. Lire main.js (logique JS)
3. Modifier avec replace_string_in_file
```

### ❓ "Je dois ajouter une nouvelle page de jeu"

**Template HTML:** [/public/pages/blackjack.html](/public/pages/blackjack.html) (comme référence)
**Créer:** /public/pages/new-game.html
**Logique JS:** /public/scripts/games.js

```bash
# Tes actions:
1. Lire un jeu existant (structure HTML/JS)
2. create_file pour créer new-game.html
3. Ajouter le jeu à config.js
4. Mettre à jour /public/scripts/games.js
```

### ❓ "Je dois ajouter une nouvelle API"

**Fichier principal:** [/server/server-simple.js](server-simple.js)
**Configuration:** [/server/config.js](config.js)

```bash
# Tes actions:
1. Ajouter l'endpoint à config.js
2. Implémenter la route dans server-simple.js
3. Créer le script client qui utilise l'API
```

### ❓ "Je dois modifier les skins"

**Exemple:** [/public/skins/skin-0-night-black.css](/public/skins/skin-0-night-black.css)
**Liste:** config.js → config.skins

```bash
# Tes actions:
1. Lire skin-N-name.css pour comprendre la structure
2. Modifier les variables :root ou les selecteurs CSS
3. Vérifier que tous les éléments cibles sont présents
```

---

## 🔑 Concepts Clés à Retenir

### 1. **config.js est la Source Unique de Vérité**

```javascript
// Si tu ajoutes un skin, ajoute-le à config.js
config.skins.push({
  id: 12,
  name: 'new-skin',
  label: 'Nouveau Skin',
  colors: { accent: '#...', accent2: '#...' }
});

// Puis utilise CONFIG dans les scripts clients
const skinPath = `/skins/skin-${CONFIG.skins[0].id}-${CONFIG.skins[0].name}.css`;
```

### 2. **localStorage est la Base de Données Client**

```javascript
// Utilisateur connecté
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('authToken', token);

// Skin actif
localStorage.setItem('activeSkin', '5');

// Utiliser les fonctions dans utils.js
const user = getCurrentUser();
const token = getAuthToken();
const skinId = parseInt(localStorage.getItem('activeSkin') || '0');
```

### 3. **Tous les Scripts Client Utilisent utils.js**

```javascript
// Au lieu de fetch() brut, utilise fetchAPI():
const data = await fetchAPI(CONFIG.api.shop.getSkins);

// Au lieu de changer le DOM manuellement, utilise:
loadActiveSkin();
changeSkin(5);
showNotification('Succès!', 'success');
getCurrentUser();
isAuthenticated();
```

### 4. **HTML Doit Rester Épuré**

**❌ À NE PAS FAIRE:**
```html
<button onclick="doSomething()">Cliquer</button>
<style>
  .my-style { color: red; }
</style>
```

**✅ À FAIRE:**
```html
<button id="my-button">Cliquer</button>
<!-- Dans script correspondant: -->
<!-- document.getElementById('my-button').addEventListener('click', doSomething); -->
```

---

## 📝 Checklist Avant de Soumettre des Modifications

### Avant de modifier un fichier HTML:
- [ ] HTML contient seulement de la structure HTML
- [ ] Pas de `<script>` ou `<style>` inline
- [ ] Les `<link>` pointent vers les bons fichiers CSS
- [ ] `<link id="skin-css" rel="stylesheet" href="">` est présent pour le chargement dynamique du skin
- [ ] Tous les scripts sont au bout du `</body>`

### Avant de modifier un fichier JS:
- [ ] Les constantes sont dans config.js
- [ ] Les fonctions partagées utilisent utils.js
- [ ] Les requêtes API utilisent fetchAPI()
- [ ] Les `console.log()` de debug sont supprimés
- [ ] Le code est commenté pour la clarté

### Avant de modifier config.js:
- [ ] Chaque entrée a un `id` unique
- [ ] Les noms sont cohérents (snake_case ou camelCase?)
- [ ] Les URLs/paths sont absolues (`/api/...`)
- [ ] Mettre à jour ARCHITECTURE.md si structure change

### Avant de créer un nouveau fichier:
- [ ] Vérifier que c'est le bon dossier
- [ ] Respecter la nomenclature existante
- [ ] Ajouter des commentaires en haut du fichier
- [ ] Vérifier les dépendances (imports, utilisation de CONFIG, etc.)

---

## 🐛 Debugging Efficace

### Le serveur ne démarre pas?
```javascript
// 1. Vérifier console Node.js
// 2. Vérifier que server-simple.js peut être parsé
// 3. Chercher les require() qui pointent mauvais
// 4. Vérifier le port 3000 est libre
```

### Un script client ne s'exécute pas?
```javascript
// 1. Ouvrir console navigateur (F12)
// 2. Chercher les erreurs en rouge
// 3. Vérifier que le script est bien inclus dans le HTML
// 4. Vérifier que utils.js et main.js sont chargés AVANT le script
// 5. Vérifier que CONFIG est défini (require('config.js') au chargement?)
```

### Skin ne charge pas?
```javascript
// 1. Vérifier localStorage.getItem('activeSkin')
// 2. Vérifier que skin-N-name.css existe
// 3. Vérifier le chemin: /skins/skin-N-name.css
// 4. Vérifier que <link id="skin-css"> existe dans HTML
// 5. Vérifier que loadActiveSkin() est appelé
```

### API ne répond pas?
```javascript
// 1. Vérifier CONFIG.api.* a le bon endpoint
// 2. Vérifier que server-simple.js a la route
// 3. Vérifier console Node.js pour erreurs serveur
// 4. Vérifier le token si endpoint protégé
// 5. Vérifier le Content-Type en JSON
```

---

## 🎁 Fonctions Utiles dans utils.js

```javascript
// API
fetchAPI(endpoint, options)              // Requête fetch avec gestion erreur

// Skin
getSkinCSSPath(skinId)                   // Obtient le chemin CSS d'un skin
loadActiveSkin()                         // Charge le skin depuis localStorage
changeSkin(skinId)                       // Change le skin actif

// Auth
getCurrentUser()                         // Obtient l'utilisateur actuell
setCurrentUser(user)                     // Sauvegarde l'utilisateur
getAuthToken()                           // Obtient le JWT
setAuthToken(token)                      // Sauvegarde le JWT
clearAuth()                              // Efface auth (logout)
isAuthenticated()                        // Vérifie si connecté

// DOM
showNotification(message, type, duration) // Affiche popup notification
debounce(fn, delay)                      // Retarde l'exécution
throttle(fn, delay)                      // Limite la fréquence

// Format
formatMoney(amount, currency)            // Formate en monnaie (EUR, USD, etc.)
formatDate(date)                         // Formate une date
deepClone(obj)                           // Clone profond
```

---

## 🚀 Exemple Complet: Ajouter une Nouvelle Fonctionnalité

### Besoin: "Ajouter un bouton 'Réinitialiser Mot de Passe'"

**Étape 1: Modifier config.js**
```javascript
api: {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    resetPassword: '/api/auth/reset-password'  // ← NOUVEAU
  }
}
```

**Étape 2: Ajouter route dans server-simple.js**
```javascript
app.post('/api/auth/reset-password', (req, res) => {
  const { email } = req.body;
  // logique de reset
  res.json({ success: true });
});
```

**Étape 3: Créer/modifier un script client (ex: auth.js)**
```javascript
async function handleResetPassword() {
  const email = prompt('Email?');
  try {
    const result = await fetchAPI(CONFIG.api.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    showNotification('Email de reset envoyé!', 'success');
  } catch (error) {
    showNotification('Erreur: ' + error.message, 'error');
  }
}
```

**Étape 4: Ajouter bouton dans HTML**
```html
<button id="reset-password-btn">Réinitialiser mot de passe</button>

<script src="/scripts/utils.js"></script>
<script src="/scripts/auth.js"></script>
<script>
  document.getElementById('reset-password-btn').addEventListener('click', 
    handleResetPassword);
</script>
```

**Étape 5: Mettre à jour ARCHITECTURE.md**
```markdown
## Changements Récents

- Ajout endpoint `/api/auth/reset-password` (POST)
- Ajout fonction `handleResetPassword()` dans auth.js
```

---

## 📚 Ressources Rapides

| Besoin | Fichier | Fonction/Concept |
|--------|---------|-----------------|
| Ajouter constante | config.js | N/A (juste ajouter) |
| Appeler API | utils.js | `fetchAPI()` |
| Charger skin | utils.js | `loadActiveSkin()` |
| Changer skin | utils.js | `changeSkin()` |
| Afficher message | utils.js | `showNotification()` |
| Obtenir utilisateur | utils.js | `getCurrentUser()` |
| Vérifier auth | utils.js | `isAuthenticated()` |
| Créer page HTML | /public/pages/ | Copier d'une existante |
| Ajouter JS page | /public/scripts/ | Créer new-page.js |
| Modifier style global | /public/styles.css | Éditer directement |
| Modifier skin | /public/skins/skin-N.css | Éditer variables/rules |
| Ajouter API | server-simple.js | `app.post()` / `app.get()` |

---

## ⚡ Commandes Terminal Utiles

```powershell
# Démarrer le serveur
cd 'e:\MATTIS\LP2I\acf_skysino\server'
node server-simple.js

# Arrêter le serveur
Get-Process node | Stop-Process -Force

# Ouvrir en navigateur
start http://localhost:3000
```

---

## 📞 Questions Fréquentes

**Q: Où ajouter une nouvelle dépendance npm?**
A: Dans package.json, mais ce projet minimise les dépendances pour rester simple.

**Q: Comment ajouter une base de données?**
A: Actuellement localStorage côté client. Pour serveur, modifier server-simple.js avec db.js existant.

**Q: Pourquoi config.js en haut du projet?**
A: Pour que tu (IA) la lises EN PREMIER et comprennes la structure avant de toucher au code.

**Q: Puis-je modifier la structure HTML existante?**
A: Oui, du moment que tu:
1. Gardes les `<link>` CSS
2. Gardes les `<script src="">` au bout
3. Mets à jour ARCHITECTURE.md

**Q: Comment tester localement?**
A: `npm start` ou `node server-simple.js`, puis ouvrir http://localhost:3000

---

## 🎓 Tl;Dr (Résumé Ultra-Court)

1. **Lis config.js d'abord** - Toutes les constantes y sont
2. **Utilise utils.js** - Toutes les fonctions communes sont là
3. **Garde HTML épuré** - Pas de JS/CSS inline
4. **Mets à jour ARCHITECTURE.md** - Si tu changes la structure
5. **Teste avant de terminer** - Ouvre le navigateur et vérifie

---

**Version:** 1.0  
**Pour:** Travail IA autonome  
**Dernière mise à jour:** 2 Avril 2026

Bon travail! 🚀
