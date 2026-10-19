/**
 * Simple persistent authentication for Ellen & Susan
 */

const VALID_USERS = {
  susan: {
    username: 'Susan',
    password: 'theclown',
    displayName: 'Susan',
    color: '#8b5cf6', // Soft purple
    avatar: '🌸'
  },
  ellen: {
    username: 'Ellen',
    password: 'boom',
    displayName: 'Ellen',
    color: '#3b82f6', // Ocean blue
    avatar: '🌻'
  }
};

const STORAGE_KEY = 'juegitos_current_user';

export const Auth = {
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
      return { success: false, error: 'Please enter both username and password.' };
    }

    const key = username.trim().toLowerCase();
    const candidate = VALID_USERS[key];

    if (!candidate) {
      return { success: false, error: 'Unknown player. Are you Susan or Ellen?' };
    }

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
