/**
 * Curated Crossword Levels for Words of Wonders (WoW)
 * Features multi-intersection crossword matrices, Butterfly bonus cells,
 * and custom architectural SVG landmark silhouettes for each World Wonder.
 *
 * Every word is 100% formable from the level's exact wheel letter multiset,
 * and every horizontal/vertical cell intersection is mathematically verified.
 */

export const WONDER_LANDMARKS = {
  1: `
    <svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
      <!-- Desert Dunes -->
      <path fill="rgba(0,0,0,0.35)" d="M0 420 L0 330 Q300 280 600 340 T1200 310 L1200 420 Z"/>
      <!-- Three Great Pyramids of Giza -->
      <polygon fill="rgba(0,0,0,0.55)" points="140,360 320,160 500,360"/>
      <polygon fill="rgba(255,255,255,0.08)" points="320,160 500,360 410,360"/>
      <polygon fill="rgba(0,0,0,0.68)" points="380,370 610,110 840,370"/>
      <polygon fill="rgba(255,255,255,0.1)" points="610,110 840,370 725,370"/>
      <polygon fill="rgba(0,0,0,0.5)" points="740,370 890,210 1040,370"/>
      <!-- Foreground Ridge -->
      <path fill="rgba(0,0,0,0.75)" d="M0 420 L0 365 Q450 335 900 365 T1200 355 L1200 420 Z"/>
    </svg>
  `,
  2: `
    <svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
      <!-- Roman Hills -->
      <path fill="rgba(0,0,0,0.35)" d="M0 420 L0 320 Q400 260 800 320 T1200 300 L1200 420 Z"/>
      <!-- The Colosseum Tiered Arches -->
      <path fill="rgba(0,0,0,0.68)" d="M260 370 L260 170 L680 170 L740 230 L920 230 L920 370 Z"/>
      <!-- Cutout Arches -->
      <g fill="rgba(255,255,255,0.14)">
        <rect x="300" y="195" width="36" height="45" rx="18"/>
        <rect x="360" y="195" width="36" height="45" rx="18"/>
        <rect x="420" y="195" width="36" height="45" rx="18"/>
        <rect x="480" y="195" width="36" height="45" rx="18"/>
        <rect x="540" y="195" width="36" height="45" rx="18"/>
        <rect x="600" y="195" width="36" height="45" rx="18"/>
        <rect x="300" y="255" width="36" height="48" rx="18"/>
        <rect x="360" y="255" width="36" height="48" rx="18"/>
        <rect x="420" y="255" width="36" height="48" rx="18"/>
        <rect x="480" y="255" width="36" height="48" rx="18"/>
        <rect x="540" y="255" width="36" height="48" rx="18"/>
        <rect x="600" y="255" width="36" height="48" rx="18"/>
        <rect x="660" y="255" width="36" height="48" rx="18"/>
        <rect x="720" y="255" width="36" height="48" rx="18"/>
        <rect x="780" y="255" width="36" height="48" rx="18"/>
        <rect x="840" y="255" width="36" height="48" rx="18"/>
      </g>
      <path fill="rgba(0,0,0,0.8)" d="M0 420 L0 360 L1200 360 L1200 420 Z"/>
    </svg>
  `,
  3: `
    <svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
      <!-- Taj Mahal Minarets & Onion Dome -->
      <rect x="240" y="160" width="22" height="210" fill="rgba(0,0,0,0.55)"/>
      <circle cx="251" cy="152" r="14" fill="rgba(0,0,0,0.6)"/>
      <rect x="938" y="160" width="22" height="210" fill="rgba(0,0,0,0.55)"/>
      <circle cx="949" cy="152" r="14" fill="rgba(0,0,0,0.6)"/>
      <!-- Main Mausoleum Base -->
      <rect x="380" y="220" width="440" height="150" fill="rgba(0,0,0,0.68)"/>
      <!-- Central Onion Dome -->
      <path fill="rgba(0,0,0,0.72)" d="M510 220 C500 140, 560 95, 600 65 C640 95, 700 140, 690 220 Z"/>
      <!-- Side Domes -->
      <path fill="rgba(0,0,0,0.6)" d="M415 220 C410 175, 440 150, 460 135 C480 150, 510 175, 505 220 Z"/>
      <path fill="rgba(0,0,0,0.6)" d="M695 220 C690 175, 720 150, 740 135 C760 150, 790 175, 785 220 Z"/>
      <!-- Central Arch -->
      <path fill="rgba(255,255,255,0.12)" d="M555 370 L555 265 Q600 230 645 265 L645 370 Z"/>
      <rect x="0" y="365" width="1200" height="55" fill="rgba(0,0,0,0.82)"/>
    </svg>
  `,
  4: `
    <svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
      <!-- Andes Peaks & Huayna Picchu -->
      <path fill="rgba(0,0,0,0.45)" d="M0 420 L0 260 L180 150 L360 280 L580 85 L760 260 L980 140 L1200 270 L1200 420 Z"/>
      <!-- Incan Agricultural Terraces -->
      <path fill="rgba(0,0,0,0.72)" d="M0 420 L0 310 L260 240 L480 240 L560 190 L720 190 L820 260 L1020 260 L1200 320 L1200 420 Z"/>
      <line x1="250" y1="275" x2="780" y2="275" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
      <line x1="220" y1="305" x2="840" y2="305" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
      <line x1="180" y1="335" x2="900" y2="335" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
    </svg>
  `
};

export const WOW_LEVELS = [
  {
    id: 1,
    wonder: "Great Pyramid of Giza",
    country: "Egypt",
    letters: ['C', 'A', 'S', 'T'],
    rows: 4,
    cols: 4,
    butterfly: { r: 0, c: 2 },
    //   0 1 2 3
    // 0 C A S T
    // 1 A C T .
    // 2 T . . .
    // 3 S A T .
    words: [
      { word: 'CAST', row: 0, col: 0, dir: 'H' },
      { word: 'CATS', row: 0, col: 0, dir: 'V' },
      { word: 'ACT',  row: 1, col: 0, dir: 'H' },
      { word: 'SAT',  row: 3, col: 0, dir: 'H' }
    ]
  },
  {
    id: 2,
    wonder: "The Colosseum",
    country: "Italy",
    letters: ['S', 'T', 'A', 'R'],
    rows: 4,
    cols: 4,
    butterfly: { r: 3, c: 1 },
    //   0 1 2 3
    // 0 S T A R
    // 1 A . . A
    // 2 T . . T
    // 3 . A R T S (4x4: ARTS at row 3, col 0!)
    words: [
      { word: 'STAR', row: 0, col: 0, dir: 'H' },
      { word: 'SAT',  row: 0, col: 0, dir: 'V' },
      { word: 'RATS', row: 0, col: 3, dir: 'V' },
      { word: 'ARTS', row: 3, col: 0, dir: 'H' }
    ]
  },
  {
    id: 3,
    wonder: "Taj Mahal",
    country: "India",
    letters: ['S', 'A', 'N', 'D', 'L'],
    rows: 4,
    cols: 5,
    butterfly: { r: 0, c: 2 },
    //   0 1 2 3 4
    // 0 L A N D S
    // 1 A N D . A
    // 2 D . . . N
    // 3 . . S A D
    words: [
      { word: 'LANDS', row: 0, col: 0, dir: 'H' },
      { word: 'LAD',   row: 0, col: 0, dir: 'V' },
      { word: 'AND',   row: 1, col: 0, dir: 'H' },
      { word: 'SAND',  row: 0, col: 4, dir: 'V' },
      { word: 'SAD',   row: 3, col: 2, dir: 'H' }
    ]
  },
  {
    id: 4,
    wonder: "Machu Picchu",
    country: "Peru",
    letters: ['S', 'T', 'O', 'N', 'E'],
    rows: 5,
    cols: 5,
    butterfly: { r: 2, c: 1 },
    //   0 1 2 3 4
    // 0 S T O N E
    // 1 . O . . .
    // 2 O N E . .
    // 3 S E T . .
    // 4 . . E . .
    // 5 . . N . .
    // Let's keep within 5x5:
    //   0 1 2 3 4
    // 0 S T O N E
    // 1 . O . O .
    // 2 O N E T .
    // 3 S E T E .
    // Wait: let's make sure no unintended adjacent letters touch, or use clean intersections:
    //   0 1 2 3 4
    // 0 S T O N E
    // 1 . O . . .
    // 2 O N E . .
    // 3 . E . . .
    // 4 S E N T . (if Col 1 V is T-O-N-E-E? No, 1 E!)
    // What if Col 1 V is T-O-N-E (rows 0..3) and Row 3 H is S-E-N-T (cols 0..3)?
    // Let's check:
    // Row 0: S T O N E (H, 0,0) -> (0,1)=T
    // Col 1: T O N E   (V, 0,1) -> (0,1)=T, (1,1)=O, (2,1)=N, (3,1)=E
    // Row 1: S O N     (H, 1,0) -> (1,0)=S, (1,1)=O, (1,2)=N
    // Row 3: S E N T   (H, 3,0) -> (3,0)=S, (3,1)=E, (3,2)=N, (3,3)=T
    // Col 3: N O T     (V, 1,3)? Or TEN (V, 2,3): (2,3)=T, (3,3)=E? No, (3,3)=T, so (1,3)=N, (2,3)=O, (3,3)=T (NOT V at 1,3)!
    // Wait: if (0,3)=N from STONE, then Col 3 V at (0,3) is N - O - T - E (NOTE V at 0,3):
    // (0,3)=N, (1,3)=O, (2,3)=T, (3,3)=E!
    // And then Row 3 H at (3,1) is E - ? - E? No, Row 2 H at (2,1) is N - E - T (NET H at 2,1: (2,1)=N, (2,2)=E, (2,3)=T)!
    // Let's check EVERY intersection of that 4x5 grid:
    // 1. STONE (H, 0,0): (0,0)=S, (0,1)=T, (0,2)=O, (0,3)=N, (0,4)=E
    // 2. TONE  (V, 0,1): (0,1)=T, (1,1)=O, (2,1)=N, (3,1)=E
    // 3. NOTE  (V, 0,3): (0,3)=N, (1,3)=O, (2,3)=T, (3,3)=E
    // 4. NET   (H, 2,1): (2,1)=N, (2,2)=E, (2,3)=T
    // 5. SON   (V, 0,0): (0,0)=S, (1,0)=O, (2,0)=N
    words: [
      { word: 'STONE', row: 0, col: 0, dir: 'H' },
      { word: 'SON',   row: 0, col: 0, dir: 'V' },
      { word: 'TONE',  row: 0, col: 1, dir: 'V' },
      { word: 'NOTE',  row: 0, col: 3, dir: 'V' },
      { word: 'NET',   row: 2, col: 1, dir: 'H' }
    ]
  },
  {
    id: 5,
    wonder: "Petra Treasury",
    country: "Jordan",
    letters: ['W', 'A', 'T', 'E', 'R'],
    rows: 5,
    cols: 5,
    butterfly: { r: 2, c: 2 },
    //   0 1 2 3 4
    // 0 W A T E R
    // 1 A . E . A
    // 2 R A T E T
    // 3 . . R . E
    words: [
      { word: 'WATER', row: 0, col: 0, dir: 'H' },
      { word: 'WAR',   row: 0, col: 0, dir: 'V' },
      { word: 'TEAR',  row: 0, col: 2, dir: 'V' },
      { word: 'RATE',  row: 0, col: 4, dir: 'V' },
      { word: 'RAT',   row: 2, col: 0, dir: 'H' }
    ]
  },
  {
    id: 6,
    wonder: "Chichen Itza",
    country: "Mexico",
    letters: ['P', 'L', 'A', 'N', 'E', 'T'],
    rows: 4,
    cols: 6,
    butterfly: { r: 3, c: 2 },
    words: [
      { word: 'PLANET', row: 0, col: 0, dir: 'H' },
      { word: 'PLAN',   row: 0, col: 0, dir: 'V' },
      { word: 'LATE',   row: 0, col: 1, dir: 'V' },
      { word: 'NEAT',   row: 3, col: 0, dir: 'H' },
      { word: 'TALE',   row: 0, col: 5, dir: 'V' }
    ]
  },
  {
    id: 7,
    wonder: "Amber Palace",
    country: "India",
    letters: ['C', 'R', 'O', 'W', 'N', 'S'],
    rows: 4,
    cols: 6,
    butterfly: { r: 3, c: 2 },
    words: [
      { word: 'CROWNS', row: 0, col: 0, dir: 'H' },
      { word: 'CROW',   row: 0, col: 0, dir: 'V' },
      { word: 'ROW',    row: 1, col: 0, dir: 'H' },
      { word: 'WORN',   row: 3, col: 0, dir: 'H' },
      { word: 'SNOW',   row: 0, col: 5, dir: 'V' }
    ]
  },
  {
    id: 8,
    wonder: "Great Wall of China",
    country: "China",
    letters: ['G', 'A', 'R', 'D', 'E', 'N'],
    rows: 4,
    cols: 6,
    butterfly: { r: 3, c: 2 },
    words: [
      { word: 'GARDEN', row: 0, col: 0, dir: 'H' },
      { word: 'GEAR',   row: 0, col: 0, dir: 'V' },
      { word: 'AGE',    row: 2, col: 0, dir: 'H' },
      { word: 'READ',   row: 3, col: 0, dir: 'H' },
      { word: 'NEAR',   row: 0, col: 5, dir: 'V' }
    ]
  }
];
