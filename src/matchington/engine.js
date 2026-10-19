/**
 * Matchington Mansion Game Engine
 * Implements Match-3 tile swapping, cascades, booster combos (Planes, Rockets, Bombs, Rainbow Balls),
 * obstacles (Ice floor tiles, Parquet wood boards), and room renovation meta-progression.
 */

import { MATCHINGTON_LEVELS } from './levels.js';
import { MANSION_ROOMS } from './mansion.js';

export const TILE_TYPES = {
  EMPTY: 'empty',
  ITEM: 'item',
  ROCKET_H: 'rocket_h',
  ROCKET_V: 'rocket_v',
  PAPER_PLANE: 'paper_plane',
  BOMB: 'bomb',
  RAINBOW: 'rainbow',
  WOOD: 'wood' // blocking obstacle
};

export class MatchingtonEngine {
  constructor(username = 'Ellen') {
    this.username = username;
    this.levelIndex = 0;
    this.score = 0;
    this.movesLeft = 0;
    this.grid = []; // 2D array of items/boosters
    this.floorGrid = []; // 2D array for 'ice' or null
    this.goals = {};
    this.isWon = false;
    this.isLost = false;
    this.comboCount = 0;

    this.loadPlayerData();
    this.initLevel(this.levelIndex);
  }

  loadPlayerData() {
    try {
      const data = localStorage.getItem(`juegitos_matchington_${this.username}`);
      if (data) {
        const parsed = JSON.parse(data);
        this.highestLevelUnlocked = parsed.highestLevel || 0;
        this.starsAvailable = parsed.starsAvailable !== undefined ? parsed.starsAvailable : 2; // give starter stars
        this.totalCoins = parsed.totalCoins !== undefined ? parsed.totalCoins : 100;
        this.renovations = parsed.renovations || {};
        this.levelStars = parsed.stars || {};
        this.levelScores = parsed.scores || {};
      } else {
        this.highestLevelUnlocked = 0;
        this.starsAvailable = 2; // 2 complimentary renovation stars
        this.totalCoins = 100;
        this.renovations = {};
        this.levelStars = {};
        this.levelScores = {};
      }
    } catch (e) {
      this.highestLevelUnlocked = 0;
      this.starsAvailable = 2;
      this.totalCoins = 100;
      this.renovations = {};
      this.levelStars = {};
      this.levelScores = {};
    }
  }

  savePlayerData() {
    try {
      const payload = {
        highestLevel: Math.max(this.highestLevelUnlocked, this.levelIndex),
        starsAvailable: this.starsAvailable,
        totalCoins: this.totalCoins,
        renovations: this.renovations,
        stars: this.levelStars,
        scores: this.levelScores
      };
      localStorage.setItem(`juegitos_matchington_${this.username}`, JSON.stringify(payload));
    } catch (e) {}
  }

  get currentLevel() {
    return MATCHINGTON_LEVELS[this.levelIndex] || MATCHINGTON_LEVELS[0];
  }

  initLevel(levelIdx = 0) {
    this.levelIndex = Math.max(0, Math.min(levelIdx, MATCHINGTON_LEVELS.length - 1));
    const lvl = this.currentLevel;

    this.score = 0;
    this.movesLeft = lvl.moves;
    this.isWon = false;
    this.isLost = false;
    this.comboCount = 0;

    // Clone goals
    this.goals = {
      items: lvl.goals.items ? { ...lvl.goals.items } : {},
      ice: lvl.goals.ice || 0,
      wood: lvl.goals.wood || 0
    };

    // Initialize Floor Grid (Ice)
    this.floorGrid = [];
    for (let r = 0; r < lvl.rows; r++) {
      const row = [];
      for (let c = 0; c < lvl.cols; c++) {
        row.push(null);
      }
      this.floorGrid.push(row);
    }

    // Initialize Main Grid
    this.grid = [];
    for (let r = 0; r < lvl.rows; r++) {
      const row = [];
      for (let c = 0; c < lvl.cols; c++) {
        row.push(null);
      }
      this.grid.push(row);
    }

    // Place predefined obstacles
    for (const t of lvl.tiles) {
      if (t.r < lvl.rows && t.c < lvl.cols) {
        if (t.type === 'ice') {
          this.floorGrid[t.r][t.c] = 'ice';
        } else if (t.type === 'wood') {
          this.grid[t.r][t.c] = {
            type: TILE_TYPES.WOOD,
            health: 1,
            color: null
          };
        }
      }
    }

    // Fill remaining cells with random items without pre-existing 3-matches
    for (let r = 0; r < lvl.rows; r++) {
      for (let c = 0; c < lvl.cols; c++) {
        if (!this.grid[r][c]) {
          this.grid[r][c] = this.createRandomItemWithoutMatch(r, c, lvl.items);
        }
      }
    }
  }

  createRandomItemWithoutMatch(r, c, items) {
    const forbidden = new Set();

    // Check horizontal
    if (c >= 2) {
      const left1 = this.grid[r][c - 1];
      const left2 = this.grid[r][c - 2];
      if (left1?.type === TILE_TYPES.ITEM && left2?.type === TILE_TYPES.ITEM && left1.color === left2.color) {
        forbidden.add(left1.color);
      }
    }

    // Check vertical
    if (r >= 2) {
      const up1 = this.grid[r - 1][c];
      const up2 = this.grid[r - 2][c];
      if (up1?.type === TILE_TYPES.ITEM && up2?.type === TILE_TYPES.ITEM && up1.color === up2.color) {
        forbidden.add(up1.color);
      }
    }

    const available = items.filter(it => !forbidden.has(it));
    const chosen = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : items[Math.floor(Math.random() * items.length)];

    return {
      type: TILE_TYPES.ITEM,
      color: chosen
    };
  }

  isBooster(tile) {
    if (!tile) return false;
    return [
      TILE_TYPES.ROCKET_H,
      TILE_TYPES.ROCKET_V,
      TILE_TYPES.PAPER_PLANE,
      TILE_TYPES.BOMB,
      TILE_TYPES.RAINBOW
    ].includes(tile.type);
  }

  /**
   * Primary Action: Swap adjacent tiles at (r1, c1) and (r2, c2)
   */
  swapTiles(r1, c1, r2, c2) {
    if (this.isWon || this.isLost || this.movesLeft <= 0) {
      return { status: 'game_over' };
    }

    // Must be orthogonally adjacent
    const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
    if (dist !== 1) {
      return { status: 'not_adjacent' };
    }

    const t1 = this.grid[r1][c1];
    const t2 = this.grid[r2][c2];

    if (!t1 || !t2 || t1.type === TILE_TYPES.WOOD || t2.type === TILE_TYPES.WOOD) {
      return { status: 'cannot_swap_wood' };
    }

    // Case 1: Swapping two boosters together -> COMBO!
    if (this.isBooster(t1) && this.isBooster(t2)) {
      this.movesLeft--;
      const comboRes = this.triggerBoosterCombo(r1, c1, r2, c2);
      this.applyGravityAndRefill();
      this.processCascades();
      this.checkLevelOutcome();

      return {
        status: 'combo_activated',
        ...comboRes,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }

    // Case 2: Rainbow Ball swapped with a regular item
    if (t1.type === TILE_TYPES.RAINBOW && t2.type === TILE_TYPES.ITEM) {
      this.movesLeft--;
      const res = this.triggerRainbowItem(r1, c1, t2.color);
      this.applyGravityAndRefill();
      this.processCascades();
      this.checkLevelOutcome();
      return {
        status: 'rainbow_activated',
        ...res,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }
    if (t2.type === TILE_TYPES.RAINBOW && t1.type === TILE_TYPES.ITEM) {
      this.movesLeft--;
      const res = this.triggerRainbowItem(r2, c2, t1.color);
      this.applyGravityAndRefill();
      this.processCascades();
      this.checkLevelOutcome();
      return {
        status: 'rainbow_activated',
        ...res,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }

    // Case 3: Regular Swap
    // Perform temporary swap
    this.grid[r1][c1] = t2;
    this.grid[r2][c2] = t1;

    const matches = this.findMatches();

    if (matches.length === 0) {
      // Revert swap
      this.grid[r1][c1] = t1;
      this.grid[r2][c2] = t2;
      return { status: 'invalid_swap' };
    }

    // Valid match swap!
    this.movesLeft--;
    this.comboCount = 1;

    // Process matches
    const blastRes = this.resolveMatches(matches, { r: r2, c: c2 });
    this.applyGravityAndRefill();
    this.processCascades();
    this.checkLevelOutcome();

    return {
      status: 'swap_success',
      ...blastRes,
      movesLeft: this.movesLeft,
      score: this.score,
      goals: this.goals,
      isWon: this.isWon,
      isLost: this.isLost
    };
  }

  /**
   * Tap a single booster to activate it directly
   */
  activateBooster(r, c) {
    if (this.isWon || this.isLost || this.movesLeft <= 0) return { status: 'game_over' };
    const tile = this.grid[r][c];
    if (!this.isBooster(tile)) return { status: 'not_booster' };

    this.movesLeft--;
    const res = this.detonateSingleBooster(r, c);
    this.applyGravityAndRefill();
    this.processCascades();
    this.checkLevelOutcome();

    return {
      status: 'booster_detonated',
      ...res,
      movesLeft: this.movesLeft,
      score: this.score,
      goals: this.goals,
      isWon: this.isWon,
      isLost: this.isLost
    };
  }

  findMatches() {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;
    const matchedCoords = new Map(); // key -> { r, c, color, shape }

    // 1. Horizontal Matches
    for (let r = 0; r < rows; r++) {
      let matchLen = 1;
      for (let c = 0; c < cols; c++) {
        const cur = this.grid[r][c];
        const next = c + 1 < cols ? this.grid[r][c + 1] : null;

        if (cur?.type === TILE_TYPES.ITEM && next?.type === TILE_TYPES.ITEM && cur.color === next.color) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            for (let k = 0; k < matchLen; k++) {
              const colIdx = c - k;
              matchedCoords.set(`${r},${colIdx}`, {
                r, c: colIdx,
                color: this.grid[r][colIdx].color,
                matchLen,
                dir: 'h'
              });
            }
          }
          matchLen = 1;
        }
      }
    }

    // 2. Vertical Matches
    for (let c = 0; c < cols; c++) {
      let matchLen = 1;
      for (let r = 0; r < rows; r++) {
        const cur = this.grid[r][c];
        const next = r + 1 < rows ? this.grid[r + 1][c] : null;

        if (cur?.type === TILE_TYPES.ITEM && next?.type === TILE_TYPES.ITEM && cur.color === next.color) {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            for (let k = 0; k < matchLen; k++) {
              const rowIdx = r - k;
              const key = `${rowIdx},${c}`;
              const prev = matchedCoords.get(key);
              matchedCoords.set(key, {
                r: rowIdx, c,
                color: this.grid[rowIdx][c].color,
                matchLen: prev ? Math.max(prev.matchLen, matchLen) : matchLen,
                dir: prev ? 'cross' : 'v'
              });
            }
          }
          matchLen = 1;
        }
      }
    }

    // 3. 2x2 Square Matches (produces Paper Plane)
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const t1 = this.grid[r][c];
        const t2 = this.grid[r][c + 1];
        const t3 = this.grid[r + 1][c];
        const t4 = this.grid[r + 1][c + 1];

        if (
          t1?.type === TILE_TYPES.ITEM &&
          t2?.type === TILE_TYPES.ITEM &&
          t3?.type === TILE_TYPES.ITEM &&
          t4?.type === TILE_TYPES.ITEM &&
          t1.color === t2.color &&
          t1.color === t3.color &&
          t1.color === t4.color
        ) {
          const cells = [{ r, c }, { r, c: c + 1 }, { r: r + 1, c }, { r: r + 1, c: c + 1 }];
          for (const cell of cells) {
            matchedCoords.set(`${cell.r},${cell.c}`, {
              ...cell,
              color: t1.color,
              isSquare: true
            });
          }
        }
      }
    }

    return Array.from(matchedCoords.values());
  }

  resolveMatches(matchList, spawnPoint = null) {
    if (matchList.length === 0) return { clearedCount: 0 };

    let createdBooster = null;
    const maxLen = Math.max(...matchList.map(m => m.matchLen || 0));
    const hasSquare = matchList.some(m => m.isSquare);
    const hasCross = matchList.some(m => m.dir === 'cross');

    // Booster creation decision:
    if (maxLen >= 5) {
      createdBooster = TILE_TYPES.RAINBOW;
    } else if (hasCross || maxLen >= 5) {
      createdBooster = TILE_TYPES.BOMB;
    } else if (hasSquare) {
      createdBooster = TILE_TYPES.PAPER_PLANE;
    } else if (maxLen === 4) {
      const hMatch = matchList.find(m => m.matchLen === 4 && m.dir === 'h');
      createdBooster = hMatch ? TILE_TYPES.ROCKET_H : TILE_TYPES.ROCKET_V;
    }

    const clearedPositions = [];

    // Clear matched tiles and damage floor/wood
    for (const m of matchList) {
      const { r, c } = m;
      const tile = this.grid[r][c];
      if (!tile || tile.type === TILE_TYPES.EMPTY) continue;

      // Collect item goal
      if (tile.color && this.goals.items && this.goals.items[tile.color] > 0) {
        this.goals.items[tile.color]--;
      }

      // Damage ice on floor
      if (this.floorGrid[r][c] === 'ice') {
        this.floorGrid[r][c] = null;
        if (this.goals.ice > 0) this.goals.ice--;
      }

      // Damage adjacent wood
      this.damageAdjacentWood(r, c);

      this.grid[r][c] = { type: TILE_TYPES.EMPTY };
      clearedPositions.push({ r, c });
    }

    // Spawn booster at spawn point or center of match
    if (createdBooster) {
      const target = spawnPoint && matchList.some(m => m.r === spawnPoint.r && m.c === spawnPoint.c)
        ? spawnPoint
        : { r: matchList[0].r, c: matchList[0].c };

      this.grid[target.r][target.c] = {
        type: createdBooster,
        color: null
      };
    }

    // Points calculation
    const basePts = clearedPositions.length * 20;
    const comboBonus = this.comboCount * 50;
    this.score += basePts + comboBonus;

    return {
      clearedPositions,
      createdBooster
    };
  }

  damageAdjacentWood(r, c) {
    const neighbors = [
      { r: r - 1, c },
      { r: r + 1, c },
      { r, c: c - 1 },
      { r, c: c + 1 }
    ];

    for (const n of neighbors) {
      if (n.r >= 0 && n.r < this.currentLevel.rows && n.c >= 0 && n.c < this.currentLevel.cols) {
        const item = this.grid[n.r][n.c];
        if (item && item.type === TILE_TYPES.WOOD) {
          item.health--;
          if (item.health <= 0) {
            this.grid[n.r][n.c] = { type: TILE_TYPES.EMPTY };
            if (this.goals.wood > 0) this.goals.wood--;
          }
        }
      }
    }
  }

  triggerRainbowItem(rainbowPos, targetColor) {
    this.grid[rainbowPos.r][rainbowPos.c] = { type: TILE_TYPES.EMPTY };
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;
    const cleared = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = this.grid[r][c];
        if (tile && tile.type === TILE_TYPES.ITEM && tile.color === targetColor) {
          if (this.goals.items && this.goals.items[targetColor] > 0) {
            this.goals.items[targetColor]--;
          }
          if (this.floorGrid[r][c] === 'ice') {
            this.floorGrid[r][c] = null;
            if (this.goals.ice > 0) this.goals.ice--;
          }
          this.damageAdjacentWood(r, c);
          this.grid[r][c] = { type: TILE_TYPES.EMPTY };
          cleared.push({ r, c });
        }
      }
    }

    this.score += cleared.length * 30 + 300;
    return { clearedPositions: cleared };
  }

  detonateSingleBooster(r, c) {
    const b = this.grid[r][c];
    this.grid[r][c] = { type: TILE_TYPES.EMPTY };
    const cleared = [];

    if (b.type === TILE_TYPES.ROCKET_H) {
      for (let col = 0; col < this.currentLevel.cols; col++) cleared.push({ r, c: col });
    } else if (b.type === TILE_TYPES.ROCKET_V) {
      for (let row = 0; row < this.currentLevel.rows; row++) cleared.push({ r: row, c });
    } else if (b.type === TILE_TYPES.BOMB) {
      for (let ro = r - 1; ro <= r + 1; ro++) {
        for (let co = c - 1; co <= c + 1; co++) {
          if (ro >= 0 && ro < this.currentLevel.rows && co >= 0 && co < this.currentLevel.cols) {
            cleared.push({ r: ro, c: co });
          }
        }
      }
    } else if (b.type === TILE_TYPES.PAPER_PLANE) {
      // Clears self + flies to seek an objective (ice, wood, or random item)
      cleared.push({ r, c });
      const target = this.findPlaneTarget();
      if (target) cleared.push(target);
    } else if (b.type === TILE_TYPES.RAINBOW) {
      // Clears all of random color
      const color = this.currentLevel.items[0];
      return this.triggerRainbowItem({ r, c }, color);
    }

    this.processClearedTiles(cleared);
    this.score += cleared.length * 25 + 100;
    return { clearedPositions: cleared };
  }

  findPlaneTarget() {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    // Prioritize Ice
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.floorGrid[r][c] === 'ice') return { r, c };
      }
    }
    // Prioritize Wood
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c]?.type === TILE_TYPES.WOOD) return { r, c };
      }
    }
    // Random non-empty cell
    return { r: Math.floor(Math.random() * rows), c: Math.floor(Math.random() * cols) };
  }

  triggerBoosterCombo(r1, c1, r2, c2) {
    const b1 = this.grid[r1][c1];
    const b2 = this.grid[r2][c2];

    this.grid[r1][c1] = { type: TILE_TYPES.EMPTY };
    this.grid[r2][c2] = { type: TILE_TYPES.EMPTY };

    const types = [b1.type, b2.type].sort();
    const comboKey = types.join('+');
    const cleared = [];

    if (b1.type === TILE_TYPES.RAINBOW && b2.type === TILE_TYPES.RAINBOW) {
      // Rainbow + Rainbow: Complete board wipe!
      for (let r = 0; r < this.currentLevel.rows; r++) {
        for (let c = 0; c < this.currentLevel.cols; c++) {
          cleared.push({ r, c });
        }
      }
      this.score += 2500;
    } else if (types.includes(TILE_TYPES.PAPER_PLANE) && types.includes(TILE_TYPES.PAPER_PLANE)) {
      // Plane + Plane: 3 Paper planes launch!
      for (let i = 0; i < 3; i++) {
        const t = this.findPlaneTarget();
        if (t) cleared.push(t);
      }
      this.score += 800;
    } else if (types.includes(TILE_TYPES.BOMB) && types.includes(TILE_TYPES.BOMB)) {
      // 5x5 Bomb explosion
      for (let ro = r1 - 2; ro <= r1 + 2; ro++) {
        for (let co = c1 - 2; co <= c1 + 2; co++) {
          if (ro >= 0 && ro < this.currentLevel.rows && co >= 0 && co < this.currentLevel.cols) {
            cleared.push({ r: ro, c: co });
          }
        }
      }
      this.score += 1200;
    } else {
      // Cross / Super Blast (Rocket + Rocket or Rocket + Bomb)
      for (let col = 0; col < this.currentLevel.cols; col++) cleared.push({ r: r1, c: col });
      for (let row = 0; row < this.currentLevel.rows; row++) cleared.push({ r: row, c: c1 });
      this.score += 900;
    }

    this.processClearedTiles(cleared);
    return { combo: comboKey, clearedPositions: cleared };
  }

  processClearedTiles(positions) {
    const unique = new Set();
    for (const p of positions) {
      const key = `${p.r},${p.c}`;
      if (!unique.has(key)) {
        unique.add(key);
        const cell = this.grid[p.r][p.c];
        if (!cell) continue;

        if (cell.color && this.goals.items && this.goals.items[cell.color] > 0) {
          this.goals.items[cell.color]--;
        }

        if (this.floorGrid[p.r][p.c] === 'ice') {
          this.floorGrid[p.r][p.c] = null;
          if (this.goals.ice > 0) this.goals.ice--;
        }

        this.damageAdjacentWood(p.r, p.c);
        this.grid[p.r][p.c] = { type: TILE_TYPES.EMPTY };
      }
    }
  }

  applyGravityAndRefill() {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    for (let c = 0; c < cols; c++) {
      let writeRow = rows - 1;
      for (let r = rows - 1; r >= 0; r--) {
        const item = this.grid[r][c];
        if (item && item.type !== TILE_TYPES.EMPTY) {
          if (item.type === TILE_TYPES.WOOD) {
            writeRow = r - 1; // wood does not fall
            continue;
          }
          if (writeRow !== r) {
            this.grid[writeRow][c] = item;
            this.grid[r][c] = { type: TILE_TYPES.EMPTY };
          }
          writeRow--;
        }
      }

      while (writeRow >= 0) {
        if (this.grid[writeRow][c]?.type !== TILE_TYPES.WOOD) {
          this.grid[writeRow][c] = {
            type: TILE_TYPES.ITEM,
            color: this.currentLevel.items[Math.floor(Math.random() * this.currentLevel.items.length)]
          };
        }
        writeRow--;
      }
    }
  }

  processCascades() {
    let matches = this.findMatches();
    let cascades = 0;

    while (matches.length > 0 && cascades < 8) {
      this.comboCount++;
      this.resolveMatches(matches);
      this.applyGravityAndRefill();
      matches = this.findMatches();
      cascades++;
    }
  }

  checkGoalsSatisfied() {
    if (this.goals.items) {
      for (const count of Object.values(this.goals.items)) {
        if (count > 0) return false;
      }
    }
    if (this.goals.ice > 0) return false;
    if (this.goals.wood > 0) return false;
    return true;
  }

  checkLevelOutcome() {
    if (this.checkGoalsSatisfied()) {
      this.isWon = true;

      // Bonus for moves left
      this.score += this.movesLeft * 200;

      // Star calculation
      const th = this.currentLevel.starThresholds;
      this.stars = this.score >= th[2] ? 3 : this.score >= th[1] ? 2 : 1;

      // Award Renovation Star / Key!
      this.starsAvailable += 1;
      this.totalCoins += this.stars * 20;

      if (this.levelIndex >= this.highestLevelUnlocked) {
        this.highestLevelUnlocked = Math.min(this.levelIndex + 1, MATCHINGTON_LEVELS.length - 1);
      }
      this.savePlayerData();
    } else if (this.movesLeft <= 0) {
      this.isLost = true;
    }
  }

  renovateRoomTask(taskId, choiceId) {
    if (this.starsAvailable < 1) {
      return { success: false, reason: 'not_enough_stars' };
    }

    this.starsAvailable -= 1;
    this.renovations[taskId] = choiceId;
    this.savePlayerData();
    return { success: true, taskId, choiceId, starsRemaining: this.starsAvailable };
  }

  nextLevel() {
    if (this.levelIndex < MATCHINGTON_LEVELS.length - 1) {
      this.initLevel(this.levelIndex + 1);
      return true;
    }
    return false;
  }

  restartLevel() {
    this.initLevel(this.levelIndex);
  }
}
