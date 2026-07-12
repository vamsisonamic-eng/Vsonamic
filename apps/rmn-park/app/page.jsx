'use client';

import dynamic from 'next/dynamic';

// The whole park is client-side WebGL; skip SSR for the canvas tree.
const ParkApp = dynamic(() => import('@/components/ParkApp'), { ssr: false });

export default function Page() {
  return <ParkApp />;
}
