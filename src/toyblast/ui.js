/**
 * Toy Blast UI Controller
 * Renders molded 3D toy blocks with embossed colorblind-accessible symbols,
 * directional horizontal/vertical rotor propellers, particle bursts, and celebrations.
 */

import { playBoardTurn } from '../board-motion.js';
import { Icons } from '../icons.js';
import { sound } from '../sound.js';
import { CELL_TYPES } from './engine.js';
import { TOY_BLAST_LEVELS } from './levels.js';
import { showToast } from '../toast.js';

export class ToyBlastUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.currentUser = options.currentUser || { displayName: 'Player' };
    this.onUserLogout = options.onUserLogout || (() => {});
    this.onUserSwitch = options.onUserSwitch || (() => {});

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
    // Clean up any stray particle bursts
    document.querySelectorAll('.tb-particle-burst').forEach(el => el.remove());
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="toyblast-app" id="toyBlastApp">
        <!-- Top HUD: Level & Objectives -->
        <header class="toyblast-hud">
          <div class="toyblast-hud-top">
            <div class="toyblast-level-badge">
              <span class="level-lbl">LEVEL</span>
              <span class="level-num">${this.engine.levelIndex + 1}</span>
            </div>

            <!-- Live Goals Display -->
            <div class="toyblast-goals" id="tbGoalsContainer">
              ${this.renderGoalsHTML()}
            </div>

            <!-- Remaining Moves -->
            <div class="toyblast-moves ${this.engine.movesLeft <= 5 ? 'moves-low' : ''}" id="tbMovesContainer">
              <span class="moves-count" id="tbMovesCount">${this.engine.movesLeft}</span>
              <span class="moves-lbl">MOVES</span>
            </div>
          </div>

          <!-- Score & Stars Meter -->
          <div class="toyblast-score-bar">
            <div class="tb-score-info">
              <span class="tb-score-lbl">SCORE</span>
              <span class="tb-score-val" id="tbScoreVal">${this.engine.score.toLocaleString()}</span>
            </div>
            <div class="tb-star-meter">
              <div class="tb-star-track">
                <div class="tb-star-fill" id="tbStarFill" style="width: ${this.getStarPercent()}%"></div>
                <div class="tb-star-node star-1 ${this.engine.score >= this.engine.currentLevel.starThresholds[0] ? 'lit' : ''}">${Icons.star('star-ico', 12)}</div>
                <div class="tb-star-node star-2 ${this.engine.score >= this.engine.currentLevel.starThresholds[1] ? 'lit' : ''}">${Icons.star('star-ico', 14)}</div>
                <div class="tb-star-node star-3 ${this.engine.score >= this.engine.currentLevel.starThresholds[2] ? 'lit' : ''}">${Icons.star('star-ico', 16)}</div>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Toy Grid Board -->
        <main class="toyblast-board-wrap">
          <div class="toyblast-grid" id="tbGrid" style="--grid-rows: ${this.engine.currentLevel.rows}; --grid-cols: ${this.engine.currentLevel.cols};">
            ${this.renderGridHTML()}
          </div>
        </main>

        <!-- Bottom Controls & Guide -->
        <footer class="toyblast-footer">
          <button type="button" class="tb-ctrl-btn" id="tbUndoBtn">${Icons.undo('tb-icon', 18)}<span>Undo</span></button>
          <button type="button" class="tb-ctrl-btn" id="tbGuideBtn" title="How to Play & Boosters">
            <span class="tb-btn-icon">${Icons.lightbulb('tb-icon', 18)}</span>
            <span>Guide</span>
          </button>
          <button type="button" class="tb-ctrl-btn" id="tbLevelsBtn" title="Choose Level">
            <span class="tb-btn-icon">${Icons.trophy('tb-icon', 18)}</span>
            <span>Levels</span>
          </button>
          <button type="button" class="tb-ctrl-btn" id="tbRestartBtn" title="Restart Level">
            <span class="tb-btn-icon">${Icons.restart('tb-icon', 18)}</span>
            <span>Retry</span>
          </button>
          <button type="button" class="tb-ctrl-btn" data-action="open-arcade-menu" title="Menu & Switch Game">
            <span class="tb-btn-icon">${Icons.settings('tb-icon', 18)}</span>
            <span>Menu</span>
          </button>
        </footer>

        <!-- Modals Container -->
        <div id="tbModalContainer"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  getStarPercent() {
    const thresholds = this.engine.currentLevel.starThresholds;
    const maxThreshold = thresholds[2];
    return Math.min(100, Math.round((this.engine.score / maxThreshold) * 100));
  }

  getCubeMotifSVG(color) {
    // Embossed toy block symbols for tactile charm & colorblind clarity
    switch (color) {
      case 'red':
        return `<svg class="tb-cube-motif" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20.5l-1.3-1.2C6 15 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.5 0 3 .7 4.2 1.9C13.2 4.7 14.7 4 16.2 4 18.9 4 21 6.1 21 8.8c0 3.4-3 6.2-7.7 10.5L12 20.5z"/></svg>`;
      case 'blue':
        return `<svg class="tb-cube-motif" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-4 5.2-6 8.4-6 11.2A6 6 0 0 0 18 14.2C18 11.4 16 8.2 12 3z"/></svg>`;
      case 'green':
        return `<svg class="tb-cube-motif" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a3.5 3.5 0 0 0-3.5 3.5c0 1.1.5 2 1.3 2.7A3.5 3.5 0 0 0 5 13.5 3.5 3.5 0 0 0 8.5 17c1.2 0 2.2-.5 2.8-1.4L10 20h4l-1.3-4.4c.6.9 1.6 1.4 2.8 1.4a3.5 3.5 0 0 0 3.5-3.5 3.5 3.5 0 0 0-4.8-3.3c.8-.7 1.3-1.6 1.3-2.7A3.5 3.5 0 0 0 12 4z"/></svg>`;
      case 'yellow':
        return `<svg class="tb-cube-motif" viewBox="0 0 24 24"><polygon fill="currentColor" points="12 3 14.8 8.6 21 9.5 16.5 13.9 17.6 20 12 17.1 6.4 20 7.5 13.9 3 9.5 9.2 8.6 12 3"/></svg>`;
      case 'purple':
        return `<svg class="tb-cube-motif" viewBox="0 0 24 24"><polygon fill="currentColor" points="12 3 20 12 12 21 4 12 12 3"/></svg>`;
      default:
        return '';
    }
  }

  renderGoalsHTML() {
    const goals = this.engine.goals;
    const parts = [];

    if (goals.cubes) {
      for (const [col, count] of Object.entries(goals.cubes)) {
        const isDone = count <= 0;
        parts.push(`
          <div class="tb-goal-pill ${isDone ? 'done' : ''}" data-color="${col}">
            <span class="tb-goal-cube tb-cube-preview tb-cube-${col}"></span>
            <span class="tb-goal-count">${isDone ? Icons.check('goal-check', 14) : count}</span>
          </div>
        `);
      }
    }

    if (goals.crates !== undefined && this.engine.currentLevel.goals.crates) {
      const isDone = goals.crates <= 0;
      parts.push(`
        <div class="tb-goal-pill ${isDone ? 'done' : ''}" data-type="crate">
          <span class="tb-goal-icon">${Icons.crate('goal-svg', 18)}</span>
          <span class="tb-goal-count">${isDone ? Icons.check('goal-check', 14) : goals.crates}</span>
        </div>
      `);
    }

    if (goals.ducks !== undefined && this.engine.currentLevel.goals.ducks) {
      const isDone = goals.ducks <= 0;
      parts.push(`
        <div class="tb-goal-pill ${isDone ? 'done' : ''}" data-type="duck">
          <span class="tb-goal-icon">${Icons.duck('goal-svg', 18)}</span>
          <span class="tb-goal-count">${isDone ? Icons.check('goal-check', 14) : goals.ducks}</span>
        </div>
      `);
    }

    if (goals.bubbles !== undefined && this.engine.currentLevel.goals.bubbles) {
      const isDone = goals.bubbles <= 0;
      parts.push(`
        <div class="tb-goal-pill ${isDone ? 'done' : ''}" data-type="bubble">
          <span class="tb-goal-icon">${Icons.bubble('goal-svg', 18)}</span>
          <span class="tb-goal-count">${isDone ? Icons.check('goal-check', 14) : goals.bubbles}</span>
        </div>
      `);
    }

    return parts.join('');
  }

  renderGridHTML() {
    const rows = this.engine.currentLevel.rows;
    const cols = this.engine.currentLevel.cols;
    let html = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = this.engine.grid[r][c];
        html += this.renderCellHTML(cell, r, c);
      }
    }
    return html;
  }

  renderCellHTML(cell, r, c) {
    if (!cell || cell.type === CELL_TYPES.EMPTY) {
      return `<div class="tb-cell empty" data-r="${r}" data-c="${c}"></div>`;
    }

    let innerContent = '';
    let cellClass = `tb-cell type-${cell.type}`;

    if (cell.type === CELL_TYPES.CUBE) {
      cellClass += ` color-${cell.color}`;
      innerContent = `
        <span class="tb-cube-face"></span>
        ${this.getCubeMotifSVG(cell.color)}
      `;
    } else if (cell.type === CELL_TYPES.ROTOR_H) {
      cellClass += ` tb-booster tb-rotor-h`;
      innerContent = `<span class="booster-icon" title="Horizontal Rotor (Clears Row)">${Icons.rotorH('rotor-svg', 26)}</span>`;
    } else if (cell.type === CELL_TYPES.ROTOR_V) {
      cellClass += ` tb-booster tb-rotor-v`;
      innerContent = `<span class="booster-icon" title="Vertical Rotor (Clears Column)">${Icons.rotorV('rotor-svg', 26)}</span>`;
    } else if (cell.type === CELL_TYPES.BOMB) {
      cellClass += ` tb-booster tb-bomb`;
      innerContent = `<span class="booster-icon" title="TNT Bomb (3x3 Blast)">${Icons.bomb('bomb-svg', 25)}</span>`;
    } else if (cell.type === CELL_TYPES.DISCO) {
      cellClass += ` tb-booster tb-disco ${cell.color ? `disco-${cell.color}` : ''}`;
      innerContent = `<span class="booster-icon" title="Disco Ball">${Icons.discoBall('disco-svg', 26)}</span>`;
    } else if (cell.type === CELL_TYPES.CRATE) {
      cellClass += ` tb-obstacle tb-crate`;
      innerContent = `<span class="obstacle-icon">${Icons.crate('crate-svg', 28)}</span>`;
    } else if (cell.type === CELL_TYPES.DUCK) {
      cellClass += ` tb-obstacle tb-duck`;
      innerContent = `<span class="obstacle-icon">${Icons.duck('duck-svg', 28)}</span>`;
    }

    let bubbleHTML = '';
    if (cell.bubble) {
      bubbleHTML = `<span class="tb-bubble-overlay">${Icons.bubble('bubble-svg', 34)}</span>`;
    }

    return `
      <div class="${cellClass}" role="button" tabindex="0" aria-label="${cell.color || cell.type}, row ${r + 1}, column ${c + 1}" data-r="${r}" data-c="${c}">
        ${innerContent}
        ${bubbleHTML}
      </div>
    `;
  }

  attachEventListeners() {
    this.container.querySelector('#tbUndoBtn')?.addEventListener('click', () => {
      if (this.busy) return;
      if (!this.engine.undoTurn?.()) { showToast('No turn to undo yet.', 'info', 1400); return; }
      this.updateFullUI();
    });
    const grid = this.container.querySelector('#tbGrid');
    grid?.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.tb-cell')) { e.preventDefault(); e.target.closest('.tb-cell').click(); } });
    grid?.addEventListener('click', (e) => {
      const cellEl = e.target.closest('.tb-cell');
      if (!cellEl) return;

      const r = parseInt(cellEl.dataset.r, 10);
      const c = parseInt(cellEl.dataset.c, 10);
      this.handleCellTap(r, c, cellEl);
    });

    this.container.querySelector('#tbGuideBtn')?.addEventListener('click', () => {
      this.showGuideModal();
    });

    this.container.querySelector('#tbLevelsBtn')?.addEventListener('click', () => {
      if (this.busy) return;
      this.showLevelSelectModal();
    });

    this.container.querySelector('#tbRestartBtn')?.addEventListener('click', () => {
      if (this.busy) return;
      sound.playPop(0.9);
      this.engine.restartLevel();
      this.updateFullUI();
      showToast('Level restarted', 'info', 1600);
    });
  }

  async handleCellTap(r, c, cellEl) {
    if (this.busy) return;
    this.busy = true;
    const res = this.engine.tapCell(r, c);

    if (res.status === 'blasted') {
      sound.playPop(1 + Math.min(res.groupSize * 0.06, 0.45));
      if (res.createdBooster) {
        sound.playChime();
      }
      this.triggerBlastParticles(cellEl);
      await playBoardTurn(this, '#tbGrid', () => this.renderGridHTML());
      if (this.destroyed) return;
      this.updateFullUI();
      if (res.autoShuffled) {
        showToast('No clusters left - Auto-shuffling blocks!', 'shuffle', 2200);
      }
    } else if (res.status === 'booster_activated') {
      if (res.combo) {
        sound.playChime();
        sound.playBlast();
      } else if (res.type === CELL_TYPES.BOMB) {
        sound.playBlast();
      } else if (res.type === CELL_TYPES.ROTOR_H || res.type === CELL_TYPES.ROTOR_V) {
        sound.playRocket();
      } else if (res.type === CELL_TYPES.DISCO) {
        sound.playChime();
      }
      this.triggerBlastParticles(cellEl);
      const gridEl = this.container.querySelector('#tbGrid');
      gridEl?.classList.add('board-shake');
      setTimeout(() => gridEl?.classList.remove('board-shake'), 300);

      await playBoardTurn(this, '#tbGrid', () => this.renderGridHTML());
      if (this.destroyed) return;
      this.updateFullUI();
      if (res.autoShuffled) {
        showToast('No clusters left - Auto-shuffling blocks!', 'shuffle', 2200);
      }
    } else if (res.status === 'group_too_small') {
      sound.playCardSlide();
      showToast('Tap two or more blocks of the same color.', 'info', 1600);
      cellEl.classList.add('shake');
      setTimeout(() => cellEl.classList.remove('shake'), 300);
    }

    this.busy = false;
    if (this.engine.isWon) {
      setTimeout(() => { if (!this.destroyed) this.showVictoryModal(); }, 550);
    } else if (this.engine.isLost) {
      setTimeout(() => { if (!this.destroyed) this.showDefeatModal(); }, 550);
    }
  }

  triggerBlastParticles(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const burst = document.createElement('div');
    burst.className = 'tb-particle-burst';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;

    for (let i = 0; i < 8; i++) {
      const p = document.createElement('span');
      p.className = 'tb-sparkle-dot';
      p.style.setProperty('--angle', `${i * 45}deg`);
      burst.appendChild(p);
    }

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
  }

  updateFullUI() {
    const level = this.container.querySelector('.level-num');
    if (level) level.textContent = this.engine.levelIndex + 1;
    const cue = this.container.querySelector('#tbPlayCue strong');
    if (cue) cue.textContent = this.engine.currentLevel.name;
    const grid = this.container.querySelector('#tbGrid');
    if (grid) {
      grid.innerHTML = this.renderGridHTML();
    }

    const goalsEl = this.container.querySelector('#tbGoalsContainer');
    if (goalsEl) {
      goalsEl.innerHTML = this.renderGoalsHTML();
    }

    const movesEl = this.container.querySelector('#tbMovesCount');
    const movesBox = this.container.querySelector('#tbMovesContainer');
    if (movesEl) movesEl.textContent = this.engine.movesLeft;
    if (movesBox) movesBox.classList.toggle('moves-low', this.engine.movesLeft <= 5);

    const scoreEl = this.container.querySelector('#tbScoreVal');
    if (scoreEl) scoreEl.textContent = this.engine.score.toLocaleString();

    const starFill = this.container.querySelector('#tbStarFill');
    if (starFill) starFill.style.width = `${this.getStarPercent()}%`;

    const thresholds = this.engine.currentLevel.starThresholds;
    const score = this.engine.score;
    this.container.querySelector('.star-1')?.classList.toggle('lit', score >= thresholds[0]);
    this.container.querySelector('.star-2')?.classList.toggle('lit', score >= thresholds[1]);
    this.container.querySelector('.star-3')?.classList.toggle('lit', score >= thresholds[2]);
  }

  showVictoryModal() {
    sound.playStepGoalMet();
    const modal = document.createElement('div');
    modal.className = 'tb-modal-overlay';
    modal.innerHTML = `
      <div class="tb-modal-card victory">
        <div class="tb-modal-header">
          <div class="tb-victory-trophy">${Icons.trophy('vic-trophy', 48)}</div>
          <h2>LEVEL COMPLETE!</h2>
          <p>${this.engine.currentLevel.name}</p>
        </div>

        <div class="tb-stars-earned">
          <span class="star-pill ${this.engine.stars >= 1 ? 'earned' : ''}">${Icons.star('vic-star', 28)}</span>
          <span class="star-pill ${this.engine.stars >= 2 ? 'earned' : ''}">${Icons.star('vic-star', 34)}</span>
          <span class="star-pill ${this.engine.stars >= 3 ? 'earned' : ''}">${Icons.star('vic-star', 28)}</span>
        </div>

        <div class="tb-victory-stats">
          <div class="v-stat">
            <span class="stat-l">Final Score</span>
            <span class="stat-v">${this.engine.score.toLocaleString()}</span>
          </div>
          <div class="v-stat">
            <span class="stat-l">Coins Earned</span>
            <span class="stat-v">+${this.engine.stars * 15} ${Icons.coin('inline-coin', 16)}</span>
          </div>
        </div>

        <div class="tb-modal-actions">
          <button type="button" class="tb-modal-btn primary" id="tbNextLvlBtn">
            ${this.engine.levelIndex < TOY_BLAST_LEVELS.length - 1 ? 'Next Level' : 'Replay Level'}
          </button>
          <button type="button" class="tb-modal-btn secondary" id="tbCloseVicBtn">
            Back to Levels
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    modal.querySelector('#tbNextLvlBtn')?.addEventListener('click', () => {
      modal.remove();
      if (this.engine.levelIndex < TOY_BLAST_LEVELS.length - 1) {
        this.engine.nextLevel();
      } else {
        this.engine.restartLevel();
      }
      this.busy = false;
    this.destroyed = false;
    this.render();
    });

    modal.querySelector('#tbCloseVicBtn')?.addEventListener('click', () => {
      modal.remove();
      this.showLevelSelectModal();
    });
  }

  showDefeatModal() {
    sound.playBlast();
    const modal = document.createElement('div');
    modal.className = 'tb-modal-overlay';
    modal.innerHTML = `
      <div class="tb-modal-card defeat">
        <div class="tb-modal-header">
          <h2>A few more moves?</h2>
          <p>Combine bigger cube clusters (5+, 7+, 9+) to create Rotors, Bombs, and Disco Balls!</p>
        </div>

        <div class="tb-defeat-goals">
          <p class="tb-rem-lbl">Remaining Objectives:</p>
          <div class="toyblast-goals">
            ${this.renderGoalsHTML()}
          </div>
        </div>

        <div class="tb-modal-actions">
          <button type="button" class="tb-modal-btn primary" id="tbRetryBtn">
            Try Again
          </button>
          <button type="button" class="tb-modal-btn secondary" id="tbCloseDefeatBtn">
            Keep playing (+5 free moves)
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    modal.querySelector('#tbRetryBtn')?.addEventListener('click', () => {
      modal.remove();
      this.engine.restartLevel();
      this.updateFullUI();
    });

    modal.querySelector('#tbCloseDefeatBtn')?.addEventListener('click', () => {
      this.engine.isLost = false;
      this.engine.movesLeft += 5;
      this.engine.saveSession?.();
      this.updateFullUI();
      modal.remove();
    });
  }

  showLevelSelectModal() {
    sound.playPop(1);
    const modal = document.createElement('div');
    modal.className = 'tb-modal-overlay';
    modal.innerHTML = `
      <div class="tb-modal-card levels-modal">
        <div class="tb-modal-header">
          <h2>Toy Blast Levels</h2>
          <p>Select any puzzle level</p>
        </div>

        <div class="tb-levels-grid">
          ${TOY_BLAST_LEVELS.map((lvl, idx) => {
            const stars = this.engine.levelStars[idx] || 0;
            const isCurrent = idx === this.engine.levelIndex;

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

        <div class="tb-modal-actions">
          <button type="button" class="tb-modal-btn secondary" id="tbCloseLevelsBtn">
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
        this.busy = false;
    this.destroyed = false;
    this.render();
      });
    });

    modal.querySelector('#tbCloseLevelsBtn')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  showGuideModal() {
    sound.playPop(1);
    const modal = document.createElement('div');
    modal.className = 'tb-modal-overlay';
    modal.innerHTML = `
      <div class="tb-modal-card guide-modal">
        <div class="tb-modal-header">
          <h2>Toy Blast Guide</h2>
          <p>Rules, Boosters & Chain Reactions</p>
        </div>

        <div class="tb-guide-scroll">
          <div class="guide-section">
            <h3>Match Sizes & Boosters</h3>
            <div class="guide-item">
              <span class="g-icon">${Icons.rotorH('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Rotor Propeller (5-6 Cubes)</strong>
                <p>Blasts an entire horizontal row or vertical column based on cluster shape.</p>
              </div>
            </div>
            <div class="guide-item">
              <span class="g-icon">${Icons.bomb('g-svg', 24)}</span>
              <div class="g-text">
                <strong>TNT Bomb (7-8 Cubes)</strong>
                <p>Detonates a 3x3 explosion destroying blocks and crates.</p>
              </div>
            </div>
            <div class="guide-item">
              <span class="g-icon">${Icons.discoBall('g-svg', 24)}</span>
              <div class="g-text">
                <strong>Disco Ball (9+ Cubes)</strong>
                <p>Clears all blocks of that color from the board in one sweep!</p>
              </div>
            </div>
          </div>

          <div class="guide-section">
            <h3>Booster Combos</h3>
            <p>Tap two adjacent boosters together for game-changing power:</p>
            <ul>
              <li><strong>Rotor + Rotor:</strong> Clears both row and column in a cross blast.</li>
              <li><strong>Bomb + Rotor:</strong> Clears 3 entire rows and 3 entire columns!</li>
              <li><strong>Bomb + Bomb:</strong> Giant 5x5 mega explosion.</li>
              <li><strong>Disco + Rotor/Bomb:</strong> Transforms all cubes of that color into Rotors/Bombs and detonates them all!</li>
              <li><strong>Disco + Disco:</strong> Clears the ENTIRE board!</li>
            </ul>
          </div>
        </div>

        <div class="tb-modal-actions">
          <button type="button" class="tb-modal-btn primary" id="tbCloseGuideBtn">
            Got It!
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    modal.querySelector('#tbCloseGuideBtn')?.addEventListener('click', () => {
      modal.remove();
    });
  }
}
