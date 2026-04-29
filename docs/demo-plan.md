# Plan: 3 Demo Lessons for Investor Pitch

## Context

The "Science Education Comes Alive" platform has a locked cathedral plan (`ideation/cathedral-plan.md`) but zero code. The founder needs 3 interactive demo lessons — one each in Physics, Chemistry, Biology — to pitch investors and early customers. The goal is to demonstrate the core concept and unique value: verified simulations + AI Socratic misconception detection + generative variation (language/culture). Production-ready concerns (DPDP compliance, WhatsApp API, full misconception graph) are deferred.

Demo subjects chosen for maximum investor WOW (test: "could this be replaced by a YouTube video?"):
- **Physics:** Electromagnetic Induction — invisible phenomenon made visible. "Bijli kaise banti hai?" 9/10 WOW.
- **Chemistry:** Acid-Base + pH — Indian household substances, Digene moment. 8/10 WOW.
- **Biology:** Red Blood Cell Journey — camera flies inside a human artery. "Blood is blue inside" myth debunked live. 9/10 WOW.

---

## Demo Root

All code lives in a new `demo/` directory within the project:

```
/Users/deepakkarkala/Documents/work/personal_brand/ventures/science-ed-comes-alive/demo/
```

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + D3.js + Three.js + OpenAI SDK

**AI models:**
- Socratic guide: `gpt-5.5` (streaming)
- Misconception classifier: `gpt-5.5-mini` (cheap, fast)

---

## Directory Structure

```
demo/
├── package.json
├── next.config.js                        # SSR config + dynamic import guards
├── tailwind.config.js                    # India-first warm palette
├── tsconfig.json
├── .env.local                            # OPENAI_API_KEY
├── public/
│   └── assets/
│       └── hindi-strings.json            # Pre-translated Hindi for demo lessons
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Lesson selector (3 mission cards)
│   │   ├── lesson/[id]/page.tsx          # Dynamic lesson route
│   │   ├── teacher/page.tsx              # Mock teacher heatmap dashboard
│   │   └── api/
│   │       ├── socratic/route.ts         # OpenAI streaming SSE endpoint
│   │       └── misconception/route.ts    # Misconception classifier endpoint
│   ├── components/
│   │   ├── shell/
│   │   │   ├── LessonShell.tsx           # Phase state machine + session state
│   │   │   └── LanguageToggle.tsx        # EN ↔ HI toggle
│   │   ├── pedagogy/
│   │   │   ├── PredictPrompt.tsx         # Gate: forces prediction before experiment
│   │   │   ├── SocraticChat.tsx          # AI chat panel (streaming tokens)
│   │   │   ├── MisconceptionAlert.tsx    # Orange banner on misconception detect
│   │   │   └── ApplyCard.tsx             # Real-world application at lesson end
│   │   ├── simulations/
│   │   │   ├── physics/
│   │   │   │   ├── EMInductionScene.tsx  # Three.js: wire + field + bulb (dynamic import, ssr:false)
│   │   │   │   └── FieldControls.tsx     # Field strength preset selector (3 options)
│   │   │   ├── chemistry/
│   │   │   │   ├── BeakerSimulation.tsx  # D3.js SVG beaker + color transitions
│   │   │   │   └── SubstancePanel.tsx    # Drag-and-drop substance bottles
│   │   │   └── biology/
│   │   │       ├── BloodCircuitScene.tsx # Three.js: RBC journey through vessels (dynamic import, ssr:false)
│   │   │       └── HeartRateControl.tsx  # Heart rate preset slider (60-180 bpm)
│   │   └── demo/
│   │       ├── ParentSummaryPanel.tsx    # WhatsApp-style summary card
│   │       ├── TeacherHeatmap.tsx        # 30-student grid + misconception bar chart
│   │       └── KnowledgeGraph.tsx        # D3 force-directed 15-node concept graph
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── openaiClient.ts           # OpenAI SDK singleton
│   │   │   ├── socraticPrompts.ts        # 3 system prompt templates
│   │   │   └── misconceptionClassifier.ts# Heuristic tier-1 + GPT-4o-mini tier-2
│   │   ├── simulations/
│   │   │   ├── emInductionEngine.ts      # Pure TS: EMF = B × L × v, bulb brightness
│   │   │   ├── phEngine.ts               # Pure TS: pH lookup table
│   │   │   └── rbcEngine.ts              # Pure TS: O₂ saturation + RBC color (never blue)
│   │   ├── i18n/
│   │   │   ├── translations.ts           # ~80 EN/HI string pairs
│   │   │   └── useTranslation.ts         # Hook: t("key") → string
│   │   └── types/
│   │       ├── lesson.ts                 # LessonConfig, LessonPhase
│   │       ├── simulation.ts             # SimulationOutput (is_verified: true literal type)
│   │       └── misconception.ts          # MisconceptionEvent
│   └── data/
│       ├── lessons/
│       │   ├── lesson-01-em-induction.ts
│       │   ├── lesson-02-acid-base.ts
│       │   └── lesson-03-rbc-journey.ts
│       ├── knowledge-graph.ts            # 15 hardcoded concept nodes
│       └── teacher-mock-data.ts          # 30 mock students with misconception states
```

---

## Lesson 1 — Physics: Electromagnetic Induction

**NCERT:** Class 10, Chapter 13 (Magnetic Effects of Electric Current)  
**Target misconception:** "Electricity lives in batteries" — not that it's generated by moving conductors through magnetic fields

### Verified Physics Engine (`emInductionEngine.ts`)

Pure TypeScript, no AI involvement:
```typescript
const WIRE_LENGTH = 0.5  // 0.5m wire
const RESISTANCE = 10    // 10 ohms

interface EMFState {
  emf: number            // Volts: B × L × v
  current: number        // Amperes: emf / resistance
  bulbBrightness: number // 0-1, normalized
  electronDensity: number // for particle visualization
}

function computeEMF(velocity: number, fieldStrength: number): EMFState {
  const emf = fieldStrength * WIRE_LENGTH * Math.abs(velocity)
  const current = emf / RESISTANCE
  return {
    emf,
    current,
    bulbBrightness: Math.min(1, current * 5),
    electronDensity: Math.min(1, current * 8),
  }
}
```

Field strength presets (verified constants):
| Scenario | B (Tesla) | Cultural anchor |
|----------|-----------|-----------------|
| Bar magnet | 0.1T | School lab experiment |
| Horseshoe magnet | 0.5T | Stronger, more visible |
| Power plant turbine | 1.0T | "Bijli kaise banti hai?" |

Engine exports: `computeEMF(velocity, fieldStrength) → EMFState` — canvas reads these, AI never calls this.

### Three.js Scene (`EMInductionScene.tsx`)

Dynamic import with `ssr: false`. Procedural geometry — no external 3D assets:

- **Magnetic field lines:** `BufferGeometry` + `Points` — particles flow in closed loops from N to S pole, animating continuously
- **Magnets:** Two box meshes labeled N/S (saffron/green color coding)
- **Wire:** `CylinderGeometry` (silver), draggable along vertical axis via mouse/touch drag — position constrained to ±5 units
- **Electron flow:** `Points` traveling along wire path; particle density = `electronDensity`; direction reverses when wire direction reverses
- **Lightbulb:** Procedural mesh with emissive material; intensity = `bulbBrightness`; warm `PointLight` halo glow
- **Circuit trace:** `Line` geometry connecting wire → bulb → return path
- **Readouts:** 2D HTML overlays (EMF volts, current amps, bulb brightness %)

`FieldControls.tsx`: 3 preset buttons (bar magnet / horseshoe / power plant scale)

### AI Prompt — Lesson 1

System prompt (~650 tokens — keep identical across turns for OpenAI prefix caching):

```
You are Vigyan Dost ("Science Friend"), a Socratic guide for a 13-14 year old Indian student
learning Electromagnetic Induction (NCERT Class 10, Ch 13).

Rules:
- NEVER give the answer. Only ask questions.
- Max 2-3 sentences per response.
- Indian examples first (bijli ka khamba, ceiling fan, bicycle dynamo).
- Respond in [LANGUAGE].

Verified simulation state (do not contradict):
Wire velocity: [VELOCITY] m/s, Field: [FIELD]T, Bulb brightness: [BRIGHTNESS]%

Misconception triggers:
- "electricity in battery" / "battery se" / "battery mein" → ELECTRICITY_STORED_MYTH
- "magnet deta hai bijli" / "magnet gives electricity" → MAGNET_AS_SOURCE_MYTH

Socratic script (5 steps):
1. Wire stationary, bulb off: "The magnet is right there. Why isn't the bulb glowing?"
2. Student moves wire, bulb lights: "What changed? Did the magnet change?"
3. Stop wire, bulb off: "What needs to keep happening for the bulb to stay on?"
4. Bridge: "Your home has electricity. Is there a giant battery somewhere, or something moving?"
5. Apply: "Why does a bicycle dynamo light work only when you pedal?"
```

API call structure (`api/socratic/route.ts`):
```typescript
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const stream = await client.chat.completions.create({
  model: "gpt-4o",
  max_tokens: 150,    // Enforces Socratic brevity
  stream: true,
  messages: [
    { role: "system", content: LESSON_PROMPTS[lessonId] },  // consistent = cached
    ...sessionHistory,
    { role: "user", content: `STATE: ${JSON.stringify(simState)}\n\nSTUDENT: ${studentMessage}` }
  ]
})
```

### Misconception Detection — Lesson 1

**Tier 1 (heuristic, instant, free):**
```typescript
const KEYWORDS_L1 = [
  "battery", "battery se", "battery mein hai",
  "magnet deta hai", "magnet se milti", "magnet gives"
]
// returns { tag: "ELECTRICITY_STORED_MYTH", confidence: 0.85 } if matched
```

**Tier 2 (GPT-4o-mini, for free-text misses):**
```
Classify for EM induction misconceptions. Student said: "[RESPONSE]"
Return JSON: { "has_misconception": boolean, "confidence": number, "tag": "ELECTRICITY_STORED_MYTH" | "MAGNET_AS_SOURCE_MYTH" | "none" }
```

Threshold: confidence > 0.7 triggers `MisconceptionAlert` + corrective Socratic branch + logs `MisconceptionEvent` to session state.

### Investor WOW Moments — Lesson 1

1. Wire stationary next to magnet — bulb is off. Pause for effect. "The magnet is right there. Why no light?"
2. Drag wire through field — bulb lights, electrons visibly flow
3. Stop wire — instant dark. Every time, no exceptions.
4. Field preset → "Power plant scale" → bright glow, counters max out
5. Hindi toggle → entire UI + AI responses flip to Hindi
6. Apply card: "Every coal, hydro, and nuclear plant in India uses this exact effect — at massive scale."

---

## Lesson 2 — Chemistry: Acid-Base + pH

**NCERT:** Class 7 Ch 5 / Class 10  
**Target misconception:** "Acids are only in labs, not in food"

### Verified Chemistry Engine (`phEngine.ts`)

pH is a lookup table — not computed by AI:
```typescript
const SUBSTANCES = {
  lemon_juice:    { ph: 2.5, hindi: "नींबू पानी",   color: "#FF4444" },
  vinegar:        { ph: 3.0, hindi: "सिरका",          color: "#FF6633" },
  tamarind_water: { ph: 3.5, hindi: "इमली का पानी",  color: "#FF8844" },
  soda_water:     { ph: 5.5, hindi: "सोडा वाटर",     color: "#CCEE44" },
  milk:           { ph: 6.5, hindi: "दूध",             color: "#EEFF88" },
  baking_soda:    { ph: 8.5, hindi: "खाने का सोडा",  color: "#88BBFF" },
  antacid:        { ph: 9.5, hindi: "डाइजीन",         color: "#4488FF" },
}
```

Mixing rule (verified): `pH_mix = weighted average by drop count`  
Color map: pH 1-3 deep red → pH 7 green → pH 9-14 violet (NCERT standard indicator)

### D3.js Beaker (`BeakerSimulation.tsx`)

- React wrapper; D3 operations in `useEffect` (SSR-safe)
- SVG beaker with animated liquid fill; color transitions via D3 interpolation (800ms ease)
- pH meter: vertical gradient bar with animated cursor + large animated pH number
- Drop animation: circles fall 300ms → liquid color transitions → bubble particles on neutralization
- `SubstancePanel.tsx`: 7 draggable bottles with Indian imagery (tamarind pod, Digene packet)

### Investor WOW Moments — Lesson 2

1. Drag lemon juice → liquid turns deep red → pH swings to 2.5
2. AI: "Lemon juice is acidic. Have you ever eaten lemon? Did you burn?"
3. Drop antacid → bubble animation fires → liquid turns green
4. AI: "This is exactly what Digene does in your stomach after spicy food."

---

## Lesson 3 — Biology: Red Blood Cell Journey

**NCERT:** Class 10, Chapter 6 (Life Processes — Circulatory System)  
**Target misconceptions:**
1. "Blood is blue inside the body" (documented — ~50% of adults hold this)
2. "Heart is just a pump; the lungs do all the real work"

### Verified Biology Engine (`rbcEngine.ts`)

Pure TypeScript, no AI involvement:
```typescript
type CircuitPosition = "right_heart" | "lungs" | "left_heart" | "artery" | "capillary" | "muscle" | "vein"

interface RBCState {
  position: CircuitPosition
  o2Saturation: number    // 0-100
  co2Level: number        // inverse complement
  color: string           // computed — NEVER blue
  heartRate: number       // bpm
  distanceTraveled: number
  o2Delivered: number     // cumulative molecule count
}

const CIRCUIT_PHASES = [
  { position: "right_heart",  duration: 0.5,  o2Sat: 15,  label: "Deoxygenated blood pumped to lungs" },
  { position: "lungs",        duration: 2.0,  o2Sat: 98,  label: "O₂ loaded, CO₂ released" },
  { position: "left_heart",   duration: 0.5,  o2Sat: 97,  label: "Oxygenated blood pumped to body" },
  { position: "artery",       duration: 1.5,  o2Sat: 95,  label: "Traveling to muscle via artery" },
  { position: "capillary",    duration: 2.0,  o2Sat: 40,  label: "O₂ diffusing into muscle cells" },
  { position: "vein",         duration: 1.5,  o2Sat: 15,  label: "Returning to heart via vein" },
]

function computeRBCColor(o2Saturation: number): string {
  // Oxyhemoglobin (high O₂): bright red
  // Deoxyhemoglobin (low O₂): dark maroon — NOT blue
  const brightness = 0.4 + 0.6 * (o2Saturation / 100)
  const r = Math.round(220 * brightness)
  const g = Math.round(30 * brightness)
  const b = Math.round(30 * brightness)
  return `rgb(${r}, ${g}, ${b})`
}
```

### Three.js Scene (`BloodCircuitScene.tsx`)

Dynamic import with `ssr: false`. Procedural geometry — no external 3D assets:

- **Blood vessels:** Procedural `TubeGeometry` following a spline loop — arteries (brighter red, wider), veins (darker red, narrower). Camera follows the RBC particle continuously through the circuit.
- **Heart:** 4-chamber simplified box mesh at center. Scale pulses at `heartRate / 60` Hz. Emits RBC particles into pulmonary and systemic circuits.
- **Lungs:** Two alveoli clusters (sphere groups). Particle exchange: O₂ particles (blue-white) absorbed into RBC → RBC turns bright red; CO₂ particles (gray) released outward.
- **Muscle tissue:** Dark block at bottom. Color shifts from dark maroon to pink as O₂ arrives.
- **RBC particle:** Disc geometry traveling along `TubePath`. Color updates every frame via `computeRBCColor()`.
- **Readouts:** 2D HTML overlays — "O₂ saturation: X%", "O₂ delivered: N molecules", "Distance: X.Xm"

`HeartRateControl.tsx`: 4 presets — "Sleeping 60 | Walking 90 | Running 150 | Kabaddi Sprint 180"  
Higher heart rate = vessels pulse faster + more RBCs in circuit simultaneously.

### AI Prompt — Lesson 3

System prompt (~650 tokens — keep identical across turns for OpenAI prefix caching):

```
You are Vigyan Dost, a Socratic guide for a 13-14 year old Indian student
learning the Circulatory System (NCERT Class 10, Ch 6).

Rules:
- NEVER give the answer. Only ask questions.
- Max 2-3 sentences per response.
- Indian examples (kabaddi sprint, running to catch a bus, holding breath).
- Respond in [LANGUAGE].

Verified simulation state (do not contradict):
RBC position: [POSITION], O₂ saturation: [O2_SAT]%, RBC color: [COLOR], heart rate: [BPM]bpm

Misconception triggers:
- "blood is blue" / "andar neela" / "veins mein neela" → BLOOD_COLOR_MYTH
- "lungs do everything" / "heart is just pump" → CIRCULATORY_ISOLATION_MYTH

Socratic script (5 steps):
1. RBC in vein (dark red): "What color is the blood right now? Look at the simulation."
2. On BLOOD_COLOR_MYTH: "The simulation shows dark red, not blue. What does the blue vein wall look like?"
3. RBC loads O₂ at lungs, turns bright: "It changed color. What did the red blood cell pick up?"
4. Bridge: "When you sprint in kabaddi and your heart races, what do you think it's trying to do?"
5. Apply: "Why do your cheeks turn red when you run hard?"
```

### Misconception Detection — Lesson 3

**Tier 1 (heuristic, instant, free):**
```typescript
const KEYWORDS_L3 = [
  "blue", "neela", "andar neela", "veins mein neela",
  "heart is just", "lungs do everything", "sirf pump"
]
```

**Tier 2 (GPT-4o-mini, for free-text misses):**
```
Classify for circulatory system misconceptions. Student said: "[RESPONSE]"
Return JSON: { "has_misconception": boolean, "confidence": number, "tag": "BLOOD_COLOR_MYTH" | "CIRCULATORY_ISOLATION_MYTH" | "none" }
```

Threshold: confidence > 0.7 triggers `MisconceptionAlert` + corrective Socratic branch.

### Investor WOW Moments — Lesson 3

1. Scene loads — camera is flying through a red artery at 60fps. No narration needed.
2. RBC arrives at lungs → particle exchange → turns bright red. Live, every circuit loop.
3. Student/presenter types "blood is blue inside" → banner fires immediately
4. AI: "Look at the color in the simulation right now. Is that blue?"
5. Increase heart rate to 180 bpm → vessels pulse rapidly → O₂ counter rockets
6. Hindi toggle: "Khoon andar se lal hai — dark red, kabhi neela nahi!"
7. Apply card: "Why do athletes have a lower resting heart rate than non-athletes?"

---

## AI Integration Layer

### OpenAI Client (`openaiClient.ts`)

```typescript
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
export default openai
```

### Streaming Endpoint (`api/socratic/route.ts`)

```typescript
// Keep system prompt identical across turns → OpenAI auto-caches prefix ≥1024 tokens
const stream = await openai.chat.completions.create({
  model: "gpt-4o",
  max_tokens: 150,
  stream: true,
  messages: [
    { role: "system", content: LESSON_PROMPTS[lessonId] },
    ...sessionHistory,
    { role: "user", content: `STATE: ${JSON.stringify(simState)}\n\nSTUDENT: ${studentMessage}` }
  ]
})

// Return as SSE to client
for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content ?? ""
  controller.enqueue(encoder.encode(`data: ${token}\n\n`))
}
```

### Misconception Endpoint (`api/misconception/route.ts`)

Uses `gpt-4o-mini` — classification is a small task:
```typescript
const result = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  max_tokens: 60,
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: "Classify student response for science misconceptions. Return JSON only." },
    { role: "user", content: `Lesson: ${lessonId}\nStudent said: "${studentResponse}"\n\nReturn: { "has_misconception": boolean, "confidence": number, "tag": string }` }
  ]
})
```

### Critical Invariant

`SimulationOutput` type has `is_verified: true` as a TypeScript **literal type** — compile-time guarantee that no component can display simulation data without passing through a verified engine. AI receives these outputs; it never produces them.

### Phase State Machine (`LessonShell.tsx`)

`PREDICT → EXPERIMENT → OBSERVE → EXPLAIN → APPLY`

- Students cannot skip prediction — `EXPERIMENT` button disabled until prediction submitted
- Socratic chat only available after first experiment run
- Apply card only appears after ≥2 AI exchange turns

---

## Cross-Cutting Demo Features

### Language Switch

~80 EN/HI string pairs in `translations.ts`. `useTranslation(lang)` hook used by all components. Language passed in API request body → GPT responds in selected language. Noto Sans covers both scripts without font-swap flash. Hindi strings pre-translated by human for the 3 demo lessons.

### Parent Summary Panel (`ParentSummaryPanel.tsx`)

WhatsApp-style card (green header, rounded corners, delivered ticks). Generated from template + session data — no API call. Key content:
- Concepts learned
- Misconceptions corrected
- **Dinner-table question** (high-value for investor pitch)
- Next lesson preview

### Teacher Heatmap (`teacher/page.tsx`)

30 mock students from `teacher-mock-data.ts`. 6×5 grid color-coded: green (no misconception), orange (corrected in session), red (not corrected). Recharts bar chart of misconception frequency. Recommendation card: "18/30 students showed ELECTRICITY_STORED_MYTH — tomorrow start with the bicycle dynamo demo."

### Knowledge Graph (`KnowledgeGraph.tsx`)

D3 force-directed layout, 15 hardcoded nodes. Current lesson highlighted (saffron). Completed = green. Adjacent unlocked = dashed border. Click = NCERT chapter tooltip. Non-demo lessons show "Coming Soon."

---

## Investor Demo Script (12–15 min)

1. **Landing** — 3 mission cards. "Teacher sends a WhatsApp link. No app store."
2. **Lesson 1 (Physics)** — Wire stationary next to magnet, bulb off. "The magnet is right there. Why no light?" Drag wire through field — bulb lights. Stop — instant dark. Hindi toggle. Apply card: "Every power plant in India uses this exact effect."
3. **Lesson 2 (Chemistry)** — Drag lemon juice, liquid turns deep red. Drop antacid, bubble animation, green. "This is Digene in your stomach."
4. **Lesson 3 (Biology)** — Camera flies through a red artery. RBC loads O₂ at lungs, turns bright. Type "blood is blue" → banner fires. Increase heart rate to 180bpm → counter rockets. Parent summary slides up.
5. **Teacher view** — "18/30 kids showed ELECTRICITY_STORED_MYTH before correction."
6. **The pitch**: "AI never generates the science. Misconception graph compounds. WhatsApp distribution — no app store tax."

**Contingency:** `DEMO_MODE=true` env flag uses pre-recorded fixture responses instead of live API calls.

---

## Build Sequence (3 weeks)

**Week 1 — Scaffold + Lesson 1 (EM Induction)**
1. `package.json`, `next.config.js`, `tailwind.config.js`, TypeScript config
2. All type definitions in `src/lib/types/`
3. `emInductionEngine.ts` — pure physics (EMF = B × L × v)
4. `openaiClient.ts` + `api/socratic/route.ts` — verify streaming
5. `EMInductionScene.tsx` (Three.js, dynamic import ssr:false) + `FieldControls.tsx`
6. `PredictPrompt.tsx` + `SocraticChat.tsx` + `MisconceptionAlert.tsx`
7. `LessonShell.tsx` — wire phase state machine
8. End-to-end: drag wire → bulb lights → predict → ELECTRICITY_STORED_MYTH fires → AI response

**Week 2 — Lessons 2 + 3**
9. `phEngine.ts` + `BeakerSimulation.tsx` (D3) + `SubstancePanel.tsx`
10. `rbcEngine.ts` + `BloodCircuitScene.tsx` (Three.js, dynamic import) + `HeartRateControl.tsx`
11. System prompts for all 3 lessons in `socraticPrompts.ts`
12. `ApplyCard.tsx` + all lesson data files

**Week 3 — Cross-cutting + Polish**
13. `translations.ts` (EN/HI) + `LanguageToggle.tsx`
14. `ParentSummaryPanel.tsx` + `TeacherHeatmap.tsx` + `KnowledgeGraph.tsx`
15. `teacher/page.tsx`
16. Mobile QA on Android Chrome
17. Performance pass: both Three.js scenes < 3s load on mid-range Android
18. `DEMO_MODE` fixture fallback

**Key dependencies:**
```json
{
  "next": "^14",
  "react": "^18",
  "typescript": "^5",
  "d3": "^7",
  "three": "^0.163",
  "@types/three": "^0.163",
  "openai": "^4",
  "recharts": "^2.12",
  "tailwindcss": "^3.4"
}
```

Note: p5.js removed from dependencies — both Lessons 1 and 3 use Three.js, not p5. Only D3 remains for the chemistry beaker.

---

## Verification

1. All 3 lessons accessible at `/lesson/1`, `/lesson/2`, `/lesson/3`; teacher at `/teacher`
2. **Physics:** wire stationary → bulb off. Drag wire → bulb brightness proportional to velocity. Misconception banner fires on "battery" keyword.
3. **Chemistry:** 7 substances drag-drop. pH + color match lookup table. Bubble animation on acid+base mix.
4. **Biology:** RBC color cycles from dark red (vein) → bright red (post-lungs) and back. Banner fires on "blue" keyword. Heart rate slider changes pulse speed.
5. Language toggle flips all UI strings to Hindi; GPT responds in Hindi.
6. Parent summary panel appears after any lesson completion with dinner-table question.
7. Teacher heatmap renders 30 students with correct color coding.
8. `DEMO_MODE=true` fixtures work end-to-end (no API key needed).
