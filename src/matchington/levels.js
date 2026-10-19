/**
 * Curated Match-3 Levels for Matchington Mansion
 * Objectives: Items, Ice Floor Tiles, and Parquet Wood Boards.
 */

export const MATCHINGTON_LEVELS = [
  {
    id: 1,
    name: "Mansion Welcome",
    description: "Match 3 or more home decor items to gather restoration supplies!",
    rows: 8,
    cols: 8,
    items: ['pillow', 'teacup', 'lamp', 'book'],
    moves: 22,
    goals: {
      items: { pillow: 15, teacup: 15 }
    },
    tiles: [], // no ice or parquet
    starThresholds: [1500, 3000, 4500]
  },
  {
    id: 2,
    name: "Frosty Foyer Tiles",
    description: "Make matches over the frozen floorboards to melt the ice!",
    rows: 8,
    cols: 8,
    items: ['pillow', 'teacup', 'lamp', 'book', 'gem'],
    moves: 24,
    goals: {
      ice: 10,
      items: { lamp: 16 }
    },
    // Coordinates [r, c] with ice
    tiles: [
      { type: 'ice', r: 2, c: 2 },
      { type: 'ice', r: 2, c: 3 },
      { type: 'ice', r: 2, c: 4 },
      { type: 'ice', r: 2, c: 5 },
      { type: 'ice', r: 3, c: 3 },
      { type: 'ice', r: 3, c: 4 },
      { type: 'ice', r: 4, c: 3 },
      { type: 'ice', r: 4, c: 4 },
      { type: 'ice', r: 5, c: 2 },
      { type: 'ice', r: 5, c: 5 }
    ],
    starThresholds: [2000, 4000, 6000]
  },
  {
    id: 3,
    name: "Parquet Floor Repairs",
    description: "Break the vintage wooden floorboards by matching items right next to them!",
    rows: 8,
    cols: 8,
    items: ['pillow', 'teacup', 'lamp', 'book', 'plant'],
    moves: 25,
    goals: {
      wood: 8,
      items: { book: 18 }
    },
    tiles: [
      { type: 'wood', r: 3, c: 1 },
      { type: 'wood', r: 3, c: 2 },
      { type: 'wood', r: 3, c: 5 },
      { type: 'wood', r: 3, c: 6 },
      { type: 'wood', r: 4, c: 1 },
      { type: 'wood', r: 4, c: 2 },
      { type: 'wood', r: 4, c: 5 },
      { type: 'wood', r: 4, c: 6 }
    ],
    starThresholds: [2500, 5000, 7500]
  },
  {
    id: 4,
    name: "Paper Planes & Chandeliers",
    description: "Form 2x2 squares to build Paper Planes that fly directly to targets!",
    rows: 8,
    cols: 8,
    items: ['pillow', 'teacup', 'lamp', 'book', 'gem', 'plant'],
    moves: 26,
    goals: {
      ice: 12,
      wood: 6,
      items: { gem: 15 }
    },
    tiles: [
      { type: 'ice', r: 1, c: 1 },
      { type: 'ice', r: 1, c: 6 },
      { type: 'ice', r: 2, c: 2 },
      { type: 'ice', r: 2, c: 5 },
      { type: 'ice', r: 3, c: 3 },
      { type: 'ice', r: 3, c: 4 },
      { type: 'ice', r: 4, c: 3 },
      { type: 'ice', r: 4, c: 4 },
      { type: 'ice', r: 5, c: 2 },
      { type: 'ice', r: 5, c: 5 },
      { type: 'ice', r: 6, c: 1 },
      { type: 'ice', r: 6, c: 6 },
      { type: 'wood', r: 3, c: 0 },
      { type: 'wood', r: 4, c: 0 },
      { type: 'wood', r: 3, c: 7 },
      { type: 'wood', r: 4, c: 7 },
      { type: 'wood', r: 0, c: 3 },
      { type: 'wood', r: 0, c: 4 }
    ],
    starThresholds: [3000, 6000, 9000]
  },
  {
    id: 5,
    name: "The Conservatory Gala",
    description: "Combine Rainbow Balls with Paper Planes and Rockets for spectacular room clearances!",
    rows: 8,
    cols: 8,
    items: ['pillow', 'teacup', 'lamp', 'book', 'gem', 'plant'],
    moves: 28,
    goals: {
      ice: 14,
      wood: 8,
      items: { plant: 20 }
    },
    tiles: [
      { type: 'ice', r: 0, c: 0 },
      { type: 'ice', r: 0, c: 7 },
      { type: 'ice', r: 7, c: 0 },
      { type: 'ice', r: 7, c: 7 },
      { type: 'ice', r: 2, c: 3 },
      { type: 'ice', r: 2, c: 4 },
      { type: 'ice', r: 3, c: 2 },
      { type: 'ice', r: 3, c: 5 },
      { type: 'ice', r: 4, c: 2 },
      { type: 'ice', r: 4, c: 5 },
      { type: 'ice', r: 5, c: 3 },
      { type: 'ice', r: 5, c: 4 },
      { type: 'ice', r: 1, c: 1 },
      { type: 'ice', r: 6, c: 6 },
      { type: 'wood', r: 1, c: 3 },
      { type: 'wood', r: 1, c: 4 },
      { type: 'wood', r: 6, c: 3 },
      { type: 'wood', r: 6, c: 4 },
      { type: 'wood', r: 3, c: 1 },
      { type: 'wood', r: 4, c: 1 },
      { type: 'wood', r: 3, c: 6 },
      { type: 'wood', r: 4, c: 6 }
    ],
    starThresholds: [4000, 8000, 12000]
  }
];
