/**
 * Awareness System - Sensibilisation des joueurs aux pertes
 * Ce fichier gère l'affichage des notifications de sensibilisation
 * quand un joueur perd une certaine somme
 */

// Créer les éléments HTML nécessaires si pas déjà présents
function initializeAwarenessModal() {
  if (document.getElementById('awareness-modal')) {
    return; // Modal déjà initialisé
  }

  const modal = document.createElement('div');
  modal.id = 'awareness-modal';
  modal.className = 'awareness-modal';
  modal.innerHTML = `
    <div class="awareness-modal-content">
      <div class="awareness-header">
        <h2>⚠️ Sensibilisation</h2>
        <p>Vous avez perdu</p>
        <div class="loss-amount" id="loss-amount-display">0€</div>
      </div>
      
      <p style="color: var(--muted); margin: 1rem 0;">Voici ce que vous auriez pu acheter avec cette somme:</p>
      
      <div class="awareness-items" id="awareness-items-list">
        <!-- Items will be inserted here -->
      </div>
      
      <div class="awareness-actions">
        <button class="awareness-btn awareness-btn-close" onclick="closeAwarenessModal()">Fermer</button>
        <button class="awareness-btn awareness-btn-continue" onclick="closeAwarenessModal()">Continuer</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  injectAwarenessStyles();
}

function injectAwarenessStyles() {
  if (document.getElementById('awareness-styles')) {
    return; // Styles déjà injectés
  }

  const style = document.createElement('style');
  style.id = 'awareness-styles';
  style.textContent = `
    .awareness-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }

    .awareness-modal.active {
      display: flex;
    }

    .awareness-modal-content {
      background: linear-gradient(180deg, #06213a, #021428);
      padding: 2rem;
      border-radius: 14px;
      max-width: 500px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .awareness-header {
      margin-bottom: 1.5rem;
    }

    .awareness-header h2 {
      margin: 0 0 0.5rem;
      color: #ff6b6b;
      font-size: 1.5rem;
    }

    .awareness-header p {
      margin: 0;
      color: #cfc7b0;
      font-size: 0.95rem;
    }

    .loss-amount {
      display: inline-block;
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 700;
      margin: 1rem 0;
    }

    .awareness-items {
      margin: 1.5rem 0;
      max-height: 300px;
      overflow-y: auto;
    }

    .awareness-item {
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      border-left: 3px solid #d4af37;
      transition: all 0.2s ease;
    }

    .awareness-item:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateX(4px);
    }

    .awareness-item-name {
      font-weight: 600;
      color: #f6f4ef;
      margin-bottom: 0.25rem;
    }

    .awareness-item-price {
      color: #d4af37;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .awareness-item-desc {
      color: #cfc7b0;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .awareness-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .awareness-btn {
      flex: 1;
      padding: 0.75rem;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .awareness-btn-close {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #cfc7b0;
    }

    .awareness-btn-close:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .awareness-btn-continue {
      background: #d4af37;
      color: #081018;
    }

    .awareness-btn-continue:hover {
      opacity: 0.9;
    }
  `;
  
  document.head.appendChild(style);
}

// Afficher la notification de sensibilisation
async function showAwarenessNotification(lossAmount) {
  if (lossAmount <= 0) return;

  initializeAwarenessModal();

  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_BASE = location.port === '3000' ? '' : 'http://localhost:3000';
    const response = await fetch(API_BASE + '/api/awareness/items', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lossAmount })
    });

    if (!response.ok) return;

    const data = await response.json();
    displayAwarenessModal(lossAmount, data.items);
  } catch (err) {
    console.error('Error showing awareness notification:', err);
  }
}

function displayAwarenessModal(lossAmount, items) {
  document.getElementById('loss-amount-display').textContent = lossAmount + '€';
  
  const itemsList = document.getElementById('awareness-items-list');
  itemsList.innerHTML = '';

  if (items && items.length > 0) {
    items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'awareness-item';
      itemDiv.innerHTML = `
        <div class="awareness-item-name">${item.name}</div>
        <div class="awareness-item-price">${item.price}€</div>
        <div class="awareness-item-desc">${item.description}</div>
      `;
      itemsList.appendChild(itemDiv);
    });
  } else {
    itemsList.innerHTML = '<p style="color: #cfc7b0; text-align: center;">Aucun article trouvé pour ce montant.</p>';
  }

  const modal = document.getElementById('awareness-modal');
  modal.classList.add('active');
}

function closeAwarenessModal() {
  const modal = document.getElementById('awareness-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeAwarenessModal);
