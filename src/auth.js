/**
 * Persistent authentication & custom 3D avatars for Juegitos Arcade
 * Approved Players: Daniel, Rebekkah, Susan, Steph, Trey, Ellen
 */

export const VALID_USERS = {
  ellen: {
    id: 'ellen',
    username: 'Ellen',
    password: 'boom',
    displayName: 'Ellen',
    color: '#3b82f6', // Ocean blue
    avatar: 'assets/avatars/ellen.png',
    role: 'Mom & Champion'
  },
  susan: {
    id: 'susan',
    username: 'Susan',
    password: 'theclown',
    displayName: 'Susan',
    color: '#8b5cf6', // Soft purple
    avatar: 'assets/avatars/susan.png',
    role: 'Arcade Star'
  },
  daniel: {
    id: 'daniel',
    username: 'Daniel',
    password: 'daniel',
    displayName: 'Daniel',
    color: '#10b981', // Emerald green
    avatar: 'assets/avatars/daniel.png',
    role: 'Creator & Builder'
  },
  rebekkah: {
    id: 'rebekkah',
    username: 'Rebekkah',
    password: 'rebekkah',
    displayName: 'Rebekkah',
    color: '#ec4899', // Rose pink
    avatar: 'assets/avatars/rebekkah.png',
    role: 'Puzzle Master'
  },
  steph: {
    id: 'steph',
    username: 'Steph',
    password: 'steph',
    displayName: 'Steph',
    color: '#06b6d4', // Cyan
    avatar: 'assets/avatars/steph.png',
    role: 'Solitaire Ace'
  },
  trey: {
    id: 'trey',
    username: 'Trey',
    password: 'trey',
    displayName: 'Trey',
    color: '#f59e0b', // Amber
    avatar: 'assets/avatars/trey.png',
    role: 'Game Strategist'
  }
};

const STORAGE_KEY = 'juegitos_current_user';

export const Auth = {
  /**
   * List all approved arcade players
   */
  getAllUsers() {
    return Object.values(VALID_USERS);
  },

  /**
   * Get currently logged-in user, or null if logged out.
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VALID_USERS[stored.toLowerCase()]) {
        return VALID_USERS[stored.toLowerCase()];
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return null;
  },

  /**
   * Authenticate with username and password.
   * Returns { success: boolean, user?: object, error?: string }
   */
  login(username, password) {
    if (!username || !password) {
      return { success: false, error: 'Please select a player or enter username and password.' };
    }

    const key = username.trim().toLowerCase();
    const candidate = VALID_USERS[key];

    if (!candidate) {
      return { success: false, error: 'Unknown player. Please choose one of the approved family players.' };
    }

    // Check password
    if (candidate.password !== password.trim()) {
      return { success: false, error: 'Incorrect password. Try again!' };
    }

    // Persist login state
    try {
      localStorage.setItem(STORAGE_KEY, candidate.username);
    } catch (e) {
      console.warn('Storage write failed', e);
    }

    return { success: true, user: candidate };
  },

  /**
   * Fast 1-tap select and log in as approved player
   */
  loginAs(username) {
    const key = (username || '').trim().toLowerCase();
    const candidate = VALID_USERS[key];
    if (candidate) {
      return this.login(candidate.username, candidate.password);
    }
    return { success: false, error: 'Player not found.' };
  },

  /**
   * Log out and clear saved user.
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Storage clear failed', e);
    }
  }
};
