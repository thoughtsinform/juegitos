import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Icons } from '../src/icons.js';
import { SpiderEngine } from '../src/spider/engine.js';
import { SpiderUI } from '../src/spider/ui.js';
import { WowEngine } from '../src/wow/engine.js';
import { WowUI } from '../src/wow/ui.js';
import { ToyBlastEngine } from '../src/toyblast/engine.js';
import { ToyBlastUI } from '../src/toyblast/ui.js';
import { MatchingtonEngine } from '../src/matchington/engine.js';
import { MatchingtonUI } from '../src/matchington/ui.js';
import { ArcadeNav } from '../src/arcade-nav.js';
import { StepCounter } from '../src/step-counter.js';

function makeMockElement(id = '') {
  return {
    id,
    innerHTML: '',
    textContent: '',
    hidden: false,
    style: { display: '', setProperty() {} },
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return ''; },
    querySelector() { return makeMockElement(); },
    querySelectorAll() { return []; },
    appendChild() {},
    remove() {},
    getContext() {
      return {
        clearRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        fill() {},
        arc() {},
        setTransform() {}
      };
    },
    getBoundingClientRect() { return { left: 0, top: 0, width: 320, height: 320 }; }
  };
}

test('Every Icons.* call across the codebase exists and returns valid SVG', () => {
  const files = [
    'src/app.js',
    'src/arcade-nav.js',
    'src/step-counter.js',
    'src/toast.js',
    'src/spider/ui.js',
    'src/spider/card-renderer.js',
    'src/wow/ui.js',
    'src/toyblast/ui.js',
    'src/matchington/ui.js'
  ];
  for (const f of files) {
    const code = fs.readFileSync(f, 'utf8');
    const matches = [...code.matchAll(/Icons\.([a-zA-Z0-9_]+)\s*\(/g)];
    for (const m of matches) {
      const iconName = m[1];
      assert.equal(typeof Icons[iconName], 'function', `Missing Icons.${iconName} in ${f}`);
      const svg = Icons[iconName]('test-cls', 16);
      assert.ok(svg.includes('<svg'), `Icons.${iconName} did not return SVG`);
    }
  }
});

test('All 4 Game UIs, ArcadeNav, and StepCounter render non-empty DOM without errors', () => {
  global.window = {
    innerWidth: 390,
    innerHeight: 844,
    addEventListener() {},
    removeEventListener() {},
    requestAnimationFrame() {},
    cancelAnimationFrame() {},
    location: { hostname: 'localhost' }
  };
  global.location = global.window.location;
  global.localStorage = {
    store: { juegitos_current_user: 'Ellen' },
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; }
  };
  global.document = {
    readyState: 'complete',
    hidden: false,
    documentElement: makeMockElement('html'),
    body: makeMockElement('body'),
    getElementById(id) { return makeMockElement(id); },
    querySelector() { return makeMockElement(); },
    querySelectorAll() { return []; },
    createElement(tag) { return makeMockElement(tag); },
    addEventListener() {}
  };

  const stepEl = makeMockElement('stepBannerContainer');
  const stepCounter = new StepCounter({ user: 'Ellen', container: stepEl });
  assert.equal(stepCounter.isEnabled(), false, 'Step counter must be off by default');
  assert.equal(stepEl.hidden, true);

  const navEl = makeMockElement('arcadeNavContainer');
  new ArcadeNav({ container: navEl, stepCounter });
  assert.ok(navEl.innerHTML.includes('Jueguitos Menu'));

  const spiderEl = makeMockElement('spider');
  const spiderEngine = new SpiderEngine(2);
  spiderEngine.startNewGame(2);
  const spiderUI = new SpiderUI(spiderEngine, spiderEl);
  assert.ok(spiderEl.innerHTML.length > 1000);
  spiderUI.destroy();

  const wowEl = makeMockElement('wow');
  const wowUI = new WowUI(new WowEngine('Ellen'), wowEl);
  assert.ok(wowEl.innerHTML.length > 1000);
  wowUI.destroy();

  const tbEl = makeMockElement('toyblast');
  const tbUI = new ToyBlastUI(new ToyBlastEngine('Ellen'), tbEl);
  assert.ok(tbEl.innerHTML.length > 1000);
  tbUI.destroy();

  const mmEl = makeMockElement('matchington');
  const mmUI = new MatchingtonUI(new MatchingtonEngine('Ellen'), mmEl);
  assert.ok(mmEl.innerHTML.length > 1000);
  mmUI.destroy();
});
