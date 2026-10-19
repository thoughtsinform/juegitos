/**
 * Non-blocking Tactile Toast Notification System for Jueguitos Arcade
 * Replaces all intrusive browser alert() calls with studio-grade animated banners.
 */

import { Icons } from './icons.js';
import { sound } from './sound.js';

let activeToastTimeout = null;

export function showToast(message, type = 'info', duration = 2600) {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('jueguitosToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'jueguitosToastContainer';
    container.className = 'jg-toast-container';
    document.body.appendChild(container);
  }

  if (activeToastTimeout) {
    clearTimeout(activeToastTimeout);
    activeToastTimeout = null;
  }

  let iconHTML = Icons.lightbulb('toast-svg', 18);
  if (type === 'warning' || type === 'error') {
    iconHTML = Icons.target('toast-svg', 18);
    sound.vibrate([20, 30, 20]);
  } else if (type === 'success') {
    iconHTML = Icons.awardStar('toast-svg', 18);
  } else if (type === 'shuffle') {
    iconHTML = Icons.shuffle('toast-svg', 18);
  }

  container.innerHTML = `
    <div class="jg-toast-pill is-${type}">
      <span class="jg-toast-icon">${iconHTML}</span>
      <span class="jg-toast-text">${message}</span>
    </div>
  `;

  const pill = container.querySelector('.jg-toast-pill');
  requestAnimationFrame(() => {
    pill?.classList.add('is-visible');
  });

  activeToastTimeout = setTimeout(() => {
    pill?.classList.remove('is-visible');
    setTimeout(() => {
      if (container) container.innerHTML = '';
    }, 250);
  }, duration);
}
