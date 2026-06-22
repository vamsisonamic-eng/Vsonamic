# Motion Canvas — Complete API Reference

## Project structure

```
my-project/
├── src/
│   ├── project.ts        ← registers scenes + sets resolution/fps
│   └── scenes/
│       └── example.tsx   ← one file per scene
├── package.json
└── vite.config.ts
```

### `src/project.ts`
```ts
import {makeProject} from '@motion-canvas/core';
import example from './scenes/example?scene';

export default makeProject({
  scenes: [example],
  background: '#141414',
});
```

---

## Scene anatomy

```tsx
import {makeScene2D, Rect, Circle, Txt} from '@motion-canvas/2d';
import {createRef, all, sequence, chain, waitFor, tween, easeInOutCubic, createSignal} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // 1. Create refs
  const box = createRef<Rect>();

  // 2. Add nodes to view
  view.add(
    <Rect ref={box} width={200} height={200} fill="#00C8D7" radius={12} />
  );

  // 3. Animate with yield*
  yield* box().position.x(300, 1);          // move right in 1s
  yield* box().scale(1.5, 0.5);             // scale up in 0.5s
  yield* waitFor(1);                         // hold for 1s
});
```

---

## Core imports cheatsheet

```ts
// From @motion-canvas/2d
import {
  makeScene2D,
  Rect, Circle, Txt, Line, Img, Layout, Node,
  Grid, Path, Spline, Video, Latex,
  Code, LezerHighlighter,
} from '@motion-canvas/2d';

// From @motion-canvas/core
import {
  createRef, createSignal, createComputed,
  all, sequence, chain, loop, waitFor, waitUntil,
  tween, easeInOutCubic, easeInOutQuad, easeOutElastic,
  linear, map, clamp,
  Color, Vector2, BBox,
  DEFAULT,
} from '@motion-canvas/core';
```

---

## Nodes (2D components)

### Rect
```tsx
<Rect
  ref={box}
  width={400} height={300}
  fill="#00C8D7"
  stroke="#ffffff" lineWidth={3}
  radius={16}                    // corner radius
  smoothCorners                  // squircle-style corners
  opacity={0}
  x={-200} y={100}
  rotation={45}
  scale={1.2}
  shadowColor="#000" shadowBlur={20}
/>
```

### Circle
```tsx
<Circle
  ref={circle}
  width={200} height={200}      // diameter
  fill="#ff6b6b"
  startAngle={0} endAngle={270} // arc segment (degrees)
/>
```

### Txt
```tsx
<Txt
  ref={label}
  text="Hello World"
  fontSize={64} fontWeight={700} fontFamily="Syne"
  fill="#ffffff"
  textAlign="center"
/>
```
Animating text content:
```ts
yield* label().text("New text", 0.5);  // morphs character by character
```

### Layout (flex container)
```tsx
<Layout
  ref={container}
  direction="row"        // or "column"
  gap={24}
  alignItems="center"
  justifyContent="center"
  width={800}
>
  <Rect width={100} height={100} fill="red" />
  <Rect width={100} height={100} fill="blue" />
</Layout>
```

### Line / Arrow
```tsx
<Line
  ref={arrow}
  points={[[-200, 0], [200, 0]]}
  stroke="#00C8D7"
  lineWidth={4}
  endArrow                       // arrowhead at end
  arrowSize={20}
  lineDash={[10, 6]}             // dashed
/>
```

### Img
```tsx
<Img src="/assets/logo.png" width={300} height={300} />
```

### Node (invisible container)
```tsx
<Node ref={group} x={0} y={0}>
  <Rect .../>
  <Txt .../>
</Node>
```

---

## Signals and animation

### Animating a signal
```ts
// signal(targetValue, duration, easing?)
yield* box().opacity(1, 0.5);
yield* box().position.x(200, 1, easeInOutCubic);
yield* box().scale(new Vector2(2, 1), 0.8);
```

### `all()` — parallel animations
```ts
yield* all(
  box().opacity(1, 0.5),
  box().position.x(200, 0.8),
  label().opacity(1, 0.6),
);
```

### `sequence()` — staggered (each starts delay after previous starts)
```ts
yield* sequence(
  0.1,                           // stagger delay between each
  box1().opacity(1, 0.4),
  box2().opacity(1, 0.4),
  box3().opacity(1, 0.4),
);
```

### `chain()` — serial (each waits for previous to finish)
```ts
yield* chain(
  box().opacity(1, 0.3),
  box().scale(1.2, 0.2),
  box().scale(1.0, 0.2),
);
```

### `loop()` — repeat N times (or Infinity)
```ts
yield* loop(3, () => sequence(
  0.1,
  box().scale(1.1, 0.2),
  box().scale(1.0, 0.2),
));
```

### `waitFor(seconds)` / `waitUntil(label)`
```ts
yield* waitFor(1.5);
yield* waitUntil('my-label');    // syncs to audio cue or time-event
```

---

## Reactive signals (computed values)

```ts
const progress = createSignal(0);           // mutable signal

// Computed (derived automatically)
const color = createComputed(() =>
  Color.lerp('#ff0000', '#00ff00', progress())
);

// Use in JSX
view.add(<Rect fill={color} />);

// Animate the source
yield* progress(1, 2);  // color transitions red→green over 2s
```

---

## Easings

```ts
import {
  easeInOutCubic,   // smooth S-curve (default for most motion)
  easeInOutQuad,    // slightly softer
  easeOutElastic,   // bouncy overshoot
  easeOutBack,      // small overshoot
  easeInExpo,       // fast finish
  linear,           // constant speed
} from '@motion-canvas/core';

yield* box().x(400, 1, easeOutElastic);
```

### Custom easing with `tween()`
```ts
yield* tween(1.5, t => {
  const v = easeInOutCubic(t);
  box().x(map(-400, 400, v));
  box().opacity(v);
});
```

---

## Colors

```ts
import {Color} from '@motion-canvas/core';

// Static
fill="#00C8D7"
fill={new Color('#00C8D7').alpha(0.5).css()}

// Interpolated
const c = Color.lerp(new Color('#ff0000'), new Color('#00ff00'), 0.5);
```

---

## Camera / view transforms

```ts
// The view IS the root node — transform it for camera effects
yield* all(
  view.scale(1.5, 1),
  view.position(new Vector2(-200, -100), 1),
);
```

---

## Drawing order and z-index

Later children render on top. Use `zIndex` prop:
```tsx
<Rect zIndex={10} ... />
```

---

## Code animations (syntax highlighted)

```tsx
import {Code, LezerHighlighter, lines} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

const code = createRef<Code>();

view.add(
  <Code
    ref={code}
    highlighter={new LezerHighlighter(parser)}
    fontSize={32}
    code={`\
const x = 1;
const y = 2;`}
  />
);

// Morph between code states
yield* code().code(`\
const x = 1;
const y = 2;
const z = x + y;`, 1);

// Highlight a region
yield* code().selection(lines(2), 0.3);  // highlight line 3
```

---

## LaTeX math

```tsx
import {Latex} from '@motion-canvas/2d';

view.add(
  <Latex
    tex="{{x}} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
    fill="#ffffff"
    height={120}
  />
);

// Morphing LaTeX (double-brace tokens animate individually)
yield* latex().tex('{{y}} = mx + b', 1);
```

---

## Common patterns

### Fade in from below
```ts
node().opacity(0);
node().y(node().y() + 40);
yield* all(
  node().opacity(1, 0.5),
  node().y(node().y() - 40, 0.5, easeOutCubic),
);
```

### Draw a line progressively
```tsx
<Line
  ref={line}
  points={[[0,0],[400,0]]}
  stroke="#00C8D7" lineWidth={4}
  end={0}            // start with line invisible
/>
```
```ts
yield* line().end(1, 1);   // draw to completion over 1s
```

### Clip / mask reveal
```tsx
<Rect clip>                  {/* clips children to its bounds */}
  <Txt text="Revealed!" fill="#fff" fontSize={64} />
</Rect>
```

### Scale-in entrance
```ts
node().scale(0);
node().opacity(0);
yield* all(
  node().scale(1, 0.4, easeOutBack),
  node().opacity(1, 0.3),
);
```

### Counter (number count-up)
```ts
const count = createSignal(0);
view.add(<Txt text={() => count().toFixed(0)} fontSize={120} fill="#fff" />);
yield* count(1000, 2, easeInOutCubic);
```

### Staggered card reveal
```ts
const cards = [card1, card2, card3, card4];
yield* sequence(0.08,
  ...cards.map(c => all(
    c().opacity(1, 0.35),
    c().y(c().y() - 20, 0.35, easeOutCubic),
  ))
);
```

---

## Project config options

```ts
makeProject({
  scenes: [intro, main, outro],
  background: '#141414',
  // Resolution + FPS are set per-scene in makeScene2D:
});

// Per-scene settings via meta file (auto-generated by editor):
// src/scenes/example.meta — set width/height/fps there
// Or programmatically:
export default makeScene2D(function* (view) {
  view.fill('#141414');
  // view.size() returns Vector2 of canvas size (default 1920×1080)
});
```

---

## Audio sync

```ts
// In project.ts:
makeProject({
  scenes: [scene],
  audio: '/audio/voiceover.mp3',
  audioOffset: -0.5,             // seconds offset
});

// In scene, sync to audio timestamp:
yield* waitUntil('chapter-2');   // matches time event set in editor
```

---

## Web player (embed in HTML)

```html
<script src="https://unpkg.com/@motion-canvas/player/dist/player.js"></script>
<mc-player src="/output/project.js"></mc-player>
```

---

## CLI render (headless export)

```bash
npx motion-canvas render src/project.ts
# outputs to output/ as .mp4
```

---

## Packages summary

| Package | Purpose |
|---------|---------|
| `@motion-canvas/core` | Signals, timing, threading, math utils |
| `@motion-canvas/2d` | Scene, all 2D nodes (Rect, Txt, Line…) |
| `@motion-canvas/vite-plugin` | Dev server + HMR |
| `@motion-canvas/player` | Web component to embed animations |
| `@motion-canvas/create` | `npm create @motion-canvas@latest` scaffolder |
