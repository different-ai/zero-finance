"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { GlitchEffect } from "@/effects/GlitchEffect";
import { BlueNoiseHalftoneEffect } from "@/effects/BlueNoiseHalftoneEffect";
import { HologramEffect } from "@/effects/HologramEffect";
import { DitherWaveEffect } from "@/effects/DitherWaveEffect";
import * as THREE from "three";
import Link from 'next/link';
import Image from 'next/image';
import { SavingsCalculator } from '@/components/SavingsCalculator';

// 4-color CAD palette - direction-binned, discrete hues
const COLORS = {
  YELLOW: new THREE.Color(0xFFF46B),
  YELLOW_GREEN: new THREE.Color(0xAFFF5A),
  CYAN: new THREE.Color(0x67E2FF),
  BLUE: new THREE.Color(0x3D5BFF),
  RED: new THREE.Color(0xFF5A62), // accent for seams
};

// UV Panel Grid Shader - CAD-style orthogonal panels
const UVGridMaterial = shaderMaterial(
  {
    uFrequency: new THREE.Vector2(24, 36), // spanwise/chordwise panels
    uLineWidth: 0.014,
    uColor: new THREE.Color(0xF3FF6A), // yellow-green tint
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - crisp CAD panel grid
  `
    uniform vec2 uFrequency;
    uniform float uLineWidth;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec2 grid = fract(vUv * uFrequency);
      float gx = step(grid.x, uLineWidth) + step(1.0 - uLineWidth, grid.x);
      float gy = step(grid.y, uLineWidth) + step(1.0 - uLineWidth, grid.y);
      float gridLine = max(gx, gy);

      if (gridLine < 0.5) discard;

      vec3 finalColor = mix(vec3(1.0), uColor, 0.15);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ UVGridMaterial });

// Extend TypeScript types for custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    uVGridMaterial: any;
  }
}


interface Company {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  logo?: string;
  website?: string;
  twitter?: string;
  whyWeLoveThem?: string;
  funding: {
    amount: number;
    round: string;
    date: string;
  };
  founders: Array<{
    id: string;
    name: string;
    role: string;
    twitter?: string;
    avatar?: string;
  }>;
  showcase?: {
    emoji?: string;
  };
}

// Model paths for each section
const MODELS = [
  "/GL Transmission Format - Binary.glb", // Section 1: Intro - Shuttle
  "/Apollo Soyuz.glb", // Section 2: Mission - Apollo Soyuz
  "/Extravehicular Mobility Unit.glb", // Section 3: Team - Space Suit
  "/International Space Station (ISS) (A).glb", // Section 4: Potential - ISS
];

// Preload all models
MODELS.forEach((model) => useGLTF.preload(model));

interface WireframeRocketProps {
  scrollProgress: number;
  rotation: { x: number; y: number; z: number };
  scale: number;
  position: { x: number; y: number; z: number };
}

function WireframeRocket({ scrollProgress, rotation, scale, position }: WireframeRocketProps) {
  // Determine which model to show based on scroll progress
  const modelIndex = Math.min(Math.floor(scrollProgress * 4), 3);
  const modelPath = MODELS[modelIndex];

  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  // Exact copy from PlaygroundClient.tsx - 2-color alternating wireframe
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
  }, [scene, colorPalette, modelPath]);

  useFrame(() => {
    if (groupRef.current) {
      // Slow rotation based on scroll
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={scale}
    >
      <primitive object={scene} visible={false} />
      {edgeLines}
    </group>
  );
}

// CRT effect - scanlines, grain, minimal RGB split
function CRTEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Grain - 2-3% mono */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Scanlines - faint, ~15-20% opacity */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
        }}
      />
      {/* Cross-shaped subpixel mask - very subtle */}
      <div
        className="absolute inset-0 opacity-[0.26]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2.8px, rgba(255,255,255,0.015) 2.8px, rgba(255,255,255,0.015) 5.6px),
            repeating-linear-gradient(90deg, transparent, transparent 2.8px, rgba(255,255,255,0.015) 2.8px, rgba(255,255,255,0.015) 5.6px)
          `,
        }}
      />
    </div>
  );
}

interface StartupPageClientProps {
  company: Company;
}

export function StartupPageClient({ company }: StartupPageClientProps) {

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateSavings = (amount: number) => amount * 0.08 - amount * 0.04;
  const calculateMonthlyYield = (amount: number) => (amount * 0.08) / 12;

  // Independent 3D viewer - each model has its own Canvas, camera, and settings
  const Model3D = ({ modelIndex }: { modelIndex: number }) => {
    const isShuttle = modelIndex === 0;

    // Per-model camera settings (completely independent)
    const modelCamera = isShuttle
      ? { position: [0, 0, 100] as [number, number, number], fov: 75 }
      : { position: [0, 0, 15] as [number, number, number], fov: 75 };

    // Per-model transform settings
    const modelTransform = isShuttle
      ? {
          rotation: { x: -0.80, y: 0.64, z: -2.46 },
          scale: 0.12,
          position: { x: 0, y: 0, z: 0 }
        }
      : {
          rotation: { x: -1.2, y: 0, z: -0.5 },
          scale: 0.7,
          position: { x: 0, y: 0, z: 12.0 }
        };

    return (
      <div className="w-full h-[600px] relative border-t border-b border-[#00FF00]" style={{ backgroundColor: '#000000' }}>
        <Canvas
          camera={{ position: modelCamera.position, fov: modelCamera.fov }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
          performance={{ min: 0.5 }} // Allow frame skipping if needed
          style={{ backgroundColor: '#000000' }}
        >
          <PerspectiveCamera makeDefault position={modelCamera.position} fov={modelCamera.fov} />

          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={0.4} />

          <Suspense fallback={null}>
            <WireframeRocket
              scrollProgress={modelIndex / 3}
              rotation={modelTransform.rotation}
              scale={modelTransform.scale}
              position={modelTransform.position}
            />
          </Suspense>

          <EffectComposer>
            {/* Different effect per model */}
            {modelIndex === 0 && (
              <>
                {/* Shuttle: Glitch effect */}
                <Bloom intensity={0.6} luminanceThreshold={0.7} radius={0.3} />
                <primitive object={new GlitchEffect()} />
                <ChromaticAberration offset={[0.005, 0.005]} />
                <Noise opacity={0.05} />
              </>
            )}
            {modelIndex === 1 && (
              <>
                {/* Apollo/Soyuz: Dither Wave */}
                <primitive object={new DitherWaveEffect()} />
                <Bloom intensity={0.4} luminanceThreshold={0.8} radius={0.2} />
              </>
            )}
            {modelIndex === 2 && (
              <>
                {/* Space Suit: Hologram effect */}
                <primitive object={new HologramEffect()} />
                <Bloom intensity={1.2} luminanceThreshold={0.5} radius={0.5} />
              </>
            )}
            {modelIndex === 3 && (
              <>
                {/* ISS: Dither Wave */}
                <primitive object={new DitherWaveEffect()} />
                <Bloom intensity={0.4} luminanceThreshold={0.8} radius={0.2} />
              </>
            )}
          </EffectComposer>
        </Canvas>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <CRTEffect />

      {/* Single Scroll Flow - Text + 3D Mixed */}
      <div className="max-w-6xl mx-auto px-8 py-16 space-y-24">

        {/* Hero Section with Model */}
        <section className="space-y-8">
          {company.logo && (
            <img
              src={company.logo}
              alt={company.name}
              className="h-12 w-auto opacity-80"
            />
          )}

          <div className="inline-block px-2 py-0.5 bg-black border border-[#00FF00] text-[11px] text-[#00FF00] mb-4 font-mono font-bold uppercase tracking-wider">
            CATEGORY: {company.category.toUpperCase()}
          </div>

          <h1 className="text-8xl lg:text-9xl font-black tracking-tight leading-none max-w-5xl uppercase font-mono"
            style={{
              color: '#00FFFF',
              letterSpacing: '0.05em'
            }}>
            {company.name.toUpperCase()}
          </h1>

          <p className="text-xl lg:text-2xl font-mono max-w-4xl tracking-wide uppercase font-bold text-[#00FF00]/80 mt-4">
            // {company.tagline.toUpperCase()}
          </p>

          {/* First 3D Model - Shuttle */}
          <Model3D modelIndex={0} />

          <div className="max-w-4xl">
            <div className="text-base font-mono font-bold uppercase tracking-wider text-[#00FFFF] mb-4">
              DESCRIPTION:
            </div>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-mono">
              {company.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#00FF00] text-black font-mono font-bold text-base uppercase tracking-wider hover:bg-[#00FFFF] transition-all"
              >
                [LINK: WEBSITE]
              </a>
            )}
            {company.twitter && (
              <a
                href={company.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-[#00FFFF] text-[#00FFFF] font-mono font-bold text-base uppercase tracking-wider hover:bg-[#00FFFF]/10 transition-all"
              >
                [LINK: TWITTER/X]
              </a>
            )}
          </div>
        </section>

        {/* Funding Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <div className="bg-black border-2 border-[#00FFFF] p-8">
            <p className="text-base uppercase tracking-widest text-[#00FFFF] mb-4 font-mono font-bold">
              [ DATA: FUNDING_AMOUNT ]
            </p>
            <p className="text-5xl lg:text-6xl font-black text-[#00FFFF] font-mono tracking-tight">
              {formatCurrency(company.funding.amount)}
            </p>
            <p className="text-base text-[#00FFFF]/70 mt-4 font-mono uppercase tracking-wide">
              {company.funding.round} / {company.funding.date}
            </p>
          </div>
          <div className="bg-black border-2 border-[#FFFF00] p-8">
            <p className="text-base uppercase tracking-widest text-[#FFFF00] mb-4 font-mono font-bold">
              [ CALC: POTENTIAL_YIELD ]
            </p>
            <p className="text-5xl lg:text-6xl font-black text-[#FFFF00] font-mono tracking-tight">
              +{formatCurrency(calculateSavings(company.funding.amount))}
            </p>
            <p className="text-base text-[#FFFF00]/70 mt-4 font-mono uppercase tracking-wide">
              ANNUAL @ 8% APY
            </p>
          </div>
        </section>

        {/* Mission Section with Second Model */}
        <section className="space-y-6">
          <div className="text-base uppercase tracking-widest text-[#FF00FF] font-mono font-bold">
            {'>> SECTION_02: MISSION'}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <h2 className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                style={{
                  color: '#00FFFF'
                }}>
                WHAT_THEY'RE_BUILDING
              </h2>

              {company.whyWeLoveThem && (
                <div className="bg-black border-2 border-[#00FFFF] p-8">
                  <p className="text-base uppercase tracking-wider text-[#00FFFF] font-bold mb-4 font-mono">
                    [ NOTE: WHY_WE_LOVE_{company.name.toUpperCase().replace(/\s+/g, '_')} ]
                  </p>
                  <p className="text-white/90 leading-relaxed text-xl lg:text-2xl font-mono">
                    {company.whyWeLoveThem}
                  </p>
                </div>
              )}
            </div>

            {/* Second 3D Model - Apollo Soyuz - smaller on right */}
            <div className="w-full lg:w-[400px] h-[400px] flex-shrink-0">
              <div className="w-full h-full relative border-t border-b border-[#00FF00]" style={{ backgroundColor: '#000000' }}>
                <Canvas
                  camera={{ position: [0, 0, 15], fov: 75 }}
                  dpr={[1, 1.5]}
                  performance={{ min: 0.5 }}
                  style={{ backgroundColor: '#000000' }}
                >
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
                  <ambientLight intensity={0.2} />
                  <directionalLight position={[5, 5, 5]} intensity={0.4} />
                  <Suspense fallback={null}>
                    <WireframeRocket
                      scrollProgress={1 / 3}
                      rotation={{ x: -1.2, y: 0, z: -0.5 }}
                      scale={0.7}
                      position={{ x: 0, y: 0, z: 12.0 }}
                    />
                  </Suspense>
                  <EffectComposer>
                    <primitive object={new DitherWaveEffect()} />
                    <Bloom intensity={0.4} luminanceThreshold={0.8} radius={0.2} />
                  </EffectComposer>
                </Canvas>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section with Third Model */}
        <section className="space-y-6">
          <div className="text-base uppercase tracking-widest text-[#FF00FF] font-mono font-bold">
            {'>> SECTION_03: TEAM'}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <h2 className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                style={{
                  color: '#00FFFF'
                }}>
                THE_BRILLIANT_MINDS
              </h2>

              <div className="space-y-4">
                {company.founders.map((founder, index) => (
                  <a
                    key={founder.id}
                    href={founder.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-6 p-6 bg-black border-2 border-[#00FF00] hover:bg-[#00FF00]/10 hover:border-[#00FFFF] transition-all group"
                  >
                    {founder.avatar && (
                      <Image
                        src={founder.avatar}
                        alt={founder.name}
                        width={60}
                        height={60}
                        className="border-2 border-[#00FF00] group-hover:border-[#00FFFF] transition-all"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#00FF00]/70 mb-2">
                        MEMBER_{(index + 1).toString().padStart(2, '0')}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-black text-white group-hover:text-[#00FFFF] transition-colors font-mono uppercase tracking-wide">
                        {founder.name.toUpperCase()}
                      </h3>
                      <p className="text-[#00FF00]/80 mt-2 text-base font-mono uppercase tracking-wide">
                        ROLE: {founder.role.toUpperCase()}
                      </p>
                    </div>
                    <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity text-[#00FFFF] font-mono">
                      [→]
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Third 3D Model - Space Suit - smaller on right */}
            <div className="w-full lg:w-[400px] h-[400px] flex-shrink-0">
              <div className="w-full h-full relative border-t border-b border-[#00FF00]" style={{ backgroundColor: '#000000' }}>
                <Canvas
                  camera={{ position: [0, 0, 15], fov: 75 }}
                  dpr={[1, 1.5]}
                  performance={{ min: 0.5 }}
                  style={{ backgroundColor: '#000000' }}
                >
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
                  <ambientLight intensity={0.2} />
                  <directionalLight position={[5, 5, 5]} intensity={0.4} />
                  <Suspense fallback={null}>
                    <WireframeRocket
                      scrollProgress={2 / 3}
                      rotation={{ x: -1.2, y: 0, z: -0.5 }}
                      scale={0.7}
                      position={{ x: 0, y: 0, z: 12.0 }}
                    />
                  </Suspense>
                  <EffectComposer>
                    <primitive object={new HologramEffect()} />
                    <Bloom intensity={1.2} luminanceThreshold={0.5} radius={0.5} />
                  </EffectComposer>
                </Canvas>
              </div>
            </div>
          </div>
        </section>

        {/* Potential Section with Fourth Model */}
        <section className="space-y-8 pb-32">
          <div className="text-base uppercase tracking-widest text-[#FF00FF] font-mono font-bold">
            {'>> SECTION_04: POTENTIAL'}
          </div>
          <h2 className="text-6xl lg:text-8xl font-black text-[#00FFFF] max-w-4xl uppercase font-mono tracking-tighter leading-tight">
            MAXIMIZE_YOUR_RUNWAY
          </h2>
          <p className="text-[#00FF00]/80 text-xl lg:text-2xl max-w-4xl font-mono uppercase tracking-wide">
            [ ANALYSIS: {company.name.toUpperCase()}_YIELD_PROJECTION @ 8% APY ]
          </p>

          {/* Fourth 3D Model - ISS */}
          <Model3D modelIndex={3} />

          <div className="bg-black border-2 border-[#00FF00] p-10 max-w-3xl">
            <SavingsCalculator defaultAmount={company.funding.amount} />
          </div>

          <div className="bg-black border-2 border-[#FFFF00] p-8 max-w-3xl">
            <p className="text-base font-bold text-[#FFFF00] mb-6 uppercase font-mono tracking-wider">
              [ OUTPUT: YIELD_EQUIVALENTS @ {formatCurrency(company.funding.amount)} CAPITAL ]
            </p>
            <ul className="space-y-4 text-white/90 text-lg lg:text-xl font-mono">
              <li className="flex items-start gap-4">
                <span className="text-[#00FFFF] font-bold text-xl">{'>'}</span>
                <span className="uppercase">
                  COFFEE_BUDGET: {Math.floor(calculateMonthlyYield(company.funding.amount) / 5).toLocaleString()} UNITS/MONTH
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#00FFFF] font-bold text-xl">{'>'}</span>
                <span className="uppercase">
                  MACBOOK_UNITS: {Math.floor(calculateSavings(company.funding.amount) / 3000)} DEVICES/YEAR
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#00FFFF] font-bold text-xl">{'>'}</span>
                <span className="uppercase">
                  TEAM_RETREATS: {Math.floor(calculateMonthlyYield(company.funding.amount) / 5000)} EVENTS/MONTH
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <Link
              href="https://0.finance"
              className="flex-1 text-center px-10 py-6 bg-[#00FF00] text-black font-bold font-mono uppercase tracking-wider hover:bg-[#00FFFF] transition-all text-base lg:text-lg border-2 border-[#00FF00] hover:border-[#00FFFF]"
            >
              [ ACTION: START_EARNING_8%_APY ]
            </Link>
            <Link
              href="/"
              className="text-center px-10 py-6 border-2 border-[#00FF00] text-[#00FF00] font-mono font-bold uppercase tracking-wider hover:bg-[#00FF00]/10 transition-all text-base lg:text-lg"
            >
              [ RETURN: BROWSE_MORE ]
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
