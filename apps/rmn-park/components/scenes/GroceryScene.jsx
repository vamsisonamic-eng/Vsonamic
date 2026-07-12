'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { store, useStore } from '@/lib/store';
import { makeSignTexture } from '@/lib/textTexture';
import ModelOrFallback from '@/components/ModelOrFallback';

/**
 * BOOTH 3 — THE RMN GOLD MINE (y ≈ -80)
 * A digital grocery store. A cart rolls the aisle while coupons float
 * into it. Click a product and the big wall signage INSTANTLY sells you
 * its perfect partner (cereal → milk) — first-party data reacting live.
 * "The receipt never lies."
 */

const Y = -80;

const PAIRINGS = {
  cereal: { lines: ['MILK −20%', 'goes great with that cereal'], accent: '#4FD6EA' },
  pb: { lines: ['JELLY · BOGO', 'peanut butter’s best friend'], accent: '#C86BFF' },
  chips: { lines: ['SALSA −30%', 'those chips need backup'], accent: '#FF6A55' },
};
const IDLE_SIGN = { lines: ['MART+ NETWORK', 'tap a product on the shelf →'], accent: '#4ADE80' };

function Shelf({ z, children }) {
  return (
    <group position={[0, 0, z]}>
      {[0.9, 2.0].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[16, 0.14, 1.6]} />
          <meshStandardMaterial color="#26325F" />
        </mesh>
      ))}
      <mesh position={[-8, 1.4, 0]}>
        <boxGeometry args={[0.16, 2.9, 1.6]} />
        <meshStandardMaterial color="#1C2450" />
      </mesh>
      <mesh position={[8, 1.4, 0]}>
        <boxGeometry args={[0.16, 2.9, 1.6]} />
        <meshStandardMaterial color="#1C2450" />
      </mesh>
      {children}
    </group>
  );
}

function Product({ id, position, children, label }) {
  const g = useRef();
  const [hover, setHover] = useState(false);
  const picked = useStore((s) => s.pickedItem) === id;

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto';
    return () => (document.body.style.cursor = 'auto');
  }, [hover]);

  useEffect(() => {
    if (!g.current) return;
    gsap.to(g.current.scale, {
      x: hover || picked ? 1.18 : 1,
      y: hover || picked ? 1.18 : 1,
      z: hover || picked ? 1.18 : 1,
      duration: 0.25,
      ease: 'back.out(3)',
    });
  }, [hover, picked]);

  return (
    <group
      ref={g}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        store.set({ pickedItem: id });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      {children}
      {(hover || picked) && (
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#FFF3B0" />
        </mesh>
      )}
    </group>
  );
}

function Cart() {
  const g = useRef();
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = (clock.elapsedTime * 0.14) % 1;
    const x = -7 + t * 14;
    g.current.position.x = x;
    g.current.rotation.z = Math.sin(clock.elapsedTime * 6) * 0.012;
  });
  return (
    <group ref={g} position={[0, 0.55, 3.1]}>
      <ModelOrFallback
        src="/models/shopping-cart.glb"
        fallback={
          <group>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[1.5, 0.7, 0.9]} />
              <meshStandardMaterial color="#4FD6EA" wireframe />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[1.5, 0.08, 0.9]} />
              <meshStandardMaterial color="#33406F" />
            </mesh>
            <mesh position={[0.85, 0.55, 0]} rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.7, 0.07, 0.7]} />
              <meshStandardMaterial color="#33406F" />
            </mesh>
            {[[-0.55, 0.35], [0.55, 0.35], [-0.55, -0.35], [0.55, -0.35]].map(([x, z], i) => (
              <mesh key={i} position={[x, -0.12, z]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.11, 0.05, 8, 14]} />
                <meshStandardMaterial color="#0D1329" />
              </mesh>
            ))}
            {/* stuff already in the basket */}
            <mesh position={[-0.25, 0.6, 0]}>
              <boxGeometry args={[0.35, 0.45, 0.3]} />
              <meshStandardMaterial color="#FF6A55" />
            </mesh>
            <mesh position={[0.25, 0.55, 0.1]}>
              <cylinderGeometry args={[0.14, 0.14, 0.4, 10]} />
              <meshStandardMaterial color="#4ADE80" />
            </mesh>
          </group>
        }
      />
    </group>
  );
}

/** coupons spiralling into the cart, forever */
function Coupons() {
  const inst = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const parts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        off: (i / 14) * Math.PI * 2,
        rate: 0.25 + Math.random() * 0.2,
      })),
    [],
  );
  useFrame(({ clock }) => {
    parts.forEach((p, i) => {
      const t = (clock.elapsedTime * p.rate + p.off) % (Math.PI * 2);
      const k = t / (Math.PI * 2); // 0..1 descent
      const r = 3.2 * (1 - k) + 0.3;
      dummy.position.set(
        Math.cos(t * 3) * r,
        3.4 - k * 2.6,
        1.6 + Math.sin(t * 3) * r * 0.5,
      );
      dummy.rotation.set(0.6, t * 3, 0);
      dummy.scale.setScalar(0.5 + (1 - k) * 0.4);
      dummy.updateMatrix();
      inst.current.setMatrixAt(i, dummy.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={inst} args={[null, null, 14]}>
      <planeGeometry args={[0.55, 0.3]} />
      <meshBasicMaterial color="#FFC24B" side={THREE.DoubleSide} transparent opacity={0.9} />
    </instancedMesh>
  );
}

export default function GroceryScene() {
  const picked = useStore((s) => s.pickedItem);
  const sign = useRef();
  const beam = useRef();

  const signTextures = useMemo(() => {
    const mk = (cfg) => makeSignTexture({ ...cfg, w: 1024, h: 400 });
    return {
      idle: mk(IDLE_SIGN),
      cereal: mk(PAIRINGS.cereal),
      pb: mk(PAIRINGS.pb),
      chips: mk(PAIRINGS.chips),
    };
  }, []);

  const growthTex = useMemo(
    () =>
      makeSignTexture({
        lines: ['heading past $140B', 'growing faster than social ads'],
        accent: '#FFC24B',
        w: 768,
        h: 256,
      }),
    [],
  );

  // the wall reacts the instant you click — with a satisfying pop
  useEffect(() => {
    if (!sign.current) return;
    sign.current.material.map = signTextures[picked || 'idle'];
    gsap.fromTo(sign.current.scale, { x: 0.94, y: 0.94 }, { x: 1, y: 1, duration: 0.45, ease: 'back.out(4)' });
    if (beam.current) {
      gsap.fromTo(beam.current.material, { opacity: 0.85 }, { opacity: 0, duration: 0.9, ease: 'power2.out' });
    }
  }, [picked, signTextures]);

  return (
    <group position={[0, Y, 0]}>
      {/* store floor + glow strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 24]} />
        <meshStandardMaterial color="#1A2450" roughness={0.5} metalness={0.3} />
      </mesh>
      {[-2.6, 5.4].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[17, 0.12]} />
          <meshBasicMaterial color="#4ADE80" transparent opacity={0.55} />
        </mesh>
      ))}

      {/* back wall + THE reactive signage */}
      <mesh position={[0, 4, -6.5]}>
        <boxGeometry args={[24, 8.4, 0.5]} />
        <meshStandardMaterial color="#141B3A" />
      </mesh>
      <mesh ref={sign} position={[0, 5, -6.2]}>
        <planeGeometry args={[10.5, 4.1]} />
        <meshBasicMaterial map={signTextures.idle} transparent />
      </mesh>
      <pointLight position={[0, 5, -4]} color="#4ADE80" intensity={16} distance={12} />
      {/* store ceiling lights — keep the aisle bright and shoppable */}
      <pointLight position={[0, 7, 4]} color="#FFF6E8" intensity={110} distance={30} />
      <pointLight position={[-8, 6, 2]} color="#BFD3FF" intensity={50} distance={20} />
      <pointLight position={[8, 6, 2]} color="#BFD3FF" intensity={50} distance={20} />

      {/* growth billboard — the "why now" data, as a prop in the world */}
      <group position={[10.6, 0, -3.5]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 2.6, 0]}>
          <planeGeometry args={[5.4, 1.9]} />
          <meshBasicMaterial map={growthTex} transparent />
        </mesh>
        {/* two bars: social vs RMN growth */}
        <mesh position={[-0.9, 0.7, 0]}>
          <boxGeometry args={[0.8, 1.1, 0.8]} />
          <meshStandardMaterial color="#33406F" />
        </mesh>
        <mesh position={[0.9, 1.15, 0]}>
          <boxGeometry args={[0.8, 2.1, 0.8]} />
          <meshStandardMaterial color="#FFC24B" emissive="#FFC24B" emissiveIntensity={0.7} />
        </mesh>
      </group>

      {/* crumbling cookie — third-party tracking, falling apart */}
      <group position={[-10.4, 1.3, -2.4]} rotation={[0.3, 0.6, 0]}>
        <mesh>
          <cylinderGeometry args={[0.9, 0.9, 0.25, 20, 1]} />
          <meshStandardMaterial color="#C9A25E" roughness={0.9} />
        </mesh>
        {[[-0.4, 0.7, 0.2], [0.5, 0.9, -0.1], [0.1, 0.5, 0.5]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y - 1.6, z]} rotation={[i, i * 2, 0]}>
            <dodecahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial color="#B8914C" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* aisle shelves with the clickable products */}
      <Shelf z={-2.6}>
        <Product id="cereal" position={[-3.2, 1.55, 0]}>
          <ModelOrFallback
            src="/models/cereal-box.glb"
            fallback={
              <mesh>
                <boxGeometry args={[0.85, 1.15, 0.42]} />
                <meshStandardMaterial color="#FF6A55" />
              </mesh>
            }
          />
        </Product>
        <Product id="pb" position={[0.2, 1.45, 0]}>
          <mesh>
            <cylinderGeometry args={[0.42, 0.42, 0.85, 14]} />
            <meshStandardMaterial color="#C9832E" />
          </mesh>
        </Product>
        <Product id="chips" position={[3.4, 1.5, 0]}>
          <mesh rotation={[0, 0, 0.06]}>
            <boxGeometry args={[0.78, 1.05, 0.3]} />
            <meshStandardMaterial color="#B07CFF" />
          </mesh>
        </Product>
        {/* filler stock */}
        {[-5.8, -1.6, 1.9, 5.6].map((x, i) => (
          <mesh key={x} position={[x, 2.35, 0]}>
            <boxGeometry args={[0.5, 0.55, 0.3]} />
            <meshStandardMaterial color={['#4FD6EA', '#4ADE80', '#FFC24B', '#EEF2FF'][i]} />
          </mesh>
        ))}
      </Shelf>
      {/* second aisle sits off to the left so the camera sees the cart lane */}
      <group position={[-9, 0, 6.6]} rotation={[0, 0.28, 0]} scale={[0.7, 1, 1]}>
        <Shelf z={0}>
          {[-5, -2.4, 0.4, 2.8, 5.2].map((x, i) => (
            <mesh key={x} position={[x, 1.3, 0]}>
              <boxGeometry args={[0.55, 0.7, 0.3]} />
              <meshStandardMaterial color={['#FFC24B', '#FF6A55', '#4ADE80', '#B07CFF', '#4FD6EA'][i]} />
            </mesh>
          ))}
        </Shelf>
      </group>

      {/* data beam: shelf → signage, flashes on every click */}
      <mesh ref={beam} position={[-1.5, 3.2, -4.4]} rotation={[0, 0, 0.9]}>
        <planeGeometry args={[0.18, 7]} />
        <meshBasicMaterial color="#4ADE80" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      <Cart />
      <Coupons />
    </group>
  );
}
