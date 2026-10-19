/**
 * Jueguitos Unified Menu & Game Switcher
 * Eliminates persistent top-bar clutter by moving Game Switching (with Auto-Save on exit),
 * the Walking Step Counter toggle (off by default), Theme selection, Sound toggle,
 * and Player switching into a clean, accessible Menu modal.
 */

import { Icons } from './icons.js';
import { themeManager } from './theme.js';
import { showToast } from './toast.js';
import { sound } from './sound.js';

export const GAMES = {
  SPIDER: 'spider',
  WOW: 'wow',
  TOYBLAST: 'toyblast',
  MATCHINGTON: 'matchington'
};

export const GAME_META = {
  [GAMES.SPIDER]: {
    name: 'Spider Solitaire',
    subtitle: 'Royal Parlor Cards',
    icon: (cls, sz) => Icons.cards(cls, sz)
  },
  [GAMES.WOW]: {
    name: 'Words of Wonders',
    subtitle: '24 World Wonder Crosswords',
    icon: (cls, sz) => Icons.tiles(cls, sz)
  },
  [GAMES.TOYBLAST]: {
    name: 'Toy Blast',
    subtitle: '3D Block Puzzle',
    icon: (cls, sz) => Icons.toyBlocks(cls, sz)
  },
  [GAMES.MATCHINGTON]: {
    name: 'Matchington Mansion',
    subtitle: 'Match-3 & Room Design',
    icon: (cls, sz) => Icons.mansion(cls, sz)
  }
};

export class ArcadeNav {
  constructor(options = {}) {
    this.activeGame = this.loadActiveGame();
    this.onSwitchGame = options.onSwitchGame || (() => {});
    this.onThemeChange = options.onThemeChange || (() => {});
    this.onSaveGames = options.onSaveGames || (() => {});
    this.onSwitchPlayer = options.onSwitchPlayer || (() => {});
    this.stepCounter = options.stepCounter || null;
    this.currentUser = options.currentUser || { displayName: 'Ellen', avatar: 'assets/avatars/ellen.png' };
    this.container = options.container;
    this.isOpen = false;

    themeManager.applyToDOM(this.activeGame);
    this.render();
  }

  loadActiveGame() {
    try {
      const g = localStorage.getItem('juegitos_active_game');
      return g && Object.values(GAMES).includes(g) ? g : GAMES.SPIDER;
    } catch (e) {
      return GAMES.SPIDER;
    }
  }

  setUser(user) {
    if (user) this.currentUser = user;
    this.render();
  }

  setActiveGame(game) {
    if (!Object.values(GAMES).includes(game)) return;
    // Auto-save current game before exiting and switching
    this.onSaveGames();
    const changed = this.activeGame !== game;
    this.activeGame = game;
    try {
      localStorage.setItem('juegitos_active_game', game);
    } catch (e) {}
    themeManager.applyToDOM(this.activeGame);
    this.closeMenu();
    if (changed) {
      const meta = GAME_META[game];
      showToast(`Saved & switched to ${meta ? meta.name : game}`, 'success', 1800);
      this.onSwitchGame(this.activeGame);
    }
  }

  openMenu() {
    // Auto-save progress immediately whenever opening the menu
    this.onSaveGames();
    this.isOpen = true;
    sound.playPop(1.05);
    this.render();
  }

  closeMenu() {
    this.isOpen = false;
    const overlay = this.container?.querySelector('#arcadeMenuOverlay');
    if (overlay) overlay.classList.remove('is-open');
  }

  render() {
    if (!this.container) return;

    const currentTheme = themeManager.getThemeForGame(this.activeGame);
    const stepsEnabled = this.stepCounter ? this.stepCounter.isEnabled() : false;
    const stepsCount = this.stepCounter ? this.stepCounter.steps : 0;

    this.container.innerHTML = `
      <div class="arcade-menu-overlay ${this.isOpen ? 'is-open' : ''}" id="arcadeMenuOverlay" role="dialog" aria-modal="true" aria-label="Arcade Game Menu">
        <div class="arcade-menu-sheet">
          <!-- Menu Header -->
          <div class="arcade-menu-header">
            <div class="arcade-menu-title-wrap">
              <h2 class="arcade-menu-title">Jueguitos Menu</h2>
              <span class="arcade-autosave-badge">${Icons.check('save-ico', 13)} Progress Auto-Saved</span>
            </div>
            <button type="button" class="arcade-menu-close-btn" id="arcadeMenuCloseBtn" aria-label="Close Menu">
              ${Icons.close('', 18)}
            </button>
          </div>

          <!-- Section 1: Exit & Switch Game -->
          <div class="arcade-menu-section">
            <div class="arcade-section-label">Exit & Switch Game (Auto-Saves Progress)</div>
            <div class="arcade-game-grid">
              ${Object.values(GAMES).map(gameKey => {
                const meta = GAME_META[gameKey];
                const isCurrent = this.activeGame === gameKey;
                return `
                  <button type="button" class="arcade-game-card ${isCurrent ? 'is-current' : ''}" data-game="${gameKey}">
                    <div class="game-card-icon">${meta.icon('game-card-svg', 24)}</div>
                    <div class="game-card-info">
                      <span class="game-card-name">${meta.name}</span>
                      <span class="game-card-status">${isCurrent ? 'Playing Now' : 'Save & Switch'}</span>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Section 2: Settings & Toggles (Steps Off by Default, Theme, Sound) -->
          <div class="arcade-menu-section">
            <div class="arcade-section-label">Settings & Display</div>
            <div class="arcade-settings-list">
              <!-- Walking Step Counter Toggle (Off by default) -->
              <div class="arcade-setting-row">
                <div class="setting-row-left">
                  <span class="setting-row-icon">${Icons.sneaker('set-svg', 19)}</span>
                  <div class="setting-row-text">
                    <strong>Walking Step Counter</strong>
                    <span>${stepsEnabled ? `${stepsCount.toLocaleString()} steps today` : 'Hidden to save screen space'}</span>
                  </div>
                </div>
                <button type="button" class="arcade-toggle-pill ${stepsEnabled ? 'is-on' : 'is-off'}" id="menuStepsToggleBtn" aria-pressed="${stepsEnabled}">
                  ${stepsEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <!-- Visual Theme Switcher -->
              <div class="arcade-setting-row">
                <div class="setting-row-left">
                  <span class="setting-row-icon">${Icons.palette('set-svg', 19)}</span>
                  <div class="setting-row-text">
                    <strong>Game Theme</strong>
                    <span id="menuThemeName">${currentTheme.name}</span>
                  </div>
                </div>
                <button type="button" class="arcade-theme-cycle-pill" id="menuThemeCycleBtn">
                  <span class="theme-dot" style="background: ${currentTheme.badgeColor};"></span>
                  <span>Change</span>
                </button>
              </div>

              <!-- Sound Effects Toggle -->
              <div class="arcade-setting-row">
                <div class="setting-row-left">
                  <span class="setting-row-icon">${Icons.sparkle('set-svg', 19)}</span>
                  <div class="setting-row-text">
                    <strong>Sound Effects</strong>
                    <span>${sound.muted ? 'Muted' : 'Active'}</span>
                  </div>
                </div>
                <button type="button" class="arcade-toggle-pill ${!sound.muted ? 'is-on' : 'is-off'}" id="menuSoundToggleBtn" aria-pressed="${!sound.muted}">
                  ${!sound.muted ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          <!-- Section 3: Player Profile & Switch Player -->
          <div class="arcade-menu-footer">
            <div class="menu-player-badge">
              <img class="menu-player-avatar" src="${this.currentUser.avatar}" alt="${this.currentUser.displayName}">
              <div class="menu-player-meta">
                <span class="menu-player-lbl">Signed in as</span>
                <strong class="menu-player-name">${this.currentUser.displayName}</strong>
              </div>
            </div>
            <button type="button" class="menu-switch-player-btn" id="menuSwitchPlayerBtn">
              Switch Player
            </button>
          </div>

          <button type="button" class="arcade-resume-btn" id="arcadeResumeBtn">
            Resume ${GAME_META[this.activeGame]?.name || 'Game'}
          </button>
        </div>
      </div>
    `;

    this.wireMenuEvents();
  }

  wireMenuEvents() {
    const overlay = this.container?.querySelector('#arcadeMenuOverlay');
    if (!overlay) return;

    const close = () => {
      sound.playPop(0.95);
      this.closeMenu();
    };

    overlay.querySelector('#arcadeMenuCloseBtn')?.addEventListener('click', close);
    overlay.querySelector('#arcadeResumeBtn')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Game switching cards
    overlay.querySelectorAll('.arcade-game-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetGame = card.dataset.game;
        if (targetGame === this.activeGame) {
          close();
        } else {
          this.setActiveGame(targetGame);
        }
      });
    });

    // Walking Step Counter toggle
    overlay.querySelector('#menuStepsToggleBtn')?.addEventListener('click', () => {
      if (!this.stepCounter) return;
      const nowEnabled = this.stepCounter.toggleEnabled();
      sound.playPop(nowEnabled ? 1.15 : 0.9);
      showToast(nowEnabled ? 'Step Counter turned ON' : 'Step Counter hidden', 'info', 1600);
      this.render();
    });

    // Theme Cycle button
    overlay.querySelector('#menuThemeCycleBtn')?.addEventListener('click', () => {
      sound.playPop(1.15);
      const nextTheme = themeManager.cycleTheme(this.activeGame);
      showToast(`Theme: ${nextTheme.name}`, 'info', 1600);
      this.onThemeChange(nextTheme);
      this.render();
    });

    // Sound Toggle button
    overlay.querySelector('#menuSoundToggleBtn')?.addEventListener('click', () => {
      sound.muted = !sound.muted;
      try {
        localStorage.setItem('jueguitos_sound', sound.muted ? 'off' : 'on');
      } catch (e) {}
      if (!sound.muted) {
        sound.initAudio();
        sound.playPop(1.1);
      }
      this.render();
    });

    // Switch Player button
    overlay.querySelector('#menuSwitchPlayerBtn')?.addEventListener('click', () => {
      this.onSaveGames();
      this.closeMenu();
      this.onSwitchPlayer();
    });
  }

  updateUI() {
    if (this.isOpen) {
      this.render();
    }
  }
}
