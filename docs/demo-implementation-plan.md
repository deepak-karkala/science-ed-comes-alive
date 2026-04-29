# Implementation Plan: Vigyan Dost Investor Demo

## Overview

Build the `demo/` Next.js app in dependency order: scaffold first, then verified science engines and shared contracts, then one end-to-end lesson slice, then the remaining lessons, then cross-cutting investor-demo surfaces and browser verification. Each task is scoped to leave the app buildable and testable.

## Architecture Decisions

- Keep all app code under `demo/` so the future git repo can track implementation cleanly without mixing ideation docs and build artifacts.
- Put science rules in pure TypeScript engines with `is_verified: true`; UI and AI endpoints consume these outputs but never create scientific state.
- Use `DEMO_MODE=true` as a first-class runtime path so the investor pitch works without `OPENAI_API_KEY`.
- Build Lesson 1 as the first vertical slice because it exercises the core platform loop: verified simulation, prediction gate, misconception detection, Socratic chat, language toggle, and apply card.

## Dependency Graph

```text
Scaffold + toolchain
  -> Shared types + design tokens
    -> Verified engines + unit tests
      -> Lesson data + i18n
        -> Lesson shell state machine
          -> Lesson simulation components
            -> AI API contracts + demo fixtures
              -> Cross-cutting parent/teacher/graph surfaces
                -> E2E + browser visual verification
```

## Task List

### Phase 1: Foundation

## Task 1: Scaffold the demo app

**Description:** Create the Next.js app shell under `demo/` with package scripts, TypeScript, Tailwind, test tooling, app routes, `.env.example`, and `.gitignore` suitable for the future git repo.

**Acceptance criteria:**
- [x] `demo/` contains runnable Next.js 14 App Router project files.
- [x] Routes `/`, `/lesson/[id]`, and `/teacher` exist with temporary build-safe placeholders.
- [x] `.gitignore` excludes `.env.local`, `node_modules`, `.next`, coverage, and Playwright reports.

**Verification:**
- [x] `npm install`
- [x] `npm run typecheck`
- [x] `npm run build`

**Dependencies:** None

**Files likely touched:**
- `demo/package.json`
- `demo/next.config.js`
- `demo/tailwind.config.js`
- `demo/tsconfig.json`
- `demo/src/app/*`

**Estimated scope:** Medium

## Task 2: Add design tokens and base layout

**Description:** Implement the Scientific-Warm Dark design system from `DESIGN.md` in global CSS and the root layout, including fonts, CSS variables, base typography, focus states, and stable page constraints.

**Acceptance criteria:**
- [ ] Root layout loads Fraunces, Plus Jakarta Sans/Noto Sans Devanagari fallback, and Geist Mono.
- [ ] Global CSS defines the documented color, spacing, radius, motion, button, input, banner, and phase-dot tokens.
- [ ] Placeholder pages render with dark background, warm text, accessible focus styles, and no layout overflow on mobile widths.

**Verification:**
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Manual check: `/`, `/lesson/1`, and `/teacher` placeholders visually use the design tokens.

**Dependencies:** Task 1

**Files likely touched:**
- `demo/src/app/layout.tsx`
- `demo/src/app/globals.css`
- `demo/tailwind.config.js`

**Estimated scope:** Small

## Task 3: Define shared types and route contracts

**Description:** Add shared TypeScript contracts for lesson configuration, phases, simulation outputs, AI chat messages, misconception events, language, and API request/response payloads.

**Acceptance criteria:**
- [ ] `SimulationOutput` requires `is_verified: true`.
- [ ] Lesson IDs, phases, languages, misconception tags, and chat message shapes are strongly typed.
- [ ] API request and response types exist for `/api/socratic` and `/api/misconception`.

**Verification:**
- [ ] `npm run typecheck`
- [ ] Type-only imports compile from placeholder routes.

**Dependencies:** Task 1

**Files likely touched:**
- `demo/src/lib/types/lesson.ts`
- `demo/src/lib/types/simulation.ts`
- `demo/src/lib/types/misconception.ts`
- `demo/src/lib/types/ai.ts`

**Estimated scope:** Small

## Task 4: Implement verified science engines

**Description:** Build pure TypeScript engines for EM induction, pH mixing, and RBC circuit/color state.

**Acceptance criteria:**
- [ ] `computeEMF(velocity, fieldStrength)` returns EMF/current/brightness/electron density with `is_verified: true`.
- [ ] `computePHMix(drops)` returns lookup-backed weighted pH, indicator color, and `is_verified: true`.
- [ ] `computeRBCState(...)` and `computeRBCColor(...)` keep RBC color in red/maroon ranges and never blue/purple.

**Verification:**
- [ ] `npm test -- src/lib/simulations`
- [ ] `npm run typecheck`

**Dependencies:** Task 3

**Files likely touched:**
- `demo/src/lib/simulations/emInductionEngine.ts`
- `demo/src/lib/simulations/phEngine.ts`
- `demo/src/lib/simulations/rbcEngine.ts`
- `demo/src/lib/simulations/*.test.ts`

**Estimated scope:** Medium

### Checkpoint: Foundation

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

### Phase 2: Lesson Framework

## Task 5: Add lesson data and i18n

**Description:** Encode the three lesson configs, static EN/HI strings, knowledge graph data, and teacher mock data needed by the shell and selector pages.

**Acceptance criteria:**
- [ ] Lesson configs include title, NCERT reference, subject, misconception targets, apply prompt, summary copy, and route ID.
- [ ] Translation hook returns English and Hindi strings with stable keys and fallback behavior.
- [ ] Teacher mock data includes 30 students and misconception states matching the demo script.

**Verification:**
- [ ] `npm test -- src/lib/i18n`
- [ ] `npm run typecheck`

**Dependencies:** Task 3

**Files likely touched:**
- `demo/src/data/lessons/*`
- `demo/src/data/knowledge-graph.ts`
- `demo/src/data/teacher-mock-data.ts`
- `demo/src/lib/i18n/*`

**Estimated scope:** Medium

## Task 6: Build landing page lesson selector

**Description:** Replace the placeholder landing page with three mission cards and navigation into the lessons, using the design system and real lesson data.

**Acceptance criteria:**
- [ ] Landing page shows Physics, Chemistry, and Biology mission cards with NCERT anchors and investor-friendly value statements.
- [ ] Each card links to `/lesson/1`, `/lesson/2`, or `/lesson/3`.
- [ ] Layout is mobile-first and does not use generic marketing hero/card-heavy patterns beyond the actual lesson cards.

**Verification:**
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Manual check: cards navigate correctly.

**Dependencies:** Tasks 2, 5

**Files likely touched:**
- `demo/src/app/page.tsx`
- `demo/src/components/demo/LessonCard.tsx`
- `demo/src/data/lessons/index.ts`

**Estimated scope:** Small

## Task 7: Implement lesson shell state machine

**Description:** Build `LessonShell` with phase gating, prediction state, language selection, simulation state handoff, AI exchange count, misconception event logging, and apply-card unlock.

**Acceptance criteria:**
- [ ] Student cannot enter `EXPERIMENT` until prediction is submitted.
- [ ] Socratic chat unlocks only after first experiment interaction.
- [ ] Apply card appears after at least two AI exchange turns.

**Verification:**
- [ ] `npm test -- LessonShell`
- [ ] `npm run typecheck`

**Dependencies:** Tasks 3, 5

**Files likely touched:**
- `demo/src/components/shell/LessonShell.tsx`
- `demo/src/components/shell/LanguageToggle.tsx`
- `demo/src/components/pedagogy/PredictPrompt.tsx`
- `demo/src/components/pedagogy/ApplyCard.tsx`
- `demo/src/components/shell/LessonShell.test.tsx`

**Estimated scope:** Medium

### Checkpoint: Lesson Framework

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Manual check: landing -> lesson placeholder flow works.

### Phase 3: Lesson 1 Vertical Slice

## Task 8: Build Physics controls and verified scene wrapper

**Description:** Implement the field preset controls and an SSR-safe Physics scene component that reads from `computeEMF`, exposes simulation state to `LessonShell`, and renders stable readouts.

**Acceptance criteria:**
- [ ] Field presets map to 0.1T, 0.5T, and 1.0T.
- [ ] Stationary wire produces zero brightness; moving wire increases brightness proportionally.
- [ ] Three.js renderer uses `preserveDrawingBuffer: true` and is loaded with `ssr: false`.

**Verification:**
- [ ] `npm test -- emInductionEngine`
- [ ] `npm run build`
- [ ] Manual check: `/lesson/1` scene area renders nonblank and readouts update.

**Dependencies:** Tasks 4, 7

**Files likely touched:**
- `demo/src/components/simulations/physics/FieldControls.tsx`
- `demo/src/components/simulations/physics/EMInductionScene.tsx`
- `demo/src/app/lesson/[id]/page.tsx`

**Estimated scope:** Medium

## Task 9: Add misconception classifier core

**Description:** Implement heuristic-first misconception classification for Physics and Biology, with typed confidence/tag output and no network dependency for heuristic hits.

**Acceptance criteria:**
- [ ] Physics keywords trigger `ELECTRICITY_STORED_MYTH` or `MAGNET_AS_SOURCE_MYTH` above threshold.
- [ ] Biology keywords trigger `BLOOD_COLOR_MYTH` or `CIRCULATORY_ISOLATION_MYTH` above threshold.
- [ ] Unknown text returns no misconception without throwing.

**Verification:**
- [ ] `npm test -- misconceptionClassifier`
- [ ] `npm run typecheck`

**Dependencies:** Task 3

**Files likely touched:**
- `demo/src/lib/ai/misconceptionClassifier.ts`
- `demo/src/lib/ai/misconceptionClassifier.test.ts`
- `demo/src/lib/types/misconception.ts`

**Estimated scope:** Small

## Task 10: Build Socratic chat and API fixtures

**Description:** Implement `SocraticChat`, `MisconceptionAlert`, the Socratic SSE route, the misconception JSON route, OpenAI client wrapper, and `DEMO_MODE` fixture responses.

**Acceptance criteria:**
- [ ] `DEMO_MODE=true` returns deterministic Socratic tokens and misconception responses without `OPENAI_API_KEY`.
- [ ] Without `DEMO_MODE` and without API key, endpoints fail with a clear non-secret error.
- [ ] Chat posts verified simulation state and updates exchange count for apply-card unlock.

**Verification:**
- [ ] `npm test -- api`
- [ ] `npm run build`
- [ ] Manual check: `/lesson/1` can show a fixture AI response and misconception banner.

**Dependencies:** Tasks 7, 9

**Files likely touched:**
- `demo/src/components/pedagogy/SocraticChat.tsx`
- `demo/src/components/pedagogy/MisconceptionAlert.tsx`
- `demo/src/app/api/socratic/route.ts`
- `demo/src/app/api/misconception/route.ts`
- `demo/src/lib/ai/*`

**Estimated scope:** Medium

## Task 11: Complete Lesson 1 end-to-end

**Description:** Wire the Physics lesson data, scene, prediction prompt, controls, chat, alert, language toggle, and apply card into a complete demo flow.

**Acceptance criteria:**
- [ ] `/lesson/1` supports predict -> experiment -> observe/explain -> apply.
- [ ] Typing "battery" triggers `ELECTRICITY_STORED_MYTH` and visible alert.
- [ ] Hindi toggle switches core UI strings and sends selected language to chat requests.

**Verification:**
- [ ] `DEMO_MODE=true npm run test:e2e -- lesson-1`
- [ ] `npm run build`
- [ ] Manual check: investor Physics script can be performed.

**Dependencies:** Tasks 8, 10

**Files likely touched:**
- `demo/src/app/lesson/[id]/page.tsx`
- `demo/src/components/shell/LessonShell.tsx`
- `demo/src/data/lessons/lesson-01-em-induction.ts`
- `demo/e2e/lesson-1.spec.ts`

**Estimated scope:** Medium

### Checkpoint: Lesson 1

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `DEMO_MODE=true npm run test:e2e -- lesson-1`
- [ ] Human review: Lesson 1 pitch path feels investor-demo ready.

### Phase 4: Lessons 2 and 3

## Task 12: Build Chemistry lesson slice

**Description:** Implement the D3 beaker, substance panel, pH readouts, neutralization feedback, and lesson integration for `/lesson/2`.

**Acceptance criteria:**
- [ ] Seven substances update pH and indicator color from the lookup table.
- [ ] Acid-base mixing shows visible neutralization feedback.
- [ ] D3 operations run only in `useEffect` and build under SSR.

**Verification:**
- [ ] `npm test -- phEngine`
- [ ] `npm run build`
- [ ] Manual check: `/lesson/2` pH flow works in `DEMO_MODE=true`.

**Dependencies:** Tasks 4, 7, 10

**Files likely touched:**
- `demo/src/components/simulations/chemistry/BeakerSimulation.tsx`
- `demo/src/components/simulations/chemistry/SubstancePanel.tsx`
- `demo/src/data/lessons/lesson-02-acid-base.ts`
- `demo/e2e/lesson-2.spec.ts`

**Estimated scope:** Medium

## Task 13: Build Biology lesson slice

**Description:** Implement the RBC circuit scene, heart-rate control, red-only RBC state visualization, biology misconception path, and lesson integration for `/lesson/3`.

**Acceptance criteria:**
- [ ] RBC cycles dark red to bright red and never blue/purple.
- [ ] Heart-rate presets update pulse/readouts for 60, 90, 150, and 180 bpm.
- [ ] Typing "blood is blue" triggers `BLOOD_COLOR_MYTH` and a corrective Socratic fixture path.

**Verification:**
- [ ] `npm test -- rbcEngine`
- [ ] `npm run build`
- [ ] Manual check: `/lesson/3` scene is nonblank and heart-rate controls work.

**Dependencies:** Tasks 4, 7, 10

**Files likely touched:**
- `demo/src/components/simulations/biology/BloodCircuitScene.tsx`
- `demo/src/components/simulations/biology/HeartRateControl.tsx`
- `demo/src/data/lessons/lesson-03-rbc-journey.ts`
- `demo/e2e/lesson-3.spec.ts`

**Estimated scope:** Medium

### Checkpoint: Three Lessons

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `DEMO_MODE=true npm run test:e2e -- lesson-1 lesson-2 lesson-3`

### Phase 5: Investor Demo Surfaces

## Task 14: Add parent summary panel

**Description:** Build the WhatsApp-style parent summary generated from local lesson/session data without an API call.

**Acceptance criteria:**
- [ ] Summary includes concepts learned, misconceptions corrected, dinner-table question, and next lesson preview.
- [ ] Panel appears after lesson completion.
- [ ] Styling is readable on mobile and consistent with the design system while using WhatsApp-style summary cues.

**Verification:**
- [ ] `npm test -- ParentSummaryPanel`
- [ ] Manual check: completing any lesson shows the panel.

**Dependencies:** Tasks 5, 7

**Files likely touched:**
- `demo/src/components/demo/ParentSummaryPanel.tsx`
- `demo/src/components/demo/ParentSummaryPanel.test.tsx`
- `demo/src/components/shell/LessonShell.tsx`

**Estimated scope:** Small

## Task 15: Add teacher dashboard

**Description:** Implement `/teacher` with the 30-student heatmap, misconception frequency chart, and recommendation card.

**Acceptance criteria:**
- [ ] Heatmap renders 30 students in green/orange/red states.
- [ ] Bar chart shows misconception frequency using mock data.
- [ ] Recommendation card matches the investor demo script.

**Verification:**
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Manual check: `/teacher` renders without console errors.

**Dependencies:** Task 5

**Files likely touched:**
- `demo/src/app/teacher/page.tsx`
- `demo/src/components/demo/TeacherHeatmap.tsx`
- `demo/src/data/teacher-mock-data.ts`

**Estimated scope:** Small

## Task 16: Add knowledge graph

**Description:** Implement the D3 knowledge graph with current/completed/adjacent concept states and NCERT chapter tooltips.

**Acceptance criteria:**
- [ ] Graph renders 15 hardcoded nodes with the active lesson highlighted in amber.
- [ ] Completed nodes render green and adjacent locked/unlocked state is visually distinct.
- [ ] Tooltip shows NCERT chapter context on click/focus.

**Verification:**
- [ ] `npm run build`
- [ ] Manual check: graph renders on landing or lesson context without SSR errors.

**Dependencies:** Task 5

**Files likely touched:**
- `demo/src/components/demo/KnowledgeGraph.tsx`
- `demo/src/data/knowledge-graph.ts`
- `demo/src/app/page.tsx`

**Estimated scope:** Small

### Checkpoint: Investor Surfaces

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Manual check: 12-15 minute investor script is navigable in `DEMO_MODE=true`.

### Phase 6: Final Verification and Review

## Task 17: Add end-to-end investor path tests

**Description:** Add Playwright coverage for the critical pitch routes and interactions, including mobile viewport checks and nonblank simulation assertions.

**Acceptance criteria:**
- [ ] E2E tests visit `/`, all three lessons, and `/teacher`.
- [ ] Tests verify no obvious text overlap on mobile viewport and no console errors on the investor path.
- [ ] Tests confirm WebGL/SVG simulation containers are nonblank or contain rendered primitives.

**Verification:**
- [ ] `DEMO_MODE=true npm run test:e2e`

**Dependencies:** Tasks 11, 12, 13, 15

**Files likely touched:**
- `demo/playwright.config.ts`
- `demo/e2e/investor-path.spec.ts`
- `demo/e2e/helpers.ts`

**Estimated scope:** Small

## Task 18: Final quality pass

**Description:** Run the full verification suite, fix issues found within scope, and produce a short readiness note for the future git repo.

**Acceptance criteria:**
- [ ] Full verification commands pass.
- [ ] `.env.example` documents `OPENAI_API_KEY` and `DEMO_MODE`.
- [ ] Any remaining known limitations are documented in a concise note.

**Verification:**
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `DEMO_MODE=true npm run test:e2e`

**Dependencies:** All previous tasks

**Files likely touched:**
- `demo/.env.example`
- `demo/README.md`
- Small fixes in files identified by verification

**Estimated scope:** Medium

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---:|---|
| WebGL scenes can become blank or SSR-incompatible | High | Dynamic import scenes with `ssr:false`; set `preserveDrawingBuffer:true`; add browser nonblank checks. |
| Live OpenAI dependency can break investor demo | High | Implement `DEMO_MODE=true` fixtures before final polish; test full path without API key. |
| Scope creep into production platform concerns | Medium | Keep auth, persistence, DPDP, WhatsApp API, and full graph out of scope unless explicitly approved. |
| UI can drift into generic AI-looking design | Medium | Apply `DESIGN.md` tokens from Task 2 and verify mobile screenshots before completion. |
| Three.js/D3 testability can be weak | Medium | Unit-test pure engines and use browser checks only for rendering/runtime behavior. |

## Parallelization Opportunities

- After Task 4, engine tests and lesson data can be improved independently.
- After Task 10, Lesson 2 and Lesson 3 can be built in parallel if each worker owns separate simulation directories and lesson data files.
- Teacher dashboard, parent summary, and knowledge graph can be parallelized after Task 5 because they use mock/static data.
- Final code review, security audit, and test coverage review can run in parallel after Task 18 using the `.codex/agents/agents` personas.

## Open Questions

- None blocking. Use `docs/demo-spec.md`, `docs/demo-plan.md`, and `docs/DESIGN.md` as the implementation sources of truth.
