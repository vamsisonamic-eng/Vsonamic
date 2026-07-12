'use client';

import { useStore, store } from '@/lib/store';

/**
 * The scrolling DOM layer: hero, three booth sections, outro.
 * Micro-copy only — max two sentences per viewport. Every control here
 * drives the 3D scene through the custom store (no page reloads, ever).
 */

const EXPLAINERS = {
  dsp: {
    name: 'DSP',
    color: 'text-neon border-neon/50',
    text: 'Demand-Side Platform — the brand’s smart shopping agent. You say “find me shoe lovers,” it buys the right ad slots automatically.',
  },
  ssp: {
    name: 'SSP',
    color: 'text-grape border-grape/50',
    text: 'Supply-Side Platform — the website’s auctioneer. It shouts “I’ve got an empty slot RIGHT NOW, who wants it?”',
  },
  exchange: {
    name: 'Ad Exchange',
    color: 'text-gold border-gold/50',
    text: 'The split-second stock market where the agent and the auctioneer high-five and close the deal — in about 100 milliseconds.',
  },
};

function Section({ children, className = '' }) {
  return (
    <section className={`relative h-[240vh] ${className}`}>
      <div className="sticky top-0 h-screen flex items-end md:items-center pointer-events-none">
        {children}
      </div>
    </section>
  );
}

export default function Overlay() {
  const scroll = useStore((s) => s.scroll);
  const timeOfDay = useStore((s) => s.timeOfDay);
  const phase = useStore((s) => s.auctionPhase);
  const picked = useStore((s) => s.pickedItem);
  const explainer = useStore((s) => s.explainer);

  return (
    <div id="ride" className="relative z-10 pointer-events-none">
      {/* fixed chrome */}
      <div className="fixed top-5 left-6 z-30 font-mono text-[11px] tracking-[0.32em] uppercase text-slate-400">
        <b className="text-white">AD·PARK</b> — the ride
      </div>
      <div
        className="fixed top-0 left-0 h-0.5 z-30 bg-gradient-to-r from-neon via-gold to-coral transition-none"
        style={{ width: `${scroll * 100}%` }}
      />

      {/* ——— HERO ——— */}
      <section className="relative h-[130vh]">
        <div className="sticky top-0 h-screen grid place-items-center text-center px-6">
          <div style={{ opacity: 1 - scroll * 14 }}>
            <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-neon mb-4">
              The digital supply chain amusement park
            </p>
            <h1 className="font-disp font-extrabold text-5xl md:text-8xl leading-[0.97] [text-wrap:balance] bg-gradient-to-br from-white via-blue-200 to-coral bg-clip-text text-transparent">
              HOW ADS
              <br />
              FIND YOU
            </h1>
            <p className="mt-5 text-slate-300 text-base md:text-lg">
              A 3-stop ride. No jargon, promise.
            </p>
            <p className="mt-14 font-mono text-[11px] tracking-[0.3em] uppercase text-slate-500 animate-bounce">
              ▼ scroll to ride
            </p>
          </div>
        </div>
      </section>

      {/* ——— BOOTH 1 · THE OLD WAY ——— */}
      <Section>
        <div className="card ml-6 md:ml-[6vw] mb-10 md:mb-0">
          <p className="eyebrow text-coral">Stop 1 — the old way</p>
          <h2 className="headline">Ads used to be a guess.</h2>
          <p className="blurb">
            A billboard is a flat fee and a prayer: you hope the right people drive past.
          </p>
          <div className="mt-5">
            <label htmlFor="tod" className="font-mono text-[11px] tracking-[0.25em] uppercase text-slate-400">
              ☀ Drag the sun — {String(Math.round(timeOfDay)).padStart(2, '0')}:00
            </label>
            <input
              id="tod"
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={timeOfDay}
              onChange={(e) => store.set({ timeOfDay: +e.target.value })}
              className="w-full mt-2 accent-coral cursor-grab"
            />
            <p className="font-mono text-[11px] mt-2 text-gold">
              {timeOfDay < 5.5 || timeOfDay > 20.5
                ? '3 AM: everyone’s asleep. Still $10,000.'
                : 'Rush hour or ghost town — same $10,000.'}
            </p>
          </div>
        </div>
      </Section>

      {/* ——— BOOTH 2 · PROGRAMMATIC ——— */}
      <Section>
        <div className="card ml-6 md:ml-[6vw] mb-10 md:mb-0">
          <p className="eyebrow text-neon">Stop 2 — the digital matchmaker</p>
          <h2 className="headline">Now every ad is an auction.</h2>
          <p className="blurb">
            Each slot is sold to the perfect buyer in ~100&nbsp;ms — that’s programmatic.
          </p>

          {/* term chips — tap to translate the jargon */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(EXPLAINERS).map(([key, e]) => (
              <button
                key={key}
                onClick={() => store.set({ explainer: explainer === key ? null : key })}
                aria-expanded={explainer === key}
                className={`chip pointer-events-auto cursor-pointer transition
                  ${explainer === key ? `${e.color} bg-white/10` : 'text-slate-300 hover:bg-white/10'}`}
              >
                {e.name} ?
              </button>
            ))}
          </div>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out
              ${explainer ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <p className="blurb overflow-hidden">{explainer && EXPLAINERS[explainer].text}</p>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={() => phase !== 'running' && store.set({ auctionPhase: 'running' })}
              disabled={phase === 'running'}
              className={`btn-big ${
                phase === 'running'
                  ? 'bg-white/10 text-slate-400 cursor-wait'
                  : 'bg-neon text-[#062126] hover:brightness-110'
              }`}
            >
              {phase === 'idle' && '▶ Run the auction'}
              {phase === 'running' && '⏳ bidding…'}
              {phase === 'done' && '⟲ Run it again'}
            </button>
            {phase === 'done' && (
              <span className="font-mono text-[12px] text-mint">deal closed · confetti earned 🎉</span>
            )}
          </div>
        </div>
      </Section>

      {/* ——— BOOTH 3 · THE RMN ——— */}
      <Section>
        <div className="card ml-6 md:ml-[6vw] mb-10 md:mb-0">
          <p className="eyebrow text-mint">Stop 3 — the gold mine</p>
          <h2 className="headline">Stores became the smartest ad channel.</h2>
          <p className="blurb">
            A Retail Media Network is Walmart or Amazon renting out their own app as ad space —
            and they don’t guess what you like, <em>they know what you buy</em>.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="chip text-gold border-gold/40">heading past $140B</span>
            <span className="chip">growing faster than social ads</span>
            <span className="chip">the receipt never lies</span>
          </div>
          <p className="font-mono text-[12px] mt-5 text-mint">
            {picked
              ? `You tapped ${picked === 'pb' ? 'peanut butter' : picked} → the wall instantly sells its partner. That’s first-party data. ⚡`
              : '👉 Tap a product on the shelf (cereal, jar, chips).'}
          </p>
        </div>
      </Section>

      {/* ——— OUTRO ——— */}
      <section className="relative h-[120vh]">
        <div className="sticky top-0 h-screen grid place-items-center text-center px-6">
          <div>
            <h2 className="font-disp font-extrabold text-4xl md:text-6xl [text-wrap:balance]">
              You just rode the future of ads.
            </h2>
            <p className="mt-4 text-slate-300">
              Billboards guessed. Auctions matched. Retail knows.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-big bg-coral text-[#2A0B06] mt-8"
            >
              ⟲ Ride again
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
