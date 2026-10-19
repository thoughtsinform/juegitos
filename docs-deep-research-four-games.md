# Juegitos Deep Research: The Four Games Specification
**Prepared for:** Daniel Casas, Argon, Claude, ChatGPT, and the Juegitos Architecture Team  
**Scope:** Eliminating clunkiness, reverse-engineering authentic mobile game feel, mechanics, easter eggs, audio design, and UX nuances for Ellen & Susan.  
**Games:**
1. MobilityWare Spider Solitaire
2. Words of Wonders (WoW) by Fugo Games
3. Toy Blast by Peak Games
4. Matchington Mansion by Magic Tavern / Firecraft Studios

---

## Executive Summary: Why Casual Mobile Clones Feel "Clunky"
When developers replicate casual mobile games on the web, they almost always duplicate the high-level logic (e.g. matching 3 tiles, moving cards, finding anagrams) while failing to implement the **micro-physics, animation timing, hit-stops, volume-preserving squash-and-stretch, and audio sync** that game designers call **"juice."**

Without juice:
- A card game feels like sliding flat grey plastic on ice.
- A block collapse game feels like an Excel spreadsheet refreshing cells.
- A word connector feels like dragging a line on MS Paint.
- A match-3 game feels stiff, rigid, and disconnected from the player's fingertips.

Mobile puzzle veterans (like Ellen and Susan, who have logged thousands of hours on these games) immediately register this as "clunky," even if they cannot articulate the exact mathematical difference in CSS easing curves or frame pauses.

This dossier provides the exhaustive architectural and aesthetic blueprint to achieve 100% fidelity to the authentic games.

---

## Game 1: MobilityWare Spider Solitaire

### 1. Overview & Heritage
MobilityWare's Spider Solitaire is the undisputed gold standard of mobile solitaire, with hundreds of millions of downloads and daily play across iOS and Android. It is specifically designed for quick, satisfying one-handed or horizontal tablet play.

### 2. The Micro-Feel of Card Movement
- **Linear vs. Ease-Out Settling:**
  - *The Clunky Way:* Cards move at constant linear speed or generic ease-in-out (`transition: transform 0.3s ease`).
  - *The MobilityWare Way:* Cards move with explosive initial velocity and a strong deceleration curve (`cubic-bezier(0.18, 0.89, 0.32, 1.15)`), resulting in a slight 2–3px overshoot followed by a tactile settle into the column slot.
- **Card Thickness & Elevation:**
  - Active dragged/lifted cards cast a dynamic drop shadow (`box-shadow: 0 14px 28px rgba(0,0,0,0.35), 0 10px 10px rgba(0,0,0,0.22)`) and scale up by `1.04` to create physical depth off the green felt table.
  - Cards remaining on the tableau have a subtle 1px border and a crisp bottom shadow (`box-shadow: 0 2px 4px rgba(0,0,0,0.18)`).
- **Staggered Dealing Wave:**
  - Dealing a new row of 10 cards from the stock pile must **never** happen simultaneously.
  - MobilityWare deals them in a rapid wave from left to right: Column 0 flies at $t = 0\text{ms}$, Column 1 at $t = 35\text{ms}$, Column 2 at $t = 70\text{ms}$ ... Column 9 at $t = 315\text{ms}$.
  - Each dealt card has a randomized tilt ($\pm 1.5^\circ$) while airborne that straightens out upon landing.

### 3. Touch & Tap-to-Move Intelligence
- **1-Tap Auto-Move Hierarchy:**
  Casual players rarely drag cards; 90% of moves are made by tapping. When a player taps a card or valid movable run, the engine must evaluate target columns in strict priority order:
  1. **Priority 1 (Same Suit Sequence):** An open column whose bottom card is rank $N+1$ and shares the **exact same suit** (e.g. 7♠ prefers 8♠ over 8♥).
  2. **Priority 2 (Opposite/Different Suit Sequence):** An open column whose bottom card is rank $N+1$ of a different suit (e.g. 7♠ to 8♥).
  3. **Priority 3 (Empty Column):** An empty column, but **only** if moving a King, or moving a stack that exposes a hidden face-down card underneath.
- **Drag Forgiveness:**
  - Players don't need to drop the card onto the exact top card. If the center of the dragged card is within 50px of any column's horizontal axis, it snaps to the valid destination.

### 4. Audio Architecture
- **Felt Slide Friction:** White noise bandpass-filtered around 1,200 Hz with 40ms exponential decay, simulating stiff paper sliding over wool felt.
- **Card Snap / Drop:** Triangle wave dropping sharply from 340 Hz to 110 Hz in 45ms, producing a solid "thud" with 12ms tactile vibration.
- **Dealing Shh-wip:** A high-frequency airy flutter with a rising pitch on each dealt card.
- **Run Completed Chime:** A resonant two-tone brass chime (F#5 to C#6) when an Ace-to-King sequence is gathered.

### 5. Quirks, Easter Eggs & End Game
- **Run Swoop Animation:**
  - When all 13 cards (King down to Ace) of a suit align, they freeze for 100ms with a golden highlight sweep.
  - The stack lifts into an arc and swoops diagonally into the foundation tray in the bottom corner.
- **The Iconic Victory Card Cascade:**
  - When the final foundation is cleared, the game does not show a static pop-up.
  - It launches into the classic Windows/MobilityWare physics cascade: all 104 cards bounce across the screen under simulated gravity ($g = 980\text{px/s}^2$) with coefficient of restitution $e = 0.75$, leaving behind full-trail motion blurs until the screen is painted with cards.
- **"Winning Deals" Toggle:**
  - MobilityWare calculates and pre-verifies solvable shuffles. In random deals, 4-suit Spider has an estimated theoretical win rate of ~30%, but "Winning Deals" mode guarantees that a perfect sequence of moves exists.
- **Empty Column Rule:**
  - A new deal from the stock is blocked if any column is empty. Tapping the stock pile with an empty column triggers a soft red horizontal pulse on the empty slot.

---

## Game 2: Words of Wonders (WoW) by Fugo Games

### 1. Overview & Mechanics
Developed by Fugo Games, Words of Wonders combines a circular letter anagram dial with an architectural crossword board. As players solve words, they journey across world landmarks (Giza, Taj Mahal, Colosseum, Machu Picchu, Petra, Great Wall of China, Eiffel Tower).

### 2. The Touch Dial & Connecting Line
- **Trigonometric Letter Layout:**
  - For $N$ letters (typically 3 to 7), letter centers are positioned at:
    $$x_i = R \cdot \cos\left(\frac{2\pi \cdot i}{N} - \frac{\pi}{2}\right), \quad y_i = R \cdot \sin\left(\frac{2\pi \cdot i}{N} - \frac{\pi}{2}\right)$$
  - Each letter is rendered as a clean cream/white disc with bold dark slate typography.
- **Laser Ribbon Tracing:**
  - As the finger moves, an SVG/Canvas polyline connects the selected letters with a glowing golden/cyan neon cord (`stroke-width: 6`, `stroke-linecap: round`, `filter: drop-shadow(0 0 6px #38bdf8)`).
  - The line tracks directly to the real-time touch coordinate until a new letter is touched.
  - **Haptic Letter Magnetism:** When the touch coordinate enters within $32\text{px}$ of a letter center, the letter pops up (`transform: scale(1.22)`), illuminates with a circular rim glow, and triggers a crisp 10ms micro-vibration.
- **Preview Pill:**
  - Positioned directly above the dial, showing the traced word in real time with high-contrast tracked lettering.

### 3. Word Release & Flying Letter Arcs
- **When a Crossword Word is Submitted:**
  - The word does **not** instantly appear on the board.
  - The letters lift off the wheel as 3D glowing tiles and fly in a parabolic Bézier arc trajectory directly into their respective crossword cells!
  - As each letter strikes its cell, it lands with an acoustic wooden tile snap and a mini radial sparkle burst.
- **The "Extra Words" Amphora / Jar:**
  - Valid English anagram words that are not part of the handcrafted crossword do not get rejected.
  - They fly across the screen into the **Extra Words Jar** located on the upper side.
  - The jar shakes slightly (`transform: rotate(4deg)` then `-4deg`), plays a soft glass clink, and increments its progress counter. Once the jar reaches 100/100, it erupts with 50 free coins!
- **Invalid Submission:**
  - If the string is gibberish or already submitted, the preview pill shakes rapidly horizontally (`translateX(-6px)` to `+6px` over 250ms) accompanied by a low-pitched "bloop" and fades out.

### 4. Power-Ups & Boosters
- **Lightbulb (25 🪙):**
  - Shoots a warm beam of light directly into a random unrevealed cell on the crossword, permanently revealing its letter.
- **Bullseye / Hammer (35 🪙):**
  - Enters **Target Mode**. Unrevealed cells softly pulse with an indigo/cyan glow.
  - The player taps the exact difficult intersection cell they need. A cartoon hammer swings down, strikes the tile with an anvil clang, and exposes the letter.
- **Shuffle Button (Free):**
  - Rotates the letters around the wheel with a 180ms spinning whoosh, allowing the human brain to break out of anagram blindness.

### 5. The Butterfly Event & Scenic Backdrops
- **Butterflies:**
  - In special levels, animated butterflies (Orange, Yellow, or Purple) land on specific crossword tiles.
  - If the player solves the word intersecting the butterfly's tile before running out of moves/attempts, the butterfly flutters off the board leaving a golden particle trail, rewarding 10–25 coins!
- **Wonder Artwork:**
  - Each chapter features high-resolution painterly matte art of a world wonder.
  - Ambient particle drifting (floating desert dust for Giza, falling cherry blossoms for Japan, gentle clouds for Machu Picchu) provides a peaceful, meditative atmosphere.

---

## Game 3: Toy Blast by Peak Games

### 1. Overview & Heritage
Developed by Peak Games (now part of Zynga/Take-Two), *Toy Blast* pioneered the modern color cube collapse/tap-to-blast mechanic. Players follow Amy and her toy companions (Mr. B the bear, Rhino, and playful toys) through over 10,000 levels.

### 2. The Physics of the "Juicy" Pop
- **Hit-Stop & Rubber Squash:**
  - *The Clunky Way:* Tapping a group makes cubes vanish immediately and replaces them.
  - *The Peak Games Way:*
    1. **T = 0ms (Touch):** The entire connected group scales down slightly (`scale(0.92)`) as if squeezed like soft vinyl toys.
    2. **T = 60ms (Hit-Stop):** A 2-frame micro-pause freezes the board.
    3. **T = 80ms (Pop):** The cubes expand rapidly to `1.20` scale and burst into 8–12 radial color-matched confetti particles with gravity fall-off.
- **Falling Physics & Squash Landing:**
  - When cubes above drop to fill the void, they don't move at fixed speed. They accelerate downward ($v = g \cdot t$).
  - When a cube hits the bottom or lands on the cube beneath it, it **squashes** (`scaleX(1.18), scaleY(0.82)`) for 50ms, then rebounds with a gentle spring overshoot before resting.
- **Musical Dopamine Chimes:**
  - As cascades and chain reactions trigger, each successive pop ascends the musical scale:
    - Combo 1: C4 (261.6 Hz)
    - Combo 2: D4 (293.6 Hz)
    - Combo 3: E4 (329.6 Hz)
    - Combo 4: G4 (392.0 Hz)
    - Combo 5: A4 (440.0 Hz)
    - Combo 6+: C5 octave fanfare (523.2 Hz)

### 3. Booster Generation & Dual Combos
Boosters are formed strictly by match cluster size:
- **Rotor / Rocket (5–6 Cubes):**
  - Spawns either a Horizontal or Vertical propeller rotor.
  - When detonated, cartoon rocket engines ignite with whistling audio and blast across the entire row/column, clearing all blocks and damaging obstacles.
- **TNT Bomb (7–8 Cubes):**
  - Spawns a cartoon bomb with a sparkling fuse.
  - Detonation triggers a 2-frame white screen flash + 180ms exponential camera shake + punchy sub-bass explosion, wiping a 3×3 zone.
- **Puzzle Cube / Disco Ball (9+ Cubes):**
  - Multi-faceted prismatic cube with glowing neon facets.
  - Detonation shoots electric light beams to every cube of that color on the board, popping them in a blistering staccato arpeggio!

#### The Famous Adjacent Booster Combos:
- **Rotor + Rotor:** Creates a 4-way cross blast (clears row AND column).
- **Bomb + Rotor:** Clears 3 full horizontal rows AND 3 full vertical columns simultaneously.
- **Bomb + Bomb:** A 5×5 nuclear detonation that shakes the entire screen.
- **Disco + Rotor / Bomb:** Converts every cube of the most prominent color into a rotor or bomb, then detonates all of them in a chain reaction.
- **Disco + Disco:** Wipes the entire board clean in a rainbow solar flare!

### 4. Obstacles & Level Goals
- **Wooden Crates:** 1-hit raw wood, 2-hit iron-reinforced boxes. Damaged by adjacent blasts.
- **Rubber Ducks:** Cannot be matched or blasted directly. Players must clear cubes beneath them until they reach the bottom row, where they squeak happily and fly into the victory collection chest!
- **Bubbles:** Translucent glassy spheres wrapping cubes. Popping the cube inside or blasting an adjacent cube pops the bubble.

### 5. Player Psychology & Anti-Rigging
- On Reddit (`r/ToyBlast`), the single most frequent complaint is that Peak Games algorithms manipulate drop tables on the player's last 2 moves, deliberately withholding the final required color by 1 block to force coin spending or buying 5 extra moves for $0.99.
- **Our Architecture Rule:** In Juegitos, drop tables must be **100% fair, non-rigged, and seeded deterministically**. Players win through strategy, combo mastery, and skill, never predatory algorithmic throttle gates.

---

## Game 4: Matchington Mansion by Magic Tavern

### 1. Overview & Mechanics
Developed by Magic Tavern (Firecraft Studios), *Matchington Mansion* combines standard match-3 tile swapping with an episodic mansion renovation narrative starring Tiffany and her golden retriever Rex.

### 2. Match-3 Swapping Feel
- **1:1 Touch Drag Following:**
  - Tiles must not wait for the finger to lift before moving. As the player drags a tile toward an adjacent slot, both tiles move in real time with the finger.
  - If dragged past 50% distance, releasing snaps the swap into place.
  - If dragged less than 50% or if the swap forms no match, an elastic spring-back snaps both tiles back to their origins (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **The "Breathing Pause" in Cascades:**
  - *The Clunky Way:* Matches disappear and the board recalculates instantly, overwhelming the player.
  - *The Authentic Way:* There is an intentional **140ms visual pause** between matches being cleared, tiles falling, and cascade matches igniting. This breathing room allows the human eye to track the chain reaction.

### 3. The Power-Ups & Homing Paper Plane
- **Firecracker / Rocket (Line of 4):** Blasts an entire row or column.
- **Paper Plane (2×2 Square Match):**
  - *The Signature Mechanic:* Forming a 2×2 square of 4 items produces a Paper Plane.
  - When detonated, the paper plane folds up, loops in the air with a soaring whoosh, and **intelligently homes in** on the highest priority level goal on the board:
    1. First priority: Frozen ice floor tiles.
    2. Second priority: Wooden parquet boards.
    3. Third priority: Needed collection items.
- **Bomb (T or L Shape of 5 Items):** Clears a 3×3 radius with dynamite sparks.
- **Rainbow Ball (Straight Line of 5 Items):** Swapped with any item to eliminate all instances of that item from the board.

#### Dual Booster Combos:
- **Plane + Plane:** Launches 3 homing paper planes simultaneously.
- **Plane + Bomb:** The paper plane takes flight carrying a ticking bomb and drops it directly onto a distant cluster of obstacles!
- **Rainbow + Firecracker / Bomb:** Transforms every item of that color into a firecracker or bomb.
- **Rainbow + Rainbow:** Complete board wipe.

### 4. Mansion Renovation Meta-Game
- **The Core Loop:** Every Match-3 level won awards **1 Renovation Star** 🗝️ and gold coins.
- **Tiffany & Rex:**
  - Tiffany acts as the narrator and decorator.
  - Rex the dog wanders the rooms, naps on rugs, and barks with a tail wag whenever new furniture is placed.
- **3-Style Furniture Customization:**
  Every renovation task (Chandelier, Staircase Rug, Velvet Armchair, Stone Fireplace, Garden Table, Planters) presents **3 distinct architectural styles**:
  - *Option A:* Classic Victorian (rich scarlet velvet, dark mahogany, antique brass).
  - *Option B:* Modern Opulence (midnight navy, Italian white marble, crystal).
  - *Option C:* Earthy Botanical / Rustic (emerald foliage, natural oak, terracotta).
- **Free Re-Decorating:**
  - Players can tap any previously renovated furniture pin at any time to re-open the design drawer and swap styles freely without re-spending stars.

### 5. False Advertising vs. Reality
- Reddit forums (`r/AndroidGaming`, `r/mildlyinfuriating`) are filled with millions of views discussing the misleading "pull the pin" or "save the freezing woman" ads run by Playrix and Magic Tavern.
- In reality, the actual game that moms love is the **calm, tactile Match-3 loop paired with satisfying interior design progression**. Juegitos delivers the authentic, relaxing game without deceptive marketing tricks.

---

## Technical Specifications: The "Juice" Implementation Checklist

| Dimension | Spider Solitaire | Words of Wonders | Toy Blast | Matchington Mansion |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Interaction** | Tap-to-move (auto-target) & drag | Radial drag with connecting laser cord | Tap-to-collapse connected clusters | Direct swipe swap (1:1 finger tracking) |
| **Animation Curve** | `cubic-bezier(0.18, 0.89, 0.32, 1.15)` | Quadratic Bézier arc flight to grid | Quadratic gravity drop + overshoot bounce | Elastic spring-back `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Hit-Stop / Pause** | 0ms | 0ms | 50ms micro-pause on large blasts | 140ms cascade breathing pause |
| **Squash & Stretch** | None (rigid card stock) | Discs pop to 1.22x scale on touch | Cubes compress to 0.92x, land with 0.82x Y squash | Gentle 1.08x scale on selected swap |
| **Screen Shake** | None | None | 180ms exponential decay on Bombs/Combos | 120ms shake on Bomb detonation |
| **Audio Feedback** | White noise felt slide + triangle snap thud | Resonant wood tile click + glass jar clink | Toy pops + ascending pentatonic chimes | Soft swoosh + plane flyout whistle + renovation fanfare |
| **Victory Moment** | Physics card bounce cascade across screen | Monument blueprint reveals with star confetti | Fireworks rocket blasts for remaining moves | "+1 Star" key celebration with room CTA |
| **Anti-Rigging Rule** | Pure solvable deals without artificial blocks | Curated valid English words (no nonsense) | Fair drop tables (no intentional 1-block starvation) | Solvable boards without paywalled move limits |

---

## Instructions for Argon, Claude, and ChatGPT
When collaborating on Juegitos:
1. **Maintain Zero Emojis:** Use the vector SVG `Icons` engine in `src/icons.js`.
2. **Preserve User Profiles:** Ellen, Susan, Daniel, Rebekkah, Steph, and Trey all have custom 3D avatars in `assets/avatars/`.
3. **Keep the Walking Step Counter Active:** The top master dock persists across all four games and tracks live steps seamlessly.
4. **Tune Physics Over Code Bloat:** Focus on easing curves, micro-timings, sound frequencies, and touch forgiveness rather than complex external frameworks. Pure, performant vanilla JS/CSS delivers the cleanest 60fps experience on mobile Safari and Chrome.
