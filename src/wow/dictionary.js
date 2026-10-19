/**
 * Words of Wonders (WoW) - Dictionary & Anagram Validator
 * Validates genuine English dictionary words and rejects nonsense letter combinations.
 */

// Curated verified English dictionary of valid words formed by our puzzle levels
const VALID_ENGLISH_WORDS = new Set([
  // 2-Letter Valid Words
  'AT', 'AS', 'SO', 'IS', 'HE', 'WE', 'OR', 'OF', 'IF', 'IN', 'ON', 'NO', 'TO', 'GO', 'DO', 'ME', 'MY', 'UP', 'US', 'BY', 'AM', 'AN',

  // 3-Letter Valid Words
  'ACT', 'CAT', 'ART', 'RAT', 'TAR', 'SAT', 'LAP', 'PAY', 'LAY', 'PAL', 'PLY', 'ELS',
  'MIL', 'LIE', 'HAT', 'EAR', 'TEA', 'EAT', 'ARE', 'THE', 'ASK', 'RAP', 'SAP', 'SPA',
  'ARK', 'LOW', 'ROW', 'FEW', 'OWL', 'ORE', 'FOR', 'FOE',

  // 4-Letter Valid Words
  'STAR', 'RATS', 'TARS', 'PLAY', 'LOSE', 'SOLE', 'MILE', 'LIME', 'SLIM', 'LIES',
  'ELMS', 'HEAT', 'RATE', 'TEAR', 'HATE', 'HEAR', 'PARK', 'SPAR', 'RAPS', 'PARKS',
  'FLOW', 'WOLF', 'ROLE', 'FORE', 'LORE',

  // 5-Letter Valid Words
  'SMILE', 'HEART', 'EARTH', 'SPARK', 'PARKS',

  // 6-Letter Valid Words
  'FLOWER'
]);

export class WowDictionary {
  /**
   * Check if a word is a legitimate English word
   */
  isValidEnglishWord(word) {
    if (!word || typeof word !== 'string') return false;
    const clean = word.trim().toUpperCase();
    return VALID_ENGLISH_WORDS.has(clean);
  }

  /**
   * Check if word can be formed from available letters (multiset check)
   */
  canFormWord(word, availableLetters) {
    if (!word || !availableLetters) return false;
    const letters = [...availableLetters.map(l => l.toUpperCase())];
    for (const char of word.toUpperCase()) {
      const idx = letters.indexOf(char);
      if (idx === -1) return false;
      letters.splice(idx, 1);
    }
    return true;
  }

  /**
   * Check if candidate word is a valid bonus word for a given level:
   * 1. Can be formed from wheel letters.
   * 2. Is in the English dictionary (or explicitly in level bonus list).
   * 3. Is NOT already one of the level's crossword puzzle words.
   */
  isValidBonusWord(word, level) {
    const upper = (word || '').trim().toUpperCase();
    if (!upper || upper.length < 2) return false;

    // Check if it's already a crossword word
    const isCrossword = level.words.some(w => w.word.toUpperCase() === upper);
    if (isCrossword) return false;

    // Must be formable from letters
    if (!this.canFormWord(upper, level.letters)) return false;

    // Must be in verified English dictionary OR explicit level bonus words
    const inLevelBonus = (level.bonusWords || []).map(b => b.toUpperCase()).includes(upper);
    const inDict = this.isValidEnglishWord(upper);

    return inLevelBonus || inDict;
  }
}

export const wowDictionary = new WowDictionary();
