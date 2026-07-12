'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from '@/components/Experience';
import Overlay from '@/components/ui/Overlay';

/**
 * THE DIGITAL SUPPLY CHAIN AMUSEMENT PARK
 * A continuous vertical 3D track. Scroll = the ride. Three booths:
 *   1. The Old Way   — a highway billboard (y ≈ 0)
 *   2. Programmatic  — the neon trading floor (y ≈ -40)
 *   3. The RMN       — the digital grocery store (y ≈ -80)
 * The fixed Canvas renders the park; the scrolling DOM renders micro-copy
 * and the interactive controls that drive the scene through `store`.
 */
export default function ParkApp() {
  return (
    <>
      <Canvas
        className="park-canvas"
        camera={{ fov: 42, near: 0.1, far: 400, position: [0, 6, 26] }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Overlay />
    </>
  );
}
