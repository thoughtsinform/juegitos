/**
 * Words of Wonders (WoW) - UI Controller & Touch Anagram Wheel
 * Zen Nature Wonder Aesthetic | Outdoor Sunlight Legibility
 * High-performance Canvas Laser Trace & Trigonometric Letter Placement
 */

import { sound } from '../sound.js';

export class WowUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.currentUser = options.currentUser || 'Ellen';
    this.onUserLogout = options.onUserLogout || (() => {});
    this.onUserSwitch = options.onUserSwitch || (() => {});

    // Wheel touch drag state
    this.isDragging = false;
    this.selectedIndices = []; // Indices into this.engine.wheelLetters
    this.currentPointer = null; // { x, y } relative to wheel
    this.nodePositions = []; // [{ x, y, letter, el }]
    this.isTargetMode = false; // Hammer hint active

    this.initDOM();
    this.initCanvas();
    this.wireEvents();
    this.render();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="wow-game-wrapper" id="wowGameWrapper">
        <!-- Ambient Scenic Nature Layers -->
        <div class="wow-backdrop-stars"></div>
        <div class="wow-backdrop-mountains"></div>

        <!-- 1. Top HUD: Wonder Name, Country, Stars, Coins, Bonus Jar -->
        <header class="wow-hud">
          <div class="wow-level-info">
            <div class="wow-level-wonder">
              <span class="wow-wonder-emoji" id="wonderEmoji">🏛️</span>
              <span id="wonderTitle">Level 1: Giza</span>
            </div>
            <div class="wow-level-country" id="wonderCountry">EGYPT</div>
          </div>

          <div class="wow-hud-stats">
            <button type="button" class="wow-bonus-jar-btn" id="bonusJarBtn" title="View Bonus Word Jar">
              <span>🏺</span>
              <span id="bonusJarCount">0/5</span>
            </button>
            <div class="wow-stat-pill coins" title="Coins for hints">
              <span>🪙</span>
              <span id="hudCoinsVal">100</span>
            </div>
            <div class="wow-stat-pill stars" title="Total Stars">
              <span>⭐</span>
              <span id="hudStarsVal">0</span>
            </div>
          </div>
        </header>

        <!-- 2. Crossword Matrix Board (Upper Half) -->
        <main class="wow-board-area" id="boardArea">
          <div class="wow-crossword-grid" id="crosswordGrid"></div>
        </main>

        <!-- 3. Floating Word Preview Pill -->
        <div class="wow-preview-wrapper">
          <div class="wow-word-preview" id="wordPreviewPill">
            <span class="wow-word-text" id="wordPreviewText">CONNECT LETTERS</span>
          </div>
        </div>

        <!-- 4. Lower Control Hub: Wheel & Flanking Action Tools -->
        <footer class="wow-controls-area">
          <div class="wow-wheel-dock">
            <!-- Left Action Tools -->
            <div class="wow-tools-col tools-left">
              <button type="button" class="wow-tool-btn tool-hint" id="hintLightbulbBtn" title="Reveal random letter (25 coins)">
                <span class="tool-emoji">💡</span>
                <span class="tool-cost-badge">25</span>
              </button>
              <button type="button" class="wow-tool-btn tool-target" id="hintHammerBtn" title="Target specific tile (25 coins)">
                <span class="tool-emoji">🎯</span>
                <span class="tool-cost-badge">25</span>
              </button>
            </div>

            <!-- The Touch Anagram Wheel Disc -->
            <div class="wow-wheel-disc" id="wheelDisc">
              <canvas class="wow-wheel-canvas" id="wheelCanvas"></canvas>
              
              <!-- Center Shuffle Button in Wheel Hub -->
              <button type="button" class="wow-wheel-center-shuffle" id="centerShuffleBtn" title="Shuffle letters">
                <span>🔀</span>
              </button>

              <!-- Letter nodes will be injected here via trigonometry -->
              <div id="letterNodesContainer"></div>
            </div>

            <!-- Right Action Tools -->
            <div class="wow-tools-col tools-right">
              <button type="button" class="wow-tool-btn tool-shuffle" id="flankShuffleBtn" title="Shuffle letters">
                <span class="tool-emoji">🔀</span>
              </button>
              <button type="button" class="wow-tool-btn tool-info" id="levelInfoBtn" title="Level information">
                <span class="tool-emoji">ℹ️</span>
              </button>
            </div>
          </div>
        </footer>

        <!-- 5. Bonus Word Jar Modal -->
        <div class="wow-modal-overlay" id="bonusJarModal">
          <div class="wow-modal-card">
            <div class="wow-modal-header">
              <div class="wow-modal-title">
                <span>🏺</span>
                <span>Bonus Words Jar</span>
              </div>
              <button type="button" class="wow-modal-close-btn" id="closeBonusJarBtn">✕</button>
            </div>
            <p style="font-size: 0.88rem; color: #94a3b8; margin: 0;">
              Extra English words discovered that aren't on the crossword board. Every 5 words award <b>+1 ⭐ Star & +25 🪙 Coins</b>!
            </p>
            <div class="wow-bonus-words-list" id="bonusWordsList">
              <span style="color: #64748b; font-size: 0.82rem; width: 100%;">No bonus words discovered yet. Try spelling extra words!</span>
            </div>
            <button type="button" class="wow-btn-primary" id="bonusModalOkBtn">Keep Playing</button>
          </div>
        </div>

        <!-- 6. Wonder Victory Celebration Modal -->
        <div class="wow-modal-overlay" id="victoryModal">
          <div class="wow-victory-card">
            <span class="wow-victory-trophy">🏆</span>
            <h2 style="color: #fef3c7; font-size: 1.5rem; margin: 0;">Wonder Completed!</h2>
            <p id="vicWonderName" style="color: #38bdf8; font-weight: 700; margin: 0; font-size: 1.1rem;">Great Pyramid of Giza</p>
            <p style="color: #94a3b8; font-size: 0.9rem; margin: 0;">You solved all crossword words!</p>
            <div style="display: flex; gap: 16px; margin: 8px 0;">
              <span style="color: #fbbf24; font-weight: 800; font-size: 1.1rem;">⭐ +3 Stars</span>
              <span style="color: #fcd34d; font-weight: 800; font-size: 1.1rem;">🪙 +50 Coins</span>
            </div>
            <button type="button" class="wow-btn-primary" id="nextLevelBtn">Next Wonder →</button>
          </div>
        </div>
      </div>
    `;

    this.boardEl = this.container.querySelector('#crosswordGrid');
    this.wheelDiscEl = this.container.querySelector('#wheelDisc');
    this.canvasEl = this.container.querySelector('#wheelCanvas');
    this.letterContainerEl = this.container.querySelector('#letterNodesContainer');
    this.previewPillEl = this.container.querySelector('#wordPreviewPill');
    this.previewTextEl = this.container.querySelector('#wordPreviewText');
    this.bonusJarModalEl = this.container.querySelector('#bonusJarModal');
    this.victoryModalEl = this.container.querySelector('#victoryModal');
  }

  initCanvas() {
    if (!this.canvasEl) return;
    this.ctx = this.canvasEl.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.positionLetterNodes();
    });
  }

  resizeCanvas() {
    if (!this.canvasEl || !this.wheelDiscEl) return;
    const rect = this.wheelDiscEl.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvasEl.width = rect.width * dpr;
    this.canvasEl.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  wireEvents() {
    // 1. Wheel Touch & Pointer Drag Events
    const disc = this.wheelDiscEl;
    if (disc) {
      disc.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
      window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
      window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
      window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
    }

    // 2. Shuffle Buttons (Center Hub & Flank)
    const doShuffle = () => {
      sound.playCardSlide();
      this.triggerHaptic('light');
      const centerBtn = this.container.querySelector('#centerShuffleBtn');
      centerBtn?.classList.add('is-spinning');
      setTimeout(() => centerBtn?.classList.remove('is-spinning'), 450);

      this.engine.shuffleLetters();
      this.positionLetterNodes();
    };

    this.container.querySelector('#centerShuffleBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      doShuffle();
    });

    this.container.querySelector('#flankShuffleBtn')?.addEventListener('click', () => {
      doShuffle();
    });

    // 3. Hint 1: Lightbulb
    this.container.querySelector('#hintLightbulbBtn')?.addEventListener('click', () => {
      this.handleLightbulbHint();
    });

    // 4. Hint 2: Target / Hammer Mode
    this.container.querySelector('#hintHammerBtn')?.addEventListener('click', () => {
      this.toggleHammerMode();
    });

    // 5. Bonus Jar Modal
    this.container.querySelector('#bonusJarBtn')?.addEventListener('click', () => {
      this.openBonusJarModal();
    });

    this.container.querySelector('#closeBonusJarBtn')?.addEventListener('click', () => {
      this.bonusJarModalEl.classList.remove('is-active');
    });

    this.container.querySelector('#bonusModalOkBtn')?.addEventListener('click', () => {
      this.bonusJarModalEl.classList.remove('is-active');
    });

    // 6. Victory Modal Next Level
    this.container.querySelector('#nextLevelBtn')?.addEventListener('click', () => {
      this.victoryModalEl.classList.remove('is-active');
      this.engine.nextLevel();
      this.render();
    });

    // 7. Level Info
    this.container.querySelector('#levelInfoBtn')?.addEventListener('click', () => {
      const lvl = this.engine.currentLevel;
      alert(`🏛️ ${lvl.wonder}\n📍 ${lvl.country}\nLevel ${this.engine.levelIndex + 1} of ${this.engine.levels.length}`);
    });
  }

  // ========================================================
  // TRIGONOMETRIC LETTER WHEEL LAYOUT
  // ========================================================
  positionLetterNodes() {
    if (!this.letterContainerEl || !this.wheelDiscEl) return;
    this.letterContainerEl.innerHTML = '';
    this.nodePositions = [];

    const rect = this.wheelDiscEl.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = rect.width * 0.355; // Distance from center to letter node center

    const letters = this.engine.wheelLetters;
    const total = letters.length;

    for (let i = 0; i < total; i++) {
      // Polar coordinates: theta starts at -PI/2 (12 o'clock)
      const theta = (2 * Math.PI * i) / total - Math.PI / 2;
      const x = cx + radius * Math.cos(theta);
      const y = cy + radius * Math.sin(theta);

      const node = document.createElement('div');
      node.className = 'wow-letter-node';
      node.dataset.index = i.toString();
      node.textContent = letters[i];
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;

      this.letterContainerEl.appendChild(node);

      this.nodePositions.push({
        index: i,
        letter: letters[i],
        x,
        y,
        el: node
      });
    }

    this.resizeCanvas();
    this.drawLaserTrail();
  }

  // ========================================================
  // POINTER & TOUCH GESTURE HANDLING
  // ========================================================
  handlePointerDown(e) {
    if (this.isTargetMode) return;
    const pt = this.getRelativePointer(e);
    const hit = this.hitTestNode(pt.x, pt.y);

    if (hit) {
      this.isDragging = true;
      this.selectedIndices = [hit.index];
      this.currentPointer = { x: pt.x, y: pt.y };
      hit.el.classList.add('is-selected');
      
      sound.playCardSnap();
      this.triggerHaptic('light');
      this.updateWordPreview();
      this.drawLaserTrail();
    }
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    const pt = this.getRelativePointer(e);
    this.currentPointer = { x: pt.x, y: pt.y };

    const hit = this.hitTestNode(pt.x, pt.y);
    if (hit) {
      const lastIndex = this.selectedIndices[this.selectedIndices.length - 1];
      // Backtracking (undo last letter if dragging back to previous node)
      if (this.selectedIndices.length > 1 && 
          hit.index === this.selectedIndices[this.selectedIndices.length - 2]) {
        const removedIndex = this.selectedIndices.pop();
        const removedNode = this.nodePositions[removedIndex];
        removedNode?.el.classList.remove('is-selected');
        sound.playCardSlide();
        this.triggerHaptic('light');
        this.updateWordPreview();
      } 
      // Connect new node if not yet selected
      else if (!this.selectedIndices.includes(hit.index)) {
        this.selectedIndices.push(hit.index);
        hit.el.classList.add('is-selected');
        sound.playCardSnap();
        this.triggerHaptic('light');
        this.updateWordPreview();
      }
    }

    this.drawLaserTrail();
  }

  handlePointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.currentPointer = null;

    // Submit spelled word
    const word = this.selectedIndices
      .map(idx => this.nodePositions[idx]?.letter)
      .join('');

    this.clearSelectionVisuals();

    if (word && word.length >= 2) {
      this.processWordSubmission(word);
    } else {
      this.resetWordPreview();
    }

    this.drawLaserTrail();
  }

  getRelativePointer(e) {
    const rect = this.wheelDiscEl.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  hitTestNode(px, py) {
    // Forgiving hit radius (34px) for comfortable outdoor walking
    const hitRadius = 34;
    for (const node of this.nodePositions) {
      const dx = px - node.x;
      const dy = py - node.y;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return node;
      }
    }
    return null;
  }

  clearSelectionVisuals() {
    this.nodePositions.forEach(n => n.el.classList.remove('is-selected'));
    this.selectedIndices = [];
  }

  // ========================================================
  // DYNAMIC CANVAS LASER TRACE DRAWING
  // ========================================================
  drawLaserTrail() {
    if (!this.ctx || !this.wheelDiscEl) return;
    const rect = this.wheelDiscEl.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    if (this.selectedIndices.length === 0) return;

    const points = this.selectedIndices.map(idx => ({
      x: this.nodePositions[idx].x,
      y: this.nodePositions[idx].y
    }));

    if (this.currentPointer) {
      points.push(this.currentPointer);
    }

    if (points.length < 2) return;

    this.ctx.save();

    // 1. Outer Neon Cyan Glow Pass
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    this.ctx.lineWidth = 14;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowBlur = 18;
    this.ctx.shadowColor = '#38bdf8';
    this.ctx.stroke();

    // 2. Inner Intense Laser Core Pass
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 4;
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#fbbf24';
    this.ctx.stroke();

    // 3. Fingertip Glowing Bead
    if (this.currentPointer) {
      this.ctx.beginPath();
      this.ctx.arc(this.currentPointer.x, this.currentPointer.y, 7, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(this.currentPointer.x, this.currentPointer.y, 3, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // ========================================================
  // WORD PREVIEW PILL LOGIC
  // ========================================================
  updateWordPreview() {
    const word = this.selectedIndices
      .map(idx => this.nodePositions[idx]?.letter)
      .join('');
    
    if (this.previewTextEl) {
      this.previewTextEl.textContent = word || 'CONNECT LETTERS';
    }
    if (this.previewPillEl) {
      this.previewPillEl.className = 'wow-word-preview is-typing';
    }
  }

  resetWordPreview() {
    if (this.previewTextEl) {
      this.previewTextEl.textContent = 'CONNECT LETTERS';
    }
    if (this.previewPillEl) {
      this.previewPillEl.className = 'wow-word-preview';
    }
  }

  // ========================================================
  // WORD SUBMISSION & ANIMATION ORCHESTRATION
  // ========================================================
  processWordSubmission(word) {
    const res = this.engine.submitWord(word);

    if (res.status === 'success') {
      this.handleSuccessWord(res);
    } else if (res.status === 'bonus') {
      this.handleBonusWord(res);
    } else if (res.status === 'already_found') {
      this.handleAlreadyFoundWord(word);
    } else {
      this.handleInvalidWord(word);
    }

    this.updateHUD();
  }

  handleSuccessWord(res) {
    this.triggerHaptic('celebrate');
    sound.playCardSnap();

    // 1. Glow Preview Pill in Emerald
    if (this.previewPillEl && this.previewTextEl) {
      this.previewTextEl.textContent = `✓ ${res.word}`;
      this.previewPillEl.className = 'wow-word-preview is-success';
    }

    // 2. Reveal newly uncovered crossword tiles with 3D Flip
    (res.newlyRevealed || []).forEach(({ row, col, letter }, idx) => {
      const cellEl = this.boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (cellEl) {
        setTimeout(() => {
          cellEl.textContent = letter;
          cellEl.classList.remove('is-slot');
          cellEl.classList.add('is-revealed', 'anim-flip');
          setTimeout(() => cellEl.classList.remove('anim-flip'), 600);
        }, idx * 100);
      }
    });

    // 3. Reset pill after animation
    setTimeout(() => {
      this.resetWordPreview();
      if (res.isLevelComplete) {
        this.triggerVictoryCelebration();
      }
    }, 1100);
  }

  handleBonusWord(res) {
    this.triggerHaptic('medium');
    sound.playCardSlide();

    if (this.previewPillEl && this.previewTextEl) {
      this.previewTextEl.textContent = `🏺 +5 🪙 ${res.word}!`;
      this.previewPillEl.className = 'wow-word-preview is-bonus';
    }

    // Pulse bonus jar button
    const jarBtn = this.container.querySelector('#bonusJarBtn');
    jarBtn?.classList.add('jar-pulse');
    setTimeout(() => jarBtn?.classList.remove('jar-pulse'), 1200);

    setTimeout(() => this.resetWordPreview(), 1100);
  }

  handleAlreadyFoundWord(word) {
    this.triggerHaptic('light');

    if (this.previewPillEl && this.previewTextEl) {
      this.previewTextEl.textContent = `Already Found: ${word}`;
      this.previewPillEl.className = 'wow-word-preview is-already-found';
    }

    setTimeout(() => this.resetWordPreview(), 1100);
  }

  handleInvalidWord(word) {
    this.triggerHaptic('light');

    if (this.previewPillEl && this.previewTextEl) {
      this.previewTextEl.textContent = word;
      this.previewPillEl.className = 'wow-word-preview is-invalid';
    }

    setTimeout(() => this.resetWordPreview(), 700);
  }

  // ========================================================
  // HINTS LOGIC
  // ========================================================
  handleLightbulbHint() {
    const res = this.engine.useLightbulb();
    if (!res.success) {
      alert(res.reason);
      return;
    }

    this.triggerHaptic('medium');
    const { row, col, letter } = res.cell;
    const cellEl = this.boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cellEl) {
      cellEl.textContent = letter;
      cellEl.classList.remove('is-slot');
      cellEl.classList.add('is-revealed', 'anim-flip');
      setTimeout(() => cellEl.classList.remove('anim-flip'), 600);
    }
    this.updateHUD();
  }

  toggleHammerMode() {
    const hammerBtn = this.container.querySelector('#hintHammerBtn');
    this.isTargetMode = !this.isTargetMode;
    hammerBtn?.classList.toggle('is-active-tool', this.isTargetMode);

    // Toggle target styling on all unrevealed cells
    const slots = this.boardEl.querySelectorAll('.wow-cell.is-slot');
    slots.forEach(slot => {
      slot.classList.toggle('target-selectable', this.isTargetMode);
    });

    if (this.isTargetMode) {
      this.previewTextEl.textContent = 'TAP ANY TILE TO REVEAL';
      this.previewPillEl.className = 'wow-word-preview is-typing';
    } else {
      this.resetWordPreview();
    }
  }

  handleHammerCellClick(row, col) {
    if (!this.isTargetMode) return;
    const res = this.engine.useHammer(row, col);
    this.toggleHammerMode(); // Exit target mode

    if (!res.success) {
      alert(res.reason);
      return;
    }

    this.triggerHaptic('medium');
    const cellEl = this.boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cellEl) {
      cellEl.textContent = res.cell.letter;
      cellEl.classList.remove('is-slot');
      cellEl.classList.add('is-revealed', 'anim-flip');
      setTimeout(() => cellEl.classList.remove('anim-flip'), 600);
    }
    this.updateHUD();
  }

  // ========================================================
  // BONUS JAR & VICTORY MODALS
  // ========================================================
  openBonusJarModal() {
    const listEl = this.container.querySelector('#bonusWordsList');
    if (listEl) {
      const words = Array.from(this.engine.bonusWordsFound);
      if (words.length === 0) {
        listEl.innerHTML = `<span style="color: #64748b; font-size: 0.82rem; width: 100%;">No bonus words discovered yet. Try spelling extra words!</span>`;
      } else {
        listEl.innerHTML = words.map(w => `<span class="wow-bonus-tag">${w}</span>`).join('');
      }
    }
    this.bonusJarModalEl.classList.add('is-active');
  }

  triggerVictoryCelebration() {
    sound.playStepGoalMet();
    this.triggerHaptic('celebrate');

    const vicTitle = this.container.querySelector('#vicWonderName');
    if (vicTitle) {
      vicTitle.textContent = this.engine.currentLevel.wonder;
    }
    this.victoryModalEl.classList.add('is-active');
  }

  triggerHaptic(type = 'light') {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(12);
      else if (type === 'medium') navigator.vibrate([18, 30, 18]);
      else if (type === 'celebrate') navigator.vibrate([50, 80, 50, 80, 150]);
    }
  }

  // ========================================================
  // RENDER COMPLETE BOARD & HUD
  // ========================================================
  render() {
    this.renderHUD();
    this.renderCrosswordGrid();
    this.positionLetterNodes();
    this.resetWordPreview();
  }

  renderHUD() {
    const lvl = this.engine.currentLevel;
    const wonderTitle = this.container.querySelector('#wonderTitle');
    const wonderCountry = this.container.querySelector('#wonderCountry');
    const wonderEmoji = this.container.querySelector('#wonderEmoji');

    const emojis = ['🏛️', '🏟️', '🕌', '⛰️', '🏜️', '🗼', '⛩️', '🗿'];
    const emoji = emojis[this.engine.levelIndex % emojis.length] || '🏛️';

    if (wonderTitle) wonderTitle.textContent = `Level ${this.engine.levelIndex + 1}: ${lvl.wonder}`;
    if (wonderCountry) wonderCountry.textContent = lvl.country.toUpperCase();
    if (wonderEmoji) wonderEmoji.textContent = emoji;

    this.updateHUD();
  }

  updateHUD() {
    const coinsEl = this.container.querySelector('#hudCoinsVal');
    const starsEl = this.container.querySelector('#hudStarsVal');
    const jarCountEl = this.container.querySelector('#bonusJarCount');

    if (coinsEl) coinsEl.textContent = this.engine.coins.toLocaleString();
    if (starsEl) starsEl.textContent = this.engine.stars.toLocaleString();
    if (jarCountEl) jarCountEl.textContent = `${this.engine.bonusWordsFound.size % 5}/5`;
  }

  renderCrosswordGrid() {
    if (!this.boardEl) return;
    const rows = this.engine.currentLevel.gridRows;
    const cols = this.engine.currentLevel.gridCols;

    this.boardEl.style.gridTemplateRows = `repeat(${rows}, var(--cell-size))`;
    this.boardEl.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
    this.boardEl.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellData = this.engine.grid[r][c];
        const cell = document.createElement('div');
        cell.className = 'wow-cell';
        cell.dataset.row = r.toString();
        cell.dataset.col = c.toString();

        if (!cellData) {
          cell.classList.add('is-empty');
        } else {
          if (cellData.isRevealed) {
            cell.classList.add('is-revealed');
            cell.textContent = cellData.letter;
          } else {
            cell.classList.add('is-slot');
            cell.textContent = '';
          }

          cell.addEventListener('click', () => {
            this.handleHammerCellClick(r, c);
          });
        }

        this.boardEl.appendChild(cell);
      }
    }
  }
}
