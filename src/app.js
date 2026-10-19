/**
 * Main Application Controller for Jueguitos Arcade
 * Connects Auth, Step Counter (off by default), Unified Arcade Menu, Theme Manager,
 * Spider Solitaire, Words of Wonders, Toy Blast, and Matchington Mansion.
 */

import { attachSession } from './play-session.js';
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

    window.addEventListener('pagehide', () => this.saveGames());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.saveGames();
    });

    // Global delegate for any in-game Menu button ([data-action="open-arcade-menu"])
    document.addEventListener('click', (e) => {
      const menuTrigger = e.target.closest('[data-action="open-arcade-menu"]');
      if (menuTrigger && this.arcadeNav) {
        e.preventDefault();
        this.openArcadeMenu();
      }
    });

    this.init();
  }

  init() {
    this.checkSession();
  }

  openArcadeMenu() {
    this.saveGames();
    this.arcadeNav?.openMenu();
  }

  checkSession() {
    const user = Auth.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.hideLogin();
      try {
        this.launchArcade();
      } catch (err) {
        try {
          Object.keys(localStorage).forEach(k => {
            if (k.startsWith('jueguitos_session_v1_')) localStorage.removeItem(k);
          });
        } catch (e) {}
        try {
          this.launchArcade();
        } catch (retryErr) {
          this.showLogin();
        }
      }
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
        selectPlayer(userId, true);
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
        if (this.stepCounter?.isEnabled()) {
          this.stepCounter.requestAndStart();
        }
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
    // 1. Initialize Step Counter (off by default unless toggled on in Menu)
    if (!this.stepCounter) {
      this.stepCounter = new StepCounter({
        user: this.currentUser.username,
        container: this.stepContainer
      });
    } else {
      this.stepCounter.setUser(this.currentUser.username);
    }

    // 2. Initialize Unified Arcade Menu
    if (!this.arcadeNav) {
      this.arcadeNav = new ArcadeNav({
        container: this.arcadeNavContainer,
        stepCounter: this.stepCounter,
        currentUser: this.currentUser,
        onSaveGames: () => this.saveGames(),
        onSwitchPlayer: () => this.handleSwitchUser(),
        onSwitchGame: (game) => this.switchGame(game)
      });
    } else {
      this.arcadeNav.setUser(this.currentUser);
    }

    // 3. Launch active game
    if (this.engineUser !== this.currentUser.username) {
      this.spiderEngine = this.wowEngine = this.toyBlastEngine = this.matchingtonEngine = null;
      this.engineUser = this.currentUser.username;
    }
    this.switchGame(this.arcadeNav.activeGame);
  }

  switchGame(game) {
    if (!this.gameContainer) return;

    // Auto-save before switching
    this.saveGames();

    // Cleanly tear down previous game UI to prevent timer and window listener leaks
    if (this.activeUI && typeof this.activeUI.destroy === 'function') {
      this.activeUI.destroy();
    }
    this.activeUI = null;
    this.gameContainer.innerHTML = '';

    themeManager.applyToDOM(game);
    this.arcadeNav?.updateUI();
    sound.playCardSlide();

    const uiOptions = {
      currentUser: this.currentUser,
      onOpenMenu: () => this.openArcadeMenu(),
      onUserLogout: () => this.handleLogout(),
      onUserSwitch: () => this.handleSwitchUser()
    };

    const launchSelectedGame = (targetGame) => {
      if (targetGame === GAMES.SPIDER) {
        if (!this.spiderEngine) {
          this.spiderEngine = new SpiderEngine(2);
          this.spiderEngine.startNewGame(2);
          attachSession(this.spiderEngine, this.currentUser.username, 'spider');
        }
        this.spiderUI = new SpiderUI(this.spiderEngine, this.gameContainer, uiOptions);
        this.activeUI = this.spiderUI;
      } else if (targetGame === GAMES.WOW) {
        if (!this.wowEngine) {
          this.wowEngine = attachSession(new WowEngine(this.currentUser.username), this.currentUser.username, 'wow');
        }
        this.wowUI = new WowUI(this.wowEngine, this.gameContainer, uiOptions);
        this.activeUI = this.wowUI;
      } else if (targetGame === GAMES.TOYBLAST) {
        if (!this.toyBlastEngine) {
          this.toyBlastEngine = attachSession(new ToyBlastEngine(this.currentUser.username), this.currentUser.username, 'toyblast');
        }
        this.toyBlastUI = new ToyBlastUI(this.toyBlastEngine, this.gameContainer, uiOptions);
        this.activeUI = this.toyBlastUI;
      } else if (targetGame === GAMES.MATCHINGTON) {
        if (!this.matchingtonEngine) {
          this.matchingtonEngine = attachSession(new MatchingtonEngine(this.currentUser.username), this.currentUser.username, 'matchington');
        }
        this.matchingtonUI = new MatchingtonUI(this.matchingtonEngine, this.gameContainer, uiOptions);
        this.activeUI = this.matchingtonUI;
      }
    };

    try {
      launchSelectedGame(game);
    } catch (err) {
      // Self-healing fallback: clear stale session for this game and re-initialize cleanly
      try {
        localStorage.removeItem(`jueguitos_session_v1_${this.currentUser.username}_${game}`);
      } catch (e) {}
      this.spiderEngine = this.wowEngine = this.toyBlastEngine = this.matchingtonEngine = null;
      this.gameContainer.innerHTML = '';
      launchSelectedGame(game);
    }
  }

  saveGames() {
    [this.spiderEngine, this.wowEngine, this.toyBlastEngine, this.matchingtonEngine].forEach(engine => engine?.saveSession?.());
  }

  handleLogout() {
    this.saveGames();
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

const bootApp = () => {
  if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' }).then(reg => {
      reg.update().catch(() => {});
    }).catch(() => {});
  }

  let appInstance = null;
  try {
    appInstance = new App();
  } catch (err) {
    // Clear potentially corrupted game sessions while keeping player auth, then retry
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('jueguitos_session_v1_')) localStorage.removeItem(k);
      });
    } catch (e) {}
    try {
      appInstance = new App();
    } catch (retryErr) {
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.style.display = 'flex';
    }
  }

  // Final safety check: never allow both loginModal and gameContainer to be empty/hidden
  const gameContainer = document.getElementById('gameContainer');
  const loginModal = document.getElementById('loginModal');
  if (
    gameContainer &&
    loginModal &&
    gameContainer.innerHTML.trim() === '' &&
    loginModal.style.display === 'none'
  ) {
    if (appInstance) {
      appInstance.showLogin();
    } else {
      loginModal.style.display = 'flex';
    }
  }
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootApp, { once: true });
} else {
  bootApp();
}
