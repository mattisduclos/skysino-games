/**
 * Utilitaires partagés pour tout le projet
 * Utilisé par les autres scripts
 */

// ===== UTILITAIRES API =====

/**
 * Effectue une requête fetch avec gestion d'erreur cohérente
 * @param {string} endpoint - URL de l'API
 * @param {object} options - Options fetch (method, body, headers, etc.)
 * @returns {Promise<object>} Réponse JSON
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    // Ajouter le token si disponible
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error.message);
    throw error;
  }
}

// ===== UTILITAIRES SKIN =====

/**
 * Obtient le chemin CSS complet d'un skin
 * @param {number} skinId - ID du skin
 * @returns {string} Chemin du fichier CSS
 */
function getSkinCSSPath(skinId) {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG non disponible');
    return '';
  }

  const skinName = CONFIG.skinNames[skinId] || CONFIG.skinNames[0];
  return `/skins/skin-${skinId}-${skinName}.css`;
}

/**
 * Charge le skin actif depuis localStorage et applique le CSS
 */
function loadActiveSkin() {
  const activeSkinId = parseInt(localStorage.getItem('activeSkin') || '0');
  const skinCSSPath = getSkinCSSPath(activeSkinId);

  const skinLink = document.getElementById('skin-css');
  if (skinLink) {
    skinLink.href = skinCSSPath;
  }
}

/**
 * Change le skin actif et applique le CSS
 * @param {number} skinId - ID du skin à appliquer
 */
function changeSkin(skinId) {
  localStorage.setItem('activeSkin', skinId.toString());
  loadActiveSkin();
  
  // Émettre un événement personnalisé
  window.dispatchEvent(new CustomEvent('skinChanged', { detail: { skinId } }));
}

// ===== UTILITAIRES AUTHENTIFICATION =====

/**
 * Obtient l'utilisateur actuel depuis localStorage
 * @returns {object|null} Objet utilisateur ou null
 */
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Définit l'utilisateur actuel dans localStorage
 * @param {object} user - Objet utilisateur
 */
function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Obtient le token d'authentification
 * @returns {string|null} Token ou null
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Définit le token d'authentification
 * @param {string} token - Token JWT
 */
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Efface les données d'authentification (logout)
 */
function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getAuthToken();
}

// ===== UTILITAIRES DOM =====

/**
 * Affiche un message temporaire sur la page
 * @param {string} message - Message à afficher
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {number} duration - Durée en ms (0 = persiste)
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  // Couleurs selon le type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };

  notification.style.backgroundColor = colors[type] || colors.info;
  notification.style.color = 'white';

  document.body.appendChild(notification);

  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  return notification;
}

/**
 * Débounce une fonction (l'appel est retardé si appelée plusieurs fois)
 * @param {function} fn - Fonction à débouncer
 * @param {number} delay - Délai en ms
 * @returns {function} Fonction déboucée
 */
function debounce(fn, delay = 300) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle une fonction (max une exécution par intervalle)
 * @param {function} fn - Fonction à throttle
 * @param {number} delay - Délai minimal en ms
 * @returns {function} Fonction throttled
 */
function throttle(fn, delay = 300) {
  let lastRun = Date.now();
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= delay) {
      fn.apply(this, args);
      lastRun = now;
    }
  };
}

// ===== UTILITAIRES DIVERS =====

/**
 * Formate un nombre en monnaie
 * @param {number} amount - Montant
 * @param {string} currency - Code devise (USD, EUR, etc.)
 * @returns {string} Montant formaté
 */
function formatMoney(amount, currency = 'EUR') {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  });
  return formatter.format(amount);
}

/**
 * Formate une date
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
function formatDate(date) {
  if (typeof date === 'string') date = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Clone profond un objet
 * @param {object} obj - Objet à cloner
 * @returns {object} Clone profond
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ===== INITIALISATION =====

// Charger le skin actif au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadActiveSkin();
});

// Ajouter animation CSS si pas encore présente
if (!document.querySelector('style[data-utils]')) {
  const style = document.createElement('style');
  style.setAttribute('data-utils', 'true');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
