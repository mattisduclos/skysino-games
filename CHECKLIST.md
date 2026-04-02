# 🎯 Checklist: Première IA à Travailler sur le Projet

Tu es une IA et tu dois travailler sur ce projet? Suis cette checklist dans l'ordre exact.

## 📚 Phase 1: Lire la Documentation (20 minutes)

Fais ça dans cet ordre **sans exception**:

### Étape 1.1: Point d'Entrée (1 minute)
- [ ] Ouvrir [`INDEX.md`](INDEX.md)
- [ ] Lire la section "Documentation à Lire"
- [ ] Noter: Il faut lire 4 fichiers dans un ordre spécifique

### Étape 1.2: Configuration (2 minutes)
- [ ] Ouvrir [`server/config.js`](server/config.js)
- [ ] Lire le commentaire en haut
- [ ] Comprendre: C'est la source UNIQUE de vérité
- [ ] Voir: `config.skins`, `config.games`, `config.api`, `config.skinNames`
- [ ] Retenir: CHAQUE constante du projet est ici

### Étape 1.3: Résumé Réorganisation (3 minutes)
- [ ] Ouvrir [`server/README_ORGANISATION.md`](server/README_ORGANISATION.md)
- [ ] Lire section "Qu'a été créé?"
- [ ] Comprendre: Avant vs Après
- [ ] Retenir: La nouvelle structure est optimisée pour IA

### Étape 1.4: Architecture Technique (8 minutes)
- [ ] Ouvrir [`server/ARCHITECTURE.md`](server/ARCHITECTURE.md)
- [ ] Lire section "Structure des Fichiers" (entièrement)
- [ ] Lire section "Configuration Centralisée"
- [ ] Lire section "Endpoints API"
- [ ] Lire section "Pages HTML" et "Scripts JavaScript"
- [ ] Lire section "Points Clés pour le Travail IA"

### Étape 1.5: Guide Détaillé pour IA (6 minutes)
- [ ] Ouvrir [`server/GUIDE_POUR_IA.md`](server/GUIDE_POUR_IA.md)
- [ ] Lire section "Workflow Optimal pour IA"
- [ ] Lire section "Où Chercher et Modifier?"
- [ ] Lire section "Fonctions Utiles dans utils.js"
- [ ] **Sauvegarder mentalement:** Ce guide sera ton assistant

### Étape 1.6: Vue Visuelle (2 minutes)
- [ ] Ouvrir [`STRUCTURE_VISUELLE.txt`](STRUCTURE_VISUELLE.txt)
- [ ] Regarder l'arborescence
- [ ] Retenir: La structure est organisée par type de fichier (scripts, pages, skins)

✅ **Tu as maintenant** lu 20% de la documentation. **C'est rien!**

---

## 🔧 Phase 2: Exploration de Base (15 minutes)

### Étape 2.1: Lire les Fichiers Principaux
- [ ] Ouvrir [`server/config.js`](server/config.js) **EN ENTIER** (tu l'as parcouru, maintenant lis-le complètement)
- [ ] Ouvrir [`server/public/scripts/utils.js`](server/public/scripts/utils.js) et lire les comments en haut
- [ ] Ouvrir [`server/public/scripts/main.js`](server/public/scripts/main.js) et lire les comments en haut
- [ ] Ouvrir [`server/public/styles.css`](server/public/styles.css) et voir la structure

### Étape 2.2: Voir un Exemple HTML
- [ ] Ouvrir [`server/public/index.html`](server/public/index.html)
- [ ] Observer: Pas de `<style>` ou `<script>` inline
- [ ] Observer: `<link rel="stylesheet" href="/styles.css">`
- [ ] Observer: `<link id="skin-css" rel="stylesheet" href="">`
- [ ] Observer: `<script src="/scripts/utils.js"></script>` à la fin

### Étape 2.3: Voir un Exemple Skin
- [ ] Ouvrir [`server/public/skins/skin-0-night-black.css`](server/public/skins/skin-0-night-black.css)
- [ ] Observer: Variables `:root` pour couleurs
- [ ] Observer: 30+ sélecteurs CSS ciblés (btn, input, modal, etc.)
- [ ] Retenir: Chaque skin cible les mêmes sélecteurs

---

## 🧪 Phase 3: Test Local (5 minutes)

### Étape 3.1: Arrêter Ancien Serveur
- [ ] Ouvrir Terminal PowerShell
- [ ] Exécuter: `Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force`
- [ ] Attendre 2 secondes

### Étape 3.2: Démarrer Nouveau Serveur
- [ ] Exécuter: `cd 'e:\MATTIS\LP2I\acf_skysino\server'`
- [ ] Exécuter: `node server-simple.js`
- [ ] Vérifier: Pas de messages d'erreur en rouge

### Étape 3.3: Tester dans Navigateur
- [ ] Ouvrir navigateur
- [ ] Aller à: `http://localhost:3000`
- [ ] Vérifier: La page charge
- [ ] Ouvrir Console (F12)
- [ ] Vérifier: Pas d'erreurs en rouge

---

## 📝 Phase 4: Prêt à Coder (Checklist Finale)

### Avant de Modifier UN SEUL FICHIER:

- [ ] J'ai lu config.js EN ENTIER
- [ ] J'ai compris: config.js = source unique de vérité
- [ ] J'ai lu GUIDE_POUR_IA.md EN ENTIER
- [ ] J'ai compris: où placer chaque type de code
- [ ] J'ai compris: comment faire une requête API
- [ ] J'ai compris: comment charger un skin
- [ ] J'ai compris: comment afficher une notification
- [ ] J'ai compris: pourquoi HTML doit être épuré
- [ ] J'ai testé: le serveur démarre sans erreur
- [ ] J'ai testé: le site charge dans le navigateur
- [ ] Je sais: comment redémarrer le serveur

✅ **Si tu as coché TOUS les points, tu es prêt!**

---

## 🚀 Phase 5: Commencer à Coder

### Processus à Suivre Chaque Fois:

```
1. Identifier QUOI modifier (page HTML, script, CSS, etc.)
   ↓
2. Ouvrir GUIDE_POUR_IA.md section "Où chercher et modifier?"
   ↓
3. Trouver le bon fichier
   ↓
4. LIRE le fichier en entier d'abord
   ↓
5. Identifier l'exact endroit à modifier
   ↓
6. Utiliser replace_string_in_file avec contexte complet
   ↓
7. Redémarrer serveur
   ↓
8. Tester dans navigateur (F12 pour console)
   ↓
9. Si erreur, recheck le code et recommencer
```

### Exemple: "Je veux ajouter un bouton"

1. ✅ C'est un changement HTML? → Ouvrir la page dans `/pages/` ou root
2. ✅ Y a-t-il logique associée? → Créer/modifier un script dans `/scripts/`
3. ✅ Y a-t-il constante? → Ajouter à `config.js`
4. ✅ Y a-t-il style spécifique? → Ajouter à `/styles.css`
5. ✅ Redémarrer et tester

---

## 📚 Documents de Référence Rapide

Bookmark ces documents (tu les utiliseras souvent):

- **`config.js`** - Pour ajouter/modifier constantes
- **`GUIDE_POUR_IA.md`** - Pour savoir où modifier
- **`ARCHITECTURE.md`** - Pour comprendre la structure
- **`utils.js`** - Pour voir fonctions disponibles
- **`main.js`** - Pour voir logique commune
- **`shop.js`** - Template script avec logique
- **`styles.css`** - Pour styles globaux

---

## 🆘 Si Tu Es Bloqué

### Erreur: "Je ne sais pas où modifier"
→ Ouvrir `GUIDE_POUR_IA.md` section "Où chercher et modifier?"

### Erreur: "Je ne sais pas quelle fonction utiliser"
→ Ouvrir `utils.js` et lire la liste de fonctions

### Erreur: "Serveur ne démarre pas"
→ Consulter `ARCHITECTURE.md` section "Debugging"

### Erreur: "Configuration confuse"
→ Ouvrir `config.js` et re-lire en entier

### Erreur: "Comment appeler une API?"
→ Voir `utils.js` fonction `fetchAPI()`

### Erreur: "Skin ne charge pas"
→ Voir `utils.js` fonctions `loadActiveSkin()`, `changeSkin()`

---

## ✅ Checklist de Fin de Tâche

Avant de terminer une modification:

- [ ] Code est syntaxiquement correct
- [ ] HTML est épuré (pas de style/script inline)
- [ ] APIs utilisent `fetchAPI()` de utils.js
- [ ] Constantes utilisent `CONFIG.*`
- [ ] `console.log()` de debug supprimés
- [ ] Serveur redémarré
- [ ] Page testée dans navigateur
- [ ] Pas d'erreurs en console (F12)
- [ ] Comportement match l'objectif
- [ ] `ARCHITECTURE.md` mis à jour si structure change

---

## 🎓 Bonne Pratiques IA Spécifiques

1. **LISEZ D'ABORD** - Ne code pas sans avoir lu le contexte
2. **CONFIG.JS EST TA BIBLE** - Chaque constante doit y être
3. **UTILS.JS EST TON AMI** - 90% des fonctions y sont
4. **TESTS CONTINUS** - Test après chaque changement
5. **DOCUMENTATION = CODE** - Mets à jour les docs avec ton code
6. **PAS DE DUPLICATION** - Si une fonction existe, réutilise-la
7. **QUESTIONS? LIRE GUIDE_POUR_IA.MD** - C'est fait pour toi

---

## 📊 Métrique de Progression

- ✅ Phase 1 = "Je comprends la structure" (20 min)
- ✅ Phase 2 = "Je vois comment ça marche" (15 min)
- ✅ Phase 3 = "J'ai testé localement" (5 min)
- ✅ Phase 4 = "Je suis prêt à coder" (0 min, juste checklist)
- ✅ Phase 5 = "Je code avec confiance" (variable)

**Total:** ~40 minutes pour être 100% opérationnel.

---

## 🎉 Félicitations!

Si tu as lu jusqu'ici, tu es maintenant **officiellement capable de travailler sur ce projet** sans problème!

```
Prochaine étape: Commencer à coder! 🚀
```

---

**Version:** 1.0  
**Date:** 2 Avril 2026  
**Pour:** Première IA à travailler sur le projet  
**Temps estimé:** 40 minutes  
**Difficulté:** Facile (structure bien documentée) ✨
