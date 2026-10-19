/**
 * Main Application Controller for Juegitos
 * Connects Auth, Step Counter, and Spider Solitaire
 */

import { Auth } from './auth.js';
import { StepCounter } from './step-counter.js';
import { SpiderEngine } from './spider/engine.js';
import { SpiderUI } from './spider/ui.js';
import { sound } from './sound.js';

class App {
  constructor() {
    this.currentUser = null;
    this.stepCounter = null;
    this.spiderEngine = null;
    this.spiderUI = null;

    this.stepContainer = document.getElementById('stepBannerContainer');
    this.gameContainer = document.getElementById('gameContainer');
    this.loginModal = document.getElementById('loginModal');

    this.init();
  }

  init() {
    this.checkSession();
  }

  checkSession() {
    const user = Auth.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.hideLogin();
      this.launchGame();
    } else {
      this.showLogin();
    }
  }

  showLogin() {
    if (!this.loginModal) return;
    this.loginModal.style.display = 'flex';
    this.wireLoginForm();
  }

  hideLogin() {
    if (this.loginModal) {
      this.loginModal.style.display = 'none';
    }
  }

  wireLoginForm() {
    const susanBtn = document.getElementById('selectSusanBtn');
    const ellenBtn = document.getElementById('selectEllenBtn');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const errorEl = document.getElementById('loginError');

    // Quick select buttons
    susanBtn?.addEventListener('click', () => {
      susanBtn.classList.add('selected');
      ellenBtn?.classList.remove('selected');
      if (usernameInput) usernameInput.value = 'Susan';
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
      if (errorEl) errorEl.textContent = '';
    });

    ellenBtn?.addEventListener('click', () => {
      ellenBtn.classList.add('selected');
      susanBtn?.classList.remove('selected');
      if (usernameInput) usernameInput.value = 'Ellen';
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
      if (errorEl) errorEl.textContent = '';
    });

    const handleLogin = (e) => {
      e?.preventDefault();
      const u = usernameInput?.value || '';
      const p = passwordInput?.value || '';

      const res = Auth.login(u, p);
      if (res.success) {
        this.currentUser = res.user;
        sound.initAudio();
        sound.playStepGoalMet();
        this.hideLogin();
        this.launchGame();
        this.stepCounter?.requestAndStart();
      } else {
        if (errorEl) errorEl.textContent = res.error;
      }
    };

    submitBtn?.addEventListener('click', handleLogin);
    passwordInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin(e);
    });
  }

  launchGame() {
    // 1. Initialize Step Counter (Replaces ad banner!)
    if (!this.stepCounter) {
      this.stepCounter = new StepCounter({
        user: this.currentUser.username,
        container: this.stepContainer
      });
    } else {
      this.stepCounter.setUser(this.currentUser.username);
    }

    // 2. Initialize Spider Solitaire
    if (!this.spiderEngine) {
      // Default to 2 suits (Spades & Hearts) as in Mom's screenshot!
      this.spiderEngine = new SpiderEngine(2);
      this.spiderEngine.startNewGame(2);
    }

    this.spiderUI = new SpiderUI(this.spiderEngine, this.gameContainer, {
      currentUser: this.currentUser,
      onUserLogout: () => this.handleLogout(),
      onUserSwitch: () => this.handleSwitchUser()
    });
  }

  handleLogout() {
    Auth.logout();
    this.currentUser = null;
    this.showLogin();
  }

  handleSwitchUser() {
    this.handleLogout();
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
