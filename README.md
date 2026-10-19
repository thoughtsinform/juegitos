# Juegitos (juegitos.casas.lol)

A custom, ad-free mobile arcade built for **Ellen and Susan** to play their favorite casual games and compete with each other—completely free of intrusive ads, predatory timers, pay-to-win microtransactions, or battery drain.

---

## 🎯 Target Games & Reverse-Engineering Scope

1. **Spider Solitaire** (First Priority)
   - 1-Suit, 2-Suit (default), and 4-Suit modes.
   - 100% faithful replication of the clean green-felt mobile app interface.
   - Full support for **Horizontal (Landscape)** and **Vertical (Portrait)** layouts.
   - **The Walking Step Counter:** In place of the Unity Ads banner, an interactive live step counter that counts down to a customizable step goal while walking.
2. **Words of Wonders (WoW)**
   - Circular anagram wheel connected to a mini-crossword board.
   - Full English dictionary with bonus word jar, hints, and daily seed puzzles.
3. **Toy Blast**
   - Pure tap-to-blast collapse puzzle engine with fair (non-rigged) RNG.
   - Rotor, TNT, and Disco Ball power-ups with full dual-booster merge combinations.
4. **Matchington**
   - Classic match-3 swap puzzle mechanics with firecracker, airplane, and rainbow sphere boosters.
   - Optional cozy shared living room / garden room decorated with earned stars.

---

## 🏃‍♀️ Special Feature: Integrated Walking Step Counter

Because Ellen frequently walks while playing to get her daily steps in:
- The top ad banner area is replaced with a **Walking Step Goal Hub**.
- Features:
  - **Live Step Tracking:** Uses the Web `DeviceMotionEvent` (accelerometer magnitude filter & peak detection) to track steps in real-time.
  - **Editable Goal:** Tap to set a goal (e.g., 2,500 steps, 5,000 steps).
  - **Goal Countdown:** Shows remaining steps to hit the target (e.g., `"1,420 steps to go!"`).
  - **Celebration Mode:** Subtle haptic vibration and confetti burst when the goal is reached.
  - **Manual Adjust / Toggle:** Can be minimized to a discreet pill or expanded to the full header.

---

## 👯 Ellen & Susan Arcade Social Layer

- **Instant Profile Switcher:** 1-tap toggle between Ellen and Susan (no passwords or annoying signups).
- **Daily Shared Deal:** Both players get the exact same randomized seed for Spider Solitaire, WoW, and Toy Blast.
- **Head-to-Head Friendly Rivalry:**
  - Weekly stars won.
  - Spider Solitaire fewest moves & fastest time.
  - Total steps walked while playing.
  - Friendly sisterly "nudge" badges.

---

## 📁 Repository Structure

```
juegitos/
├── docs/
│   ├── RESEARCH.md                   # Deep research on mechanics, algorithms, and player feedback
│   └── assets/                       # Reference screenshots and design specifications
│       ├── spider-portrait-reference.png
│       └── spider-landscape-reference.png
├── src/
│   ├── games/
│   │   ├── spider/                   # Spider Solitaire engine and UI
│   │   ├── wow/                      # Words of Wonders engine
│   │   ├── toy-blast/                # Toy Blast collapse engine
│   │   └── matchington/              # Matchington match-3 engine
│   ├── components/
│   │   ├── step-counter/             # Motion sensor step counter & goal countdown
│   │   ├── arcade-hub/               # Ellen & Susan profile switcher & game lobby
│   │   └── leaderboard/              # Head-to-head score tracking
│   └── shared/
│       ├── audio/                    # Sound effects & haptic feedback
│       └── storage/                  # LocalStorage + cloud sync state
├── public/
│   ├── manifest.json                 # PWA install configuration for iOS & Android
│   └── icons/                        # App icons for iOS home screen
└── README.md
```
