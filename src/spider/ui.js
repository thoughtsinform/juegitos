/**
 * Spider Solitaire UI Controller
 * Handles rendering, touch/mouse drag-and-drop, tap-to-move, animations,
 * hints, bottom drawer menu, and sound triggers.
 */

import { CardRenderer } from './card-renderer.js';
import { sound } from '../sound.js';

export class SpiderUI {
  constructor(engine, container, options = {}) {
    this.engine = engine;
    this.container = container;
    this.onUserLogout = options.onUserLogout || (() => {});
    this.onUserSwitch = options.onUserSwitch || (() => {});
    this.currentUser = options.currentUser || 'Ellen';

    this.selectedSequence = null; // For tap-to-move
    this.draggedData = null; // For drag-and-drop
    this.hintTimer = null;

    this.initDOM();
    this.attachGlobalEvents();
    this.render();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="spider-game-wrapper" id="spiderGameWrapper">
        <!-- Top HUD (Stats) -->
        <div class="spider-hud">
          <div class="hud-item hud-moves">
            <span class="hud-label">MOVES</span>
            <span class="hud-val" id="hudMovesVal">0</span>
          </div>
          <div class="hud-item hud-time">
            <span class="hud-label">TIME</span>
            <span class="hud-val" id="hudTimeVal">0:00</span>
          </div>
          <div class="hud-item hud-score">
            <span class="hud-label">SCORE</span>
            <span class="hud-val" id="hudScoreVal">500</span>
          </div>
        </div>

        <!-- Upper Board: Foundation (left) and Stock Fan (right) -->
        <div class="spider-upper-board">
          <div class="foundation-area" id="foundationArea">
            <!-- Completed runs will stack here -->
          </div>

          <div class="stock-area" id="stockArea" title="Deal Cards">
            <!-- 5-layer stock card fan -->
          </div>
        </div>

        <!-- Tableau: 10 Columns -->
        <div class="spider-tableau" id="spiderTableau">
          ${Array.from({ length: 10 }, (_, i) => `<div class="tableau-column" data-col="${i}"></div>`).join('')}
        </div>

        <!-- Bottom Chevron & Expandable Drawer -->
        <div class="bottom-drawer-wrapper" id="bottomDrawerWrapper">
          <button class="drawer-chevron-btn" id="drawerChevronBtn" aria-label="Toggle Menu">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>

          <div class="drawer-content" id="drawerContent">
            <div class="drawer-row drawer-quick-actions">
              <button class="drawer-action-btn" id="drawerUndoBtn">
                <span class="btn-icon">↩️</span>
                <span class="btn-text">Undo</span>
              </button>
              <button class="drawer-action-btn" id="drawerHintBtn">
                <span class="btn-icon">💡</span>
                <span class="btn-text">Hint</span>
              </button>
              <button class="drawer-action-btn" id="drawerNewGameBtn">
                <span class="btn-icon">✨</span>
                <span class="btn-text">New Game</span>
              </button>
              <button class="drawer-action-btn" id="drawerRestartBtn">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">Restart</span>
              </button>
            </div>

            <div class="drawer-section">
              <span class="drawer-section-title">Game Difficulty</span>
              <div class="difficulty-pills">
                <button class="diff-pill ${this.engine.difficulty === 1 ? 'active' : ''}" data-diff="1">1 Suit (Easy)</button>
                <button class="diff-pill ${this.engine.difficulty === 2 ? 'active' : ''}" data-diff="2">2 Suits (Normal)</button>
                <button class="diff-pill ${this.engine.difficulty === 4 ? 'active' : ''}" data-diff="4">4 Suits (Hard)</button>
              </div>
            </div>

            <div class="drawer-section drawer-footer-section">
              <div class="player-info-badge">
                <span class="player-avatar">${this.currentUser.avatar || '👤'}</span>
                <span class="player-name">Playing as <b>${this.currentUser.displayName || this.currentUser}</b></span>
              </div>
              <div class="drawer-footer-actions">
                <button class="drawer-link-btn" id="drawerSwitchUserBtn">Switch Player</button>
                <button class="drawer-link-btn" id="drawerLogoutBtn">Log Out</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Victory Modal -->
        <div class="victory-modal" id="victoryModal">
          <div class="victory-card">
            <span class="victory-trophy">🏆</span>
            <h2>Magnificent Victory!</h2>
            <p>You completed all 8 Spider sequences!</p>
            <div class="victory-stats">
              <div>Moves: <b id="vicMoves">0</b></div>
              <div>Time: <b id="vicTime">0:00</b></div>
              <div>Final Score: <b id="vicScore">0</b></div>
            </div>
            <button class="btn-primary" id="victoryPlayAgainBtn">Play Another Game</button>
          </div>
        </div>
      </div>
    `;

    this.wireControls();
  }

  wireControls() {
    const chevron = this.container.querySelector('#drawerChevronBtn');
    const drawer = this.container.querySelector('#bottomDrawerWrapper');

    chevron?.addEventListener('click', () => {
      drawer?.classList.toggle('is-open');
      sound.playCardSlide();
    });

    // Undo button
    this.container.querySelector('#drawerUndoBtn')?.addEventListener('click', () => {
      if (this.engine.undo()) {
        sound.playCardSlide();
        this.render();
      }
    });

    // Hint button
    this.container.querySelector('#drawerHintBtn')?.addEventListener('click', () => {
      this.showHint();
    });

    // New game
    this.container.querySelector('#drawerNewGameBtn')?.addEventListener('click', () => {
      drawer?.classList.remove('is-open');
      sound.playDealWhoosh(0);
      this.engine.startNewGame(this.engine.difficulty);
      this.render();
    });

    // Restart
    this.container.querySelector('#drawerRestartBtn')?.addEventListener('click', () => {
      drawer?.classList.remove('is-open');
      this.engine.startNewGame(this.engine.difficulty);
      this.render();
    });

    // Difficulty buttons
    this.container.querySelectorAll('.diff-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const diff = parseInt(e.currentTarget.dataset.diff, 10);
        this.container.querySelectorAll('.diff-pill').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        drawer?.classList.remove('is-open');
        this.engine.startNewGame(diff);
        this.render();
      });
    });

    // Stock pile click -> deal 10 cards
    this.container.querySelector('#stockArea')?.addEventListener('click', () => {
      if (!this.engine.canDealStock()) {
        if (this.engine.stock.length === 0) return;
        // Shake empty columns to alert player
        this.highlightEmptyColumns();
        return;
      }
      const dealt = this.engine.dealFromStock();
      if (dealt) {
        dealt.forEach((_, idx) => sound.playDealWhoosh(idx));
        this.render();
      }
    });

    // User logout & switch
    this.container.querySelector('#drawerLogoutBtn')?.addEventListener('click', () => {
      this.onUserLogout();
    });

    this.container.querySelector('#drawerSwitchUserBtn')?.addEventListener('click', () => {
      this.onUserSwitch();
    });

    // Victory play again
    this.container.querySelector('#victoryPlayAgainBtn')?.addEventListener('click', () => {
      this.container.querySelector('#victoryModal')?.classList.remove('is-active');
      this.engine.startNewGame(this.engine.difficulty);
      this.render();
    });
  }

  attachGlobalEvents() {
    // Start interval to update HUD timer smoothly
    if (this.hudTimer) clearInterval(this.hudTimer);
    this.hudTimer = setInterval(() => {
      const timeVal = this.container.querySelector('#hudTimeVal');
      if (timeVal && this.engine.startTime) {
        const totalSecs = this.engine.elapsedSeconds;
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        timeVal.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      }
    }, 500);

    // Close bottom drawer when tapping background
    this.container.querySelector('#spiderTableau')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('spider-tableau') || e.target.classList.contains('tableau-column')) {
        this.container.querySelector('#bottomDrawerWrapper')?.classList.remove('is-open');
      }
    });
  }

  highlightEmptyColumns() {
    const emptyCols = this.container.querySelectorAll('.tableau-column:empty');
    emptyCols.forEach(col => {
      col.classList.add('empty-col-warning');
      setTimeout(() => col.classList.remove('empty-col-warning'), 1200);
    });
  }

  showHint() {
    const hint = this.engine.getHint();
    if (!hint) {
      alert('No moves found! Try dealing from the stock pile.');
      return;
    }

    sound.playCardSlide();
    const fromColEl = this.container.querySelector(`.tableau-column[data-col="${hint.fromCol}"]`);
    const toColEl = this.container.querySelector(`.tableau-column[data-col="${hint.toCol}"]`);

    if (fromColEl && toColEl) {
      const cards = fromColEl.querySelectorAll('.solitaire-card');
      for (let i = hint.startIndex; i < cards.length; i++) {
        cards[i].classList.add('hint-glow');
        setTimeout(() => cards[i].classList.remove('hint-glow'), 1800);
      }
      toColEl.classList.add('hint-dest-glow');
      setTimeout(() => toColEl.classList.remove('hint-dest-glow'), 1800);
    }
  }

  render() {
    // 1. Update HUD
    const movesEl = this.container.querySelector('#hudMovesVal');
    const scoreEl = this.container.querySelector('#hudScoreVal');
    if (movesEl) movesEl.textContent = this.engine.moves;
    if (scoreEl) scoreEl.textContent = this.engine.score;

    // 2. Render Foundation
    const foundationArea = this.container.querySelector('#foundationArea');
    if (foundationArea) {
      foundationArea.innerHTML = '';
      if (this.engine.foundations.length === 0) {
        foundationArea.innerHTML = CardRenderer.renderFoundationSlot();
      } else {
        // Stack completed suits
        for (let i = 0; i < this.engine.foundations.length; i++) {
          const suit = this.engine.foundations[i];
          const completedCard = document.createElement('div');
          completedCard.className = 'foundation-completed-card';
          completedCard.style.left = `${i * 12}px`;
          completedCard.innerHTML = CardRenderer.renderFaceUpCard({ rank: 13, suit });
          foundationArea.appendChild(completedCard);
        }
      }
    }

    // 3. Render Stock Pile (5 fan deals)
    const stockArea = this.container.querySelector('#stockArea');
    if (stockArea) {
      stockArea.innerHTML = '';
      const dealsLeft = this.engine.stock.length;
      if (dealsLeft > 0) {
        for (let i = 0; i < dealsLeft; i++) {
          const stockCard = document.createElement('div');
          stockCard.className = 'stock-fanned-card';
          stockCard.style.left = `${i * 10}px`;
          stockCard.innerHTML = CardRenderer.renderStockBack();
          stockArea.appendChild(stockCard);
        }
      } else {
        stockArea.innerHTML = `<div class="empty-stock-placeholder">✓</div>`;
      }
    }

    // 4. Render Tableau Columns
    this.engine.columns.forEach((colCards, colIdx) => {
      const colEl = this.container.querySelector(`.tableau-column[data-col="${colIdx}"]`);
      if (!colEl) return;
      colEl.innerHTML = '';

      colCards.forEach((card, cardIdx) => {
        const cardEl = CardRenderer.createCardElement(card, colIdx, cardIdx);
        
        // Calculate vertical stagger offset
        // Face down cards overlap tighter; face up cards give more readable room
        let topOffset = 0;
        for (let k = 0; k < cardIdx; k++) {
          topOffset += colCards[k].faceUp ? 26 : 14;
        }
        cardEl.style.top = `${topOffset}px`;
        cardEl.style.zIndex = cardIdx + 1;

        // Wire tap and drag listeners if card is face up
        if (card.faceUp) {
          this.wireCardInteraction(cardEl, colIdx, cardIdx);
        }

        colEl.appendChild(cardEl);
      });

      // Wire column click for tap-to-move destination
      colEl.onclick = (e) => {
        if (this.selectedSequence) {
          this.attemptMove(this.selectedSequence.colIdx, this.selectedSequence.startIndex, colIdx);
          this.clearSelection();
        }
      };
    });

    // Check Victory
    if (this.engine.isWon) {
      sound.playFoundationClear();
      const vicModal = this.container.querySelector('#victoryModal');
      const vicMoves = this.container.querySelector('#vicMoves');
      const vicTime = this.container.querySelector('#vicTime');
      const vicScore = this.container.querySelector('#vicScore');

      if (vicMoves) vicMoves.textContent = this.engine.moves;
      if (vicTime) {
        const m = Math.floor(this.engine.elapsedSeconds / 60);
        const s = this.engine.elapsedSeconds % 60;
        vicTime.textContent = `${m}:${s.toString().padStart(2, '0')}`;
      }
      if (vicScore) vicScore.textContent = this.engine.score;
      vicModal?.classList.add('is-active');
    }
  }

  wireCardInteraction(cardEl, colIdx, cardIdx) {
    const col = this.engine.columns[colIdx];
    const isMovable = this.engine.isValidSequence(col, cardIdx);

    if (isMovable) {
      cardEl.classList.add('can-move');
    }

    // Tap-to-move handler
    cardEl.addEventListener('click', (e) => {
      e.stopPropagation();

      // If already selected, or selecting another column's card as destination:
      if (this.selectedSequence) {
        if (this.selectedSequence.colIdx === colIdx && this.selectedSequence.startIndex === cardIdx) {
          // Deselect if tapped same card
          this.clearSelection();
          return;
        }

        // Try moving selected cards onto this column!
        const success = this.attemptMove(this.selectedSequence.colIdx, this.selectedSequence.startIndex, colIdx);
        this.clearSelection();
        if (success) return;
      }

      // If not moving into, select this card sequence!
      if (isMovable) {
        // Smart single-tap auto-move:
        // Try finding the best valid destination automatically (especially great while walking!)
        const autoDest = this.findBestDestination(colIdx, cardIdx);
        if (autoDest !== null) {
          this.attemptMove(colIdx, cardIdx, autoDest);
        } else {
          // Otherwise highlight as selected sequence
          this.selectSequence(colIdx, cardIdx);
        }
      }
    });

    // Drag and drop handler
    cardEl.draggable = isMovable;
    cardEl.addEventListener('dragstart', (e) => {
      if (!isMovable) {
        e.preventDefault();
        return;
      }
      this.draggedData = { colIdx, startIndex: cardIdx };
      e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedData));
      cardEl.classList.add('is-dragging');
      sound.playCardSlide();
    });

    cardEl.addEventListener('dragend', () => {
      cardEl.classList.remove('is-dragging');
      this.draggedData = null;
    });
  }

  findBestDestination(fromColIdx, startIndex) {
    const fromCol = this.engine.columns[fromColIdx];
    const movingCard = fromCol[startIndex];

    let sameSuitDest = null;
    let diffSuitDest = null;
    let emptyColDest = null;

    for (let c = 0; c < 10; c++) {
      if (c === fromColIdx) continue;
      if (this.engine.canMove(fromColIdx, startIndex, c)) {
        const destCol = this.engine.columns[c];
        if (destCol.length === 0) {
          // Only auto-move to empty column if it uncovers a face-down card!
          if (startIndex > 0 && !fromCol[startIndex - 1].faceUp && emptyColDest === null) {
            emptyColDest = c;
          }
        } else {
          const topCard = destCol[destCol.length - 1];
          if (topCard.suit === movingCard.suit) {
            sameSuitDest = c;
            break; // Ideal move found!
          } else if (diffSuitDest === null) {
            diffSuitDest = c;
          }
        }
      }
    }

    return sameSuitDest ?? diffSuitDest ?? emptyColDest;
  }

  selectSequence(colIdx, startIndex) {
    this.clearSelection();
    this.selectedSequence = { colIdx, startIndex };
    const colEl = this.container.querySelector(`.tableau-column[data-col="${colIdx}"]`);
    const cards = colEl?.querySelectorAll('.solitaire-card');
    if (cards) {
      for (let i = startIndex; i < cards.length; i++) {
        cards[i].classList.add('selected-glow');
      }
    }
    sound.playCardSlide();
  }

  clearSelection() {
    this.selectedSequence = null;
    this.container.querySelectorAll('.selected-glow').forEach(el => el.classList.remove('selected-glow'));
  }

  attemptMove(fromColIdx, startIndex, toColIdx) {
    const res = this.engine.moveCards(fromColIdx, startIndex, toColIdx);
    if (res && res.success) {
      if (res.completedSuit) {
        sound.playFoundationClear();
      } else {
        sound.playCardSnap();
      }
      this.render();
      return true;
    }
    return false;
  }
}
