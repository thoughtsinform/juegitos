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

// Test hint-driven completion (reveal all remaining cells via hints triggers victory)
const engine2 = new WowEngine('Susan');
engine2.coins = 500; // Give Susan enough coins
// Reveal cells with lightbulb until complete
let loops = 0;
while (!engine2.isLevelWon && loops < 10) {
  const h = engine2.useLightbulb();
  if (!h.success) break;
  loops++;
}
assert.strictEqual(engine2.isLevelWon, true, 'Using hints to reveal all cells must complete level');
assert.strictEqual(engine2.solvedWords.size, engine2.currentLevel.words.length, 'All words must be marked solved');

// Test dictionary validation: nonsense letters should NOT be accepted as bonus words
const nonsenseRes = engine2.submitWord('PYL');
assert.strictEqual(nonsenseRes.status, 'invalid', 'Nonsense word PYL must be invalid');

// Validate all levels in WOW_LEVELS
import { WOW_LEVELS } from '../src/wow/levels.js';
for (const [idx, lvl] of WOW_LEVELS.entries()) {
  const letters = [...lvl.letters];
  for (const w of lvl.words) {
    const wordLetters = [...w.word];
    // Each word must be formable from level letters
    const tempLetters = [...letters];
    for (const ch of wordLetters) {
      const charIdx = tempLetters.indexOf(ch);
      assert.ok(charIdx !== -1, `Level ${idx + 1} (${lvl.wonder}): Word ${w.word} requires letter '${ch}' not available in wheel [${lvl.letters.join(',')}]`);
      tempLetters.splice(charIdx, 1);
    }
  }
}

console.log('✓ All Words of Wonders Engine tests passed!');

