/**
 * Matchington Mansion UI Controller
 * Dual-Mode Experience:
 * 1. Match-3 Puzzle Board with directional rockets, flying Paper Plane animations, and plush decor tiles
 * 2. Interactive Illustrated SVG Mansion Rooms (The Grand Foyer & Sunny Conservatory) where furniture
 *    visually transforms in the room as Ellen & Susan renovate!
 */

import { playBoardTurn } from '../board-motion.js';
import { Icons } from '../icons.js';
import { sound } from '../sound.js';
import { TILE_TYPES } from './engine.js';
import { MATCHINGTON_LEVELS } from './levels.js';
import { MANSION_ROOMS } from './mansion.js';
import { showToast } from '../toast.js';

export class MatchingtonUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.currentUser = options.currentUser || { displayName: 'Player' };
    this.activeMode = 'puzzle'; // 'puzzle' or 'mansion'
    this.activeRoomId = 'foyer';
    this.selectedCell = null;
    this.pointerStart = null;
    this.busy = false;
    this.destroyed = false;

    this.render();
    setTimeout(() => {
      if (this.destroyed) return;
      if (this.engine.isWon) this.showVictoryModal();
      else if (this.engine.isLost) this.showDefeatModal();
    }, 100);
  }

  destroy() {
    this.destroyed = true;
    document.querySelectorAll('.mm-flying-plane').forEach(el => el.remove());
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="matchington-app mode-${this.activeMode}" id="matchingtonApp">
        <!-- Top Mode Switcher Bar -->
        <div class="mm-mode-bar">
          <button type="button" class="mm-mode-btn ${this.activeMode === 'puzzle' ? 'active' : ''}" id="mmModePuzzle">
            <span class="mm-mode-icon">${Icons.tiles('mode-svg', 18)}</span>
            <span>Match-3 Puzzle</span>
          </button>
          <button type="button" class="mm-mode-btn ${this.activeMode === 'mansion' ? 'active' : ''}" id="mmModeMansion">
            <span class="mm-mode-icon">${Icons.sofa('mode-svg', 18)}</span>
            <span>Renovate Mansion</span>
            <span class="mm-star-pill" id="mmStarBadge">
              ${Icons.key('star-svg', 14)} ${this.engine.starsAvailable}
            </span>
          </button>
        </div>

        <!-- Mode Content Container -->
        <div class="mm-content-wrap" id="mmContentWrap">
          ${this.activeMode === 'puzzle' ? this.renderPuzzleHTML() : this.renderMansionHTML()}
        </div>

        <!-- Modals Layer -->
        <div id="mmModalContainer"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderPuzzleHTML() {
    return `
      <!-- HUD Header -->
      <header class="mm-hud">
        <div class="mm-hud-top">
          <div class="mm-level-badge">
            <span class="lvl-lbl">LEVEL</span>
            <span class="lvl-num">${this.engine.levelIndex + 1}</span>
          </div>

          <!-- Goals Display -->
          <div class="mm-goals-bar" id="mmGoalsBar">
            ${this.renderGoalsHTML()}
          </div>

          <!-- Moves Counter -->
          <div class="mm-moves-badge ${this.engine.movesLeft <= 5 ? 'moves-low' : ''}" id="mmMovesBadge">
            <span class="moves-num" id="mmMovesNum">${this.engine.movesLeft}</span>
            <span class="moves-lbl">MOVES</span>
          </div>
        </div>

        <!-- Score Bar -->
        <div class="mm-score-strip">
          <span class="score-lbl">Score:</span>
          <span class="score-val" id="mmScoreVal">${this.engine.score.toLocaleString()}</span>
        </div>
      </header>

      <div class="play-cue"><strong>${this.engine.currentLevel.name}</strong><span>Swap neighbors to match 3. Tap a booster to use it.</span></div>
      <!-- 8x8 Tile Grid Board -->
      <main class="mm-board-container">
        <div class="mm-grid" id="mmGrid" style="--mm-rows: ${this.engine.currentLevel.rows}; --mm-cols: ${this.engine.currentLevel.cols};">
          ${this.renderGridHTML()}
        </div>
      </main>

      <!-- Bottom Puzzle Controls -->
      <footer class="mm-footer">
        <button type="button" class="mm-ctrl-btn" id="mmUndoBtn">${Icons.undo('btn-svg', 18)}<span>Undo</span></button>
        <button type="button" class="mm-ctrl-btn" id="mmGuideBtn" title="How to Play & Boosters">
          <span class="btn-ico">${Icons.lightbulb('btn-svg', 18)}</span>
          <span>Guide</span>
        </button>
        <button type="button" class="mm-ctrl-btn" id="mmLevelsBtn" title="Choose Level">
          <span class="btn-ico">${Icons.trophy('btn-svg', 18)}</span>
          <span>Levels</span>
        </button>
        <button type="button" class="mm-ctrl-btn" id="mmRestartBtn" title="Restart Level">
          <span class="btn-ico">${Icons.restart('btn-svg', 18)}</span>
          <span>Retry</span>
        </button>
      </footer>
    `;
  }

  /**
   * Renders an illustrated architectural SVG room canvas where furniture dynamically updates!
   */
  renderRoomIllustrationSVG(room) {
    const renos = this.engine.renovations;

    if (room.id === 'foyer') {
      const rugChoice = renos.foyer_rug;
      const rugColor = rugChoice === 'crimson' ? '#b91c1c' : rugChoice === 'indigo' ? '#1e3a8a' : rugChoice === 'emerald' ? '#065f46' : null;

      const chandChoice = renos.foyer_chandelier;
      const chandColor = chandChoice === 'brass' ? '#f59e0b' : chandChoice === 'crystal' ? '#38bdf8' : chandChoice === 'artdeco' ? '#fde047' : null;

      const chairChoice = renos.foyer_armchair;
      const chairColor = chairChoice === 'tufted_ruby' ? '#991b1b' : chairChoice === 'caramel_leather' ? '#b45309' : chairChoice === 'cobalt_damask' ? '#1d4ed8' : null;

      const hearthChoice = renos.foyer_hearth;
      const hearthColor = hearthChoice === 'white_marble' ? '#f8fafc' : hearthChoice === 'river_stone' ? '#78716c' : hearthChoice === 'carved_oak' ? '#5c2415' : null;

      return `
        <svg class="mm-room-canvas-svg" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice">
          <!-- Warm Manor Wallpaper & Wainscoting -->
          <rect x="0" y="0" width="600" height="225" fill="#4a1d1f"/>
          <g stroke="rgba(253, 230, 138, 0.14)" stroke-width="1.5">
            <line x1="75" y1="0" x2="75" y2="175"/><line x1="150" y1="0" x2="150" y2="175"/>
            <line x1="225" y1="0" x2="225" y2="175"/><line x1="300" y1="0" x2="300" y2="175"/>
            <line x1="375" y1="0" x2="375" y2="175"/><line x1="450" y1="0" x2="450" y2="175"/>
            <line x1="525" y1="0" x2="525" y2="175"/>
          </g>
          <!-- Wood Wainscoting Trim -->
          <rect x="0" y="175" width="600" height="50" fill="#2e130c" stroke="#d97706" stroke-width="1.5"/>
          <!-- Parquet Hardwood Perspective Floor -->
          <polygon points="0,225 600,225 600,340 0,340" fill="#5c2d16"/>
          <line x1="0" y1="260" x2="600" y2="260" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>
          <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>

          <!-- Sweeping Grand Staircase (Left) -->
          <polygon points="20,235 190,235 160,95 20,95" fill="#3b190e" stroke="#b45309" stroke-width="2"/>
          <g stroke="#78350f" stroke-width="2">
            <line x1="25" y1="120" x2="165" y2="120"/><line x1="25" y1="145" x2="170" y2="145"/>
            <line x1="25" y1="170" x2="176" y2="170"/><line x1="25" y1="195" x2="182" y2="195"/>
            <line x1="25" y1="220" x2="188" y2="220"/>
          </g>

          <!-- 1. Staircase & Foyer Runner Rug -->
          <g class="svg-furniture-group" data-task="foyer_rug">
            ${rugColor ? `
              <polygon points="45,105 145,105 175,235 35,235" fill="${rugColor}" stroke="#fbbf24" stroke-width="2.5"/>
              <polygon points="110,250 490,250 545,328 55,328" fill="${rugColor}" stroke="#fbbf24" stroke-width="3"/>
              <polygon points="130,260 470,260 515,318 85,318" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="6 4"/>
            ` : `
              <polygon points="130,260 470,260 510,320 90,320" fill="rgba(0,0,0,0.3)" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>
            `}
          </g>

          <!-- 2. Grand Fireplace Hearth (Right-Center) -->
          <g class="svg-furniture-group" data-task="foyer_hearth">
            ${hearthColor ? `
              <rect x="370" y="95" width="175" height="135" rx="4" fill="${hearthColor}" stroke="#d97706" stroke-width="2.5"/>
              <rect x="358" y="85" width="199" height="16" rx="4" fill="${hearthColor}" stroke="#b45309" stroke-width="2"/>
              <path d="M405 230 L405 145 Q457 120 510 145 L510 230 Z" fill="#18181b" stroke="#fbbf24" stroke-width="2"/>
              <!-- Warm Glowing Fire -->
              <path d="M430 225 Q445 170 457 195 Q470 160 485 225 Z" fill="#f97316"/>
              <path d="M442 225 Q457 185 472 225 Z" fill="#fde047"/>
            ` : `
              <rect x="370" y="95" width="175" height="135" rx="4" fill="rgba(30,41,59,0.5)" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>
              <path d="M410 230 L410 150 L505 150 L505 230 Z" fill="#0f172a"/>
            `}
          </g>

          <!-- 3. Lounge Armchair (Center-Left) -->
          <g class="svg-furniture-group" data-task="foyer_armchair">
            ${chairColor ? `
              <rect x="215" y="155" width="105" height="65" rx="18" fill="${chairColor}" stroke="#fde68a" stroke-width="2"/>
              <rect x="200" y="185" width="24" height="45" rx="10" fill="${chairColor}" stroke="#fde68a" stroke-width="1.8"/>
              <rect x="311" y="185" width="24" height="45" rx="10" fill="${chairColor}" stroke="#fde68a" stroke-width="1.8"/>
              <rect x="218" y="205" width="99" height="26" rx="8" fill="${chairColor}" stroke="#fde68a" stroke-width="2"/>
              <line x1="215" y1="231" x2="210" y2="250" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
              <line x1="320" y1="231" x2="325" y2="250" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
            ` : `
              <rect x="205" y="160" width="125" height="80" rx="14" fill="rgba(255,255,255,0.12)" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
            `}
          </g>

          <!-- 4. Crystal Chandelier (Top Center) -->
          <g class="svg-furniture-group" data-task="foyer_chandelier">
            <line x1="300" y1="0" x2="300" y2="32" stroke="#fbbf24" stroke-width="3"/>
            ${chandColor ? `
              <circle cx="300" cy="56" r="46" fill="${chandColor}" opacity="0.18"/>
              <path d="M250 56 Q300 84 350 56" fill="none" stroke="${chandColor}" stroke-width="4"/>
              <path d="M268 42 Q300 66 332 42" fill="none" stroke="#ffffff" stroke-width="2.5"/>
              <circle cx="250" cy="52" r="5" fill="#fef08a"/><circle cx="275" cy="62" r="5" fill="#fef08a"/>
              <circle cx="300" cy="66" r="6" fill="#ffffff"/><circle cx="325" cy="62" r="5" fill="#fef08a"/>
              <circle cx="350" cy="52" r="5" fill="#fef08a"/>
            ` : `
              <circle cx="300" cy="52" r="26" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 4"/>
            `}
          </g>
        </svg>
      `;
    }

    // Room 2: The Sunny Conservatory
    const tableChoice = renos.conservatory_table;
    const tableColor = tableChoice === 'wrought_iron' ? '#f8fafc' : tableChoice === 'teak_wood' ? '#d97706' : tableChoice === 'verdigris' ? '#10b981' : null;

    const planterChoice = renos.conservatory_planters;
    const planterColor = planterChoice === 'boston_ferns' ? '#22c55e' : planterChoice === 'white_orchids' ? '#f472b6' : planterChoice === 'hanging_eucalyptus' ? '#38bdf8' : null;

    const daybedChoice = renos.conservatory_daybed;
    const daybedColor = daybedChoice === 'linen_sand' ? '#f59e0b' : daybedChoice === 'coastal_sage' ? '#16a34a' : daybedChoice === 'sunset_coral' ? '#f97316' : null;

    return `
      <svg class="mm-room-canvas-svg" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice">
        <!-- Sunlit Glasshouse Atrium Sky & Mullions -->
        <rect x="0" y="0" width="600" height="230" fill="#0f4c5c"/>
        <circle cx="480" cy="60" r="45" fill="rgba(253, 224, 71, 0.22)"/>
        <g stroke="rgba(255,255,255,0.28)" stroke-width="2">
          <line x1="120" y1="0" x2="120" y2="230"/><line x1="240" y1="0" x2="240" y2="230"/>
          <line x1="360" y1="0" x2="360" y2="230"/><line x1="480" y1="0" x2="480" y2="230"/>
          <line x1="0" y1="90" x2="600" y2="90"/>
        </g>
        <!-- Terracotta & Limestone Atrium Floor -->
        <polygon points="0,230 600,230 600,340 0,340" fill="#3f6212"/>
        <polygon points="40,240 560,240 590,335 10,335" fill="#b45309" opacity="0.65"/>

        <!-- 1. Hanging Botanical Planters (Top) -->
        <g class="svg-furniture-group" data-task="conservatory_planters">
          ${planterColor ? `
            <line x1="170" y1="0" x2="170" y2="55" stroke="#fde68a" stroke-width="2.5"/>
            <circle cx="170" cy="65" r="26" fill="${planterColor}" stroke="#ffffff" stroke-width="1.5"/>
            <path d="M150 68 Q170 92 190 68 Z" fill="#b45309"/>
            <line x1="420" y1="0" x2="420" y2="55" stroke="#fde68a" stroke-width="2.5"/>
            <circle cx="420" cy="65" r="26" fill="${planterColor}" stroke="#ffffff" stroke-width="1.5"/>
            <path d="M400 68 Q420 92 440 68 Z" fill="#b45309"/>
          ` : `
            <circle cx="170" cy="65" r="22" fill="rgba(255,255,255,0.1)" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="2"/>
            <circle cx="420" cy="65" r="22" fill="rgba(255,255,255,0.1)" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="2"/>
          `}
        </g>

        <!-- 2. Garden Bistro Table & Chairs (Left-Center) -->
        <g class="svg-furniture-group" data-task="conservatory_table">
          ${tableColor ? `
            <ellipse cx="185" cy="235" rx="70" ry="22" fill="${tableColor}" stroke="#78350f" stroke-width="2.5"/>
            <line x1="185" y1="257" x2="185" y2="305" stroke="${tableColor}" stroke-width="5"/>
            <line x1="155" y1="305" x2="215" y2="305" stroke="${tableColor}" stroke-width="4" stroke-linecap="round"/>
          ` : `
            <ellipse cx="185" cy="250" rx="65" ry="28" fill="rgba(255,255,255,0.1)" stroke="#94a3b8" stroke-dasharray="5 4" stroke-width="2"/>
          `}
        </g>

        <!-- 3. Rattan Daybed (Right-Center) -->
        <g class="svg-furniture-group" data-task="conservatory_daybed">
          ${daybedColor ? `
            <rect x="335" y="185" width="205" height="75" rx="18" fill="${daybedColor}" stroke="#fef3c7" stroke-width="2.5"/>
            <rect x="325" y="235" width="225" height="28" rx="8" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
            <circle cx="370" cy="212" r="16" fill="#fef3c7" opacity="0.85"/>
            <circle cx="505" cy="212" r="16" fill="#fef3c7" opacity="0.85"/>
          ` : `
            <rect x="330" y="190" width="210" height="75" rx="14" fill="rgba(255,255,255,0.1)" stroke="#94a3b8" stroke-dasharray="5 4" stroke-width="2"/>
          `}
        </g>
      </svg>
    `;
  }

  renderMansionHTML() {
    const room = MANSION_ROOMS.find(r => r.id === this.activeRoomId) || MANSION_ROOMS[0];

    const PIN_COORDS = {
      foyer_rug: { left: '22%', top: '76%' },
      foyer_chandelier: { left: '50%', top: '20%' },
      foyer_armchair: { left: '44%', top: '54%' },
      foyer_hearth: { left: '76%', top: '48%' },
      conservatory_planters: { left: '32%', top: '22%' },
      conservatory_table: { left: '31%', top: '70%' },
      conservatory_daybed: { left: '72%', top: '65%' }
    };

    return `
      <div class="mansion-view">
        <!-- Room Selector Tabs -->
        <div class="room-nav-strip">
          ${MANSION_ROOMS.map(r => `
            <button type="button" class="room-tab-btn ${r.id === this.activeRoomId ? 'active' : ''}" data-room="${r.id}">
              ${Icons.mansion('room-ico', 16)} ${r.name}
            </button>
          `).join('')}
        </div>

        <!-- Interactive Illustrated Room Scene -->
        <div class="room-scene room-${room.id}">
          <div class="room-canvas-stage">
            ${this.renderRoomIllustrationSVG(room)}

            <!-- Floating Interactive Pins on top of Furniture -->
            ${room.tasks.map(task => {
              const isRenovated = !!this.engine.renovations[task.id];
              const pos = PIN_COORDS[task.id] || { left: '50%', top: '50%' };
              return `
                <button type="button" class="room-floating-pin ${isRenovated ? 'is-done' : 'can-build'}"
                        data-task="${task.id}" style="left: ${pos.left}; top: ${pos.top};" title="${task.name}">
                  ${isRenovated ? Icons.paintBrush('pin-svg', 16) : Icons.key('pin-svg', 16)}
                </button>
              `;
            }).join('')}
          </div>

          <div class="room-header-overlay">
            <h2>${room.name}</h2>
            <p>${room.description}</p>
          </div>

          <!-- Compact Designer Furniture Strip -->
          <div class="room-hotspots">
            ${room.tasks.map(task => {
              const currentChoiceId = this.engine.renovations[task.id];
              const isRenovated = !!currentChoiceId;
              const choice = isRenovated ? task.choices.find(c => c.id === currentChoiceId) : null;

              return `
                <div class="furniture-spot spot-${task.id} ${isRenovated ? 'renovated' : 'pending'}" data-task="${task.id}">
                  <button type="button" class="spot-pin ${isRenovated ? 'is-done' : 'can-build'}" title="${task.name}">
                    <span class="pin-icon">${isRenovated ? Icons.paintBrush('pin-svg', 16) : Icons.key('pin-svg', 16)}</span>
                  </button>
                  <div class="spot-label">
                    <span class="spot-title">${task.name}</span>
                    <span class="spot-choice">${isRenovated ? `${choice?.name} (Tap to Restyle Free)` : '1 Star to Renovate'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Back to Puzzle CTA -->
        <div class="mansion-footer-cta">
          <button type="button" class="mansion-play-btn" id="mansionPlayBtn">
            ${Icons.tiles('btn-svg', 20)} Play Levels for More Stars
          </button>
        </div>
      </div>
    `;
  }

  renderGoalsHTML() {
    const goals = this.engine.goals;
    const parts = [];

    if (goals.items) {
      for (const [item, count] of Object.entries(goals.items)) {
        const isDone = count <= 0;
        parts.push(`
          <div class="mm-goal-chip ${isDone ? 'done' : ''}" data-item="${item}">
            <span class="goal-item-icon">${this.getItemIcon(item, 18)}</span>
            <span class="goal-count">${isDone ? Icons.check('goal-check', 14) : count}</span>
          </div>
        `);
      }
    }

    if (goals.ice !== undefined && this.engine.currentLevel.goals.ice) {
      const isDone = goals.ice <= 0;
      parts.push(`
        <div class="mm-goal-chip ${isDone ? 'done' : ''}" data-type="ice">
          <span class="goal-item-icon">${Icons.bubble('goal-svg', 18)}</span>
          <span class="goal-count">${isDone ? Icons.check('goal-check', 14) : goals.ice}</span>
        </div>
      `);
    }

    if (goals.wood !== undefined && this.engine.currentLevel.goals.wood) {
      const isDone = goals.wood <= 0;
      parts.push(`
        <div class="mm-goal-chip ${isDone ? 'done' : ''}" data-type="wood">
          <span class="goal-item-icon">${Icons.crate('goal-svg', 18)}</span>
          <span class="goal-count">${isDone ? Icons.check('goal-check', 14) : goals.wood}</span>
        </div>
      `);
    }

    return parts.join('');
  }

  getItemIcon(item, size = 22) {
    switch (item) {
      case 'pillow': return Icons.pillow('item-svg', size);
      case 'teacup': return Icons.teacup('item-svg', size);
      case 'lamp': return Icons.lamp('item-svg', size);
      case 'book': return Icons.book('item-svg', size);
      case 'gem': return Icons.gem('item-svg', size);
      case 'plant': return Icons.plant('item-svg', size);
      default: return Icons.tiles('item-svg', size);
    }
  }

  renderGridHTML() {
    const rows = this.engine.currentLevel.rows;
    const cols = this.engine.currentLevel.cols;
    let html = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = this.engine.grid[r][c];
        const floor = this.engine.floorGrid[r][c];
        const isSelected = this.selectedCell && this.selectedCell.r === r && this.selectedCell.c === c;

        let cellClass = `mm-cell type-${tile?.type || 'empty'} ${isSelected ? 'selected' : ''}`;
        if (floor === 'ice') cellClass += ' has-ice';

        let content = '';
        if (tile?.type === TILE_TYPES.ITEM) {
          cellClass += ` item-${tile.color}`;
          content = `<span class="tile-icon">${this.getItemIcon(tile.color, 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.ROCKET_H) {
          cellClass += ' mm-booster rocket-h';
          content = `<span class="booster-ico" title="Horizontal Rocket">${Icons.rotorH('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.ROCKET_V) {
          cellClass += ' mm-booster rocket-v';
          content = `<span class="booster-ico" title="Vertical Rocket">${Icons.rotorV('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.PAPER_PLANE) {
          cellClass += ' mm-booster paper-plane';
          content = `<span class="booster-ico" title="Homing Paper Plane">${Icons.paperPlane('b-svg', 24)}</span>`;
        } else if (tile?.type === TILE_TYPES.BOMB) {
          cellClass += ' mm-booster bomb';
          content = `<span class="booster-ico" title="Bomb (3x3 Blast)">${Icons.bomb('b-svg', 25)}</span>`;
        } else if (tile?.type === TILE_TYPES.RAINBOW) {
          cellClass += ' mm-booster rainbow';
          content = `<span class="booster-ico" title="Rainbow Ball">${Icons.discoBall('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.WOOD) {
          cellClass += ' mm-obstacle wood';
          content = `<span class="obs-ico" title="Parquet Wood">${Icons.crate('b-svg', 26)}</span>`;
        }

        html += `
          <div class="${cellClass}" data-r="${r}" data-c="${c}">
            ${content}
          </div>
        `;
      }
    }
    return html;
  }

  attachEventListeners() {
    this.container.querySelector('#mmModePuzzle')?.addEventListener('click', () => {
      if (this.busy) return;
      this.activeMode = 'puzzle';
      this.render();
    });
    this.container.querySelector('#mmModeMansion')?.addEventListener('click', () => {
      if (this.busy) return;
      this.activeMode = 'mansion';
      this.render();
    });

    if (this.activeMode === 'puzzle') {
      this.attachPuzzleEvents();
    } else {
      this.attachMansionEvents();
    }
  }

  attachPuzzleEvents() {
    const grid = this.container.querySelector('#mmGrid');
    if (!grid) return;

    grid.addEventListener('pointerdown', (e) => {
      if (this.busy) return;
      const cellEl = e.target.closest('.mm-cell');
      if (!cellEl) return;
      const r = parseInt(cellEl.dataset.r, 10);
      const c = parseInt(cellEl.dataset.c, 10);
      this.pointerStart = { r, c, x: e.clientX, y: e.clientY };
      grid.setPointerCapture(e.pointerId);
    });

    const resetDrag = () => grid.querySelectorAll('.mm-cell').forEach(el => { el.style.transform = ''; el.style.zIndex = ''; });
    grid.addEventListener('pointermove', e => {
      if (!this.pointerStart || this.busy) return;
      const { r, c, x, y } = this.pointerStart;
      const el = grid.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      const size = el?.getBoundingClientRect().width || 40;
      const dx = e.clientX - x, dy = e.clientY - y;
      resetDrag();
      if (el) { el.style.transform = Math.abs(dx) > Math.abs(dy) ? `translateX(${Math.max(-size, Math.min(size, dx))}px)` : `translateY(${Math.max(-size, Math.min(size, dy))}px)`; el.style.zIndex = '5'; }
    });
    grid.addEventListener('pointercancel', () => { resetDrag(); this.pointerStart = null; });
    grid.addEventListener('pointerup', (e) => {
      resetDrag();
      if (!this.pointerStart) return;
      const dx = e.clientX - this.pointerStart.x;
      const dy = e.clientY - this.pointerStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 22) {
        let targetR = this.pointerStart.r;
        let targetC = this.pointerStart.c;

        if (Math.abs(dx) > Math.abs(dy)) {
          targetC += dx > 0 ? 1 : -1;
        } else {
          targetR += dy > 0 ? 1 : -1;
        }

        this.executeSwap(this.pointerStart.r, this.pointerStart.c, targetR, targetC);
        this.selectedCell = null;
      } else {
        const cellEl = grid.querySelector(`[data-r="${this.pointerStart.r}"][data-c="${this.pointerStart.c}"]`);
        if (cellEl) {
          const endR = parseInt(cellEl.dataset.r, 10);
          const endC = parseInt(cellEl.dataset.c, 10);
          this.handleCellTap(endR, endC);
        }
      }

      this.pointerStart = null;
    });

    this.container.querySelector('#mmUndoBtn')?.addEventListener('click', () => {
      if (this.busy) return;
      if (!this.engine.undoTurn?.()) { showToast('No turn to undo yet.', 'info', 1400); return; }
      this.selectedCell = null;
      this.updatePuzzleUI();
    });
    this.container.querySelector('#mmGuideBtn')?.addEventListener('click', () => {
      this.showGuideModal();
    });

    this.container.querySelector('#mmLevelsBtn')?.addEventListener('click', () => {
      if (this.busy) return;
      this.showLevelSelectModal();
    });

    this.container.querySelector('#mmRestartBtn')?.addEventListener('click', () => {
      if (this.busy) return;
      sound.playPop(1);
      this.engine.restartLevel();
      this.selectedCell = null;
      this.updatePuzzleUI();
      showToast('Level restarted', 'info', 1600);
    });
  }

  animatePaperPlaneFlight(fromR, fromC, toR, toC) {
    const grid = this.container.querySelector('#mmGrid');
    const startEl = grid?.querySelector(`[data-r="${fromR}"][data-c="${fromC}"]`);
    const endEl = grid?.querySelector(`[data-r="${toR}"][data-c="${toC}"]`);
    if (!startEl || !endEl) return;

    const sRect = startEl.getBoundingClientRect();
    const eRect = endEl.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'mm-flying-plane';
    flyer.innerHTML = Icons.paperPlane('plane-fly-svg', 28);
    flyer.style.left = `${sRect.left + sRect.width / 2 - 14}px`;
    flyer.style.top = `${sRect.top + sRect.height / 2 - 14}px`;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      flyer.style.transform = `translate(${eRect.left - sRect.left}px, ${eRect.top - sRect.top}px) scale(1.25)`;
    });

    setTimeout(() => flyer.remove(), 420);
  }

  async handleCellTap(r, c) {
    if (this.busy) return;
    const tile = this.engine.grid[r]?.[c];
    if (!tile || tile.type === TILE_TYPES.EMPTY || tile.type === TILE_TYPES.WOOD) {
      this.selectedCell = null;
      this.updatePuzzleUI();
      return;
    }

    if (!this.selectedCell && this.engine.isBooster(tile)) {
      this.busy = true;
      const res = this.engine.activateBooster(r, c);
      sound.playRocket();
      await playBoardTurn(this, '#mmGrid', () => this.renderGridHTML());
      if (this.destroyed) return;
      this.updatePuzzleUI();
      this.busy = false;
      this.checkGameStatus();
      return;
    }
    if (!this.selectedCell) {
      sound.playPop(1.1);
      this.selectedCell = { r, c };
      this.updatePuzzleUI();
    } else {
      const r1 = this.selectedCell.r;
      const c1 = this.selectedCell.c;

      if (r1 === r && c1 === c) {
        if (this.engine.isBooster(tile)) {
          sound.playBlast();
          const res = this.engine.activateBooster(r, c);
          if (res.boosterType === TILE_TYPES.PAPER_PLANE && res.planeTarget) {
            this.animatePaperPlaneFlight(r, c, res.planeTarget.r, res.planeTarget.c);
          }
          this.selectedCell = null;
          this.updatePuzzleUI();
          if (res.autoShuffled) {
            showToast('No swaps left - Auto-shuffling tiles!', 'shuffle', 2200);
          }
          this.checkGameStatus();
          return;
        }
        this.selectedCell = null;
        this.updatePuzzleUI();
        return;
      }

      const dist = Math.abs(r1 - r) + Math.abs(c1 - c);
      if (dist === 1) {
        this.executeSwap(r1, c1, r, c);
      } else {
        sound.playPop(1.1);
        this.selectedCell = { r, c };
        this.updatePuzzleUI();
      }
    }
  }

  async executeSwap(r1, c1, r2, c2) {
    if (this.busy) return;
    if (r2 < 0 || r2 >= this.engine.currentLevel.rows || c2 < 0 || c2 >= this.engine.currentLevel.cols) {
      return;
    }

    this.busy = true;
    const res = this.engine.swapTiles(r1, c1, r2, c2);

    if (res.status === 'invalid_swap') {
      sound.playCardSlide();
      const grid = this.container.querySelector('#mmGrid');
      const c1El = grid?.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
      const c2El = grid?.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
      c1El?.classList.add('shake');
      c2El?.classList.add('shake');
      setTimeout(() => {
        c1El?.classList.remove('shake');
        c2El?.classList.remove('shake');
      }, 300);
    } else if (res.status === 'swap_success' || res.status === 'combo_activated' || res.status === 'rainbow_activated' || res.status === 'booster_detonated') {
      sound.playSwap();
      if (res.createdBooster || res.status === 'combo_activated' || res.status === 'rainbow_activated' || res.status === 'booster_detonated') {
        sound.playChime();
      } else {
        sound.playPop(1.2);
      }
      this.selectedCell = null;
      await playBoardTurn(this, '#mmGrid', () => this.renderGridHTML());
      if (this.destroyed) return;
      this.updatePuzzleUI();
      if (res.autoShuffled) {
        showToast('No swaps left - Auto-shuffling tiles!', 'shuffle', 2200);
      }
      this.checkGameStatus();
    }
    this.busy = false;
  }

  checkGameStatus() {
    if (this.engine.isWon) {
      setTimeout(() => { if (!this.destroyed) this.showVictoryModal(); }, 550);
    } else if (this.engine.isLost) {
      setTimeout(() => { if (!this.destroyed) this.showDefeatModal(); }, 550);
    }
  }

  updatePuzzleUI() {
    const level = this.container.querySelector('.mm-level-badge .lvl-num');
    if (level) level.textContent = this.engine.levelIndex + 1;
    const cue = this.container.querySelector('.play-cue strong');
    if (cue) cue.textContent = this.engine.currentLevel.name;
    const grid = this.container.querySelector('#mmGrid');
    if (grid) grid.innerHTML = this.renderGridHTML();

    const goalsEl = this.container.querySelector('#mmGoalsBar');
    if (goalsEl) goalsEl.innerHTML = this.renderGoalsHTML();

    const movesEl = this.container.querySelector('#mmMovesNum');
    const movesBox = this.container.querySelector('#mmMovesBadge');
    if (movesEl) movesEl.textContent = this.engine.movesLeft;
    if (movesBox) movesBox.classList.toggle('moves-low', this.engine.movesLeft <= 5);

    const scoreEl = this.container.querySelector('#mmScoreVal');
    if (scoreEl) scoreEl.textContent = this.engine.score.toLocaleString();

    const starBadge = this.container.querySelector('#mmStarBadge');
    if (starBadge) {
      starBadge.innerHTML = `${Icons.key('star-svg', 14)} ${this.engine.starsAvailable}`;
    }
  }

  attachMansionEvents() {
    this.container.querySelectorAll('.room-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeRoomId = btn.dataset.room;
        this.render();
      });
    });

    const openTaskModal = (taskId) => {
      if (taskId) this.showRenovationModal(taskId);
    };

    this.container.querySelectorAll('.furniture-spot, .room-floating-pin, .svg-furniture-group').forEach(el => {
      el.addEventListener('click', () => {
        openTaskModal(el.dataset.task);
      });
    });

    this.container.querySelector('#mansionPlayBtn')?.addEventListener('click', () => {
      this.activeMode = 'puzzle';
      this.render();
    });
  }

  showRenovationModal(taskId) {
    sound.playPop(1.1);
    const room = MANSION_ROOMS.find(r => r.id === this.activeRoomId);
    const task = room?.tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentChoiceId = this.engine.renovations[taskId];
    const isAlreadyUnlocked = !!currentChoiceId;

    const modal = document.createElement('div');
    modal.className = 'mm-modal-overlay';
    modal.innerHTML = `
      <div class="mm-modal-card reno-modal">
        <div class="mm-modal-header">
          <h2>${task.name}</h2>
          <p>${isAlreadyUnlocked ? 'Unlocked! Switch between designer styles for free' : 'Choose your custom interior style (1 Star)'}</p>
        </div>

        <div class="reno-choices-list">
          ${task.choices.map(choice => {
            const isSelected = choice.id === currentChoiceId;
            return `
              <div class="reno-choice-card ${isSelected ? 'selected' : ''}" data-choice="${choice.id}">
                <div class="choice-swatch" style="background: ${choice.color};"></div>
                <div class="choice-details">
                  <strong>${choice.name}</strong>
                  <p>${choice.desc}</p>
                </div>
                <button type="button" class="choice-select-btn" data-choice="${choice.id}">
                  ${isSelected ? Icons.check('check-svg', 15) + ' Active' : (isAlreadyUnlocked ? 'Apply' : 'Choose')}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div class="reno-stars-status">
          ${Icons.key('star-svg', 16)} Stars Available: <strong>${this.engine.starsAvailable}</strong>
        </div>

        <div class="mm-modal-actions">
          <button type="button" class="mm-modal-btn secondary" id="mmCloseRenoBtn">
            Back to Room
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    modal.querySelectorAll('.choice-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choiceId = btn.dataset.choice;
        if (choiceId === currentChoiceId) {
          modal.remove();
          return;
        }

        const res = this.engine.renovateRoomTask(taskId, choiceId);
        if (!res.success) {
          showToast('Need 1 Renovation Star! Win a Match-3 level to earn Stars.', 'warning', 2500);
          return;
        }

        sound.playRenovate();
        modal.remove();
        this.render();
        const chosenObj = task.choices.find(c => c.id === choiceId);
        showToast(`Installed ${chosenObj?.name || 'new style'}!`, 'success', 2000);
      });
    });

    modal.querySelector('#mmCloseRenoBtn')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  showVictoryModal() {
    sound.playStepGoalMet();
    const modal = document.createElement('div');
    modal.className = 'mm-modal-overlay';
    modal.innerHTML = `
      <div class="mm-modal-card victory">
        <div class="mm-modal-header">
          <div class="mm-vic-trophy">${Icons.trophy('vic-svg', 48)}</div>
          <h2>ROOM SUPPLIES WON!</h2>
          <p>${this.engine.currentLevel.name}</p>
        </div>

        <div class="mm-vic-rewards">
          <div class="reward-pill star">
            <span class="r-ico">${Icons.key('r-svg', 22)}</span>
            <span class="r-val">+1 Renovation Star</span>
          </div>
          <div class="reward-pill coins">
            <span class="r-ico">${Icons.coin('r-svg', 20)}</span>
            <span class="r-val">+${this.engine.stars * 20} Coins</span>
          </div>
        </div>

        <div class="mm-modal-actions">
          <button type="button" class="mm-modal-btn primary" id="mmVicRenoBtn">
            ${Icons.sofa('btn-svg', 18)} Renovate Mansion Now
          </button>
          <button type="button" class="mm-modal-btn secondary" id="mmVicNextBtn">
            Next Level
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    modal.querySelector('#mmVicRenoBtn')?.addEventListener('click', () => {
      modal.remove();
      this.activeMode = 'mansion';
      this.render();
    });

    modal.querySelector('#mmVicNextBtn')?.addEventListener('click', () => {
      modal.remove();
      if (this.engine.levelIndex < MATCHINGTON_LEVELS.length - 1) {
        this.engine.nextLevel();
      } else {
        this.engine.restartLevel();
      }
      this.updatePuzzleUI();
    });
  }

  showDefeatModal() {
    sound.playBlast();
    const modal = document.createElement('div');
    modal.className = 'mm-modal-overlay';
    modal.innerHTML = `
      <div class="mm-modal-card defeat">
        <div class="mm-modal-header">
          <h2>A few more moves?</h2>
          <p>Form 2x2 squares for homing Paper Planes and 4-in-a-row for Rockets!</p>
        </div>

        <div class="mm-modal-actions">
          <button type="button" class="mm-modal-btn primary" id="mmRetryBtn">
            Try Again
          </button>
          <button type="button" class="mm-modal-btn secondary" id="mmCloseDefeatBtn">
            Keep playing (+5 free moves)
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    modal.querySelector('#mmRetryBtn')?.addEventListener('click', () => {
      modal.remove();
      this.engine.restartLevel();
      this.updatePuzzleUI();
    });

    modal.querySelector('#mmCloseDefeatBtn')?.addEventListener('click', () => {
      this.engine.isLost = false;
      this.engine.movesLeft += 5;
      this.engine.saveSession?.();
      this.updatePuzzleUI();
      modal.remove();
    });
  }

  showLevelSelectModal() {
    sound.playPop(1);
    const modal = document.createElement('div');
    modal.className = 'mm-modal-overlay';
    modal.innerHTML = `
      <div class="mm-modal-card levels-modal">
        <div class="mm-modal-header">
          <h2>Matchington Levels</h2>
          <p>Choose any puzzle level</p>
        </div>

        <div class="tb-levels-grid">
          ${MATCHINGTON_LEVELS.map((lvl, idx) => {
            const isCurrent = idx === this.engine.levelIndex;
            const stars = this.engine.levelStars[idx] || 0;

            return `
              <button type="button" class="tb-lvl-card unlocked ${isCurrent ? 'active' : ''}" data-idx="${idx}">
                <span class="lvl-num">${idx + 1}</span>
                <span class="lvl-name">${lvl.name}</span>
                <div class="lvl-stars">
                  <span class="${stars >= 1 ? 'lit' : ''}">${Icons.star('star-xs', 12)}</span>
                  <span class="${stars >= 2 ? 'lit' : ''}">${Icons.star('star-xs', 12)}</span>
                  <span class="${stars >= 3 ? 'lit' : ''}">${Icons.star('star-xs', 12)}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <div class="mm-modal-actions">
          <button type="button" class="mm-modal-btn secondary" id="mmCloseLevelsBtn">
            Close
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    modal.querySelectorAll('.tb-lvl-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        modal.remove();
        this.engine.initLevel(idx);
        this.updatePuzzleUI();
      });
    });

    modal.querySelector('#mmCloseLevelsBtn')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  showGuideModal() {
    sound.playPop(1);
    const modal = document.createElement('div');
    modal.className = 'mm-modal-overlay';
    modal.innerHTML = `
      <div class="mm-modal-card guide-modal">
        <div class="mm-modal-header">
          <h2>Matchington Guide</h2>
          <p>Match-3 Boosters & Room Design</p>
        </div>

        <div class="tb-guide-scroll">
          <div class="guide-section">
            <h3>Special Power-Ups</h3>
            <div class="guide-item">
              <span class="g-icon">${Icons.rotorH('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Rocket (Match 4 in a line)</strong>
                <p>Clears an entire horizontal row or vertical column.</p>
              </div>
            </div>
            <div class="guide-item">
              <span class="g-icon">${Icons.paperPlane('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Paper Plane (Match 4 in a 2x2 square)</strong>
                <p>Clears adjacent tiles on takeoff and flies directly to an ice or wood objective!</p>
              </div>
            </div>
            <div class="guide-item">
              <span class="g-icon">${Icons.bomb('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Bomb (Match 5 in T or L shape)</strong>
                <p>Detonates a 3x3 blast clearing all adjacent tiles.</p>
              </div>
            </div>
            <div class="guide-item">
              <span class="g-icon">${Icons.discoBall('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Rainbow Ball (Match 5 in a straight line)</strong>
                <p>Swap with any item or booster to transform and clear the board!</p>
              </div>
            </div>
          </div>

          <div class="guide-section">
            <h3>Mansion Renovation</h3>
            <p>Every level won grants 1 Renovation Star ${Icons.key('inline-key', 15)}. Tap <strong>Renovate Mansion</strong> to customize the illustrated room with 3 designer styles per furniture piece!</p>
          </div>
        </div>

        <div class="mm-modal-actions">
          <button type="button" class="mm-modal-btn primary" id="mmCloseGuideBtn">
            Got It!
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    modal.querySelector('#mmCloseGuideBtn')?.addEventListener('click', () => {
      modal.remove();
    });
  }
}
