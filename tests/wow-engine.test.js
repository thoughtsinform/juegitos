/**
 * Unit test suite for Words of Wonders (WoW) Engine
 */

import { WowEngine } from '../src/wow/engine.js';
import assert from 'node:assert';

console.log('--- Testing Words of Wonders (WoW) Engine ---');

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v.toString(); },
  removeItem: (k) => { delete store[k]; }
};

const engine = new WowEngine('Ellen');
assert.strictEqual(engine.levelIndex, 0, 'Should start at level 0 (Giza)');
assert.strictEqual(engine.currentLevel.wonder, 'Great Pyramid of Giza');

// Grid dimensions check
assert.strictEqual(engine.grid.length, 3, 'Giza grid should have 3 rows');
assert.strictEqual(engine.grid[0].length, 3, 'Giza grid should have 3 cols');

// Check initial intersection: (0, 1) should be shared between CAT and ACT ('A')
const intersectingCell = engine.grid[0][1];
assert.ok(intersectingCell, 'Cell (0, 1) must exist');
assert.strictEqual(intersectingCell.letter, 'A', 'Intersecting cell should be letter A');
assert.strictEqual(intersectingCell.wordIds.length, 2, 'Cell (0, 1) should intersect 2 words');
assert.strictEqual(intersectingCell.isRevealed, false, 'Should be hidden initially');

// Test submitting CAT
const resCat = engine.submitWord('CAT');
assert.strictEqual(resCat.status, 'success', 'CAT should be accepted as crossword word');
assert.strictEqual(intersectingCell.isRevealed, true, 'Intersecting A should now be revealed');
assert.strictEqual(engine.solvedWords.has('w1'), true, 'Word w1 should be marked solved');
assert.strictEqual(resCat.isLevelComplete, false, 'Level not complete yet (ACT remains)');

// Test submitting CAT again
const resCatDup = engine.submitWord('CAT');
assert.strictEqual(resCatDup.status, 'already_found', 'Resubmitting CAT should report already_found');

// Test submitting Bonus word 'AT'
const resBonus = engine.submitWord('AT');
assert.strictEqual(resBonus.status, 'bonus', 'AT should be accepted as bonus word');
assert.strictEqual(engine.bonusWordsFound.has('AT'), true, 'AT should be in bonus jar');

// Test invalid word
const resInvalid = engine.submitWord('ZZZ');
assert.strictEqual(resInvalid.status, 'invalid', 'ZZZ should be invalid');

// Test Lightbulb hint
const initialCoins = engine.coins;
const hintRes = engine.useLightbulb();
assert.strictEqual(hintRes.success, true, 'Lightbulb hint should succeed');
assert.strictEqual(engine.coins, initialCoins - 25, 'Lightbulb should cost 25 coins');

// Test completing level with ACT
const resAct = engine.submitWord('ACT');
assert.strictEqual(resAct.status, 'success');
assert.strictEqual(resAct.isLevelComplete, true, 'Submitting ACT should complete Level 1!');
assert.strictEqual(engine.isLevelWon, true, 'Level won flag should be set');
assert.strictEqual(engine.stars >= 3, true, 'Should award at least 3 stars');

console.log('✓ All Words of Wonders Engine tests passed!');
