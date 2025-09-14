'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({
  position,
  scale = 1,
  color = '#3B82F6',
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;

      // Gentle floating motion
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 3]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transmission={0.6}
          thickness={0.5}
          envMapIntensity={1}
          reflectivity={0.5}
        />
      </mesh>
    </Float>
  );
}

function AnimatedTorus({
  position,
  color = '#60A5FA',
}: {
  position: [number, number, number];
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z =
        Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles() {
  const count = 50;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      // Blue gradient colors
      const intensity = 0.5 + Math.random() * 0.5;
      colors[i * 3] = 0.23 * intensity; // R
      colors[i * 3 + 1] = 0.51 * intensity; // G
      colors[i * 3 + 2] = 0.96 * intensity; // B
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, 0]} intensity={0.3} color="#3B82F6" />

      <AnimatedSphere position={[2.5, 0.5, -1]} scale={1.2} color="#3B82F6" />
      <AnimatedSphere position={[-2, -0.5, -2]} scale={0.8} color="#60A5FA" />
      <AnimatedSphere position={[0, 1.5, -1.5]} scale={0.6} color="#93C5FD" />

      <AnimatedTorus position={[-1, 0.5, -1]} color="#3B82F6" />
      <AnimatedTorus position={[1.5, -1, -1.5]} color="#60A5FA" />

      <FloatingParticles />

      <Environment preset="city" />
    </>
  );
}

export function AnimatedBackground({ className = '' }: { className?: string }) {
  console.log('AnimatedBackground rendering'); // Debug log
  return (
    <div
      className={`absolute inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={<div>Loading 3D...</div>}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
