/**
 * Unit Test Suite for Toy Blast Engine
 */

import { ToyBlastEngine, CELL_TYPES } from '../src/toyblast/engine.js';
import assert from 'node:assert';

console.log('--- Testing Toy Blast Engine ---');

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v.toString(); },
  removeItem: (k) => { delete store[k]; }
};

const engine = new ToyBlastEngine('Ellen');
assert.strictEqual(engine.levelIndex, 0, 'Should start at level 0');
assert.strictEqual(engine.currentLevel.name, 'Morning Playroom');
assert.strictEqual(engine.grid.length, 8, 'Grid should have 8 rows');
assert.strictEqual(engine.grid[0].length, 8, 'Grid should have 8 cols');

// Test tapping out of bounds
const resOOB = engine.tapCell(-1, 0);
assert.strictEqual(resOOB.status, 'out_of_bounds');

// Test connected group search with deterministic mock grid
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    engine.grid[r][c] = { type: CELL_TYPES.CUBE, color: 'blue', bubble: false };
  }
}
engine.grid[0][0] = { type: CELL_TYPES.CUBE, color: 'red', bubble: false };
engine.grid[0][1] = { type: CELL_TYPES.CUBE, color: 'red', bubble: false };
engine.grid[1][0] = { type: CELL_TYPES.CUBE, color: 'red', bubble: false };

const group = engine.findConnectedGroup(0, 0, 'red');
assert.strictEqual(group.length, 3, 'Group should have 3 connected red cubes');


// Test tapping a cluster of 3
const initialMoves = engine.movesLeft;
const resBlast = engine.tapCell(0, 0);
assert.strictEqual(resBlast.status, 'blasted');
assert.strictEqual(resBlast.groupSize, 3);
assert.strictEqual(engine.movesLeft, initialMoves - 1);
assert.strictEqual(resBlast.createdBooster, null, 'Group of 3 should not create a booster');

// Test booster creation for group of 5: clear surrounding area to 'blue'
for (let r = 1; r <= 3; r++) {
  for (let c = 0; c < 8; c++) {
    engine.grid[r][c] = { type: CELL_TYPES.CUBE, color: 'blue', bubble: false };
  }
}
engine.grid[2][0] = { type: CELL_TYPES.CUBE, color: 'yellow', bubble: false };
engine.grid[2][1] = { type: CELL_TYPES.CUBE, color: 'yellow', bubble: false };
engine.grid[2][2] = { type: CELL_TYPES.CUBE, color: 'yellow', bubble: false };
engine.grid[2][3] = { type: CELL_TYPES.CUBE, color: 'yellow', bubble: false };
engine.grid[2][4] = { type: CELL_TYPES.CUBE, color: 'yellow', bubble: false };

const resBooster = engine.tapCell(2, 2);
assert.strictEqual(resBooster.status, 'blasted');
assert.strictEqual(resBooster.groupSize, 5);
assert.ok(
  resBooster.createdBooster === CELL_TYPES.ROTOR_H || resBooster.createdBooster === CELL_TYPES.ROTOR_V,
  'Group of 5 should create a Rotor'
);

// Test booster creation for group of 7 (Bomb): clear surrounding area to 'red'
for (let r = 3; r <= 5; r++) {
  for (let c = 0; c < 8; c++) {
    engine.grid[r][c] = { type: CELL_TYPES.CUBE, color: 'red', bubble: false };
  }
}
for (let c = 0; c < 7; c++) {
  engine.grid[4][c] = { type: CELL_TYPES.CUBE, color: 'green', bubble: false };
}
const resBomb = engine.tapCell(4, 3);
assert.strictEqual(resBomb.status, 'blasted');
assert.strictEqual(resBomb.groupSize, 7);
assert.strictEqual(resBomb.createdBooster, CELL_TYPES.BOMB, 'Group of 7 should create Bomb');


// Test single booster detonation
engine.grid[5][5] = { type: CELL_TYPES.BOMB, color: null, bubble: false };
const resDetonate = engine.tapCell(5, 5);
assert.strictEqual(resDetonate.status, 'booster_activated');

// Test booster combo (Rotor + Bomb)
engine.grid[3][3] = { type: CELL_TYPES.BOMB, color: null, bubble: false };
engine.grid[3][4] = { type: CELL_TYPES.ROTOR_H, color: null, bubble: false };
const resCombo = engine.tapCell(3, 3);
assert.strictEqual(resCombo.status, 'booster_activated');
assert.ok(resCombo.combo, 'Adjacent boosters should trigger combo');

// Test Duck rescue at bottom
engine.initLevel(2); // Level 3: Duck Rescue
engine.goals.ducks = 1;
engine.goals.cubes = { yellow: 0 };
// Place duck at bottom row
engine.grid[engine.currentLevel.rows - 1][3] = { type: CELL_TYPES.DUCK, color: null, bubble: false };
engine.checkDucksAtBottom();
assert.strictEqual(engine.goals.ducks, 0, 'Duck at bottom row should be rescued');
engine.checkLevelOutcome();
assert.strictEqual(engine.isWon, true, 'Meeting goals should trigger level victory');

console.log('✓ All Toy Blast Engine tests passed!');
