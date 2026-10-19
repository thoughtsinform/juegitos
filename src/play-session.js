// Local, separate saved games for each family member.
const copy = value => JSON.parse(JSON.stringify(value, (_, v) => v instanceof Set ? { _set: [...v] } : v), (_, v) => v && v._set ? new Set(v._set) : v);

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
    if (saved.levelIndex !== undefined && engine.initLevel) engine.initLevel(saved.levelIndex);
    for (const f of fields) if (f in saved) engine[f] = copy(saved[f]);
    if (game === 'spider') engine.startTime = Date.now() - engine.elapsedSeconds * 1000;
  };
  try {
    const saved = JSON.parse(localStorage.getItem(key), (_, v) => v && v._set ? new Set(v._set) : v);
    const board = saved?.state?.grid || saved?.state?.columns;
    if (saved?.version === 1 && Array.isArray(board) && board.length > 0) {
      apply(saved.state);
      undo = saved.undo || [];
    }
  } catch (e) { /* A missing or unreadable save starts a fresh game. */ }
  engine.saveSession = () => {
    try { localStorage.setItem(key, JSON.stringify({ version: 1, state: state(), undo }, (_, v) => v instanceof Set ? { _set: [...v] } : v)); } catch (e) {}
  };
  engine.undoTurn = () => {
    if (!undo.length || engine.isWon) return false;
    const previous = undo.pop();
    // initLevel is wrapped below; keep the remaining history while restoring.
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
    engine[name] = (...args) => { const result = original(...args); undo = []; engine.saveSession(); return result; };
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
