/**
 * Main Application Controller for Jueguitos Arcade
 * Connects Auth, Step Counter, Arcade Navigation, Theme Manager,
 * Spider Solitaire, Words of Wonders, Toy Blast, and Matchington Mansion.
 */

import { Auth } from './auth.js';
import { StepCounter } from './step-counter.js';
import { SpiderEngine } from './spider/engine.js';
import { SpiderUI } from './spider/ui.js';
import { WowEngine } from './wow/engine.js';
import { WowUI } from './wow/ui.js';
import { ToyBlastEngine } from './toyblast/engine.js';
import { ToyBlastUI } from './toyblast/ui.js';
import { MatchingtonEngine } from './matchington/engine.js';
import { MatchingtonUI } from './matchington/ui.js';
import { ArcadeNav, GAMES } from './arcade-nav.js';
import { themeManager } from './theme.js';
import { sound } from './sound.js';

class App {
  constructor() {
    this.currentUser = null;
    this.stepCounter = null;
    this.arcadeNav = null;
    this.activeUI = null;

    // Game instances
    this.spiderEngine = null;
    this.spiderUI = null;
    this.wowEngine = null;
    this.wowUI = null;
    this.toyBlastEngine = null;
    this.toyBlastUI = null;
    this.matchingtonEngine = null;
    this.matchingtonUI = null;

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
    const quickSelect = document.getElementById('loginQuickSelect');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const errorEl = document.getElementById('loginError');

    const selectPlayer = (userId, autoSubmit = false) => {
      const allUsers = Auth.getAllUsers();
      const user = allUsers.find(u => u.id === userId);
      if (!user) return;

      quickSelect?.querySelectorAll('.player-select-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.user === userId);
      });

      if (usernameInput) usernameInput.value = user.displayName;
      if (passwordInput) {
        passwordInput.value = user.password;
      }
      if (errorEl) errorEl.textContent = '';

      if (autoSubmit) {
        handleLogin();
      }
    };

    quickSelect?.querySelectorAll('.player-select-btn').forEach(btn => {
      btn.onclick = () => {
        const userId = btn.dataset.user;
        selectPlayer(userId);
      };
      btn.ondblclick = () => {
        const userId = btn.dataset.user;
        selectPlayer(userId, true);
      };
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

    if (submitBtn) submitBtn.onclick = handleLogin;
    if (passwordInput) {
      passwordInput.onkeydown = (e) => {
        if (e.key === 'Enter') handleLogin(e);
      };
    }

    // Default to Ellen
    selectPlayer('ellen');
  }

  launchArcade() {
    // 1. Initialize Step Counter (persists across all games)
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

    // Cleanly tear down previous game UI to prevent timer and window listener leaks
    if (this.activeUI && typeof this.activeUI.destroy === 'function') {
      this.activeUI.destroy();
    }
    this.activeUI = null;
    this.gameContainer.innerHTML = '';

    themeManager.applyToDOM(game);
    this.arcadeNav?.updateUI();
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
      this.activeUI = this.spiderUI;
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
      this.activeUI = this.wowUI;
    } else if (game === GAMES.TOYBLAST) {
      if (!this.toyBlastEngine) {
        this.toyBlastEngine = new ToyBlastEngine(this.currentUser.username);
      } else {
        this.toyBlastEngine.username = this.currentUser.username;
        this.toyBlastEngine.loadPlayerProgress();
      }
      this.toyBlastUI = new ToyBlastUI(this.toyBlastEngine, this.gameContainer, {
        currentUser: this.currentUser,
        onUserLogout: () => this.handleLogout(),
        onUserSwitch: () => this.handleSwitchUser()
      });
      this.activeUI = this.toyBlastUI;
    } else if (game === GAMES.MATCHINGTON) {
      if (!this.matchingtonEngine) {
        this.matchingtonEngine = new MatchingtonEngine(this.currentUser.username);
      } else {
        this.matchingtonEngine.username = this.currentUser.username;
        this.matchingtonEngine.loadPlayerData();
      }
      this.matchingtonUI = new MatchingtonUI(this.matchingtonEngine, this.gameContainer, {
        currentUser: this.currentUser,
        onUserLogout: () => this.handleLogout(),
        onUserSwitch: () => this.handleSwitchUser()
      });
      this.activeUI = this.matchingtonUI;
    }
  }

  handleLogout() {
    if (this.activeUI && typeof this.activeUI.destroy === 'function') {
      this.activeUI.destroy();
      this.activeUI = null;
    }
    Auth.logout();
    this.currentUser = null;
    this.showLogin();
  }

  handleSwitchUser() {
    this.handleLogout();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
