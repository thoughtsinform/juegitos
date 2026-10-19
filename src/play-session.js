// Local, separate saved games for each family member with schema & dimension validation.
const copy = value => JSON.parse(
  JSON.stringify(value, (_, v) => v instanceof Set ? { _set: [...v] } : v),
  (_, v) => v && v._set ? new Set(v._set) : v
);

function isBoardCompatible(engine, game, saved) {
  if (!saved || typeof saved !== 'object') return false;
  if (game === 'spider') {
    return Array.isArray(saved.columns) && saved.columns.length === 10 && Array.isArray(saved.stock);
  }
  const lvl = engine.currentLevel;
  if (!lvl) return false;
  if (!Array.isArray(saved.grid) || saved.grid.length !== lvl.rows) return false;
  if (!Array.isArray(saved.grid[0]) || saved.grid[0].length !== lvl.cols) return false;

  if (game === 'wow') {
    if (!Array.isArray(saved.wheelLetters) || saved.wheelLetters.length !== lvl.letters.length) return false;
    const savedSorted = [...saved.wheelLetters].sort().join('');
    const lvlSorted = [...lvl.letters].sort().join('');
    if (savedSorted !== lvlSorted) return false;
    for (let r = 0; r < lvl.rows; r++) {
      for (let c = 0; c < lvl.cols; c++) {
        const sCell = saved.grid[r]?.[c];
        const eCell = engine.grid?.[r]?.[c];
        if (!sCell || !eCell) return false;
        if (Boolean(sCell.active) !== Boolean(eCell.active)) return false;
        if (eCell.active && sCell.char !== eCell.char) return false;
      }
    }
  }

  if (game === 'matchington') {
    if (!Array.isArray(saved.floorGrid) || saved.floorGrid.length !== lvl.rows) return false;
  }

  return true;
}

export function attachSession(engine, user, game) {
  const key = `jueguitos_session_v1_${user}_${game}`;
  const fields = {
    spider: ['difficulty', 'columns', 'stock', 'foundations', 'moves', 'score', 'history', 'initialDealSnapshot', 'elapsedSeconds', 'isWon'],
    wow: ['levelIndex', 'coins', 'stars', 'wheelLetters', 'grid', 'solvedWords', 'bonusWords', 'butterflyCollected', 'isLevelComplete'],
    toyblast: ['levelIndex', 'grid', 'goals', 'score', 'movesLeft', 'isWon', 'isLost', 'stars', 'randomState'],
    matchington: ['levelIndex', 'grid', 'floorGrid', 'goals', 'score', 'movesLeft', 'isWon', 'isLost', 'stars', 'comboCount', 'randomState']
  }[game];

  let undo = [];
  const state = () => copy(Object.fromEntries(fields.map(f => [f, engine[f]])));

  const apply = saved => {
    if (saved.levelIndex !== undefined && engine.initLevel) {
      engine.initLevel(saved.levelIndex);
    }
    // If level dimensions or wheel letters changed since an older save, preserve currency/level
    // but keep the freshly initialized board so rendering never crashes.
    if (!isBoardCompatible(engine, game, saved)) {
      if (game === 'wow') {
        if (typeof saved.coins === 'number') engine.coins = saved.coins;
        if (typeof saved.stars === 'number') engine.stars = saved.stars;
      }
      return;
    }
    for (const f of fields) {
      if (f in saved) engine[f] = copy(saved[f]);
    }
    if (game === 'spider') {
      engine.startTime = Date.now() - (engine.elapsedSeconds || 0) * 1000;
    }
  };

  try {
    const saved = JSON.parse(localStorage.getItem(key), (_, v) => v && v._set ? new Set(v._set) : v);
    const board = saved?.state?.grid || saved?.state?.columns;
    if (saved?.version === 1 && Array.isArray(board) && board.length > 0) {
      apply(saved.state);
      undo = Array.isArray(saved.undo) ? saved.undo : [];
    }
  } catch (e) {
    // A missing or unreadable save starts a fresh game.
  }

  engine.saveSession = () => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, state: state(), undo }, (_, v) => v instanceof Set ? { _set: [...v] } : v)
      );
    } catch (e) {}
  };

  engine.undoTurn = () => {
    if (!undo.length || engine.isWon) return false;
    const previous = undo.pop();
    const remaining = [...undo];
    apply(previous);
    undo = remaining;
    engine.frames = [];
    engine.saveSession();
    return true;
  };

  const actions = {
    spider: ['moveSequence', 'dealFromStock', 'undo'],
    wow: ['submitWord', 'useRandomHint', 'useTargetedHint', 'shuffleWheel'],
    toyblast: ['tapCell'],
    matchington: ['swapTiles', 'activateBooster']
  }[game];

  for (const name of actions) {
    const original = engine[name].bind(engine);
    engine[name] = (...args) => {
      const before = state();
      engine.frames = [];
      const result = original(...args);
      if ((game === 'toyblast' || game === 'matchington') && before.movesLeft !== engine.movesLeft) {
        undo.push(before);
        if (undo.length > 30) undo.shift();
      }
      engine.saveSession();
      return result;
    };
  }

  for (const name of game === 'spider' ? ['startNewGame', 'restartCurrentDeal'] : ['initLevel']) {
    const original = engine[name].bind(engine);
    engine[name] = (...args) => {
      const result = original(...args);
      undo = [];
      engine.saveSession();
      return result;
    };
  }

  engine.saveSession();
  return engine;
}

export function seededRandom(engine) {
  engine.randomState = ((engine.randomState || 1) + 0x6D2B79F5) >>> 0;
  let t = engine.randomState;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
