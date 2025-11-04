"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { GlitchEffect } from "@/effects/GlitchEffect";
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
      <div className="w-full h-[600px] relative border border-gray-200 rounded-2xl overflow-hidden" style={{ backgroundColor: '#F7F7F2' }}>
        <Canvas
          camera={{ position: modelCamera.position, fov: modelCamera.fov }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
          performance={{ min: 0.5 }} // Allow frame skipping if needed
          style={{ backgroundColor: '#F7F7F2' }}
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
            {/* Glitch effect + bloom like playground */}
            <Bloom intensity={0.6} luminanceThreshold={0.7} radius={0.3} />
            <primitive object={new GlitchEffect()} />
            <ChromaticAberration offset={[0.005, 0.005]} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-900" style={{ backgroundColor: '#F7F7F2' }}>
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

          <div className="inline-block px-3 py-1 bg-[#1B29FF]/10 border border-[#1B29FF]/30 rounded text-xs text-[#1B29FF] mb-6 font-mono font-bold uppercase tracking-widest">
            {company.category}
          </div>

          <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-none max-w-4xl uppercase font-mono"
            style={{
              color: '#1B29FF',
              textShadow: '3px 3px 0px rgba(255, 61, 91, 0.4)'
            }}>
            {company.name}
          </h1>

          <p className="text-3xl lg:text-4xl font-mono max-w-3xl tracking-tight" style={{ color: '#1B29FF' }}>
            {company.tagline}
          </p>

          {/* First 3D Model - Shuttle */}
          <Model3D modelIndex={0} />

          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
            {company.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#1B29FF] text-white font-bold rounded-lg hover:bg-[#FF3D5B] transition-all text-lg"
              >
                Visit Website →
              </a>
            )}
            {company.twitter && (
              <a
                href={company.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-[#1B29FF] text-[#1B29FF] font-bold rounded-lg hover:bg-[#1B29FF]/10 transition-all text-lg"
              >
                Follow on X
              </a>
            )}
          </div>
        </section>

        {/* Funding Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white border border-[#1B29FF]/20 rounded-lg p-8">
            <p className="text-xs uppercase tracking-widest text-[#1B29FF]/60 mb-2 font-mono font-bold">
              FUNDING
            </p>
            <p className="text-5xl font-black text-[#1B29FF] font-mono tracking-tight">
              {formatCurrency(company.funding.amount)}
            </p>
            <p className="text-sm text-gray-500 mt-2 font-mono">
              {company.funding.round} • {company.funding.date}
            </p>
          </div>
          <div className="bg-white border border-[#FF3D5B]/20 rounded-lg p-8">
            <p className="text-xs uppercase tracking-widest text-[#FF3D5B]/60 mb-2 font-mono font-bold">
              POTENTIAL EARNINGS
            </p>
            <p className="text-5xl font-black text-[#FF3D5B] font-mono tracking-tight">
              +{formatCurrency(calculateSavings(company.funding.amount))}
            </p>
            <p className="text-sm text-gray-500 mt-2 font-mono">
              per year at 8% APY
            </p>
          </div>
        </section>

        {/* Mission Section with Second Model */}
        <section className="space-y-8">
          <div className="text-xs uppercase tracking-widest text-[#FF3D5B] font-mono font-bold">
            The Mission
          </div>
          <h2 className="text-5xl lg:text-6xl font-black max-w-3xl uppercase font-mono tracking-tighter"
            style={{
              color: '#1B29FF',
              textShadow: '2px 2px 0px rgba(255, 61, 91, 0.3)'
            }}>
            What They're Building
          </h2>

          {/* Second 3D Model - Apollo Soyuz */}
          <Model3D modelIndex={1} />

          {company.whyWeLoveThem && (
            <div className="bg-white border border-[#1B29FF]/20 rounded-2xl p-10 max-w-3xl">
              <p className="text-xs uppercase tracking-wider text-[#1B29FF] font-bold mb-4">
                Why We Love {company.name}
              </p>
              <p className="text-gray-700 leading-relaxed text-2xl">
                {company.whyWeLoveThem}
              </p>
            </div>
          )}
        </section>

        {/* Team Section with Third Model */}
        <section className="space-y-8">
          <div className="text-xs uppercase tracking-widest text-[#FF3D5B] font-mono font-bold">
            The Team
          </div>
          <h2 className="text-5xl lg:text-6xl font-black max-w-3xl uppercase font-mono tracking-tighter"
            style={{
              color: '#1B29FF',
              textShadow: '2px 2px 0px rgba(255, 61, 91, 0.3)'
            }}>
            The Brilliant Minds
          </h2>

          {/* Third 3D Model - Space Suit */}
          <Model3D modelIndex={2} />

          <div className="space-y-6 max-w-3xl">
            {company.founders.map((founder) => (
              <a
                key={founder.id}
                href={founder.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-8 p-8 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-[#1B29FF]/30 transition-all group"
              >
                {founder.avatar && (
                  <Image
                    src={founder.avatar}
                    alt={founder.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-gray-200 group-hover:border-[#1B29FF]/50 transition-all"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1B29FF] transition-colors">
                    {founder.name}
                  </h3>
                  <p className="text-gray-600 mt-2 text-lg">
                    {founder.role}
                  </p>
                </div>
                <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity text-[#67E2FF]">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Potential Section with Fourth Model */}
        <section className="space-y-8 pb-32">
          <div className="text-xs uppercase tracking-widest text-[#FF3D5B] font-mono font-bold">
            The Potential
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white max-w-3xl uppercase font-mono tracking-tighter"
            style={{
              textShadow: '2px 2px 0px rgba(27, 41, 255, 0.4)'
            }}>
            Maximize Your Runway
          </h2>
          <p className="text-white/50 text-xl max-w-3xl">
            See how {company.name} could earn more with 8% APY
          </p>

          {/* Fourth 3D Model - ISS */}
          <Model3D modelIndex={3} />

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 max-w-3xl">
            <SavingsCalculator defaultAmount={company.funding.amount} />
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 max-w-3xl">
            <p className="text-lg font-bold text-white/90 mb-6">
              💡 With {formatCurrency(company.funding.amount)} at 8% APY:
            </p>
            <ul className="space-y-4 text-white/60 text-lg">
              <li className="flex items-center gap-4">
                <span className="text-2xl">☕</span>
                <span>
                  {Math.floor(calculateMonthlyYield(company.funding.amount) / 5).toLocaleString()} coffees/month
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">💻</span>
                <span>
                  {Math.floor(calculateSavings(company.funding.amount) / 3000)} MacBooks/year
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">🏖️</span>
                <span>
                  {Math.floor(calculateMonthlyYield(company.funding.amount) / 5000)} team retreats/month
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <Link
              href="https://0.finance"
              className="flex-1 text-center px-10 py-5 bg-[#AFFF5A] text-black font-bold rounded-xl hover:bg-[#FFF46B] transition-all text-lg"
            >
              Start Earning 8% APY →
            </Link>
            <Link
              href="/"
              className="text-center px-10 py-5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all text-lg"
            >
              ← Browse More
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
