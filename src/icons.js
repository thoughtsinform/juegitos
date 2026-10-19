/**
 * Vector SVG Iconography System for Juegitos Arcade
 * Replaces all emojis with crisp, scalable, high-contrast SVG icons.
 */

export const Icons = {
  // Solitaire / Cards icon
  cards: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="13" height="17" rx="2" fill="rgba(255,255,255,0.1)"></rect>
      <path d="M8 2h10a2 2 0 0 1 2 2v14"></path>
      <path d="M9.5 13.5l1.5-2 1.5 2-1.5 2-1.5-2z" fill="currentColor"></path>
    </svg>
  `,

  // Words of Wonders / Letter Tiles icon
  tiles: (cls = '', size = 20) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="rgba(255,255,255,0.12)"></rect>
      <rect x="13" y="3" width="8" height="8" rx="2" fill="rgba(255,255,255,0.12)"></rect>
      <rect x="3" y="13" width="8" height="8" rx="2" fill="rgba(255,255,255,0.12)"></rect>
      <rect x="13" y="13" width="8" height="8" rx="2" fill="rgba(255,255,255,0.12)"></rect>
      <path d="M5.5 8.5l1.5-3 1.5 3M5.9 7.5h2.2" stroke-width="1.6"></path>
      <path d="M15.5 5.5v3M14.5 5.5h2" stroke-width="1.6"></path>
    </svg>
  `,

  // Sneaker / Walking Steps icon
  sneaker: (cls = '', size = 18) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 18h18v-2a4 4 0 0 0-4-4h-2l-2-4H7L4.5 13H3v5z" fill="rgba(255,255,255,0.1)"></path>
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
      <circle cx="12" cy="8" r="6" fill="rgba(250, 204, 21, 0.2)"></circle>
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
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" fill="rgba(250, 204, 21, 0.15)"></path>
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
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="rgba(250, 204, 21, 0.2)"></path>
      <line x1="12" y1="16" x2="12" y2="20"></line>
      <line x1="8" y1="20" x2="16" y2="20"></line>
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
      <path d="M7 4c0 3-3 5-3 9a8 8 0 0 0 16 0c0-4-3-6-3-9" fill="rgba(251, 146, 60, 0.15)"></path>
      <path d="M4 11a3 3 0 0 1-2-2.5A2.5 2.5 0 0 1 4.5 6"></path>
      <path d="M20 11a3 3 0 0 0 2-2.5A2.5 2.5 0 0 0 19.5 6"></path>
      <line x1="9" y1="20" x2="15" y2="20"></line>
    </svg>
  `,

  // Gold Coin icon
  coin: (cls = '', size = 16) => `
    <svg class="svg-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="rgba(250, 204, 21, 0.25)" stroke="#facc15"></circle>
      <circle cx="12" cy="12" r="5" stroke="#facc15" stroke-dasharray="2 2"></circle>
      <path d="M12 9v6M10.5 10.5h3" stroke="#facc15"></path>
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
  `
};
