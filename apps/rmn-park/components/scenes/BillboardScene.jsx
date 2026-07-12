'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { store } from '@/lib/store';
import { makeSignTexture } from '@/lib/textTexture';
import ModelOrFallback from '@/components/ModelOrFallback';

/**
 * BOOTH 1 — THE OLD WAY (y ≈ 0)
 * A highway billboard. A worker pastes a paper poster by hand.
 * The overlay slider drags the sun across the sky: traffic disappears at
 * night, but the price tag never changes. That's the whole joke — and
 * the whole problem — of traditional advertising.
 */

const DAY = new THREE.Color('#8FC7F2');
const DUSK = new THREE.Color('#F2926B');
const NIGHT = new THREE.Color('#0A1030');

function skyColorAt(t) {
  // t: 0..24 → night→day→night
  const c = new THREE.Color();
  const day = Math.max(0, Math.sin(((t - 6) / 12) * Math.PI)); // 0 at 6/18, 1 at noon
  if (t > 4 && t < 8) return c.lerpColors(NIGHT, DUSK, (t - 4) / 4).lerp(DAY, day * 0.6);
  if (t > 16 && t < 20) return c.lerpColors(DAY, DUSK, (t - 16) / 4).lerp(NIGHT, 1 - day);
  return c.lerpColors(NIGHT, DAY, day);
}

function Car({ lane, offset, speed, color }) {
  const g = useRef();
  useFrame(({ clock }) => {
    const { timeOfDay } = store.get();
    const day = Math.max(0, Math.sin(((timeOfDay - 6) / 12) * Math.PI));
    // traffic thins out to zero in the dead of night
    const visible = day > 0.12 || offset < day * 4;
    if (g.current) {
      g.current.visible = visible;
      const t = (clock.elapsedTime * speed + offset * 7) % 44;
      g.current.position.x = -22 + t;
    }
  });
  return (
    <group ref={g} position={[0, 0.45, lane]}>
      <mesh castShadow>
        <boxGeometry args={[1.7, 0.55, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.35, 0.7]} />
        <meshStandardMaterial color="#1B2244" roughness={0.2} />
      </mesh>
      <mesh position={[0.9, 0, 0.2]}>
        <boxGeometry args={[0.06, 0.12, 0.14]} />
        <meshBasicMaterial color="#FFF3B0" />
      </mesh>
      <mesh position={[0.9, 0, -0.2]}>
        <boxGeometry args={[0.06, 0.12, 0.14]} />
        <meshBasicMaterial color="#FFF3B0" />
      </mesh>
    </group>
  );
}

function Worker() {
  const arm = useRef();
  useFrame(({ clock }) => {
    if (arm.current) arm.current.rotation.z = 0.6 + Math.sin(clock.elapsedTime * 2.2) * 0.5;
  });
  return (
    <group position={[2.6, 2.1, 0.55]}>
      {/* ladder */}
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -0.16]}>
        <boxGeometry args={[0.1, 4.4, 0.1]} />
        <meshStandardMaterial color="#C9A25E" />
      </mesh>
      <mesh position={[1.1, 0.2, 0]} rotation={[0, 0, -0.16]}>
        <boxGeometry args={[0.1, 4.4, 0.1]} />
        <meshStandardMaterial color="#C9A25E" />
      </mesh>
      {[-1.4, -0.6, 0.2, 1.0].map((y) => (
        <mesh key={y} position={[0.8 + y * 0.16 * -1 * 0.16, y + 0.2, 0]} rotation={[0, 0, -0.16]}>
          <boxGeometry args={[0.72, 0.08, 0.08]} />
          <meshStandardMaterial color="#B8914C" />
        </mesh>
      ))}
      {/* body */}
      <group position={[0.55, 1.55, 0.25]}>
        <mesh>
          <capsuleGeometry args={[0.22, 0.5, 4, 10]} />
          <meshStandardMaterial color="#3E6FB8" />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#E8C9A8" />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.1, 12]} />
          <meshStandardMaterial color="#FFC24B" />
        </mesh>
        {/* pasting arm + brush */}
        <group ref={arm} position={[0.16, 0.35, 0]}>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.4]}>
            <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
            <meshStandardMaterial color="#3E6FB8" />
          </mesh>
          <mesh position={[0.62, 0.14, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.3]} />
            <meshStandardMaterial color="#F4E9D8" />
          </mesh>
        </group>
      </group>
      {/* glue bucket */}
      <mesh position={[0.2, -1.8, 0.6]}>
        <cylinderGeometry args={[0.28, 0.22, 0.4, 14]} />
        <meshStandardMaterial color="#9AA6C8" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function BillboardScene() {
  const skyRef = useRef();
  const sunRef = useRef();
  const sunLight = useRef();
  const lampRefs = useRef([]);

  const posterTex = useMemo(
    () =>
      makeSignTexture({
        lines: ['BUY SHOES!', 'best shoes probably', '(please look at this)'],
        w: 1024,
        h: 512,
        bg: '#F4E9D8',
        fg: '#B43B2E',
        accent: '#B43B2E',
        glow: false,
      }),
    [],
  );
  const priceTex = useMemo(
    () =>
      makeSignTexture({
        lines: ['$10,000 / month', 'same price 24/7'],
        w: 512,
        h: 192,
        bg: '#141B3A',
        fg: '#FFC24B',
        accent: '#FFC24B',
      }),
    [],
  );

  const root = useRef();

  useFrame(() => {
    const { timeOfDay: t, scroll } = store.get();
    const day = Math.max(0, Math.sin(((t - 6) / 12) * Math.PI));
    // fade the sky backdrop as the ride leaves booth 1 so it never
    // bleeds into the trading floor's frame below
    const fade = THREE.MathUtils.clamp(1 - (scroll - 0.24) / 0.08, 0, 1);
    if (root.current) root.current.visible = fade > 0.01;
    if (skyRef.current) {
      skyRef.current.material.color.copy(skyColorAt(t));
      skyRef.current.material.opacity = fade;
    }
    if (sunRef.current) sunRef.current.material.opacity = fade;
    if (sunRef.current) {
      const a = ((t - 6) / 12) * Math.PI; // sunrise→sunset arc
      sunRef.current.position.set(Math.cos(Math.PI - a) * 26, Math.sin(a) * 16 + 1, -23);
      sunRef.current.material.color.set(day > 0.05 ? '#FFE9A8' : '#DDE6FF');
      sunRef.current.scale.setScalar(day > 0.05 ? 1 : 0.6);
    }
    if (sunLight.current) sunLight.current.intensity = 0.35 + day * 1.9;
    lampRefs.current.forEach((m) => {
      if (m) m.material.opacity = 1 - day;
    });
  });

  return (
    <group position={[0, 0, 0]} ref={root}>
      {/* sky disc backdrop */}
      <mesh ref={skyRef} position={[0, 8, -24]}>
        <circleGeometry args={[46, 48]} />
        <meshBasicMaterial color="#0A1030" transparent />
      </mesh>
      <mesh ref={sunRef} position={[0, 14, -23]}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial color="#FFE9A8" transparent />
      </mesh>
      <directionalLight ref={sunLight} position={[8, 14, 8]} intensity={1} color="#FFF2D8" />

      {/* island ground + highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[46, 1, 26]} />
        <meshStandardMaterial color="#1A2246" />
      </mesh>
      <mesh position={[0, 0.01, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 7]} />
        <meshStandardMaterial color="#2E3A6E" roughness={0.9} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-21 + i * 3.9, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.18]} />
          <meshBasicMaterial color="#E8D9A8" />
        </mesh>
      ))}

      {/* traffic (thins to nothing at night) */}
      <Car lane={0.6} offset={0} speed={4.5} color="#FF6A55" />
      <Car lane={0.6} offset={2.5} speed={4.5} color="#4FD6EA" />
      <Car lane={3.4} offset={1.2} speed={-3.8} color="#B07CFF" />
      <Car lane={3.4} offset={3.6} speed={-3.8} color="#4ADE80" />

      {/* street lamps that only glow at night */}
      {[-12, 0, 12].map((x, i) => (
        <group key={x} position={[x, 0, 6.4]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 3.2, 8]} />
            <meshStandardMaterial color="#33406F" />
          </mesh>
          <mesh position={[0, 3.25, 0]} ref={(m) => (lampRefs.current[i] = m)}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshBasicMaterial color="#FFF3B0" transparent opacity={0} />
          </mesh>
        </group>
      ))}

      {/* THE BILLBOARD — Higgsfield GLB slot with procedural fallback */}
      <ModelOrFallback
        src="/models/billboard-vintage.glb"
        position={[0, 0, -4]}
        fallback={
          <group position={[0, 0, -4]}>
            <mesh position={[-2.6, 2, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 4, 10]} />
              <meshStandardMaterial color="#33406F" metalness={0.4} />
            </mesh>
            <mesh position={[2.6, 2, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 4, 10]} />
              <meshStandardMaterial color="#33406F" metalness={0.4} />
            </mesh>
            <mesh position={[0, 5.4, 0]}>
              <boxGeometry args={[8.4, 3.6, 0.35]} />
              <meshStandardMaterial color="#141B3A" />
            </mesh>
            {/* the hand-pasted paper poster (slightly peeling corner) */}
            <mesh position={[0, 5.4, 0.19]}>
              <planeGeometry args={[7.9, 3.1]} />
              <meshBasicMaterial map={posterTex} />
            </mesh>
            <mesh position={[3.5, 6.5, 0.24]} rotation={[0.1, -0.25, 0.12]}>
              <planeGeometry args={[0.8, 0.6]} />
              <meshStandardMaterial color="#E9DCC4" side={THREE.DoubleSide} />
            </mesh>
            <Worker />
          </group>
        }
      />

      {/* the unblinking price tag */}
      <mesh position={[6.4, 4.2, -2]} rotation={[0, -0.35, 0.04]}>
        <planeGeometry args={[3.4, 1.3]} />
        <meshBasicMaterial map={priceTex} transparent />
      </mesh>
    </group>
  );
}
