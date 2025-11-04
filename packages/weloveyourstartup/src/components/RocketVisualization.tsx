"use client";

import React, { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { GlitchEffect } from "@/effects/GlitchEffect";

// Extend R3F with custom effects
extend({ GlitchEffect });

function SpaceShuttle({ meshRef }: { meshRef: React.RefObject<THREE.Group> }) {
  const { scene } = useGLTF("/GL Transmission Format - Binary.glb");

  // Risograph-inspired limited color palette (2-color for authentic print aesthetic)
  const colorPalette = useMemo(() => [
    0x1B29FF, // primary vibrant blue #1B29FF
    0xFF3D5B, // risograph red accent #FF3D5B
  ], []);

  // Create edge-only geometries with clean silhouette and panel lines
  const edgeLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    let colorIndex = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        // Use EdgesGeometry for clean silhouette and major seams
        const edges = new THREE.EdgesGeometry(child.geometry, 20); // threshold angle 20°

        // Pick color from palette - alternate for visual interest
        const color = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;

        lines.push(
          <lineSegments key={child.uuid} geometry={edges}>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={1.0}
              linewidth={1.5}
            />
          </lineSegments>
        );
      }
    });

    return lines;
  }, [scene, colorPalette]);

  // Auto-rotate the shuttle
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]} rotation={[-1.68, 0.16, -0.97]} scale={0.5}>
      <primitive object={scene} visible={false} />
      {edgeLines}
    </group>
  );
}

interface RocketVisualizationProps {
  height?: string;
  showGlitch?: boolean;
  glitchIntensity?: number;
  glitchFrequency?: number;
}

export function RocketVisualization({
  height = "60vh",
  showGlitch = true,
  glitchIntensity = 0.8,
  glitchFrequency = 3.0
}: RocketVisualizationProps) {
  const shuttleRef = useRef<THREE.Group>(null);

  // Create glitch effect instance
  const glitchEffect = useMemo(() => new GlitchEffect(), []);

  // Helper function to convert hex color to RGB array (0-1 range)
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        ]
      : [1, 1, 1];
  };

  // Update glitch effect config
  useEffect(() => {
    if (showGlitch) {
      glitchEffect.config.intensity = glitchIntensity;
      glitchEffect.config.frequency = glitchFrequency;
      glitchEffect.config.blockSize = 40.0;
      glitchEffect.config.glitchColor = hexToRgb("#FFFFFF");
      glitchEffect.config.rgbSeparation = 0.006;
    }
  }, [showGlitch, glitchIntensity, glitchFrequency, glitchEffect]);

  return (
    <div className="relative w-full" style={{ height }}>
      <Canvas>
        {/* Camera positioned for good view */}
        <PerspectiveCamera makeDefault position={[848.96, 452.32, 521.8]} fov={35} />

        {/* Orbit Controls for manual camera control */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
        />

        {/* Bright lighting for clean risograph aesthetic */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.3} />

        {/* Space Shuttle */}
        <Suspense fallback={null}>
          <SpaceShuttle meshRef={shuttleRef} />
        </Suspense>

        {/* Post-processing effects */}
        <EffectComposer>
          {showGlitch ? (
            <>
              <Bloom intensity={0.6} luminanceThreshold={0.7} radius={0.3} />
              <primitive object={glitchEffect} />
              <ChromaticAberration offset={[0.005, 0.005]} />
              <Noise opacity={0.05} />
            </>
          ) : (
            <>
              <Bloom
                intensity={0.4}
                luminanceThreshold={0.85}
                luminanceSmoothing={0.3}
                radius={0.2}
                mipmapBlur
              />
              <ChromaticAberration
                offset={[0.0002, 0.0002]}
                radialModulation={false}
                modulationOffset={0.0}
              />
              <Noise
                opacity={0.015}
                premultiply
                blendFunction={0}
              />
            </>
          )}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
