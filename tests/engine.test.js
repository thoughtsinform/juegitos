import test from 'node:test';
import assert from 'node:assert/strict';
import { SpiderEngine } from '../src/spider/engine.js';
const card = (rank, suit = 'spades', faceUp = true) => ({ rank, suit, faceUp });
test('Spider deals 104 cards, preserves exact restart, and undoes stock', () => {
  const e = new SpiderEngine(2); e.startNewGame();
  assert.equal(e.columns.length, 10);
  assert.equal(e.columns.flat().length, 54); assert.equal(e.stock.length, 50);
  const original = JSON.stringify(e.columns);
  assert.equal(e.canDealStock().allowed, true);
  assert.equal(e.dealFromStock().success, true); assert.equal(e.stock.length, 40);
  assert.equal(e.undo(), true); assert.equal(JSON.stringify(e.columns), original);
  e.dealFromStock(); e.restartCurrentDeal(); assert.equal(JSON.stringify(e.columns), original);
  e.columns[0] = []; assert.equal(e.canDealStock().reason, 'empty_columns');
});
test('Spider completes only a descending same-suit run and prefers same-suit targets', () => {
  const e = new SpiderEngine(); e.startNewGame();
  e.columns = Array.from({length:10}, () => []);
  e.columns[0] = Array.from({length:13}, (_,i) => card(13-i));
  assert.equal(e.checkAndSweepCompletedRun(0), 'spades'); assert.equal(e.foundations.length, 1);
  e.columns[0] = [card(7)]; e.columns[1] = [card(8,'hearts')]; e.columns[2] = [card(8)];
  assert.equal(e.findBestDestination(0,0).toCol, 2);
  e.columns[3] = [card(6), card(5,'hearts')]; assert.equal(e.isValidSequence(3,0), false);
  assert.equal(e.canMoveSequence(0,0,4), true);
});
