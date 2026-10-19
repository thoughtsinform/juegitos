/**
 * Words of Wonders (WoW) - Game Engine & State Machine
 * Handles crossword matrix, intersections, bonus jar, hints, and player progression.
 */

import { WOW_LEVELS } from './levels.js';
import { wowDictionary } from './dictionary.js';
import { sound } from '../sound.js';

export class WowEngine {
  constructor(user = 'Ellen') {
    this.user = user;
    this.levels = WOW_LEVELS;
    this.levelIndex = this.loadUserLevel();
    this.stars = this.loadUserStars();
    this.coins = this.loadUserCoins();

    this.currentLevel = null;
    this.grid = []; // 2D matrix of cells
    this.solvedWords = new Set();
    this.bonusWordsFound = new Set();
    this.wheelLetters = [];
    this.isLevelWon = false;

    this.startLevel(this.levelIndex);
  }

  setUser(user) {
    this.user = user;
    this.levelIndex = this.loadUserLevel();
    this.stars = this.loadUserStars();
    this.coins = this.loadUserCoins();
    this.startLevel(this.levelIndex);
  }

  loadUserLevel() {
    try {
      const saved = localStorage.getItem(`juegitos_wow_level_${this.user}`);
      const idx = saved ? parseInt(saved, 10) : 0;
      return idx >= 0 && idx < this.levels.length ? idx : 0;
    } catch (e) {
      return 0;
    }
  }

  loadUserStars() {
    try {
      const s = localStorage.getItem(`juegitos_wow_stars_${this.user}`);
      return s ? parseInt(s, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  loadUserCoins() {
    try {
      const c = localStorage.getItem(`juegitos_wow_coins_${this.user}`);
      return c ? parseInt(c, 10) : 100; // 100 starting coins
    } catch (e) {
      return 100;
    }
  }

  saveState() {
    try {
      localStorage.setItem(`juegitos_wow_level_${this.user}`, this.levelIndex.toString());
      localStorage.setItem(`juegitos_wow_stars_${this.user}`, this.stars.toString());
      localStorage.setItem(`juegitos_wow_coins_${this.user}`, this.coins.toString());
    } catch (e) {
      console.warn('Could not save WoW state', e);
    }
  }

  startLevel(index = 0) {
    if (index < 0 || index >= this.levels.length) {
      index = 0;
    }
    this.levelIndex = index;
    this.currentLevel = this.levels[this.levelIndex];
    this.solvedWords = new Set();
    this.bonusWordsFound = new Set();
    this.isLevelWon = false;
    this.wheelLetters = [...this.currentLevel.letters];

    this.buildGridMatrix();
    this.saveState();
  }

  buildGridMatrix() {
    const rows = this.currentLevel.gridRows;
    const cols = this.currentLevel.gridCols;

    // Initialize blank grid
    this.grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );

    // Place words in grid with verified intersections
    for (const w of this.currentLevel.words) {
      const letters = w.word.toUpperCase().split('');
      for (let i = 0; i < letters.length; i++) {
        const r = w.direction === 'H' ? w.row : w.row + i;
        const c = w.direction === 'H' ? w.col + i : w.col;

        if (!this.grid[r][c]) {
          this.grid[r][c] = {
            row: r,
            col: c,
            letter: letters[i],
            isRevealed: false,
            wordIds: [w.id]
          };
        } else {
          // Intersecting cell
          if (!this.grid[r][c].wordIds.includes(w.id)) {
            this.grid[r][c].wordIds.push(w.id);
          }
        }
      }
    }
  }

  shuffleLetters() {
    for (let i = this.wheelLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.wheelLetters[i], this.wheelLetters[j]] = [this.wheelLetters[j], this.wheelLetters[i]];
    }
    sound.playCardSlide();
    return this.wheelLetters;
  }

  /**
   * Submit a dragged word
   */
  submitWord(word) {
    if (!word) return { status: 'invalid' };
    const upper = word.toUpperCase().trim();

    // 1. Check if word is on the Crossword Board
    const match = this.currentLevel.words.find(w => w.word.toUpperCase() === upper);
    if (match) {
      if (this.solvedWords.has(match.id)) {
        return { status: 'already_found', word: upper };
      }

      // Mark word as solved
      this.solvedWords.add(match.id);
      this.coins += 10; // +10 coins per crossword word

      // Reveal intersecting cells
      const newlyRevealed = [];
      const letters = match.word.split('');
      for (let i = 0; i < letters.length; i++) {
        const r = match.direction === 'H' ? match.row : match.row + i;
        const c = match.direction === 'H' ? match.col + i : match.col;
        const cell = this.grid[r][c];
        if (cell && !cell.isRevealed) {
          cell.isRevealed = true;
          newlyRevealed.push({ row: r, col: c, letter: cell.letter });
        }
      }

      // Check level victory (all words solved)
      const isLevelComplete = this.solvedWords.size === this.currentLevel.words.length;
      if (isLevelComplete) {
        this.isLevelWon = true;
        this.stars += 3; // +3 stars for completing a Wonder
        this.coins += 50; // +50 bonus coins
        this.saveState();
      } else {
        this.saveState();
      }

      sound.playCardSnap();

      return {
        status: 'success',
        word: upper,
        wordId: match.id,
        isLevelComplete,
        newlyRevealed
      };
    }

    // 2. Check if it's a genuine Bonus Word (must be real English and not in puzzle)
    const isBonus = wowDictionary.isValidBonusWord(upper, this.currentLevel);

    if (isBonus) {
      if (this.bonusWordsFound.has(upper)) {
        return { status: 'already_found_bonus', word: upper };
      }

      this.bonusWordsFound.add(upper);
      this.coins += 5; // +5 coins per bonus word

      // Check bonus jar milestone (every 5 bonus words)
      let jarFilled = false;
      if (this.bonusWordsFound.size % 5 === 0) {
        jarFilled = true;
        this.stars += 1;
        this.coins += 25;
      }

      this.saveState();
      sound.playCardSlide();

      return {
        status: 'bonus',
        word: upper,
        bonusCount: this.bonusWordsFound.size,
        jarFilled
      };
    }

    // 3. Strictly invalid word (not in dictionary or not formable)
    return { status: 'invalid', word: upper };
  }

  /**
   * Helper: check if cells revealed by hints complete any crossword words
   * and check if the entire board is solved.
   */
  checkWordsCompletedByReveal() {
    const newlySolvedWords = [];

    for (const w of this.currentLevel.words) {
      if (!this.solvedWords.has(w.id)) {
        let allRevealed = true;
        for (let i = 0; i < w.word.length; i++) {
          const r = w.direction === 'H' ? w.row : w.row + i;
          const c = w.direction === 'H' ? w.col + i : w.col;
          if (!this.grid[r][c]?.isRevealed) {
            allRevealed = false;
            break;
          }
        }
        if (allRevealed) {
          this.solvedWords.add(w.id);
          newlySolvedWords.push(w);
        }
      }
    }

    const isLevelComplete = this.solvedWords.size === this.currentLevel.words.length;
    if (isLevelComplete && !this.isLevelWon) {
      this.isLevelWon = true;
      this.stars += 3;
      this.coins += 50;
      this.saveState();
    } else {
      this.saveState();
    }

    return {
      isLevelComplete,
      newlySolvedWords
    };
  }

  /**
   * Hint 1: Lightbulb
   * Reveals a random unrevealed cell on the crossword grid
   */
  useLightbulb() {
    const cost = 25;
    if (this.coins < cost) {
      return { success: false, reason: 'Need 25 coins for Lightbulb hint!' };
    }

    const unrevealedCells = [];
    for (let r = 0; r < this.currentLevel.gridRows; r++) {
      for (let c = 0; c < this.currentLevel.gridCols; c++) {
        const cell = this.grid[r][c];
        if (cell && !cell.isRevealed) {
          unrevealedCells.push(cell);
        }
      }
    }

    if (unrevealedCells.length === 0) {
      return { success: false, reason: 'All letters already revealed!' };
    }

    this.coins -= cost;
    const target = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
    target.isRevealed = true;
    sound.playCardSnap();

    // Check if this reveal completed any words or the level
    const progress = this.checkWordsCompletedByReveal();

    return {
      success: true,
      cell: { row: target.row, col: target.col, letter: target.letter },
      isLevelComplete: progress.isLevelComplete,
      newlySolvedWords: progress.newlySolvedWords
    };
  }

  /**
   * Hint 2: Target / Hammer
   * Reveals a user-selected cell
   */
  useHammer(row, col) {
    const cost = 25;
    if (this.coins < cost) {
      return { success: false, reason: 'Need 25 coins for Target hint!' };
    }

    const cell = this.grid[row]?.[col];
    if (!cell) return { success: false, reason: 'Invalid tile selected.' };
    if (cell.isRevealed) return { success: false, reason: 'Tile is already revealed.' };

    this.coins -= cost;
    cell.isRevealed = true;
    sound.playCardSnap();

    // Check if this reveal completed any words or the level
    const progress = this.checkWordsCompletedByReveal();

    return {
      success: true,
      cell: { row, col, letter: cell.letter },
      isLevelComplete: progress.isLevelComplete,
      newlySolvedWords: progress.newlySolvedWords
    };
  }

  nextLevel() {
    if (this.levelIndex < this.levels.length - 1) {
      this.startLevel(this.levelIndex + 1);
      return true;
    }
    // Loop back to start
    this.startLevel(0);
    return true;
  }
}
