# Science Education Comes Alive — CLAUDE.md

## Project Overview
India-first interactive science education platform. Verified simulations + AI Socratic misconception detection. NCERT Classes 6–10. Mobile-first PWA.

Key docs:
- `ideation/cathedral-plan.md` — locked product strategy (read before any feature work)
- `ideation/demo-plan.md` — 3 investor demo lessons (EM Induction, Acid-Base, RBC Journey)
- `ideation/DESIGN.md` — design system (read before any UI work)

## Critical Invariant
AI never generates science outputs. Only verified deterministic simulation engines produce physics/chemistry/biology values. `SimulationOutput.is_verified: true` is a TypeScript literal type — enforce at compile time.

## Design System
Always read `ideation/DESIGN.md` before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match `ideation/DESIGN.md`.

Key tokens to apply immediately:
- Background: `#0C0C12`, Surface: `#141420`, Accent: `#C8902A` (amber)
- Display font: Fraunces (serif), Body: Plus Jakarta Sans, Readouts: Geist Mono
- Simulation canvas: 70dvh height, always dark background
- Three.js: always `preserveDrawingBuffer: true`
