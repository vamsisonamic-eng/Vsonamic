---
name: pixijs
description: Build high-performance 2D graphics, animations, particle systems, interactive scenes, and game UIs using PixiJS — the fastest WebGL/WebGPU 2D renderer for the web. Use this skill when the user wants rich canvas-based visuals, sprite animations, particle effects, interactive data visualizations, or GPU-accelerated motion graphics in the browser.
---

# PixiJS Skill

PixiJS is the fastest open-source 2D WebGL/WebGPU renderer for the web. It abstracts WebGL into a friendly scene-graph API, auto-falls back to Canvas 2D, and handles textures, sprites, particle containers, filters, masks, and interactive event handling with minimal boilerplate.

Read [REFERENCE.md](.claude/commands/pixijs/REFERENCE.md) before writing any PixiJS code.

## When to use this skill

- Add GPU-accelerated particle effects, starfields, or motion backgrounds to a web page
- Build sprite-based animations and interactive game UIs
- Create real-time data visualizations that need to render thousands of objects smoothly
- Replace heavy CSS/SVG animations with performant WebGL equivalents
- Build rich interactive scenes (drag, hover, click) on a canvas surface
- Enhance HTML presentations with cinematic GPU effects (this project)

## Quick workflow

1. **Install** via npm (`pixi.js`) or CDN (`@pixi/webgpu` bundle)
2. **Create** an `Application`, append `app.canvas` to the DOM
3. **Build** scene graph: `Container` → `Sprite` / `Graphics` / `Text` / `ParticleContainer`
4. **Animate** via `app.ticker.add(delta => { ... })`
5. **Interact** via `obj.eventMode = 'static'` + `obj.on('pointerdown', ...)`

## Phase 1: Understand the goal

Ask (if not clear):
- Output type? (Particle system / Sprite animation / Interactive scene / Data viz / Background effect)
- Renderer preference? (WebGL auto / WebGPU explicit / Canvas 2D fallback only)
- Framework? (Vanilla / React / Vue)
- Asset pipeline? (Bundler with Assets loader / CDN / Inline base64)

## Phase 2: Write the integration

Always follow the patterns in REFERENCE.md. Key invariants:
- Always `await app.init(options)` before adding children — Application.init() is async in v8
- Use `Assets.load()` for textures, not `PIXI.Texture.from()` (deprecated in v8)
- Prefer `ParticleContainer` over plain `Container` when rendering 10k+ identical sprites
- Call `app.destroy(true)` on cleanup (React `useEffect` return, component unmount)
- CSS `canvas { display: block }` eliminates the default inline-block gap

## Phase 3: Deliver

- Show full working setup with correct import and init order
- Note WebGPU vs WebGL renderer choice and fallback behavior
- Highlight any asset preloading needed via `Assets.load()`
- Offer to add filters (BlurFilter, ColorMatrixFilter), masks, or interactivity
