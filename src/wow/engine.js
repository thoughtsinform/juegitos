/**
 * Words of Wonders (WoW) Core Game Engine
 * Handles crossword grid construction, wheel multiset letter validation,
 * bonus word jar, Butterfly tile bonuses, and smart hint progression.
 */

import { WOW_LEVELS, WOW_DIFFICULTIES } from './levels.js';
import { VALID_ENGLISH_WORDS } from './dictionary.js';

export class WowEngine {
  constructor(user = 'Ellen') {
    this.user = user;
    this.difficulty = 'easy';
    this.levelByDifficulty = { easy: 0, medium: 0, hard: 0 };
    this.levelIndex = 0;
    this.coins = 150;
    this.stars = 0;

    this.currentLevel = null;
    this.wheelLetters = [];
    this.grid = [];
    this.solvedWords = new Set();
    this.bonusWords = new Set();
    this.butterflyCollected = false;
    this.isLevelComplete = false;

    this.loadProgress();
    this.initLevel(this.levelIndex);
  }

  getStorageKey() {
    return `juegitos_wow_progress_${this.user}`;
  }

  getLevels() {
    return WOW_DIFFICULTIES[this.difficulty]?.levels || WOW_LEVELS;
  }

  setDifficulty(diff) {
    if (!WOW_DIFFICULTIES[diff]) return this.currentLevel;
    this.levelByDifficulty[this.difficulty] = this.levelIndex;
    this.difficulty = diff;
    const targetIdx = this.levelByDifficulty[diff] || 0;
    this.initLevel(targetIdx);
    this.saveProgress();
    this.saveSession?.();
    return this.currentLevel;
  }

  loadProgress() {
    this.difficulty = 'easy';
    this.levelByDifficulty = { easy: 0, medium: 0, hard: 0 };
    this.levelIndex = 0;
    this.coins = 150;
    this.stars = 0;
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.difficulty && WOW_DIFFICULTIES[parsed.difficulty]) {
          this.difficulty = parsed.difficulty;
        }
        if (parsed.levelByDifficulty && typeof parsed.levelByDifficulty === 'object') {
          this.levelByDifficulty = { ...this.levelByDifficulty, ...parsed.levelByDifficulty };
        }
        this.levelIndex = typeof parsed.levelIndex === 'number'
          ? parsed.levelIndex
          : (this.levelByDifficulty[this.difficulty] || 0);
        this.coins = typeof parsed.coins === 'number' ? parsed.coins : 150;
        this.stars = typeof parsed.stars === 'number' ? parsed.stars : 0;
      }
    } catch (e) {
      this.levelIndex = 0;
      this.coins = 150;
    }
  }

  saveProgress() {
    this.levelByDifficulty[this.difficulty] = this.levelIndex;
    try {
      localStorage.setItem(
        this.getStorageKey(),
        JSON.stringify({
          difficulty: this.difficulty,
          levelByDifficulty: this.levelByDifficulty,
          levelIndex: this.levelIndex,
          coins: this.coins,
          stars: this.stars,
          updatedAt: Date.now()
        })
      );
    } catch (e) {}
  }

  setUser(username) {
    this.user = username;
    this.loadProgress();
    this.initLevel(this.levelIndex);
  }

  loadLevel(idx = this.levelIndex) {
    return this.initLevel(idx);
  }

  initLevel(idx = this.levelIndex) {
    const levels = this.getLevels();
    const safeIdx = Math.max(0, idx) % levels.length;
    this.levelIndex = safeIdx;
    this.levelByDifficulty[this.difficulty] = safeIdx;
    this.currentLevel = levels[safeIdx];
    this.wheelLetters = [...this.currentLevel.letters];
    this.solvedWords = new Set();
    this.bonusWords = new Set();
    this.butterflyCollected = false;
    this.isLevelComplete = false;

    const { rows, cols, words, butterfly } = this.currentLevel;
    this.grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        r,
        c,
        active: false,
        char: '',
        revealed: false,
        hasButterfly: !!(butterfly && butterfly.r === r && butterfly.c === c),
        wordIds: []
      }))
    );

    words.forEach((wObj, wIdx) => {
      const chars = wObj.word.toUpperCase().split('');
      chars.forEach((ch, i) => {
        const r = wObj.dir === 'H' ? wObj.row : wObj.row + i;
        const c = wObj.dir === 'H' ? wObj.col + i : wObj.col;
        if (r < rows && c < cols) {
          const cell = this.grid[r][c];
          cell.active = true;
          cell.char = ch;
          cell.wordIds.push(wIdx);
        }
      });
    });
  }

  shuffleWheel() {
    const arr = [...this.wheelLetters];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.length > 1 && arr.every((ch, idx) => ch === this.wheelLetters[idx])) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    this.wheelLetters = arr;
    return this.wheelLetters;
  }

  /**
   * Verifies that `word` can be formed using the available letter counts on the current wheel
   */
  canFormFromWheel(word) {
    const counts = {};
    for (const ch of this.wheelLetters) {
      const u = ch.toUpperCase();
      counts[u] = (counts[u] || 0) + 1;
    }
    for (const ch of word.toUpperCase()) {
      if (!counts[ch]) return false;
      counts[ch]--;
    }
    return true;
  }

  submitWord(candidate) {
    const upper = (candidate || '').trim().toUpperCase();

    if (upper.length < 3) {
      return { status: 'too_short', word: upper };
    }

    // Strict multiset check against current wheel letters
    if (!this.canFormFromWheel(upper)) {
      return { status: 'invalid', word: upper };
    }

    // 1. Check if it matches a crossword board word
    const matchingWordObj = this.currentLevel.words.find(w => w.word.toUpperCase() === upper);

    if (matchingWordObj) {
      if (this.solvedWords.has(upper)) {
        const existingCells = this.getWordCells(matchingWordObj);
        return { status: 'already_found', word: upper, cells: existingCells };
      }

      this.solvedWords.add(upper);
      const newlyRevealed = [];
      const allWordCells = this.getWordCells(matchingWordObj);
      let caughtButterfly = false;

      allWordCells.forEach(({ r, c }) => {
        const cell = this.grid[r][c];
        if (!cell.revealed) {
          cell.revealed = true;
          newlyRevealed.push({ r, c, char: cell.char });
        }
        if (cell.hasButterfly && !this.butterflyCollected) {
          this.butterflyCollected = true;
          cell.hasButterfly = false;
          caughtButterfly = true;
        }
      });

      this.syncCompletedWordsFromCells();

      let coinsAwarded = upper.length * 5;
      if (caughtButterfly) {
        coinsAwarded += 25;
      }
      this.coins += coinsAwarded;
      this.stars += 1;

      this.checkLevelCompletion();
      this.saveProgress();

      return {
        status: 'board_word',
        word: upper,
        newlyRevealed,
        allWordCells,
        coinsAwarded,
        caughtButterfly,
        isLevelComplete: this.isLevelComplete
      };
    }

    // 2. Check if it is a valid English bonus word
    if (this.bonusWords.has(upper)) {
      return { status: 'bonus_already', word: upper };
    }

    if (VALID_ENGLISH_WORDS.has(upper)) {
      this.bonusWords.add(upper);
      const coinsAwarded = 5;
      this.coins += coinsAwarded;
      this.saveProgress();

      return {
        status: 'bonus_word',
        word: upper,
        coinsAwarded,
        totalBonusCount: this.bonusWords.size
      };
    }

    return { status: 'invalid', word: upper };
  }

  getWordCells(wordObj) {
    const cells = [];
    const len = wordObj.word.length;
    for (let i = 0; i < len; i++) {
      const r = wordObj.dir === 'H' ? wordObj.row : wordObj.row + i;
      const c = wordObj.dir === 'H' ? wordObj.col + i : wordObj.col;
      cells.push({ r, c });
    }
    return cells;
  }

  syncCompletedWordsFromCells() {
    this.currentLevel.words.forEach(wObj => {
      const upper = wObj.word.toUpperCase();
      if (!this.solvedWords.has(upper)) {
        const cells = this.getWordCells(wObj);
        const allRevealed = cells.every(({ r, c }) => this.grid[r][c].revealed);
        if (allRevealed) {
          this.solvedWords.add(upper);
        }
      }
    });
  }

  checkLevelCompletion() {
    this.syncCompletedWordsFromCells();
    let allRevealed = true;
    for (let r = 0; r < this.currentLevel.rows; r++) {
      for (let c = 0; c < this.currentLevel.cols; c++) {
        if (this.grid[r][c].active && !this.grid[r][c].revealed) {
          allRevealed = false;
          break;
        }
      }
    }

    if (allRevealed && !this.isLevelComplete) {
      this.isLevelComplete = true;
      this.coins += 40;
      this.stars += 3;
      this.saveProgress();
    }

    return this.isLevelComplete;
  }

  /**
   * Smart Lightbulb Hint (Cost: 15 Coins):
   * Prioritizes revealing the FIRST unrevealed letter of an unsolved word so it guides the player!
   */
  useRandomHint() {
    const cost = 15;
    if (this.coins < cost) {
      return { success: false, reason: 'insufficient_coins', cost };
    }

    let chosen = null;

    // First look for the first unrevealed letter of any unsolved word
    for (const wObj of this.currentLevel.words) {
      if (!this.solvedWords.has(wObj.word.toUpperCase())) {
        const cells = this.getWordCells(wObj);
        const firstUnrevealed = cells.find(({ r, c }) => !this.grid[r][c].revealed);
        if (firstUnrevealed) {
          chosen = this.grid[firstUnrevealed.r][firstUnrevealed.c];
          break;
        }
      }
    }

    // Fallback to any unrevealed active cell
    if (!chosen) {
      for (let r = 0; r < this.currentLevel.rows; r++) {
        for (let c = 0; c < this.currentLevel.cols; c++) {
          const cell = this.grid[r][c];
          if (cell.active && !cell.revealed) {
            chosen = cell;
            break;
          }
        }
        if (chosen) break;
      }
    }

    if (!chosen) {
      return { success: false, reason: 'board_full' };
    }

    this.coins -= cost;
    chosen.revealed = true;

    let caughtButterfly = false;
    if (chosen.hasButterfly && !this.butterflyCollected) {
      this.butterflyCollected = true;
      chosen.hasButterfly = false;
      caughtButterfly = true;
      this.coins += 25;
    }

    this.checkLevelCompletion();
    this.saveProgress();

    return {
      success: true,
      cell: { r: chosen.r, c: chosen.c, char: chosen.char },
      caughtButterfly,
      coinsRemaining: this.coins,
      isLevelComplete: this.isLevelComplete
    };
  }

  /**
   * Targeted Hammer Reveal: reveals the exact cell tapped by the player (Cost: 25 Coins)
   */
  useTargetedHint(r, c) {
    const cost = 25;
    if (this.coins < cost) {
      return { success: false, reason: 'insufficient_coins', cost };
    }

    const cell = this.grid[r]?.[c];
    if (!cell || !cell.active || cell.revealed) {
      return { success: false, reason: 'invalid_cell' };
    }

    this.coins -= cost;
    cell.revealed = true;

    let caughtButterfly = false;
    if (cell.hasButterfly && !this.butterflyCollected) {
      this.butterflyCollected = true;
      cell.hasButterfly = false;
      caughtButterfly = true;
      this.coins += 25;
    }

    this.checkLevelCompletion();
    this.saveProgress();

    return {
      success: true,
      cell: { r: cell.r, c: cell.c, char: cell.char },
      caughtButterfly,
      coinsRemaining: this.coins,
      isLevelComplete: this.isLevelComplete
    };
  }

  nextLevel() {
    const levels = this.getLevels();
    this.levelIndex = (this.levelIndex + 1) % levels.length;
    this.initLevel(this.levelIndex);
    this.saveProgress();
    return this.currentLevel;
  }
}
