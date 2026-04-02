/**
 * Logique des jeux
 * Gère le chargement et l'application du skin sur les pages de jeux
 */

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier authentification
  if (!isAuthenticated()) {
    showNotification('Vous devez être connecté pour jouer', 'warning');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
    return;
  }

  // Charger le skin actif
  loadActiveSkin();

  // Initialiser le jeu spécifique
  const gameId = window.GAME_ID || 'unknown';
  console.log('Initialisation jeu:', gameId);

  // Attendre l'initialisation du jeu spécifique si elle existe
  if (typeof initGame === 'function') {
    initGame();
  }
});

/**
 * Quitter le jeu et retourner à l'accueil
 */
function quitGame() {
  if (confirm('Êtes-vous sûr de vouloir quitter?')) {
    window.location.href = '/';
  }
}

/**
 * Aller à la boutique
 */
function goToShop() {
  window.location.href = '/pages/shop.html';
}

/**
 * Ajouter une mise
 */
function placeBet(amount) {
  const user = getCurrentUser();
  
  if (!user) {
    showNotification('Utilisateur non connecté', 'error');
    return false;
  }

  if (user.balance < amount) {
    showNotification('Solde insuffisant', 'error');
    return false;
  }

  // Déduire le montant
  user.balance -= amount;
  setCurrentUser(user);

  // Mettre à jour l'affichage du solde si élément existe
  const balanceElement = document.querySelector('[data-balance-display]');
  if (balanceElement) {
    balanceElement.textContent = formatMoney(user.balance);
  }

  return true;
}

/**
 * Ajouter des gains
 */
function addWinnings(amount) {
  const user = getCurrentUser();
  
  if (!user) {
    showNotification('Utilisateur non connecté', 'error');
    return false;
  }

  user.balance += amount;
  setCurrentUser(user);

  // Mettre à jour l'affichage du solde
  const balanceElement = document.querySelector('[data-balance-display]');
  if (balanceElement) {
    balanceElement.textContent = formatMoney(user.balance);
  }

  showNotification(`+${formatMoney(amount)} gagnés!`, 'success');
  return true;
}

/**
 * Sauvegarder les stats du jeu
 */
async function saveGameStats(gameId, stats) {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('Utilisateur non trouvé');
      return;
    }

    // Sauvegarder localement
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    gameStats[gameId] = {
      ...stats,
      lastPlay: new Date().toISOString(),
      userId: user.id
    };
    localStorage.setItem('gameStats', JSON.stringify(gameStats));

    // Optionnel: Envoyer au serveur si endpoint existe
    if (CONFIG.api.games && CONFIG.api.games.saveStats) {
      await fetchAPI(CONFIG.api.games.saveStats, {
        method: 'POST',
        body: JSON.stringify({
          gameId,
          stats
        })
      });
    }

    console.log('Stats sauvegardées:', gameId, stats);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des stats:', error);
  }
}

/**
 * Obtenir les stats du jeu
 */
function getGameStats(gameId) {
  const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
  return gameStats[gameId] || null;
}
