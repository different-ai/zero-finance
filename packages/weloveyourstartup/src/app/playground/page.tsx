"use client";

import dynamic from 'next/dynamic';

// Import with SSR disabled to prevent server-side rendering issues with Three.js
const PlaygroundClient = dynamic(() => import('./PlaygroundClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-bold text-gray-600">Loading 3D Playground...</div>
    </div>
  ),
});

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
