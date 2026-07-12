'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { store, useStore } from '@/lib/store';
import { makeSignTexture } from '@/lib/textTexture';
import ModelOrFallback from '@/components/ModelOrFallback';
import Confetti from '@/components/scenes/Confetti';

/**
 * BOOTH 2 — THE DIGITAL MATCHMAKER (y ≈ -40)
 * A neon trading floor. Data packets stream between the Demand hub
 * (DSP — the brand's smart shopping agent) and the Supply hub
 * (SSP — the website's auctioneer) through the central Ad Exchange
 * ("a split-second stock market").
 *
 * The overlay's "Run the auction" button slows time to a matrix crawl,
 * flies one golden bid token DSP → Exchange → SSP, flips the empty ad
 * slot to AD LOADED, and pops confetti. ~100 ms, dramatized.
 */

const Y = -40;
const N_PACKETS = 90;

function Hub({ x, color, tex, mirror = false }) {
  const spin = useRef();
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.6;
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.8, 24]} />
        <meshStandardMaterial color="#141B3A" />
      </mesh>
      <mesh ref={spin} position={[0, 2.2, 0]}>
        <torusGeometry args={[1.5, 0.16, 12, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.85, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 2.6, 1]} color={color} intensity={18} distance={9} />
      <mesh position={[mirror ? -0.4 : 0.4, 4.4, 0]} rotation={[0, mirror ? 0.25 : -0.25, 0]}>
        <planeGeometry args={[4.4, 1.6]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </group>
  );
}

export default function TradingFloorScene() {
  const speed = useRef(1);
  const token = useRef();
  const matrix = useRef();
  const screenMesh = useRef();
  const confettiKey = useRef(0);
  const phase = useStore((s) => s.auctionPhase);

  const dspTex = useMemo(
    () => makeSignTexture({ lines: ['DSP · DEMAND', "the brand's shopping agent"], accent: '#4FD6EA', w: 640 }),
    [],
  );
  const sspTex = useMemo(
    () => makeSignTexture({ lines: ['SSP · SUPPLY', "the website's auctioneer"], accent: '#C86BFF', w: 640 }),
    [],
  );
  const exchangeTex = useMemo(
    () => makeSignTexture({ lines: ['AD EXCHANGE', 'a split-second stock market'], accent: '#FFC24B', w: 640 }),
    [],
  );
  const slotEmpty = useMemo(
    () => makeSignTexture({ lines: ['EMPTY AD SLOT', 'who wants it?'], accent: '#5D6A8F', fg: '#9AA6C8', w: 640 }),
    [],
  );
  const slotLoaded = useMemo(
    () => makeSignTexture({ lines: ['✓ AD LOADED', 'sold in ~100 ms'], accent: '#4ADE80', w: 640 }),
    [],
  );
  const matrixTex = useMemo(() => {
    const cnv = document.createElement('canvas');
    cnv.width = 256;
    cnv.height = 512;
    const c = cnv.getContext('2d');
    c.fillStyle = '#020604';
    c.fillRect(0, 0, 256, 512);
    c.font = '700 18px monospace';
    for (let i = 0; i < 240; i++) {
      c.fillStyle = `rgba(80,255,150,${Math.random() * 0.9})`;
      c.fillText(Math.random() > 0.5 ? '1' : '0', Math.random() * 256, Math.random() * 512);
    }
    const t = new THREE.CanvasTexture(cnv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);

  // packet flight paths: demand→exchange→supply and back
  const curves = useMemo(() => {
    const mk = (a, b, lift) =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(a, 2.2, 0),
        new THREE.Vector3(a / 2, 3.6 + lift, 1.4),
        new THREE.Vector3(0, 2.8, 0),
        new THREE.Vector3(b / 2, 3.6 + lift, -1.4),
        new THREE.Vector3(b, 2.2, 0),
      ]);
    return [mk(-8, 8, 0), mk(8, -8, 0.9)];
  }, []);
  const packets = useMemo(
    () =>
      Array.from({ length: N_PACKETS }, (_, i) => ({
        t: Math.random(),
        curve: i % 2,
        rate: 0.12 + Math.random() * 0.18,
      })),
    [],
  );
  const inst = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    packets.forEach((p, i) => {
      p.t = (p.t + dt * p.rate * speed.current) % 1;
      const pos = curves[p.curve].getPointAt(p.t);
      dummy.position.copy(pos);
      const s = 0.1 + Math.sin(p.t * Math.PI) * 0.08;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      inst.current.setMatrixAt(i, dummy.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;
    if (matrix.current) matrixTex.offset.y -= dt * 0.25 * (speed.current < 0.5 ? 1 : 0.15);
  });

  // THE AUCTION SEQUENCE — driven by the overlay button through the store
  useEffect(() => {
    if (phase !== 'running') return;
    confettiKey.current += 1;
    const tl = gsap.timeline({
      onComplete: () => store.set({ auctionPhase: 'done' }),
    });
    // 1. time slows into the matrix
    tl.to(speed, { current: 0.06, duration: 0.8, ease: 'power3.out' }, 0);
    tl.to(matrix.current.material, { opacity: 0.5, duration: 0.8 }, 0);
    // 2. the bid token flies DSP → Exchange
    tl.fromTo(
      token.current.position,
      { x: -8, y: 2.2, z: 0 },
      { x: 0, y: 2.8, z: 0.4, duration: 1.1, ease: 'power2.inOut' },
      0.5,
    );
    tl.to(token.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 }, 0.5);
    // 3. deal! Exchange → SSP
    tl.to(token.current.position, { x: 8, y: 2.2, z: 0, duration: 1.0, ease: 'power2.inOut' }, 1.8);
    // 4. the ad loads + confetti + time speeds back up
    tl.add(() => {
      if (screenMesh.current) screenMesh.current.material.map = slotLoaded;
    }, 2.9);
    tl.to(token.current.scale, { x: 0, y: 0, z: 0, duration: 0.25 }, 2.9);
    tl.to(speed, { current: 1, duration: 1.2, ease: 'power2.in' }, 3.0);
    tl.to(matrix.current.material, { opacity: 0, duration: 1.0 }, 3.0);
    return () => tl.kill();
  }, [phase, slotLoaded]);

  useEffect(() => {
    if (phase === 'idle' && screenMesh.current) screenMesh.current.material.map = slotEmpty;
  }, [phase, slotEmpty]);

  return (
    <group position={[0, Y, 0]}>
      {/* neon floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[44, 26]} />
        <meshStandardMaterial color="#0A0F26" roughness={0.35} metalness={0.6} />
      </mesh>
      <gridHelper args={[44, 30, '#2A3C8F', '#17204A']} position={[0, 0.02, 0]} />

      {/* the two sides of the market — Higgsfield GLB slots */}
      <ModelOrFallback src="/models/dsp-hub.glb" fallback={<Hub x={-8} color="#4FD6EA" tex={dspTex} />} />
      <ModelOrFallback src="/models/ssp-hub.glb" fallback={<Hub x={8} color="#C86BFF" tex={sspTex} mirror />} />

      {/* the Ad Exchange ring */}
      <group>
        <mesh position={[0, 2.8, 0]} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[2.1, 0.1, 12, 48]} />
          <meshStandardMaterial color="#FFC24B" emissive="#FFC24B" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[0, 2.8, 0]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color="#FFE3A8" emissive="#FFC24B" emissiveIntensity={1} />
        </mesh>
        <pointLight position={[0, 3.4, 1]} color="#FFC24B" intensity={14} distance={8} />
        <mesh position={[0, 5.6, 0]}>
          <planeGeometry args={[4.6, 1.6]} />
          <meshBasicMaterial map={exchangeTex} transparent />
        </mesh>
        {/* the ad slot being auctioned */}
        <mesh ref={screenMesh} position={[0, 7.4, -1]}>
          <planeGeometry args={[5, 1.9]} />
          <meshBasicMaterial map={slotEmpty} transparent />
        </mesh>
      </group>

      {/* flowing data packets */}
      <instancedMesh ref={inst} args={[null, null, N_PACKETS]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#9BEBF7" />
      </instancedMesh>

      {/* the golden bid token (flies during the auction) */}
      <mesh ref={token} position={[-8, 2.2, 0]} scale={0}>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#FFD98A" emissive="#FFC24B" emissiveIntensity={2} />
      </mesh>

      {/* matrix slow-mo veil */}
      <mesh ref={matrix} position={[0, 4, -6]}>
        <planeGeometry args={[30, 14]} />
        <meshBasicMaterial map={matrixTex} transparent opacity={0} />
      </mesh>

      {phase !== 'idle' && <Confetti key={confettiKey.current} origin={[0, 7, -0.5]} delay={2.95} />}
    </group>
  );
}
