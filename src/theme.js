/**
 * Studio Theme & Material System for Jueguitos Arcade
 * Gives each of the 4 games its own authentic material identity plus
 * user-selectable custom themes (persisted per game).
 */

export const GAME_THEMES = {
  spider: [
    { id: 'emerald', name: 'Royal Casino Baize', badgeColor: '#0e5a2a' },
    { id: 'mahogany', name: 'Mahogany Parlor', badgeColor: '#5c2415' },
    { id: 'sapphire', name: 'Midnight Velvet', badgeColor: '#172554' }
  ],
  wow: [
    { id: 'aegean', name: 'Aegean Sun & Marble', badgeColor: '#0284c7' },
    { id: 'alpine', name: 'Alpine Pine & Amber', badgeColor: '#065f46' },
    { id: 'sakura', name: 'Kyoto Twilight', badgeColor: '#9d174d' }
  ],
  toyblast: [
    { id: 'playroom', name: 'Sunny Playroom', badgeColor: '#f59e0b' },
    { id: 'carnival', name: 'Starlight Carnival', badgeColor: '#7c3aed' },
    { id: 'candy', name: 'Mint Confection', badgeColor: '#10b981' }
  ],
  matchington: [
    { id: 'manor', name: 'Victorian Manor', badgeColor: '#9a3412' },
    { id: 'botanical', name: 'Sunlit Conservatory', badgeColor: '#15803d' },
    { id: 'parisian', name: 'Parisian Salon', badgeColor: '#831843' }
  ]
};

class ThemeManager {
  constructor() {
    this.activeGame = 'spider';
    this.selectedThemes = this.loadThemes();
  }

  loadThemes() {
    const defaults = {
      spider: 'emerald',
      wow: 'aegean',
      toyblast: 'playroom',
      matchington: 'manor'
    };
    try {
      const saved = localStorage.getItem('jueguitos_themes_v1');
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return defaults;
  }

  saveThemes() {
    try {
      localStorage.setItem('jueguitos_themes_v1', JSON.stringify(this.selectedThemes));
    } catch (e) {}
  }

  getThemeForGame(game) {
    const list = GAME_THEMES[game] || GAME_THEMES.spider;
    const currentId = this.selectedThemes[game] || list[0].id;
    return list.find(t => t.id === currentId) || list[0];
  }

  setGameTheme(game, themeId) {
    const list = GAME_THEMES[game];
    if (!list || !list.some(t => t.id === themeId)) return;
    this.selectedThemes[game] = themeId;
    this.saveThemes();
    this.applyToDOM(game);
  }

  cycleTheme(game) {
    const list = GAME_THEMES[game] || GAME_THEMES.spider;
    const curId = this.selectedThemes[game] || list[0].id;
    const idx = list.findIndex(t => t.id === curId);
    const next = list[(idx + 1) % list.length];
    this.setGameTheme(game, next.id);
    return next;
  }

  applyToDOM(game = this.activeGame) {
    this.activeGame = game;
    const themeObj = this.getThemeForGame(game);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-game', game);
      document.documentElement.setAttribute('data-theme', themeObj.id);
      document.body?.setAttribute('data-game', game);
      document.body?.setAttribute('data-theme', themeObj.id);
    }
    return themeObj;
  }
}

export const themeManager = new ThemeManager();
