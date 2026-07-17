# Real-Time Bidding — A 3D Architectural Journey

An original single-page 3D presentation explaining how real-time bidding (RTB) works,
told in five modules anyone can follow: Fan-Out Broadcast → Algorithmic Race →
Convergence Stream → Time-Window Arena → King Determination & Caching.

## Features
- Full WebGL (Three.js) scene: scrolling flies the camera through the live pipeline
- Animated packets — blue requests out, green bids back, gold winner to cache & screen
- Time-window arena with an opening/closing shutter and late bids visibly bouncing off
- Layman analogies in every module, plus "under the hood" tech chips (RabbitMQ/Kafka, DSP services, Redis, stream windowing)
- Animated bid-race chart, 100ms countdown dial, module rail navigation
- Three.js is vendored locally (`three.min.js`) — no CDN required; graceful fallback if WebGL is unavailable
- Respects `prefers-reduced-motion`

## Run it
Open `index.html` in any browser, or enable GitHub Pages for this folder.
