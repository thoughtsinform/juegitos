/**
 * Spider Solitaire Core Engine
 * Implements 104-card deck (1, 2, or 4 suits), 10 tableau columns,
 * 50-card stock (5 deals of 10), King-to-Ace same-suit foundation sweeps,
 * non-punitive undo, exact-deal restart, smart whole-run tap movement, and auto-complete.
 */

export const SUITS = ['spades', 'hearts', 'clubs', 'diamonds'];
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const RANK_LABELS = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K'
};

export class SpiderEngine {
  constructor(difficulty = 2) {
    this.difficulty = difficulty; // 1 = 1 Suit, 2 = 2 Suits, 4 = 4 Suits
    this.columns = Array.from({ length: 10 }, () => []);
    this.stock = [];
    this.foundations = [];
    this.moves = 0;
    this.score = 500;
    this.history = [];
    this.initialDealSnapshot = null;
    this.startTime = null;
    this.elapsedSeconds = 0;
    this.isWon = false;
  }

  createDeck(difficulty = this.difficulty) {
    let activeSuits = ['spades'];
    if (difficulty === 2) {
      activeSuits = ['spades', 'hearts'];
    } else if (difficulty === 4) {
      activeSuits = ['spades', 'hearts', 'clubs', 'diamonds'];
    }

    const deck = [];
    const totalSuitsNeeded = 8; // 8 * 13 = 104 cards
    let cardId = 1;

    for (let s = 0; s < totalSuitsNeeded; s++) {
      const suit = activeSuits[s % activeSuits.length];
      for (const rank of RANKS) {
        deck.push({
          id: `card_${cardId++}`,
          suit,
          rank,
          label: RANK_LABELS[rank],
          faceUp: false
        });
      }
    }

    return deck;
  }

  shuffle(deck) {
    const arr = [...deck];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  startNewGame(difficulty = this.difficulty) {
    this.difficulty = difficulty;

    // Deal up to 12 candidate shuffles and pick one with strong initial legal move mobility
    let bestColumns = null;
    let bestStock = null;
    let bestMobility = -1;

    for (let attempt = 0; attempt < 12; attempt++) {
      const deck = this.shuffle(this.createDeck(difficulty));
      const cols = Array.from({ length: 10 }, () => []);
      let deckIdx = 0;

      for (let col = 0; col < 10; col++) {
        const count = col < 4 ? 6 : 5;
        for (let r = 0; r < count; r++) {
          const card = { ...deck[deckIdx++] };
          card.faceUp = (r === count - 1);
          cols[col].push(card);
        }
      }

      // Evaluate initial legal moves among the 10 face-up top cards
      let mobility = 0;
      for (let i = 0; i < 10; i++) {
        const topA = cols[i][cols[i].length - 1];
        for (let j = 0; j < 10; j++) {
          if (i === j) continue;
          const topB = cols[j][cols[j].length - 1];
          if (topB.rank === topA.rank + 1) {
            mobility += (topB.suit === topA.suit) ? 3 : 1;
          }
        }
      }

      if (mobility > bestMobility) {
        bestMobility = mobility;
        bestColumns = cols;
        bestStock = deck.slice(deckIdx);
        if (mobility >= 5) break;
      }
    }

    this.columns = bestColumns;
    this.stock = bestStock;
    this.foundations = [];
    this.moves = 0;
    this.score = 500;
    this.history = [];
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.isWon = false;

    // Store pristine initial deal so "Restart" replays this exact hand
    this.initialDealSnapshot = {
      columns: this.columns.map(col => col.map(c => ({ ...c }))),
      stock: this.stock.map(c => ({ ...c })),
      difficulty: this.difficulty
    };
  }

  /**
   * Restarts the current deal from move 0 without shuffling a new deck
   */
  restartCurrentDeal() {
    if (!this.initialDealSnapshot) {
      this.startNewGame(this.difficulty);
      return;
    }

    this.difficulty = this.initialDealSnapshot.difficulty;
    this.columns = this.initialDealSnapshot.columns.map(col => col.map(c => ({ ...c })));
    this.stock = this.initialDealSnapshot.stock.map(c => ({ ...c }));
    this.foundations = [];
    this.moves = 0;
    this.score = 500;
    this.history = [];
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.isWon = false;
  }

  saveHistorySnapshot() {
    const snapshot = {
      columns: this.columns.map(col => col.map(c => ({ ...c }))),
      stock: this.stock.map(c => ({ ...c })),
      foundations: [...this.foundations],
      moves: this.moves,
      score: this.score
    };
    this.history.push(snapshot);
    if (this.history.length > 80) {
      this.history.shift();
    }
  }

  undo() {
    if (this.history.length === 0) return false;
    const prev = this.history.pop();
    this.columns = prev.columns;
    this.stock = prev.stock;
    this.foundations = prev.foundations;
    this.moves = prev.moves;
    this.score = prev.score;
    this.isWon = false;
    return true;
  }

  /**
   * Checks if a sub-stack starting at [colIdx][cardIdx] is a valid movable sequence
   * (all faceUp, descending by 1, and same suit).
   */
  isValidSequence(colIdx, cardIdx) {
    const col = this.columns[colIdx];
    if (!col || cardIdx < 0 || cardIdx >= col.length) return false;

    for (let i = cardIdx; i < col.length; i++) {
      if (!col[i].faceUp) return false;
      if (i > cardIdx) {
        const prev = col[i - 1];
        const curr = col[i];
        if (prev.suit !== curr.suit || prev.rank !== curr.rank + 1) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Finds the highest index <= cardIdx that still forms a valid same-suit sequence to the bottom of colIdx.
   * In MobilityWare Spider, tapping a lower card in a movable same-suit run automatically grabs the whole run!
   */
  getHighestMovableRunIndex(colIdx, cardIdx) {
    if (!this.isValidSequence(colIdx, cardIdx)) return -1;
    const col = this.columns[colIdx];
    let topIdx = cardIdx;
    while (topIdx > 0) {
      const above = col[topIdx - 1];
      const curr = col[topIdx];
      if (above.faceUp && above.suit === curr.suit && above.rank === curr.rank + 1) {
        topIdx--;
      } else {
        break;
      }
    }
    return topIdx;
  }

  /**
   * Checks if moving sequence starting at [fromCol][startIndex] to [toCol] is legal.
   */
  canMoveSequence(fromCol, startIndex, toCol) {
    if (fromCol === toCol) return false;
    if (toCol < 0 || toCol >= 10) return false;
    if (!this.isValidSequence(fromCol, startIndex)) return false;

    const movingTopCard = this.columns[fromCol][startIndex];
    const targetCol = this.columns[toCol];

    if (targetCol.length === 0) {
      return true;
    }

    const targetTopCard = targetCol[targetCol.length - 1];
    if (!targetTopCard.faceUp) return false;
    return targetTopCard.rank === movingTopCard.rank + 1;
  }

  moveSequence(fromCol, startIndex, toCol) {
    if (!this.canMoveSequence(fromCol, startIndex, toCol)) {
      return { success: false };
    }

    this.saveHistorySnapshot();

    const movingCards = this.columns[fromCol].splice(startIndex);
    const targetCol = this.columns[toCol];

    const isSameSuit = targetCol.length > 0 && targetCol[targetCol.length - 1].suit === movingCards[0].suit;
    targetCol.push(...movingCards);

    let flippedCard = false;
    const remainingSource = this.columns[fromCol];
    if (remainingSource.length > 0 && !remainingSource[remainingSource.length - 1].faceUp) {
      remainingSource[remainingSource.length - 1].faceUp = true;
      flippedCard = true;
    }

    this.moves++;
    if (isSameSuit || flippedCard) {
      this.score += 5;
    } else {
      this.score = Math.max(0, this.score - 1);
    }

    const completedSuit = this.checkAndSweepCompletedRun(toCol);

    if (this.foundations.length === 8) {
      this.isWon = true;
      this.score += 1000;
    }

    return {
      success: true,
      flippedCard,
      completedSuit,
      isWon: this.isWon
    };
  }

  checkAndSweepCompletedRun(colIdx) {
    const col = this.columns[colIdx];
    if (col.length < 13) return null;

    const startIdx = col.length - 13;
    const suit = col[startIdx].suit;

    for (let i = 0; i < 13; i++) {
      const card = col[startIdx + i];
      const expectedRank = 13 - i;
      if (!card.faceUp || card.suit !== suit || card.rank !== expectedRank) {
        return null;
      }
    }

    col.splice(startIdx, 13);
    this.foundations.push(suit);
    this.score += 100;

    if (col.length > 0 && !col[col.length - 1].faceUp) {
      col[col.length - 1].faceUp = true;
    }

    return suit;
  }

  canDealStock() {
    if (this.stock.length === 0) {
      return { allowed: false, reason: 'empty_stock' };
    }

    const emptyCols = [];
    this.columns.forEach((col, idx) => {
      if (col.length === 0) emptyCols.push(idx);
    });

    if (emptyCols.length > 0) {
      return { allowed: false, reason: 'empty_columns', emptyCols };
    }

    return { allowed: true };
  }

  dealFromStock() {
    const check = this.canDealStock();
    if (!check.allowed) {
      return { success: false, ...check };
    }

    this.saveHistorySnapshot();

    const completedSuits = [];
    for (let colIdx = 0; colIdx < 10; colIdx++) {
      if (this.stock.length > 0) {
        const card = this.stock.pop();
        card.faceUp = true;
        this.columns[colIdx].push(card);

        const swept = this.checkAndSweepCompletedRun(colIdx);
        if (swept) completedSuits.push({ colIdx, suit: swept });
      }
    }

    this.moves++;
    if (this.foundations.length === 8) {
      this.isWon = true;
      this.score += 1000;
    }

    return {
      success: true,
      completedSuits,
      remainingDeals: Math.floor(this.stock.length / 10),
      isWon: this.isWon
    };
  }

  /**
   * Smart Tap-to-Move Destination Finder (MobilityWare standard):
   * 1. First tries moving the maximal valid same-suit run containing startIndex.
   * 2. If the maximal run has no non-empty destination, falls back to the tapped sub-run.
   * 3. Avoids pointless horizontal ping-ponging between identical parent ranks/suits unless it reveals a face-down card.
   */
  findBestDestination(fromCol, tappedIndex) {
    if (!this.isValidSequence(fromCol, tappedIndex)) return null;

    const maximalStartIndex = this.getHighestMovableRunIndex(fromCol, tappedIndex);
    const candidateIndices = maximalStartIndex !== tappedIndex
      ? [maximalStartIndex, tappedIndex]
      : [tappedIndex];

    for (const startIndex of candidateIndices) {
      const movingCard = this.columns[fromCol][startIndex];
      const currentParent = startIndex > 0 ? this.columns[fromCol][startIndex - 1] : null;
      const exposesFaceDown = startIndex > 0 && !currentParent.faceUp;
      const clearsColumn = startIndex === 0;

      let bestCol = null;
      let bestPriority = -1;

      for (let toCol = 0; toCol < 10; toCol++) {
        if (!this.canMoveSequence(fromCol, startIndex, toCol)) continue;

        const targetCol = this.columns[toCol];
        if (targetCol.length === 0) {
          // Do not move an entire column into another empty column (no-op)
          if (clearsColumn) continue;
          const emptyPriority = exposesFaceDown ? 2 : 1;
          if (emptyPriority > bestPriority) {
            bestPriority = emptyPriority;
            bestCol = toCol;
          }
        } else {
          const targetTop = targetCol[targetCol.length - 1];
          const sameSuit = targetTop.suit === movingCard.suit;

          // Prevent pointless ping-pong between two columns with the same parent rank & suit alignment
          if (
            currentParent &&
            currentParent.faceUp &&
            currentParent.rank === targetTop.rank &&
            (currentParent.suit === movingCard.suit) === sameSuit
          ) {
            // Only allow if user explicitly tapped this sub-run AND there is no better move
            if (sameSuit && currentParent.suit === movingCard.suit) continue;
          }

          let priority = sameSuit ? 4 : 3;
          // Prefer building on already longer same-suit runs
          if (sameSuit) priority += 0.5;
          if (exposesFaceDown) priority += 0.25;

          if (priority > bestPriority) {
            bestPriority = priority;
            bestCol = toCol;
          }
        }
      }

      if (bestCol !== null && (bestPriority >= 2 || startIndex === tappedIndex)) {
        return { startIndex, toCol: bestCol, priority: bestPriority };
      }
    }

    return null;
  }

  /**
   * Checks if all remaining cards on the board are face-up and stock is empty
   */
  canAutoComplete() {
    if (this.isWon || this.stock.length > 0) return false;
    for (let c = 0; c < 10; c++) {
      for (const card of this.columns[c]) {
        if (!card.faceUp) return false;
      }
    }
    // Check if at least one constructive move or sweepable run exists
    const hint = this.getHint();
    return hint !== null && hint.type === 'move';
  }

  /**
   * Finds the highest-value constructive move on the board for the Hint button
   */
  getHint() {
    let bestMove = null;
    let bestScore = -1;

    for (let fromCol = 0; fromCol < 10; fromCol++) {
      const col = this.columns[fromCol];
      for (let cardIdx = 0; cardIdx < col.length; cardIdx++) {
        if (!this.isValidSequence(fromCol, cardIdx)) continue;
        // Only consider the top of a contiguous same-suit run so we never suggest breaking a same-suit stack
        if (cardIdx > 0 && col[cardIdx - 1].faceUp && col[cardIdx - 1].suit === col[cardIdx].suit && col[cardIdx - 1].rank === col[cardIdx].rank + 1) {
          continue;
        }

        const movingCard = col[cardIdx];
        const currentParent = cardIdx > 0 ? col[cardIdx - 1] : null;
        const exposesFaceDown = cardIdx > 0 && !currentParent.faceUp;

        for (let toCol = 0; toCol < 10; toCol++) {
          if (!this.canMoveSequence(fromCol, cardIdx, toCol)) continue;

          const targetCol = this.columns[toCol];
          let movePriority = 0;

          if (targetCol.length === 0) {
            if (cardIdx === 0) continue; // Moving whole column to empty column is useless
            if (exposesFaceDown) movePriority = 25;
            else if (currentParent && currentParent.suit !== movingCard.suit) movePriority = 15;
          } else {
            const targetTop = targetCol[targetCol.length - 1];
            const isSameSuit = targetTop.suit === movingCard.suit;
            const alreadySameSuit = currentParent && currentParent.faceUp && currentParent.suit === movingCard.suit && currentParent.rank === movingCard.rank + 1;

            if (alreadySameSuit) continue;

            // Do not suggest moving between two mixed-suit parents of identical rank unless it flips a card
            if (!isSameSuit && currentParent && currentParent.faceUp && currentParent.rank === targetTop.rank) {
              continue;
            }

            if (isSameSuit) {
              movePriority = exposesFaceDown ? 100 : 80;
            } else if (exposesFaceDown) {
              movePriority = 60;
            } else if (cardIdx === 0) {
              movePriority = 50; // Emptying a column is highly constructive
            } else if (!currentParent) {
              movePriority = 20;
            }
          }

          if (movePriority > bestScore) {
            bestScore = movePriority;
            bestMove = { fromCol, cardIdx, toCol, priority: movePriority };
          }
        }
      }
    }

    if (bestMove && bestScore > 0) {
      return { type: 'move', ...bestMove };
    }

    if (this.stock.length > 0) {
      return { type: 'deal' };
    }

    return null;
  }
}
