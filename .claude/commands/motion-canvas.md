---
name: motion-canvas
description: Create programmatic animations with Motion Canvas — a TypeScript library using generator functions and a real-time Vite-powered editor. Use this skill when the user wants to build animated explainers, data visualizations, motion graphics, or video sequences with code.
---

# Motion Canvas Skill

Motion Canvas is a TypeScript animation framework that uses **generator functions** (`yield*`) to sequence animations declaratively. It renders to canvas and exports video via its Vite dev server.

Read [REFERENCE.md](.claude/commands/motion-canvas/REFERENCE.md) before generating any animation code.

## When to use this skill

- User wants to animate charts, diagrams, code walkthroughs, or explainer videos
- User wants programmatic control over timing, easing, and visual composition
- User wants to export `.mp4` / `.webm` video from a coded animation
- User has a Motion Canvas project and needs help writing scenes

## Quick workflow

1. **Bootstrap** (if no project exists): `npm create @motion-canvas@latest`
2. **Dev server**: `npm run serve` → opens editor at `http://localhost:9000`
3. **Write scenes** in `src/scenes/*.tsx`
4. **Export**: click Render in the editor, or use `@motion-canvas/renderer` for CI

## Phase 1: Understand the goal

Ask (if not clear):
- What should the animation show? (chart, logo reveal, code walkthrough, data story…)
- Duration target? (5s, 30s, longer?)
- Export format? (video for YouTube, embedded web player, GIF)
- Color palette / brand?

## Phase 2: Write the scene

Always follow the patterns in REFERENCE.md. Key invariants:
- Every scene file uses `makeScene2D` (or `makeScene3D` for 3D)
- All animations are `yield*` inside the generator
- Use `createRef<T>()` to get handles to nodes
- Use `all()` for parallel, `sequence()` for staggered, `chain()` for serial
- Never use `await` — always `yield*`
- Add the scene to `src/project.ts`

## Phase 3: Deliver

- Show the full scene file(s) with clear `/* === SECTION === */` comments
- Explain timing decisions (why certain durations, easings)
- Offer to add more scenes or refine timing
