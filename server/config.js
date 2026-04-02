/**
 * Configuration centralisée du projet
 * Source unique de vérité pour toutes les constantes
 */

const config = {
  // Serveur
  server: {
    port: 3000,
    host: 'localhost'
  },

  // Skins disponibles
  skins: [
    { id: 0, name: 'night-black', label: 'Nuit Noire', colors: { accent: '#6b7280', accent2: '#4b5563' } },
    { id: 1, name: 'gold', label: 'Or', colors: { accent: '#fbbf24', accent2: '#f59e0b' } },
    { id: 2, name: 'cyberpunk', label: 'Cyberpunk', colors: { accent: '#00ff88', accent2: '#0088ff' } },
    { id: 3, name: 'ocean-blue', label: 'Océan Bleu', colors: { accent: '#00ccff', accent2: '#0099cc' } },
    { id: 4, name: 'fire', label: 'Feu', colors: { accent: '#ff6b35', accent2: '#ff4500' } },
    { id: 5, name: 'forest-green', label: 'Forêt Verte', colors: { accent: '#2ecc71', accent2: '#27ae60' } },
    { id: 6, name: 'purple-royal', label: 'Pourpre Royal', colors: { accent: '#d946ef', accent2: '#c084fc' } },
    { id: 7, name: 'pink-neon', label: 'Rose Néon', colors: { accent: '#ff1493', accent2: '#ff69b4' } },
    { id: 8, name: 'glacier-mono', label: 'Glacier Mono', colors: { accent: '#374151', accent2: '#1f2937' } },
    { id: 9, name: 'sunset', label: 'Coucher de Soleil', colors: { accent: '#ff8c42', accent2: '#ff6b9d' } },
    { id: 10, name: 'matrix', label: 'Matrix', colors: { accent: '#00ff00', accent2: '#00cc00' } },
    { id: 11, name: 'cosmos', label: 'Cosmos', colors: { accent: '#00d9ff', accent2: '#9d4edd' } }
  ],

  // Jeux disponibles
  games: [
    { id: 'blackjack', label: 'Blackjack', path: '/pages/blackjack.html' },
    { id: 'poker', label: 'Poker', path: '/pages/poker.html' },
    { id: 'roulette', label: 'Roulette', path: '/pages/roulette.html' },
    { id: 'slots', label: 'Machines à Sous', path: '/pages/slots.html' }
  ],

  // Endpoints API
  api: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      logout: '/api/auth/logout'
    },
    shop: {
      getSkins: '/api/shop/skins',
      buySkin: '/api/shop/buy',
      getInventory: '/api/shop/inventory'
    },
    awareness: {
      getItems: '/api/awareness/items',
      markAsRead: '/api/awareness/mark-read'
    }
  },

  // CSS Variables (doivent correspondre à :root dans styles.css)
  cssVariables: {
    light: {
      'bg-a': '#f5f5f5',
      'bg-b': '#e8e8e8',
      'accent': '#3b82f6',
      'accent-2': '#1f2937',
      'muted': '#9ca3af',
      'card': '#ffffff',
      'glass': 'rgba(255, 255, 255, 0.7)'
    },
    dark: {
      'bg-a': '#0f172a',
      'bg-b': '#1e293b',
      'accent': '#3b82f6',
      'accent-2': '#1f2937',
      'muted': '#64748b',
      'card': '#1e293b',
      'glass': 'rgba(30, 41, 59, 0.7)'
    }
  },

  // Noms des skins pour localStorage
  skinNames: [
    'night-black',
    'gold',
    'cyberpunk',
    'ocean-blue',
    'fire',
    'forest-green',
    'purple-royal',
    'pink-neon',
    'glacier-mono',
    'sunset',
    'matrix',
    'cosmos'
  ]
};

// Export pour Node.js (serveur)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

// Export pour navigateur (client)
if (typeof window !== 'undefined') {
  window.CONFIG = config;
}
