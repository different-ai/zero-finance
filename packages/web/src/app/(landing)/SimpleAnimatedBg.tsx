'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#1B29FF" />
    </mesh>
  );
}

export function SimpleAnimatedBg() {
  console.log('SimpleAnimatedBg component mounted');

  return (
    <div
      className="absolute inset-0 -z-10"
      style={{ background: 'rgba(59, 130, 246, 0.05)' }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
