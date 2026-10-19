/**
 * Spider Solitaire Engine
 * Handles deck generation, dealing, move validation, sequence sweeps, hints, and undo history.
 */

export const SUITS = {
  SPADES: 'spades',
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs'
};

export const RANKS = {
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

export class Card {
  constructor(suit, rank, faceUp = false, id = null) {
    this.suit = suit;
    this.rank = rank; // 1 to 13
    this.faceUp = faceUp;
    this.id = id || `${suit}_${rank}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clone() {
    return new Card(this.suit, this.rank, this.faceUp, this.id);
  }
}

export class SpiderEngine {
  constructor(difficulty = 2) {
    this.difficulty = difficulty; // 1, 2, or 4 suits
    this.columns = Array.from({ length: 10 }, () => []);
    this.stock = []; // Array of deals (5 deals of 10 cards)
    this.foundations = []; // Array of completed runs (0 to 8)
    this.moves = 0;
    this.score = 500;
    this.startTime = null;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.history = [];
    this.isWon = false;
  }

  /**
   * Initialize a new game.
   */
  startNewGame(difficulty = this.difficulty) {
    this.difficulty = difficulty;
    this.columns = Array.from({ length: 10 }, () => []);
    this.foundations = [];
    this.moves = 0;
    this.score = 500;
    this.isWon = false;
    this.history = [];

    // Create 104-card deck based on difficulty
    const deck = this.generateDeck(this.difficulty);
    this.shuffle(deck);

    // Initial deal: 54 cards
    // Columns 0-3: 6 cards (5 face-down, 1 face-up)
    // Columns 4-9: 5 cards (4 face-down, 1 face-up)
    for (let c = 0; c < 10; c++) {
      const cardCount = c < 4 ? 6 : 5;
      for (let i = 0; i < cardCount; i++) {
        const card = deck.pop();
        card.faceUp = i === cardCount - 1; // Top card is face-up
        this.columns[c].push(card);
      }
    }

    // Remaining 50 cards go to stock (5 deals of 10 cards)
    this.stock = [];
    for (let d = 0; d < 5; d++) {
      const dealCards = [];
      for (let i = 0; i < 10; i++) {
        const card = deck.pop();
        card.faceUp = false;
        dealCards.push(card);
      }
      this.stock.push(dealCards);
    }

    this.startTimer();
    this.saveState();
  }

  generateDeck(difficulty) {
    const deck = [];
    let suitsToUse = [];

    if (difficulty === 1) {
      // 8 sets of 13 Spades
      suitsToUse = Array(8).fill(SUITS.SPADES);
    } else if (difficulty === 2) {
      // 4 sets of Spades, 4 sets of Hearts (Mom's exact mode!)
      suitsToUse = [
        SUITS.SPADES, SUITS.SPADES, SUITS.SPADES, SUITS.SPADES,
        SUITS.HEARTS, SUITS.HEARTS, SUITS.HEARTS, SUITS.HEARTS
      ];
    } else {
      // 4 suits: 2 of each
      suitsToUse = [
        SUITS.SPADES, SUITS.SPADES,
        SUITS.HEARTS, SUITS.HEARTS,
        SUITS.DIAMONDS, SUITS.DIAMONDS,
        SUITS.CLUBS, SUITS.CLUBS
      ];
    }

    for (const suit of suitsToUse) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push(new Card(suit, rank, false));
      }
    }
    return deck;
  }

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  startTimer() {
    this.stopTimer();
    this.elapsedSeconds = 0;
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  saveState() {
    const snapshot = {
      columns: this.columns.map(col => col.map(c => c.clone())),
      stock: this.stock.map(deal => deal.map(c => c.clone())),
      foundations: [...this.foundations],
      moves: this.moves,
      score: this.score,
      isWon: this.isWon
    };
    this.history.push(snapshot);
    if (this.history.length > 50) {
      this.history.shift(); // Limit history depth
    }
  }

  undo() {
    if (this.history.length <= 1) return false;
    this.history.pop(); // Remove current state
    const prev = this.history[this.history.length - 1];

    this.columns = prev.columns.map(col => col.map(c => c.clone()));
    this.stock = prev.stock.map(deal => deal.map(c => c.clone()));
    this.foundations = [...prev.foundations];
    this.moves = prev.moves + 1; // Undoing increments move count
    this.score = Math.max(0, prev.score - 1); // Deduct 1 point for undo
    this.isWon = prev.isWon;
    return true;
  }

  /**
   * Checks if cards from `startIndex` to end of column form a valid movable sequence.
   * In Spider Solitaire, cards can only move together if they are descending AND the same suit.
   */
  isValidSequence(column, startIndex) {
    if (startIndex < 0 || startIndex >= column.length) return false;
    for (let i = startIndex; i < column.length - 1; i++) {
      const current = column[i];
      const next = column[i + 1];
      if (!current.faceUp || !next.faceUp) return false;
      if (current.suit !== next.suit) return false;
      if (current.rank !== next.rank + 1) return false;
    }
    return column[startIndex].faceUp;
  }

  /**
   * Validate if moving cards from fromCol[startIndex...] to toCol is legal.
   */
  canMove(fromColIdx, startIndex, toColIdx) {
    if (fromColIdx === toColIdx) return false;
    const fromCol = this.columns[fromColIdx];
    const toCol = this.columns[toColIdx];

    if (!this.isValidSequence(fromCol, startIndex)) return false;

    const movingCard = fromCol[startIndex];

    // Moving to an empty column is always valid
    if (toCol.length === 0) return true;

    // Moving onto a non-empty column requires rank = destination rank - 1
    const targetCard = toCol[toCol.length - 1];
    return targetCard.rank === movingCard.rank + 1;
  }

  /**
   * Execute move from fromCol[startIndex...] to toCol.
   * Returns object with move details or false.
   */
  moveCards(fromColIdx, startIndex, toColIdx) {
    if (!this.canMove(fromColIdx, startIndex, toColIdx)) return false;

    const fromCol = this.columns[fromColIdx];
    const toCol = this.columns[toColIdx];

    const movingCards = fromCol.splice(startIndex);
    toCol.push(...movingCards);

    // Auto flip newly exposed card
    let flippedNewCard = false;
    if (fromCol.length > 0 && !fromCol[fromCol.length - 1].faceUp) {
      fromCol[fromCol.length - 1].faceUp = true;
      flippedNewCard = true;
    }

    this.moves++;
    this.score = Math.max(0, this.score - 1);

    // Check for completed King to Ace runs in the target column
    const completedSuit = this.checkAndClearFoundation(toColIdx);

    // Check win condition
    if (this.foundations.length === 8) {
      this.isWon = true;
      this.stopTimer();
    }

    this.saveState();

    return {
      success: true,
      fromCol: fromColIdx,
      toCol: toColIdx,
      cards: movingCards,
      flippedNewCard,
      completedSuit,
      isWon: this.isWon
    };
  }

  /**
   * Checks if top 13 cards in column form a complete K -> A same-suit sequence.
   * If yes, clears them and adds to foundation!
   */
  checkAndClearFoundation(colIdx) {
    const col = this.columns[colIdx];
    if (col.length < 13) return null;

    // Check last 13 cards
    const last13 = col.slice(col.length - 13);
    const suit = last13[0].suit;

    // Must start with King (13) down to Ace (1)
    for (let i = 0; i < 13; i++) {
      const card = last13[i];
      if (!card.faceUp || card.suit !== suit || card.rank !== 13 - i) {
        return null; // Not a complete sequence
      }
    }

    // Remove the 13 cards from the column
    col.splice(col.length - 13, 13);

    // Flip newly exposed card
    if (col.length > 0 && !col[col.length - 1].faceUp) {
      col[col.length - 1].faceUp = true;
    }

    this.foundations.push(suit);
    this.score += 100; // Standard +100 bonus

    return suit;
  }

  /**
   * Deal 1 card to each column from the stock.
   */
  canDealStock() {
    if (this.stock.length === 0) return false;
    // Standard rule: no empty columns allowed before dealing
    return !this.columns.some(col => col.length === 0);
  }

  dealFromStock() {
    if (this.stock.length === 0) return false;

    const deal = this.stock.pop();
    const dealtCards = [];

    for (let c = 0; c < 10; c++) {
      const card = deal[c];
      card.faceUp = true;
      this.columns[c].push(card);
      dealtCards.push(card);

      // Check if this newly dealt card completes a foundation run
      this.checkAndClearFoundation(c);
    }

    this.moves++;
    this.score = Math.max(0, this.score - 1);

    if (this.foundations.length === 8) {
      this.isWon = true;
      this.stopTimer();
    }

    this.saveState();
    return dealtCards;
  }

  /**
   * Calculates the best available hint.
   * Prioritizes moves that:
   * 1. Match same-suit descending (clean sequence).
   * 2. Uncover a face-down card.
   * 3. Move to empty column if it uncovers a face-down card.
   */
  getHint() {
    const candidateMoves = [];

    for (let fromColIdx = 0; fromColIdx < 10; fromColIdx++) {
      const fromCol = this.columns[fromColIdx];
      if (fromCol.length === 0) continue;

      for (let s = 0; s < fromCol.length; s++) {
        if (!fromCol[s].faceUp) continue;
        if (!this.isValidSequence(fromCol, s)) continue;

        for (let toColIdx = 0; toColIdx < 10; toColIdx++) {
          if (fromColIdx === toColIdx) continue;
          if (this.canMove(fromColIdx, s, toColIdx)) {
            const movingCard = fromCol[s];
            const targetCol = this.columns[toColIdx];
            const targetCard = targetCol.length > 0 ? targetCol[targetCol.length - 1] : null;

            let priority = 0;
            // High priority: Same-suit connection
            if (targetCard && targetCard.suit === movingCard.suit) {
              priority += 50;
            }
            // High priority: Uncovers a face-down card
            if (s > 0 && !fromCol[s - 1].faceUp) {
              priority += 30;
            }
            // Penalty for moving King to empty column if it doesn't uncover cards
            if (movingCard.rank === 13 && !targetCard && s === 0) {
              priority -= 20;
            }

            candidateMoves.push({
              fromCol: fromColIdx,
              startIndex: s,
              toCol: toColIdx,
              priority
            });
          }
        }
      }
    }

    if (candidateMoves.length === 0) return null;
    candidateMoves.sort((a, b) => b.priority - a.priority);
    return candidateMoves[0];
  }
}
