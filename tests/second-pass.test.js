import test from 'node:test';
import assert from 'node:assert/strict';
import { attachSession } from '../src/play-session.js';
import { ToyBlastEngine } from '../src/toyblast/engine.js';
import { MatchingtonEngine, TILE_TYPES } from '../src/matchington/engine.js';
import { WowEngine } from '../src/wow/engine.js';
import { SpiderEngine } from '../src/spider/engine.js';
const store = new Map();
global.localStorage = {getItem:k=>store.get(k)||null, setItem:(k,v)=>store.set(k,v)};
function move(e) { for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(e.grid[r][c].type==='cube' && e.findConnectedGroup(r,c,e.grid[r][c].color).length>=2) return [r,c]; }
test('Toy retries are identical; undo restores the board and future random stream', () => {
  const e = attachSession(new ToyBlastEngine('a'),'a','toyblast');
  const initial = JSON.stringify(e.grid), p=move(e); e.tapCell(...p); const result = JSON.stringify(e.grid);
  assert.equal(e.undoTurn(),true); assert.equal(JSON.stringify(e.grid),initial);
  e.tapCell(...p); assert.equal(JSON.stringify(e.grid),result);
  const moves=e.movesLeft; const restored=attachSession(new ToyBlastEngine('a'),'a','toyblast');
  assert.equal(restored.movesLeft,moves); assert.equal(JSON.stringify(restored.grid),result);
  const b=attachSession(new ToyBlastEngine('b'),'b','toyblast'); assert.equal(b.movesLeft,b.currentLevel.moves);
  e.restartLevel(); assert.equal(JSON.stringify(e.grid),initial);
});
test('Words resume letters and sets without awarding duplicate coins', () => {
  const e=attachSession(new WowEngine('w'),'w','wow'); e.submitWord('CAST'); const coins=e.coins;
  const b=attachSession(new WowEngine('w'),'w','wow');
  assert.ok(b.solvedWords instanceof Set); assert.ok(b.solvedWords.has('CAST')); assert.equal(b.coins,coins);
  assert.equal(b.submitWord('CAST').status,'already_found'); assert.equal(b.coins,coins);
});
test('Spider resumes board and undo history after reload', () => {
  const e=new SpiderEngine(); e.startNewGame(); attachSession(e,'s','spider'); const initial=JSON.stringify(e.columns); e.dealFromStock();
  const b=new SpiderEngine(); b.startNewGame(); attachSession(b,'s','spider');
  assert.equal(b.stock.length,40); assert.equal(b.undo(),true); assert.equal(JSON.stringify(b.columns),initial);
});
test('Mansion boosters activate when swapped with ordinary tiles', () => {
  const e=new MatchingtonEngine('m'); e.grid[0][0]={type:TILE_TYPES.ROCKET_H};
  const before=e.movesLeft; const result=e.swapTiles(0,0,0,1);
  assert.equal(result.status,'booster_detonated'); assert.equal(e.movesLeft,before-1);
  assert.ok(e.frames.some(f=>f.kind==='clear')); assert.ok(e.frames.some(f=>f.kind==='fall'));
});
test('Separate Mansion matches each earn a booster in their own group', () => {
  const e=new MatchingtonEngine('g'); const matches=[];
  for(const [row,color] of [[0,'pillow'],[4,'book']]) for(let c=0;c<4;c++) { e.grid[row][c]={type:'item',color}; matches.push({r:row,c,hLen:4,vLen:1}); }
  e.resolveMatches(matches,{r:0,c:1});
  assert.equal(e.grid[0][1].type,'rocket_h'); assert.equal(e.grid[4][0].type,'rocket_h');
});
test('Winning rewards occur once', () => {
  for (const E of [ToyBlastEngine,MatchingtonEngine]) {
    const e=new E('reward'); for (const k of Object.keys(e.goals)) e.goals[k]=typeof e.goals[k]==='object'?{}:0;
    e.checkLevelOutcome(); const coins=e.totalCoins, stars=e.starsAvailable; e.checkLevelOutcome();
    assert.equal(e.totalCoins,coins); assert.equal(e.starsAvailable,stars);
  }
});
