import test from 'node:test';
import assert from 'node:assert/strict';
import { WowEngine } from '../src/wow/engine.js';
import { WOW_LEVELS } from '../src/wow/levels.js';
global.localStorage = { getItem: () => null, setItem() {} };
test('Every crossword has legal letters, matching intersections, and can be completed', () => {
  for (let i=0;i<WOW_LEVELS.length;i++) {
    const e = new WowEngine('qa'); e.initLevel(i);
    const seen = new Map();
    for (const w of e.currentLevel.words) {
      assert.equal(e.canFormFromWheel(w.word), true, w.word);
      for (const [j,p] of e.getWordCells(w).entries()) {
        const k = `${p.r},${p.c}`; assert.ok(e.grid[p.r]?.[p.c]);
        if (seen.has(k)) assert.equal(seen.get(k), w.word[j], `${i}: intersection ${k}`);
        seen.set(k, w.word[j]);
      }
    }
    for (const w of e.currentLevel.words) e.submitWord(w.word);
    assert.equal(e.isLevelComplete, true); const coins = e.coins;
    e.checkLevelCompletion(); assert.equal(e.coins, coins);
  }
});
test('Words reject unavailable letters and duplicate rewards; hints finish puzzles', () => {
  const e = new WowEngine('qa');
  assert.equal(e.submitWord('ZZZ').status, 'invalid');
  assert.equal(e.submitWord('CAST').status, 'board_word');
  const coins = e.coins; assert.equal(e.submitWord('CAST').status, 'already_found'); assert.equal(e.coins, coins);
  e.coins = 10000;
  for(let i=0;i<40 && !e.isLevelComplete;i++) assert.equal(e.useRandomHint().success, true);
  assert.equal(e.isLevelComplete, true);
  e.setUser('fresh'); assert.equal(e.coins,150); assert.equal(e.stars,0);
});
