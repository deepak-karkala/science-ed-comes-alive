# Spec: Vigyan Dost Investor Demo

## Assumptions

1. This is a browser-based mobile-first PWA demo, not a native mobile app.
2. All implementation code lives under `demo/`; ideation docs remain outside the app.
3. This directory is not a git repo today, but it will become one soon, so generated secrets, dependency folders, and build artifacts must be git-ignoreable from the start.
4. The demo must work without an OpenAI API key when `DEMO_MODE=true`.
5. `docs/demo-plan.md` is the product source of truth and `docs/DESIGN.md` is the visual source of truth.
6. Production concerns explicitly deferred in the plan, including DPDP compliance, WhatsApp API integration, auth, persistence, and the full misconception graph, stay out of this demo.

## Objective

Build a fresh `demo/` Next.js app for an investor and early-customer pitch of "Science Education Comes Alive." The app must demonstrate three interactive science lessons for Indian students age 10-14:

- Physics: electromagnetic induction with verified EMF computation and visible current generation.
- Chemistry: acid-base pH with household substances and neutralization.
- Biology: red blood cell journey with oxygen saturation, never-blue blood, and heart-rate changes.

The demo must prove the core product claim: AI can guide learning and detect misconceptions, but verified simulation engines own the science. Success means a presenter can complete a 12-15 minute pitch path across the landing page, three lessons, parent summary, and teacher heatmap without live API dependency.

## Tech Stack

- Next.js 14 App Router, React 18, TypeScript 5.
- Tailwind CSS 3.4 for layout and design tokens.
- Three.js 0.163 for Physics and Biology procedural 3D scenes.
- D3 7 for Chemistry beaker and knowledge graph SVG interactions.
- Recharts 2.12 for the teacher misconception chart.
- OpenAI SDK 4 for Socratic streaming and fallback misconception classification.
- Vitest and React Testing Library for unit and component tests.
- Playwright for browser verification of key routes and nonblank simulations.

## Commands

Run commands from `demo/` after scaffold exists:

```bash
npm install
npm run dev
npm run build
npm run lint
npm test
npm run test:watch
npm run test:e2e
DEMO_MODE=true npm run dev
```

Expected package scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "typecheck": "tsc --noEmit"
}
```

Before any future git commit, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Project Structure

```text
demo/
  package.json
  next.config.js
  tailwind.config.js
  tsconfig.json
  .env.example
  .gitignore
  public/assets/
  src/app/
    layout.tsx
    page.tsx
    lesson/[id]/page.tsx
    teacher/page.tsx
    api/socratic/route.ts
    api/misconception/route.ts
  src/components/
    shell/
    pedagogy/
    simulations/
    demo/
  src/data/
    lessons/
    knowledge-graph.ts
    teacher-mock-data.ts
  src/lib/
    ai/
    i18n/
    simulations/
    types/
  src/test/
  e2e/
```

Tests should sit near the behavior they prove when practical, using `*.test.ts` or `*.test.tsx`. Browser tests live in `demo/e2e/`.

## Code Style

Use small typed functions for verified logic and pass verified outputs into UI and AI layers. AI code may consume simulation state but must never generate scientific state.

```typescript
export interface EMFState {
  is_verified: true
  emf: number
  current: number
  bulbBrightness: number
  electronDensity: number
}

export function computeEMF(velocity: number, fieldStrength: number): EMFState {
  const emf = fieldStrength * 0.5 * Math.abs(velocity)
  const current = emf / 10

  return {
    is_verified: true,
    emf,
    current,
    bulbBrightness: Math.min(1, current * 5),
    electronDensity: Math.min(1, current * 8),
  }
}
```

Conventions:

- Prefer pure TypeScript engines for science rules.
- Keep React components focused and accessible; use native controls before custom interactions.
- Use `dynamic(..., { ssr: false })` for Three.js scenes.
- Run D3 DOM operations only in `useEffect`.
- Use CSS custom properties from `DESIGN.md`; avoid ad hoc palettes.
- Use `preserveDrawingBuffer: true` in Three.js renderers.
- Use Hindi strings from translation files, not runtime AI translation.

## Testing Strategy

- Unit tests cover all pure simulation engines and heuristic misconception detection.
- Component tests cover prediction gating, phase transitions, language toggle behavior, chat fixture behavior, and apply-card unlock after at least two AI exchanges.
- API tests cover `DEMO_MODE`, missing API key handling, SSE response shape, JSON misconception response shape, and heuristic-first classification.
- Browser tests cover `/`, `/lesson/1`, `/lesson/2`, `/lesson/3`, and `/teacher`.
- Visual runtime checks must confirm Three.js canvases are nonblank, the D3 beaker changes color, Hindi text renders, and mobile layouts do not overlap.

Minimum acceptance before calling the demo ready:

```bash
npm run lint
npm run typecheck
npm test
npm run build
DEMO_MODE=true npm run test:e2e
```

## Boundaries

Always:

- Keep all implementation under `demo/`.
- Preserve the invariant that displayed science comes from verified engines with `is_verified: true`.
- Provide `DEMO_MODE=true` fixtures for API-independent presentation.
- Add or update tests for pure logic and behavior changes.
- Keep `.env.local`, `node_modules`, `.next`, coverage, and Playwright reports out of future git tracking.

Ask first:

- Adding dependencies not named in the plan or required by the selected test tooling.
- Changing the lesson topics, misconception targets, or visual direction.
- Introducing persistence, authentication, external storage, or production WhatsApp integration.
- Replacing the specified model family or changing live AI behavior beyond demo fallbacks.

Never:

- Commit API keys or secrets.
- Let AI-generated values override verified simulation outputs.
- Use blue or purple for RBC blood color.
- Run D3 on the server.
- Add production compliance scope that the demo plan explicitly deferred.
- Remove or weaken tests to make a build pass.

## Success Criteria

- The app has routes `/`, `/lesson/1`, `/lesson/2`, `/lesson/3`, and `/teacher`.
- Landing page shows three mission cards and visually matches the Scientific-Warm Dark design system.
- Physics lesson: stationary wire leaves bulb off; moving wire makes brightness proportional to velocity and field strength; "battery" triggers `ELECTRICITY_STORED_MYTH`.
- Chemistry lesson: seven household substances update pH and indicator color from the lookup table; acid-base mixing shows neutralization feedback.
- Biology lesson: RBC color cycles dark red to bright red and never blue; "blood is blue" triggers `BLOOD_COLOR_MYTH`; heart rate changes pulse speed/readouts.
- Language toggle switches core UI strings between English and Hindi across lessons.
- Parent summary appears after lesson completion with concepts, misconceptions, dinner-table question, and next lesson.
- Teacher dashboard renders 30 mock students, misconception color states, bar chart, and recommendation card.
- `DEMO_MODE=true` supports the full investor demo without OpenAI calls or `OPENAI_API_KEY`.
- Browser verification confirms mobile layout, nonblank WebGL/SVG simulations, no console errors on the investor path, and build passes.

## Open Questions

- None blocking. Default to the documented plan and design system unless the product brief changes.

