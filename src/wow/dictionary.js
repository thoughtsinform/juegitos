/**
 * Words of Wonders Dictionary & Word Resolver
 */

export class WowDictionary {
  constructor() {
    this.bonusBankTarget = 5; // Every 5 bonus words awards 50 coins / 1 star
  }

  /**
   * Check if a word can be formed from the pool of available letters
   */
  canFormWord(word, availableLetters) {
    const letters = [...availableLetters.map(l => l.toUpperCase())];
    for (const char of word.toUpperCase()) {
      const idx = letters.indexOf(char);
      if (idx === -1) return false;
      letters.splice(idx, 1);
    }
    return true;
  }
}

export const wowDictionary = new WowDictionary();
