'use client';

import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { store } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * GSAP ScrollTrigger camera track.
 *
 * One scrubbed timeline maps page scroll percentage directly onto
 * camera.position.y / camera.position.z (plus x sway) — the "ride down
 * the track". A parallel `look` object is tweened so the camera banks
 * toward each booth as it arrives. Durations are the share of total
 * scroll each leg occupies.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const look = useRef({ x: 0, y: 4, z: 0 });

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#ride',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => store.set({ scroll: self.progress }),
      },
    });

    // ——— leg 0: hero hold on the billboard, then push in ———
    tl.to(camera.position, { x: 0, y: 4.5, z: 20, duration: 0.10 }, 0);
    tl.to(look.current,   { x: 0, y: 4, z: 0, duration: 0.10 }, 0);

    // ——— leg 1: dwell at Booth 1 (billboard, y≈0) ———
    tl.to(camera.position, { x: -7, y: 3.5, z: 14, duration: 0.16 }, 0.10);
    tl.to(look.current,   { x: 1, y: 4.5, z: 0, duration: 0.16 }, 0.10);

    // ——— leg 2: dive down the track to Booth 2 (trading floor, y≈-40) ———
    tl.to(camera.position, { x: 6, y: -32, z: 22, duration: 0.14 }, 0.26);
    tl.to(look.current,   { x: 0, y: -38, z: 0, duration: 0.14 }, 0.26);

    // ——— leg 3: dwell at Booth 2 — orbit slightly around the exchange ———
    tl.to(camera.position, { x: 0, y: -36.5, z: 15, duration: 0.18 }, 0.40);
    tl.to(look.current,   { x: 0, y: -39.5, z: 0, duration: 0.18 }, 0.40);

    // ——— leg 4: dive to Booth 3 (grocery, y≈-80) ———
    tl.to(camera.position, { x: -6, y: -72, z: 24, duration: 0.14 }, 0.58);
    tl.to(look.current,   { x: 0, y: -78, z: 0, duration: 0.14 }, 0.58);

    // ——— leg 5: dwell in the aisle ———
    tl.to(camera.position, { x: 2.5, y: -75.6, z: 12.5, duration: 0.18 }, 0.72);
    tl.to(look.current,   { x: -0.5, y: -78.6, z: -2, duration: 0.18 }, 0.72);

    // ——— leg 6: pull back for the outro vista ———
    tl.to(camera.position, { x: 0, y: -70, z: 34, duration: 0.10 }, 0.90);
    tl.to(look.current,   { x: 0, y: -80, z: -4, duration: 0.10 }, 0.90);
  });

  useFrame(() => {
    camera.lookAt(look.current.x, look.current.y, look.current.z);
  });

  return null;
}
