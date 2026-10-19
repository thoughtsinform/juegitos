/**
 * Studio-Grade SVG Card Renderer for Jueguitos Spider Solitaire
 * Features:
 * - Unclipped horizontal top-strip index ([Rank][Suit]) so every stacked card's rank AND suit are 100% visible
 * - Authentic multi-pip coordinate layouts for number cards (A-10)
 * - Gilded framed vector court illustrations for Jack, Queen, and King
 * - Burgundy/gold filigree card backs and arachnid foundation watermarks
 */

export const CardRenderer = {
  getSuitSVG(suit, size = 16, className = '') {
    const isRed = suit === 'hearts' || suit === 'diamonds';
    const color = isRed ? '#d91b24' : '#14171f';

    switch (suit) {
      case 'spades':
        return `
          <svg class="suit-svg ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 2C7 8 3 11.5 3 15.2C3 18 5.2 20 7.8 20C9.5 20 10.8 19 11.4 18.2L9.5 22H14.5L12.6 18.2C13.2 19 14.5 20 16.2 20C18.8 20 21 18 21 15.2C21 11.5 17 8 12 2Z"/>
          </svg>`;
      case 'hearts':
        return `
          <svg class="suit-svg ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
          </svg>`;
      case 'clubs':
        return `
          <svg class="suit-svg ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 3a4.2 4.2 0 0 0-4.2 4.2c0 1.4.7 2.6 1.7 3.4A4.3 4.3 0 0 0 3.5 14.5 4.3 4.3 0 0 0 7.8 18.8c1.5 0 2.8-.7 3.5-1.8L9.5 22h5l-1.8-5c.7 1.1 2 1.8 3.5 1.8a4.3 4.3 0 0 0 4.3-4.3 4.3 4.3 0 0 0-6-3.9c1-.8 1.7-2 1.7-3.4A4.2 4.2 0 0 0 12 3z"/>
          </svg>`;
      case 'diamonds':
        return `
          <svg class="suit-svg ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 2L20 12L12 22L4 12L12 2Z"/>
          </svg>`;
      default:
        return '';
    }
  },

  getSpiderWatermarkSVG(color = 'rgba(255, 255, 255, 0.25)') {
    return `
      <svg class="spider-emblem" viewBox="0 0 64 64" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round">
        <ellipse cx="32" cy="36" rx="8" ry="11" fill="${color}" stroke="none"/>
        <circle cx="32" cy="22" r="5" fill="${color}" stroke="none"/>
        <path d="M27 22 C18 14, 12 10, 6 6" />
        <path d="M25 28 C14 24, 8 24, 3 26" />
        <path d="M25 34 C14 36, 8 40, 4 46" />
        <path d="M27 42 C18 48, 14 54, 10 60" />
        <path d="M37 22 C46 14, 52 10, 58 6" />
        <path d="M39 28 C50 24, 56 24, 61 26" />
        <path d="M39 34 C50 36, 56 40, 60 46" />
        <path d="M37 42 C46 48, 50 54, 54 60" />
      </svg>
    `;
  },

  renderStockCardBack() {
    return `
      <div class="card-back stock-card-back">
        <div class="card-back-border">
          ${this.getSpiderWatermarkSVG('#fde68a')}
        </div>
      </div>
    `;
  },

  renderTableauCardBack() {
    return `
      <div class="card-back tableau-card-back">
        <div class="card-back-border pinstripe-bg"></div>
      </div>
    `;
  },

  renderRoyaltyCenter(rank, suit) {
    const isRed = suit === 'hearts' || suit === 'diamonds';
    const primary = isRed ? '#b91c1c' : '#1e293b';
    const gold = '#d97706';
    const cream = '#fef3c7';

    let crownOrHat = '';
    if (rank === 13) {
      // King's Imperial Crown
      crownOrHat = `
        <polygon points="28,36 33,20 42,30 50,16 58,30 67,20 72,36" fill="${gold}" stroke="#78350f" stroke-width="1.5"/>
        <circle cx="50" cy="15" r="2.5" fill="#ef4444"/>
        <circle cx="33" cy="19" r="2" fill="#38bdf8"/>
        <circle cx="67" cy="19" r="2" fill="#38bdf8"/>
      `;
    } else if (rank === 12) {
      // Queen's Tiara & Veil
      crownOrHat = `
        <path d="M26 42 Q22 25 36 28 Q50 14 64 28 Q78 25 74 42 Z" fill="${cream}" opacity="0.4"/>
        <polygon points="32,36 38,22 45,31 50,19 55,31 62,22 68,36" fill="${gold}" stroke="#78350f" stroke-width="1.4"/>
        <circle cx="50" cy="18" r="2.2" fill="#ec4899"/>
      `;
    } else {
      // Jack's Noble Beret & Plume
      crownOrHat = `
        <path d="M28 36 C28 23, 72 23, 72 36 Z" fill="${primary}" stroke="${gold}" stroke-width="1.5"/>
        <path d="M62 28 Q78 16 74 32" fill="none" stroke="${gold}" stroke-width="2.5" stroke-linecap="round"/>
      `;
    }

    return `
      <svg class="royalty-art" viewBox="0 0 100 120">
        <!-- Gilded Inner Court Frame -->
        <rect x="8" y="8" width="84" height="104" rx="5" fill="${isRed ? 'rgba(254, 226, 226, 0.35)' : 'rgba(241, 245, 249, 0.5)'}" stroke="${gold}" stroke-width="1.8"/>
        <rect x="12" y="12" width="76" height="96" rx="3" fill="none" stroke="${primary}" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.4"/>

        <!-- Royal Robes / Shoulders -->
        <path d="M18 106 C20 74, 80 74, 82 106 Z" fill="${primary}" stroke="${gold}" stroke-width="1.8"/>
        <polygon points="36,78 50,96 64,78" fill="${gold}"/>
        <polygon points="43,78 50,89 57,78" fill="#ffffff"/>

        <!-- Head & Noble Visage -->
        <circle cx="50" cy="54" r="16" fill="#fde68a" stroke="#92400e" stroke-width="1.4"/>
        <circle cx="44" cy="51" r="1.8" fill="#1e293b"/>
        <circle cx="56" cy="51" r="1.8" fill="#1e293b"/>
        ${rank === 13 ? `<path d="M40 61 Q50 70 60 61" fill="${primary}" opacity="0.75"/>` : `<path d="M45 60 Q50 64 55 60" stroke="#92400e" stroke-width="1.5" fill="none"/>`}

        ${crownOrHat}
      </svg>
    `;
  },

  renderPipPattern(rank, suit) {
    // Classic playing card multi-pip coordinate grid (normalized 0..100 x 0..120)
    const PIP_COORDS = {
      1: [[50, 60, 1.5, false]],
      2: [[50, 30, 0.95, false], [50, 90, 0.95, true]],
      3: [[50, 28, 0.9, false], [50, 60, 0.9, false], [50, 92, 0.9, true]],
      4: [[32, 30, 0.85, false], [68, 30, 0.85, false], [32, 90, 0.85, true], [68, 90, 0.85, true]],
      5: [[32, 30, 0.85, false], [68, 30, 0.85, false], [50, 60, 0.85, false], [32, 90, 0.85, true], [68, 90, 0.85, true]],
      6: [[32, 28, 0.82, false], [68, 28, 0.82, false], [32, 60, 0.82, false], [68, 60, 0.82, false], [32, 92, 0.82, true], [68, 92, 0.82, true]],
      7: [[32, 28, 0.8, false], [68, 28, 0.8, false], [50, 44, 0.8, false], [32, 60, 0.8, false], [68, 60, 0.8, false], [32, 92, 0.8, true], [68, 92, 0.8, true]],
      8: [[32, 26, 0.78, false], [68, 26, 0.78, false], [50, 42, 0.78, false], [32, 58, 0.78, false], [68, 58, 0.78, false], [50, 76, 0.78, true], [32, 92, 0.78, true], [68, 92, 0.78, true]],
      9: [[32, 24, 0.74, false], [68, 24, 0.74, false], [32, 47, 0.74, false], [68, 47, 0.74, false], [50, 60, 0.74, false], [32, 73, 0.74, true], [68, 73, 0.74, true], [32, 94, 0.74, true], [68, 94, 0.74, true]],
      10: [[32, 24, 0.72, false], [68, 24, 0.72, false], [50, 36, 0.72, false], [32, 48, 0.72, false], [68, 48, 0.72, false], [32, 72, 0.72, true], [68, 72, 0.72, true], [50, 84, 0.72, true], [32, 96, 0.72, true], [68, 96, 0.72, true]]
    };

    const coords = PIP_COORDS[rank] || PIP_COORDS[1];
    const isRed = suit === 'hearts' || suit === 'diamonds';
    const color = isRed ? '#d91b24' : '#14171f';

    let suitPath = '';
    if (suit === 'spades') {
      suitPath = 'M0 -10 C-5 -4 -9 -0.5 -9 3.2 C-9 6 -6.8 8 -4.2 8 C-2.5 8 -1.2 7 -0.6 6.2 L-2.5 10 H2.5 L0.6 6.2 C1.2 7 2.5 8 4.2 8 C6.8 8 9 6 9 3.2 C9 -0.5 5 -4 0 -10 Z';
    } else if (suit === 'hearts') {
      suitPath = 'M0 9.35 L-1.45 8.03 C-6.6 3.36 -10 0.27 -10 -3.5 C-10 -6.59 -7.58 -9 -4.5 -9 C-2.76 -9 -1.09 -8.19 0 -6.92 C1.09 -8.19 2.76 -9 4.5 -9 C7.58 -9 10 -6.59 10 -3.5 C10 0.27 6.6 3.36 1.45 8.03 Z';
    } else if (suit === 'clubs') {
      suitPath = 'M0 -9 a4.2 4.2 0 0 0 -4.2 4.2 c0 1.4 0.7 2.6 1.7 3.4 A4.3 4.3 0 0 0 -8.5 2.5 A4.3 4.3 0 0 0 -4.2 6.8 c1.5 0 2.8 -0.7 3.5 -1.8 L-2.5 10 h5 l-1.8 -5 c0.7 1.1 2 1.8 3.5 1.8 a4.3 4.3 0 0 0 4.3 -4.3 a4.3 4.3 0 0 0 -6 -3.9 c1 -0.8 1.7 -2 1.7 -3.4 A4.2 4.2 0 0 0 0 -9 z';
    } else {
      suitPath = 'M0 -10 L8 0 L0 10 L-8 0 Z';
    }

    return `
      <svg class="pip-grid-svg" viewBox="0 0 100 120" aria-hidden="true">
        ${coords.map(([x, y, scale, flip]) => `
          <g transform="translate(${x}, ${y}) scale(${scale}) ${flip ? 'rotate(180)' : ''}">
            <path d="${suitPath}" fill="${color}"/>
          </g>
        `).join('')}
      </svg>
    `;
  },

  renderCardFace(card) {
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    const colorClass = isRed ? 'card-red' : 'card-black';
    const isRoyalty = card.rank >= 11;

    const centerContent = isRoyalty
      ? this.renderRoyaltyCenter(card.rank, card.suit)
      : this.renderPipPattern(card.rank, card.suit);

    return `
      <div class="card-face ${colorClass}">
        <!-- Top Horizontal Strip: Rank (left) + Suit (right) stays 100% visible when stacked! -->
        <div class="card-header-strip">
          <span class="card-rank">${card.label}</span>
          <span class="card-suit-mini">${this.getSuitSVG(card.suit, 13)}</span>
        </div>

        <!-- Center Artwork / Multi-Pip Layout -->
        <div class="card-center">
          ${centerContent}
        </div>

        <!-- Bottom Inverted Corner -->
        <div class="card-footer-strip">
          <span class="card-rank">${card.label}</span>
          <span class="card-suit-mini">${this.getSuitSVG(card.suit, 12)}</span>
        </div>
      </div>
    `;
  }
};
