/**
 * Jueguitos Arcade Hub & Game Switcher
 * Manages active game views (Spider Solitaire, Words of Wonders, Toy Blast, Matchington)
 * plus a 1-tap Theme Switcher while keeping authentication and step tracking synchronized.
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

export class ArcadeNav {
  constructor(options = {}) {
    this.activeGame = this.loadActiveGame();
    this.onSwitchGame = options.onSwitchGame || (() => {});
    this.onThemeChange = options.onThemeChange || (() => {});
    this.container = options.container;
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

  setActiveGame(game) {
    if (!Object.values(GAMES).includes(game)) return;
    this.activeGame = game;
    try {
      localStorage.setItem('juegitos_active_game', game);
    } catch (e) {}
    themeManager.applyToDOM(this.activeGame);
    this.updateUI();
    this.onSwitchGame(this.activeGame);
  }

  render() {
    if (!this.container) return;

    const currentTheme = themeManager.getThemeForGame(this.activeGame);

    this.container.innerHTML = `
      <nav class="arcade-tab-bar" id="arcadeTabBar" aria-label="Game Selection">
        <button type="button" class="arcade-tab-btn ${this.activeGame === GAMES.SPIDER ? 'active' : ''}" data-game="${GAMES.SPIDER}">
          <span class="tab-icon-wrap">${Icons.cards('tab-icon-svg', 17)}</span>
          <span class="tab-name">Spider</span>
        </button>
        <button type="button" class="arcade-tab-btn ${this.activeGame === GAMES.WOW ? 'active' : ''}" data-game="${GAMES.WOW}">
          <span class="tab-icon-wrap">${Icons.tiles('tab-icon-svg', 17)}</span>
          <span class="tab-name">Words</span>
        </button>
        <button type="button" class="arcade-tab-btn ${this.activeGame === GAMES.TOYBLAST ? 'active' : ''}" data-game="${GAMES.TOYBLAST}">
          <span class="tab-icon-wrap">${Icons.toyBlocks('tab-icon-svg', 17)}</span>
          <span class="tab-name">Toy Blast</span>
        </button>
        <button type="button" class="arcade-tab-btn ${this.activeGame === GAMES.MATCHINGTON ? 'active' : ''}" data-game="${GAMES.MATCHINGTON}">
          <span class="tab-icon-wrap">${Icons.mansion('tab-icon-svg', 17)}</span>
          <span class="tab-name">Mansion</span>
        </button>
      </nav>
      <button type="button" class="arcade-theme-btn" id="arcadeThemeCycleBtn" title="Switch Theme (${currentTheme.name})" aria-label="Switch Theme">
        <span class="theme-dot" style="background: ${currentTheme.badgeColor};"></span>
        ${Icons.palette('theme-icon-svg', 16)}
      </button>
    `;

    this.container.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const game = e.currentTarget.dataset.game;
        if (game !== this.activeGame) {
          this.setActiveGame(game);
        }
      });
    });

    this.container.querySelector('#arcadeThemeCycleBtn')?.addEventListener('click', () => {
      sound.playPop(1.15);
      const nextTheme = themeManager.cycleTheme(this.activeGame);
      this.updateUI();
      showToast(`Theme: ${nextTheme.name}`, 'info', 1800);
      this.onThemeChange(nextTheme);
    });
  }

  updateUI() {
    this.container?.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      const isCurrent = btn.dataset.game === this.activeGame;
      btn.classList.toggle('active', isCurrent);
    });
    const currentTheme = themeManager.getThemeForGame(this.activeGame);
    const themeBtn = this.container?.querySelector('#arcadeThemeCycleBtn');
    const dot = themeBtn?.querySelector('.theme-dot');
    if (themeBtn) themeBtn.title = `Switch Theme (${currentTheme.name})`;
    if (dot) dot.style.background = currentTheme.badgeColor;
  }
}
