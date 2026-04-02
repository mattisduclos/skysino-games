# ⚡ Quick Start - 5 Minutes

Impatient? Voici le résumé en 5 points.

## 1️⃣ Lire config.js

```javascript
// server/config.js contient TOUT
CONFIG.skins           // Liste des 12 skins
CONFIG.games           // Liste des jeux
CONFIG.api.*           // Tous les endpoints API
CONFIG.skinNames       // Noms des skins
```

**Durée:** 2 minutes. Ouvre et lis d'abord!

## 2️⃣ Comprendre la Structure

```
/server/public/
├── index.html              ← Page d'accueil
├── styles.css              ← CSS global (TOUS les styles)
├── pages/                  ← Pages HTML
│   ├── shop.html
│   ├── blackjack.html
│   └── ... (4 jeux)
├── scripts/                ← JavaScript (SANS HTML inline!)
│   ├── utils.js            ← Utilise fetchAPI(), changeSkin(), etc.
│   ├── main.js             ← Authentification globale
│   ├── shop.js             ← Logique boutique
│   ├── games.js            ← Logique jeux
│   └── auth.js             ← Login/Register
└── skins/                  ← 12 thèmes CSS
```

**Durée:** 1 minute. C'est simple!

## 3️⃣ Les 5 Fonctions à Connaître

```javascript
// Dans /scripts/utils.js:

fetchAPI(endpoint)              // Appeler une API
loadActiveSkin()                // Charger skin du localStorage
changeSkin(skinId)              // Changer le skin
getCurrentUser()                // Obtenir l'utilisateur actuel
showNotification(msg, type)     // Afficher un message
```

**Durée:** 1 minute. C'est tout ce que tu besoin 90% du temps!

## 4️⃣ Démarrer le Serveur

```powershell
# PowerShell:
Get-Process node | Stop-Process -Force
cd 'e:\MATTIS\LP2I\acf_skysino\server'
node server-simple.js

# Puis ouvrir: http://localhost:3000
```

**Durée:** 30 secondes

## 5️⃣ Commencer à Coder

**Besoin d'ajouter une constante?**
→ Modifier `config.js`

**Besoin d'ajouter une fonction?**
→ Modifier `utils.js`

**Besoin de modifier une page?**
→ Modifier le HTML dans `/pages/`

**Besoin de logique page?**
→ Modifier le JS correspondant dans `/scripts/`

**Besoin de style global?**
→ Modifier `styles.css`

**Besoin d'un nouveau endpoint?**
→ Modifier `server-simple.js` + `config.js`

**Durée:** Variable

---

## 📖 Docs Complètes?

- `CHECKLIST.md` ← Guide complet pas à pas
- `GUIDE_POUR_IA.md` ← Instructions détaillées
- `ARCHITECTURE.md` ← Documentation technique

---

## 🎯 Exemple Rapide: Ajouter un Bouton

**Fichier:** `index.html`
```html
<button onclick="doSomething()">Cliquer</button>
```

**NON!** Voici la bonne façon:

**Fichier:** `index.html`
```html
<button id="my-button">Cliquer</button>
```

**Fichier:** `scripts/main.js` (ou nouveau script)
```javascript
document.getElementById('my-button').addEventListener('click', () => {
  doSomething();
});

function doSomething() {
  showNotification('Cliqué!', 'success');
}
```

C'est tout! ✅

---

## 💡 Règles d'Or

1. **Pas de `<style>` ou `<script>` inline dans HTML**
2. **Toutes les constantes dans `config.js`**
3. **Toutes les fonctions partagées dans `utils.js`**
4. **Utilise `fetchAPI()` pour les APIs**
5. **Utilise `CONFIG.*` pour les constantes**
6. **Test dans le navigateur après chaque changement**

---

## 🚨 Erreur?

**Serveur ne démarre?**
```powershell
# Vérifier il y a une syntaxe erreur dans server-simple.js
node server-simple.js
# Lire le message d'erreur
```

**Page ne charge pas?**
```javascript
// F12 → Console → Chercher erreurs en rouge
```

**Skin ne change pas?**
```javascript
// Vérifier dans Console:
localStorage.getItem('activeSkin')
// Devrait être: "0", "1", "2", etc.
```

---

**C'est tout! Tu as tout ce qu'il faut.** 🚀

Prochaine étape: Ouvrir `config.js` et commencer! 🎯
