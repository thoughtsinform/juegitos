/**
 * Toy Blast Game Engine
 * Handles tap-to-blast collapse mechanics, booster combos, gravity, and level objectives.
 */

import { TOY_BLAST_LEVELS } from './levels.js';

export const CELL_TYPES = {
  EMPTY: 'empty',
  CUBE: 'cube',
  ROTOR_H: 'rotor_h',
  ROTOR_V: 'rotor_v',
  BOMB: 'bomb',
  DISCO: 'disco',
  CRATE: 'crate',
  DUCK: 'duck'
};

export class ToyBlastEngine {
  constructor(username = 'Ellen') {
    this.username = username;
    this.levelIndex = 0;
    this.score = 0;
    this.movesLeft = 0;
    this.grid = []; // 2D array of Cell objects
    this.goals = {};
    this.isWon = false;
    this.isLost = false;
    this.stars = 0;
    this.comboChain = 0;

    this.loadPlayerProgress();
    this.initLevel(this.levelIndex);
  }

  loadPlayerProgress() {
    try {
      const data = localStorage.getItem(`juegitos_toyblast_${this.username}`);
      if (data) {
        const parsed = JSON.parse(data);
        this.highestLevelUnlocked = parsed.highestLevel || 0;
        this.levelStars = parsed.stars || {};
        this.levelScores = parsed.scores || {};
        this.totalCoins = parsed.coins !== undefined ? parsed.coins : 150;
      } else {
        this.highestLevelUnlocked = 0;
        this.levelStars = {};
        this.levelScores = {};
        this.totalCoins = 150;
      }
    } catch (e) {
      this.highestLevelUnlocked = 0;
      this.levelStars = {};
      this.levelScores = {};
      this.totalCoins = 150;
    }
  }

  savePlayerProgress() {
    try {
      const payload = {
        highestLevel: Math.max(this.highestLevelUnlocked, this.levelIndex),
        stars: this.levelStars,
        scores: this.levelScores,
        coins: this.totalCoins
      };
      localStorage.setItem(`juegitos_toyblast_${this.username}`, JSON.stringify(payload));
    } catch (e) {}
  }

  get currentLevel() {
    return TOY_BLAST_LEVELS[this.levelIndex] || TOY_BLAST_LEVELS[0];
  }

  initLevel(levelIdx = 0) {
    this.levelIndex = Math.max(0, Math.min(levelIdx, TOY_BLAST_LEVELS.length - 1));
    const lvl = this.currentLevel;

    this.score = 0;
    this.movesLeft = lvl.moves;
    this.isWon = false;
    this.isLost = false;
    this.stars = 0;
    this.comboChain = 0;

    // Clone goals
    this.goals = {
      cubes: lvl.goals.cubes ? { ...lvl.goals.cubes } : {},
      crates: lvl.goals.crates || 0,
      ducks: lvl.goals.ducks || 0,
      bubbles: lvl.goals.bubbles || 0
    };

    // Initialize 2D Grid
    this.grid = [];
    for (let r = 0; r < lvl.rows; r++) {
      const row = [];
      for (let c = 0; c < lvl.cols; c++) {
        row.push(this.createRandomCube(lvl.colors));
      }
      this.grid.push(row);
    }

    // Place predefined obstacles
    for (const obs of lvl.obstacles) {
      if (obs.r < lvl.rows && obs.c < lvl.cols) {
        if (obs.type === 'crate') {
          this.grid[obs.r][obs.c] = {
            type: CELL_TYPES.CRATE,
            health: 1,
            color: null,
            bubble: false
          };
        } else if (obs.type === 'duck') {
          this.grid[obs.r][obs.c] = {
            type: CELL_TYPES.DUCK,
            color: null,
            bubble: false
          };
        } else if (obs.type === 'bubble') {
          // Encapsulate the cube inside a bubble
          this.grid[obs.r][obs.c].bubble = true;
        }
      }
    }

    // Check if any duck starts on bottom row (unlikely, but just in case)
    this.checkDucksAtBottom();
  }

  createRandomCube(colors) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      type: CELL_TYPES.CUBE,
      color: color,
      bubble: false
    };
  }

  isBooster(cell) {
    if (!cell) return false;
    return [CELL_TYPES.ROTOR_H, CELL_TYPES.ROTOR_V, CELL_TYPES.BOMB, CELL_TYPES.DISCO].includes(cell.type);
  }

  /**
   * Primary user interaction: tap a cell at row r, col c
   */
  tapCell(r, c) {
    if (this.isWon || this.isLost || this.movesLeft <= 0) {
      return { status: 'game_over' };
    }

    if (r < 0 || r >= this.currentLevel.rows || c < 0 || c >= this.currentLevel.cols) {
      return { status: 'out_of_bounds' };
    }

    const cell = this.grid[r][c];
    if (!cell || cell.type === CELL_TYPES.EMPTY || cell.type === CELL_TYPES.CRATE || cell.type === CELL_TYPES.DUCK) {
      return { status: 'invalid_cell' };
    }

    // Case 1: Tapping a booster or booster combo
    if (this.isBooster(cell)) {
      const adjacentBooster = this.getAdjacentBooster(r, c);
      this.movesLeft--;

      let blastResult;
      if (adjacentBooster) {
        blastResult = this.triggerBoosterCombo(r, c, adjacentBooster.r, adjacentBooster.c);
      } else {
        blastResult = this.triggerSingleBooster(r, c);
      }

      this.applyGravityAndRefill();
      this.checkDucksAtBottom();
      this.checkLevelOutcome();

      return {
        status: 'booster_activated',
        ...blastResult,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }

    // Case 2: Tapping a regular cube
    if (cell.type === CELL_TYPES.CUBE) {
      const group = this.findConnectedGroup(r, c, cell.color);

      if (group.length < 2) {
        return { status: 'group_too_small', size: group.length };
      }

      this.movesLeft--;

      // Blasting cubes
      let newBoosterType = null;
      if (group.length >= 9) {
        newBoosterType = CELL_TYPES.DISCO;
      } else if (group.length >= 7) {
        newBoosterType = CELL_TYPES.BOMB;
      } else if (group.length >= 5) {
        newBoosterType = Math.random() < 0.5 ? CELL_TYPES.ROTOR_H : CELL_TYPES.ROTOR_V;
      }

      // Collect blasted cubes for objectives & score
      const blastedCubes = [];
      const poppedBubbles = [];
      const damagedCrates = [];

      for (const pos of group) {
        const item = this.grid[pos.r][pos.c];
        if (item.color && this.goals.cubes && this.goals.cubes[item.color] > 0) {
          this.goals.cubes[item.color]--;
        }
        if (item.bubble) {
          item.bubble = false;
          if (this.goals.bubbles > 0) this.goals.bubbles--;
          poppedBubbles.push(pos);
        }

        blastedCubes.push(pos);
        this.grid[pos.r][pos.c] = { type: CELL_TYPES.EMPTY };
      }

      // Check adjacent crates & bubbles to group
      const adjPositions = this.getOrthogonalNeighborsForGroup(group);
      for (const p of adjPositions) {
        const neighbor = this.grid[p.r][p.c];
        if (neighbor && neighbor.type === CELL_TYPES.CRATE) {
          neighbor.health--;
          if (neighbor.health <= 0) {
            this.grid[p.r][p.c] = { type: CELL_TYPES.EMPTY };
            if (this.goals.crates > 0) this.goals.crates--;
            damagedCrates.push(p);
          }
        } else if (neighbor && neighbor.bubble) {
          neighbor.bubble = false;
          if (this.goals.bubbles > 0) this.goals.bubbles--;
          poppedBubbles.push(p);
        }
      }

      // Spawn booster at tapped position if qualified
      if (newBoosterType) {
        this.grid[r][c] = {
          type: newBoosterType,
          color: null,
          bubble: false
        };
      }

      // Calculate score
      const basePoints = group.length * 15;
      const bonusPoints = newBoosterType ? 250 : 0;
      this.score += basePoints + bonusPoints;

      // Apply physics & cascades
      this.applyGravityAndRefill();
      this.checkDucksAtBottom();
      this.checkLevelOutcome();

      return {
        status: 'blasted',
        groupSize: group.length,
        createdBooster: newBoosterType,
        blastedCubes,
        poppedBubbles,
        damagedCrates,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }

    return { status: 'no_action' };
  }

  findConnectedGroup(startR, startC, targetColor) {
    const visited = new Set();
    const group = [];
    const queue = [{ r: startR, c: startC }];
    visited.add(`${startR},${startC}`);

    while (queue.length > 0) {
      const { r, c } = queue.shift();
      group.push({ r, c });

      const neighbors = [
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 }
      ];

      for (const n of neighbors) {
        if (n.r >= 0 && n.r < this.currentLevel.rows && n.c >= 0 && n.c < this.currentLevel.cols) {
          const key = `${n.r},${n.c}`;
          if (!visited.has(key)) {
            const cell = this.grid[n.r][n.c];
            if (cell && cell.type === CELL_TYPES.CUBE && cell.color === targetColor) {
              visited.add(key);
              queue.push(n);
            }
          }
        }
      }
    }

    return group;
  }

  getOrthogonalNeighborsForGroup(group) {
    const set = new Set();
    const groupKeys = new Set(group.map(g => `${g.r},${g.c}`));
    const result = [];

    for (const g of group) {
      const deltas = [{ r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }];
      for (const d of deltas) {
        const nr = g.r + d.r;
        const nc = g.c + d.c;
        const key = `${nr},${nc}`;
        if (nr >= 0 && nr < this.currentLevel.rows && nc >= 0 && nc < this.currentLevel.cols) {
          if (!groupKeys.has(key) && !set.has(key)) {
            set.add(key);
            result.push({ r: nr, c: nc });
          }
        }
      }
    }
    return result;
  }

  getAdjacentBooster(r, c) {
    const neighbors = [
      { r: r - 1, c },
      { r: r + 1, c },
      { r, c: c - 1 },
      { r, c: c + 1 }
    ];

    for (const n of neighbors) {
      if (n.r >= 0 && n.r < this.currentLevel.rows && n.c >= 0 && n.c < this.currentLevel.cols) {
        if (this.isBooster(this.grid[n.r][n.c])) {
          return n;
        }
      }
    }
    return null;
  }

  triggerSingleBooster(r, c) {
    const booster = this.grid[r][c];
    this.grid[r][c] = { type: CELL_TYPES.EMPTY };

    const clearedPositions = [];

    if (booster.type === CELL_TYPES.ROTOR_H) {
      // Clear entire row
      for (let col = 0; col < this.currentLevel.cols; col++) {
        clearedPositions.push({ r, c: col });
      }
    } else if (booster.type === CELL_TYPES.ROTOR_V) {
      // Clear entire column
      for (let row = 0; row < this.currentLevel.rows; row++) {
        clearedPositions.push({ r: row, c });
      }
    } else if (booster.type === CELL_TYPES.BOMB) {
      // 3x3 radius
      for (let ro = r - 1; ro <= r + 1; ro++) {
        for (let co = c - 1; co <= c + 1; co++) {
          if (ro >= 0 && ro < this.currentLevel.rows && co >= 0 && co < this.currentLevel.cols) {
            clearedPositions.push({ r: ro, c: co });
          }
        }
      }
    } else if (booster.type === CELL_TYPES.DISCO) {
      // Clear all of the most prominent color
      const targetColor = this.getMostProminentColor();
      for (let row = 0; row < this.currentLevel.rows; row++) {
        for (let col = 0; col < this.currentLevel.cols; col++) {
          const item = this.grid[row][col];
          if (item && item.type === CELL_TYPES.CUBE && item.color === targetColor) {
            clearedPositions.push({ r: row, c: col });
          }
        }
      }
    }

    this.processClearedCells(clearedPositions);
    this.score += clearedPositions.length * 25 + 150;

    return {
      type: booster.type,
      clearedPositions
    };
  }

  triggerBoosterCombo(r1, c1, r2, c2) {
    const b1 = this.grid[r1][c1];
    const b2 = this.grid[r2][c2];

    this.grid[r1][c1] = { type: CELL_TYPES.EMPTY };
    this.grid[r2][c2] = { type: CELL_TYPES.EMPTY };

    const types = [b1.type, b2.type].sort();
    const comboKey = types.join('+');
    const clearedPositions = [];

    if (b1.type === CELL_TYPES.DISCO && b2.type === CELL_TYPES.DISCO) {
      // Super Disco Wipe: clears ALL non-duck cells!
      for (let r = 0; r < this.currentLevel.rows; r++) {
        for (let c = 0; c < this.currentLevel.cols; c++) {
          clearedPositions.push({ r, c });
        }
      }
      this.score += 2000;
    } else if (types.includes(CELL_TYPES.DISCO)) {
      // Disco + Bomb or Disco + Rotor
      const otherType = b1.type === CELL_TYPES.DISCO ? b2.type : b1.type;
      const targetColor = this.getMostProminentColor();

      // Transform all of target color into otherType and detonate
      for (let r = 0; r < this.currentLevel.rows; r++) {
        for (let c = 0; c < this.currentLevel.cols; c++) {
          const cell = this.grid[r][c];
          if (cell && cell.color === targetColor) {
            this.grid[r][c] = { type: otherType, color: null, bubble: false };
            clearedPositions.push({ r, c });
          }
        }
      }
      this.score += 1500;
    } else if (types.includes(CELL_TYPES.BOMB) && (types.includes(CELL_TYPES.ROTOR_H) || types.includes(CELL_TYPES.ROTOR_V))) {
      // Mega Cross: 3 rows and 3 columns!
      const centerR = r1;
      const centerC = c1;
      for (let ro = centerR - 1; ro <= centerR + 1; ro++) {
        if (ro >= 0 && ro < this.currentLevel.rows) {
          for (let c = 0; c < this.currentLevel.cols; c++) {
            clearedPositions.push({ r: ro, c });
          }
        }
      }
      for (let co = centerC - 1; co <= centerC + 1; co++) {
        if (co >= 0 && co < this.currentLevel.cols) {
          for (let r = 0; r < this.currentLevel.rows; r++) {
            clearedPositions.push({ r, c: co });
          }
        }
      }
      this.score += 1200;
    } else if (b1.type === CELL_TYPES.BOMB && b2.type === CELL_TYPES.BOMB) {
      // Giant 5x5 Bomb explosion
      for (let ro = r1 - 2; ro <= r1 + 2; ro++) {
        for (let co = c1 - 2; co <= c1 + 2; co++) {
          if (ro >= 0 && ro < this.currentLevel.rows && co >= 0 && co < this.currentLevel.cols) {
            clearedPositions.push({ r: ro, c: co });
          }
        }
      }
      this.score += 1000;
    } else {
      // Rotor + Rotor: Cross Blast (1 row + 1 col)
      for (let col = 0; col < this.currentLevel.cols; col++) {
        clearedPositions.push({ r: r1, c: col });
      }
      for (let row = 0; row < this.currentLevel.rows; row++) {
        clearedPositions.push({ r: row, c: c1 });
      }
      this.score += 800;
    }

    this.processClearedCells(clearedPositions);
    return {
      combo: comboKey,
      clearedPositions
    };
  }

  getMostProminentColor() {
    const counts = {};
    for (let r = 0; r < this.currentLevel.rows; r++) {
      for (let c = 0; c < this.currentLevel.cols; c++) {
        const item = this.grid[r][c];
        if (item && item.type === CELL_TYPES.CUBE && item.color) {
          counts[item.color] = (counts[item.color] || 0) + 1;
        }
      }
    }
    let best = this.currentLevel.colors[0];
    let max = -1;
    for (const [col, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        best = col;
      }
    }
    return best;
  }

  processClearedCells(positions) {
    const unique = new Set();
    for (const p of positions) {
      const key = `${p.r},${p.c}`;
      if (!unique.has(key)) {
        unique.add(key);
        const cell = this.grid[p.r][p.c];
        if (!cell) continue;

        // Collect cube goal
        if (cell.color && this.goals.cubes && this.goals.cubes[cell.color] > 0) {
          this.goals.cubes[cell.color]--;
        }

        // Crate damage
        if (cell.type === CELL_TYPES.CRATE) {
          if (this.goals.crates > 0) this.goals.crates--;
        }

        // Bubble pop
        if (cell.bubble) {
          cell.bubble = false;
          if (this.goals.bubbles > 0) this.goals.bubbles--;
        }

        // Clear if not duck (ducks only exit at the bottom!)
        if (cell.type !== CELL_TYPES.DUCK) {
          this.grid[p.r][p.c] = { type: CELL_TYPES.EMPTY };
        }
      }
    }
  }

  applyGravityAndRefill() {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    // Drop items down column by column
    for (let c = 0; c < cols; c++) {
      let writeRow = rows - 1;
      for (let r = rows - 1; r >= 0; r--) {
        const item = this.grid[r][c];
        if (item && item.type !== CELL_TYPES.EMPTY) {
          if (writeRow !== r) {
            this.grid[writeRow][c] = item;
            this.grid[r][c] = { type: CELL_TYPES.EMPTY };
          }
          writeRow--;
        }
      }

      // Fill remaining empty cells from top with new random cubes
      while (writeRow >= 0) {
        this.grid[writeRow][c] = this.createRandomCube(this.currentLevel.colors);
        writeRow--;
      }
    }
  }

  checkDucksAtBottom() {
    const bottomRow = this.currentLevel.rows - 1;
    for (let c = 0; c < this.currentLevel.cols; c++) {
      const item = this.grid[bottomRow][c];
      if (item && item.type === CELL_TYPES.DUCK) {
        // Rescued!
        this.grid[bottomRow][c] = { type: CELL_TYPES.EMPTY };
        if (this.goals.ducks > 0) this.goals.ducks--;
        this.score += 500;
        this.applyGravityAndRefill();
        // Re-check in case another duck dropped down
        this.checkDucksAtBottom();
        break;
      }
    }
  }

  checkGoalsSatisfied() {
    // Check cubes
    if (this.goals.cubes) {
      for (const count of Object.values(this.goals.cubes)) {
        if (count > 0) return false;
      }
    }
    // Check crates
    if (this.goals.crates > 0) return false;
    // Check ducks
    if (this.goals.ducks > 0) return false;
    // Check bubbles
    if (this.goals.bubbles > 0) return false;

    return true;
  }

  checkLevelOutcome() {
    if (this.checkGoalsSatisfied()) {
      this.isWon = true;

      // Bonus points for remaining moves!
      const moveBonus = this.movesLeft * 250;
      this.score += moveBonus;

      // Calculate star rating
      const thresholds = this.currentLevel.starThresholds;
      if (this.score >= thresholds[2]) {
        this.stars = 3;
      } else if (this.score >= thresholds[1]) {
        this.stars = 2;
      } else {
        this.stars = 1;
      }

      // Award coins
      const coinsEarned = this.stars * 15;
      this.totalCoins += coinsEarned;

      // Save progress
      if (!this.levelStars[this.levelIndex] || this.stars > this.levelStars[this.levelIndex]) {
        this.levelStars[this.levelIndex] = this.stars;
      }
      if (!this.levelScores[this.levelIndex] || this.score > this.levelScores[this.levelIndex]) {
        this.levelScores[this.levelIndex] = this.score;
      }
      if (this.levelIndex >= this.highestLevelUnlocked) {
        this.highestLevelUnlocked = Math.min(this.levelIndex + 1, TOY_BLAST_LEVELS.length - 1);
      }
      this.savePlayerProgress();
    } else if (this.movesLeft <= 0) {
      this.isLost = true;
    }
  }

  nextLevel() {
    if (this.levelIndex < TOY_BLAST_LEVELS.length - 1) {
      this.initLevel(this.levelIndex + 1);
      return true;
    }
    return false;
  }

  restartLevel() {
    this.initLevel(this.levelIndex);
  }
}
