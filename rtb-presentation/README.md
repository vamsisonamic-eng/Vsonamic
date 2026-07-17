# Inside Real-Time Bidding — A Visual Walkthrough

An original, self-contained single-page visual presentation explaining how real-time
bidding (RTB) works and how the full pipeline can be prototyped with lightweight
components (a message broker, an in-memory store, and a handful of small services).

## Features
- Scroll-driven storytelling with reveal animations, animated counters, and a scroll progress bar
- Animated SVG pipeline diagram: publisher → broker fan-out → bidders → auction engine → cache → ad server
- Animated "bid race" showing why late bids lose regardless of price
- 100ms auction timeline
- Zero dependencies — one HTML file, works offline and on GitHub Pages

## Run it
Open `index.html` in any browser, or serve the folder with GitHub Pages.
