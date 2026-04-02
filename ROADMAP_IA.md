# 🛣️ Roadmap: Prochaines Étapes pour IA

## ✅ Déjà Fait

### Structure Organisée
- ✅ Dossiers créés: `/scripts/`, `/pages/`, `/api/` (vide)
- ✅ Configuration centralisée: `config.js`
- ✅ Scripts modulaires: `utils.js`, `main.js`, `shop.js`, `games.js`, `auth.js`
- ✅ Documentation: `ARCHITECTURE.md`, `GUIDE_POUR_IA.md`, `CHECKLIST.md`, `QUICKSTART.md`

### Files Créés
- ✅ `server/config.js` (150 lignes)
- ✅ `server/public/scripts/utils.js` (200 lignes)
- ✅ `server/public/scripts/main.js` (50 lignes)
- ✅ `server/public/scripts/shop.js` (150 lignes)
- ✅ `server/public/scripts/games.js` (100 lignes)
- ✅ `server/public/scripts/auth.js` (200 lignes)

---

## ⏳ À Faire (Étapes de Refactorisation)

### Phase 1: Mettre à Jour HTML (1-2 heures)

**Besoin de modifier:**
- [ ] `index.html` - Ajouter `<link rel="stylesheet" href="/styles.css">` et scripts
- [ ] `shop.html` - Déplacer vers `/pages/`, ajouter liens CSS/scripts
- [ ] `blackjack.html` - Déplacer vers `/pages/`, ajouter liens CSS/scripts
- [ ] `poker.html` - Déplacer vers `/pages/`, ajouter liens CSS/scripts
- [ ] `roulette.html` - Déplacer vers `/pages/`, ajouter liens CSS/scripts
- [ ] `slots.html` - Déplacer vers `/pages/`, ajouter liens CSS/scripts
- [ ] `app.html` - Ajouter liens CSS/scripts si nécessaire

**Pour chaque fichier:**
```javascript
// Ajouter dans <head>:
<link rel="stylesheet" href="/styles.css">
<link id="skin-css" rel="stylesheet" href="">

// Ajouter avant </body>:
<script src="/scripts/utils.js"></script>
<script src="/scripts/main.js"></script>
<script src="/scripts/shop.js"></script>  <!-- si c'est shop.html -->
<script src="/scripts/games.js"></script>  <!-- si c'est jeu -->
<script src="/scripts/auth.js"></script>  <!-- si authentification -->
```

### Phase 2: Extraire Script Inline (2-3 heures)

**Besoin de:**
1. Lire chaque HTML
2. Identifier les `<script>` inline
3. Extraire le code JavaScript
4. Créer/modifier le fichier `/scripts/` correspondant
5. Vérifier que la logique marche

**Exemple:**
```html
<!-- Ancien (index.html):-->
<script>
  function loadSkinCSS() { ... }
  function showAwareness() { ... }
</script>

<!-- Nouveau (scripts/main.js ou skin.js):-->
// Code extrait là
```

### Phase 3: Extraire Style Inline (1-2 heures)

**Besoin de:**
1. Lire chaque `<style>` bloc
2. Copier le CSS
3. Ajouter à `/styles.css` s'il est global
4. Ajouter à skins si c'est du style thématique
5. Supprimer le `<style>` du HTML

**Example:**
```css
/* Ancien (index.html): */
<style>
  .hero { background: blue; }
</style>

/* Nouveau (styles.css): */
.hero { background: var(--accent); }
```

### Phase 4: Mettre à Jour Routes API (1 heure)

**Besoin de:**
1. Vérifier que endpoints dans `config.js` correspondent à `server-simple.js`
2. Si manquants, créer les routes dans `server-simple.js`
3. Créer fichiers dans `/api/` pour modulariser (optionnel)

**Endpoints à vérifier:**
- [ ] POST `/api/auth/register` - Créer compte
- [ ] POST `/api/auth/login` - Connexion
- [ ] POST `/api/auth/logout` - Déconnexion
- [ ] GET `/api/shop/skins` - Lister skins
- [ ] POST `/api/shop/buy` - Acheter skin
- [ ] GET `/api/shop/inventory` - Inventaire user
- [ ] GET `/api/awareness/items` - Notifications

### Phase 5: Tester Complètement (2 heures)

**À tester:**
- [ ] Serveur démarre sans erreur
- [ ] Chaque page HTML charge
- [ ] CSS s'applique
- [ ] Skins se chargent et s'appliquent
- [ ] Authentification fonctionne
- [ ] Boutique fonctionne
- [ ] Jeux fonctionnent
- [ ] LocalStorage fonctionne
- [ ] Pas d'erreurs console (F12)

---

## 📋 Checklist de Refactorisation

### Avant de Commencer
- [ ] Faire un backup (git ou copie)
- [ ] Serveur peut être redémarré facilement
- [ ] Navigateur a console ouverte (F12)

### Phase 1: HTML
- [ ] Lire chaque HTML
- [ ] Identifier ce qui manque (CSS links, scripts)
- [ ] Ajouter avec `<link>` et `<script>`
- [ ] Tester chaque page

### Phase 2: Scripts Inline
- [ ] Lire chaque `<script>` bloc
- [ ] Copier le code
- [ ] Ajouter à fichier `/scripts/` correspondant
- [ ] Supprimer du HTML
- [ ] Tester

### Phase 3: Styles Inline
- [ ] Lire chaque `<style>` bloc
- [ ] Copier le CSS
- [ ] Ajouter à `/styles.css`
- [ ] Supprimer du HTML
- [ ] Tester

### Phase 4: Routes API
- [ ] Vérifier endpoints
- [ ] Créer routes manquantes
- [ ] Tester avec `fetchAPI()`

### Phase 5: Nettoyage
- [ ] Vérifier pas de doublon
- [ ] Vérifier pas de code mort
- [ ] Mettre à jour ARCHITECTURE.md
- [ ] Test final complet

---

## 🎯 Impact Chaque Phase

**Phase 1: HTML** (Critique)
- Impact: Structure du projet
- Risque: Les pages ne chargeront pas sans CSS
- Test: Ouvrir chaque page, vérifier CSS s'applique

**Phase 2: Scripts** (Important)
- Impact: Fonctionnalités cessent de marcher
- Risque: Code extracté mal, logique cassée
- Test: Chaque action (clic boutonnage, jeu, etc.)

**Phase 3: Styles** (Important)
- Impact: Visual design
- Risque: CSS manquant, pages moches
- Test: Chaque page avec chaque skin

**Phase 4: API** (Important)
- Impact: Serveur/client communication
- Risque: Endpoints manquants, 404 errors
- Test: Chaque appel API

**Phase 5: Test** (Critique)
- Impact: Qualité finale
- Risque: Bugs résiduels
- Test: Workflow utilisateur complet

---

## ⏱️ Temps Estimé

| Phase | Durée | Complexité |
|-------|-------|-----------|
| 1 HTML | 1-2h | Facile |
| 2 Scripts | 2-3h | Moyen |
| 3 Styles | 1-2h | Facile |
| 4 Routes | 1h | Moyen |
| 5 Tests | 2h | Variable |
| **TOTAL** | **7-10h** | **Moyen** |

---

## 🚀 Priorité

**HAUTE PRIORITÉ:**
1. Phase 1: HTML (pas d'CSS = pages cassées)
2. Phase 5: Tests (vérifier tout fonctionne)

**MOYENNE PRIORITÉ:**
3. Phase 2: Scripts (si logique inline)
4. Phase 3: Styles (CSS global)

**BASSE PRIORITÉ:**
5. Phase 4: Routes (si nouvelle API)

---

## 💡 Conseils IA

### Comment Procéder

1. **Une phase à la fois** - Ne pas tout faire d'un coup
2. **Un fichier à la fois** - Modifier un HTML, tester, continuer
3. **Commit fréquent** - Sauvegarder après chaque étape
4. **Test continu** - Tester après chaque modification

### Utiliser Replace Strings

```javascript
// Pour HTML: extraire et déplacer le <script> entier
oldString: `
  <!-- autres éléments -->
  <script>
    function doSomething() { ... }
  </script>
  <!-- autres éléments -->
`

newString: `
  <!-- autres éléments -->
  <script src="/scripts/page-specifique.js"></script>
  <!-- autres éléments -->
`
```

### Vérifier Chaque Étape

```javascript
// Avant de continuer:
1. Serveur redémarré? → node server-simple.js
2. Page charge? → http://localhost:3000
3. Console vide? → F12, onglet Console
4. Feature marche? → Tester manuellement
```

---

## 📊 Étapes Par Ordre Logique

```
1. ✅ Créer structure (FAIT)
2. ✅ Créer config (FAIT)
3. ✅ Créer scripts modulaires (FAIT)
4. ⏳ Ajouter CSS/JS links à HTML
5. ⏳ Extraire script inline
6. ⏳ Extraire style inline
7. ⏳ Vérifier routes API
8. ⏳ Test complet
9. ⏳ Documenter changements
10. ✅ Livrer
```

---

## 🎓 Quand Tu Seras Fini

Le projet aura:
- ✅ Structure optimisée pour IA
- ✅ Configuration centralisée
- ✅ Code modulaire et réutilisable
- ✅ HTML épuré (pas de logique)
- ✅ Scripts organisés
- ✅ Documentation complète
- ✅ Facile à maintenir et étendre

---

**Version:** 1.0  
**Temps estimé total:** 7-10 heures  
**Difficulté:** Moyen (répétitif mais pas complexe)  
**Impact:** Énorme (projet 10x plus fluide pour IA)

Prêt? Commence par Phase 1! 🚀
