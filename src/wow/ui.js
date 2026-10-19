/**
 * Words of Wonders (WoW) Interactive UI & Touch Wheel Controller
 * Features:
 * - Clean lifecycle management (destroy() removes window pointer & resize listeners)
 * - Per-Wonder architectural SVG landmark backdrops
 * - Butterfly bonus tiles on crossword cells
 * - Responsive touch-drag wheel with dynamic resize recalculation
 * - Non-blocking toast notifications & Wonder Level Selector modal
 */

import { sound } from '../sound.js';
import { Icons } from '../icons.js';
import { WOW_DIFFICULTIES, WONDER_LANDMARKS } from './levels.js';
import { showToast } from '../toast.js';

export class WowUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.currentUser = options.currentUser || { displayName: 'Ellen', avatar: 'assets/avatars/ellen.png' };
    this.onUserLogout = options.onUserLogout || (() => {});
    this.onUserSwitch = options.onUserSwitch || (() => {});

    // Wheel drag state
    this.isDragging = false;
    this.selectedIndices = [];
    this.pointerPos = { x: 0, y: 0 };
    this.nodePositions = [];
    this.wheelRect = null;
    this.hammerMode = false;
    this.drawerOpen = false;
    this.previewResetTimer = null;

    this.onCancel = () => { this.isDragging = false; this.selectedIndices = []; this.clearCanvas(); this.syncWheelVisuals(); this.resetWordPreview(); };
    this.onKey = e => {
      if (e.target.closest('input, textarea') || e.ctrlKey || e.metaKey || e.altKey || this.hammerMode) return;
      if (/^[a-z]$/i.test(e.key)) {
        const idx = this.engine.wheelLetters.findIndex((ch,i) => ch === e.key.toUpperCase() && !this.selectedIndices.includes(i));
        if (idx >= 0) { this.selectedIndices.push(idx); this.syncWheelVisuals(); }
      } else if (e.key === 'Backspace') { e.preventDefault(); this.selectedIndices.pop(); this.syncWheelVisuals(); }
      else if (e.key === 'Escape') this.onCancel();
      else if (e.key === 'Enter' && this.selectedIndices.length) { const word = this.selectedIndices.map(i => this.engine.wheelLetters[i]).join(''); this.selectedIndices = []; this.syncWheelVisuals(); this.handleWordSubmission(word); }
    };
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.render();
    setTimeout(() => {
      if (this.destroyed) return;
      if (this.engine.isLevelComplete) this.showVictoryModal();
    }, 100);
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onCancel);
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('resize', this.onWindowResize);
  }

  destroy() {
    window.removeEventListener('pointermove', this.onPointerMove);
    this.destroyed = true;
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onCancel);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onWindowResize);
    if (this.previewResetTimer) {
      clearTimeout(this.previewResetTimer);
      this.previewResetTimer = null;
    }
  }

  onWindowResize() {
    this.initCanvas();
    this.positionLetterNodes();
  }

  render() {
    if (!this.container) return;

    const levels = this.engine.getLevels ? this.engine.getLevels() : WOW_DIFFICULTIES.easy.levels;
    const curDiff = this.engine.difficulty || 'easy';
    const lvl = this.engine.currentLevel;
    const wonderThemeIdx = ((lvl.id - 1) % 8) + 1;
    const landmarkSvg = WONDER_LANDMARKS[wonderThemeIdx] || WONDER_LANDMARKS[1];

    this.container.innerHTML = `
      <div class="wow-game-wrapper ${this.drawerOpen ? 'drawer-open' : ''}" id="wowWrapper" data-wonder-id="${wonderThemeIdx}">
        <!-- Atmospheric Sky & Custom Wonder Landmark Backdrop -->
        <div class="wow-backdrop-stars"></div>
        <div class="wow-backdrop-mountains">${landmarkSvg}</div>

        <!-- 1. Top Status HUD + 3-Tier Difficulty Bar -->
        <header class="wow-header-stack">
          <div class="wow-hud">
            <button type="button" class="wow-level-info-btn" id="wowLevelPickerBtn" title="Tap to choose Wonder Level">
              <div class="wow-level-wonder">
                <span class="wow-wonder-icon">${Icons.monument('wonder-svg', 17)}</span>
                <span class="wow-wonder-title-text">${lvl.wonder}</span>
              </div>
              <div class="wow-level-country">${lvl.country} • Wonder ${lvl.id} of ${levels.length}</div>
            </button>

            <div class="wow-hud-stats">
              <button type="button" class="wow-bonus-jar-btn ${this.engine.bonusWords.size > 0 ? 'jar-pulse' : ''}" id="wowBonusJarBtn" title="Bonus Words Collected">
                <span class="jar-icon">${Icons.jar('jar-svg', 15)}</span>
                <span id="wowBonusCount">${this.engine.bonusWords.size}</span>
              </button>

              <div class="wow-stat-pill coins" title="Gold Coins">
                <span class="stat-icon">${Icons.coin('coin-svg', 15)}</span>
                <span id="wowCoinsVal">${this.engine.coins}</span>
              </div>

              <button type="button" class="wow-menu-pill-btn" data-action="open-arcade-menu" title="Menu & Switch Game">
                ${Icons.settings('menu-svg', 15)}
                <span>Menu</span>
              </button>
            </div>
          </div>

          <div class="wow-difficulty-bar" role="group" aria-label="Puzzle Difficulty">
            ${Object.values(WOW_DIFFICULTIES).map(d => `
              <button type="button" class="wow-diff-seg-btn ${curDiff === d.id ? 'is-active' : ''}" data-wow-diff="${d.id}">
                <span class="diff-lbl">${d.label}</span>
                <span class="diff-sub">${d.subtitle}</span>
              </button>
            `).join('')}
          </div>
        </header>

        <!-- 2. Upper Crossword Matrix Area -->
        <section class="wow-board-area">
          <div class="wow-crossword-grid" id="wowCrosswordGrid"
               style="--wow-rows: ${lvl.rows}; --wow-cols: ${lvl.cols}; grid-template-columns: repeat(${lvl.cols}, var(--cell-size)); grid-template-rows: repeat(${lvl.rows}, var(--cell-size));">
            ${this.renderGridCellsHTML()}
          </div>
        </section>

        <!-- 3. Lower Control Hub: Floating Word Preview + Anagram Wheel + Tools -->
        <section class="wow-controls-area">
          <div class="wow-preview-wrapper">
            <div class="wow-word-preview" id="wowWordPreview">
              <span class="wow-word-text" id="wowWordText"></span>
            </div>
          </div>

          <div class="wow-wheel-dock">
            <!-- Left Tool Column -->
            <div class="wow-tools-col">
              <button type="button" class="wow-tool-btn" id="wowRandomHintBtn" title="Reveal First Letter of a Word (15 Coins)">
                <span class="tool-icon">${Icons.lightbulb('tool-svg', 22)}</span>
                <span class="tool-cost-badge">15</span>
              </button>
              <button type="button" class="wow-tool-btn" id="wowHammerHintBtn" title="Target Reveal Any Tile (25 Coins)">
                <span class="tool-icon">${Icons.hammer('tool-svg', 22)}</span>
                <span class="tool-cost-badge">25</span>
              </button>
            </div>

            <!-- Center Anagram Touch Wheel -->
            <div class="wow-wheel-disc" id="wowWheelDisc" data-letter-count="${this.engine.wheelLetters.length}">
              <canvas class="wow-wheel-canvas" id="wowWheelCanvas"></canvas>

              <button type="button" class="wow-wheel-center-shuffle" id="wowCenterShuffleBtn" title="Shuffle Wheel Letters" aria-label="Shuffle Letters">
                ${Icons.shuffle('shuffle-svg', 20)}
              </button>

              <div id="wowWheelNodesContainer">
                ${this.renderWheelNodesHTML()}
              </div>
            </div>

            <!-- Right Tool Column -->
            <div class="wow-tools-col">
              <button type="button" class="wow-tool-btn" id="wowShuffleSideBtn" title="Shuffle Letters">
                <span class="tool-icon">${Icons.shuffle('tool-svg', 20)}</span>
              </button>
              <button type="button" class="wow-tool-btn" id="wowInfoBtn" title="Wonder Guide & Level Select">
                <span class="tool-icon">${Icons.monument('tool-svg', 20)}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 4. Bottom Collapsible Settings Drawer -->
        <div class="bottom-drawer-wrapper ${this.drawerOpen ? 'is-open' : ''}" id="wowBottomDrawer">
          <button class="drawer-chevron-btn" id="wowDrawerToggleBtn" aria-label="Toggle Game Controls" title="Controls & Player Menu">
            ${Icons.chevronUp('drawer-chevron-svg', 18)}
          </button>

          <div class="drawer-content">
            <div class="drawer-quick-actions">
              <button class="drawer-action-btn" id="wowDrawerHintBtn">
                <span class="btn-icon">${Icons.lightbulb('action-svg', 20)}</span>
                <span class="btn-text">Hint (15)</span>
              </button>
              <button class="drawer-action-btn" id="wowDrawerShuffleBtn">
                <span class="btn-icon">${Icons.shuffle('action-svg', 20)}</span>
                <span class="btn-text">Shuffle</span>
              </button>
              <button class="drawer-action-btn" id="wowDrawerResetLvlBtn">
                <span class="btn-icon">${Icons.restart('action-svg', 20)}</span>
                <span class="btn-text">Replay</span>
              </button>
              <button class="drawer-action-btn" id="wowDrawerNextLvlBtn">
                <span class="btn-icon">${Icons.sparkle('action-svg', 20)}</span>
                <span class="btn-text">Skip Lvl</span>
              </button>
            </div>

            <div class="drawer-section">
              <span class="drawer-section-title">Word Difficulty (Saves Progress Per Tier)</span>
              <div class="difficulty-pills">
                ${Object.values(WOW_DIFFICULTIES).map(d => `
                  <button type="button" class="diff-pill ${curDiff === d.id ? 'active' : ''}" data-wow-diff="${d.id}">
                    ${d.label} (${d.subtitle})
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="drawer-footer-section">
              <div class="player-info-badge">
                <img class="player-avatar-img" src="${this.currentUser.avatar}" alt="${this.currentUser.displayName}">
                <span class="player-name"><strong>${this.currentUser.displayName}</strong></span>
              </div>
              <div class="drawer-footer-actions">
                <button class="drawer-link-btn" id="wowDrawerFreeCoinsBtn">+100 Coins</button>
                <button class="drawer-link-btn" data-action="open-arcade-menu">Game Menu</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Bonus Words Jar Modal -->
        <div class="wow-modal-overlay" id="wowBonusModal">
          <div class="wow-modal-card">
            <div class="wow-modal-header">
              <div class="wow-modal-title">${Icons.jar('modal-svg', 22)} <span>Bonus Words Jar</span></div>
              <button type="button" class="wow-modal-close-btn" id="wowCloseBonusModalBtn">${Icons.close('', 18)}</button>
            </div>
            <p style="font-size: 0.85rem; color: #cbd5e1;">
              Valid dictionary words not on the board earn <strong>+5 Bonus Coins</strong> each!
            </p>
            <div class="wow-bonus-words-list" id="wowBonusWordsList"></div>
          </div>
        </div>

        <!-- 6. Wonder Guide & Level Select Modal -->
        <div class="wow-modal-overlay" id="wowInfoModal">
          <div class="wow-info-card">
            <div class="wow-modal-header">
              <div class="wow-modal-title">${Icons.monument('modal-svg', 22)} <span>Wonders (${WOW_DIFFICULTIES[curDiff]?.label || 'Easy'})</span></div>
              <button type="button" class="wow-modal-close-btn" id="wowCloseInfoModalBtn">${Icons.close('', 18)}</button>
            </div>

            <div class="wow-levels-MiniGrid" id="wowLevelsPickerGrid">
              ${levels.map((w, idx) => `
                <button type="button" class="wow-lvl-chip ${idx === this.engine.levelIndex ? 'active' : ''}" data-lvl="${idx}">
                  <span class="w-num">#${w.id}</span>
                  <span class="w-name">${w.wonder}</span>
                </button>
              `).join('')}
            </div>

            <div class="wow-info-guide-row">
              <div class="wow-info-icon-badge">${Icons.lightbulb('', 18)}</div>
              <div>
                <strong>Smart Hint (15 Coins)</strong><br>
                Reveals the first missing letter of an unsolved word on the board.
              </div>
            </div>

            <div class="wow-info-guide-row">
              <div class="wow-info-icon-badge">${Icons.hammer('', 18)}</div>
              <div>
                <strong>Target Hammer (25 Coins)</strong><br>
                Tap the Hammer, then tap any specific crossword tile you choose to reveal it.
              </div>
            </div>

            <div class="wow-info-guide-row">
              <div class="wow-info-icon-badge">${Icons.butterfly('', 18)}</div>
              <div>
                <strong>Golden Butterfly Tile (+25 Coins)</strong><br>
                Solve a word across a Butterfly tile to collect a 25-coin treasure bonus!
              </div>
            </div>

            <button type="button" class="btn-primary" id="wowGotItInfoBtn" style="margin-top: 4px;">
              Back to Puzzle
            </button>
          </div>
        </div>

        <!-- 7. Level Victory Celebration Modal -->
        <div class="wow-modal-overlay" id="wowVictoryModal">
          <div class="wow-victory-card">
            <div class="wow-victory-trophy">${Icons.trophy('victory-trophy-svg', 54)}</div>
            <div class="wow-victory-wonder" id="wowWinWonderTitle">${lvl.wonder}</div>
            <h2 style="font-size: 1.55rem; font-weight: 800;">Wonder Completed!</h2>
            <p style="font-size: 0.9rem; color: #cbd5e1;">Splendid vocabulary, ${this.currentUser.displayName}!</p>

            <div class="wow-victory-rewards">
              <div class="wow-reward-box">
                <span class="wow-reward-val">${Icons.coin('reward-svg', 18)} +40</span>
                <span class="wow-reward-lbl">Level Bonus</span>
              </div>
              <div class="wow-reward-box">
                <span class="wow-reward-val">${Icons.star('reward-svg', 18)} +3</span>
                <span class="wow-reward-lbl">Wonder Stars</span>
              </div>
            </div>

            <button type="button" class="btn-primary" id="wowNextLevelBtn">
              Continue to Next Wonder
            </button>
          </div>
        </div>
      </div>
    `;

    this.initCanvas();
    this.positionLetterNodes();
    this.wireEvents();
  }

  renderGridCellsHTML() {
    const { rows, cols } = this.engine.currentLevel;
    let html = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = this.engine.grid?.[r]?.[c];
        if (!cell || !cell.active) {
          html += `<div class="wow-cell is-empty" data-r="${r}" data-c="${c}"></div>`;
        } else {
          const stateClass = cell.revealed ? 'is-revealed' : 'is-slot';
          const targetClass = (!cell.revealed && this.hammerMode) ? 'target-selectable' : '';
          const butterflyBadge = (!cell.revealed && cell.hasButterfly)
            ? `<span class="wow-butterfly-badge" title="Butterfly Bonus (+25 Coins)">${Icons.butterfly('bfly-svg', 16)}</span>`
            : '';
          html += `
            <div class="wow-cell ${stateClass} ${targetClass}" id="wow_cell_${r}_${c}" data-r="${r}" data-c="${c}">
              ${cell.revealed ? cell.char : butterflyBadge}
            </div>
          `;
        }
      }
    }
    return html;
  }

  renderWheelNodesHTML() {
    return this.engine.wheelLetters
      .map((letter, idx) => `
        <div class="wow-letter-node" id="wow_node_${idx}" data-index="${idx}" data-letter="${letter}">
          ${letter}
        </div>
      `)
      .join('');
  }

  initCanvas() {
    this.wheelEl = this.container?.querySelector('#wowWheelDisc');
    this.canvas = this.container?.querySelector('#wowWheelCanvas');
    if (!this.wheelEl || !this.canvas) return;

    const rect = this.wheelEl.getBoundingClientRect();
    this.wheelRect = rect;
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || 250;
    const h = rect.height || 250;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  positionLetterNodes() {
    if (!this.wheelEl) return;
    const w = this.wheelEl.clientWidth || 250;
    const h = this.wheelEl.clientHeight || 250;
    const centerX = w / 2;
    const centerY = h / 2;
    const count = this.engine.wheelLetters.length;
    const radius = count >= 7 ? w * 0.355 : w * 0.335;

    this.nodePositions = [];

    for (let i = 0; i < count; i++) {
      const angle = (i * (2 * Math.PI)) / count - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      this.nodePositions.push({ x, y });

      const nodeEl = this.container.querySelector(`#wow_node_${i}`);
      if (nodeEl) {
        nodeEl.style.left = `${x}px`;
        nodeEl.style.top = `${y}px`;
      }
    }
  }

  wireEvents() {
    if (this.wheelEl) {
      this.wheelEl.addEventListener('pointerdown', this.onPointerDown);
    }

    // 3-Tier Difficulty Buttons (Easy, Medium, Hard)
    this.container.querySelectorAll('[data-wow-diff]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextDiff = btn.dataset.wowDiff;
        if (!nextDiff || nextDiff === this.engine.difficulty) return;
        sound.playPop(1.1);
        this.engine.setDifficulty(nextDiff);
        const diffMeta = WOW_DIFFICULTIES[nextDiff];
        showToast(`Switched to ${diffMeta ? diffMeta.label : nextDiff} (${diffMeta ? diffMeta.subtitle : ''})`, 'info', 1800);
        this.render();
      });
    });

    const doShuffle = () => {
      if (this.isDragging) return;
      sound.playCardSlide();
      const centerBtn = this.container.querySelector('#wowCenterShuffleBtn');
      centerBtn?.classList.add('is-spinning');
      setTimeout(() => centerBtn?.classList.remove('is-spinning'), 450);

      this.engine.shuffleWheel();
      const nodesContainer = this.container.querySelector('#wowWheelNodesContainer');
      if (nodesContainer) {
        nodesContainer.innerHTML = this.renderWheelNodesHTML();
        this.positionLetterNodes();
      }
    };

    this.container.querySelector('#wowCenterShuffleBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      doShuffle();
    });
    this.container.querySelector('#wowShuffleSideBtn')?.addEventListener('click', doShuffle);
    this.container.querySelector('#wowDrawerShuffleBtn')?.addEventListener('click', doShuffle);

    const doRandomHint = () => {
      const res = this.engine.useRandomHint();
      if (!res.success) {
        if (res.reason === 'insufficient_coins') {
          this.shakeCoinsPill();
          showToast(`Need ${res.cost} coins for a Hint! Tap +100 Coins in menu.`, 'warning', 2500);
        } else if (res.reason === 'board_full') {
          if (this.engine.checkLevelCompletion()) {
            this.showVictoryModal();
          }
        }
        return;
      }

      sound.playCardSnap();
      this.revealSingleCellDOM(res.cell.r, res.cell.c, res.cell.char);
      this.updateHUDStats();
      if (res.caughtButterfly) {
        showToast('Butterfly caught! +25 Bonus Coins!', 'success', 2200);
      }

      if (res.isLevelComplete) {
        setTimeout(() => { if (!this.destroyed) this.showVictoryModal(); }, 650);
      }
    };

    this.container.querySelector('#wowRandomHintBtn')?.addEventListener('click', doRandomHint);
    this.container.querySelector('#wowDrawerHintBtn')?.addEventListener('click', doRandomHint);

    const hammerBtn = this.container.querySelector('#wowHammerHintBtn');
    hammerBtn?.addEventListener('click', () => {
      if (!this.hammerMode && this.engine.coins < 25) {
        this.shakeCoinsPill();
        showToast('Need 25 coins for Target Hammer!', 'warning', 2400);
        return;
      }
      this.toggleHammerMode(!this.hammerMode);
    });

    const gridEl = this.container.querySelector('#wowCrosswordGrid');
    gridEl?.addEventListener('click', (e) => {
      if (!this.hammerMode) return;
      const cellEl = e.target.closest('.wow-cell');
      if (!cellEl) return;

      const r = parseInt(cellEl.dataset.r, 10);
      const c = parseInt(cellEl.dataset.c, 10);
      const res = this.engine.useTargetedHint(r, c);

      if (!res.success) {
        if (res.reason === 'insufficient_coins') {
          this.shakeCoinsPill();
          showToast('Need 25 coins for Target Hammer!', 'warning', 2400);
        }
        this.toggleHammerMode(false);
        return;
      }

      sound.playCardSnap();
      this.toggleHammerMode(false);
      this.revealSingleCellDOM(res.cell.r, res.cell.c, res.cell.char);
      this.updateHUDStats();

      if (res.caughtButterfly) {
        showToast('Butterfly caught! +25 Bonus Coins!', 'success', 2200);
      }

      if (res.isLevelComplete) {
        setTimeout(() => { if (!this.destroyed) this.showVictoryModal(); }, 650);
      }
    });

    // Bonus Jar Modal
    const bonusModal = this.container.querySelector('#wowBonusModal');
    this.container.querySelector('#wowBonusJarBtn')?.addEventListener('click', () => {
      sound.playCardSlide();
      this.renderBonusWordsList();
      bonusModal?.classList.add('is-active');
    });
    this.container.querySelector('#wowCloseBonusModalBtn')?.addEventListener('click', () => {
      bonusModal?.classList.remove('is-active');
    });
    bonusModal?.addEventListener('click', (e) => {
      if (e.target === bonusModal) bonusModal.classList.remove('is-active');
    });

    // Wonder Guide & Level Select Modal
    const infoModal = this.container.querySelector('#wowInfoModal');
    const openInfoModal = () => {
      sound.playCardSlide();
      infoModal?.classList.add('is-active');
    };
    this.container.querySelector('#wowInfoBtn')?.addEventListener('click', openInfoModal);
    this.container.querySelector('#wowLevelPickerBtn')?.addEventListener('click', openInfoModal);

    this.container.querySelector('#wowCloseInfoModalBtn')?.addEventListener('click', () => {
      infoModal?.classList.remove('is-active');
    });
    this.container.querySelector('#wowGotItInfoBtn')?.addEventListener('click', () => {
      infoModal?.classList.remove('is-active');
    });
    infoModal?.addEventListener('click', (e) => {
      if (e.target === infoModal) infoModal.classList.remove('is-active');
    });

    this.container.querySelectorAll('.wow-lvl-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.lvl, 10);
        sound.playPop(1.1);
        infoModal?.classList.remove('is-active');
        this.engine.initLevel(idx);
        this.engine.saveProgress();
        this.render();
      });
    });

    // Bottom Drawer Toggle & Actions
    const drawer = this.container.querySelector('#wowBottomDrawer');
    this.container.querySelector('#wowDrawerToggleBtn')?.addEventListener('click', () => {
      sound.playCardSlide();
      this.drawerOpen = !this.drawerOpen;
      drawer?.classList.toggle('is-open', this.drawerOpen);
    });

    this.container.querySelector('#wowDrawerResetLvlBtn')?.addEventListener('click', () => {
      sound.playDealWhoosh(0);
      this.engine.initLevel(this.engine.levelIndex);
      this.render();
      showToast('Wonder level restarted', 'info', 1800);
    });

    this.container.querySelector('#wowDrawerNextLvlBtn')?.addEventListener('click', () => {
      sound.playDealWhoosh(0);
      this.engine.nextLevel();
      this.render();
    });

    this.container.querySelector('#wowDrawerFreeCoinsBtn')?.addEventListener('click', () => {
      sound.playStepGoalMet();
      this.engine.coins += 100;
      this.engine.saveProgress();
      this.updateHUDStats();
      showToast('+100 Complimentary Coins Added!', 'success', 2000);
    });

    this.container.querySelector('#wowDrawerSwitchUserBtn')?.addEventListener('click', () => {
      this.onUserSwitch();
    });

    this.container.querySelector('#wowNextLevelBtn')?.addEventListener('click', () => {
      sound.playDealWhoosh(0);
      this.engine.nextLevel();
      this.render();
    });
  }

  toggleHammerMode(active) {
    if (this.previewResetTimer) {
      clearTimeout(this.previewResetTimer);
      this.previewResetTimer = null;
    }
    this.hammerMode = active;
    const hammerBtn = this.container.querySelector('#wowHammerHintBtn');
    hammerBtn?.classList.toggle('is-active-tool', active);

    this.container.querySelectorAll('.wow-cell.is-slot').forEach(el => {
      el.classList.toggle('target-selectable', active);
    });

    const previewEl = this.container.querySelector('#wowWordPreview');
    const textEl = this.container.querySelector('#wowWordText');
    if (active) {
      if (textEl) textEl.innerHTML = `${Icons.hammer('inline-hammer-svg', 16)} <span>TAP ANY TILE TO REVEAL</span>`;
      previewEl?.classList.add('is-target-mode');
    } else {
      if (textEl) textEl.textContent = '';
      previewEl?.classList.remove('is-target-mode');
    }
  }

  onPointerDown(e) {
    if (e.target.closest('#wowCenterShuffleBtn')) return;
    if (this.hammerMode) this.toggleHammerMode(false);
    if (this.previewResetTimer) {
      clearTimeout(this.previewResetTimer);
      this.previewResetTimer = null;
    }

    this.initCanvas();
    this.positionLetterNodes();

    const hitIdx = this.getHitNodeIndex(e.clientX, e.clientY);
    if (hitIdx !== -1) {
      e.preventDefault();
      this.isDragging = true;
      this.selectedIndices = [hitIdx];
      this.updateRelativePointer(e.clientX, e.clientY);
      sound.playCardSlide();
      this.syncWheelVisuals();
      this.drawLaserTrace();
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    this.updateRelativePointer(e.clientX, e.clientY);
    const hitIdx = this.getHitNodeIndex(e.clientX, e.clientY);

    if (hitIdx !== -1) {
      const len = this.selectedIndices.length;
      if (len >= 2 && hitIdx === this.selectedIndices[len - 2]) {
        this.selectedIndices.pop();
        sound.playCardSlide();
        this.syncWheelVisuals();
      } else if (!this.selectedIndices.includes(hitIdx)) {
        this.selectedIndices.push(hitIdx);
        sound.playCardSlide();
        this.syncWheelVisuals();
      }
    }

    this.drawLaserTrace();
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const candidateWord = this.selectedIndices
      .map(i => this.engine.wheelLetters[i])
      .join('');

    this.clearCanvas();
    this.container.querySelectorAll('.wow-letter-node').forEach(el => {
      el.classList.remove('is-selected');
    });

    if (candidateWord.length >= 2) {
      this.handleWordSubmission(candidateWord);
    } else {
      this.resetWordPreview();
    }

    this.selectedIndices = [];
  }

  updateRelativePointer(clientX, clientY) {
    if (!this.wheelRect) return;
    this.pointerPos = {
      x: clientX - this.wheelRect.left,
      y: clientY - this.wheelRect.top
    };
  }

  getHitNodeIndex(clientX, clientY) {
    if (!this.wheelRect) return -1;
    const relX = clientX - this.wheelRect.left;
    const relY = clientY - this.wheelRect.top;
    const hitRadius = 31;

    for (let i = 0; i < this.nodePositions.length; i++) {
      const pos = this.nodePositions[i];
      const dx = relX - pos.x;
      const dy = relY - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
        return i;
      }
    }
    return -1;
  }

  syncWheelVisuals() {
    this.container.querySelectorAll('.wow-letter-node').forEach((el, idx) => {
      el.classList.toggle('is-selected', this.selectedIndices.includes(idx));
    });

    const word = this.selectedIndices.map(i => this.engine.wheelLetters[i]).join('');
    const previewEl = this.container.querySelector('#wowWordPreview');
    const textEl = this.container.querySelector('#wowWordText');

    if (textEl) textEl.textContent = word;
    if (previewEl) {
      previewEl.className = 'wow-word-preview is-typing';
    }
  }

  drawLaserTrace() {
    if (!this.ctx || !this.wheelRect) return;
    this.clearCanvas();

    if (this.selectedIndices.length === 0) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    this.selectedIndices.forEach((nodeIdx, i) => {
      const pt = this.nodePositions[nodeIdx];
      if (!pt) return;
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.lineTo(this.pointerPos.x, this.pointerPos.y);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 14;
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.restore();
  }

  clearCanvas() {
    if (!this.ctx || !this.wheelRect) return;
    this.ctx.clearRect(0, 0, this.wheelRect.width, this.wheelRect.height);
  }

  handleWordSubmission(word) {
    if (this.engine.isLevelComplete) return;
    const res = this.engine.submitWord(word);
    const previewEl = this.container.querySelector('#wowWordPreview');
    const textEl = this.container.querySelector('#wowWordText');

    if (res.status === 'board_word') {
      sound.playFoundationClear();
      if (previewEl) previewEl.className = 'wow-word-preview is-success';
      if (textEl) textEl.textContent = `${res.word} (+${res.coinsAwarded})`;

      res.allWordCells.forEach(({ r, c }, idx) => {
        setTimeout(() => {
          if (this.destroyed) return;
          this.flyLetterToCell(r, c, this.engine.grid[r][c].char);
          this.revealSingleCellDOM(r, c, this.engine.grid[r][c].char, true);
        }, idx * 75);
      });

      if (res.caughtButterfly) {
        showToast('Butterfly caught! +25 Bonus Coins!', 'success', 2200);
      }

      this.updateHUDStats();

      if (res.isLevelComplete) {
        setTimeout(() => { if (!this.destroyed) this.showVictoryModal(); }, res.allWordCells.length * 80 + 500);
      }
    } else if (res.status === 'bonus_word') {
      sound.playCardSnap();
      if (previewEl) previewEl.className = 'wow-word-preview is-bonus';
      if (textEl) textEl.textContent = `BONUS! +${res.coinsAwarded}`;

      const jarBtn = this.container.querySelector('#wowBonusJarBtn');
      jarBtn?.classList.add('jar-pulse');
      this.updateHUDStats();
    } else if (res.status === 'already_found' || res.status === 'bonus_already') {
      sound.vibrate([20, 40]);
      if (previewEl) previewEl.className = 'wow-word-preview is-already-found';
      if (textEl) textEl.textContent = `${res.word} (FOUND)`;

      if (res.cells) {
        res.cells.forEach(({ r, c }) => {
          const cellEl = this.container.querySelector(`#wow_cell_${r}_${c}`);
          cellEl?.classList.add('anim-celebrate');
          setTimeout(() => cellEl?.classList.remove('anim-celebrate'), 750);
        });
      }
    } else {
      sound.vibrate(25);
      if (previewEl) previewEl.className = 'wow-word-preview is-invalid';
      if (textEl) textEl.textContent = word;
    }

    if (this.previewResetTimer) clearTimeout(this.previewResetTimer);
    this.previewResetTimer = setTimeout(() => {
      if (!this.isDragging && !this.hammerMode) {
        this.resetWordPreview();
      }
    }, 850);
  }

  flyLetterToCell(r, c, char) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const from = this.container.querySelector('#wowWordPreview')?.getBoundingClientRect();
    const to = this.container.querySelector(`#wow_cell_${r}_${c}`)?.getBoundingClientRect();
    if (!from || !to) return;
    const tile = document.createElement('span');
    tile.className = 'wow-letter-flight'; tile.textContent = char;
    Object.assign(tile.style, { left: `${from.left + from.width / 2}px`, top: `${from.top}px`, width: `${to.width}px`, height: `${to.height}px` });
    document.body.appendChild(tile);
    const dx = to.left - from.left - from.width / 2, dy = to.top - from.top;
    tile.animate([{ transform: 'translate(0,0) scale(.6)', opacity: .4 }, { transform: `translate(${dx * .5}px, ${dy * .5 - 35}px) scale(1.1)`, opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0 }], { duration: 360, easing: 'ease-out' }).finished.then(() => tile.remove());
  }

  resetWordPreview() {
    const previewEl = this.container.querySelector('#wowWordPreview');
    const textEl = this.container.querySelector('#wowWordText');
    if (previewEl) previewEl.className = 'wow-word-preview';
    if (textEl) textEl.textContent = '';
  }

  revealSingleCellDOM(r, c, char, celebrate = false) {
    const cellEl = this.container.querySelector(`#wow_cell_${r}_${c}`);
    if (!cellEl) return;

    cellEl.textContent = char;
    cellEl.classList.remove('is-slot', 'target-selectable', 'anim-flip', 'anim-celebrate');
    cellEl.classList.add('is-revealed', 'anim-flip');

    if (celebrate) {
      cellEl.classList.add('anim-celebrate');
    }
  }

  updateHUDStats() {
    const coinsEl = this.container.querySelector('#wowCoinsVal');
    const starsEl = this.container.querySelector('#wowStarsVal');
    const bonusEl = this.container.querySelector('#wowBonusCount');

    if (coinsEl) coinsEl.textContent = this.engine.coins;
    if (starsEl) starsEl.textContent = this.engine.stars;
    if (bonusEl) bonusEl.textContent = this.engine.bonusWords.size;
  }

  shakeCoinsPill() {
    sound.vibrate([30, 50, 30]);
    const coinsPill = this.container.querySelector('.wow-stat-pill.coins');
    coinsPill?.classList.add('anim-shake');
    setTimeout(() => coinsPill?.classList.remove('anim-shake'), 500);
  }

  renderBonusWordsList() {
    const listEl = this.container.querySelector('#wowBonusWordsList');
    if (!listEl) return;

    const words = Array.from(this.engine.bonusWords);
    if (words.length === 0) {
      listEl.innerHTML = `<span style="color: #94a3b8; font-size: 0.85rem; margin: auto;">Swipe extra valid 3+ letter words to fill your Bonus Amphora!</span>`;
      return;
    }

    listEl.innerHTML = words
      .map(w => `<span class="wow-bonus-tag">${w}</span>`)
      .join('');
  }

  showVictoryModal() {
    sound.playStepGoalMet();
    const modal = this.container.querySelector('#wowVictoryModal');
    modal?.classList.add('is-active');
  }
}
