/**
 * Walking Step Counter & Goal Countdown
 * Uses HTML5 DeviceMotionEvent accelerometer + low-pass filter + peak detection.
 * Persists session steps, goals, and automatic tracking permissions.
 */

import { sound } from './sound.js';

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

  /**
   * Automatic permission & auto-start tracking
   * Persists permission state and attaches listener on first user touch if required by iOS.
   */
  initAutoTracking() {
    const isGranted = localStorage.getItem('juegitos_motion_permission') === 'granted';

    // If DeviceMotionEvent exists without iOS permission API (Android, Chrome, desktop)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission !== 'function') {
      this.startListening();
      return;
    }

    // On iOS: if already granted in this session/origin, start listening
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
        } else {
          console.warn('Device motion permission denied');
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

    // High-pass filter to remove constant 1g gravity and low-pass to smooth noise
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

    // Check goal countdown
    if (this.steps >= this.goal && !this.goalCelebrated) {
      this.goalCelebrated = true;
      sound.playStepGoalMet();
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

  resetSession() {
    this.steps = 0;
    this.goalCelebrated = false;
    this.saveState();
    this.updateDisplay();
  }

  triggerGoalCelebration() {
    const banner = this.container?.querySelector('.step-counter-bar');
    if (banner) {
      banner.classList.add('goal-reached');
      setTimeout(() => banner.classList.remove('goal-reached'), 3000);
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="step-counter-bar" id="stepCounterBar">
        <div class="step-deck">
          <!-- 1. Live Steps & Remaining -->
          <div class="step-card card-steps">
            <span class="card-icon">👟</span>
            <div class="card-content">
              <div class="card-head">
                <span class="card-val" id="stepLiveVal">${this.steps.toLocaleString()}</span>
                <span class="card-label">STEPS</span>
              </div>
              <div class="card-sub" id="stepCountdownText"></div>
            </div>
          </div>

          <!-- 2. Goal Target (Tap to Edit) -->
          <button type="button" class="step-card card-goal" id="editGoalBtn" title="Set daily step goal">
            <span class="card-icon">🎯</span>
            <div class="card-content">
              <div class="card-head">
                <span class="card-val" id="stepGoalVal">${this.goal.toLocaleString()}</span>
                <span class="card-label">GOAL</span>
              </div>
              <div class="card-sub">Tap to edit</div>
            </div>
          </button>

          <!-- 3. Sensor State (Auto-tracking status / Pause) -->
          <button type="button" class="step-card card-status ${this.isListening ? 'is-tracking' : ''}" id="toggleSensorBtn" title="Start/Pause automatic pedometer">
            <span class="card-icon status-dot" id="statusDot">${this.isListening ? '🟢' : '⏸️'}</span>
            <div class="card-content">
              <div class="card-head">
                <span class="card-val" id="statusText">${this.isListening ? 'ACTIVE' : 'PAUSED'}</span>
                <span class="card-label">PEDO</span>
              </div>
              <div class="card-sub" id="statusSub">${this.isListening ? 'Auto-tracking' : 'Tap to start'}</div>
            </div>
          </button>

          <!-- 4. Quick Manual Add (+100) -->
          <button type="button" class="step-card card-add" id="manualAddBtn" title="Add 100 steps manually">
            <span class="card-icon">➕</span>
            <div class="card-content">
              <div class="card-head">
                <span class="card-val">+100</span>
                <span class="card-label">ADD</span>
              </div>
              <div class="card-sub">Steps</div>
            </div>
          </button>
        </div>

        <!-- Sleek progress track along bottom edge -->
        <div class="step-banner-progress-track">
          <div class="step-banner-progress-fill" id="stepProgressBar"></div>
        </div>
      </div>
    `;

    // Wire events
    const toggleBtn = this.container.querySelector('#toggleSensorBtn');
    toggleBtn?.addEventListener('click', () => {
      this.toggleTracking();
    });

    const editGoalBtn = this.container.querySelector('#editGoalBtn');
    editGoalBtn?.addEventListener('click', () => {
      const input = prompt(`Set your walking step goal for ${this.user}:`, this.goal);
      if (input !== null) {
        this.setGoal(input);
      }
    });

    const manualAddBtn = this.container.querySelector('#manualAddBtn');
    manualAddBtn?.addEventListener('click', () => {
      sound.playCardSlide();
      this.addSteps(100);
    });

    this.updateDisplay();
  }

  updateDisplay() {
    const liveVal = this.container?.querySelector('#stepLiveVal');
    const countdownText = this.container?.querySelector('#stepCountdownText');
    const goalVal = this.container?.querySelector('#stepGoalVal');
    const progressBar = this.container?.querySelector('#stepProgressBar');
    const statusCard = this.container?.querySelector('.card-status');
    const statusDot = this.container?.querySelector('#statusDot');
    const statusText = this.container?.querySelector('#statusText');
    const statusSub = this.container?.querySelector('#statusSub');

    if (liveVal) {
      liveVal.textContent = this.steps.toLocaleString();
    }

    if (goalVal) {
      goalVal.textContent = this.goal.toLocaleString();
    }

    const remaining = Math.max(0, this.goal - this.steps);
    const pct = Math.min(100, Math.round((this.steps / this.goal) * 100));

    if (countdownText) {
      if (remaining === 0) {
        countdownText.innerHTML = `<span class="goal-met-badge">🎉 Goal Met! (${pct}%)</span>`;
      } else {
        countdownText.innerHTML = `<span class="countdown-num">${remaining.toLocaleString()}</span> left (${pct}%)`;
      }
    }

    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    if (statusCard) {
      statusCard.classList.toggle('is-tracking', this.isListening);
    }

    if (statusDot) {
      statusDot.textContent = this.isListening ? '🟢' : '⏸️';
    }

    if (statusText) {
      statusText.textContent = this.isListening ? 'ACTIVE' : 'PAUSED';
    }

    if (statusSub) {
      statusSub.textContent = this.isListening ? 'Auto-tracking' : 'Tap to start';
    }
  }
}
