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
// 3-Tier Difficulty World Wonder Levels (Easy: 4-5 letters, Medium: 6-7 letters, Hard: 7-8 letters)
export const WOW_LEVELS_EASY = [
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
  },
  {
    "id": 9,
    "wonder": "Angkor Wat",
    "country": "Cambodia",
    "letters": [
      "B",
      "R",
      "E",
      "A",
      "D"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 5,
      "c": 1
    },
    "words": [
      {
        "word": "BREAD",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "READ",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "BEAR",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "DEAR",
        "row": 5,
        "col": 1,
        "dir": "H"
      }
    ]
  },
  {
    "id": 10,
    "wonder": "Santorini Caldera",
    "country": "Greece",
    "letters": [
      "L",
      "I",
      "G",
      "H",
      "T"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "LIGHT",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "GILT",
        "row": 2,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "HILT",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LIT",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 11,
    "wonder": "Neuschwanstein Castle",
    "country": "Germany",
    "letters": [
      "T",
      "R",
      "A",
      "I",
      "N"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 0
    },
    "words": [
      {
        "word": "TRAIN",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RAIN",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "RANT",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "ART",
        "row": 0,
        "col": 0,
        "dir": "V"
      }
    ]
  },
  {
    "id": 12,
    "wonder": "Alhambra Palace",
    "country": "Spain",
    "letters": [
      "C",
      "L",
      "O",
      "U",
      "D"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "CLOUD",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "COLD",
        "row": 2,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LOUD",
        "row": 1,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "OLD",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 13,
    "wonder": "Mount Fuji",
    "country": "Japan",
    "letters": [
      "H",
      "E",
      "A",
      "R",
      "T"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "HEART",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "HEAR",
        "row": 2,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "HEAT",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "RATE",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 14,
    "wonder": "Hagia Sophia",
    "country": "Turkey",
    "letters": [
      "S",
      "T",
      "O",
      "N",
      "E"
    ],
    "rows": 7,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "STONE",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "TONE",
        "row": 3,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "NOTE",
        "row": 3,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "NOSE",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 15,
    "wonder": "Mont Saint-Michel",
    "country": "France",
    "letters": [
      "P",
      "L",
      "A",
      "N",
      "T"
    ],
    "rows": 5,
    "cols": 5,
    "butterfly": {
      "r": 1,
      "c": 4
    },
    "words": [
      {
        "word": "PLANT",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "PLAN",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "PANT",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "TAP",
        "row": 1,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 16,
    "wonder": "Acropolis of Athens",
    "country": "Greece",
    "letters": [
      "C",
      "R",
      "O",
      "W",
      "N"
    ],
    "rows": 4,
    "cols": 6,
    "butterfly": {
      "r": 2,
      "c": 2
    },
    "words": [
      {
        "word": "CROWN",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "CORN",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "WORN",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "CROW",
        "row": 2,
        "col": 2,
        "dir": "H"
      }
    ]
  },
  {
    "id": 17,
    "wonder": "Serengeti Plains",
    "country": "Tanzania",
    "letters": [
      "S",
      "H",
      "O",
      "R",
      "E"
    ],
    "rows": 7,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 2
    },
    "words": [
      {
        "word": "SHORE",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "ROSE",
        "row": 3,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "SHOE",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "HERO",
        "row": 0,
        "col": 2,
        "dir": "V"
      }
    ]
  },
  {
    "id": 18,
    "wonder": "Banff Mountain Lakes",
    "country": "Canada",
    "letters": [
      "F",
      "L",
      "A",
      "M",
      "E"
    ],
    "rows": 5,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "FLAME",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "FAME",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LAME",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "MEAL",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 19,
    "wonder": "Golden Pavilion Kyoto",
    "country": "Japan",
    "letters": [
      "B",
      "R",
      "U",
      "S",
      "H"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 0
    },
    "words": [
      {
        "word": "BRUSH",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RUSH",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "BUSH",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "RUB",
        "row": 0,
        "col": 0,
        "dir": "V"
      }
    ]
  },
  {
    "id": 20,
    "wonder": "Grand Canyon Vista",
    "country": "United States",
    "letters": [
      "P",
      "E",
      "A",
      "R",
      "L"
    ],
    "rows": 7,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 1
    },
    "words": [
      {
        "word": "PEARL",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "PEAR",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "REAL",
        "row": 3,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "PALE",
        "row": 0,
        "col": 1,
        "dir": "V"
      }
    ]
  },
  {
    "id": 21,
    "wonder": "Venetian Grand Canal",
    "country": "Italy",
    "letters": [
      "D",
      "R",
      "E",
      "A",
      "M"
    ],
    "rows": 5,
    "cols": 5,
    "butterfly": {
      "r": 1,
      "c": 4
    },
    "words": [
      {
        "word": "DREAM",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "DEAR",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "READ",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "MARE",
        "row": 1,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 22,
    "wonder": "Sultan Ahmed Mosque",
    "country": "Turkey",
    "letters": [
      "C",
      "H",
      "A",
      "I",
      "R"
    ],
    "rows": 5,
    "cols": 7,
    "butterfly": {
      "r": 4,
      "c": 0
    },
    "words": [
      {
        "word": "CHAIR",
        "row": 1,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "HAIR",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "ARCH",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "CHAR",
        "row": 4,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 23,
    "wonder": "Cliffs of Moher",
    "country": "Ireland",
    "letters": [
      "M",
      "U",
      "S",
      "I",
      "C"
    ],
    "rows": 6,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "MUSIC",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "SCUM",
        "row": 2,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "SUM",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "SIC",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 24,
    "wonder": "Forbidden Imperial City",
    "country": "China",
    "letters": [
      "F",
      "R",
      "O",
      "S",
      "T"
    ],
    "rows": 7,
    "cols": 5,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "FROST",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "FORT",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "SORT",
        "row": 3,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "SOFT",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  }
];

export const WOW_LEVELS_MEDIUM = [
  {
    "id": 1,
    "wonder": "Great Pyramid of Giza",
    "country": "Egypt",
    "letters": [
      "C",
      "A",
      "S",
      "T",
      "L",
      "E"
    ],
    "rows": 7,
    "cols": 6,
    "butterfly": {
      "r": 3,
      "c": 2
    },
    "words": [
      {
        "word": "CASTLE",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "CAST",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LATE",
        "row": 3,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "TALE",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "SALE",
        "row": 3,
        "col": 2,
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
      "R",
      "E",
      "A",
      "M"
    ],
    "rows": 6,
    "cols": 8,
    "butterfly": {
      "r": 4,
      "c": 0
    },
    "words": [
      {
        "word": "STREAM",
        "row": 1,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "STEAM",
        "row": 1,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "SMART",
        "row": 0,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "TEAM",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "STAR",
        "row": 4,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 3,
    "wonder": "Taj Mahal",
    "country": "India",
    "letters": [
      "G",
      "A",
      "R",
      "D",
      "E",
      "N"
    ],
    "rows": 6,
    "cols": 8,
    "butterfly": {
      "r": 3,
      "c": 4
    },
    "words": [
      {
        "word": "GARDEN",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "GRADE",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "GRAND",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "READ",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "DEAN",
        "row": 3,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 4,
    "wonder": "Machu Picchu",
    "country": "Peru",
    "letters": [
      "P",
      "L",
      "A",
      "N",
      "E",
      "T"
    ],
    "rows": 7,
    "cols": 9,
    "butterfly": {
      "r": 5,
      "c": 0
    },
    "words": [
      {
        "word": "PLANET",
        "row": 2,
        "col": 3,
        "dir": "H"
      },
      {
        "word": "PLANT",
        "row": 2,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "PLATE",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "LATE",
        "row": 0,
        "col": 8,
        "dir": "V"
      },
      {
        "word": "LEAN",
        "row": 5,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 5,
    "wonder": "Petra Treasury",
    "country": "Jordan",
    "letters": [
      "S",
      "I",
      "L",
      "V",
      "E",
      "R"
    ],
    "rows": 8,
    "cols": 6,
    "butterfly": {
      "r": 6,
      "c": 1
    },
    "words": [
      {
        "word": "SILVER",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "LIVER",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "LIVES",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "RISE",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "VEIL",
        "row": 6,
        "col": 1,
        "dir": "H"
      }
    ]
  },
  {
    "id": 6,
    "wonder": "Chichen Itza",
    "country": "Mexico",
    "letters": [
      "B",
      "R",
      "I",
      "D",
      "G",
      "E"
    ],
    "rows": 8,
    "cols": 9,
    "butterfly": {
      "r": 6,
      "c": 0
    },
    "words": [
      {
        "word": "BRIDGE",
        "row": 3,
        "col": 3,
        "dir": "H"
      },
      {
        "word": "BRIDE",
        "row": 3,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "RIDGE",
        "row": 2,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "RIDE",
        "row": 0,
        "col": 8,
        "dir": "V"
      },
      {
        "word": "BIRD",
        "row": 6,
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
      "F",
      "O",
      "R",
      "E",
      "S",
      "T"
    ],
    "rows": 8,
    "cols": 6,
    "butterfly": {
      "r": 0,
      "c": 5
    },
    "words": [
      {
        "word": "FOREST",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "FORTE",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "FROST",
        "row": 2,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "STORE",
        "row": 3,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "FORT",
        "row": 0,
        "col": 5,
        "dir": "V"
      }
    ]
  },
  {
    "id": 8,
    "wonder": "Great Wall of China",
    "country": "China",
    "letters": [
      "S",
      "P",
      "R",
      "I",
      "N",
      "G"
    ],
    "rows": 5,
    "cols": 9,
    "butterfly": {
      "r": 1,
      "c": 5
    },
    "words": [
      {
        "word": "SPRING",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RINGS",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "GRINS",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "SPIN",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "RING",
        "row": 1,
        "col": 5,
        "dir": "H"
      }
    ]
  },
  {
    "id": 9,
    "wonder": "Angkor Wat",
    "country": "Cambodia",
    "letters": [
      "C",
      "A",
      "N",
      "D",
      "L",
      "E"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 8,
      "c": 0
    },
    "words": [
      {
        "word": "CANDLE",
        "row": 4,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "CLEAN",
        "row": 4,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "DANCE",
        "row": 4,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "LANCE",
        "row": 0,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "LAND",
        "row": 8,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 10,
    "wonder": "Santorini Caldera",
    "country": "Greece",
    "letters": [
      "W",
      "I",
      "N",
      "T",
      "E",
      "R"
    ],
    "rows": 7,
    "cols": 9,
    "butterfly": {
      "r": 5,
      "c": 0
    },
    "words": [
      {
        "word": "WINTER",
        "row": 2,
        "col": 3,
        "dir": "H"
      },
      {
        "word": "WRITE",
        "row": 2,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "TWINE",
        "row": 2,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "WIRE",
        "row": 0,
        "col": 8,
        "dir": "V"
      },
      {
        "word": "RENT",
        "row": 5,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 11,
    "wonder": "Neuschwanstein Castle",
    "country": "Germany",
    "letters": [
      "I",
      "S",
      "L",
      "A",
      "N",
      "D"
    ],
    "rows": 7,
    "cols": 7,
    "butterfly": {
      "r": 0,
      "c": 1
    },
    "words": [
      {
        "word": "ISLAND",
        "row": 2,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "LANDS",
        "row": 2,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "SNAIL",
        "row": 1,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "SAND",
        "row": 5,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "SAIL",
        "row": 0,
        "col": 1,
        "dir": "V"
      }
    ]
  },
  {
    "id": 12,
    "wonder": "Alhambra Palace",
    "country": "Spain",
    "letters": [
      "G",
      "O",
      "L",
      "D",
      "E",
      "N"
    ],
    "rows": 8,
    "cols": 8,
    "butterfly": {
      "r": 1,
      "c": 4
    },
    "words": [
      {
        "word": "GOLDEN",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "LODGE",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "OLDEN",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "GOLD",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LONE",
        "row": 1,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 13,
    "wonder": "Mount Fuji",
    "country": "Japan",
    "letters": [
      "F",
      "L",
      "O",
      "W",
      "E",
      "R"
    ],
    "rows": 8,
    "cols": 6,
    "butterfly": {
      "r": 1,
      "c": 5
    },
    "words": [
      {
        "word": "FLOWER",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "LOWER",
        "row": 3,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "FLOW",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "WOLF",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LORE",
        "row": 1,
        "col": 5,
        "dir": "V"
      }
    ]
  },
  {
    "id": 14,
    "wonder": "Hagia Sophia",
    "country": "Turkey",
    "letters": [
      "M",
      "A",
      "R",
      "K",
      "E",
      "T"
    ],
    "rows": 8,
    "cols": 7,
    "butterfly": {
      "r": 0,
      "c": 5
    },
    "words": [
      {
        "word": "MARKET",
        "row": 3,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "MAKER",
        "row": 3,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "TAKE",
        "row": 3,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "TEAM",
        "row": 6,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RATE",
        "row": 0,
        "col": 5,
        "dir": "V"
      }
    ]
  },
  {
    "id": 15,
    "wonder": "Mont Saint-Michel",
    "country": "France",
    "letters": [
      "B",
      "A",
      "S",
      "K",
      "E",
      "T"
    ],
    "rows": 8,
    "cols": 6,
    "butterfly": {
      "r": 7,
      "c": 2
    },
    "words": [
      {
        "word": "BASKET",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "STAKE",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "SKATE",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "BAKE",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "EAST",
        "row": 7,
        "col": 2,
        "dir": "H"
      }
    ]
  },
  {
    "id": 16,
    "wonder": "Acropolis of Athens",
    "country": "Greece",
    "letters": [
      "T",
      "R",
      "A",
      "V",
      "E",
      "L"
    ],
    "rows": 8,
    "cols": 6,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "TRAVEL",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "LATER",
        "row": 3,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "ALERT",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "RATE",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "TALE",
        "row": 0,
        "col": 4,
        "dir": "V"
      }
    ]
  },
  {
    "id": 17,
    "wonder": "Serengeti Plains",
    "country": "Tanzania",
    "letters": [
      "T",
      "E",
      "M",
      "P",
      "L",
      "E"
    ],
    "rows": 5,
    "cols": 8,
    "butterfly": {
      "r": 3,
      "c": 0
    },
    "words": [
      {
        "word": "TEMPLE",
        "row": 1,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "PELT",
        "row": 1,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "MEET",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "PEEL",
        "row": 0,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "MELT",
        "row": 3,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 18,
    "wonder": "Banff Mountain Lakes",
    "country": "Canada",
    "letters": [
      "H",
      "A",
      "R",
      "V",
      "E",
      "S",
      "T"
    ],
    "rows": 9,
    "cols": 10,
    "butterfly": {
      "r": 8,
      "c": 5
    },
    "words": [
      {
        "word": "HARVEST",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "STARVE",
        "row": 3,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "HEART",
        "row": 3,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "SHARE",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "EARTH",
        "row": 8,
        "col": 5,
        "dir": "H"
      }
    ]
  },
  {
    "id": 19,
    "wonder": "Golden Pavilion Kyoto",
    "country": "Japan",
    "letters": [
      "L",
      "A",
      "N",
      "T",
      "E",
      "R",
      "N"
    ],
    "rows": 8,
    "cols": 9,
    "butterfly": {
      "r": 7,
      "c": 0
    },
    "words": [
      {
        "word": "LANTERN",
        "row": 3,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "LEARN",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "LATER",
        "row": 1,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "ALERT",
        "row": 0,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "RENT",
        "row": 7,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 20,
    "wonder": "Grand Canyon Vista",
    "country": "United States",
    "letters": [
      "O",
      "R",
      "C",
      "H",
      "A",
      "R",
      "D"
    ],
    "rows": 7,
    "cols": 8,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "ORCHARD",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "ROACH",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CHORD",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "HARD",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "CHAR",
        "row": 0,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 21,
    "wonder": "Venetian Grand Canal",
    "country": "Italy",
    "letters": [
      "C",
      "A",
      "P",
      "T",
      "A",
      "I",
      "N"
    ],
    "rows": 8,
    "cols": 7,
    "butterfly": {
      "r": 1,
      "c": 0
    },
    "words": [
      {
        "word": "CAPTAIN",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "PAINT",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "PANT",
        "row": 2,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "PAIN",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "PACT",
        "row": 1,
        "col": 0,
        "dir": "V"
      }
    ]
  },
  {
    "id": 22,
    "wonder": "Sultan Ahmed Mosque",
    "country": "Turkey",
    "letters": [
      "C",
      "O",
      "M",
      "P",
      "A",
      "S",
      "S"
    ],
    "rows": 8,
    "cols": 8,
    "butterfly": {
      "r": 5,
      "c": 4
    },
    "words": [
      {
        "word": "COMPASS",
        "row": 3,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "SCAMP",
        "row": 3,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "SOAPS",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CAMPS",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "CAMP",
        "row": 5,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 23,
    "wonder": "Cliffs of Moher",
    "country": "Ireland",
    "letters": [
      "C",
      "R",
      "Y",
      "S",
      "T",
      "A",
      "L"
    ],
    "rows": 7,
    "cols": 7,
    "butterfly": {
      "r": 0,
      "c": 1
    },
    "words": [
      {
        "word": "CRYSTAL",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "SALTY",
        "row": 2,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "STRAY",
        "row": 0,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CARTS",
        "row": 1,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "STAR",
        "row": 0,
        "col": 1,
        "dir": "H"
      }
    ]
  },
  {
    "id": 24,
    "wonder": "Forbidden Imperial City",
    "country": "China",
    "letters": [
      "M",
      "O",
      "R",
      "N",
      "I",
      "N",
      "G"
    ],
    "rows": 5,
    "cols": 7,
    "butterfly": {
      "r": 0,
      "c": 6
    },
    "words": [
      {
        "word": "MORNING",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "MINOR",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "RING",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "IRON",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "GRIN",
        "row": 0,
        "col": 6,
        "dir": "V"
      }
    ]
  }
];

export const WOW_LEVELS_HARD = [
  {
    "id": 1,
    "wonder": "Great Pyramid of Giza",
    "country": "Egypt",
    "letters": [
      "S",
      "C",
      "A",
      "R",
      "L",
      "E",
      "T"
    ],
    "rows": 7,
    "cols": 8,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "CASTLE",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "CRATES",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "SLATE",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "CAST",
        "row": 3,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CLEARS",
        "row": 2,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "SCALE",
        "row": 2,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "SCAR",
        "row": 0,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 2,
    "wonder": "The Colosseum",
    "country": "Italy",
    "letters": [
      "G",
      "R",
      "A",
      "N",
      "I",
      "T",
      "E"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 0,
      "c": 3
    },
    "words": [
      {
        "word": "GRANITE",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RETAIN",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "TIGER",
        "row": 0,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "RETINA",
        "row": 3,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "RATING",
        "row": 7,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "GRAIN",
        "row": 4,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "TRAIN",
        "row": 0,
        "col": 3,
        "dir": "H"
      }
    ]
  },
  {
    "id": 3,
    "wonder": "Taj Mahal",
    "country": "India",
    "letters": [
      "H",
      "A",
      "R",
      "V",
      "E",
      "S",
      "T"
    ],
    "rows": 7,
    "cols": 7,
    "butterfly": {
      "r": 6,
      "c": 1
    },
    "words": [
      {
        "word": "HARVEST",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "HEARTS",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "SHARE",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "STARVE",
        "row": 1,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "EARTH",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "HEART",
        "row": 6,
        "col": 1,
        "dir": "H"
      }
    ]
  },
  {
    "id": 4,
    "wonder": "Machu Picchu",
    "country": "Peru",
    "letters": [
      "C",
      "R",
      "I",
      "M",
      "S",
      "O",
      "N"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 2,
      "c": 0
    },
    "words": [
      {
        "word": "CRIMSON",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "MINORS",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "SONIC",
        "row": 2,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "SCORN",
        "row": 4,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "MICRO",
        "row": 0,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "ICONS",
        "row": 8,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "MINOR",
        "row": 2,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 5,
    "wonder": "Petra Treasury",
    "country": "Jordan",
    "letters": [
      "L",
      "A",
      "N",
      "T",
      "E",
      "R",
      "S"
    ],
    "rows": 8,
    "cols": 8,
    "butterfly": {
      "r": 0,
      "c": 7
    },
    "words": [
      {
        "word": "ANTLERS",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RENTAL",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "LEARN",
        "row": 1,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "RENTALS",
        "row": 1,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "SLATE",
        "row": 7,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "LEAN",
        "row": 2,
        "col": 4,
        "dir": "H"
      },
      {
        "word": "RENT",
        "row": 0,
        "col": 7,
        "dir": "V"
      }
    ]
  },
  {
    "id": 6,
    "wonder": "Chichen Itza",
    "country": "Mexico",
    "letters": [
      "C",
      "H",
      "A",
      "R",
      "T",
      "E",
      "D"
    ],
    "rows": 8,
    "cols": 9,
    "butterfly": {
      "r": 6,
      "c": 4
    },
    "words": [
      {
        "word": "CHARTED",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "THREAD",
        "row": 0,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "CEDAR",
        "row": 2,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "HATRED",
        "row": 2,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "ARCHED",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CRATED",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "HEART",
        "row": 6,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 7,
    "wonder": "Amber Palace",
    "country": "India",
    "letters": [
      "G",
      "L",
      "A",
      "C",
      "I",
      "E",
      "R"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 4,
      "c": 7
    },
    "words": [
      {
        "word": "GLACIER",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "REGAL",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "RELIC",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "GRACE",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "GLARE",
        "row": 4,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "LARGE",
        "row": 6,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RAIL",
        "row": 4,
        "col": 7,
        "dir": "V"
      }
    ]
  },
  {
    "id": 8,
    "wonder": "Great Wall of China",
    "country": "China",
    "letters": [
      "P",
      "A",
      "S",
      "T",
      "U",
      "R",
      "E"
    ],
    "rows": 9,
    "cols": 7,
    "butterfly": {
      "r": 8,
      "c": 3
    },
    "words": [
      {
        "word": "PASTURE",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "TAPER",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "SPARE",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "PASTE",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "SPEAR",
        "row": 1,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "ERUPT",
        "row": 4,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "PAST",
        "row": 8,
        "col": 3,
        "dir": "H"
      }
    ]
  },
  {
    "id": 9,
    "wonder": "Angkor Wat",
    "country": "Cambodia",
    "letters": [
      "C",
      "H",
      "A",
      "P",
      "T",
      "E",
      "R"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 6,
      "c": 0
    },
    "words": [
      {
        "word": "CHAPTER",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "CARPET",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "PEACH",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "PREACH",
        "row": 0,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "HEART",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "CHEAP",
        "row": 4,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "REACH",
        "row": 6,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 10,
    "wonder": "Santorini Caldera",
    "country": "Greece",
    "letters": [
      "W",
      "H",
      "I",
      "S",
      "P",
      "E",
      "R"
    ],
    "rows": 9,
    "cols": 9,
    "butterfly": {
      "r": 7,
      "c": 5
    },
    "words": [
      {
        "word": "WHISPER",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "PERISH",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "SPIRE",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "SWIPER",
        "row": 3,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "SWIPE",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RIPE",
        "row": 4,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "PIER",
        "row": 7,
        "col": 5,
        "dir": "H"
      }
    ]
  },
  {
    "id": 11,
    "wonder": "Neuschwanstein Castle",
    "country": "Germany",
    "letters": [
      "M",
      "A",
      "R",
      "V",
      "E",
      "L",
      "S"
    ],
    "rows": 8,
    "cols": 7,
    "butterfly": {
      "r": 2,
      "c": 2
    },
    "words": [
      {
        "word": "MARVELS",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "REALM",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "SALVE",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "MARVEL",
        "row": 2,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "REALMS",
        "row": 6,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "LASER",
        "row": 0,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "MALES",
        "row": 2,
        "col": 2,
        "dir": "H"
      }
    ]
  },
  {
    "id": 12,
    "wonder": "Alhambra Palace",
    "country": "Spain",
    "letters": [
      "C",
      "I",
      "T",
      "A",
      "D",
      "E",
      "L"
    ],
    "rows": 8,
    "cols": 9,
    "butterfly": {
      "r": 0,
      "c": 8
    },
    "words": [
      {
        "word": "CITADEL",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "DIALECT",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "IDEAL",
        "row": 1,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "TIDAL",
        "row": 3,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "DEALT",
        "row": 2,
        "col": 4,
        "dir": "H"
      },
      {
        "word": "TILED",
        "row": 7,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "DATE",
        "row": 0,
        "col": 8,
        "dir": "V"
      }
    ]
  },
  {
    "id": 13,
    "wonder": "Mount Fuji",
    "country": "Japan",
    "letters": [
      "T",
      "H",
      "U",
      "N",
      "D",
      "E",
      "R"
    ],
    "rows": 7,
    "cols": 7,
    "butterfly": {
      "r": 2,
      "c": 3
    },
    "words": [
      {
        "word": "THUNDER",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "HUNTER",
        "row": 0,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "TREND",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "HUNTED",
        "row": 1,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "HUNT",
        "row": 1,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "RENT",
        "row": 2,
        "col": 3,
        "dir": "H"
      }
    ]
  },
  {
    "id": 14,
    "wonder": "Hagia Sophia",
    "country": "Turkey",
    "letters": [
      "G",
      "A",
      "R",
      "N",
      "E",
      "T",
      "S"
    ],
    "rows": 7,
    "cols": 9,
    "butterfly": {
      "r": 2,
      "c": 4
    },
    "words": [
      {
        "word": "STRANGE",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "GARNET",
        "row": 0,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "STAGE",
        "row": 2,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "GARNETS",
        "row": 6,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "GREAT",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "AGENT",
        "row": 0,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "STERN",
        "row": 2,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 15,
    "wonder": "Mont Saint-Michel",
    "country": "France",
    "letters": [
      "P",
      "L",
      "A",
      "N",
      "T",
      "E",
      "R"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 8,
      "c": 1
    },
    "words": [
      {
        "word": "PLANTER",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "PLANET",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "PEARL",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "PARENT",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "PLANT",
        "row": 4,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "PALE",
        "row": 6,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "TALE",
        "row": 8,
        "col": 1,
        "dir": "H"
      }
    ]
  },
  {
    "id": 16,
    "wonder": "Acropolis of Athens",
    "country": "Greece",
    "letters": [
      "S",
      "E",
      "R",
      "V",
      "A",
      "N",
      "T"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 0,
      "c": 1
    },
    "words": [
      {
        "word": "SERVANT",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "TAVERN",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "SNARE",
        "row": 2,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "STARVE",
        "row": 3,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "STARE",
        "row": 4,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "SAVER",
        "row": 8,
        "col": 3,
        "dir": "H"
      },
      {
        "word": "STERN",
        "row": 0,
        "col": 1,
        "dir": "H"
      }
    ]
  },
  {
    "id": 17,
    "wonder": "Serengeti Plains",
    "country": "Tanzania",
    "letters": [
      "C",
      "U",
      "R",
      "T",
      "A",
      "I",
      "N",
      "S"
    ],
    "rows": 8,
    "cols": 9,
    "butterfly": {
      "r": 0,
      "c": 8
    },
    "words": [
      {
        "word": "CURTAIN",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "RUSTIC",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "STRAIN",
        "row": 2,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "TRAINS",
        "row": 6,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "TUNIC",
        "row": 0,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CRUST",
        "row": 1,
        "col": 4,
        "dir": "H"
      },
      {
        "word": "STAR",
        "row": 0,
        "col": 8,
        "dir": "V"
      }
    ]
  },
  {
    "id": 18,
    "wonder": "Banff Mountain Lakes",
    "country": "Canada",
    "letters": [
      "P",
      "A",
      "I",
      "N",
      "T",
      "E",
      "R",
      "S"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 0,
      "c": 4
    },
    "words": [
      {
        "word": "PAINTER",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "PIRATE",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "STRIPE",
        "row": 0,
        "col": 0,
        "dir": "V"
      },
      {
        "word": "REPAINT",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "PARENTS",
        "row": 2,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "PRIEST",
        "row": 8,
        "col": 2,
        "dir": "H"
      },
      {
        "word": "PINE",
        "row": 0,
        "col": 4,
        "dir": "H"
      }
    ]
  },
  {
    "id": 19,
    "wonder": "Golden Pavilion Kyoto",
    "country": "Japan",
    "letters": [
      "M",
      "O",
      "U",
      "N",
      "T",
      "A",
      "I",
      "S"
    ],
    "rows": 9,
    "cols": 9,
    "butterfly": {
      "r": 0,
      "c": 0
    },
    "words": [
      {
        "word": "TSUNAMI",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "MOUNT",
        "row": 0,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "SAINT",
        "row": 1,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "AMOUNT",
        "row": 3,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "MANTIS",
        "row": 8,
        "col": 3,
        "dir": "H"
      },
      {
        "word": "SATIN",
        "row": 1,
        "col": 4,
        "dir": "H"
      },
      {
        "word": "OMIT",
        "row": 0,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 20,
    "wonder": "Grand Canyon Vista",
    "country": "United States",
    "letters": [
      "C",
      "R",
      "E",
      "A",
      "T",
      "I",
      "O",
      "N"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 4,
      "c": 6
    },
    "words": [
      {
        "word": "CERTAIN",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "ORNATE",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "OCEAN",
        "row": 0,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "ACTION",
        "row": 3,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "CARTON",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "TONIC",
        "row": 7,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "IRATE",
        "row": 4,
        "col": 6,
        "dir": "V"
      }
    ]
  },
  {
    "id": 21,
    "wonder": "Venetian Grand Canal",
    "country": "Italy",
    "letters": [
      "S",
      "O",
      "L",
      "I",
      "T",
      "A",
      "R",
      "Y"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 1,
      "c": 0
    },
    "words": [
      {
        "word": "SOLITARY",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "SAILOR",
        "row": 0,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "TRAIL",
        "row": 1,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "TAILOR",
        "row": 3,
        "col": 5,
        "dir": "V"
      },
      {
        "word": "ROYALS",
        "row": 2,
        "col": 7,
        "dir": "V"
      },
      {
        "word": "SOLAR",
        "row": 8,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "SALTY",
        "row": 1,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 22,
    "wonder": "Sultan Ahmed Mosque",
    "country": "Turkey",
    "letters": [
      "M",
      "E",
      "R",
      "C",
      "H",
      "A",
      "N",
      "T"
    ],
    "rows": 7,
    "cols": 9,
    "butterfly": {
      "r": 0,
      "c": 8
    },
    "words": [
      {
        "word": "CHANTER",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "ANTHEM",
        "row": 0,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "CHARM",
        "row": 2,
        "col": 3,
        "dir": "V"
      },
      {
        "word": "MARCH",
        "row": 1,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "MATCH",
        "row": 2,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "CHANT",
        "row": 0,
        "col": 4,
        "dir": "H"
      },
      {
        "word": "TEAM",
        "row": 0,
        "col": 8,
        "dir": "V"
      }
    ]
  },
  {
    "id": 23,
    "wonder": "Cliffs of Moher",
    "country": "Ireland",
    "letters": [
      "S",
      "T",
      "A",
      "R",
      "L",
      "I",
      "G",
      "H"
    ],
    "rows": 9,
    "cols": 7,
    "butterfly": {
      "r": 6,
      "c": 0
    },
    "words": [
      {
        "word": "SLIGHT",
        "row": 4,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "GRAIL",
        "row": 0,
        "col": 2,
        "dir": "V"
      },
      {
        "word": "STAIR",
        "row": 3,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "LIGHTS",
        "row": 2,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "RIGHTS",
        "row": 0,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "SHIRT",
        "row": 4,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "SIGHT",
        "row": 6,
        "col": 0,
        "dir": "H"
      }
    ]
  },
  {
    "id": 24,
    "wonder": "Forbidden Imperial City",
    "country": "China",
    "letters": [
      "G",
      "A",
      "R",
      "D",
      "E",
      "N",
      "I",
      "S"
    ],
    "rows": 9,
    "cols": 8,
    "butterfly": {
      "r": 8,
      "c": 4
    },
    "words": [
      {
        "word": "GARDENS",
        "row": 4,
        "col": 0,
        "dir": "H"
      },
      {
        "word": "DANGER",
        "row": 0,
        "col": 4,
        "dir": "V"
      },
      {
        "word": "GRAIN",
        "row": 2,
        "col": 1,
        "dir": "V"
      },
      {
        "word": "GARDEN",
        "row": 0,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "GAINED",
        "row": 2,
        "col": 1,
        "dir": "H"
      },
      {
        "word": "SNARE",
        "row": 4,
        "col": 6,
        "dir": "V"
      },
      {
        "word": "AGED",
        "row": 8,
        "col": 4,
        "dir": "H"
      }
    ]
  }
];

export const WOW_DIFFICULTIES = {
  easy: { id: "easy", label: "Easy", subtitle: "4-5 Letters", levels: WOW_LEVELS_EASY },
  medium: { id: "medium", label: "Medium", subtitle: "6-7 Letters", levels: WOW_LEVELS_MEDIUM },
  hard: { id: "hard", label: "Hard", subtitle: "7-8 Letters", levels: WOW_LEVELS_HARD }
};

export const WOW_LEVELS = WOW_LEVELS_EASY;
