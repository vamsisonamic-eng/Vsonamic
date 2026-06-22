# PixiJS v8 — Complete API Reference

**Repo:** https://github.com/pixijs/pixijs  
**Docs:** https://pixijs.com/8.x/guides  
**npm:** `pixi.js` (v8+)

---

## Installation

```bash
npm install pixi.js
# or WebGPU-first build:
npm install @pixi/webgpu
```

CDN (no bundler):
```html
<script src="https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.min.js"></script>
```

---

## Application bootstrap (v8 — async init)

```ts
import { Application, Assets, Sprite } from 'pixi.js';

const app = new Application();

// Must await — v8 init is async
await app.init({
  width: 800,
  height: 600,
  background: '#1a1a2e',
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
  // preference: 'webgpu',  // opt-in to WebGPU
});

document.body.appendChild(app.canvas);
```

---

## Scene graph

```ts
import { Container, Sprite, Graphics, Text } from 'pixi.js';

// Container (like a div)
const stage = new Container();
app.stage.addChild(stage);

// Sprite
const texture = await Assets.load('bunny.png');
const sprite = new Sprite(texture);
sprite.anchor.set(0.5);           // pivot at center
sprite.position.set(400, 300);
sprite.scale.set(2);
sprite.rotation = Math.PI / 4;
sprite.alpha = 0.8;
stage.addChild(sprite);

// Remove
stage.removeChild(sprite);
sprite.destroy();
```

---

## Graphics (vector drawing)

```ts
import { Graphics } from 'pixi.js';

const g = new Graphics();

// Filled rect
g.rect(0, 0, 200, 100).fill(0x00C8D7);

// Circle with stroke
g.circle(100, 100, 50).fill(0xff0000).stroke({ color: 0xffffff, width: 2 });

// Line
g.moveTo(0, 0).lineTo(200, 200).stroke({ color: 0xffffff, width: 2 });

// Polygon
g.poly([0,0, 100,0, 50,100]).fill(0x00ff00);

app.stage.addChild(g);
```

---

## Text & BitmapText

```ts
import { Text, TextStyle, BitmapText } from 'pixi.js';

// Regular text (Canvas-rendered)
const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fill: '#00C8D7',
  fontWeight: 'bold',
  dropShadow: { color: '#000', blur: 4, distance: 2 },
});
const text = new Text({ text: 'Hello PixiJS', style });
app.stage.addChild(text);

// BitmapText (GPU-fast, requires font install)
await Assets.load('fonts/myFont.fnt');
const bmpText = new BitmapText({ text: 'Fast text', style: { fontFamily: 'myFont', fontSize: 48 } });
app.stage.addChild(bmpText);
```

---

## Assets loader

```ts
import { Assets } from 'pixi.js';

// Single
const texture = await Assets.load('hero.png');

// Bundle
Assets.addBundle('game', {
  hero: 'assets/hero.png',
  bg: 'assets/bg.jpg',
  atlas: 'assets/sheet.json',
});
const { hero, bg, atlas } = await Assets.loadBundle('game');

// Progress
await Assets.load(['a.png', 'b.png'], (progress) => {
  console.log(`${Math.round(progress * 100)}%`);
});
```

---

## Ticker (animation loop)

```ts
// Add to ticker
app.ticker.add((ticker) => {
  sprite.rotation += 0.01 * ticker.deltaTime; // deltaTime = frame multiplier (1.0 at 60fps)
});

// One-shot
app.ticker.addOnce(() => console.log('first frame'));

// Manual control
app.ticker.stop();
app.ticker.update();  // manual tick
app.ticker.start();
```

---

## ParticleContainer (high-perf sprites)

```ts
import { ParticleContainer, Sprite, Assets } from 'pixi.js';

const container = new ParticleContainer(10000, {
  scale: true,
  position: true,
  rotation: true,
  alpha: true,
});
app.stage.addChild(container);

const texture = await Assets.load('particle.png');
const particles = [];

for (let i = 0; i < 5000; i++) {
  const p = new Sprite(texture);
  p.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
  p.anchor.set(0.5);
  container.addChild(p);
  particles.push({ sprite: p, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
}

app.ticker.add(() => {
  for (const p of particles) {
    p.sprite.x += p.vx;
    p.sprite.y += p.vy;
    if (p.sprite.x > app.screen.width)  p.sprite.x = 0;
    if (p.sprite.x < 0)                  p.sprite.x = app.screen.width;
    if (p.sprite.y > app.screen.height)  p.sprite.y = 0;
    if (p.sprite.y < 0)                  p.sprite.y = app.screen.height;
  }
});
```

---

## Interactivity

```ts
sprite.eventMode = 'static';   // 'none' | 'passive' | 'static' | 'dynamic'
sprite.cursor = 'pointer';

sprite.on('pointerdown', (e) => { console.log('clicked', e.global); });
sprite.on('pointerover', () => { sprite.tint = 0x00C8D7; });
sprite.on('pointerout',  () => { sprite.tint = 0xffffff; });

// Drag
sprite.on('pointerdown', (e) => {
  sprite.data = e;
  sprite.dragging = true;
});
app.stage.on('pointermove', (e) => {
  if (sprite.dragging) sprite.position.copyFrom(e.global);
});
app.stage.on('pointerup', () => { sprite.dragging = false; });
```

---

## Filters

```ts
import { BlurFilter, ColorMatrixFilter, GlowFilter } from 'pixi.js';

// Blur
sprite.filters = [new BlurFilter({ strength: 8 })];

// Grayscale
const cm = new ColorMatrixFilter();
cm.greyscale(0.5, false);
sprite.filters = [cm];

// Glow (from @pixi/filters)
// npm install @pixi/filters
import { GlowFilter } from '@pixi/filters';
sprite.filters = [new GlowFilter({ distance: 15, outerStrength: 2, color: 0x00C8D7 })];
```

---

## Masks

```ts
import { Graphics, Sprite } from 'pixi.js';

const mask = new Graphics();
mask.circle(200, 200, 150).fill(0xffffff);
app.stage.addChild(mask);

sprite.mask = mask;
```

---

## Render texture (render-to-texture)

```ts
import { RenderTexture } from 'pixi.js';

const renderTexture = RenderTexture.create({ width: 256, height: 256 });
app.renderer.render({ container: someContainer, target: renderTexture });

const sprite = new Sprite(renderTexture);
app.stage.addChild(sprite);
```

---

## Spritesheet / Atlas

```ts
// atlas.json = TexturePacker / Shoebox output
const sheet = await Assets.load('assets/sheet.json');

const sprite1 = new Sprite(sheet.textures['frame1.png']);
const sprite2 = new Sprite(sheet.textures['frame2.png']);

// Animated sprite
import { AnimatedSprite } from 'pixi.js';
const anim = new AnimatedSprite(sheet.animations['walk']);
anim.animationSpeed = 0.1;
anim.loop = true;
anim.play();
app.stage.addChild(anim);
```

---

## React integration

```tsx
import { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';

export function PixiCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: Application;

    (async () => {
      app = new Application();
      await app.init({ background: '#05080E', resizeTo: containerRef.current! });
      containerRef.current!.appendChild(app.canvas);

      const circle = new Graphics();
      circle.circle(0, 0, 50).fill(0x00C8D7);
      circle.position.set(app.screen.width / 2, app.screen.height / 2);
      app.stage.addChild(circle);

      app.ticker.add(() => { circle.rotation += 0.02; });
    })();

    return () => { app?.destroy(true, { children: true }); };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}
```

---

## Inline HTML (no bundler)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.min.js"></script>
</head>
<body>
<script type="module">
  const { Application, Graphics, Text } = PIXI;

  const app = new Application();
  await app.init({ background: '#05080E', resizeTo: window });
  document.body.appendChild(app.canvas);

  // Particle starfield example
  const stars = [];
  for (let i = 0; i < 200; i++) {
    const g = new Graphics();
    g.circle(0, 0, Math.random() * 2 + 0.5).fill(0xffffff);
    g.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    app.stage.addChild(g);
    stars.push({ g, speed: Math.random() * 0.5 + 0.1 });
  }

  app.ticker.add(() => {
    for (const s of stars) {
      s.g.y += s.speed;
      if (s.g.y > window.innerHeight) s.g.y = 0;
    }
  });
</script>
</body>
</html>
```

---

## Resize handling

```ts
// Auto-resize with resizeTo
await app.init({ resizeTo: window });

// Manual resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
```

---

## Cleanup / destroy

```ts
// Full cleanup
app.destroy(true, { children: true, texture: true, textureSource: true });

// Remove from ticker
const fn = (ticker) => { /* ... */ };
app.ticker.add(fn);
// later:
app.ticker.remove(fn);
```

---

## Common patterns

### Centered, responsive canvas
```ts
await app.init({
  resizeTo: window,
  autoDensity: true,
  resolution: devicePixelRatio,
  background: 0x05080e,
});
document.body.style.margin = '0';
app.canvas.style.display = 'block';
```

### Tween without library
```ts
let t = 0;
app.ticker.add((ticker) => {
  t += ticker.deltaTime * 0.02;
  sprite.x = app.screen.width * 0.5 + Math.sin(t) * 200;
  sprite.y = app.screen.height * 0.5 + Math.cos(t * 0.7) * 100;
});
```

### Color lerp tint
```ts
function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  return ((ar + (br-ar)*t) << 16) | ((ag + (bg-ag)*t) << 8) | (ab + (bb-ab)*t);
}
sprite.tint = lerpColor(0x000000, 0x00C8D7, Math.sin(Date.now()*0.001)*0.5+0.5);
```

---

## Renderer info

| Feature       | WebGL (default) | WebGPU (opt-in) |
|---------------|-----------------|-----------------|
| Browser support | All modern     | Chrome/Edge 113+ |
| Filter support | Full            | Full (v8.3+)     |
| Performance    | Excellent       | ~15% faster on supported hardware |
| Init option   | `preference: 'webgl'` | `preference: 'webgpu'` |

---

## Packages summary

| Package | Purpose |
|---------|---------|
| `pixi.js` | Full bundle — Application, Sprite, Graphics, Text, Assets, Ticker |
| `@pixi/webgpu` | WebGPU-first build |
| `@pixi/filters` | Extra filters: Glow, Drop Shadow, Outline, CRT, Dot, etc. |
| `@pixi/sound` | Web Audio integration |
| `@pixi/ui` | UI components: Button, Slider, ScrollBox |
| `@pixi/spine-pixi` | Spine skeletal animation runtime |
