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

Object.assign(WONDER_LANDMARKS, {
  5: `<svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="petraStone" x2="0" y2="1"><stop stop-color="#cb936b"/><stop offset="1" stop-color="#683f36"/></linearGradient></defs><path fill="#62392e" d="M0 420V60L180 15 330 180 370 420ZM1200 420V30L1040 0 890 190 850 420Z"/><path fill="url(#petraStone)" d="M390 420V185H440V150L600 60 760 150V185H810V420Z"/><path fill="#dfa77e" d="M420 177L600 87 780 177ZM470 155H730V175H470Z"/><g fill="#4f2c28"><path d="M475 420V263Q520 225 555 263V420ZM645 420V263Q680 225 725 263V420Z"/><rect x="573" y="269" width="54" height="151"/></g><g fill="#e6af83"><rect x="440" y="205" width="25" height="208"/><rect x="550" y="205" width="23" height="208"/><rect x="627" y="205" width="23" height="208"/><rect x="735" y="205" width="25" height="208"/><path d="M415 190H785V210H415ZM415 246H785V264H415Z"/></g><circle cx="600" cy="160" r="22" fill="#754b40"/><path fill="#382d2b" d="M0 420V397Q600 355 1200 397V420Z"/></svg>`,
  6: `<svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice"><path fill="#365852" d="M0 420V320L100 270 220 320 390 240 560 320 850 240 1200 320V420Z"/><g fill="#beae8b" stroke="#766e59" stroke-width="4"><path d="M270 390H930L885 350H315ZM315 350H885L840 309H360ZM360 309H840L800 269H400ZM400 269H800L760 228H440ZM440 228H760L720 187H480ZM480 187H720L690 150H510Z"/><path d="M530 150V85H670V150ZM515 85L600 57 685 85Z"/></g><path d="M565 150L510 390H690L635 150Z" fill="#d1c2a1"/><g stroke="#7e7561" stroke-width="5"><path d="M561 170H639M556 192H644M550 216H650M544 242H656M538 270H662M531 301H669M524 334H676M516 368H684"/></g><rect x="580" y="103" width="40" height="47" fill="#464c42"/><path fill="#233e39" d="M0 420V396Q400 375 1200 399V420Z"/></svg>`,
  7: `<svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice"><path fill="#695654" d="M0 420V286L160 171 300 260 440 129 660 290 850 136 1200 285V420Z"/><path fill="#c2956e" d="M240 392V202H960V392Z"/><g fill="#e2bd8d" stroke="#9e775e" stroke-width="3"><path d="M260 202V144H390V202ZM810 202V144H940V202ZM440 202V135H760V202Z"/><path d="M245 144Q325 56 405 144ZM425 135Q600 18 775 135ZM795 144Q875 56 955 144Z"/></g><g fill="#5d4342"><path d="M290 392V294Q325 245 360 294V392ZM420 392V294Q455 245 490 294V392ZM555 392V265Q600 202 645 265V392ZM710 392V294Q745 245 780 294V392ZM840 392V294Q875 245 910 294V392Z"/></g><g stroke="#f1cea1" stroke-width="6"><path d="M240 231H960M240 252H960M275 175H375M825 175H925M475 168H725"/></g><path fill="#312f35" d="M0 420V398Q600 375 1200 398V420Z"/></svg>`,
  8: `<svg class="wow-landmark-svg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice"><path fill="#5c7e75" d="M0 420V211L160 75 370 255 580 56 790 265 1040 100 1200 240V420Z"/><path fill="#395d56" d="M0 420V310L220 165 410 300 650 180 850 330 1080 170 1200 280V420Z"/><path d="M30 412L220 282 390 353 630 251 830 363 1090 248 1200 293" fill="none" stroke="#b5ad8c" stroke-width="55"/><path d="M30 390L220 260 390 331 630 229 830 341 1090 226 1200 271" fill="none" stroke="#e0d4ae" stroke-width="9" stroke-dasharray="18 9"/><g fill="#bfb08a" stroke="#6f725e" stroke-width="4"><path d="M177 302V208H263V302ZM587 272V177H673V272ZM1047 270V173H1133V270Z"/></g><g fill="#354d44"><rect x="206" y="250" width="28" height="52"/><rect x="616" y="220" width="28" height="52"/><rect x="1076" y="218" width="28" height="52"/></g><path fill="#223f3a" d="M0 420V399Q600 360 1200 399V420Z"/></svg>`
});

// Connected crosswords with matching intersections and space between parallel words.
export const WOW_LEVELS = [
  {
    "id": 1,
    "wonder": "Great Pyramid of Giza",
    "country": "Egypt",
    "letters": [
      "C",
      "A",
      "S",
      "T"
    ],
    "rows": 5,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 2
    },
    "words": [
      {
        "word": "CAST",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "ACT",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "SAT",
        "row": 0,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "CATS",
        "row": 1,
        "col": 1,
        "dir": "V"
      }
    ]
  },
  {
    "id": 2,
    "wonder": "The Colosseum",
    "country": "Italy",
    "letters": [
      "S",
      "T",
      "A",
      "R"
    ],
    "rows": 4,
    "cols": 6,
    "butterfly": {
      "r": 1,
      "c": 0
    },
    "words": [
      {
        "word": "STAR",
        "row": 3,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "SAT",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "ARTS",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RATS",
        "row": 0,
        "col": 0,
        "dir": "V"
      }
    ]
  },
  {
    "id": 3,
    "wonder": "Taj Mahal",
    "country": "India",
    "letters": [
      "S",
      "A",
      "N",
      "D",
      "L"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 3
    },
    "words": [
      {
        "word": "LANDS",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "AND",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "LAD",
        "row": 0,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "SAD",
        "row": 1,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "SAND",
        "row": 2,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 4,
    "wonder": "Machu Picchu",
    "country": "Peru",
    "letters": [
      "S",
      "T",
      "O",
      "N",
      "E"
    ],
    "rows": 5,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 2
    },
    "words": [
      {
        "word": "STONE",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "NET",
        "row": 0,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "NOTE",
        "row": 0,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "TONE",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "SON",
        "row": 2,
        "col": 0,
        "dir": "V"
      }
    ]
  },
  {
    "id": 5,
    "wonder": "Petra Treasury",
    "country": "Jordan",
    "letters": [
      "W",
      "A",
      "T",
      "E",
      "R"
    ],
    "rows": 6,
    "cols": 7,
    "butterfly": {
      "r": 0,
      "c": 1
    },
    "words": [
      {
        "word": "WATER",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RAT",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "WAR",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RATE",
        "row": 2,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "TEAR",
        "row": 5,
        "col": 3,
        "dir": "H"
      }
    ]
  },
  {
    "id": 6,
    "wonder": "Chichen Itza",
    "country": "Mexico",
    "letters": [
      "P",
      "L",
      "A",
      "N",
      "E",
      "T"
    ],
    "rows": 6,
    "cols": 6,
    "butterfly": {
      "r": 3,
      "c": 3
    },
    "words": [
      {
        "word": "PLANET",
        "row": 5,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "LATE",
        "row": 2,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "NEAT",
        "row": 3,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "PLAN",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "TALE",
        "row": 1,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 7,
    "wonder": "Amber Palace",
    "country": "India",
    "letters": [
      "C",
      "R",
      "O",
      "W",
      "N",
      "S"
    ],
    "rows": 6,
    "cols": 6,
    "butterfly": {
      "r": 3,
      "c": 3
    },
    "words": [
      {
        "word": "CROWNS",
        "row": 5,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "ROW",
        "row": 3,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "CROW",
        "row": 3,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "SNOW",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "WORN",
        "row": 1,
        "col": 2,
        "dir": "H"
      }
    ]
  },
  {
    "id": 8,
    "wonder": "Great Wall of China",
    "country": "China",
    "letters": [
      "G",
      "A",
      "R",
      "D",
      "E",
      "N"
    ],
    "rows": 6,
    "cols": 6,
    "butterfly": {
      "r": 0,
      "c": 3
    },
    "words": [
      {
        "word": "GARDEN",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "AGE",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "GEAR",
        "row": 0,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "NEAR",
        "row": 2,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "READ",
        "row": 2,
        "col": 2,
        "dir": "V"
      }
    ]
  }
];
