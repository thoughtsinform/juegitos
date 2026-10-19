/**
 * Spider Solitaire UI & DOM Controller
 * Features:
 * - Clean lifecycle management (destroy() removes timers and window listeners)
 * - Smart whole-run tap-to-move + column destination tap support
 * - Exact-deal Restart vs New Deal
 * - Auto-Finish banner when all face-down cards are flipped
 * - Non-blocking toast notifications & Victory Card Cascade canvas animation
 */

import { CardRenderer } from './card-renderer.js';
import { sound } from '../sound.js';
import { Icons } from '../icons.js';
import { showToast } from '../toast.js';

export class SpiderUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.onUserLogout = options.onUserLogout || (() => {});
    this.onUserSwitch = options.onUserSwitch || (() => {});
    this.currentUser = options.currentUser || { displayName: 'Ellen', avatar: 'assets/avatars/ellen.png' };

    if (!this.engine.startTime) this.engine.startTime = Date.now() - this.engine.elapsedSeconds * 1000;
    this.selectedMove = null; // { colIdx, cardIdx }
    this.drawerOpen = this.getDefaultDrawerState();
    this.hudTimer = null;
    this.cascadeRaf = null;
    this.onResizeBound = this.handleOrientationResize.bind(this);

    this.renderLayout();
    this.attachGlobalEvents();
    this.renderBoard();
  }

  destroy() {
    this.engine.startTime = null;
    this.engine.saveSession?.();
    if (this.hudTimer) {
      clearInterval(this.hudTimer);
      this.hudTimer = null;
    }
    if (this.cascadeRaf) {
      cancelAnimationFrame(this.cascadeRaf);
      this.cascadeRaf = null;
    }
    window.removeEventListener('resize', this.onResizeBound);
  }

  getDefaultDrawerState() {
    return false;
  }

  handleOrientationResize() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (!isPortrait && this.drawerOpen) {
      this.setDrawerState(false);

    }
    this.renderTableau();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="spider-game-wrapper ${this.drawerOpen ? 'drawer-open' : ''}" id="spiderWrapper">
        <!-- 1. Top HUD Bar: MOVES | TIME | SCORE -->
        <div class="spider-hud">
          <div class="hud-item">
            <span class="hud-label">MOVES</span>
            <span class="hud-val" id="hudMoves">0</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">TIME</span>
            <span class="hud-val" id="hudTime">00:00</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">SCORE</span>
            <span class="hud-val" id="hudScore">500</span>
          </div>
        </div>

        <!-- 2. Upper Board: Foundation (Left), Auto-Complete CTA (Center), Stock Pile (Right) -->
        <div class="spider-upper-board">
          <div class="foundation-area" id="foundationArea" title="Completed King-to-Ace Runs"></div>
          <div class="spider-center-cta" id="spiderCenterCta"></div>
          <div class="stock-area" id="stockArea" title="Tap to deal 10 cards (1 per column)"></div>
        </div>

        <div class="spider-tip">Build down from King to Ace. Move a run of the same suit together.</div>
        <div class="spider-quick-controls"><button type="button" id="spiderQuickUndo">Undo</button><button type="button" id="spiderQuickHint">Hint</button><button type="button" id="spiderQuickDeal">Deal 10</button></div>
        <!-- 3. Main 10-Column Tableau -->
        <div class="spider-tableau" id="tableauArea">
          ${Array.from({ length: 10 }, (_, idx) => `
            <div class="tableau-column" data-col="${idx}" id="col_${idx}"></div>
          `).join('')}
        </div>

        <!-- 4. Bottom Collapsible Control Drawer -->
        <div class="bottom-drawer-wrapper ${this.drawerOpen ? 'is-open' : ''}" id="bottomDrawer">
          <button class="drawer-chevron-btn" id="drawerToggleBtn" aria-label="Toggle Game Menu" title="Controls & Settings">
            ${Icons.chevronUp('drawer-chevron-svg', 18)}
          </button>

          <div class="drawer-content">
            <div class="drawer-quick-actions">
              <button class="drawer-action-btn" id="drawerUndoBtn">
                <span class="btn-icon">${Icons.undo('action-svg', 20)}</span>
                <span class="btn-text">Undo</span>
              </button>
              <button class="drawer-action-btn" id="drawerHintBtn">
                <span class="btn-icon">${Icons.lightbulb('action-svg', 20)}</span>
                <span class="btn-text">Hint</span>
              </button>
              <button class="drawer-action-btn" id="drawerDealBtn">
                <span class="btn-icon">${Icons.cards('action-svg', 20)}</span>
                <span class="btn-text">Deal 10</span>
              </button>
              <button class="drawer-action-btn" id="drawerNewGameBtn">
                <span class="btn-icon">${Icons.sparkle('action-svg', 20)}</span>
                <span class="btn-text">New Deal</span>
              </button>
            </div>

            <div class="drawer-section">
              <span class="drawer-section-title">Suit Difficulty (Starts Fresh Deal)</span>
              <div class="difficulty-pills">
                <button class="diff-pill ${this.engine.difficulty === 1 ? 'active' : ''}" data-diff="1">
                  1 Suit (Relaxed)
                </button>
                <button class="diff-pill ${this.engine.difficulty === 2 ? 'active' : ''}" data-diff="2">
                  2 Suits (Classic)
                </button>
                <button class="diff-pill ${this.engine.difficulty === 4 ? 'active' : ''}" data-diff="4">
                  4 Suits (Master)
                </button>
              </div>
            </div>

            <div class="drawer-footer-section">
              <div class="player-info-badge">
                <img class="player-avatar-img" src="${this.currentUser.avatar}" alt="${this.currentUser.displayName}">
                <span class="player-name">Playing as <strong>${this.currentUser.displayName}</strong></span>
              </div>
              <div class="drawer-footer-actions">
                <button class="drawer-link-btn" id="drawerRestartBtn" title="Replay this exact deal from move 0">Replay Hand</button>
                <button class="drawer-link-btn" id="drawerSwitchUserBtn">Switch Player</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Victory Modal Overlay with Physics Card Cascade Canvas -->
        <div class="victory-modal" id="victoryModal">
          <canvas class="victory-cascade-canvas" id="victoryCascadeCanvas"></canvas>
          <div class="victory-card">
            <div class="victory-trophy">${Icons.trophy('victory-trophy-svg', 56)}</div>
            <h2>Congratulations, ${this.currentUser.displayName}!</h2>
            <p>You cleared all 8 royal runs!</p>
            <div class="victory-stats">
              <div>Moves: <strong id="winMoves">0</strong></div>
              <div>Score: <strong id="winScore">0</strong></div>
              <div>Time: <strong id="winTime">00:00</strong></div>
            </div>
            <button class="btn-primary" id="winPlayAgainBtn">Deal Next Game</button>
          </div>
        </div>
      </div>
    `;
  }

  attachGlobalEvents() {
    this.container.querySelector('#spiderQuickUndo')?.addEventListener('click', () => this.handleUndo());
    this.container.querySelector('#spiderQuickHint')?.addEventListener('click', () => this.showHint());
    this.container.querySelector('#spiderQuickDeal')?.addEventListener('click', () => this.handleDealStock());
    window.addEventListener('resize', this.onResizeBound);

    const drawerToggle = this.container.querySelector('#drawerToggleBtn');
    drawerToggle?.addEventListener('click', () => {
      sound.playCardSlide();
      this.setDrawerState(!this.drawerOpen);
    });

    this.container.querySelector('#stockArea')?.addEventListener('click', () => {
      this.handleDealStock();
    });

    this.container.querySelector('#drawerUndoBtn')?.addEventListener('click', () => {
      this.handleUndo();
    });

    this.container.querySelector('#drawerHintBtn')?.addEventListener('click', () => {
      this.showHint();
    });

    this.container.querySelector('#drawerDealBtn')?.addEventListener('click', () => {
      this.handleDealStock();
    });

    this.container.querySelector('#drawerNewGameBtn')?.addEventListener('click', () => {
      this.startNewGame(this.engine.difficulty);
      showToast('Dealt a fresh Winning Hand', 'success', 1800);
    });

    this.container.querySelector('#drawerRestartBtn')?.addEventListener('click', () => {
      sound.playDealWhoosh(0);
      this.selectedMove = null;
      this.engine.restartCurrentDeal();
      this.renderBoard();
      showToast('Replaying current hand from Move 0', 'info', 2000);
    });

    this.container.querySelector('#drawerSwitchUserBtn')?.addEventListener('click', () => {
      this.onUserSwitch();
    });

    this.container.querySelectorAll('.diff-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const diff = parseInt(e.currentTarget.dataset.diff, 10);
        this.container.querySelectorAll('.diff-pill').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.startNewGame(diff);
        const label = diff === 1 ? '1 Suit (Relaxed)' : diff === 2 ? '2 Suits (Classic)' : '4 Suits (Master)';
        showToast(`Switched to ${label}`, 'info', 1800);
      });
    });

    this.container.querySelector('#winPlayAgainBtn')?.addEventListener('click', () => {
      if (this.cascadeRaf) {
        cancelAnimationFrame(this.cascadeRaf);
        this.cascadeRaf = null;
      }
      this.container.querySelector('#victoryModal')?.classList.remove('is-active');
      this.startNewGame(this.engine.difficulty);
    });

    // Empty column click handler (for moving a selected stack to an empty column)
    this.container.querySelectorAll('.tableau-column').forEach(colEl => {
      colEl.addEventListener('click', (e) => {
        if (e.target !== colEl) return;
        const toCol = parseInt(colEl.dataset.col, 10);
        if (this.selectedMove && this.engine.canMoveSequence(this.selectedMove.colIdx, this.selectedMove.cardIdx, toCol)) {
          this.executeMove(this.selectedMove.colIdx, this.selectedMove.cardIdx, toCol);
        }
      });
    });

    if (this.hudTimer) clearInterval(this.hudTimer);
    this.hudTimer = setInterval(() => {
      if (!this.engine.isWon && this.engine.startTime) {
        const secs = Math.floor((Date.now() - this.engine.startTime) / 1000);
        this.engine.elapsedSeconds = secs;
        const timeEl = this.container.querySelector('#hudTime');
        if (timeEl) timeEl.textContent = this.formatTime(secs);
      }
    }, 1000);
  }

  setDrawerState(open) {
    this.drawerOpen = open;
    const drawer = this.container.querySelector('#bottomDrawer');
    const wrapper = this.container.querySelector('#spiderWrapper');
    if (drawer) drawer.classList.toggle('is-open', open);
    if (wrapper) wrapper.classList.toggle('drawer-open', open);
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  startNewGame(difficulty) {
    sound.playDealWhoosh(0);
    this.selectedMove = null;
    this.engine.startNewGame(difficulty);
    this.renderBoard();
  }

  handleUndo() {
    if (this.engine.undo()) {
      sound.playCardSlide();
      this.selectedMove = null;
      this.renderBoard();
    } else {
      showToast('Already at the start of the deal', 'info', 1600);
    }
  }

  handleDealStock() {
    const check = this.engine.canDealStock();
    if (!check.allowed) {
      if (check.reason === 'empty_columns') {
        this.highlightEmptyColumns(check.emptyCols);
        showToast('Every column must have at least 1 card before dealing', 'warning', 2600);
      } else {
        showToast('No stock deals remaining', 'info', 1800);
      }
      return;
    }

    const res = this.engine.dealFromStock();
    if (res.success) {
      for (let i = 0; i < 6; i++) {
        sound.playDealWhoosh(i);
      }
      if (res.completedSuits.length > 0) {
        setTimeout(() => sound.playFoundationClear(), 280);
      }
      this.selectedMove = null;
      this.renderBoard();

      // Animate newly dealt bottom cards flying in from stock
      const cols = this.container.querySelectorAll('.tableau-column');
      cols.forEach((colEl, i) => {
        const cards = colEl.querySelectorAll('.solitaire-card');
        const lastCard = cards[cards.length - 1];
        if (lastCard) {
          lastCard.style.animationDelay = `${i * 25}ms`;
          lastCard.classList.add('deal-fly-in');
        }
      });

      this.checkWinCondition();
    }
  }

  highlightEmptyColumns(emptyCols) {
    sound.vibrate([30, 50, 30]);
    emptyCols.forEach(colIdx => {
      const colEl = this.container.querySelector(`#col_${colIdx}`);
      if (colEl) {
        colEl.classList.add('empty-col-warning');
        setTimeout(() => colEl.classList.remove('empty-col-warning'), 1400);
      }
    });
  }

  showHint() {
    const hint = this.engine.getHint();
    if (!hint) {
      showToast('No constructive moves left. Try Undo or Replay Hand!', 'warning', 2600);
      return;
    }

    sound.playCardSlide();

    if (hint.type === 'deal') {
      const stockEl = this.container.querySelector('#stockArea');
      stockEl?.classList.add('hint-glow');
      showToast('Hint: Tap the Stock pile to deal 10 new cards', 'info', 2200);
      setTimeout(() => stockEl?.classList.remove('hint-glow'), 1600);
      return;
    }

    const fromColEl = this.container.querySelector(`#col_${hint.fromCol}`);
    const toColEl = this.container.querySelector(`#col_${hint.toCol}`);

    if (fromColEl) {
      const cards = fromColEl.querySelectorAll('.solitaire-card');
      cards.forEach((cardEl, idx) => {
        if (idx >= hint.cardIdx) {
          cardEl.classList.add('hint-glow');
          setTimeout(() => cardEl.classList.remove('hint-glow'), 1600);
        }
      });
    }

    if (toColEl) {
      toColEl.classList.add('hint-dest-glow');
      setTimeout(() => toColEl.classList.remove('hint-dest-glow'), 1600);
    }
  }

  runAutoComplete() {
    const step = () => {
      if (this.engine.isWon) return;
      const hint = this.engine.getHint();
      if (!hint || hint.type !== 'move') return;

      const res = this.engine.moveSequence(hint.fromCol, hint.cardIdx, hint.toCol);
      if (res.success) {
        sound.playCardSnap();
        if (res.completedSuit) sound.playFoundationClear();
        this.renderBoard();
        if (this.engine.isWon) {
          this.checkWinCondition();
        } else {
          setTimeout(step, 140);
        }
      }
    };
    step();
  }

  renderBoard() {
    this.updateHUD();
    this.renderFoundation();
    this.renderAutoCompleteCTA();
    this.renderStock();
    this.renderTableau();
  }

  updateHUD() {
    const movesEl = this.container.querySelector('#hudMoves');
    const scoreEl = this.container.querySelector('#hudScore');
    if (movesEl) movesEl.textContent = this.engine.moves;
    if (scoreEl) scoreEl.textContent = this.engine.score;
  }

  renderAutoCompleteCTA() {
    const ctaEl = this.container.querySelector('#spiderCenterCta');
    if (!ctaEl) return;

    if (this.engine.canAutoComplete()) {
      ctaEl.innerHTML = `
        <button type="button" class="spider-autocomplete-btn" id="spiderAutoCompleteBtn">
          ${Icons.sparkle('auto-svg', 16)} <span>Auto-Finish</span>
        </button>
      `;
      ctaEl.querySelector('#spiderAutoCompleteBtn')?.addEventListener('click', () => {
        this.runAutoComplete();
      });
    } else {
      ctaEl.innerHTML = '';
    }
  }

  renderFoundation() {
    const foundationEl = this.container.querySelector('#foundationArea');
    if (!foundationEl) return;

    const completedCount = this.engine.foundations.length;
    let html = `
      <div class="foundation-slot">
        <div class="foundation-spider-watermark">
          ${CardRenderer.getSpiderWatermarkSVG()}
        </div>
        <span class="foundation-counter-badge">${completedCount}/8</span>
      </div>
    `;

    this.engine.foundations.forEach((suit, idx) => {
      const offset = idx * 8;
      const kingCard = { suit, rank: 13, label: 'K', faceUp: true };
      html += `
        <div class="foundation-completed-card" style="left: ${offset}px; z-index: ${idx + 2}">
          ${CardRenderer.renderCardFace(kingCard)}
        </div>
      `;
    });

    foundationEl.innerHTML = html;
  }

  renderStock() {
    const stockEl = this.container.querySelector('#stockArea');
    if (!stockEl) return;

    const dealsRemaining = Math.floor(this.engine.stock.length / 10);
    if (dealsRemaining === 0) {
      stockEl.innerHTML = `<div class="empty-stock-placeholder" title="Stock Empty"></div>`;
      return;
    }

    let html = '';
    for (let i = 0; i < dealsRemaining; i++) {
      const rightOffset = (dealsRemaining - 1 - i) * 8;
      html += `
        <div class="stock-fanned-card" style="right: ${rightOffset}px; z-index: ${i + 1}">
          ${CardRenderer.renderStockCardBack()}
        </div>
      `;
    }
    html += `<span class="stock-deals-badge">${dealsRemaining}</span>`;
    stockEl.innerHTML = html;
  }

  renderTableau() {
    const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;

    for (let colIdx = 0; colIdx < 10; colIdx++) {
      const colEl = this.container.querySelector(`#col_${colIdx}`);
      if (!colEl) continue;

      const cards = this.engine.columns[colIdx];
      colEl.innerHTML = '';

      // Dynamic vertical spacing so deep stacks never clip off the bottom of the screen
      const faceDownCount = cards.filter(c => !c.faceUp).length;
      const faceUpCount = cards.length - faceDownCount;
      const faceDownStep = isPortrait ? 7 : 8;
      const maxFaceUpStep = isPortrait ? 24 : 26;
      const availableFaceUpSpace = isPortrait ? 250 : 210;
      const faceUpStep = faceUpCount > 1
        ? Math.max(17, Math.min(maxFaceUpStep, Math.floor((availableFaceUpSpace - faceDownCount * faceDownStep) / faceUpCount)))
        : maxFaceUpStep;

      let currentTop = 0;

      cards.forEach((card, cardIdx) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'solitaire-card';
        cardDiv.dataset.col = colIdx;
        cardDiv.dataset.index = cardIdx;
        cardDiv.style.top = `${currentTop}px`;
        cardDiv.style.zIndex = cardIdx + 1;

        if (card.faceUp) {
          cardDiv.innerHTML = CardRenderer.renderCardFace(card);
          const isMovable = this.engine.isValidSequence(colIdx, cardIdx);
          if (isMovable) {
            cardDiv.classList.add('can-move');
          } else {
            cardDiv.classList.add('is-blocked-sequence');
          }
          if (
            this.selectedMove &&
            this.selectedMove.colIdx === colIdx &&
            cardIdx >= this.selectedMove.cardIdx
          ) {
            cardDiv.classList.add('selected-glow');
          }
          currentTop += faceUpStep;
        } else {
          cardDiv.innerHTML = CardRenderer.renderTableauCardBack();
          cardDiv.classList.add('is-facedown');
          currentTop += faceDownStep;
        }

        this.wireCardInteraction(cardDiv, colIdx, cardIdx);
        colEl.appendChild(cardDiv);
      });
    }
  }

  executeMove(fromCol, startIndex, toCol) {
    const moving = [...this.container.querySelectorAll(`#col_${fromCol} .solitaire-card`)].slice(startIndex).map(el => el.getBoundingClientRect());
    const res = this.engine.moveSequence(fromCol, startIndex, toCol);
    if (res.success) {
      sound.playCardSnap();
      if (res.completedSuit) {
        setTimeout(() => sound.playFoundationClear(), 200);
      }
      this.selectedMove = null;
      this.renderBoard();
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !res.completedSuit) {
        const target = [...this.container.querySelectorAll(`#col_${toCol} .solitaire-card`)].slice(-moving.length);
        target.forEach((el, i) => {
          const rect = el.getBoundingClientRect(), from = moving[i];
          el.animate([{ transform: `translate(${from.left - rect.left}px, ${from.top - rect.top}px) scale(1.04)` }, { transform: 'translate(0,0) scale(1)' }], { duration: 260, easing: 'cubic-bezier(.18,.89,.32,1.12)' });
        });
      }
      this.checkWinCondition();
      return true;
    }
    return false;
  }

  wireCardInteraction(cardEl, colIdx, cardIdx) {
    let drag = null, dragged = false;
    cardEl.addEventListener('pointerdown', e => {
      if (!this.engine.isValidSequence(colIdx, cardIdx)) return;
      drag = { x: e.clientX, y: e.clientY };
      dragged = false;
      cardEl.setPointerCapture(e.pointerId);
    });
    cardEl.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 8) dragged = true;
      if (!dragged) return;
      cardEl.parentElement.style.zIndex = '50';
      [...cardEl.parentElement.children].slice(cardIdx).forEach(el => { el.style.transform = `translate(${dx}px, ${dy}px)`; el.style.pointerEvents = 'none'; });
    });
    const resetDrag = () => {
      const parent = cardEl.parentElement;
      if (parent) { parent.style.zIndex = ''; [...parent.children].forEach(el => { el.style.transform = ''; el.style.pointerEvents = ''; }); }
      drag = null;
    };
    cardEl.addEventListener('pointercancel', resetDrag);
    cardEl.addEventListener('pointerup', e => {
      if (!drag) return;
      const didDrag = dragged;
      resetDrag();
      if (!didDrag) return;
      const candidates = [...this.container.querySelectorAll('.tableau-column')].map((el, col) => ({ col, rect: el.getBoundingClientRect() }));
      const dest = candidates.filter(t => this.engine.canMoveSequence(colIdx, cardIdx, t.col)).sort((a,b) => Math.abs(e.clientX - (a.rect.left + a.rect.width / 2)) - Math.abs(e.clientX - (b.rect.left + b.rect.width / 2)))[0];
      if (dest && Math.abs(e.clientX - (dest.rect.left + dest.rect.width / 2)) < Math.max(50, dest.rect.width)) this.executeMove(colIdx, cardIdx, dest.col);
    });
    if (this.engine.columns[colIdx][cardIdx]?.faceUp) {
      const card = this.engine.columns[colIdx][cardIdx];
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('tabindex', '0');
      cardEl.setAttribute('aria-label', `${card.rank} of ${card.suit}, column ${colIdx + 1}`);
      cardEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cardEl.click(); } });
    }
    cardEl.addEventListener('click', (e) => {
      if (dragged) { dragged = false; return; }
      e.stopPropagation();

      // 1. If a card stack is currently selected in ANOTHER column, check if this column is a valid drop target!
      if (this.selectedMove && this.selectedMove.colIdx !== colIdx) {
        if (this.engine.canMoveSequence(this.selectedMove.colIdx, this.selectedMove.cardIdx, colIdx)) {
          this.executeMove(this.selectedMove.colIdx, this.selectedMove.cardIdx, colIdx);
          return;
        }
      }

      // 2. Otherwise, check if the tapped card is part of a movable sequence
      if (!this.engine.isValidSequence(colIdx, cardIdx)) {
        this.selectedMove = null;
        cardEl.classList.add('card-shake');
        setTimeout(() => cardEl.classList.remove('card-shake'), 300);
        return;
      }

      // 3. Smart Tap-to-Move: automatically expands to the whole same-suit run and moves to best destination
      const bestDest = this.engine.findBestDestination(colIdx, cardIdx);
      if (bestDest !== null) {
        this.executeMove(colIdx, bestDest.startIndex, bestDest.toCol);
      } else {
        // Toggle selection so player can inspect or tap another column manually
        const runTop = this.engine.getHighestMovableRunIndex(colIdx, cardIdx);
        if (this.selectedMove && this.selectedMove.colIdx === colIdx && this.selectedMove.cardIdx === runTop) {
          this.selectedMove = null;
        } else {
          this.selectedMove = { colIdx, cardIdx: runTop };
          cardEl.classList.add('card-shake');
          setTimeout(() => cardEl.classList.remove('card-shake'), 300);
        }
        this.renderTableau();
      }
    });
  }

  checkWinCondition() {
    if (this.engine.isWon) {
      sound.playStepGoalMet();
      const modal = this.container.querySelector('#victoryModal');
      if (modal) {
        this.container.querySelector('#winMoves').textContent = this.engine.moves;
        this.container.querySelector('#winScore').textContent = this.engine.score;
        this.container.querySelector('#winTime').textContent = this.formatTime(this.engine.elapsedSeconds);
        modal.classList.add('is-active');
        this.startVictoryCascade();
      }
    }
  }

  startVictoryCascade() {
    const canvas = this.container.querySelector('#victoryCascadeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: -60 - (i * 40),
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      isRed: i % 2 !== 0
    }));

    const renderFrame = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity

        if (p.y + 72 > canvas.height) {
          p.y = canvas.height - 72;
          p.vy = -p.vy * 0.78;
        }
        if (p.x < -60 || p.x > canvas.width + 60) {
          p.x = Math.random() * canvas.width;
          p.y = -70;
          p.vy = 2;
        }

        ctx.fillStyle = '#fffdf9';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, 52, 72, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = p.isRed ? '#dc2626' : '#1e293b';
        ctx.font = 'bold 18px Georgia, serif';
        ctx.fillText('K', p.x + 7, p.y + 20);

        // Draw crisp vector diamond pip in card center
        const cx = p.x + 26;
        const cy = p.y + 42;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx + 8, cy);
        ctx.lineTo(cx, cy + 10);
        ctx.lineTo(cx - 8, cy);
        ctx.closePath();
        ctx.fill();
      }

      this.cascadeRaf = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }
}
