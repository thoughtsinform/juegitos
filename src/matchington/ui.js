/**
 * Matchington Mansion UI Controller
 * Dual-Mode Experience:
 * 1. Match-3 Puzzle Game (Tile Swapping, Cascades, Boosters, Ice & Wood obstacles)
 * 2. Mansion Room Renovation (Grand Foyer, Sunny Conservatory with 3-choice furniture customization)
 */

import { Icons } from '../icons.js';
import { sound } from '../sound.js';
import { TILE_TYPES } from './engine.js';
import { MATCHINGTON_LEVELS } from './levels.js';
import { MANSION_ROOMS } from './mansion.js';

export class MatchingtonUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.currentUser = options.currentUser || { displayName: 'Player' };
    this.activeMode = 'puzzle'; // 'puzzle' or 'mansion'
    this.activeRoomId = 'foyer';
    this.selectedCell = null; // { r, c }
    this.pointerStart = null; // for drag swipe

    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="matchington-app" id="matchingtonApp">
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

      <!-- 8x8 Tile Grid Board -->
      <main class="mm-board-container">
        <div class="mm-grid" id="mmGrid" style="--mm-rows: ${this.engine.currentLevel.rows}; --mm-cols: ${this.engine.currentLevel.cols};">
          ${this.renderGridHTML()}
        </div>
      </main>

      <!-- Bottom Puzzle Controls -->
      <footer class="mm-footer">
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

  renderMansionHTML() {
    const room = MANSION_ROOMS.find(r => r.id === this.activeRoomId) || MANSION_ROOMS[0];

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

        <!-- Room Scene -->
        <div class="room-scene room-${room.id}">
          <div class="room-header-overlay">
            <h2>${room.name}</h2>
            <p>${room.description}</p>
          </div>

          <!-- Interactive Hotspot Pins -->
          <div class="room-hotspots">
            ${room.tasks.map(task => {
              const currentChoiceId = this.engine.renovations[task.id];
              const isRenovated = !!currentChoiceId;
              const choice = isRenovated ? task.choices.find(c => c.id === currentChoiceId) : null;

              return `
                <div class="furniture-spot spot-${task.id} ${isRenovated ? 'renovated' : 'pending'}" data-task="${task.id}">
                  <button type="button" class="spot-pin ${isRenovated ? 'is-done' : 'can-build'}" title="${task.name}">
                    <span class="pin-icon">${isRenovated ? Icons.paintBrush('pin-svg', 18) : Icons.key('pin-svg', 18)}</span>
                  </button>
                  <div class="spot-label">
                    <span class="spot-title">${task.name}</span>
                    <span class="spot-choice">${isRenovated ? choice?.name : '1 Star to Renovate'}</span>
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

    // Items
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

    // Ice
    if (goals.ice !== undefined && this.engine.currentLevel.goals.ice) {
      const isDone = goals.ice <= 0;
      parts.push(`
        <div class="mm-goal-chip ${isDone ? 'done' : ''}" data-type="ice">
          <span class="goal-item-icon">${Icons.bubble('goal-svg', 18)}</span>
          <span class="goal-count">${isDone ? Icons.check('goal-check', 14) : goals.ice}</span>
        </div>
      `);
    }

    // Wood
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

  getItemIcon(item, size = 20) {
    switch (item) {
      case 'pillow': return Icons.pillow('item-svg', size);
      case 'teacup': return Icons.teacup('item-svg', size);
      case 'lamp': return Icons.lamp('item-svg', size);
      case 'book': return Icons.book('item-svg', size);
      case 'gem': return Icons.gem('item-svg', size);
      case 'plant': return Icons.sofa('item-svg', size);
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
          content = `<span class="tile-icon">${this.getItemIcon(tile.color, 24)}</span>`;
        } else if (tile?.type === TILE_TYPES.ROCKET_H) {
          cellClass += ' mm-booster rocket-h';
          content = `<span class="booster-ico">${Icons.rocket('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.ROCKET_V) {
          cellClass += ' mm-booster rocket-v';
          content = `<span class="booster-ico">${Icons.rocket('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.PAPER_PLANE) {
          cellClass += ' mm-booster paper-plane';
          content = `<span class="booster-ico">${Icons.paperPlane('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.BOMB) {
          cellClass += ' mm-booster bomb';
          content = `<span class="booster-ico">${Icons.bomb('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.RAINBOW) {
          cellClass += ' mm-booster rainbow';
          content = `<span class="booster-ico">${Icons.discoBall('b-svg', 26)}</span>`;
        } else if (tile?.type === TILE_TYPES.WOOD) {
          cellClass += ' mm-obstacle wood';
          content = `<span class="obs-ico">${Icons.crate('b-svg', 28)}</span>`;
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
    // Mode toggles
    this.container.querySelector('#mmModePuzzle')?.addEventListener('click', () => {
      this.activeMode = 'puzzle';
      this.render();
    });
    this.container.querySelector('#mmModeMansion')?.addEventListener('click', () => {
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

    // Tap or Swipe Selection
    grid.addEventListener('pointerdown', (e) => {
      const cellEl = e.target.closest('.mm-cell');
      if (!cellEl) return;
      const r = parseInt(cellEl.dataset.r, 10);
      const c = parseInt(cellEl.dataset.c, 10);
      this.pointerStart = { r, c, x: e.clientX, y: e.clientY };
    });

    grid.addEventListener('pointerup', (e) => {
      if (!this.pointerStart) return;
      const cellEl = e.target.closest('.mm-cell');
      if (!cellEl) {
        this.pointerStart = null;
        return;
      }

      const endR = parseInt(cellEl.dataset.r, 10);
      const endC = parseInt(cellEl.dataset.c, 10);

      const dx = e.clientX - this.pointerStart.x;
      const dy = e.clientY - this.pointerStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if drag gesture occurred
      if (dist > 25) {
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
        // Simple tap selection
        this.handleCellTap(endR, endC);
      }

      this.pointerStart = null;
    });

    this.container.querySelector('#mmGuideBtn')?.addEventListener('click', () => {
      this.showGuideModal();
    });

    this.container.querySelector('#mmLevelsBtn')?.addEventListener('click', () => {
      this.showLevelSelectModal();
    });

    this.container.querySelector('#mmRestartBtn')?.addEventListener('click', () => {
      sound.playPop(1);
      this.engine.restartLevel();
      this.selectedCell = null;
      this.updatePuzzleUI();
    });
  }

  handleCellTap(r, c) {
    const tile = this.engine.grid[r][c];
    if (!tile || tile.type === TILE_TYPES.EMPTY || tile.type === TILE_TYPES.WOOD) {
      this.selectedCell = null;
      this.updatePuzzleUI();
      return;
    }

    if (!this.selectedCell) {
      // First tile selected
      sound.playPop(1.1);
      this.selectedCell = { r, c };
      this.updatePuzzleUI();
    } else {
      // Second tile selected -> Check swap!
      const r1 = this.selectedCell.r;
      const c1 = this.selectedCell.c;

      if (r1 === r && c1 === c) {
        // Tapped same tile: activate if booster!
        if (this.engine.isBooster(tile)) {
          sound.playBlast();
          this.engine.activateBooster(r, c);
          this.selectedCell = null;
          this.updatePuzzleUI();
          this.checkGameStatus();
          return;
        }
        this.selectedCell = null;
        this.updatePuzzleUI();
        return;
      }

      // Orthogonal check
      const dist = Math.abs(r1 - r) + Math.abs(c1 - c);
      if (dist === 1) {
        this.executeSwap(r1, c1, r, c);
      } else {
        // Tapped a non-adjacent tile, re-select
        sound.playPop(1.1);
        this.selectedCell = { r, c };
        this.updatePuzzleUI();
      }
    }
  }

  executeSwap(r1, c1, r2, c2) {
    if (r2 < 0 || r2 >= this.engine.currentLevel.rows || c2 < 0 || c2 >= this.engine.currentLevel.cols) {
      return;
    }

    const res = this.engine.swapTiles(r1, c1, r2, c2);

    if (res.status === 'invalid_swap') {
      sound.playCardSlide();
      // Bounce animation
      const grid = this.container.querySelector('#mmGrid');
      const c1El = grid?.querySelector(`[data-r="${r1}"][data-c="${c1}"]`);
      const c2El = grid?.querySelector(`[data-r="${r2}"][data-c="${c2}"]`);
      c1El?.classList.add('shake');
      c2El?.classList.add('shake');
      setTimeout(() => {
        c1El?.classList.remove('shake');
        c2El?.classList.remove('shake');
      }, 300);
    } else if (res.status === 'swap_success' || res.status === 'combo_activated' || res.status === 'rainbow_activated') {
      sound.playSwap();
      if (res.createdBooster) {
        sound.playChime();
      } else {
        sound.playPop(1.2);
      }
      this.selectedCell = null;
      this.updatePuzzleUI();
      this.checkGameStatus();
    }
  }

  checkGameStatus() {
    if (this.engine.isWon) {
      setTimeout(() => this.showVictoryModal(), 600);
    } else if (this.engine.isLost) {
      setTimeout(() => this.showDefeatModal(), 600);
    }
  }

  updatePuzzleUI() {
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
    // Room tab switching
    this.container.querySelectorAll('.room-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeRoomId = btn.dataset.room;
        this.render();
      });
    });

    // Hotspot click
    this.container.querySelectorAll('.furniture-spot').forEach(spot => {
      spot.addEventListener('click', () => {
        const taskId = spot.dataset.task;
        this.showRenovationModal(taskId);
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

    const modal = document.createElement('div');
    modal.className = 'mm-modal-overlay';
    modal.innerHTML = `
      <div class="mm-modal-card reno-modal">
        <div class="mm-modal-header">
          <h2>${task.name}</h2>
          <p>Choose your custom interior style (1 Star)</p>
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
                  ${isSelected ? Icons.check('check-svg', 16) + ' Selected' : 'Choose'}
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

        if (this.engine.starsAvailable < 1) {
          alert("You need at least 1 star to renovate! Play match-3 levels to earn stars.");
          return;
        }

        sound.playRenovate();
        this.engine.renovateRoomTask(taskId, choiceId);
        modal.remove();
        this.render();
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
            <span class="r-ico">${Icons.key('r-svg', 24)}</span>
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
          <h2>OUT OF MOVES!</h2>
          <p>Create Paper Planes and Rockets to clear obstacles faster!</p>
        </div>

        <div class="mm-modal-actions">
          <button type="button" class="mm-modal-btn primary" id="mmRetryBtn">
            Try Again
          </button>
          <button type="button" class="mm-modal-btn secondary" id="mmCloseDefeatBtn">
            Close
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
          <p>Choose an unlocked puzzle level</p>
        </div>

        <div class="tb-levels-grid">
          ${MATCHINGTON_LEVELS.map((lvl, idx) => {
            const isUnlocked = idx <= this.engine.highestLevelUnlocked;
            const isCurrent = idx === this.engine.levelIndex;

            return `
              <button type="button" class="tb-lvl-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'active' : ''}" data-idx="${idx}" ${isUnlocked ? '' : 'disabled'}>
                <span class="lvl-num">${idx + 1}</span>
                <span class="lvl-name">${lvl.name}</span>
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

    modal.querySelectorAll('.tb-lvl-card.unlocked').forEach(btn => {
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
          <p>Match-3 Boosters & Renovation</p>
        </div>

        <div class="tb-guide-scroll">
          <div class="guide-section">
            <h3>Special Power-Ups</h3>
            <div class="guide-item">
              <span class="g-icon">${Icons.rocket('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Rocket (Match 4 in a line)</strong>
                <p>Clears an entire horizontal row or vertical column.</p>
              </div>
            </div>
            <div class="guide-item">
              <span class="g-icon">${Icons.paperPlane('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Paper Plane (Match 4 in a 2x2 square)</strong>
                <p>Takes flight and automatically targets frozen ice or obstacles!</p>
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
                <p>Swap with any item to eliminate all copies from the board.</p>
              </div>
            </div>
          </div>

          <div class="guide-section">
            <h3>Mansion Renovation</h3>
            <p>Every level won grants 1 Star 🗝️. Tap <strong>Renovate Mansion</strong> to customize rooms with 3 designer choices per furniture piece!</p>
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
