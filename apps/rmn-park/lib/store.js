'use client';

/**
 * Custom React state mechanism (no external state library).
 *
 * A tiny pub-sub store readable two ways:
 *   - useStore(selector)  → reactive React hook (useSyncExternalStore)
 *   - store.get()         → imperative read inside R3F useFrame loops,
 *                           where re-rendering every frame would be wasteful
 *
 * This is what lets DOM overlay buttons (auction button, time slider,
 * grocery clicks) drive the 3D scene smoothly without page reloads.
 */
import { useSyncExternalStore } from 'react';

const state = {
  scroll: 0,          // 0..1 page scroll percentage (written by ScrollTrigger)
  timeOfDay: 14,      // 0..24 — Section 1 slider ("drag the sun")
  auctionPhase: 'idle', // 'idle' | 'running' | 'done'  — Section 2 button
  pickedItem: null,   // null | 'cereal' | 'pb' | 'chips' — Section 3 clicks
  explainer: null,    // null | 'dsp' | 'ssp' | 'exchange' — toggled term cards
};

const listeners = new Set();

export const store = {
  get: () => state,
  set(patch) {
    Object.assign(state, patch);
    listeners.forEach((l) => l());
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

let snapshotCache = { ...state };
function getSnapshot() {
  // Return a stable object unless something actually changed,
  // so useSyncExternalStore doesn't loop.
  for (const k in state) {
    if (snapshotCache[k] !== state[k]) {
      snapshotCache = { ...state };
      break;
    }
  }
  return snapshotCache;
}

export function useStore(selector = (s) => s) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot()),
  );
}
