/**
 * Script principal - Chargé sur TOUTES les pages
 * Gère: authentification, skin, navigation commune
 */

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si utilisateur est connecté
  const user = getCurrentUser();
  
  if (user) {
    // Utilisateur connecté
    console.log('Utilisateur connecté:', user.username);
    updateUserUI(user);
  } else {
    // Utilisateur non connecté
    console.log('Pas d\'utilisateur connecté');
    handleLoggedOut();
  }

  // Écouter les changements de skin
  window.addEventListener('skinChanged', (e) => {
    console.log('Skin changé:', e.detail.skinId);
    // Éventuellement sauvegarder ou faire quelque chose
  });
});

/**
 * Mets à jour l'UI avec les infos de l'utilisateur
 */
function updateUserUI(user) {
  // Afficher le nom d'utilisateur dans le header (si élément existe)
  const userElement = document.querySelector('[data-user-display]');
  if (userElement) {
    userElement.textContent = user.username;
  }

  // Afficher les crédits/solde
  const balanceElement = document.querySelector('[data-balance-display]');
  if (balanceElement && user.balance !== undefined) {
    balanceElement.textContent = formatMoney(user.balance);
  }

  // Activer les boutons spécifiques aux utilisateurs connectés
  document.querySelectorAll('[data-requires-auth]').forEach(el => {
    el.classList.remove('disabled');
    el.style.pointerEvents = 'auto';
  });

  // Masquer les boutons de login/register
  document.querySelectorAll('[data-auth-only]').forEach(el => {
    el.style.display = 'block';
  });
  document.querySelectorAll('[data-guest-only]').forEach(el => {
    el.style.display = 'none';
  });
}

/**
 * Gère l'état "utilisateur non connecté"
 */
function handleLoggedOut() {
  // Désactiver les boutons nécessitant l'auth
  document.querySelectorAll('[data-requires-auth]').forEach(el => {
    el.classList.add('disabled');
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.5';
  });

  // Masquer les éléments "auth only"
  document.querySelectorAll('[data-auth-only]').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('[data-guest-only]').forEach(el => {
    el.style.display = 'block';
  });
}

/**
 * Fonction de logout globale
 */
function logout() {
  clearAuth();
  handleLoggedOut();
  showNotification('Déconnecté avec succès', 'success');
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

/**
 * Navigue vers une page du jeu
 */
function navigateToGame(gameId) {
  if (!isAuthenticated()) {
    showNotification('Vous devez être connecté pour jouer', 'warning');
    return;
  }
  
  const game = CONFIG.games.find(g => g.id === gameId);
  if (game) {
    window.location.href = game.path;
  }
}

/**
 * Navigue vers la boutique
 */
function navigateToShop() {
  window.location.href = '/pages/shop.html';
}

/**
 * Navigue vers l'accueil
 */
function navigateHome() {
  window.location.href = '/';
}
