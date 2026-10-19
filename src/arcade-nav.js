/**
 * Juegitos Arcade Hub & Game Switcher
 * Manages active game views (Spider Solitaire, Words of Wonders) while keeping
 * authentication and the walking step counter active and synchronized.
 */

export const GAMES = {
  SPIDER: 'spider',
  WOW: 'wow'
};

export class ArcadeNav {
  constructor(options = {}) {
    this.activeGame = this.loadActiveGame();
    this.onSwitchGame = options.onSwitchGame || (() => {});
    this.container = options.container;
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
    this.updateUI();
    this.onSwitchGame(this.activeGame);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <nav class="arcade-tab-bar" id="arcadeTabBar" aria-label="Game Selection">
        <button type="button" class="arcade-tab-btn ${this.activeGame === GAMES.SPIDER ? 'active' : ''}" data-game="${GAMES.SPIDER}">
          <span class="tab-emoji">🕷️</span>
          <span class="tab-name">Spider</span>
        </button>
        <button type="button" class="arcade-tab-btn ${this.activeGame === GAMES.WOW ? 'active' : ''}" data-game="${GAMES.WOW}">
          <span class="tab-emoji">🔤</span>
          <span class="tab-name">Words of Wonder</span>
        </button>
      </nav>
    `;

    this.container.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const game = e.currentTarget.dataset.game;
        if (game !== this.activeGame) {
          this.setActiveGame(game);
        }
      });
    });
  }

  updateUI() {
    this.container?.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.game === this.activeGame);
    });
  }
}
