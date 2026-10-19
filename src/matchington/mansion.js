/**
 * Matchington Mansion Renovation Meta-Game
 * Provides interactive room renovation choices (Grand Foyer, Sunny Conservatory)
 * where players spend stars/keys earned from Match-3 levels to design their mansion.
 */

export const MANSION_ROOMS = [
  {
    id: 'foyer',
    name: 'The Grand Foyer',
    theme: 'Victorian Opulence',
    description: 'Restore the sweeping entry hall, chandelier, hearth, and plush armchairs.',
    tasks: [
      {
        id: 'foyer_rug',
        name: 'Staircase Runner Rug',
        cost: 1, // 1 star / key
        choices: [
          { id: 'crimson', name: 'Royal Crimson', desc: 'Scarlet velvet with gold baroque border', color: '#dc2626' },
          { id: 'indigo', name: 'Midnight Indigo', desc: 'Deep navy silk with silver filigree', color: '#1e3a8a' },
          { id: 'emerald', name: 'Palace Emerald', desc: 'Rich emerald green with champagne fringe', color: '#065f46' }
        ]
      },
      {
        id: 'foyer_chandelier',
        name: 'Crystal Chandelier',
        cost: 1,
        choices: [
          { id: 'brass', name: 'Antique Brass & Amber Glass', desc: 'Warm glowing vintage Victorian fixture', color: '#d97706' },
          { id: 'crystal', name: 'Cascading Austrian Crystal', desc: 'Glittering multi-tiered diamond cut prisms', color: '#38bdf8' },
          { id: 'artdeco', name: 'Gilded Art Deco Radiance', desc: 'Bold geometric golden sunburst glass', color: '#eab308' }
        ]
      },
      {
        id: 'foyer_armchair',
        name: 'Lounge Armchair',
        cost: 1,
        choices: [
          { id: 'tufted_ruby', name: 'Tufted Ruby Velvet', desc: 'Deep diamond-tufted back with mahogany legs', color: '#991b1b' },
          { id: 'caramel_leather', name: 'Aged Caramel Leather', desc: 'Buttery soft brass-tacked club armchair', color: '#92400e' },
          { id: 'cobalt_damask', name: 'Cobalt Blue Damask', desc: 'Ornate French woven silk with scrollwork', color: '#1e40af' }
        ]
      },
      {
        id: 'foyer_hearth',
        name: 'Grand Fireplace Hearth',
        cost: 1,
        choices: [
          { id: 'white_marble', name: 'Carrara White Marble', desc: 'Classic sculpted Italian marble mantel', color: '#f8fafc' },
          { id: 'river_stone', name: 'Rustic Fieldstone', desc: 'Earthy hand-cut warm stone fireplace', color: '#78716c' },
          { id: 'carved_oak', name: 'Carved English Oak', desc: 'Intricately carved dark wood mantelpiece', color: '#451a03' }
        ]
      }
    ]
  },
  {
    id: 'conservatory',
    name: 'The Sunny Conservatory',
    theme: 'Sunlit Glasshouse Sanctuary',
    description: 'Transform the glass atrium into a lush green haven with wicker seating and botanicals.',
    tasks: [
      {
        id: 'conservatory_table',
        name: 'Garden Table & Chairs',
        cost: 1,
        choices: [
          { id: 'wrought_iron', name: 'Cream Wrought Iron', desc: 'Delicate lace-pattern patio bistro set', color: '#f1f5f9' },
          { id: 'teak_wood', name: 'Natural Teak Wood', desc: 'Weathered golden teak round table', color: '#b45309' },
          { id: 'verdigris', name: 'Verdigris Patina Copper', desc: 'Antique weathered green bronze finish', color: '#047857' }
        ]
      },
      {
        id: 'conservatory_planters',
        name: 'Hanging Botanical Planters',
        cost: 1,
        choices: [
          { id: 'boston_ferns', name: 'Cascading Boston Ferns', desc: 'Lush overflowing emerald foliage', color: '#16a34a' },
          { id: 'white_orchids', name: 'White Phalaenopsis Orchids', desc: 'Graceful architectural flowering blooms', color: '#ec4899' },
          { id: 'hanging_eucalyptus', name: 'Silver Dollar Eucalyptus', desc: 'Aromatic silver-blue leafy boughs', color: '#06b6d4' }
        ]
      },
      {
        id: 'conservatory_daybed',
        name: 'Rattan Daybed',
        cost: 1,
        choices: [
          { id: 'linen_sand', name: 'Natural Sand Linen', desc: 'Soft neutral cushions with rattan frame', color: '#d97706' },
          { id: 'coastal_sage', name: 'Sage Green Breezes', desc: 'Cool botanical leaf print pillows', color: '#15803d' },
          { id: 'sunset_coral', name: 'Warm Terracotta Coral', desc: 'Vibrant Mediterranean woven canvas', color: '#ea580c' }
        ]
      }
    ]
  }
];
