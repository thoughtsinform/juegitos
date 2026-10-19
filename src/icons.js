/**
 * Vector SVG Iconography System for Jueguitos Arcade
 * Replaces all emojis with crisp, scalable, high-contrast SVG icons.
 */

export const Icons = {
  // Solitaire / Cards icon
  cards: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="13" height="17" rx="2.5" fill="rgba(255,255,255,0.14)"></rect>
      <path d="M8 2h10a2 2 0 0 1 2 2v14"></path>
      <path d="M9.5 13.5l2-2.5 2 2.5-2 2.5-2-2.5z" fill="currentColor"></path>
    </svg>
  `,

  // Words of Wonders / Letter Tiles icon
  tiles: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="rgba(255,255,255,0.14)"></rect>
      <rect x="13" y="3" width="8" height="8" rx="2" fill="rgba(255,255,255,0.14)"></rect>
      <rect x="3" y="13" width="8" height="8" rx="2" fill="rgba(255,255,255,0.14)"></rect>
      <rect x="13" y="13" width="8" height="8" rx="2" fill="rgba(255,255,255,0.14)"></rect>
      <path d="M5.5 8.5l1.5-3 1.5 3M5.9 7.5h2.2" stroke-width="1.6"></path>
      <path d="M15.5 5.5v3M14.5 5.5h2" stroke-width="1.6"></path>
    </svg>
  `,

  // Sneaker / Walking Steps icon
  sneaker: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 18h18v-2a4 4 0 0 0-4-4h-2l-2-4H7L4.5 13H3v5z" fill="rgba(255,255,255,0.14)"></path>
      <path d="M3 18v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2"></path>
      <path d="M7 8l1.5 4"></path>
      <path d="M10 8l1 4"></path>
      <circle cx="17.5" cy="15.5" r="1" fill="currentColor"></circle>
    </svg>
  `,

  // Target / Step Goal icon
  target: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>
    </svg>
  `,

  // Plus icon (+100 steps)
  plus: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,

  // Close 'X' icon
  close: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `,

  // Goal Met Celebration Ribbon / Award Star icon
  awardStar: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" fill="rgba(250, 204, 21, 0.25)"></circle>
      <polygon points="12 4 13.5 7 17 7.5 14.5 10 15 13.5 12 11.8 9 13.5 9.5 10 7 7.5 10.5 7" fill="#facc15" stroke="#facc15" stroke-width="1"></polygon>
      <polyline points="8.2 13.5 6 22 12 19 18 22 15.8 13.5"></polyline>
    </svg>
  `,

  // Arcade Controller icon (Login logo)
  gamepad: (cls = '', size = 48) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="6" fill="rgba(16, 185, 129, 0.15)"></rect>
      <path d="M6 12h4M8 10v4" stroke-width="2.2"></path>
      <circle cx="15.5" cy="10.5" r="1.2" fill="currentColor"></circle>
      <circle cx="17.5" cy="13.5" r="1.2" fill="currentColor"></circle>
    </svg>
  `,

  // Lightbulb (Hint)
  lightbulb: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 18h6M10 22h4"></path>
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" fill="rgba(250, 204, 21, 0.2)"></path>
    </svg>
  `,

  // Magic wand / Sparkle (Auto-finish / Deal)
  sparkle: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
      <path d="M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path>
      <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
    </svg>
  `,

  // Hammer (Targeted Hint in WoW)
  hammer: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 6l4-4 4 4-4 4-2-2"></path>
      <path d="M14 6l-2-2-4 4 2 2"></path>
      <path d="M10 10l-8 8a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0l8-8"></path>
    </svg>
  `,

  // Shuffle icon
  shuffle: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="16 3 21 3 21 8"></polyline>
      <line x1="4" y1="20" x2="21" y2="3"></line>
      <polyline points="21 16 21 21 16 21"></polyline>
      <line x1="15" y1="15" x2="21" y2="21"></line>
      <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
  `,

  // Trophy / Victory icon
  trophy: (cls = '', size = 22) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"></path>
      <path d="M18 9h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"></path>
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="rgba(250, 204, 21, 0.25)"></path>
      <line x1="12" y1="16" x2="12" y2="20"></line>
      <line x1="8" y1="20" x2="16" y2="20"></line>
    </svg>
  `,

  // Crown (Winning Deal / Mastery)
  crown: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="2 18 22 18 20 7 15 12 12 5 9 12 4 7 2 18" fill="rgba(250, 204, 21, 0.25)"></polygon>
      <line x1="2" y1="21" x2="22" y2="21"></line>
    </svg>
  `,

  // Palette (Theme Switcher)
  palette: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r="1" fill="currentColor"></circle>
      <circle cx="17.5" cy="10.5" r="1" fill="currentColor"></circle>
      <circle cx="8.5" cy="7.5" r="1" fill="currentColor"></circle>
      <circle cx="6.5" cy="12.5" r="1" fill="currentColor"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.68-.75 1.68-1.68 0-.43-.17-.83-.44-1.13-.29-.31-.44-.7-.44-1.13 0-.93.75-1.68 1.68-1.68H16c3.31 0 6-2.69 6-6 0-4.96-4.48-9-10-9z" fill="rgba(255,255,255,0.12)"></path>
    </svg>
  `,

  // Butterfly (WoW Chrysalis / Butterfly Bonus Tile)
  butterfly: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 6c-3-4-8-4-9 0-1 3 2 6 5 7-3 1-5 4-3 7 1.5 2 5 1 7-2 2 3 5.5 4 7 2 2-3 0-6-3-7 3-1 6-4 5-7-1-4-6-4-9 0z" fill="rgba(251, 191, 36, 0.35)"></path>
      <line x1="12" y1="4" x2="12" y2="20" stroke-width="2.2"></line>
    </svg>
  `,

  // Wonder Monument / Greek Temple icon
  monument: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 22 7" fill="rgba(255,255,255,0.15)"></polygon>
      <line x1="4" y1="10" x2="4" y2="18"></line>
      <line x1="9" y1="10" x2="9" y2="18"></line>
      <line x1="15" y1="10" x2="15" y2="18"></line>
      <line x1="20" y1="10" x2="20" y2="18"></line>
      <line x1="2" y1="18" x2="22" y2="18"></line>
      <line x1="1" y1="21" x2="23" y2="21"></line>
    </svg>
  `,

  // Bonus Jar / Amphora Vase icon
  jar: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="4" rx="5" ry="2"></ellipse>
      <path d="M7 4c0 3-3 5-3 9a8 8 0 0 0 16 0c0-4-3-6-3-9" fill="rgba(251, 146, 60, 0.2)"></path>
      <path d="M4 11a3 3 0 0 1-2-2.5A2.5 2.5 0 0 1 4.5 6"></path>
      <path d="M20 11a3 3 0 0 0 2-2.5A2.5 2.5 0 0 0 19.5 6"></path>
      <line x1="9" y1="20" x2="15" y2="20"></line>
    </svg>
  `,

  // Gold Coin icon
  coin: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="rgba(250, 204, 21, 0.3)" stroke="#facc15"></circle>
      <circle cx="12" cy="12" r="5.5" stroke="#facc15" stroke-dasharray="2 2"></circle>
      <path d="M12 8.5v7M10.5 10.5h3M10.5 13.5h3" stroke="#facc15"></path>
    </svg>
  `,

  // Star icon
  star: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  `,

  // Undo arrow
  undo: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 7v6h6"></path>
      <path d="M3 13a9 9 0 0 1 15.36-6.36A9 9 0 0 1 21 13a9 9 0 0 1-9 9 9 9 0 0 1-6-2.3"></path>
    </svg>
  `,

  // Restart / New game arrow
  restart: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 2v6h-6"></path>
      <path d="M3 12a9 9 0 0 1 15.55-6.36L21 8"></path>
      <path d="M3 12a9 9 0 0 0 15 6.7"></path>
    </svg>
  `,

  // Checkmark
  check: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,

  // Chevron Down
  chevronDown: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,

  // Chevron Up
  chevronUp: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `,

  // Toy Blast - Cube / Toy Blocks icon
  toyBlocks: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="9" height="9" rx="2" fill="rgba(239, 68, 68, 0.35)" stroke="#ef4444"></rect>
      <rect x="13" y="3" width="9" height="9" rx="2" fill="rgba(59, 130, 246, 0.35)" stroke="#3b82f6"></rect>
      <rect x="2" y="14" width="9" height="9" rx="2" fill="rgba(234, 179, 8, 0.35)" stroke="#eab308"></rect>
      <rect x="13" y="14" width="9" height="9" rx="2" fill="rgba(34, 197, 94, 0.35)" stroke="#22c55e"></rect>
    </svg>
  `,

  // Horizontal Rotor / Rocket Booster (Toy Blast & Matchington)
  rotorH: (cls = '', size = 22) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 12l4-4v8l-4-4z" fill="currentColor"></path>
      <path d="M22 12l-4-4v8l4-4z" fill="currentColor"></path>
      <rect x="6" y="9" width="12" height="6" rx="3" fill="rgba(255,255,255,0.35)"></rect>
      <circle cx="12" cy="12" r="2.2" fill="#fff"></circle>
    </svg>
  `,

  // Vertical Rotor / Rocket Booster (Toy Blast & Matchington)
  rotorV: (cls = '', size = 22) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2l-4 4h8l-4-4z" fill="currentColor"></path>
      <path d="M12 22l-4-4h8l4 4z" fill="currentColor"></path>
      <rect x="9" y="6" width="6" height="12" rx="3" fill="rgba(255,255,255,0.35)"></rect>
      <circle cx="12" cy="12" r="2.2" fill="#fff"></circle>
    </svg>
  `,

  // Rocket / Rotor Booster (general guide icon)
  rocket: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="rgba(239, 68, 68, 0.25)"></path>
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"></circle>
    </svg>
  `,

  // Bomb / TNT Booster
  bomb: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="13" r="8" fill="rgba(244, 63, 94, 0.35)"></circle>
      <circle cx="8.5" cy="10.5" r="2" fill="rgba(255,255,255,0.5)" stroke="none"></circle>
      <path d="M14.35 4.65l1.41-1.41a2 2 0 0 1 2.83 0l1.41 1.41a2 2 0 0 1 0 2.83l-1.41 1.41"></path>
      <path d="M19 2l2 2M21 7l2-1M17 1l-1 2" stroke="#facc15" stroke-width="2.2"></path>
    </svg>
  `,

  // Disco Ball / Magic Puzzle Cube
  discoBall: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="rgba(168, 85, 247, 0.3)" stroke="#fff"></circle>
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="rgba(255,255,255,0.75)"></ellipse>
      <line x1="3.5" y1="9" x2="20.5" y2="9" stroke="rgba(255,255,255,0.75)"></line>
      <line x1="3.5" y1="15" x2="20.5" y2="15" stroke="rgba(255,255,255,0.75)"></line>
      <circle cx="9" cy="9" r="1.2" fill="#fde047" stroke="none"></circle>
      <circle cx="15" cy="12" r="1.2" fill="#38bdf8" stroke="none"></circle>
      <circle cx="10" cy="15" r="1.2" fill="#f472b6" stroke="none"></circle>
    </svg>
  `,

  // Duck Goal
  duck: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 11c-2.5 0-4 1.5-4 4 0 3 2.5 5 7 5 5 0 8-3 9-6a3 3 0 0 0-3-3H7z" fill="#facc15" stroke="#854d0e"></path>
      <circle cx="15.5" cy="7.5" r="3.5" fill="#fde047" stroke="#854d0e"></circle>
      <circle cx="16.5" cy="7" r="0.9" fill="#1e293b" stroke="none"></circle>
      <path d="M19 7.2l3 .6-3 1.4" fill="#f97316" stroke="#c2410c"></path>
    </svg>
  `,

  // Wooden Crate Obstacle
  crate: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2.5" fill="rgba(217, 119, 6, 0.35)" stroke="currentColor"></rect>
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-opacity="0.6"></line>
      <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" stroke-opacity="0.6"></line>
      <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor"></line>
    </svg>
  `,

  // Bubble / Ice Obstacle
  bubble: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="rgba(125, 211, 252, 0.22)" stroke="#7dd3fc"></circle>
      <path d="M8 7.5a5 5 0 0 1 5-1.5" stroke="#ffffff" stroke-width="2.2"></path>
      <circle cx="16" cy="15.5" r="1" fill="#ffffff" stroke="none"></circle>
    </svg>
  `,

  // Matchington - Mansion / Villa
  mansion: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 10l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" fill="rgba(244, 114, 182, 0.2)"></path>
      <rect x="9" y="14" width="6" height="8" rx="1"></rect>
      <rect x="6" y="10" width="3" height="3" rx="0.5"></rect>
      <rect x="15" y="10" width="3" height="3" rx="0.5"></rect>
    </svg>
  `,

  // Sofa / Furniture / Renovation
  sofa: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3" fill="rgba(236, 72, 153, 0.25)"></path>
      <path d="M2 11a2 2 0 0 1 2 2v2h16v-2a2 2 0 1 1 4 0v5H2v-5a2 2 0 0 1 0-2z" fill="rgba(236, 72, 153, 0.15)"></path>
      <line x1="5" y1="18" x2="5" y2="21"></line>
      <line x1="19" y1="18" x2="19" y2="21"></line>
    </svg>
  `,

  // Potted Botanical Plant Tile (Matchington 'plant' item)
  plant: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 14V6" stroke="#15803d" stroke-width="2.2"></path>
      <path d="M12 10c-4 0-6-3-6-6 3 0 6 2 6 6z" fill="#4ade80" stroke="#15803d"></path>
      <path d="M12 12c4 0 6-3 6-6-3 0-6 2-6 6z" fill="#22c55e" stroke="#15803d"></path>
      <polygon points="7 14 17 14 15.5 21 8.5 21" fill="#d97706" stroke="#92400e"></polygon>
    </svg>
  `,

  // Paper Plane Booster (Matchington)
  paperPlane: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="rgba(255, 255, 255, 0.35)"></polygon>
      <line x1="22" y1="2" x2="11" y2="13"></line>
    </svg>
  `,

  // Paintbrush / Interior Decorate
  paintBrush: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18.37 2.63a2.12 2.12 0 0 1 3 3L13.5 13.5 8 14l.5-5.5 9.87-9.87z" fill="rgba(244, 114, 182, 0.25)"></path>
      <path d="M14.5 4.5l5 5"></path>
      <path d="M8 14c-2.5 1-4 3-4 6 0 1 1 2 2 2 3 0 5-1.5 6-4"></path>
    </svg>
  `,

  // Renovation Key / Star Key
  key: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="4.5" fill="rgba(250, 204, 21, 0.3)"></circle>
      <path d="M10.8 12.2L20 3"></path>
      <path d="M16 3l4 4"></path>
      <path d="M14 5l2 2"></path>
    </svg>
  `,

  // Cushion / Pillow Tile
  pillow: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="#38bdf8" stroke="#0284c7"></rect>
      <rect x="6" y="6" width="12" height="12" rx="3" fill="rgba(255,255,255,0.28)" stroke="none"></rect>
      <circle cx="12" cy="12" r="2" fill="#ffffff" stroke="none"></circle>
    </svg>
  `,

  // Teacup Tile
  teacup: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17 8h1.5a3.5 3.5 0 0 1 0 7H17" stroke="#be185d"></path>
      <path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8z" fill="#f472b6" stroke="#be185d"></path>
      <path d="M6 8v3" stroke="rgba(255,255,255,0.65)"></path>
      <line x1="2" y1="21" x2="18" y2="21" stroke="#be185d" stroke-width="2.4"></line>
    </svg>
  `,

  // Lamp Tile
  lamp: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="5 12 19 12 15.5 4 8.5 4 5 12" fill="#fbbf24" stroke="#b45309"></polygon>
      <line x1="12" y1="12" x2="12" y2="19" stroke="#b45309" stroke-width="2.4"></line>
      <path d="M8 20h8" stroke="#b45309" stroke-width="2.4"></path>
    </svg>
  `,

  // Book Tile
  book: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#6d28d9"></path>
      <path d="M6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3z" fill="#a855f7" stroke="#6d28d9"></path>
      <path d="M9 7h6M9 11h4" stroke="rgba(255,255,255,0.75)"></path>
    </svg>
  `,

  // Gem / Ruby Brooch Tile
  gem: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" fill="#fb7185" stroke="#be123c"></polygon>
      <polygon points="7 5 17 5 19 9 12 18 5 9 7 5" fill="rgba(255,255,255,0.28)" stroke="none"></polygon>
    </svg>
  `,

  // Menu / Settings Gear & Sliders Icon
  settings: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
      <circle cx="8" cy="6" r="2" fill="currentColor"></circle>
      <circle cx="16" cy="12" r="2" fill="currentColor"></circle>
      <circle cx="10" cy="18" r="2" fill="currentColor"></circle>
    </svg>
  `,

  menu: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  `
};
