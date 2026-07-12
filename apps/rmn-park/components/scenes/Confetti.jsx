'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COLORS = ['#FF6A55', '#4FD6EA', '#FFC24B', '#B07CFF', '#4ADE80', '#EEF2FF'];
const N = 140;

/** Tiny physics-y confetti burst (instanced quads, no textures). */
export default function Confetti({ origin = [0, 0, 0], delay = 0 }) {
  const inst = useRef();
  const t0 = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const parts = useMemo(
    () =>
      Array.from({ length: N }, () => ({
        v: new THREE.Vector3(
          (Math.random() - 0.5) * 7,
          Math.random() * 8 + 3,
          (Math.random() - 0.5) * 7,
        ),
        spin: Math.random() * 8,
        c: new THREE.Color(COLORS[(Math.random() * COLORS.length) | 0]),
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (t0.current === null) t0.current = clock.elapsedTime + delay;
    const t = clock.elapsedTime - t0.current;
    const live = t > 0 && t < 3.2;
    inst.current.visible = live;
    if (!live) return;
    parts.forEach((p, i) => {
      dummy.position.set(
        origin[0] + p.v.x * t,
        origin[1] + p.v.y * t - 4.4 * t * t,
        origin[2] + p.v.z * t,
      );
      dummy.rotation.set(p.spin * t, p.spin * t * 1.3, 0);
      dummy.scale.setScalar(Math.max(0, 1 - t / 3.2) * 0.16);
      dummy.updateMatrix();
      inst.current.setMatrixAt(i, dummy.matrix);
      inst.current.setColorAt(i, p.c);
    });
    inst.current.instanceMatrix.needsUpdate = true;
    if (inst.current.instanceColor) inst.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={inst} args={[null, null, N]}>
      <planeGeometry args={[1, 0.6]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </instancedMesh>
  );
}
