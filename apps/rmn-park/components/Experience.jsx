'use client';

import { Sparkles, Float } from '@react-three/drei';
import CameraRig from '@/components/CameraRig';
import BillboardScene from '@/components/scenes/BillboardScene';
import TradingFloorScene from '@/components/scenes/TradingFloorScene';
import GroceryScene from '@/components/scenes/GroceryScene';

/** The whole park: three booths strung on a vertical neon track. */
export default function Experience() {
  return (
    <>
      <color attach="background" args={['#07091A']} />
      <fog attach="fog" args={['#07091A', 30, 90]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 8]} intensity={0.5} />

      <CameraRig />

      {/* the ride track — glowing rail + rings connecting the booths */}
      <group position={[18, 0, -14]}>
        <mesh position={[0, -40, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 96, 8]} />
          <meshBasicMaterial color="#2A3C8F" />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => (
          <Float key={i} speed={1.4} floatIntensity={0.4} rotationIntensity={0.2}>
            <mesh position={[0, -i * 10.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1, 0.05, 8, 28]} />
              <meshBasicMaterial color={['#FF6A55', '#4FD6EA', '#B07CFF'][i % 3]} transparent opacity={0.45} />
            </mesh>
          </Float>
        ))}
      </group>

      {/* ambient stardust across the whole descent */}
      <Sparkles count={260} scale={[60, 110, 40]} position={[0, -40, -6]} size={2.2} speed={0.25} color="#BFD3FF" />

      <BillboardScene />
      <TradingFloorScene />
      <GroceryScene />
    </>
  );
}
