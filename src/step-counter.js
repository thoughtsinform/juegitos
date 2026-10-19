/**
 * Walking Step Counter & Goal Countdown
 * Uses HTML5 DeviceMotionEvent accelerometer + low-pass filter + peak detection.
 * Persists session steps and user-customized goals.
 */

import { sound } from './sound.js';

export class StepCounter {
  constructor(options = {}) {
    this.user = options.user || 'Ellen';
    this.container = options.container;
    
    // Load persisted state
    this.goal = this.loadStoredGoal();
    this.steps = this.loadStoredSteps();
    this.isActive = false;
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

  async startTracking() {
    // iOS 13+ requires explicit user gesture to allow DeviceMotionEvent
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response !== 'granted') {
          console.warn('Device motion permission denied');
          return false;
        }
      } catch (err) {
        console.warn('Error requesting device motion permission:', err);
      }
    }

    if (!this.isListening && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.onMotion, { passive: true });
      this.isListening = true;
      this.isActive = true;
      this.updateDisplay();
      return true;
    }
    return false;
  }

  stopTracking() {
    if (this.isListening) {
      window.removeEventListener('devicemotion', this.onMotion);
      this.isListening = false;
      this.updateDisplay();
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
        <div class="step-main-pill" id="stepPill">
          <span class="step-icon">👟</span>
          <div class="step-data">
            <span class="step-live" id="stepLiveText"><b>${this.steps.toLocaleString()}</b> steps</span>
            <span class="step-countdown" id="stepCountdownText"></span>
          </div>
          <div class="step-progress-track">
            <div class="step-progress-fill" id="stepProgressBar"></div>
          </div>
        </div>

        <div class="step-actions">
          <button class="step-btn edit-goal-btn" id="editGoalBtn" title="Change Step Goal">🎯 Goal: ${this.goal.toLocaleString()}</button>
          <button class="step-btn toggle-sensor-btn ${this.isListening ? 'active' : ''}" id="toggleSensorBtn" title="Start/Pause Pedometer">
            ${this.isListening ? '⏸️ Walking' : '▶️ Walk'}
          </button>
          <button class="step-btn manual-add-btn" id="manualAddBtn" title="Add 100 steps manually">+100</button>
        </div>
      </div>
    `;

    // Wire listeners
    const toggleBtn = this.container.querySelector('#toggleSensorBtn');
    toggleBtn?.addEventListener('click', () => {
      if (this.isListening) {
        this.stopTracking();
      } else {
        this.startTracking();
      }
    });

    const editGoalBtn = this.container.querySelector('#editGoalBtn');
    editGoalBtn?.addEventListener('click', () => {
      const input = prompt(`Set your daily walking step goal for ${this.user}:`, this.goal);
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
    const liveText = this.container?.querySelector('#stepLiveText');
    const countdownText = this.container?.querySelector('#stepCountdownText');
    const progressBar = this.container?.querySelector('#stepProgressBar');
    const toggleBtn = this.container?.querySelector('#toggleSensorBtn');
    const editGoalBtn = this.container?.querySelector('#editGoalBtn');

    if (liveText) {
      liveText.innerHTML = `<b>${this.steps.toLocaleString()}</b> steps`;
    }

    const remaining = Math.max(0, this.goal - this.steps);
    const pct = Math.min(100, Math.round((this.steps / this.goal) * 100));

    if (countdownText) {
      if (remaining === 0) {
        countdownText.innerHTML = `<span class="goal-met-badge">🎉 Goal Met! (${pct}%)</span>`;
      } else {
        countdownText.innerHTML = `<span class="countdown-num">${remaining.toLocaleString()}</span> to goal (${pct}%)`;
      }
    }

    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    if (toggleBtn) {
      toggleBtn.innerHTML = this.isListening ? '⏸️ Walking' : '▶️ Walk';
      toggleBtn.classList.toggle('active', this.isListening);
    }

    if (editGoalBtn) {
      editGoalBtn.innerHTML = `🎯 Goal: ${this.goal.toLocaleString()}`;
    }
  }
}
