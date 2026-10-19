/**
 * Walking Step Counter & Goal Countdown
 * Uses HTML5 DeviceMotionEvent accelerometer + low-pass filter + peak detection.
 * Persists session steps, goals, and automatic tracking permissions.
 */

import { sound } from './sound.js';
import { Icons } from './icons.js';

export class StepCounter {
  constructor(options = {}) {
    this.user = options.user || 'Ellen';
    this.container = options.container;
    
    // Load persisted state
    this.goal = this.loadStoredGoal();
    this.steps = this.loadStoredSteps();
    this.isListening = false;
    this.goalCelebrated = false;

    // Accelerometer filter state
    this.lastAccMag = 9.8;
    this.filteredMag = 9.8;
    this.lastStepTime = 0;
    this.threshold = 1.35; // Acceleration spike above gravity to trigger step
    this.minStepInterval = 280; // Minimum ms between human walking steps

    this.onMotion = this.onMotion.bind(this);
    this.render();
    this.initAutoTracking();
  }

  setUser(user) {
    this.user = user;
    this.goal = this.loadStoredGoal();
    this.steps = this.loadStoredSteps();
    this.goalCelebrated = false;
    this.updateDisplay();
  }

  loadStoredGoal() {
    try {
      const g = localStorage.getItem(`juegitos_step_goal_${this.user}`);
      return g ? parseInt(g, 10) : 3000;
    } catch (e) {
      return 3000;
    }
  }

  loadStoredSteps() {
    try {
      const s = localStorage.getItem(`juegitos_step_count_${this.user}`);
      return s ? parseInt(s, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  saveState() {
    try {
      localStorage.setItem(`juegitos_step_goal_${this.user}`, this.goal.toString());
      localStorage.setItem(`juegitos_step_count_${this.user}`, this.steps.toString());
    } catch (e) {
      console.warn('Could not persist steps', e);
    }
  }

  triggerHaptic(type = 'light') {
    if ('vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(12);
        else if (type === 'medium') navigator.vibrate([18, 30, 18]);
        else if (type === 'celebrate') navigator.vibrate([50, 80, 50, 80, 150]);
      } catch (e) {}
    }
  }

  /**
   * Automatic permission & auto-start tracking
   */
  initAutoTracking() {
    const isGranted = localStorage.getItem('juegitos_motion_permission') === 'granted';

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission !== 'function') {
      this.startListening();
      return;
    }

    if (isGranted) {
      this.startListening();
    }

    // Attach silent, automatic user gesture listener for iOS
    const onUserInteraction = async () => {
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('click', onUserInteraction);
      await this.requestAndStart();
    };

    window.addEventListener('pointerdown', onUserInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true });
    window.addEventListener('click', onUserInteraction, { once: true, passive: true });
  }

  async requestAndStart() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          localStorage.setItem('juegitos_motion_permission', 'granted');
          this.startListening();
          return true;
        }
      } catch (err) {
        console.warn('Error requesting device motion permission:', err);
      }
    } else {
      this.startListening();
      return true;
    }
    return false;
  }

  startListening() {
    if (!this.isListening && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.onMotion, { passive: true });
      this.isListening = true;
      this.updateDisplay();
    }
  }

  stopListening() {
    if (this.isListening) {
      window.removeEventListener('devicemotion', this.onMotion);
      this.isListening = false;
      this.updateDisplay();
    }
  }

  toggleTracking() {
    this.triggerHaptic('light');
    if (this.isListening) {
      this.stopListening();
    } else {
      this.requestAndStart();
    }
  }

  onMotion(event) {
    const acc = event.accelerationIncludingGravity || event.acceleration;
    if (!acc || acc.x === null) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;

    const rawMag = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    const alpha = 0.8;
    this.filteredMag = alpha * this.filteredMag + (1 - alpha) * rawMag;
    const delta = Math.abs(rawMag - this.filteredMag);

    if (delta > this.threshold && (now - this.lastStepTime) > this.minStepInterval) {
      this.lastStepTime = now;
      this.addSteps(1);
    }
  }

  addSteps(count = 1) {
    this.steps += count;
    this.saveState();
    this.updateDisplay();

    if (this.steps >= this.goal && !this.goalCelebrated) {
      this.goalCelebrated = true;
      sound.playStepGoalMet();
      this.triggerHaptic('celebrate');
      this.triggerGoalCelebration();
    }
  }

  setGoal(newGoal) {
    const val = parseInt(newGoal, 10);
    if (!isNaN(val) && val > 0) {
      this.goal = val;
      this.goalCelebrated = this.steps >= this.goal;
      this.saveState();
      this.updateDisplay();
    }
  }

  triggerGoalCelebration() {
    const banner = this.container?.querySelector('.step-counter-bar');
    if (banner) {
      banner.classList.add('goal-reached');
      setTimeout(() => banner.classList.remove('goal-reached'), 3000);
    }
  }

  spawnFloatingBadge(x, y, text = '+100 Steps!') {
    const badge = document.createElement('div');
    badge.className = 'floating-step-badge';
    badge.textContent = text;
    badge.style.left = `${x - 40}px`;
    badge.style.top = `${y - 15}px`;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 850);
  }

  openGoalSheet() {
    this.triggerHaptic('light');
    let tempGoal = this.goal;

    const overlay = document.createElement('div');
    overlay.className = 'goal-modal-overlay';
    overlay.innerHTML = `
      <div class="goal-modal-sheet">
        <div class="goal-sheet-header">
          <span class="goal-sheet-title">${Icons.target('sheet-target-icon', 20)} Set Walking Step Goal</span>
          <button class="goal-sheet-close" id="goalSheetCloseBtn" aria-label="Close">${Icons.close('', 16)}</button>
        </div>

        <div class="goal-chips-grid">
          <button class="goal-chip ${tempGoal === 1000 ? 'active' : ''}" data-val="1000">1,000</button>
          <button class="goal-chip ${tempGoal === 3000 ? 'active' : ''}" data-val="3000">3,000</button>
          <button class="goal-chip ${tempGoal === 5000 ? 'active' : ''}" data-val="5000">5,000</button>
          <button class="goal-chip ${tempGoal === 10000 ? 'active' : ''}" data-val="10000">10,000</button>
        </div>

        <div class="goal-stepper">
          <button class="stepper-btn" id="stepperMinusBtn">−</button>
          <span class="stepper-val" id="stepperValText">${tempGoal.toLocaleString()}</span>
          <button class="stepper-btn" id="stepperPlusBtn">+</button>
        </div>

        <button class="goal-save-btn" id="goalSaveBtn">Set Goal</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const valText = overlay.querySelector('#stepperValText');
    const chips = overlay.querySelectorAll('.goal-chip');

    const updateModalDisplay = () => {
      if (valText) valText.textContent = tempGoal.toLocaleString();
      chips.forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.val, 10) === tempGoal);
      });
    };

    chips.forEach(c => {
      c.addEventListener('click', () => {
        this.triggerHaptic('light');
        tempGoal = parseInt(c.dataset.val, 10);
        updateModalDisplay();
      });
    });

    overlay.querySelector('#stepperMinusBtn')?.addEventListener('click', () => {
      this.triggerHaptic('light');
      tempGoal = Math.max(500, tempGoal - 500);
      updateModalDisplay();
    });

    overlay.querySelector('#stepperPlusBtn')?.addEventListener('click', () => {
      this.triggerHaptic('light');
      tempGoal = Math.min(50000, tempGoal + 500);
      updateModalDisplay();
    });

    const closeModal = () => {
      overlay.remove();
    };

    overlay.querySelector('#goalSheetCloseBtn')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    overlay.querySelector('#goalSaveBtn')?.addEventListener('click', () => {
      this.triggerHaptic('medium');
      this.setGoal(tempGoal);
      closeModal();
    });
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="step-counter-bar" id="stepCounterBar">
        <div class="step-dock-v2">
          <!-- Left Hero Card: Live Steps + Remaining + Progress -->
          <button type="button" class="dock-hero-card" id="stepGoalTrigger" aria-label="Step progress. Tap to adjust goal">
            <div class="dock-icon-ring">
              <span class="dock-emoji">👟</span>
            </div>
            <div class="dock-hero-data">
              <div class="dock-val-row">
                <span class="dock-val" id="stepLiveVal">${this.steps.toLocaleString()}</span>
                <span class="dock-unit">STEPS</span>
              </div>
              <div class="dock-sub" id="stepCountdownText"></div>
            </div>
            <span class="dock-chevron-indicator">🎯</span>
          </button>

          <!-- Right Action Cluster: 44px minimum touch targets -->
          <div class="dock-actions">
            <!-- Manual +100 Quick Add with Floating Particle -->
            <button type="button" class="dock-pill-btn add-btn" id="manualAddBtn" aria-label="Add 100 steps">
              <span class="pill-icon">➕</span>
              <span class="pill-text">100</span>
            </button>

            <!-- Sensor State Toggle -->
            <button type="button" class="dock-pill-btn sensor-btn ${this.isListening ? 'is-active' : ''}" id="toggleSensorBtn" aria-label="Toggle motion tracking">
              <span class="status-pulse-dot" id="statusDot"></span>
              <span class="pill-text" id="statusText">${this.isListening ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        <!-- Sleek Global Progress Bar along bottom edge of banner -->
        <div class="step-banner-progress-track">
          <div class="step-banner-progress-fill" id="stepProgressBar"></div>
        </div>
      </div>
    `;

    // Wire Goal Sheet trigger
    this.container.querySelector('#stepGoalTrigger')?.addEventListener('click', () => {
      this.openGoalSheet();
    });

    // Wire Sensor toggle
    this.container.querySelector('#toggleSensorBtn')?.addEventListener('click', () => {
      this.toggleTracking();
    });

    // Wire Manual Add with floating particle
    const manualBtn = this.container.querySelector('#manualAddBtn');
    manualBtn?.addEventListener('click', (e) => {
      sound.playCardSlide();
      this.triggerHaptic('light');
      const rect = manualBtn.getBoundingClientRect();
      this.spawnFloatingBadge(rect.left + rect.width / 2, rect.top, '+100 Steps!');
      this.addSteps(100);
    });

    this.updateDisplay();
  }

  updateDisplay() {
    const liveVal = this.container?.querySelector('#stepLiveVal');
    const countdownText = this.container?.querySelector('#stepCountdownText');
    const progressBar = this.container?.querySelector('#stepProgressBar');
    const sensorBtn = this.container?.querySelector('.sensor-btn');
    const statusText = this.container?.querySelector('#statusText');

    if (liveVal) {
      liveVal.textContent = this.steps.toLocaleString();
    }

    const remaining = Math.max(0, this.goal - this.steps);
    const pct = Math.min(100, Math.round((this.steps / this.goal) * 100));

    if (countdownText) {
      if (remaining === 0) {
        countdownText.innerHTML = `<span class="goal-met-badge">🎉 Goal Met! (${pct}%)</span>`;
      } else {
        countdownText.innerHTML = `<span class="countdown-num">${remaining.toLocaleString()}</span> left (${pct}%) • Goal: ${this.goal.toLocaleString()}`;
      }
    }

    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    if (sensorBtn) {
      sensorBtn.classList.toggle('is-active', this.isListening);
    }

    if (statusText) {
      statusText.textContent = this.isListening ? 'ON' : 'OFF';
    }
  }
}
