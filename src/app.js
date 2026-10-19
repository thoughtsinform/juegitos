/**
 * Main Application Controller for Juegitos Arcade
 * Connects Auth, Step Counter, Arcade Navigation, Spider Solitaire, and Words of Wonders (WoW).
 */

import { Auth } from './auth.js';
import { StepCounter } from './step-counter.js';
import { SpiderEngine } from './spider/engine.js';
import { SpiderUI } from './spider/ui.js';
import { WowEngine } from './wow/engine.js';
import { WowUI } from './wow/ui.js';
import { ArcadeNav, GAMES } from './arcade-nav.js';
import { sound } from './sound.js';

class App {
  constructor() {
    this.currentUser = null;
    this.stepCounter = null;
    this.arcadeNav = null;
    
    // Game instances
    this.spiderEngine = null;
    this.spiderUI = null;
    this.wowEngine = null;
    this.wowUI = null;

    this.stepContainer = document.getElementById('stepBannerContainer');
    this.arcadeNavContainer = document.getElementById('arcadeNavContainer');
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
      this.launchArcade();
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
        this.launchArcade();
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

  launchArcade() {
    // 1. Initialize Step Counter (persists across all games!)
    if (!this.stepCounter) {
      this.stepCounter = new StepCounter({
        user: this.currentUser.username,
        container: this.stepContainer
      });
    } else {
      this.stepCounter.setUser(this.currentUser.username);
    }

    // 2. Initialize Arcade Navigation Bar
    if (!this.arcadeNav) {
      this.arcadeNav = new ArcadeNav({
        container: this.arcadeNavContainer,
        onSwitchGame: (game) => this.switchGame(game)
      });
    } else {
      this.arcadeNav.render();
    }

    // 3. Launch active game
    this.switchGame(this.arcadeNav.activeGame);
  }

  switchGame(game) {
    if (!this.gameContainer) return;
    this.gameContainer.innerHTML = '';

    sound.playCardSlide();

    if (game === GAMES.SPIDER) {
      if (!this.spiderEngine) {
        this.spiderEngine = new SpiderEngine(2);
        this.spiderEngine.startNewGame(2);
      }
      this.spiderUI = new SpiderUI(this.spiderEngine, this.gameContainer, {
        currentUser: this.currentUser,
        onUserLogout: () => this.handleLogout(),
        onUserSwitch: () => this.handleSwitchUser()
      });
    } else if (game === GAMES.WOW) {
      if (!this.wowEngine) {
        this.wowEngine = new WowEngine(this.currentUser.username);
      } else {
        this.wowEngine.setUser(this.currentUser.username);
      }
      this.wowUI = new WowUI(this.wowEngine, this.gameContainer, {
        currentUser: this.currentUser,
        onUserLogout: () => this.handleLogout(),
        onUserSwitch: () => this.handleSwitchUser()
      });
    }
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
