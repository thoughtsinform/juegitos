/**
 * Words of Wonders (WoW) - UI Controller & Touch Anagram Wheel
 * Zen Nature Wonder Aesthetic | Pure Vector Iconography (Zero Emojis)
 * High-performance Canvas Laser Trace & Trigonometric Letter Placement
 */

import { sound } from '../sound.js';
import { Icons } from '../icons.js';

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
    this.isTargetMode = false; // Hammer/Target hint active

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
              <span class="wow-wonder-icon" id="wonderIcon">${Icons.monument('hud-monument-icon', 18)}</span>
              <span id="wonderTitle">Level 1: Giza</span>
            </div>
            <div class="wow-level-country" id="wonderCountry">EGYPT</div>
          </div>

          <div class="wow-hud-stats">
            <button type="button" class="wow-bonus-jar-btn" id="bonusJarBtn" title="View Bonus Word Jar" aria-label="Bonus words jar">
              ${Icons.jar('hud-jar-icon', 18)}
              <span id="bonusJarCount">0/5</span>
            </button>
            <div class="wow-stat-pill coins" title="Coins for hints">
              ${Icons.coin('hud-coin-icon', 16)}
              <span id="hudCoinsVal">100</span>
            </div>
            <div class="wow-stat-pill stars" title="Total Stars">
              ${Icons.star('hud-star-icon', 16)}
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
              <button type="button" class="wow-tool-btn tool-hint" id="hintLightbulbBtn" title="Reveal random letter (25 coins)" aria-label="Random letter hint">
                <span class="tool-icon-wrap">${Icons.lightbulb('tool-svg', 20)}</span>
                <span class="tool-cost-badge">25</span>
              </button>
              <button type="button" class="wow-tool-btn tool-target" id="hintHammerBtn" title="Target specific tile (25 coins)" aria-label="Target tile hint">
                <span class="tool-icon-wrap">${Icons.hammer('tool-svg', 20)}</span>
                <span class="tool-cost-badge">25</span>
              </button>
            </div>

            <!-- The Touch Anagram Wheel Disc -->
            <div class="wow-wheel-disc" id="wheelDisc">
              <canvas class="wow-wheel-canvas" id="wheelCanvas"></canvas>
              
              <!-- Center Shuffle Button in Wheel Hub -->
              <button type="button" class="wow-wheel-center-shuffle" id="centerShuffleBtn" title="Shuffle letters" aria-label="Shuffle letters">
                ${Icons.shuffle('center-shuffle-svg', 18)}
              </button>

              <!-- Letter nodes will be injected here via trigonometry -->
              <div id="letterNodesContainer"></div>
            </div>

            <!-- Right Action Tools -->
            <div class="wow-tools-col tools-right">
              <button type="button" class="wow-tool-btn tool-shuffle" id="flankShuffleBtn" title="Shuffle letters" aria-label="Shuffle letters">
                <span class="tool-icon-wrap">${Icons.shuffle('tool-svg', 18)}</span>
              </button>
              <button type="button" class="wow-tool-btn tool-info" id="levelInfoBtn" title="Level information & rules" aria-label="Game rules and information">
                <span class="tool-icon-wrap">${Icons.monument('tool-svg', 18)}</span>
              </button>
            </div>
          </div>
        </footer>

        <!-- 5. Bonus Word Jar Modal -->
        <div class="wow-modal-overlay" id="bonusJarModal">
          <div class="wow-modal-card">
            <div class="wow-modal-header">
              <div class="wow-modal-title">
                ${Icons.jar('modal-jar-icon', 22)}
                <span>Bonus Words Jar</span>
              </div>
              <button type="button" class="wow-modal-close-btn" id="closeBonusJarBtn" aria-label="Close">${Icons.close('', 16)}</button>
            </div>
            <p style="font-size: 0.88rem; color: #94a3b8; margin: 0; line-height: 1.4;">
              Discovered valid English words that aren't part of the crossword board. Every 5 bonus words award <b>+1 Star & +25 Coins</b>!
            </p>
            <div class="wow-bonus-words-list" id="bonusWordsList">
              <span style="color: #64748b; font-size: 0.82rem; width: 100%;">No bonus words discovered yet. Try spelling extra words!</span>
            </div>
            <button type="button" class="wow-btn-primary" id="bonusModalOkBtn">Keep Playing</button>
          </div>
        </div>

        <!-- 6. Wonder Info & Rules Modal -->
        <div class="wow-modal-overlay" id="levelInfoModal">
          <div class="wow-info-card">
            <div class="wow-modal-header">
              <div class="wow-modal-title">
                ${Icons.monument('info-modal-icon', 22)}
                <span id="infoModalWonderTitle">Wonder Guide</span>
              </div>
              <button type="button" class="wow-modal-close-btn" id="closeInfoModalBtn" aria-label="Close">${Icons.close('', 16)}</button>
            </div>
            
            <p id="infoModalWonderDesc" style="font-size: 0.88rem; color: #cbd5e1; margin: 0; line-height: 1.45;"></p>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div class="wow-info-guide-row">
                <div class="wow-info-icon-badge">${Icons.tiles('', 18)}</div>
                <div><b>Crossword:</b> Drag across letter nodes on the wheel to spell words and solve the crossword grid.</div>
              </div>
              <div class="wow-info-guide-row">
                <div class="wow-info-icon-badge">${Icons.coin('', 18)}</div>
                <div><b>Coins:</b> Earn +10 per word and +50 per completed Wonder. Spend 25 coins on Lightbulb or Target hints when stuck.</div>
              </div>
              <div class="wow-info-guide-row">
                <div class="wow-info-icon-badge">${Icons.star('', 18)}</div>
                <div><b>Stars:</b> Earn +3 stars per completed Wonder and +1 per 5 bonus words. Compete on the Family Leaderboard!</div>
              </div>
            </div>

            <button type="button" class="wow-btn-primary" id="infoModalOkBtn">Back to Puzzle</button>
          </div>
        </div>

        <!-- 7. Wonder Victory Celebration Modal -->
        <div class="wow-modal-overlay" id="victoryModal">
          <div class="wow-victory-card">
            <span class="wow-victory-trophy">${Icons.trophy('vic-trophy-svg', 54)}</span>
            <h2 style="color: #fef3c7; font-size: 1.5rem; margin: 0;">Wonder Completed!</h2>
            <p id="vicWonderName" style="color: #38bdf8; font-weight: 700; margin: 0; font-size: 1.1rem;">Great Pyramid of Giza</p>
            <p style="color: #94a3b8; font-size: 0.9rem; margin: 0;">All crossword words solved!</p>
            <div style="display: flex; gap: 16px; margin: 8px 0;">
              <span style="color: #fbbf24; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
                ${Icons.star('', 18)} +3 Stars
              </span>
              <span style="color: #fcd34d; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
                ${Icons.coin('', 18)} +50 Coins
              </span>
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
    this.infoModalEl = this.container.querySelector('#levelInfoModal');
    this.victoryModalEl = this.container.querySelector('#victoryModal');
  }

  initCanvas() {
    if (!this.canvasEl || !this.wheelDiscEl) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = this.wheelDiscEl.getBoundingClientRect();
    const size = rect.width || 280;

    this.canvasEl.width = size * dpr;
    this.canvasEl.height = size * dpr;
    this.canvasEl.style.width = `${size}px`;
    this.canvasEl.style.height = `${size}px`;

    this.ctx = this.canvasEl.getContext('2d');
    this.ctx.scale(dpr, dpr);
    this.dpr = dpr;
  }

  wireEvents() {
    // 1. Drag interaction on Wheel Disc (PointerEvents for touch + mouse)
    if (this.wheelDiscEl) {
      this.wheelDiscEl.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      window.addEventListener('pointermove', (e) => this.onPointerMove(e));
      window.addEventListener('pointerup', (e) => this.onPointerUp(e));
      window.addEventListener('pointercancel', (e) => this.onPointerUp(e));
    }

    // 2. Shuffle Buttons
    const doShuffle = () => {
      this.triggerHaptic('light');
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

    // 6. Level Info & Rules Modal
    this.container.querySelector('#levelInfoBtn')?.addEventListener('click', () => {
      this.openInfoModal();
    });

    this.container.querySelector('#closeInfoModalBtn')?.addEventListener('click', () => {
      this.infoModalEl.classList.remove('is-active');
    });

    this.container.querySelector('#infoModalOkBtn')?.addEventListener('click', () => {
      this.infoModalEl.classList.remove('is-active');
    });

    // 7. Victory Modal Next Level
    this.container.querySelector('#nextLevelBtn')?.addEventListener('click', () => {
      this.victoryModalEl.classList.remove('is-active');
      this.engine.nextLevel();
      this.render();
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

    // Distribute evenly around the circle starting from top (-pi/2)
    const angleStep = (2 * Math.PI) / total;

    for (let i = 0; i < total; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      const nodeEl = document.createElement('div');
      nodeEl.className = 'wow-letter-node';
      nodeEl.dataset.index = i.toString();
      nodeEl.textContent = letters[i];
      nodeEl.style.left = `${x}px`;
      nodeEl.style.top = `${y}px`;

      this.letterContainerEl.appendChild(nodeEl);

      this.nodePositions.push({
        index: i,
        letter: letters[i],
        x,
        y,
        radius: 30, // Hit testing radius
        el: nodeEl
      });
    }

    this.clearCanvas();
  }

  // ========================================================
  // TOUCH / MOUSE DRAG & HIT TESTING
  // ========================================================
  getWheelRelativeCoords(e) {
    const rect = this.wheelDiscEl.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  findNodeAtCoords(coords) {
    for (const node of this.nodePositions) {
      const dx = coords.x - node.x;
      const dy = coords.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= node.radius) {
        return node;
      }
    }
    return null;
  }

  onPointerDown(e) {
    if (this.isTargetMode) return;
    const coords = this.getWheelRelativeCoords(e);
    const node = this.findNodeAtCoords(coords);

    if (node) {
      this.isDragging = true;
      this.selectedIndices = [node.index];
      this.currentPointer = coords;

      sound.initAudio();
      sound.playCardSnap();
      this.triggerHaptic('light');

      this.updateWheelSelectionVisuals();
      this.updateWordPreview();
      this.drawConnectingLines();
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    const coords = this.getWheelRelativeCoords(e);
    this.currentPointer = coords;

    const node = this.findNodeAtCoords(coords);
    if (node) {
      const existingIdx = this.selectedIndices.indexOf(node.index);

      if (existingIdx === -1) {
        // New letter added to trail!
        this.selectedIndices.push(node.index);
        sound.playCardSnap();
        this.triggerHaptic('light');
        this.updateWheelSelectionVisuals();
        this.updateWordPreview();
      } else if (existingIdx === this.selectedIndices.length - 2) {
        // Backtracked one letter: pop last selected
        this.selectedIndices.pop();
        sound.playCardSlide();
        this.triggerHaptic('light');
        this.updateWheelSelectionVisuals();
        this.updateWordPreview();
      }
    }

    this.drawConnectingLines();
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.currentPointer = null;

    const spelledWord = this.selectedIndices
      .map(idx => this.nodePositions[idx]?.letter || '')
      .join('');

    this.handleWordSubmit(spelledWord);
    this.selectedIndices = [];
    this.updateWheelSelectionVisuals();
    this.clearCanvas();
  }

  updateWheelSelectionVisuals() {
    this.nodePositions.forEach(node => {
      const isSelected = this.selectedIndices.includes(node.index);
      node.el.classList.toggle('is-selected', isSelected);
    });
  }

  // ========================================================
  // CANVAS LASER LINE DRAWING
  // ========================================================
  clearCanvas() {
    if (!this.ctx || !this.canvasEl) return;
    this.ctx.clearRect(0, 0, this.canvasEl.width / this.dpr, this.canvasEl.height / this.dpr);
  }

  drawConnectingLines() {
    this.clearCanvas();
    if (this.selectedIndices.length === 0 || !this.ctx) return;

    const points = this.selectedIndices.map(idx => ({
      x: this.nodePositions[idx].x,
      y: this.nodePositions[idx].y
    }));

    if (this.currentPointer) {
      points.push(this.currentPointer);
    }

    if (points.length < 2) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Outer Cyan Glow
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.lineWidth = 14;
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    this.ctx.stroke();

    // Medium Laser Line
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
    this.ctx.stroke();

    // Inner White Core
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();

    this.ctx.restore();
  }

  // ========================================================
  // FLOATING WORD PREVIEW
  // ========================================================
  updateWordPreview() {
    if (!this.previewPillEl || !this.previewTextEl) return;
    const word = this.selectedIndices
      .map(idx => this.nodePositions[idx]?.letter || '')
      .join('');

    if (word.length > 0) {
      this.previewTextEl.textContent = word;
      this.previewPillEl.className = 'wow-word-preview is-typing';
    } else {
      this.resetWordPreview();
    }
  }

  resetWordPreview() {
    if (!this.previewPillEl || !this.previewTextEl) return;
    this.previewPillEl.className = 'wow-word-preview';
    this.previewTextEl.textContent = 'CONNECT LETTERS';
  }

  // ========================================================
  // WORD SUBMISSION & VALIDATION
  // ========================================================
  handleWordSubmit(word) {
    if (!word || word.length < 2) {
      this.resetWordPreview();
      return;
    }

    const res = this.engine.submitWord(word);

    if (res.status === 'success') {
      // 1. Success on crossword board
      this.triggerHaptic('celebrate');
      this.previewPillEl.className = 'wow-word-preview is-success';
      this.previewTextEl.innerHTML = `${Icons.check('pill-check-svg', 16)} ${res.word}`;

      // Reveal matching cells
      res.newlyRevealed.forEach(({ row, col, letter }) => {
        const cellEl = this.boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cellEl) {
          cellEl.textContent = letter;
          cellEl.classList.remove('is-slot');
          cellEl.classList.add('is-revealed', 'anim-flip');
          setTimeout(() => cellEl.classList.remove('anim-flip'), 600);
        }
      });

      this.updateHUD();

      if (res.isLevelComplete) {
        setTimeout(() => this.triggerVictoryCelebration(), 500);
      }
    } else if (res.status === 'bonus') {
      // 2. Bonus Word added to Jar
      this.triggerHaptic('medium');
      this.previewPillEl.className = 'wow-word-preview is-bonus';
      this.previewTextEl.innerHTML = `${Icons.jar('pill-jar-svg', 16)} +5 Coins: ${res.word}!`;

      const jarBtn = this.container.querySelector('#bonusJarBtn');
      jarBtn?.classList.add('jar-pulse');
      setTimeout(() => jarBtn?.classList.remove('jar-pulse'), 1000);

      this.updateHUD();

      if (res.jarFilled) {
        sound.playStepGoalMet();
        alert(`Bonus Jar Full! Earned +1 Star & +25 Coins!`);
      }
    } else if (res.status === 'already_found' || res.status === 'already_found_bonus') {
      // 3. Already found word
      this.triggerHaptic('light');
      this.previewPillEl.className = 'wow-word-preview is-already';
      this.previewTextEl.textContent = `${res.word} ALREADY FOUND`;
    } else {
      // 4. Invalid word (rejected!)
      this.triggerHaptic('light');
      this.previewPillEl.className = 'wow-word-preview is-error';
      this.previewTextEl.textContent = `${word} NOT IN PUZZLE`;

      // Shake crossword board
      this.boardEl.classList.add('anim-shake');
      setTimeout(() => this.boardEl.classList.remove('anim-shake'), 400);
    }

    setTimeout(() => this.resetWordPreview(), 800);
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

    if (res.isLevelComplete) {
      setTimeout(() => this.triggerVictoryCelebration(), 500);
    }
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
      this.previewPillEl.className = 'wow-word-preview is-target-mode';
      this.previewTextEl.innerHTML = `${Icons.hammer('pill-target-icon', 16)} TAP ANY UNSOLVED TILE`;
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

    if (res.isLevelComplete) {
      setTimeout(() => this.triggerVictoryCelebration(), 500);
    }
  }

  // ========================================================
  // MODALS
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

  openInfoModal() {
    const lvl = this.engine.currentLevel;
    const titleEl = this.container.querySelector('#infoModalWonderTitle');
    const descEl = this.container.querySelector('#infoModalWonderDesc');

    if (titleEl) {
      titleEl.textContent = `${lvl.wonder} (${lvl.country})`;
    }
    if (descEl) {
      descEl.textContent = lvl.description || 'Explore ancient architectural marvels while discovering words.';
    }

    this.infoModalEl.classList.add('is-active');
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

    if (wonderTitle) wonderTitle.textContent = `Level ${this.engine.levelIndex + 1}: ${lvl.wonder}`;
    if (wonderCountry) wonderCountry.textContent = lvl.country.toUpperCase();

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
