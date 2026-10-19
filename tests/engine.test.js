/**
 * Unit test suite for SpiderEngine and Auth
 */

import { Auth } from '../src/auth.js';
import { SpiderEngine, SUITS, Card } from '../src/spider/engine.js';
import assert from 'node:assert';

console.log('--- Testing Auth ---');
// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v.toString(); },
  removeItem: (k) => { delete store[k]; }
};

// 1. Test Susan login
const susanRes = Auth.login('Susan', 'theclown');
assert.strictEqual(susanRes.success, true, 'Susan login should succeed');
assert.strictEqual(Auth.getCurrentUser().username, 'Susan', 'Current user should be Susan');

// 2. Test Ellen login
const ellenRes = Auth.login('Ellen', 'boom');
assert.strictEqual(ellenRes.success, true, 'Ellen login should succeed');
assert.strictEqual(Auth.getCurrentUser().username, 'Ellen', 'Current user should be Ellen');

// 3. Test Invalid login
const badRes = Auth.login('Susan', 'wrongpass');
assert.strictEqual(badRes.success, false, 'Bad password should fail');

console.log('✓ Auth tests passed!');

console.log('--- Testing Spider Engine ---');
const engine = new SpiderEngine(2);
engine.startNewGame(2);

// Check tableau columns count and initial deal
assert.strictEqual(engine.columns.length, 10, 'Tableau must have 10 columns');
for (let c = 0; c < 10; c++) {
  const expectedCount = c < 4 ? 6 : 5;
  assert.strictEqual(engine.columns[c].length, expectedCount, `Column ${c} should have ${expectedCount} cards`);
  // Top card must be face up
  assert.strictEqual(engine.columns[c][expectedCount - 1].faceUp, true, `Top card in column ${c} must be face-up`);
}

// Check stock deals
assert.strictEqual(engine.stock.length, 5, 'Stock should have 5 deals remaining');
for (const deal of engine.stock) {
  assert.strictEqual(deal.length, 10, 'Each stock deal must have 10 cards');
}

// Test deal from stock
assert.strictEqual(engine.canDealStock(), true, 'Should be able to deal stock when no empty columns');
const dealt = engine.dealFromStock();
assert.strictEqual(dealt.length, 10, 'Dealt 10 cards');
assert.strictEqual(engine.stock.length, 4, 'Stock should now have 4 deals');
assert.strictEqual(engine.moves, 1, 'Moves should increment to 1');
assert.strictEqual(engine.score, 499, 'Score should be 499');

// Test undo
const undone = engine.undo();
assert.strictEqual(undone, true, 'Undo should succeed');
assert.strictEqual(engine.stock.length, 5, 'Stock restored to 5');

// Test foundation sequence detection
const testCol = [];
for (let r = 13; r >= 1; r--) {
  testCol.push(new Card(SUITS.SPADES, r, true));
}
engine.columns[0] = testCol;
const clearedSuit = engine.checkAndClearFoundation(0);
assert.strictEqual(clearedSuit, SUITS.SPADES, 'Foundation clear must detect complete King to Ace run');
assert.strictEqual(engine.columns[0].length, 0, 'Column 0 should now be empty');
assert.strictEqual(engine.foundations.length, 1, 'Foundation should have 1 completed suit');
assert.strictEqual(engine.score, 599, 'Score should increase by 100 on foundation clear');

engine.stopTimer();
console.log('✓ Spider Engine tests passed!');

