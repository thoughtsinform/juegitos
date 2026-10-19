/**
 * Walking Step Counter & Pedometer Module
 * Designed for Ellen & Susan to track walking steps while playing Jueguitos.
 * Uses pure SVG iconography (zero emojis) and integrates with the active game theme.
 */

import { sound } from './sound.js';
import { Icons } from './icons.js';

export class StepCounter {
  constructor(options = {}) {
    this.user = options.user || 'Ellen';
    this.container = options.container;
    this.steps = 0;
    this.goal = 5000;
    this.goalCelebratedToday = false;
    this.sensorActive = false;
    this.permissionState = 'unknown'; // 'unknown' | 'granted' | 'denied' | 'unsupported'

    // Off by default unless explicitly enabled in the menu
    this.enabled = this.loadEnabledPref();

    // Pedometer DSP state
    this.lastStepTime = 0;
    this.stepCooldownMs = 330; // Max ~3 steps/sec (prevents shake spam)
    this.accelThreshold = 11.6; // Magnitude peak threshold (Earth gravity ~9.8 m/s^2)
    this.inPeak = false;
    this.smoothMag = 9.8;

    this.handleMotion = this.handleMotion.bind(this);
    this.loadState();
    this.render();
    this.applyVisibility();
    if (this.enabled) {
      this.autoStartMotionIfPossible();
    }
  }

  getEnabledPrefKey() {
    return 'jueguitos_steps_enabled';
  }

  loadEnabledPref() {
    try {
      return localStorage.getItem(this.getEnabledPrefKey()) === 'true';
    } catch (e) {
      return false;
    }
  }

  isEnabled() {
    return !!this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    try {
      localStorage.setItem(this.getEnabledPrefKey(), this.enabled ? 'true' : 'false');
    } catch (e) {}
    this.applyVisibility();
    if (this.enabled) {
      this.requestAndStart();
    } else {
      this.stopMotionListener();
    }
    return this.enabled;
  }

  toggleEnabled() {
    return this.setEnabled(!this.enabled);
  }

  applyVisibility() {
    if (!this.container) return;
    this.container.hidden = !this.enabled;
    this.container.style.display = this.enabled ? '' : 'none';
  }

  stopMotionListener() {
    if (!this.sensorActive || typeof window === 'undefined') return;
    window.removeEventListener('devicemotion', this.handleMotion);
    this.sensorActive = false;
    this.updateUI();
  }

  getTodayKey() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getStorageKey() {
    return `juegitos_steps_${this.user}_${this.getTodayKey()}`;
  }

  getGoalStorageKey() {
    return `juegitos_goal_${this.user}`;
  }

  getMotionPrefKey() {
    return `juegitos_motion_enabled`;
  }

  loadState() {
    try {
      const savedGoal = localStorage.getItem(this.getGoalStorageKey());
      if (savedGoal) {
        const parsedGoal = parseInt(savedGoal, 10);
        if (!isNaN(parsedGoal) && parsedGoal >= 500) {
          this.goal = parsedGoal;
        }
      }

      const savedToday = localStorage.getItem(this.getStorageKey());
      if (savedToday) {
        const parsed = JSON.parse(savedToday);
        this.steps = parsed.steps || 0;
        this.goalCelebratedToday = !!parsed.goalCelebratedToday;
      } else {
        this.steps = 0;
        this.goalCelebratedToday = false;
      }
    } catch (e) {
      this.steps = 0;
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.getGoalStorageKey(), String(this.goal));
      localStorage.setItem(
        this.getStorageKey(),
        JSON.stringify({
          steps: this.steps,
          goalCelebratedToday: this.goalCelebratedToday,
          updatedAt: Date.now()
        })
      );
    } catch (e) {}
  }

  setUser(username) {
    this.user = username;
    this.loadState();
    this.applyVisibility();
    this.updateUI();
  }

  autoStartMotionIfPossible() {
    if (!this.enabled || typeof window === 'undefined') return;

    if (!('DeviceMotionEvent' in window)) {
      this.permissionState = 'unsupported';
      this.updateUI();
      return;
    }

    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      this.startMotionListener();
      return;
    }

    const bindAutoUnlock = () => {
      const unlockHandler = async () => {
        window.removeEventListener('touchend', unlockHandler);
        window.removeEventListener('click', unlockHandler);
        await this.requestAndStart();
      };
      window.addEventListener('touchend', unlockHandler, { once: true });
      window.addEventListener('click', unlockHandler, { once: true });
    };

    bindAutoUnlock();
  }

  async requestAndStart() {
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      this.permissionState = 'unsupported';
      this.updateUI();
      return false;
    }

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          this.startMotionListener();
          return true;
        } else {
          this.permissionState = 'denied';
          this.updateUI();
          return false;
        }
      } catch (err) {
        this.permissionState = 'unknown';
        this.updateUI();
        return false;
      }
    } else {
      this.startMotionListener();
      return true;
    }
  }

  startMotionListener() {
    if (this.sensorActive) return;
    window.addEventListener('devicemotion', this.handleMotion, { passive: true });
    this.sensorActive = true;
    this.permissionState = 'granted';
    try {
      localStorage.setItem(this.getMotionPrefKey(), 'true');
    } catch (e) {}
    this.updateUI();
  }

  handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null) return;

    const mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    this.smoothMag = 0.7 * this.smoothMag + 0.3 * mag;
    const now = performance.now();

    if (this.smoothMag > this.accelThreshold && !this.inPeak) {
      if (now - this.lastStepTime > this.stepCooldownMs) {
        this.inPeak = true;
        this.lastStepTime = now;
        this.incrementSteps(1);
      }
    } else if (this.smoothMag < 10.2) {
      this.inPeak = false;
    }
  }

  incrementSteps(amount = 1, sourceBtn = null) {
    this.steps += amount;
    if (amount >= 50) {
      sound.playPop(1.1);
      if (sourceBtn) {
        this.spawnFloatingPlus(sourceBtn, `+${amount}`);
      }
    }

    if (this.steps >= this.goal && !this.goalCelebratedToday) {
      this.goalCelebratedToday = true;
      sound.playStepGoalMet();
      this.triggerCelebrationBanner();
    }

    this.saveState();
    this.updateUI();
  }

  spawnFloatingPlus(btnEl, text) {
    const rect = btnEl.getBoundingClientRect();
    const floatEl = document.createElement('span');
    floatEl.className = 'floating-step-badge';
    floatEl.textContent = text;
    floatEl.style.left = `${rect.left + rect.width / 2 - 20}px`;
    floatEl.style.top = `${rect.top - 6}px`;
    document.body.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 800);
  }

  setGoal(newGoal) {
    const parsed = parseInt(newGoal, 10);
    if (!isNaN(parsed) && parsed >= 500 && parsed <= 100000) {
      this.goal = parsed;
      if (this.steps < this.goal) {
        this.goalCelebratedToday = false;
      }
      this.saveState();
      this.updateUI();
    }
  }

  triggerCelebrationBanner() {
    const bar = this.container?.querySelector('.step-counter-bar');
    if (bar) {
      bar.classList.add('goal-reached');
      setTimeout(() => bar.classList.remove('goal-reached'), 5000);
    }
  }

  openGoalModal() {
    const existing = document.getElementById('stepGoalModal');
    if (existing) existing.remove();

    sound.playCardSlide();

    const presets = [3000, 5000, 7500, 10000];
    const modal = document.createElement('div');
    modal.id = 'stepGoalModal';
    modal.className = 'goal-modal-overlay';

    const pct = Math.min(100, Math.round((this.steps / this.goal) * 100));
    const remaining = Math.max(0, this.goal - this.steps);

    modal.innerHTML = `
      <div class="goal-modal-sheet" role="dialog" aria-label="Step Counter Settings">
        <div class="goal-sheet-header">
          <div class="goal-sheet-title">${Icons.sneaker('sheet-title-ico', 20)} <span>Daily Walk Goal</span></div>
          <button type="button" class="goal-sheet-close" id="closeGoalModalBtn" aria-label="Close">${Icons.close('', 18)}</button>
        </div>

        <div class="goal-sheet-summary">
          <div class="summary-stat">
            <span class="summary-val">${this.steps.toLocaleString()}</span>
            <span class="summary-lbl">Steps Today (${pct}%)</span>
          </div>
          <div class="summary-stat">
            <span class="summary-val">${remaining > 0 ? remaining.toLocaleString() : 'Goal Met!'}</span>
            <span class="summary-lbl">Remaining</span>
          </div>
        </div>

        <div class="goal-sheet-section-lbl">Quick Select Target</div>
        <div class="goal-chips-grid">
          ${presets.map(p => `
            <button type="button" class="goal-chip ${this.goal === p ? 'active' : ''}" data-goal="${p}">
              ${p.toLocaleString()}
            </button>
          `).join('')}
        </div>

        <div class="goal-sheet-section-lbl">Custom Step Target</div>
        <div class="goal-stepper">
          <button type="button" class="stepper-btn" id="goalMinusBtn" aria-label="Decrease by 500">-500</button>
          <span class="stepper-val" id="goalModalVal">${this.goal.toLocaleString()}</span>
          <button type="button" class="stepper-btn" id="goalPlusBtn" aria-label="Increase by 500">+500</button>
        </div>

        <button type="button" class="goal-save-btn" id="saveGoalModalBtn">Save Goal</button>
      </div>
    `;

    document.body.appendChild(modal);

    let tempGoal = this.goal;
    const valEl = modal.querySelector('#goalModalVal');
    const updateModalDisplay = () => {
      if (valEl) valEl.textContent = tempGoal.toLocaleString();
      modal.querySelectorAll('.goal-chip').forEach(chip => {
        chip.classList.toggle('active', parseInt(chip.dataset.goal, 10) === tempGoal);
      });
    };

    modal.querySelectorAll('.goal-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playCardSlide();
        tempGoal = parseInt(chip.dataset.goal, 10);
        updateModalDisplay();
      });
    });

    modal.querySelector('#goalMinusBtn')?.addEventListener('click', () => {
      sound.playCardSlide();
      tempGoal = Math.max(500, tempGoal - 500);
      updateModalDisplay();
    });

    modal.querySelector('#goalPlusBtn')?.addEventListener('click', () => {
      sound.playCardSlide();
      tempGoal = Math.min(100000, tempGoal + 500);
      updateModalDisplay();
    });

    const closeModal = () => modal.remove();
    modal.querySelector('#closeGoalModalBtn')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('#saveGoalModalBtn')?.addEventListener('click', () => {
      sound.playCardSnap();
      this.setGoal(tempGoal);
      closeModal();
    });
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="step-counter-bar" role="region" aria-label="Walking Step Counter">
        <div class="step-dock-v2">
          <!-- Left Hero Card: Steps + Goal Progress (Tap to open Goal Sheet) -->
          <button type="button" class="dock-hero-card" id="stepHeroGoalBtn" title="Tap to adjust daily step goal">
            <div class="dock-icon-ring">${Icons.sneaker('hero-sneaker-svg', 20)}</div>
            <div class="dock-hero-data">
              <div class="dock-val-row">
                <span class="dock-val" id="stepCountValue">0</span>
                <span class="dock-unit">STEPS</span>
              </div>
              <div class="dock-sub" id="stepRemainingText">5,000 to go</div>
            </div>
            <div class="dock-chevron-indicator" aria-hidden="true">${Icons.target('hero-target-svg', 16)}</div>
          </button>

          <!-- Right Compact Action Pills -->
          <div class="dock-actions">
            <!-- Manual +100 Step Increment -->
            <button type="button" class="dock-pill-btn add-btn" id="addManualStepsBtn" title="Add 100 steps manually">
              <span class="pill-icon">${Icons.plus('add-plus-svg', 14)}</span>
              <span class="pill-text">100</span>
            </button>

            <!-- Motion Sensor Status / Toggle Pill -->
            <button type="button" class="dock-pill-btn sensor-btn" id="enableMotionBtn" title="Motion Pedometer Status">
              <span class="status-pulse-dot" id="motionDot"></span>
              <span class="pill-text" id="motionStatusText">Auto</span>
            </button>
          </div>
        </div>

        <!-- Global Full-Width Bottom Progress Track -->
        <div class="step-banner-progress-track">
          <div class="step-banner-progress-fill" id="stepProgressFill"></div>
        </div>
      </div>
    `;

    const heroBtn = this.container.querySelector('#stepHeroGoalBtn');
    const addStepsBtn = this.container.querySelector('#addManualStepsBtn');
    const motionBtn = this.container.querySelector('#enableMotionBtn');

    heroBtn?.addEventListener('click', () => {
      this.openGoalModal();
    });

    addStepsBtn?.addEventListener('click', () => {
      this.incrementSteps(100, addStepsBtn);
    });

    motionBtn?.addEventListener('click', async () => {
      if (!this.sensorActive) {
        await this.requestAndStart();
      } else {
        this.incrementSteps(1);
      }
    });

    this.updateUI();
  }

  updateUI() {
    if (!this.container) return;

    const countEl = this.container.querySelector('#stepCountValue');
    const remEl = this.container.querySelector('#stepRemainingText');
    const fillEl = this.container.querySelector('#stepProgressFill');
    const motionBtn = this.container.querySelector('#enableMotionBtn');
    const motionText = this.container.querySelector('#motionStatusText');

    if (countEl) countEl.textContent = this.steps.toLocaleString();

    const remaining = Math.max(0, this.goal - this.steps);
    if (remEl) {
      if (remaining === 0) {
        remEl.innerHTML = `<span class="goal-met-badge">${Icons.awardStar('goal-star-inline', 14)} Goal Met! (${this.goal.toLocaleString()})</span>`;
      } else {
        remEl.innerHTML = `<span class="countdown-num">${remaining.toLocaleString()}</span> to ${this.goal.toLocaleString()}`;
      }
    }

    const pct = Math.min(100, Math.round((this.steps / this.goal) * 100));
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
    }

    if (motionBtn && motionText) {
      if (this.sensorActive) {
        motionBtn.classList.add('is-active');
        motionText.textContent = 'Walk ON';
      } else if (this.permissionState === 'unsupported') {
        motionBtn.classList.remove('is-active');
        motionText.textContent = 'Manual';
      } else if (this.permissionState === 'denied') {
        motionBtn.classList.remove('is-active');
        motionText.textContent = 'Blocked';
      } else {
        motionBtn.classList.remove('is-active');
        motionText.textContent = 'Walk';
      }
    }
  }
}
