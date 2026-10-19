/**
 * SVG Card Renderer
 * Generates crisp vector card graphics matching the reference screenshots:
 * - Maroon spider logo stock backs
 * - Maroon horizontal pinstripe tableau backs
 * - Etched spider foundation watermark
 * - Stylized royalty (Blue hooded Queen with flowers, sentry Jack with spear)
 */

import { SUITS, RANKS } from './engine.js';

export const CardRenderer = {
  // Suit SVG icons
  renderSuitIcon(suit, size = 16) {
    if (suit === SUITS.SPADES) {
      return `
        <svg class="suit-icon suit-spades" width="${size}" height="${size}" viewBox="0 0 100 100" fill="#1e1e1e">
          <path d="M50,10 C45,28 15,45 15,65 C15,78 26,85 38,85 C46,85 49,80 50,75 C51,80 54,85 62,85 C74,85 85,78 85,65 C85,45 55,28 50,10 Z"/>
          <path d="M46,75 L42,92 L58,92 L54,75 Z"/>
        </svg>
      `;
    } else if (suit === SUITS.HEARTS) {
      return `
        <svg class="suit-icon suit-hearts" width="${size}" height="${size}" viewBox="0 0 100 100" fill="#dc2626">
          <path d="M50,88 C50,88 12,60 12,34 C12,18 25,12 37,12 C44,12 48,16 50,20 C52,16 56,12 63,12 C75,12 88,18 88,34 C88,60 50,88 50,88 Z"/>
        </svg>
      `;
    } else if (suit === SUITS.DIAMONDS) {
      return `
        <svg class="suit-icon suit-diamonds" width="${size}" height="${size}" viewBox="0 0 100 100" fill="#dc2626">
          <polygon points="50,10 88,50 50,90 12,50"/>
        </svg>
      `;
    } else {
      // CLUBS
      return `
        <svg class="suit-icon suit-clubs" width="${size}" height="${size}" viewBox="0 0 100 100" fill="#1e1e1e">
          <circle cx="50" cy="32" r="18"/>
          <circle cx="32" cy="60" r="18"/>
          <circle cx="68" cy="60" r="18"/>
          <path d="M46,55 L42,92 L58,92 L54,55 Z"/>
        </svg>
      `;
    }
  },

  // Stock card back: Deep burgundy/maroon with white spider emblem
  renderStockBack() {
    return `
      <div class="card-back stock-card-back">
        <div class="card-back-border">
          <svg class="spider-emblem" viewBox="0 0 100 100" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round">
            <!-- Spider body -->
            <ellipse cx="50" cy="55" rx="14" ry="19" fill="#ffffff"/>
            <circle cx="50" cy="33" r="9" fill="#ffffff"/>
            <!-- Left legs -->
            <path d="M44,42 Q25,30 18,22" />
            <path d="M42,48 Q20,45 14,48" />
            <path d="M42,56 Q20,65 16,74" />
            <path d="M44,64 Q25,82 22,92" />
            <!-- Right legs -->
            <path d="M56,42 Q75,30 82,22" />
            <path d="M58,48 Q80,45 86,48" />
            <path d="M58,56 Q80,65 84,74" />
            <path d="M56,64 Q75,82 78,92" />
          </svg>
        </div>
      </div>
    `;
  },

  // Tableau card back: Deep burgundy/maroon with horizontal white pinstripes
  renderTableauBack() {
    return `
      <div class="card-back tableau-card-back">
        <div class="card-back-border pinstripe-bg"></div>
      </div>
    `;
  },

  // Foundation empty slot watermark
  renderFoundationSlot() {
    return `
      <div class="foundation-slot">
        <svg class="foundation-spider-watermark" viewBox="0 0 100 100" fill="none" stroke="rgba(255, 255, 255, 0.16)" stroke-width="3" stroke-linecap="round">
          <ellipse cx="50" cy="55" rx="14" ry="19" fill="rgba(255, 255, 255, 0.1)"/>
          <circle cx="50" cy="33" r="9" fill="rgba(255, 255, 255, 0.1)"/>
          <path d="M44,42 Q25,30 18,22" />
          <path d="M42,48 Q20,45 14,48" />
          <path d="M42,56 Q20,65 16,74" />
          <path d="M44,64 Q25,82 22,92" />
          <path d="M56,42 Q75,30 82,22" />
          <path d="M58,48 Q80,45 86,48" />
          <path d="M58,56 Q80,65 84,74" />
          <path d="M56,64 Q75,82 78,92" />
        </svg>
      </div>
    `;
  },

  // Royalty Illustration (Queen with blue hooded mantle, Jack with spear)
  renderRoyaltyArt(rank, suit) {
    const isRed = suit === SUITS.HEARTS || suit === SUITS.DIAMONDS;
    const accentColor = isRed ? '#dc2626' : '#2563eb';

    if (rank === 12) {
      // QUEEN: Crowned queen with blue cloak & roses (like screenshot)
      return `
        <div class="royalty-art queen-art">
          <svg viewBox="0 0 100 120" width="100%" height="100%">
            <!-- Gold crown -->
            <polygon points="36,25 42,32 50,22 58,32 64,25 62,38 38,38" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
            <!-- Dark Hair -->
            <circle cx="50" cy="42" r="16" fill="#332211"/>
            <!-- Face -->
            <ellipse cx="50" cy="45" rx="11" ry="13" fill="#fde68a"/>
            <!-- Eyes & smile -->
            <ellipse cx="46" cy="44" rx="1.5" ry="2" fill="#1e1e1e"/>
            <ellipse cx="54" cy="44" rx="1.5" ry="2" fill="#1e1e1e"/>
            <path d="M47,52 Q50,55 53,52" stroke="#dc2626" stroke-width="1.5" fill="none"/>
            <!-- Blue hooded mantle -->
            <path d="M30,55 C30,40 70,40 70,55 L78,110 L22,110 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
            <!-- Inner gown -->
            <path d="M44,58 L56,58 L58,110 L42,110 Z" fill="#ffffff"/>
            <!-- Flowers / Rose bouquet -->
            <circle cx="28" cy="85" r="5" fill="#f43f5e"/>
            <circle cx="72" cy="85" r="5" fill="#f43f5e"/>
            <path d="M25,88 L32,82 M68,82 L75,88" stroke="#16a34a" stroke-width="2"/>
          </svg>
        </div>
      `;
    } else if (rank === 11) {
      // JACK: Sentry with blue hat/feather & spear (like screenshot)
      return `
        <div class="royalty-art jack-art">
          <svg viewBox="0 0 100 120" width="100%" height="100%">
            <!-- Blue feathered hat -->
            <path d="M30,32 C30,22 70,22 70,32 L78,38 L22,38 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
            <path d="M68,22 Q75,10 60,8" stroke="#eab308" stroke-width="3" fill="none"/>
            <!-- Face -->
            <ellipse cx="50" cy="45" rx="12" ry="14" fill="#fde68a"/>
            <!-- Eyes & mustache -->
            <ellipse cx="46" cy="43" rx="1.5" ry="2" fill="#1e1e1e"/>
            <ellipse cx="54" cy="43" rx="1.5" ry="2" fill="#1e1e1e"/>
            <path d="M44,52 Q50,48 56,52" stroke="#78350f" stroke-width="2" fill="none"/>
            <!-- Sentry Cloak -->
            <path d="M28,55 L72,55 L80,110 L20,110 Z" fill="#1d4ed8"/>
            <path d="M45,55 L55,55 L55,110 L45,110 Z" fill="#f8fafc"/>
            <!-- Halberd/Spear -->
            <line x1="78" y1="15" x2="78" y2="115" stroke="#94a3b8" stroke-width="3"/>
            <polygon points="78,5 72,20 84,20" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
          </svg>
        </div>
      `;
    } else if (rank === 13) {
      // KING: Majestic crown & regal robe
      return `
        <div class="royalty-art king-art">
          <svg viewBox="0 0 100 120" width="100%" height="100%">
            <!-- High Gold Crown -->
            <polygon points="30,20 40,28 50,15 60,28 70,20 68,36 32,36" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
            <circle cx="50" cy="15" r="2.5" fill="#ef4444"/>
            <!-- Face & Beard -->
            <ellipse cx="50" cy="46" rx="12" ry="14" fill="#fde68a"/>
            <path d="M40,50 Q50,68 60,50 Z" fill="#cbd5e1"/>
            <ellipse cx="46" cy="43" rx="1.5" ry="2" fill="#1e1e1e"/>
            <ellipse cx="54" cy="43" rx="1.5" ry="2" fill="#1e1e1e"/>
            <!-- Royal mantle -->
            <path d="M24,56 L76,56 L84,110 L16,110 Z" fill="#7e22ce" stroke="#581c87" stroke-width="2"/>
            <path d="M42,56 L58,56 L60,110 L40,110 Z" fill="#f8fafc"/>
            <!-- Gold scepter -->
            <line x1="22" y1="30" x2="22" y2="105" stroke="#eab308" stroke-width="3"/>
            <circle cx="22" cy="28" r="4" fill="#ef4444"/>
          </svg>
        </div>
      `;
    }
    return '';
  },

  // Full face-up card HTML
  renderFaceUpCard(card) {
    const isRed = card.suit === SUITS.HEARTS || card.suit === SUITS.DIAMONDS;
    const rankStr = RANKS[card.rank];
    const isRoyalty = card.rank >= 11;

    return `
      <div class="card-face ${isRed ? 'card-red' : 'card-black'} ${isRoyalty ? 'card-royalty' : ''}">
        <div class="card-corner corner-top-left">
          <span class="card-rank">${rankStr}</span>
          ${this.renderSuitIcon(card.suit, 14)}
        </div>

        <div class="card-center">
          ${isRoyalty 
            ? this.renderRoyaltyArt(card.rank, card.suit)
            : this.renderSuitIcon(card.suit, 32)}
        </div>

        <div class="card-corner corner-bottom-right">
          <span class="card-rank">${rankStr}</span>
          ${this.renderSuitIcon(card.suit, 14)}
        </div>
      </div>
    `;
  },

  // Render a card DOM element
  createCardElement(card, colIdx, cardIdx) {
    const el = document.createElement('div');
    el.className = `solitaire-card ${card.faceUp ? 'is-face-up' : 'is-face-down'}`;
    el.dataset.id = card.id;
    el.dataset.col = colIdx;
    el.dataset.index = cardIdx;
    el.dataset.suit = card.suit;
    el.dataset.rank = card.rank;

    el.innerHTML = card.faceUp 
      ? this.renderFaceUpCard(card)
      : this.renderTableauBack();

    return el;
  }
};
