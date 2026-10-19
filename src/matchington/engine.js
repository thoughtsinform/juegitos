/**
 * Matchington Mansion Game Engine
 * Implements Match-3 tile swapping, cascades, recursive booster chain reactions,
 * full booster combos (Planes, Rockets, Bombs, Rainbow Balls), deadlock auto-shuffle,
 * obstacles (Ice floor tiles, Parquet wood boards), and room renovation meta-progression.
 */

import { MATCHINGTON_LEVELS } from './levels.js';

export const TILE_TYPES = {
  EMPTY: 'empty',
  ITEM: 'item',
  ROCKET_H: 'rocket_h',
  ROCKET_V: 'rocket_v',
  PAPER_PLANE: 'paper_plane',
  BOMB: 'bomb',
  RAINBOW: 'rainbow',
  WOOD: 'wood'
};

export class MatchingtonEngine {
  constructor(username = 'Ellen') {
    this.username = username;
    this.levelIndex = 0;
    this.score = 0;
    this.movesLeft = 0;
    this.grid = [];
    this.floorGrid = [];
    this.goals = {};
    this.isWon = false;
    this.isLost = false;
    this.stars = 0;
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
        this.starsAvailable = parsed.starsAvailable !== undefined ? parsed.starsAvailable : 2;
        this.totalCoins = parsed.totalCoins !== undefined ? parsed.totalCoins : 100;
        this.renovations = parsed.renovations || {};
        this.levelStars = parsed.stars || {};
        this.levelScores = parsed.scores || {};
      } else {
        this.highestLevelUnlocked = 0;
        this.starsAvailable = 2;
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
    this.stars = 0;
    this.comboCount = 0;

    this.goals = {
      items: lvl.goals.items ? { ...lvl.goals.items } : {},
      ice: lvl.goals.ice || 0,
      wood: lvl.goals.wood || 0
    };

    this.floorGrid = [];
    for (let r = 0; r < lvl.rows; r++) {
      this.floorGrid.push(Array(lvl.cols).fill(null));
    }

    this.grid = [];
    for (let r = 0; r < lvl.rows; r++) {
      this.grid.push(Array(lvl.cols).fill(null));
    }

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

    for (let r = 0; r < lvl.rows; r++) {
      for (let c = 0; c < lvl.cols; c++) {
        if (!this.grid[r][c]) {
          this.grid[r][c] = this.createRandomItemWithoutMatch(r, c, lvl.items);
        }
      }
    }

    this.ensurePlayableBoard();
  }

  createRandomItemWithoutMatch(r, c, items) {
    const forbidden = new Set();

    if (c >= 2) {
      const left1 = this.grid[r][c - 1];
      const left2 = this.grid[r][c - 2];
      if (left1?.type === TILE_TYPES.ITEM && left2?.type === TILE_TYPES.ITEM && left1.color === left2.color) {
        forbidden.add(left1.color);
      }
    }

    if (r >= 2) {
      const up1 = this.grid[r - 1][c];
      const up2 = this.grid[r - 2][c];
      if (up1?.type === TILE_TYPES.ITEM && up2?.type === TILE_TYPES.ITEM && up1.color === up2.color) {
        forbidden.add(up1.color);
      }
    }

    if (r >= 1 && c >= 1) {
      const up = this.grid[r - 1][c];
      const left = this.grid[r][c - 1];
      const diag = this.grid[r - 1][c - 1];
      if (
        up?.type === TILE_TYPES.ITEM &&
        left?.type === TILE_TYPES.ITEM &&
        diag?.type === TILE_TYPES.ITEM &&
        up.color === left.color &&
        up.color === diag.color
      ) {
        forbidden.add(up.color);
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
   * Checks if at least one legal move exists on the board
   */
  hasValidMove() {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = this.grid[r][c];
        if (!t || t.type === TILE_TYPES.WOOD || t.type === TILE_TYPES.EMPTY) continue;
        if (this.isBooster(t)) return true;

        // Try swapping right and down
        const dirs = [{ dr: 0, dc: 1 }, { dr: 1, dc: 0 }];
        for (const { dr, dc } of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < rows && nc < cols) {
            const t2 = this.grid[nr][nc];
            if (!t2 || t2.type === TILE_TYPES.WOOD || t2.type === TILE_TYPES.EMPTY) continue;
            if (this.isBooster(t2)) return true;

            this.grid[r][c] = t2;
            this.grid[nr][nc] = t;
            const hasM = this.findMatches().length > 0;
            this.grid[r][c] = t;
            this.grid[nr][nc] = t2;
            if (hasM) return true;
          }
        }
      }
    }
    return false;
  }

  ensurePlayableBoard() {
    if (this.hasValidMove()) return false;

    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;
    const items = this.currentLevel.items;

    for (let attempt = 0; attempt < 15; attempt++) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (this.grid[r][c]?.type === TILE_TYPES.ITEM) {
            this.grid[r][c] = this.createRandomItemWithoutMatch(r, c, items);
          }
        }
      }
      if (this.hasValidMove()) return true;
    }
    return true;
  }

  swapTiles(r1, c1, r2, c2) {
    if (this.isWon || this.isLost || this.movesLeft <= 0) {
      return { status: 'game_over' };
    }

    const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
    if (dist !== 1) {
      return { status: 'not_adjacent' };
    }

    const t1 = this.grid[r1]?.[c1];
    const t2 = this.grid[r2]?.[c2];

    if (!t1 || !t2 || t1.type === TILE_TYPES.WOOD || t2.type === TILE_TYPES.WOOD) {
      return { status: 'cannot_swap_wood' };
    }

    // Case 1: Swapping two boosters together
    if (this.isBooster(t1) && this.isBooster(t2)) {
      this.movesLeft--;
      const comboRes = this.triggerBoosterCombo(r1, c1, r2, c2);
      this.applyGravityAndRefill();
      this.processCascades();
      const autoShuffled = this.ensurePlayableBoard();
      this.checkLevelOutcome();

      return {
        status: 'combo_activated',
        ...comboRes,
        autoShuffled,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }

    // Case 2: Rainbow Ball swapped with a regular item (Fixed object coordinate signature!)
    if (t1.type === TILE_TYPES.RAINBOW && t2.type === TILE_TYPES.ITEM) {
      this.movesLeft--;
      const res = this.triggerRainbowItem({ r: r1, c: c1 }, t2.color);
      this.applyGravityAndRefill();
      this.processCascades();
      const autoShuffled = this.ensurePlayableBoard();
      this.checkLevelOutcome();
      return {
        status: 'rainbow_activated',
        ...res,
        autoShuffled,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }
    if (t2.type === TILE_TYPES.RAINBOW && t1.type === TILE_TYPES.ITEM) {
      this.movesLeft--;
      const res = this.triggerRainbowItem({ r: r2, c: c2 }, t1.color);
      this.applyGravityAndRefill();
      this.processCascades();
      const autoShuffled = this.ensurePlayableBoard();
      this.checkLevelOutcome();
      return {
        status: 'rainbow_activated',
        ...res,
        autoShuffled,
        movesLeft: this.movesLeft,
        score: this.score,
        goals: this.goals,
        isWon: this.isWon,
        isLost: this.isLost
      };
    }

    // Case 3: Regular Swap
    this.grid[r1][c1] = t2;
    this.grid[r2][c2] = t1;

    const matches = this.findMatches();

    if (matches.length === 0) {
      this.grid[r1][c1] = t1;
      this.grid[r2][c2] = t2;
      return { status: 'invalid_swap' };
    }

    this.movesLeft--;
    this.comboCount = 1;

    const blastRes = this.resolveMatches(matches, { r: r2, c: c2 });
    this.applyGravityAndRefill();
    this.processCascades();
    const autoShuffled = this.ensurePlayableBoard();
    this.checkLevelOutcome();

    return {
      status: 'swap_success',
      ...blastRes,
      autoShuffled,
      movesLeft: this.movesLeft,
      score: this.score,
      goals: this.goals,
      isWon: this.isWon,
      isLost: this.isLost
    };
  }

  activateBooster(r, c) {
    if (this.isWon || this.isLost || this.movesLeft <= 0) return { status: 'game_over' };
    const tile = this.grid[r]?.[c];
    if (!this.isBooster(tile)) return { status: 'not_booster' };

    this.movesLeft--;
    const res = this.detonateSingleBooster(r, c);
    this.applyGravityAndRefill();
    this.processCascades();
    const autoShuffled = this.ensurePlayableBoard();
    this.checkLevelOutcome();

    return {
      status: 'booster_detonated',
      ...res,
      autoShuffled,
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
    const matchedCoords = new Map();

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
                hLen: matchLen,
                vLen: 0,
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
                hLen: prev ? prev.hLen : 0,
                vLen: matchLen,
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
            const key = `${cell.r},${cell.c}`;
            const prev = matchedCoords.get(key) || { r: cell.r, c: cell.c, color: t1.color, hLen: 0, vLen: 0 };
            matchedCoords.set(key, {
              ...prev,
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
    const maxStraight = Math.max(...matchList.map(m => Math.max(m.hLen || 0, m.vLen || 0)));
    const hasSquare = matchList.some(m => m.isSquare);
    const hasCross = matchList.some(m => m.dir === 'cross');

    // Authentic Matchington Booster Priority:
    // 1. Straight 5+ -> Rainbow Ball
    // 2. T or L shape (3x3 intersection) -> Bomb
    // 3. 2x2 Square -> Paper Plane
    // 4. Straight 4 -> Rocket (H or V)
    if (maxStraight >= 5) {
      createdBooster = TILE_TYPES.RAINBOW;
    } else if (hasCross) {
      createdBooster = TILE_TYPES.BOMB;
    } else if (hasSquare) {
      createdBooster = TILE_TYPES.PAPER_PLANE;
    } else if (maxStraight === 4) {
      const hMatch = matchList.find(m => m.hLen === 4);
      createdBooster = hMatch ? TILE_TYPES.ROCKET_H : TILE_TYPES.ROCKET_V;
    }

    const clearedPositions = [];

    for (const m of matchList) {
      const { r, c } = m;
      const tile = this.grid[r][c];
      if (!tile || tile.type === TILE_TYPES.EMPTY) continue;

      if (tile.color && this.goals.items && this.goals.items[tile.color] > 0) {
        this.goals.items[tile.color]--;
      }

      if (this.floorGrid[r][c] === 'ice') {
        this.floorGrid[r][c] = null;
        if (this.goals.ice > 0) this.goals.ice--;
      }

      this.damageAdjacentWood(r, c);

      this.grid[r][c] = { type: TILE_TYPES.EMPTY };
      clearedPositions.push({ r, c });
    }

    if (createdBooster) {
      const crossCenter = matchList.find(m => m.dir === 'cross');
      const target = (spawnPoint && matchList.some(m => m.r === spawnPoint.r && m.c === spawnPoint.c))
        ? spawnPoint
        : (crossCenter || { r: matchList[0].r, c: matchList[0].c });

      this.grid[target.r][target.c] = {
        type: createdBooster,
        color: null
      };
    }

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

  getMostProminentItemColor() {
    const counts = {};
    for (let r = 0; r < this.currentLevel.rows; r++) {
      for (let c = 0; c < this.currentLevel.cols; c++) {
        const t = this.grid[r][c];
        if (t && t.type === TILE_TYPES.ITEM && t.color) {
          counts[t.color] = (counts[t.color] || 0) + 1;
        }
      }
    }
    if (this.goals.items) {
      for (const [itemCol, rem] of Object.entries(this.goals.items)) {
        if (rem > 0 && counts[itemCol] > 0) return itemCol;
      }
    }
    let best = this.currentLevel.items[0];
    let max = -1;
    for (const [col, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        best = col;
      }
    }
    return best;
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
          cleared.push({ r, c });
        }
      }
    }

    const processed = this.processClearedTiles(cleared);
    this.score += processed.length * 30 + 300;
    return { clearedPositions: processed };
  }

  getPositionsForBoosterEffect(type, r, c, excludeTargets = new Set()) {
    const cleared = [];
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    if (type === TILE_TYPES.ROCKET_H) {
      for (let col = 0; col < cols; col++) cleared.push({ r, c: col });
    } else if (type === TILE_TYPES.ROCKET_V) {
      for (let row = 0; row < rows; row++) cleared.push({ r: row, c });
    } else if (type === TILE_TYPES.BOMB) {
      for (let ro = r - 1; ro <= r + 1; ro++) {
        for (let co = c - 1; co <= c + 1; co++) {
          if (ro >= 0 && ro < rows && co >= 0 && co < cols) {
            cleared.push({ r: ro, c: co });
          }
        }
      }
    } else if (type === TILE_TYPES.PAPER_PLANE) {
      // Takeoff 4-petal cross + homing strike on priority objective!
      const petals = [
        { r, c },
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 }
      ];
      for (const p of petals) {
        if (p.r >= 0 && p.r < rows && p.c >= 0 && p.c < cols) {
          cleared.push(p);
          excludeTargets.add(`${p.r},${p.c}`);
        }
      }
      const target = this.findPlaneTarget(excludeTargets);
      if (target) {
        cleared.push(target);
        excludeTargets.add(`${target.r},${target.c}`);
      }
    } else if (type === TILE_TYPES.RAINBOW) {
      const color = this.getMostProminentItemColor();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (this.grid[row][col]?.type === TILE_TYPES.ITEM && this.grid[row][col].color === color) {
            cleared.push({ r: row, c: col });
          }
        }
      }
    }
    return cleared;
  }

  detonateSingleBooster(r, c) {
    const b = this.grid[r][c];
    this.grid[r][c] = { type: TILE_TYPES.EMPTY };

    if (b.type === TILE_TYPES.RAINBOW) {
      return this.triggerRainbowItem({ r, c }, this.getMostProminentItemColor());
    }

    const excludeSet = new Set([`${r},${c}`]);
    const initial = this.getPositionsForBoosterEffect(b.type, r, c, excludeSet);
    const planeTarget = b.type === TILE_TYPES.PAPER_PLANE ? initial[initial.length - 1] : null;
    const processed = this.processClearedTiles(initial, excludeSet);
    this.score += processed.length * 25 + 100;
    return {
      boosterType: b.type,
      planeOrigin: { r, c },
      planeTarget,
      clearedPositions: processed
    };
  }

  findPlaneTarget(excludeSet = new Set()) {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    // 1. Prioritize Ice Floor Tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        if (!excludeSet.has(key) && this.floorGrid[r][c] === 'ice') return { r, c };
      }
    }
    // 2. Prioritize Wood Obstacles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        if (!excludeSet.has(key) && this.grid[r][c]?.type === TILE_TYPES.WOOD) return { r, c };
      }
    }
    // 3. Prioritize Goal Items
    if (this.goals.items) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const key = `${r},${c}`;
          const t = this.grid[r][c];
          if (!excludeSet.has(key) && t?.type === TILE_TYPES.ITEM && this.goals.items[t.color] > 0) {
            return { r, c };
          }
        }
      }
    }
    // 4. Fallback to any non-empty cell
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        if (!excludeSet.has(key) && this.grid[r][c]?.type !== TILE_TYPES.EMPTY) {
          return { r, c };
        }
      }
    }
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
    const excludeSet = new Set([`${r1},${c1}`, `${r2},${c2}`]);

    if (b1.type === TILE_TYPES.RAINBOW && b2.type === TILE_TYPES.RAINBOW) {
      for (let r = 0; r < this.currentLevel.rows; r++) {
        for (let c = 0; c < this.currentLevel.cols; c++) {
          cleared.push({ r, c });
        }
      }
      this.score += 2500;
    } else if (types.includes(TILE_TYPES.RAINBOW)) {
      // Rainbow + Rocket/Bomb/Plane: transforms all of the dominant color into that booster and fires them!
      const otherType = b1.type === TILE_TYPES.RAINBOW ? b2.type : b1.type;
      const targetColor = this.getMostProminentItemColor();
      for (let r = 0; r < this.currentLevel.rows; r++) {
        for (let c = 0; c < this.currentLevel.cols; c++) {
          const t = this.grid[r][c];
          if (t && t.type === TILE_TYPES.ITEM && t.color === targetColor) {
            cleared.push({ r, c });
            const subType = (otherType === TILE_TYPES.ROCKET_H || otherType === TILE_TYPES.ROCKET_V)
              ? ((r + c) % 2 === 0 ? TILE_TYPES.ROCKET_H : TILE_TYPES.ROCKET_V)
              : otherType;
            cleared.push(...this.getPositionsForBoosterEffect(subType, r, c, excludeSet));
          }
        }
      }
      this.score += 1600;
    } else if (b1.type === TILE_TYPES.PAPER_PLANE && b2.type === TILE_TYPES.PAPER_PLANE) {
      // Plane + Plane: 3 distinct homing Paper Planes launch!
      for (let i = 0; i < 3; i++) {
        const t = this.findPlaneTarget(excludeSet);
        if (t) {
          excludeSet.add(`${t.r},${t.c}`);
          cleared.push(t);
        }
      }
      this.score += 900;
    } else if (b1.type === TILE_TYPES.BOMB && b2.type === TILE_TYPES.BOMB) {
      for (let ro = r1 - 2; ro <= r1 + 2; ro++) {
        for (let co = c1 - 2; co <= c1 + 2; co++) {
          if (ro >= 0 && ro < this.currentLevel.rows && co >= 0 && co < this.currentLevel.cols) {
            cleared.push({ r: ro, c: co });
          }
        }
      }
      this.score += 1200;
    } else if (types.includes(TILE_TYPES.BOMB) && (types.includes(TILE_TYPES.ROCKET_H) || types.includes(TILE_TYPES.ROCKET_V))) {
      // Rocket + Bomb: 3 full rows and 3 full columns Mega Cross!
      for (let ro = r1 - 1; ro <= r1 + 1; ro++) {
        if (ro >= 0 && ro < this.currentLevel.rows) {
          for (let c = 0; c < this.currentLevel.cols; c++) cleared.push({ r: ro, c });
        }
      }
      for (let co = c1 - 1; co <= c1 + 1; co++) {
        if (co >= 0 && co < this.currentLevel.cols) {
          for (let r = 0; r < this.currentLevel.rows; r++) cleared.push({ r, c: co });
        }
      }
      this.score += 1300;
    } else {
      // Cross Blast (Rocket + Rocket or Plane + Rocket/Bomb)
      for (let col = 0; col < this.currentLevel.cols; col++) cleared.push({ r: r1, c: col });
      for (let row = 0; row < this.currentLevel.rows; row++) cleared.push({ r: row, c: c1 });
      this.score += 900;
    }

    const processed = this.processClearedTiles(cleared, excludeSet);
    return { combo: comboKey, clearedPositions: processed };
  }

  /**
   * Processes cleared tiles with full recursive chain-detonation when a blast hits another booster!
   */
  processClearedTiles(positions, excludeSet = new Set()) {
    const queue = [...positions];
    const visited = new Set();
    const clearedList = [];

    while (queue.length > 0) {
      const p = queue.shift();
      const key = `${p.r},${p.c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const cell = this.grid[p.r]?.[p.c];
      if (!cell) continue;

      if (this.floorGrid[p.r]?.[p.c] === 'ice') {
        this.floorGrid[p.r][p.c] = null;
        if (this.goals.ice > 0) this.goals.ice--;
      }

      if (cell.type === TILE_TYPES.EMPTY) continue;

      // Chain-detonate if this cell is another booster!
      if (this.isBooster(cell)) {
        const subType = cell.type;
        this.grid[p.r][p.c] = { type: TILE_TYPES.EMPTY };
        clearedList.push(p);
        const chained = this.getPositionsForBoosterEffect(subType, p.r, p.c, excludeSet);
        queue.push(...chained);
        this.score += 120;
        continue;
      }

      if (cell.type === TILE_TYPES.WOOD) {
        if (this.goals.wood > 0) this.goals.wood--;
        this.grid[p.r][p.c] = { type: TILE_TYPES.EMPTY };
        clearedList.push(p);
        continue;
      }

      if (cell.color && this.goals.items && this.goals.items[cell.color] > 0) {
        this.goals.items[cell.color]--;
      }

      this.damageAdjacentWood(p.r, p.c);
      this.grid[p.r][p.c] = { type: TILE_TYPES.EMPTY };
      clearedList.push(p);
    }

    return clearedList;
  }

  /**
   * Gravity & Refill: Movable items slip past fixed WOOD obstacles so no dead empty holes ever remain below wood!
   */
  applyGravityAndRefill() {
    const rows = this.currentLevel.rows;
    const cols = this.currentLevel.cols;

    for (let c = 0; c < cols; c++) {
      // Collect all movable non-wood items in this column from bottom to top
      const movable = [];
      for (let r = rows - 1; r >= 0; r--) {
        const item = this.grid[r][c];
        if (item && item.type !== TILE_TYPES.EMPTY && item.type !== TILE_TYPES.WOOD) {
          movable.push(item);
        }
      }

      // Place movable items into non-wood slots from bottom to top, then fill remaining top slots with new items
      let mIdx = 0;
      for (let r = rows - 1; r >= 0; r--) {
        if (this.grid[r][c]?.type === TILE_TYPES.WOOD) continue;
        if (mIdx < movable.length) {
          this.grid[r][c] = movable[mIdx++];
        } else {
          this.grid[r][c] = {
            type: TILE_TYPES.ITEM,
            color: this.currentLevel.items[Math.floor(Math.random() * this.currentLevel.items.length)]
          };
        }
      }
    }
  }

  processCascades() {
    let matches = this.findMatches();
    let cascades = 0;

    while (matches.length > 0 && cascades < 20) {
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

      this.score += this.movesLeft * 200;

      const th = this.currentLevel.starThresholds;
      this.stars = this.score >= th[2] ? 3 : this.score >= th[1] ? 2 : 1;

      this.starsAvailable += 1;
      this.totalCoins += this.stars * 20;

      if (!this.levelStars[this.levelIndex] || this.stars > this.levelStars[this.levelIndex]) {
        this.levelStars[this.levelIndex] = this.stars;
      }
      if (!this.levelScores[this.levelIndex] || this.score > this.levelScores[this.levelIndex]) {
        this.levelScores[this.levelIndex] = this.score;
      }
      if (this.levelIndex >= this.highestLevelUnlocked) {
        this.highestLevelUnlocked = Math.min(this.levelIndex + 1, MATCHINGTON_LEVELS.length - 1);
      }
      this.savePlayerData();
    } else if (this.movesLeft <= 0) {
      this.isLost = true;
    }
  }

  /**
   * First-time renovation of a furniture spot costs 1 Star; switching styles afterward is FREE!
   */
  renovateRoomTask(taskId, choiceId) {
    const alreadyRenovated = !!this.renovations[taskId];

    if (!alreadyRenovated && this.starsAvailable < 1) {
      return { success: false, reason: 'not_enough_stars' };
    }

    if (!alreadyRenovated) {
      this.starsAvailable -= 1;
    }
    this.renovations[taskId] = choiceId;
    this.savePlayerData();
    return {
      success: true,
      taskId,
      choiceId,
      wasFreeRestyle: alreadyRenovated,
      starsRemaining: this.starsAvailable
    };
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
