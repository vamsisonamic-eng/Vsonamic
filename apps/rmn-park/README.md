# The Digital Supply Chain Amusement Park

A 3D scroll ride explaining **programmatic advertising** and **retail media
networks** for absolute laymen. Next.js + Tailwind + React Three Fiber +
Drei + GSAP ScrollTrigger.

## The ride

| Stop | Booth | Interaction |
|---|---|---|
| 1 | The Old Way — a highway billboard, worker pasting a paper poster | Time-of-day slider: traffic disappears at night, price never changes |
| 2 | The Digital Matchmaker — neon trading floor (DSP ↔ Exchange ↔ SSP) | "Run the auction" button: slow-mo matrix, golden bid token, confetti; tap DSP/SSP/Exchange chips for plain-English definitions |
| 3 | The RMN Gold Mine — digital grocery store, cart + floating coupons | Click cereal/jar/chips: the wall signage instantly sells the matching partner product |

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run preview:bundle   # dist-preview/index.html — one self-contained file
```

## Architecture

- `components/CameraRig.jsx` — GSAP ScrollTrigger timeline mapping page
  scroll percentage onto `camera.position.y/z` down the vertical track
- `lib/store.js` — custom pub-sub React state (useSyncExternalStore) that
  lets DOM buttons drive the 3D scene without re-renders in the frame loop
- `components/scenes/*` — the three booths, all procedural geometry
- `components/ModelOrFallback.jsx` + `public/models/README.md` — GLB slots
  for Higgsfield-generated models (generate_image → generate_3d); the park
  renders procedural fallbacks until the GLBs are dropped in
