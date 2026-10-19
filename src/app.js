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

    if (game === GAMES.SPIDER) {
      if (!this.spiderEngine) {
        this.spiderEngine = new SpiderEngine(2);
        this.spiderEngine.startNewGame(2);
        attachSession(this.spiderEngine, this.currentUser.username, 'spider');
      }
      this.spiderUI = new SpiderUI(this.spiderEngine, this.gameContainer, uiOptions);
      this.activeUI = this.spiderUI;
    } else if (game === GAMES.WOW) {
      if (!this.wowEngine) {
        this.wowEngine = attachSession(new WowEngine(this.currentUser.username), this.currentUser.username, 'wow');
      }
      this.wowUI = new WowUI(this.wowEngine, this.gameContainer, uiOptions);
      this.activeUI = this.wowUI;
    } else if (game === GAMES.TOYBLAST) {
      if (!this.toyBlastEngine) {
        this.toyBlastEngine = attachSession(new ToyBlastEngine(this.currentUser.username), this.currentUser.username, 'toyblast');
      }
      this.toyBlastUI = new ToyBlastUI(this.toyBlastEngine, this.gameContainer, uiOptions);
      this.activeUI = this.toyBlastUI;
    } else if (game === GAMES.MATCHINGTON) {
      if (!this.matchingtonEngine) {
        this.matchingtonEngine = attachSession(new MatchingtonEngine(this.currentUser.username), this.currentUser.username, 'matchington');
      }
      this.matchingtonUI = new MatchingtonUI(this.matchingtonEngine, this.gameContainer, uiOptions);
      this.activeUI = this.matchingtonUI;
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

window.addEventListener('DOMContentLoaded', () => {
  new App();
  if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
});
