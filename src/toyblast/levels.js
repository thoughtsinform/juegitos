/**
 * Curated Levels for Toy Blast
 * Pure non-rigged, fair, satisfying puzzle levels.
 */

export const TOY_BLAST_LEVELS = [
  {
    id: 1,
    name: "Morning Playroom",
    description: "Match color cubes to collect toy blocks!",
    rows: 8,
    cols: 8,
    colors: ['red', 'blue', 'green', 'yellow'],
    moves: 20,
    goals: {
      cubes: { red: 12, blue: 12 }
    },
    obstacles: [], // none
    starThresholds: [1200, 2400, 3800]
  },
  {
    id: 2,
    name: "Crate Breakers",
    description: "Blast cubes adjacent to wooden crates to smash them open!",
    rows: 8,
    cols: 8,
    colors: ['red', 'blue', 'green', 'yellow'],
    moves: 22,
    goals: {
      cubes: { green: 15 },
      crates: 8
    },
    // Coordinates [r, c] with crates
    obstacles: [
      { type: 'crate', r: 3, c: 2 },
      { type: 'crate', r: 3, c: 3 },
      { type: 'crate', r: 3, c: 4 },
      { type: 'crate', r: 3, c: 5 },
      { type: 'crate', r: 4, c: 2 },
      { type: 'crate', r: 4, c: 3 },
      { type: 'crate', r: 4, c: 4 },
      { type: 'crate', r: 4, c: 5 }
    ],
    starThresholds: [1500, 3000, 4800]
  },
  {
    id: 3,
    name: "Duck Rescue Mission",
    description: "Blast cubes underneath the rubber ducks so they slide down to the bottom!",
    rows: 8,
    cols: 8,
    colors: ['red', 'blue', 'yellow', 'purple'],
    moves: 24,
    goals: {
      ducks: 3,
      cubes: { yellow: 18 }
    },
    obstacles: [
      { type: 'duck', r: 0, c: 1 },
      { type: 'duck', r: 0, c: 4 },
      { type: 'duck', r: 0, c: 6 }
    ],
    starThresholds: [1800, 3500, 5200]
  },
  {
    id: 4,
    name: "Bubble Jamboree",
    description: "Pop the floating bubbles by blasting the cubes enclosed inside them!",
    rows: 9,
    cols: 8,
    colors: ['red', 'blue', 'green', 'purple'],
    moves: 24,
    goals: {
      bubbles: 10,
      cubes: { purple: 15, red: 15 }
    },
    obstacles: [
      { type: 'bubble', r: 2, c: 2 },
      { type: 'bubble', r: 2, c: 5 },
      { type: 'bubble', r: 3, c: 3 },
      { type: 'bubble', r: 3, c: 4 },
      { type: 'bubble', r: 4, c: 1 },
      { type: 'bubble', r: 4, c: 6 },
      { type: 'bubble', r: 5, c: 3 },
      { type: 'bubble', r: 5, c: 4 },
      { type: 'bubble', r: 6, c: 2 },
      { type: 'bubble', r: 6, c: 5 }
    ],
    starThresholds: [2000, 4000, 6000]
  },
  {
    id: 5,
    name: "Toy Factory Rush",
    description: "Smash crates, pop bubbles, and rescue ducks using high-yield booster combos!",
    rows: 9,
    cols: 8,
    colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    moves: 26,
    goals: {
      ducks: 2,
      crates: 6,
      bubbles: 6
    },
    obstacles: [
      { type: 'duck', r: 0, c: 2 },
      { type: 'duck', r: 0, c: 5 },
      { type: 'crate', r: 4, c: 2 },
      { type: 'crate', r: 4, c: 3 },
      { type: 'crate', r: 4, c: 4 },
      { type: 'crate', r: 4, c: 5 },
      { type: 'crate', r: 5, c: 3 },
      { type: 'crate', r: 5, c: 4 },
      { type: 'bubble', r: 2, c: 1 },
      { type: 'bubble', r: 2, c: 6 },
      { type: 'bubble', r: 3, c: 2 },
      { type: 'bubble', r: 3, c: 5 },
      { type: 'bubble', r: 6, c: 1 },
      { type: 'bubble', r: 6, c: 6 }
    ],
    starThresholds: [2500, 5000, 7500]
  },
  {
    id: 6,
    name: "Grand Carnival Finale",
    description: "The ultimate toy test! Combine Disco Balls with Rockets and Bombs for massive cascades!",
    rows: 9,
    cols: 9,
    colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    moves: 30,
    goals: {
      ducks: 3,
      crates: 8,
      bubbles: 8
    },
    obstacles: [
      { type: 'duck', r: 0, c: 1 },
      { type: 'duck', r: 0, c: 4 },
      { type: 'duck', r: 0, c: 7 },
      { type: 'crate', r: 3, c: 1 },
      { type: 'crate', r: 3, c: 4 },
      { type: 'crate', r: 3, c: 7 },
      { type: 'crate', r: 5, c: 1 },
      { type: 'crate', r: 5, c: 4 },
      { type: 'crate', r: 5, c: 7 },
      { type: 'crate', r: 7, c: 3 },
      { type: 'crate', r: 7, c: 5 },
      { type: 'bubble', r: 2, c: 2 },
      { type: 'bubble', r: 2, c: 6 },
      { type: 'bubble', r: 4, c: 2 },
      { type: 'bubble', r: 4, c: 6 },
      { type: 'bubble', r: 6, c: 2 },
      { type: 'bubble', r: 6, c: 6 },
      { type: 'bubble', r: 1, c: 4 },
      { type: 'bubble', r: 6, c: 4 }
    ],
    starThresholds: [3500, 7000, 10500]
  }
];
