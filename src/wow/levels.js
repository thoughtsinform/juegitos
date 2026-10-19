/**
 * Words of Wonders (WoW) - Level Packs
 * Each level represents a Wonder of the World with intersecting crossword coordinates.
 */

export const WOW_LEVELS = [
  {
    id: 1,
    wonder: "Great Pyramid of Giza",
    country: "Egypt",
    letters: ["A", "C", "T"],
    gridRows: 3,
    gridCols: 3,
    // Crossword words with start coordinates:
    // C A T (Horizontal at row 0, col 0)
    // A C T (Vertical at row 0, col 1: intersects CAT at 'A'!)
    words: [
      { id: "w1", word: "CAT", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "ACT", row: 0, col: 1, direction: "V" }
    ],
    bonusWords: ["AT"]
  },
  {
    id: 2,
    wonder: "Colosseum of Rome",
    country: "Italy",
    letters: ["S", "T", "A", "R"],
    gridRows: 4,
    gridCols: 4,
    // S T A R (H, row 0, col 0)
    //   A R T (V, row 0, col 2 -> intersects STAR at 'A')
    // R A T S (H, row 2, col 0 -> intersects ART at 'T')
    words: [
      { id: "w1", word: "STAR", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "ART",  row: 0, col: 2, direction: "V" },
      { id: "w3", word: "RATS", row: 2, col: 0, direction: "H" },
      { id: "w4", word: "RAT",  row: 0, col: 3, direction: "V" }
    ],
    bonusWords: ["TAR", "TARS", "SAT", "AS", "AT"]
  },
  {
    id: 3,
    wonder: "Taj Mahal",
    country: "India",
    letters: ["P", "L", "A", "Y"],
    gridRows: 4,
    gridCols: 4,
    // P L A Y (H, row 0, col 0)
    // L A P   (V, row 0, col 1 -> 'L')
    // P A Y   (H, row 2, col 1 -> intersects LAP at 'P')
    // L A Y   (V, row 0, col 3 -> 'Y')
    words: [
      { id: "w1", word: "PLAY", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "LAP",  row: 0, col: 1, direction: "V" },
      { id: "w3", word: "PAY",  row: 2, col: 1, direction: "H" },
      { id: "w4", word: "LAY",  row: 0, col: 3, direction: "V" }
    ],
    bonusWords: ["PAL", "PLY"]
  },
  {
    id: 4,
    wonder: "Machu Picchu",
    country: "Peru",
    letters: ["S", "O", "L", "E"],
    gridRows: 4,
    gridCols: 4,
    // S O L E (H, row 0, col 0)
    // L O S E (V, row 0, col 2 -> 'L')
    // O L E S (H, row 1, col 0 -> 'O')
    words: [
      { id: "w1", word: "SOLE", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "LOSE", row: 0, col: 2, direction: "V" },
      { id: "w3", word: "OLES", row: 1, col: 0, direction: "H" }
    ],
    bonusWords: ["ELS", "SO"]
  },
  {
    id: 5,
    wonder: "Petra",
    country: "Jordan",
    letters: ["S", "M", "I", "L", "E"],
    gridRows: 5,
    gridCols: 5,
    // S M I L E (H, row 0, col 0)
    // M I L E   (V, row 0, col 1 -> 'M')
    // L I M E   (H, row 2, col 1 -> 'L')
    // S L I M   (V, row 0, col 0 -> 'S')
    // L I E S   (H, row 4, col 0)
    words: [
      { id: "w1", word: "SMILE", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "MILE",  row: 0, col: 1, direction: "V" },
      { id: "w3", word: "LIME",  row: 2, col: 1, direction: "H" },
      { id: "w4", word: "SLIM",  row: 0, col: 0, direction: "V" },
      { id: "w5", word: "LIES",  row: 4, col: 0, direction: "H" }
    ],
    bonusWords: ["ELMS", "LIE", "MIL"]
  },
  {
    id: 6,
    wonder: "Chichen Itza",
    country: "Mexico",
    letters: ["H", "E", "A", "R", "T"],
    gridRows: 5,
    gridCols: 5,
    // H E A R T (H, row 0, col 0)
    // E A R T H (V, row 0, col 1 -> 'E')
    // H E A T   (V, row 0, col 0 -> 'H')
    // R A T E   (H, row 2, col 1 -> 'A')
    // T E A R   (H, row 4, col 0)
    words: [
      { id: "w1", word: "HEART", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "EARTH", row: 0, col: 1, direction: "V" },
      { id: "w3", word: "HEAT",  row: 0, col: 0, direction: "V" },
      { id: "w4", word: "RATE",  row: 2, col: 1, direction: "H" },
      { id: "w5", word: "TEAR",  row: 4, col: 0, direction: "H" }
    ],
    bonusWords: ["HATER", "HATE", "HEAR", "ART", "HAT", "EAR", "TEA", "RAT", "EAT", "TAR", "ARE"]
  },
  {
    id: 7,
    wonder: "Taj of Agra & Amber Fort",
    country: "India",
    letters: ["S", "P", "A", "R", "K"],
    gridRows: 5,
    gridCols: 5,
    // S P A R K (H, row 0, col 0)
    // P A R K   (V, row 0, col 1 -> 'P')
    // S P A R   (V, row 0, col 0 -> 'S')
    // R A P S   (H, row 2, col 1 -> 'R')
    // B A R K -> A S K (H, row 4, col 1)
    words: [
      { id: "w1", word: "SPARK", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "PARK",  row: 0, col: 1, direction: "V" },
      { id: "w3", word: "SPAR",  row: 0, col: 0, direction: "V" },
      { id: "w4", word: "RAPS",  row: 2, col: 1, direction: "H" },
      { id: "w5", word: "ASK",   row: 4, col: 1, direction: "H" }
    ],
    bonusWords: ["PARKS", "RAP", "SAP", "SPA", "ARK"]
  },
  {
    id: 8,
    wonder: "Great Wall of China",
    country: "China",
    letters: ["F", "L", "O", "W", "E", "R"],
    gridRows: 6,
    gridCols: 6,
    // F L O W E R (H, row 0, col 0)
    // L O W       (V, row 0, col 1 -> 'L')
    // F L O W     (V, row 0, col 0 -> 'F')
    // W O L F     (H, row 2, col 1 -> 'O')
    // R O L E     (V, row 0, col 5 -> 'R')
    // F O R E     (H, row 4, col 0)
    words: [
      { id: "w1", word: "FLOWER", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "LOW",    row: 0, col: 1, direction: "V" },
      { id: "w3", word: "FLOW",   row: 0, col: 0, direction: "V" },
      { id: "w4", word: "WOLF",   row: 2, col: 1, direction: "H" },
      { id: "w5", word: "ROLE",   row: 0, col: 5, direction: "V" },
      { id: "w6", word: "FORE",   row: 4, col: 0, direction: "H" }
    ],
    bonusWords: ["LORE", "ROW", "FEW", "OWL", "ORE", "FOR", "FOE"]
  }
];
