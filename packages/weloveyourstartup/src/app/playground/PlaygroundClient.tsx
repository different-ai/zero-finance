"use client";

import React, { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, OrbitControls, TransformControls } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { DitherWaveEffect } from "@/effects/DitherWaveEffect";
import { GlitchEffect } from "@/effects/GlitchEffect";
import { HologramEffect } from "@/effects/HologramEffect";
import { DitheringOverlayEffect } from "@/effects/DitheringOverlayEffect";
import { BlueNoiseHalftoneEffect } from "@/effects/BlueNoiseHalftoneEffect";

// Extend R3F with custom effects
extend({ DitherWaveEffect, GlitchEffect, HologramEffect, DitheringOverlayEffect, BlueNoiseHalftoneEffect });

type EffectType = 'glitch' | 'hologram' | 'ditherWave' | 'ditheringOverlay' | 'blueNoiseHalftone' | 'none';

interface EffectConfig {
  name: string;
  description: string;
  color: string;
}

const EFFECTS: Record<EffectType, EffectConfig> = {
  glitch: {
    name: 'Glitch',
    description: 'Digital glitch distortion with RGB separation',
    color: '#FF3D5B',
  },
  hologram: {
    name: 'Hologram',
    description: 'Sci-fi holographic interference effect',
    color: '#00FFFF',
  },
  ditherWave: {
    name: 'Dither Wave',
    description: 'Animated dithering wave pattern',
    color: '#9B59B6',
  },
  ditheringOverlay: {
    name: 'Dithering Overlay',
    description: 'Classic halftone dithering',
    color: '#F39C12',
  },
  blueNoiseHalftone: {
    name: 'Blue Noise Halftone',
    description: 'Blue noise based halftone effect',
    color: '#3498DB',
  },
  none: {
    name: 'None',
    description: 'Clean render with basic post-processing',
    color: '#95A5A6',
  },
};

function CameraLogger({ onPositionChange }: { onPositionChange: (pos: [number, number, number]) => void }) {
  const { camera } = useThree();

  useFrame(() => {
    onPositionChange([
      Math.round(camera.position.x * 100) / 100,
      Math.round(camera.position.y * 100) / 100,
      Math.round(camera.position.z * 100) / 100
    ]);
  });

  return null;
}

function SpaceShuttle({
  meshRef,
  onTransformChange
}: {
  meshRef: React.RefObject<THREE.Group>;
  onTransformChange: (pos: [number, number, number], rot: [number, number, number], scale: number) => void;
}) {
  const { scene } = useGLTF("/GL Transmission Format - Binary.glb");

  const colorPalette = useMemo(() => [
    0x1B29FF, // primary blue
    0xFF3D5B, // risograph red
  ], []);

  const edgeLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    let colorIndex = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const edges = new THREE.EdgesGeometry(child.geometry, 20);
        const color = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;

        lines.push(
          <lineSegments key={child.uuid} geometry={edges}>
            <lineBasicMaterial color={color} transparent opacity={1.0} linewidth={1.5} />
          </lineSegments>
        );
      }
    });

    return lines;
  }, [scene, colorPalette]);

  useFrame(() => {
    if (meshRef.current) {
      onTransformChange(
        [
          Math.round(meshRef.current.position.x * 100) / 100,
          Math.round(meshRef.current.position.y * 100) / 100,
          Math.round(meshRef.current.position.z * 100) / 100
        ],
        [
          Math.round(meshRef.current.rotation.x * 100) / 100,
          Math.round(meshRef.current.rotation.y * 100) / 100,
          Math.round(meshRef.current.rotation.z * 100) / 100
        ],
        Math.round(meshRef.current.scale.x * 100) / 100
      );
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]} rotation={[-1.68, 0.16, -0.97]} scale={0.5}>
      <primitive object={scene} visible={false} />
      {edgeLines}
    </group>
  );
}

export default function PlaygroundClient() {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([848.96, 452.32, 521.8]);
  const [shuttlePosition, setShuttlePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [shuttleRotation, setShuttleRotation] = useState<[number, number, number]>([-1.68, 0.16, -0.97]);
  const [shuttleScale, setShuttleScale] = useState<number>(0.5);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [showControls, setShowControls] = useState<boolean>(true);
  const [activeEffect, setActiveEffect] = useState<EffectType>('glitch');
  const shuttleRef = useRef<THREE.Group>(null);
  const orbitControlsRef = useRef<any>(null);

  const [bgColor, setBgColor] = useState<string>("#FAFAF4");

  // Glitch effect config
  const [glitchIntensity, setGlitchIntensity] = useState<number>(0.8);
  const [glitchFrequency, setGlitchFrequency] = useState<number>(3.0);
  const [glitchBlockSize, setGlitchBlockSize] = useState<number>(40.0);
  const [glitchRgbSeparation, setGlitchRgbSeparation] = useState<number>(0.006);

  // Create effect instances
  const glitchEffect = useMemo(() => new GlitchEffect(), []);

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

  useEffect(() => {
    if (activeEffect === 'glitch') {
      glitchEffect.config.intensity = glitchIntensity;
      glitchEffect.config.frequency = glitchFrequency;
      glitchEffect.config.blockSize = glitchBlockSize;
      glitchEffect.config.glitchColor = hexToRgb("#FFFFFF");
      glitchEffect.config.rgbSeparation = glitchRgbSeparation;
    }
  }, [glitchIntensity, glitchFrequency, glitchBlockSize, glitchRgbSeparation, glitchEffect, activeEffect]);

  const handleTransformChange = (pos: [number, number, number], rot: [number, number, number], scale: number) => {
    setShuttlePosition(pos);
    setShuttleRotation(rot);
    setShuttleScale(scale);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') setTransformMode("translate");
      if (e.key === 'e' || e.key === 'E') setTransformMode("rotate");
      if (e.key === 'r' || e.key === 'R') setTransformMode("scale");
      if (e.key === 'h' || e.key === 'H') setShowControls(prev => !prev);
      if (e.key >= '1' && e.key <= '6') {
        const effects: EffectType[] = ['glitch', 'hologram', 'ditherWave', 'ditheringOverlay', 'blueNoiseHalftone', 'none'];
        setActiveEffect(effects[parseInt(e.key) - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="w-full min-h-screen text-gray-900 flex flex-col items-center overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Title */}
      <div className="text-6xl md:text-7xl font-black tracking-tighter mt-16 mb-6 uppercase" style={{
        color: '#1B29FF',
        textShadow: '2px 2px 0px rgba(255, 61, 91, 0.3)'
      }}>
        <div className="text-center leading-tight">
          <div>Effects</div>
          <div>Playground</div>
        </div>
      </div>

      {/* Effect Selector */}
      <div className="flex flex-wrap gap-2 mb-6 px-4 max-w-4xl">
        {(Object.keys(EFFECTS) as EffectType[]).map((effect, index) => (
          <button
            key={effect}
            onClick={() => setActiveEffect(effect)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
              activeEffect === effect
                ? 'scale-105 shadow-lg'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: EFFECTS[effect].color,
              color: effect === 'none' || effect === 'ditheringOverlay' ? '#000' : '#fff',
            }}
          >
            <div className="font-bold">{EFFECTS[effect].name}</div>
            <div className="text-xs opacity-80">({index + 1})</div>
          </button>
        ))}
      </div>

      {/* Info Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 bg-black/90 p-4 rounded-lg border font-mono text-sm z-10 max-w-md"
          style={{ borderColor: EFFECTS[activeEffect].color }}>
          <div className="font-bold mb-2" style={{ color: EFFECTS[activeEffect].color }}>
            Active Effect: {EFFECTS[activeEffect].name}
          </div>
          <div className="text-gray-400 text-xs mb-3">{EFFECTS[activeEffect].description}</div>

          <div className="text-cyan-400 font-bold mb-2 text-xs">Camera Position:</div>
          <div className="text-green-400 mb-3 text-xs font-mono">
            [{cameraPosition[0]}, {cameraPosition[1]}, {cameraPosition[2]}]
          </div>

          <div className="text-gray-400 text-xs mt-3 space-y-1 border-t border-gray-700 pt-3">
            <div>1-6: Switch effects</div>
            <div>Mouse: Orbit camera</div>
            <div>Scroll: Zoom</div>
            <div>W/E/R: Move/Rotate/Scale</div>
            <div>H: Hide/show panels</div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setTransformMode("translate")}
              className={`px-2 py-1 text-xs rounded ${transformMode === "translate" ? "bg-cyan-600" : "bg-gray-700"}`}
            >
              Move (W)
            </button>
            <button
              onClick={() => setTransformMode("rotate")}
              className={`px-2 py-1 text-xs rounded ${transformMode === "rotate" ? "bg-cyan-600" : "bg-gray-700"}`}
            >
              Rotate (E)
            </button>
            <button
              onClick={() => setTransformMode("scale")}
              className={`px-2 py-1 text-xs rounded ${transformMode === "scale" ? "bg-cyan-600" : "bg-gray-700"}`}
            >
              Scale (R)
            </button>
          </div>

          <div className="mt-4 border-t border-gray-700 pt-3">
            <div className="text-purple-400 font-bold mb-2 text-xs">Background Color:</div>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Effect-specific Controls */}
      {showControls && activeEffect === 'glitch' && (
        <div className="absolute top-4 right-4 bg-black/90 p-4 rounded-lg border border-red-500 font-mono text-sm z-10 w-80">
          <div className="text-red-400 font-bold mb-3">Glitch Parameters:</div>

          <div className="space-y-3">
            <div>
              <label className="text-cyan-400 text-xs block mb-1">
                Intensity: {glitchIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={glitchIntensity}
                onChange={(e) => setGlitchIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-cyan-400 text-xs block mb-1">
                Frequency: {glitchFrequency.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={glitchFrequency}
                onChange={(e) => setGlitchFrequency(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-cyan-400 text-xs block mb-1">
                Block Size: {glitchBlockSize.toFixed(0)}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={glitchBlockSize}
                onChange={(e) => setGlitchBlockSize(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-cyan-400 text-xs block mb-1">
                RGB Separation: {glitchRgbSeparation.toFixed(4)}
              </label>
              <input
                type="range"
                min="0"
                max="0.02"
                step="0.0001"
                value={glitchRgbSeparation}
                onChange={(e) => setGlitchRgbSeparation(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full" style={{ height: '80vh' }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[848.96, 452.32, 521.8]} fov={35} />
          <OrbitControls ref={orbitControlsRef} enabled={showControls} enableDamping dampingFactor={0.05} target={[0, 0, 0]} />
          <CameraLogger onPositionChange={setCameraPosition} />

          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />

          <Suspense fallback={null}>
            <SpaceShuttle meshRef={shuttleRef} onTransformChange={handleTransformChange} />
            {showControls && (
              <TransformControls
                object={shuttleRef}
                mode={transformMode}
                onMouseDown={() => orbitControlsRef.current && (orbitControlsRef.current.enabled = false)}
                onMouseUp={() => orbitControlsRef.current && (orbitControlsRef.current.enabled = true)}
              />
            )}
          </Suspense>

          <EffectComposer>
            {activeEffect === 'glitch' && (
              <>
                <Bloom intensity={0.6} luminanceThreshold={0.7} radius={0.3} />
                <primitive object={glitchEffect} />
                <ChromaticAberration offset={[0.005, 0.005]} />
                <Noise opacity={0.05} />
              </>
            )}
            {activeEffect === 'hologram' && (
              <>
                <primitive object={new HologramEffect()} />
                <Bloom intensity={1.2} luminanceThreshold={0.5} radius={0.5} />
              </>
            )}
            {activeEffect === 'ditherWave' && (
              <>
                <primitive object={new DitherWaveEffect()} />
                <Bloom intensity={0.4} luminanceThreshold={0.8} radius={0.2} />
              </>
            )}
            {activeEffect === 'ditheringOverlay' && (
              <primitive object={new DitheringOverlayEffect()} />
            )}
            {activeEffect === 'blueNoiseHalftone' && (
              <>
                <primitive object={new BlueNoiseHalftoneEffect()} />
                <Bloom intensity={0.3} luminanceThreshold={0.9} radius={0.2} />
              </>
            )}
            {activeEffect === 'none' && (
              <Bloom intensity={0.2} luminanceThreshold={0.9} radius={0.2} />
            )}
          </EffectComposer>
        </Canvas>
      </div>

      <p className="mt-4 text-sm font-medium uppercase tracking-wide" style={{ color: EFFECTS[activeEffect].color }}>
        {EFFECTS[activeEffect].name} Effect — Playground Testing
      </p>
    </div>
  );
}
