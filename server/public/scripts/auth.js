/**
 * Logique d'authentification
 * Gère: login, register, logout
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les formulaires s'ils existent
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Ajouter événement aux boutons s'ils existent
  document.querySelector('[data-login-btn]')?.addEventListener('click', showLoginForm);
  document.querySelector('[data-register-btn]')?.addEventListener('click', showRegisterForm);
  document.querySelector('[data-logout-btn]')?.addEventListener('click', logout);
});

/**
 * Gère la soumission du formulaire de login
 */
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('login-username')?.value || '';
  const password = document.getElementById('login-password')?.value || '';

  if (!username || !password) {
    showNotification('Complétez tous les champs', 'warning');
    return;
  }

  try {
    const response = await fetchAPI(CONFIG.api.auth.login, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (response.token && response.user) {
      // Sauvegarder token et utilisateur
      setAuthToken(response.token);
      setCurrentUser(response.user);

      showNotification(`Bienvenue ${username}!`, 'success');

      // Rediriger après 1s
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showNotification('Erreur authentification', 'error');
    }
  } catch (error) {
    showNotification(`Erreur: ${error.message}`, 'error');
  }
}

/**
 * Gère la soumission du formulaire de register
 */
async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById('register-username')?.value || '';
  const password = document.getElementById('register-password')?.value || '';
  const passwordConfirm = document.getElementById('register-password-confirm')?.value || '';

  // Validation
  if (!username || !password || !passwordConfirm) {
    showNotification('Complétez tous les champs', 'warning');
    return;
  }

  if (password !== passwordConfirm) {
    showNotification('Les mots de passe ne correspondent pas', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Le mot de passe doit avoir au moins 6 caractères', 'warning');
    return;
  }

  try {
    const response = await fetchAPI(CONFIG.api.auth.register, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (response.token && response.user) {
      setAuthToken(response.token);
      setCurrentUser(response.user);

      showNotification(`Compte créé! Bienvenue ${username}!`, 'success');

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showNotification('Erreur création compte', 'error');
    }
  } catch (error) {
    showNotification(`Erreur: ${error.message}`, 'error');
  }
}

/**
 * Affiche le formulaire de login (modal ou page)
 */
function showLoginForm() {
  const modal = createAuthModal('login');
  document.body.appendChild(modal);
  document.getElementById('login-username')?.focus();
}

/**
 * Affiche le formulaire de register (modal ou page)
 */
function showRegisterForm() {
  const modal = createAuthModal('register');
  document.body.appendChild(modal);
  document.getElementById('register-username')?.focus();
}

/**
 * Crée une modal d'authentification
 */
function createAuthModal(type) {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const form = document.createElement('form');
  form.style.cssText = `
    background: var(--card);
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `;

  if (type === 'login') {
    form.id = 'login-form';
    form.innerHTML = `
      <h2>Connexion</h2>
      <input type="text" id="login-username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="login-password" placeholder="Mot de passe" required>
      <button type="submit" class="btn">Se connecter</button>
      <p style="text-align: center; margin-top: 15px;">
        Pas de compte? <a href="#" onclick="showRegisterForm(); return false;" style="color: var(--accent);">S'inscrire</a>
      </p>
      <button type="button" onclick="this.closest('.auth-modal').remove()" style="width: 100%; margin-top: 10px; padding: 10px; background: var(--muted); color: white; border: none; border-radius: 4px; cursor: pointer;">Fermer</button>
    `;
  } else {
    form.id = 'register-form';
    form.innerHTML = `
      <h2>S'inscrire</h2>
      <input type="text" id="register-username" placeholder="Nom d'utilisateur" required>
      <input type="password" id="register-password" placeholder="Mot de passe" required>
      <input type="password" id="register-password-confirm" placeholder="Confirmer mot de passe" required>
      <button type="submit" class="btn">Créer compte</button>
      <p style="text-align: center; margin-top: 15px;">
        Déjà inscrit? <a href="#" onclick="showLoginForm(); return false;" style="color: var(--accent);">Se connecter</a>
      </p>
      <button type="button" onclick="this.closest('.auth-modal').remove()" style="width: 100%; margin-top: 10px; padding: 10px; background: var(--muted); color: white; border: none; border-radius: 4px; cursor: pointer;">Fermer</button>
    `;
  }

  form.addEventListener('submit', type === 'login' ? handleLogin : handleRegister);

  // Ajouter styles input si pas définis
  const style = document.createElement('style');
  style.textContent = `
    .auth-modal input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid var(--accent, #3b82f6);
      border-radius: 4px;
      background: var(--bg-b);
      color: inherit;
    }
    .auth-modal input::placeholder {
      color: var(--muted, #999);
    }
    .auth-modal h2 {
      margin-top: 0;
      color: var(--accent, #3b82f6);
    }
  `;
  document.head.appendChild(style);

  modal.appendChild(form);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  return modal;
}
