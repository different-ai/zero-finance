'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function TestScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} args={[2, 2, 2]}>
        <meshStandardMaterial color="#1B29FF" />
      </Box>
      <OrbitControls />
    </>
  );
}

export default function Test3DPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('3D Test Page Mounted');
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading 3D...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Three.js Test Page</h1>
        <p className="mb-4">
          If you see a blue cube below, Three.js is working!
        </p>

        <div className="w-full h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
          <Canvas>
            <TestScene />
          </Canvas>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h2 className="font-bold">Debug Info:</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>✅ Page mounted</li>
            <li>✅ Three.js imported</li>
            <li>✅ React Three Fiber imported</li>
            <li>✅ React Three Drei imported</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
