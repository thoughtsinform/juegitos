/**
 * Unit Test Suite for Matchington Mansion Engine
 */

import { MatchingtonEngine, TILE_TYPES } from '../src/matchington/engine.js';
import assert from 'node:assert';

console.log('--- Testing Matchington Mansion Engine ---');

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v.toString(); },
  removeItem: (k) => { delete store[k]; }
};

const engine = new MatchingtonEngine('Susan');
assert.strictEqual(engine.levelIndex, 0, 'Should start at level 0 (Mansion Welcome)');
assert.strictEqual(engine.grid.length, 8, 'Grid should have 8 rows');
assert.strictEqual(engine.grid[0].length, 8, 'Grid should have 8 cols');

// Test invalid swap (not adjacent)
const resNonAdj = engine.swapTiles(0, 0, 2, 2);
assert.strictEqual(resNonAdj.status, 'not_adjacent');

// Test invalid swap (does not create match)
// Fill whole 8x8 grid with alternating checkerboard pattern
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    engine.grid[r][c] = { type: TILE_TYPES.ITEM, color: (r + c) % 2 === 0 ? 'pillow' : 'teacup' };
  }
}
const initialMoves = engine.movesLeft;
const resInv = engine.swapTiles(0, 0, 0, 1);
assert.strictEqual(resInv.status, 'invalid_swap');
assert.strictEqual(engine.movesLeft, initialMoves, 'Invalid swap should NOT deduct moves');


// Test valid 3-match swap
// Setup: row 0 cols 0, 1 are 'lamp', col 2 is 'book'. row 1 col 2 is 'lamp'. Swapping (0,2) and (1,2) forms 3 'lamp' on row 0.
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    engine.grid[r][c] = { type: TILE_TYPES.ITEM, color: 'pillow' };
  }
}
engine.grid[0][0] = { type: TILE_TYPES.ITEM, color: 'lamp' };
engine.grid[0][1] = { type: TILE_TYPES.ITEM, color: 'lamp' };
engine.grid[0][2] = { type: TILE_TYPES.ITEM, color: 'book' };
engine.grid[1][2] = { type: TILE_TYPES.ITEM, color: 'lamp' };

const resValid = engine.swapTiles(0, 2, 1, 2);
assert.strictEqual(resValid.status, 'swap_success');
assert.strictEqual(engine.movesLeft, initialMoves - 1, 'Valid swap should deduct 1 move');
assert.ok(engine.score > 0, 'Score should increase after match');

// Test Booster Creation: 2x2 square creates Paper Plane
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    engine.grid[r][c] = { type: TILE_TYPES.ITEM, color: (r + c) % 2 === 0 ? 'pillow' : 'teacup' };
  }
}
// Form 2x2 of 'gem'
engine.grid[2][2] = { type: TILE_TYPES.ITEM, color: 'gem' };
engine.grid[2][3] = { type: TILE_TYPES.ITEM, color: 'gem' };
engine.grid[3][2] = { type: TILE_TYPES.ITEM, color: 'gem' };
engine.grid[3][3] = { type: TILE_TYPES.ITEM, color: 'plant' };
engine.grid[3][4] = { type: TILE_TYPES.ITEM, color: 'gem' }; // Swap (3,3) and (3,4) completes 2x2!

const resPlane = engine.swapTiles(3, 3, 3, 4);
assert.strictEqual(resPlane.status, 'swap_success');
assert.strictEqual(resPlane.createdBooster, TILE_TYPES.PAPER_PLANE, '2x2 square should create Paper Plane');


// Test Ice clearing
engine.initLevel(1); // Level 2: Frosty Foyer Tiles (contains Ice)
engine.floorGrid[0][0] = 'ice';
engine.goals.ice = 1;
// Manually resolve matches on (0,0)
engine.resolveMatches([{ r: 0, c: 0, color: 'pillow' }]);
assert.strictEqual(engine.floorGrid[0][0], null, 'Ice should be cleared after match');
assert.strictEqual(engine.goals.ice, 0, 'Goal ice count should decrement');

// Test Renovation System
assert.ok(engine.starsAvailable >= 2, 'Should have initial renovation stars');
const initialStars = engine.starsAvailable;
const renoRes = engine.renovateRoomTask('foyer_rug', 'crimson');
assert.strictEqual(renoRes.success, true);
assert.strictEqual(engine.starsAvailable, initialStars - 1);
assert.strictEqual(engine.renovations['foyer_rug'], 'crimson');

console.log('✓ All Matchington Mansion Engine tests passed!');
