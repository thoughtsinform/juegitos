/**
 * Words of Wonders (WoW) - Verified Level Packs
 * Every level is mathematically verified for:
 * 1. 100% exact character intersection alignment with ZERO collisions.
 * 2. Every crossword word and bonus word is formable from the letter wheel.
 * 3. All words are legitimate English dictionary words.
 */

export const WOW_LEVELS = [
  {
    id: 1,
    wonder: "Great Pyramid of Giza",
    country: "Egypt",
    description: "Built over 4,500 years ago, the Great Pyramid is the oldest of the Seven Wonders of the Ancient World.",
    letters: ["A", "C", "T"],
    gridRows: 3,
    gridCols: 3,
    // CAT (H at row 0, col 0)
    // ACT (V at row 0, col 1: intersects CAT at 'A')
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
    description: "The largest ancient amphitheatre ever built, capable of holding 50,000 spectators for gladiatorial games.",
    letters: ["S", "T", "A", "R"],
    gridRows: 3,
    gridCols: 4,
    // S T A R (H, row 0, col 0)
    //     A R T (V, row 0, col 2 -> intersects STAR at 'A')
    // R A T S   (H, row 2, col 0 -> intersects ART at 'T')
    words: [
      { id: "w1", word: "STAR", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "ART",  row: 0, col: 2, direction: "V" },
      { id: "w3", word: "RATS", row: 2, col: 0, direction: "H" }
    ],
    bonusWords: ["RAT", "TAR", "TARS", "SAT", "AS", "AT"]
  },
  {
    id: 3,
    wonder: "Taj Mahal",
    country: "India",
    description: "An ivory-white marble mausoleum on the Yamuna river, commissioned in 1631 by Mughal emperor Shah Jahan.",
    letters: ["P", "L", "A", "Y"],
    gridRows: 3,
    gridCols: 4,
    // P L A Y (H, row 0, col 0)
    //   L A P (V, row 0, col 1 -> intersects PLAY at 'L')
    //   P A Y (H, row 2, col 1 -> intersects LAP at 'P')
    words: [
      { id: "w1", word: "PLAY", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "LAP",  row: 0, col: 1, direction: "V" },
      { id: "w3", word: "PAY",  row: 2, col: 1, direction: "H" }
    ],
    bonusWords: ["LAY", "PAL", "PLY"]
  },
  {
    id: 4,
    wonder: "Machu Picchu",
    country: "Peru",
    description: "A 15th-century Inca citadel situated on a mountain ridge 2,430 metres above sea level in the Andes.",
    letters: ["S", "O", "L", "E"],
    gridRows: 4,
    gridCols: 4,
    // L O S E (H, row 0, col 0)
    //     S O L E (V, row 0, col 2 -> intersects LOSE at 'S')
    words: [
      { id: "w1", word: "LOSE", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "SOLE", row: 0, col: 2, direction: "V" }
    ],
    bonusWords: ["SO", "ELS"]
  },
  {
    id: 5,
    wonder: "Petra",
    country: "Jordan",
    description: "Famous for its rock-cut architecture and water conduit system, established possibly as early as 312 BC.",
    letters: ["S", "M", "I", "L", "E"],
    gridRows: 4,
    gridCols: 5,
    // S M I L E (H, row 0, col 0)
    //   M I L E (V, row 0, col 1 -> intersects SMILE at 'M')
    //   L I M E (H, row 2, col 1 -> intersects MILE at 'L')
    // S L I M   (V, row 0, col 0 -> intersects SMILE at 'S')
    words: [
      { id: "w1", word: "SMILE", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "MILE",  row: 0, col: 1, direction: "V" },
      { id: "w3", word: "LIME",  row: 2, col: 1, direction: "H" },
      { id: "w4", word: "SLIM",  row: 0, col: 0, direction: "V" }
    ],
    bonusWords: ["LIES", "LIE", "ELMS", "MIL"]
  },
  {
    id: 6,
    wonder: "Chichen Itza",
    country: "Mexico",
    description: "A large pre-Columbian city built by the Maya people, featuring the iconic step-pyramid El Castillo.",
    letters: ["H", "E", "A", "R", "T"],
    gridRows: 5,
    gridCols: 5,
    // H E A R T (H, row 0, col 0)
    //   E A R T H (V, row 0, col 1 -> intersects HEART at 'E')
    // H E A T     (V, row 0, col 0 -> intersects HEART at 'H')
    //   R A T E   (H, row 2, col 1 -> intersects EARTH at 'R')
    //   H A T     (H, row 4, col 1 -> intersects EARTH at 'H')
    words: [
      { id: "w1", word: "HEART", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "EARTH", row: 0, col: 1, direction: "V" },
      { id: "w3", word: "HEAT",  row: 0, col: 0, direction: "V" },
      { id: "w4", word: "RATE",  row: 2, col: 1, direction: "H" },
      { id: "w5", word: "HAT",   row: 4, col: 1, direction: "H" }
    ],
    bonusWords: ["TEAR", "HATE", "HEAR", "ART", "EAR", "TEA", "RAT", "EAT", "TAR", "ARE"]
  },
  {
    id: 7,
    wonder: "Amber Palace",
    country: "India",
    description: "Located high on a hill in Rajasthan, known for its artistic Hindu style elements and marble courtyards.",
    letters: ["S", "P", "A", "R", "K"],
    gridRows: 4,
    gridCols: 5,
    // S P A R K (H, row 0, col 0)
    //   P A R K (V, row 0, col 1 -> intersects SPARK at 'P')
    // S P A R   (V, row 0, col 0 -> intersects SPARK at 'S')
    //   R A P S (H, row 2, col 1 -> intersects PARK at 'R')
    words: [
      { id: "w1", word: "SPARK", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "PARK",  row: 0, col: 1, direction: "V" },
      { id: "w3", word: "SPAR",  row: 0, col: 0, direction: "V" },
      { id: "w4", word: "RAPS",  row: 2, col: 1, direction: "H" }
    ],
    bonusWords: ["ASK", "PARKS", "RAP", "SAP", "SPA", "ARK"]
  },
  {
    id: 8,
    wonder: "Great Wall of China",
    country: "China",
    description: "An ancient series of defensive fortifications stretching over 13,000 miles across northern China.",
    letters: ["F", "L", "O", "W", "E", "R"],
    gridRows: 5,
    gridCols: 6,
    // F L O W E R (H, row 0, col 0)
    //   L O W     (V, row 0, col 1 -> intersects FLOWER at 'L')
    // F L O W     (V, row 0, col 0 -> intersects FLOWER at 'F')
    //   W O L F   (H, row 2, col 1 -> intersects LOW at 'W')
    //           R O L E (V, row 0, col 5 -> intersects FLOWER at 'R')
    words: [
      { id: "w1", word: "FLOWER", row: 0, col: 0, direction: "H" },
      { id: "w2", word: "LOW",    row: 0, col: 1, direction: "V" },
      { id: "w3", word: "FLOW",   row: 0, col: 0, direction: "V" },
      { id: "w4", word: "WOLF",   row: 2, col: 1, direction: "H" },
      { id: "w5", word: "ROLE",   row: 0, col: 5, direction: "V" }
    ],
    bonusWords: ["FORE", "LORE", "ROW", "FEW", "OWL", "ORE", "FOR", "FOE"]
  }
];
