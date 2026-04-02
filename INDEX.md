# 🎯 ACF Skysino - Index Principal

Bienvenue dans le projet! Voici comment naviguer dans la documentation.

## 📖 Documentation à Lire (dans cet ordre)

### 1️⃣ **LISEZ D'ABORD: [config.js](server/config.js)**
Toutes les constantes du projet en un seul endroit:
- Liste des 12 skins
- Endpoints API
- Jeux disponibles
- Variables CSS

**Durée:** 2-3 minutes

### 2️⃣ **LISEZ: [README_ORGANISATION.md](server/README_ORGANISATION.md)**
Résumé de la nouvelle structure et avantages.

**Durée:** 3-5 minutes

### 3️⃣ **LISEZ: [ARCHITECTURE.md](server/ARCHITECTURE.md)**
Documentation technique complète:
- Structure des fichiers
- Endpoints API
- Flux de données
- Dépendances

**Durée:** 5-10 minutes

### 4️⃣ **LISEZ: [GUIDE_POUR_IA.md](server/GUIDE_POUR_IA.md)**
Instructions détaillées pour travailler sur le projet:
- Où trouver les fichiers
- Comment modifier
- Checklist pré-commit
- Exemples concrets

**Durée:** 10-15 minutes

## 📂 Fichiers Importants

```
server/
├── config.js                  ⭐ Lire d'ABORD
├── ARCHITECTURE.md            📚 Documentation technique
├── GUIDE_POUR_IA.md           🤖 Guide pour IA
├── README_ORGANISATION.md     📋 Résumé de la réorganisation
├── server-simple.js           🖥️ Serveur Express
├── package.json               📦 Dépendances
└── public/
    ├── index.html             🏠 Accueil
    ├── styles.css             🎨 CSS centralisé
    ├── pages/                 📄 Fichiers HTML des pages
    ├── scripts/               🔧 Scripts JS modulaires
    │   ├── utils.js           Fonctions partagées
    │   ├── main.js            Logique commune
    │   ├── shop.js            Boutique
    │   ├── games.js           Jeux
    │   └── auth.js            Authentification
    └── skins/                 🎭 12 skins CSS
```

## 🚀 Démarrage Rapide (30 secondes)

```powershell
# 1. Arrêter ancien serveur
Get-Process node | Stop-Process -Force

# 2. Lancer serveur
cd 'e:\MATTIS\LP2I\acf_skysino\server'
node server-simple.js

# 3. Ouvrir navigateur
start http://localhost:3000
```

## 🎓 Workflow pour Développer

### Ajouter une Nouvelle Fonctionnalité

1. ✅ Ouvrir `config.js`
2. ✅ Ajouter la constante/endpoint
3. ✅ Implémenter dans le script approprié
4. ✅ Vérifier `GUIDE_POUR_IA.md` pour la checklist
5. ✅ Mettre à jour `ARCHITECTURE.md` si nécessaire
6. ✅ Tester dans le navigateur

### Modifier une Page

1. ✅ Ouvrir le HTML dans `/public/pages/` ou `/public/`
2. ✅ Modifier l'HTML (garder épuré)
3. ✅ Trouver le script correspondant dans `/public/scripts/`
4. ✅ Modifier la logique
5. ✅ Tester

## 📊 Résumé du Projet

| Aspect | Info |
|--------|------|
| **Type** | Plateforme de jeux avec boutique de skins |
| **Jeux** | Blackjack, Poker, Roulette, Slots |
| **Skins** | 12 thèmes CSS différents |
| **Auth** | Login/Register avec localStorage |
| **Tech Stack** | Node.js, Vanilla JS, CSS3 |
| **Optimisé pour** | Travail IA autonome |

## ❓ Questions Fréquentes

**Q: Par où commencer si je suis une IA?**
A: Lire dans cet ordre: `config.js` → `README_ORGANISATION.md` → `ARCHITECTURE.md` → `GUIDE_POUR_IA.md`

**Q: Je dois modifier quelque chose, comment je fais?**
A: Ouvrir `GUIDE_POUR_IA.md` section "Où chercher et modifier?"

**Q: Où ajouter une nouvelle constante?**
A: Dans `server/config.js`

**Q: Comment faire une requête API?**
A: Utiliser `fetchAPI(CONFIG.api.*.*)` depuis `utils.js`

**Q: Comment charger un skin?**
A: Utiliser `loadActiveSkin()` ou `changeSkin(id)` depuis `utils.js`

**Q: HTML peut avoir du JavaScript/CSS inline?**
A: Non! Voir `GUIDE_POUR_IA.md` pour les bonnes pratiques

## 📞 Besoin d'Aide?

1. **Erreur serveur?** → Consulter `ARCHITECTURE.md` section "Debugging"
2. **Besoin d'une fonction?** → Voir `utils.js` ou `GUIDE_POUR_IA.md`
3. **Dont savoir où modifier?** → Voir `GUIDE_POUR_IA.md` section "Où chercher"
4. **Structure/Architecture?** → Voir `ARCHITECTURE.md`

## ✅ Checklist Complètes

### Avant de modifier un fichier
- [ ] Tu as lu `config.js`
- [ ] Tu as lu `GUIDE_POUR_IA.md`
- [ ] Tu sais quelle section tu dois modifier
- [ ] Tu vérifies la checklist dans `GUIDE_POUR_IA.md`

### Avant de faire une requête API
- [ ] Vérifier endpoint dans `config.js`
- [ ] Utiliser `fetchAPI()` de `utils.js`
- [ ] Ajouter gestion d'erreur avec `showNotification()`

### Avant de tester
- [ ] Code syntaxiquement correct
- [ ] Serveur redémarré
- [ ] Navigateur cache vidé (ou Ctrl+Shift+Suppr)
- [ ] Console F12 ouverte pour voir erreurs

## 🎉 Maintenant

**Tu es prêt(e) à travailler sur le projet!** 🚀

Commence par lire: **[config.js](server/config.js)**

---

**Version:** 1.0  
**Dernière mise à jour:** 2 Avril 2026  
**Optimisé pour:** Travail IA autonome 🤖
