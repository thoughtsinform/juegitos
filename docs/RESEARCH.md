# Deep Research & Game Mechanics Dossier: Juegitos Arcade

This document breaks down the reverse-engineering analysis for the four target games, deconstructing their mechanics, player psychology, UX nuances, pain points in commercial versions, and our implementation blueprints.

---

## Game 1: Spider Solitaire (Deep Dive & Reference Analysis)

### 1. Visual & UI Deconstruction (From Mom's Screenshots)
Based on the provided screenshots (`spider-landscape-reference.png` and `spider-portrait-reference.png`):

| UI Component | Observed Visual Style | Implementation Blueprint |
| :--- | :--- | :--- |
| **Table Surface** | Deep classic casino green felt with a subtle radial gradient vignette (darker towards outer edges). | CSS `radial-gradient(ellipse at center, #136a32 0%, #0a441e 75%, #05240f 100%)` with optional micro-felt texture. |
| **Ad Banner Slot** | Standard 320x50 / adaptive mobile ad banner (showing Unity Ads watermark). | **Replaced entirely with the Step Counter Hub**. |
| **Header Status Bar** | Clean, minimalist, geometric sans-serif (e.g. Montserrat/Futura). Left: `MOVES [count]`. Center: `TIME [m:ss]`. Right: `SCORE [pts]`. | Sticky flex/grid bar, pure white high-contrast text, tabular figures to prevent jitter. |
| **Foundation Pile** | Top left: rounded rectangle with a subtle etched spider watermark. | Holds completed King-to-Ace stacks (8 total). Shows the top completed King or clean outline with spider silhouette. |
| **Stock Pile** | Top right: horizontal fan of 5 card backs showing deals remaining. | Tapping deals 1 card to each of the 10 tableau columns. |
| **Stock Card Back** | Deep burgundy/maroon red background, white border, centered white spider emblem. | Custom SVG/CSS card back matching exact reference. |
| **Tableau Card Backs** | Deep maroon with white horizontal pinstripes and white border. | Distinct pinstripe pattern for face-down tableau cards. |
| **Face-Up Cards** | High-contrast white face, rounded corners, clean rank font, and custom stylized royal illustrations (e.g., Queen with blue hooded mantle and floral wreath; Jack sentry with feathered blue cap and spear). | High-res custom SVG vector cards (crisp on Retina screens, no blur when scaling). |
| **Menu Drawer** | A subtle upward chevron `^` centered at the very bottom edge. | Tapping slides up a clean bottom sheet containing: New Game, Restart, Undo, Hint, Difficulty (1, 2, 4 Suits), and Settings. |

### 2. Game Rules & State Machine
* **Deck Composition:** 104 cards (2 standard decks combined).
  * **1-Suit Mode (Easy):** 104 Spades.
  * **2-Suit Mode (Medium - Mom's Default):** 52 Spades + 52 Hearts.
  * **4-Suit Mode (Hard):** 26 Spades, 26 Hearts, 26 Diamonds, 26 Clubs.
* **Initial Deal:**
  * 10 columns:
    * Columns 1–4: 6 cards each (5 face down, 1 face up).
    * Columns 5–10: 5 cards each (4 face down, 1 face up).
    * Total on board: 54 cards.
  * Remaining 50 cards sit in the Stock pile (5 deals of 10 cards each).
* **Card Movement Rules:**
  * Any face-up card can be moved onto a card with a rank of exactly $Rank + 1$ (e.g., a 7 can be placed on an 8), regardless of suit.
  * A **sequence** of cards can only be moved together if they are in descending order **and belong to the exact same suit** (e.g., 8♠-7♠-6♠ can move onto 9♠ or 9♥, but 8♠-7♥ cannot move together).
  * An empty column can accept **any** individual card or valid same-suit descending sequence.
  * When a face-down card is exposed by moving the card on top of it, it automatically flips face-up.
* **Clearing to Foundation:**
  * When a complete sequence of 13 cards of the same suit is assembled from King down to Ace ($K \rightarrow Q \rightarrow J \rightarrow 10 \rightarrow \dots \rightarrow 2 \rightarrow A$), it is removed from the tableau and flies to the foundation stack.
  * Objective: Assemble all 8 complete suit sequences.
* **Stock Deal Restriction:**
  * In standard rules, a deal from the stock requires that **no column is empty** (each of the 10 columns must have at least one card). We will include a gentle visual hint if an empty column blocks dealing.
* **Scoring System:**
  * Initial score: **500 points**.
  * Each move: **-1 point**.
  * Each undo: **-1 point**.
  * Each completed 13-card sequence cleared to foundation: **+100 points**.
  * Maximum theoretical baseline score: $500 - \text{moves} + 800 \approx 1,200+$.
* **Orientation Support:**
  * **Landscape Mode (Mom's favorite):** Wide layout maximizing card width, stock/foundation positioned at top corners with generous vertical column spacing.
  * **Portrait Mode:** 10 compressed columns with dynamic overlap scaling so cards fit comfortably without horizontal scrolling.

### 3. Player Complaints in Commercial Apps (Why Tripledot/MobilityWare Frustrate Players)
1. **Intrusive Interstitials:** Full-screen 30-second unskippable video ads after every single game or when tapping "Restart".
2. **Ad-Gated Undos & Hints:** Limiting undos or forcing players to watch a 30-second ad to get 3 undos or hints.
3. **Deceptive Close Buttons:** Ads with microscopic `X` buttons or delayed multi-stage close screens.
4. **Battery Drain & Device Heat:** Heavy ad networks running hidden background webviews that drain mobile batteries while walking.
5. **Subscription Pressure:** Aggressively pushing \$4.99–\$9.99/month subscriptions just to remove ads.

---

## Game 2: Toy Blast (Peak Games)

### 1. Core Mechanics
* **Genre:** "Collapse" / Tap-to-Blast (Match-2+ adjacent cubes of the same color).
* **Grid:** 9x9 board (or shaped grids with obstacles).
* **Booster Generation Logic:**
  * **5–6 connected cubes:** ➔ **Rotor (Rocket)**. Oriented horizontally (clears row) or vertically (clears column) depending on swipe/animation.
  * **7–8 connected cubes:** ➔ **TNT (Bomb)**. Explodes a $3 \times 3$ area.
  * **9+ connected cubes:** ➔ **Puzzle Cube / Disco Ball**. Removes all cubes of a single color.
* **Dual Booster Combos:**
  * *Rotor + Rotor:* Clears an entire row AND column in a cross blast.
  * *Rotor + TNT:* Giant 3-row + 3-column clearing cross.
  * *TNT + TNT:* Massive $5 \times 5$ explosion.
  * *Disco + Rotor/TNT:* Turns all cubes of the target color into Rotors or TNT, then detonates all of them.
  * *Disco + Disco:* Wipes the entire board clean.
* **Primary Obstacles:**
  * *Crates/Boxes:* Require adjacent cube detonations to crack.
  * *Bubbles:* Cubes encased in bubbles must be popped once to free the cube.
  * *Toy Figurines:* Must be guided to the bottom row by clearing the cubes beneath them.

### 2. Player Complaints & Commercial Dark Patterns
* **"Near-Miss" Dynamic RNG:** Community analysis and player reviews confirm the game intentionally throttles target cube drops when a player has 1–2 moves left, pushing them to buy coins or extra moves.
* **Ad-Gating Penalty:** Players report that making a microtransaction (even $0.99) permanently disables the "watch an ad for +5 moves" option to force future cash purchases.
* **Pay-to-Win Endgame:** Levels past 500+ are balanced specifically around booster depletion rather than puzzle-solving skill.
* **Our Fix:** Pure, honest RNG. Unlimited retries without energy timers. Solvable crafted puzzles.

---

## Game 3: Matchington Mansion (Magic Tavern)

### 1. Core Mechanics
* **Genre:** Traditional Match-3 Swap (swap adjacent tiles to form lines of 3+).
* **Booster Creation:**
  * **4 in a row:** Firecracker (clears row or column).
  * **2x2 square:** Small Firecracker / Paper Airplane (flies directly to the current objective).
  * **5 in T or L shape:** Dynamite.
  * **5 in a straight line:** Rainbow Sphere (clears all items of swapped color).
* **Meta-Layer:** Winning levels awards Stars $\rightarrow$ Stars unlock home/garden renovations.

### 2. Player Complaints & Commercial Dark Patterns
* **Excessive Grind & Filler:** Tasks like "clean up dust" or "rake leaves" cost multiple stars and take days of grinding.
* **Artificial Difficulty Spikes:** "Super Hard" levels designed to consume all stored power-ups.
* **Our Fix:** A fun, cozy mini-room that Ellen and Susan can decorate together using stars earned across any game in the arcade.

---

## Game 4: Words of Wonders (WoW by Fugo Games)

### 1. Core Mechanics
* **Genre:** Circular Anagram Wheel + Crossword Grid.
* **Interaction:** Continuous touch/swipe connecting letters on the wheel to spell words.
* **Crossword Matrix:** If the word matches a slot in the crossword, the letters fly into the board.
* **Bonus Word Bank:** If the word is a legitimate English dictionary word not on the board, it is saved into a bonus jar, awarding stars/coins upon filling.
* **Hints:** Lightbulb (reveals a random letter), Target/Hammer (tap any unsolved tile to reveal that specific letter).

### 2. Player Complaints & Commercial Dark Patterns
* **Ad Saturation:** Video ads trigger after *every single short crossword*, breaking cognitive focus.
* **Misleading Ads:** Game advertised with fake pin-pulling or rescue minigames.
* **Our Fix:** Clean typography, tranquil ambient nature backgrounds, offline dictionary validation, daily shared word seeds.

---

## The Integrated Walking Step Counter Architecture

### 1. The Walking Use Case
Ellen loves walking while playing casual games to log steps. Commercial apps squander top-of-screen real estate on flashing ads and video banners that distract and chew up bandwidth.

### 2. Technical Implementation
* **Sensor API:** `DeviceMotionEvent` (HTML5 accelerometer).
* **Signal Processing Pipeline:**
  1. Capture 3D acceleration vector: $\vec{a} = (a_x, a_y, a_z)$.
  2. Compute total magnitude: $\|a\| = \sqrt{a_x^2 + a_y^2 + a_z^2}$.
  3. Apply a low-pass gravity filter to isolate dynamic motion from static gravity ($9.81 \, \text{m/s}^2$).
  4. Run a peak-detection algorithm with a minimum threshold ($\Delta a > 1.2 \, \text{m/s}^2$) and debounce window ($\Delta t \ge 250 \, \text{ms}$) to prevent false double-counting.
* **UI & Modes:**
  * **Pill Toggle:** Sits unobtrusively in the top header.
  * **Live Step Mode:** Displays current steps taken during the session.
  * **Goal Countdown Mode:** Ellen can tap the goal (default: 3,000 steps) and edit it. The counter displays: `"1,840 steps left!"`.
  * **Celebration:** Subtle vibration (Web Vibration API) and celebratory banner when the goal is reached.
  * **Manual Adjustment:** Quick `+` / `-` buttons in case device motion permissions are restricted on specific iOS Safari configurations.
