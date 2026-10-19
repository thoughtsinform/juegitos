const ids = new WeakMap();
let nextId = 1;
export function snapshotGrid(grid) {
  return grid.map(row => row.map(cell => {
    if (!cell) return cell;
    if (!ids.has(cell)) ids.set(cell, nextId++);
    return { ...cell, visualId: ids.get(cell) };
  }));
}
export function recordMotion(engine) {
  engine.captureFrame = (kind, positions = []) => {
    if (!engine.frames) engine.frames = [];
    engine.frames.push({ kind, positions, grid: snapshotGrid(engine.grid), floorGrid: engine.floorGrid?.map(row => [...row]) });
  };
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function playBoardTurn(ui, selector, render) {
  const frames = ui.engine.frames || [];
  if (!frames.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const finalGrid = ui.engine.grid, finalFloor = ui.engine.floorGrid;
  let previous = null;
  for (const frame of frames) {
    if (ui.destroyed || !ui.container.isConnected) return;
    const grid = ui.container.querySelector(selector);
    if (!grid) return;
    const oldRects = new Map();
    if (previous) previous.forEach((row, r) => row.forEach((cell, c) => {
      const el = grid.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      if (cell && el) oldRects.set(cell.visualId, el.getBoundingClientRect());
    }));
    ui.engine.grid = frame.grid;
    if (frame.floorGrid) ui.engine.floorGrid = frame.floorGrid;
    try { grid.innerHTML = render(); } finally { ui.engine.grid = finalGrid; ui.engine.floorGrid = finalFloor; }
    if (frame.kind === 'clear') {
      for (const p of frame.positions) {
        grid.querySelector(`[data-r="${p.r}"][data-c="${p.c}"]`)?.animate([
          { transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.88)', opacity: 1, offset: .35 }, { transform: 'scale(1.16)', opacity: 0 }
        ], { duration: 180, fill: 'forwards', easing: 'ease-out' });
      }
      await pause(190);
    } else if (frame.kind === 'fall') {
      frame.grid.forEach((row, r) => row.forEach((cell, c) => {
        const el = grid.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        if (!el || !cell || cell.type === 'wood' || cell.type === 'crate') return;
        const old = oldRects.get(cell.visualId), rect = el.getBoundingClientRect();
        const dy = old ? old.top - rect.top : -(r + 1) * rect.height;
        if (dy) el.animate([
          { transform: `translateY(${dy}px)` },
          { transform: 'translateY(0) scale(1.08,.92)', offset: .82 },
          { transform: 'translateY(0) scale(1)' }
        ], { duration: Math.min(420, 220 + Math.abs(dy) * .4), easing: 'cubic-bezier(.4,0,.8,1)' });
      }));
      await pause(430);
    }
    previous = frame.grid;
  }
}
