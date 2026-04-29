# Design System — Vigyan Dost (विज्ञान दोस्त)

## Product Context
- **What this is:** Interactive science education platform with verified simulations + AI Socratic misconception detection
- **Who it's for:** Indian students age 10–14 (primary), parents + teachers (secondary), investors (demo audience)
- **Space/industry:** Science edtech, India-first, NCERT Classes 6–10
- **Project type:** Mobile-first PWA (Next.js 14, App Router)
- **Memorable thing:** "This is serious science" — credible, precise, trustworthy. Parents and educators sign off immediately.

---

## Aesthetic Direction
- **Direction:** Scientific-Warm Dark
- **Decoration level:** Minimal — typography, spacing, and simulation visuals do all the work
- **Mood:** A precision instrument from an Indian engineering lab. Not cold clinical (NASA), not loud colorful (Byju's). Think: brass instruments, IIT lab notebooks, the warm glow of a CRT oscilloscope. Fraunces serifs signal academic authority; Geist Mono readouts make the simulation feel like a real lab instrument panel.
- **Differentiation:** No Indian edtech product uses serif display fonts or warm amber accents. Every competitor owns blue/teal. This product is category-distinct by design.

---

## Typography

- **Display / Lesson titles:** `Fraunces` (variable serif) — weight 600, optical-size 9–144. Signals academic authority. Chosen because no Indian edtech uses serifs — investors read "serious science," not "children's app." Used for lesson names, section headers, the product wordmark.
- **Body / UI / Hindi:** `Plus Jakarta Sans` — weight 300–700. Clean modern geometric sans with excellent Devanagari rendering. Used for all body copy, UI labels, button text, AI chat messages, and Hindi strings. Load via Noto Sans Devanagari as companion for full Unicode coverage.
- **Scientific readouts / numbers:** `Geist Mono` — weight 300–600, `font-variant-numeric: tabular-nums`. All live simulation data: EMF voltage, current, pH values, ATP counter, O₂ saturation, heart rate, distance traveled. Makes the readouts feel like lab instruments, not UI labels.
- **Code:** `Geist Mono` (same family)

### Loading (CDN)
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Type Scale
| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| Hero | Fraunces | 28–36px | 700 | Product wordmark |
| Lesson title | Fraunces | 18–22px | 600 | Lesson names |
| Phase header | Fraunces | 15–17px | 600 | Phase labels in shell |
| Body | Plus Jakarta Sans | 14–15px | 400 | Paragraphs, descriptions |
| UI label | Plus Jakarta Sans | 12–13px | 500–600 | Buttons, inputs, badges |
| Caption | Plus Jakarta Sans | 10–11px | 400 | Secondary info, timestamps |
| Tag | Plus Jakarta Sans | 9–10px + letter-spacing | 600 | PREDICT / EXPERIMENT badges |
| Readout | Geist Mono | 14–22px | 500 | Live simulation data |
| Micro tag | Geist Mono | 9–11px + letter-spacing | 400–500 | Section labels, NCERT refs |

---

## Color

- **Approach:** Restrained — 1 accent + dark neutrals. Color is rare and meaningful.

### CSS Custom Properties
```css
:root {
  /* Backgrounds */
  --bg:         #0C0C12;   /* Near-black base — makes Three.js scenes pop */
  --surface:    #141420;   /* Card surfaces, lesson shell */
  --surface2:   #1C1C2E;   /* Inputs, secondary surfaces */

  /* Accent */
  --amber:      #C8902A;   /* Primary accent — scientific precision, Indian warmth */
  --amber-dim:  #8A611C;   /* Borders, ghost buttons */
  --amber-glow: rgba(200,144,42,0.15); /* Backgrounds, badge fills */

  /* Text */
  --text:       #F0EFE9;   /* Primary text — warm white, not cold */
  --text-muted: #8A8980;   /* Secondary text, placeholders */
  --text-dim:   #4A4A55;   /* Tertiary — tags, disabled states */

  /* Semantic */
  --success:    #2E7D52;   /* Misconception corrected, lesson complete */
  --error:      #C0392B;   /* Misconception detected (red flag) */
  --warning:    #C8902A;   /* Same as amber — misconception banner */
  --info:       #2563A8;   /* Informational states */

  /* Borders */
  --border:     rgba(200,144,42,0.12); /* Subtle amber-tinted borders */
  --border-dim: rgba(255,255,255,0.06); /* Very subtle structural dividers */
}
```

### Dark Mode (default)
All colors above are dark mode. This is the primary surface — simulation canvases require it.

### Light Mode
Increase surface brightness; reduce amber saturation 10%:
```css
body.light {
  --bg:         #F8F7F3;
  --surface:    #FFFFFF;
  --surface2:   #F2F0EC;
  --text:       #1A1912;
  --text-muted: #6B6A60;
  --amber:      #B87820;   /* Slightly darker for contrast on light */
}
```
Note: Simulation canvases (Three.js, D3) remain dark regardless of mode toggle — their internal background is hardcoded dark.

---

## Spacing

- **Base unit:** 8px
- **Density:** Comfortable — not cramped (this is a learning product; breathing room matters)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-2xs` | 2px | Icon gaps, micro padding |
| `--space-xs`  | 4px | Tight padding, dot gaps |
| `--space-sm`  | 8px | Component internal padding |
| `--space-md`  | 12–16px | Card padding, section gaps |
| `--space-lg`  | 24px | Major section separation |
| `--space-xl`  | 32px | Page section breaks |
| `--space-2xl` | 48px | Large section gaps |
| `--space-3xl` | 64px | Page-level whitespace |

---

## Layout

- **Approach:** Grid-disciplined. Strict columns, predictable alignment. No asymmetry — the simulations provide all the visual drama needed.
- **Grid:** 4-col mobile (375px) / 8-col tablet (768px) / 12-col desktop (1280px)
- **Max content width:** 1280px (desktop lesson selector, teacher dashboard)
- **Mobile simulation canvas:** 70% viewport height (`height: 70dvh`). The simulation IS the product — give it the screen.
- **AI chat:** Bottom-sheet, slides up from bottom (WhatsApp pattern). Indian users understand this pattern immediately. Does not cover canvas until student opens it.
- **Phase indicator:** 5 dots below the canvas. Filled = completed, active = pulse glow, empty = locked.

### Border Radius
```css
--r-sm:   6px;    /* Buttons, small chips */
--r-md:   10px;   /* Cards, inputs, alerts */
--r-lg:   16px;   /* Phone frames, lesson cards */
--r-full: 9999px; /* Pills, avatars, circular buttons */
```

---

## Motion

- **Approach:** Intentional — only transitions that aid comprehension or reinforce the "scientific protocol" progression.
- **Easing:** `enter: ease-out` / `exit: ease-in` / `move: ease-in-out`

| Token | Duration | Usage |
|-------|----------|-------|
| `--dur-micro` | 100ms | Button hover, dot state |
| `--dur-short` | 200ms | Input focus rings, icon transitions |
| `--dur-medium` | 300ms | Phase state transitions (PREDICT→EXPERIMENT→...) |
| `--dur-scene` | 800ms | Three.js scene entrance (slow zoom in) |
| `--dur-banner` | 250ms | Misconception banner slide-in from top |
| `--dur-chat` | 200ms | AI chat bottom-sheet slide-up |

### Specific Animations
- **Phase transition:** `translateY(-4px) + opacity 0→1`, 300ms ease-out
- **Three.js scene entrance:** Camera zoom from ~1.5x to 1.0x, 800ms ease-out. Gives the "you're entering a simulation" feel.
- **Misconception banner:** `translateY(-100%) → translateY(0)`, 250ms ease-out. Slides from top, demands attention.
- **AI chat open:** `translateY(100%) → translateY(0)`, 200ms ease-out. Standard bottom-sheet pattern.
- **Lesson card hover:** `translateY(-2px)` + amber top border reveal, 200ms ease-out.

---

## Component Tokens

### Buttons
```css
.btn-primary  { background: var(--amber); color: var(--bg); }
.btn-secondary{ background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-ghost    { background: transparent; color: var(--amber); border: 1px solid var(--amber-dim); }
```

### Inputs
```css
input { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
input:focus   { border-color: var(--amber); }
```

### Misconception Banner
```css
.misconception-banner {
  background: rgba(200,144,42,0.12);
  border: 1px solid rgba(200,144,42,0.35);
  border-radius: var(--r-md);
  /* Slide in from top, 250ms ease-out */
}
```

### Phase Dots
```css
.dot        { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); }
.dot.filled { background: var(--amber); }
.dot.active { width: 16px; border-radius: 3px; background: var(--amber); box-shadow: 0 0 6px var(--amber); }
```

---

## Simulation Canvas Rules

1. **Backgrounds:** Always near-black (#08080E to #0C0C14 range). Three.js and D3 scenes look best on dark. Never white or light gray.
2. **Three.js WebGLRenderer:** Always init with `preserveDrawingBuffer: true`. The default (`false`) clears the buffer after each frame — `canvas.toDataURL()` returns blank. Required for any demo screenshots.
3. **The bulb/amber glow in EM Induction:** Lightbulb `PointLight` color should match `--amber` (#C8902A) exactly. This ties the simulation visually to the UI accent color — intentional coherence.
4. **RBC colors:** `computeRBCColor()` returns values in the range `rgb(88, 12, 12)` (deoxy) to `rgb(220, 30, 30)` (oxy). Never blue. Never purple. The verified engine enforces this.
5. **D3 operations:** Always in `useEffect`, never server-side. SSR-safe.

---

## Hindi / Devanagari

- `Plus Jakarta Sans` handles Devanagari glyphs for common UI strings
- For full coverage, pair with `Noto Sans Devanagari` as fallback: `font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif`
- All Hindi strings are pre-translated (not AI-generated) — stored in `translations.ts`
- Language toggle: pill button, top-right of lesson header, `EN ↔ HI` label
- AI chat: language param sent in API request → GPT-4o responds in selected language

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-27 | Initial design system created | /design-consultation — "serious science" brief |
| 2026-04-27 | Fraunces serif for display | No Indian edtech uses serifs; signals academic authority over playfulness |
| 2026-04-27 | Amber accent (#C8902A) not blue/teal | Every science app owns blue; amber reads as precision (brass instruments) with Indian warmth |
| 2026-04-27 | 70% viewport for simulation canvas | Simulation IS the product; investors and students should see that immediately |
| 2026-04-27 | Dark mode as primary | Three.js scenes require dark bg; Brilliant/NASA aesthetic reads as premium/serious |
| 2026-04-27 | Geist Mono for readouts | Makes live simulation data (pH, EMF, ATP, O₂) feel like real lab instruments |
| 2026-04-27 | Bottom-sheet AI chat | WhatsApp pattern; Indian users already understand it; doesn't compete with canvas |
| 2026-04-27 | preserveDrawingBuffer: true | Prior project learning — Three.js default clears buffer; screenshots go blank |
