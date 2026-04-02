/**
 * Logique de la boutique (skins)
 * Gère: affichage des skins, achat, inventaire, changement de skin
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Vérifier authentification
  if (!isAuthenticated()) {
    showNotification('Vous devez être connecté', 'warning');
    setTimeout(() => window.location.href = '/', 2000);
    return;
  }

  // Charger les données
  await loadShop();
  
  // Afficher l'inventaire
  displayInventory();

  // Écouter les changements de skin
  window.addEventListener('skinChanged', () => {
    displayInventory(); // Rafraîchir pour mettre en évidence l'actif
  });
});

/**
 * Charge les données de la boutique
 */
async function loadShop() {
  try {
    // Utiliser config.skins directement
    const skins = CONFIG.skins;

    // Afficher les skins disponibles
    const shopContainer = document.querySelector('[data-shop-container]');
    if (shopContainer) {
      shopContainer.innerHTML = skins.map(skin => `
        <div class="shop-item" data-skin-id="${skin.id}">
          <div class="shop-item-preview" style="background: linear-gradient(135deg, ${skin.colors.accent}, ${skin.colors.accent2});">
            ${skin.label}
          </div>
          <h3 class="shop-item-name">${skin.label}</h3>
          <p class="shop-item-desc">${skin.name}</p>
          <button class="shop-item-btn" onclick="buyOrActivateSkin(${skin.id})">
            <span data-button-text="buy">Acheter</span>
          </button>
          <button class="preview-btn" onclick="previewSkin(${skin.id})">Aperçu</button>
        </div>
      `).join('');

      // Mettre à jour les boutons
      updateShopButtons();
    }

    console.log('Boutique chargée:', skins.length, 'skins');
  } catch (error) {
    console.error('Erreur chargement boutique:', error);
    showNotification('Erreur chargement boutique', 'error');
  }
}

/**
 * Affiche l'inventaire de l'utilisateur
 */
function displayInventory() {
  const user = getCurrentUser();
  if (!user) return;

  const inventory = user.inventory || [];
  const activeSkinId = parseInt(localStorage.getItem('activeSkin') || '0');

  const inventoryContainer = document.querySelector('[data-inventory-container]');
  if (inventoryContainer) {
    inventoryContainer.innerHTML = inventory.map(skinId => {
      const skin = CONFIG.skins[skinId];
      if (!skin) return '';

      return `
        <div class="inventory-item ${activeSkinId === skinId ? 'active' : ''}" data-skin-id="${skinId}">
          <div class="inventory-preview" style="background: linear-gradient(135deg, ${skin.colors.accent}, ${skin.colors.accent2});">
            ${skin.label}
          </div>
          ${activeSkinId === skinId ? '<span class="inventory-active-badge">Actif</span>' : ''}
          <h4>${skin.label}</h4>
          <button class="btn" onclick="activateSkin(${skinId})">
            ${activeSkinId === skinId ? 'Actif' : 'Activer'}
          </button>
        </div>
      `;
    }).join('');
  }
}

/**
 * Achète ou active un skin
 */
async function buyOrActivateSkin(skinId) {
  const user = getCurrentUser();
  if (!user) {
    showNotification('Non authentifié', 'error');
    return;
  }

  const inventory = user.inventory || [];
  
  // Si déjà possédé, juste activer
  if (inventory.includes(skinId)) {
    activateSkin(skinId);
    return;
  }

  // Sinon, acheter
  try {
    // Simuler achat (en vrai, ce serait une API)
    const skin = CONFIG.skins[skinId];
    const price = 100; // Hardcodé pour démo, sinon de config.js

    if (user.balance < price) {
      showNotification('Solde insuffisant', 'error');
      return;
    }

    // Déduire le montant
    user.balance -= price;
    user.inventory = [...inventory, skinId];
    setCurrentUser(user);

    showNotification(`Skin "${skin.label}" acheté!`, 'success');

    // Rafraîchir l'affichage
    await loadShop();
    displayInventory();
    updateShopButtons();
  } catch (error) {
    console.error('Erreur achat:', error);
    showNotification('Erreur lors de l\'achat', 'error');
  }
}

/**
 * Active un skin
 */
function activateSkin(skinId) {
  const user = getCurrentUser();
  const inventory = user.inventory || [];

  if (!inventory.includes(skinId) && skinId !== 0) {
    showNotification('Vous ne possédez pas ce skin', 'warning');
    return;
  }

  changeSkin(skinId);
  
  const skin = CONFIG.skins[skinId];
  showNotification(`Skin "${skin.label}" activé!`, 'success');

  // Rafraîchir l'inventaire
  displayInventory();
}

/**
 * Affiche un aperçu du skin
 */
function previewSkin(skinId) {
  const skin = CONFIG.skins[skinId];
  
  const modal = document.createElement('div');
  modal.className = 'preview-modal';
  modal.innerHTML = `
    <div class="preview-modal-content">
      <button class="preview-modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      
      <h2 class="preview-title">${skin.label}</h2>
      <p>${skin.name}</p>
      
      <div class="preview-demo-box" style="border: 2px solid ${skin.colors.accent}; background: linear-gradient(135deg, ${skin.colors.accent}33, ${skin.colors.accent2}33);">
        <div style="color: ${skin.colors.accent}; font-weight: bold;">Couleur d'accent</div>
        <div style="color: ${skin.colors.accent2}; font-weight: bold;">Couleur secondaire</div>
        <button style="background: ${skin.colors.accent}; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Bouton exemple</button>
      </div>
      
      <button class="btn" onclick="activateSkin(${skinId}); this.closest('.preview-modal').remove();">
        Activer ce skin
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

/**
 * Met à jour les textes des boutons selon l'inventaire
 */
function updateShopButtons() {
  const user = getCurrentUser();
  const inventory = user.inventory || [];

  document.querySelectorAll('.shop-item').forEach(item => {
    const skinId = parseInt(item.dataset.skinId);
    const btn = item.querySelector('.shop-item-btn');
    const textEl = btn.querySelector('[data-button-text]');

    if (inventory.includes(skinId)) {
      textEl.textContent = 'Posséder';
      btn.disabled = false;
    } else {
      textEl.textContent = 'Acheter';
      btn.disabled = false;
    }
  });
}

/**
 * Rafraîchit l'affichage complet
 */
async function refreshShop() {
  await loadShop();
  displayInventory();
}
