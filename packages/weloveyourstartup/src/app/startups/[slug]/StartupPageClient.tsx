"use client";

import React, { useRef, useMemo, Suspense, useState, useEffect } from "react";
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

// Section definitions for navigation
const SECTIONS = [
  { id: 'company', label: 'COMPANY', color: '#00FFFF' },
  { id: 'mission', label: 'MISSION', color: '#00FF00' },
  { id: 'funding', label: 'FUNDING', color: '#FFFF00' },
  { id: 'team', label: 'TEAM', color: '#00FFFF' },
  { id: 'zero', label: 'ZERO_FINANCE', color: '#FF00FF' },
] as const;

export function StartupPageClient({ company }: StartupPageClientProps) {
  const [activeSection, setActiveSection] = useState('company');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track active section on scroll (mobile) or by click (desktop)
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        const sections = SECTIONS.map(s => document.getElementById(s.id));
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <div className="min-h-screen relative" style={{ backgroundColor: '#000000' }}>
      <CRTEffect />

      {/* AutoCAD-style Right Sidebar Navigation (desktop only) */}
      {!isMobile && (
        <div
          className="fixed right-0 top-0 h-screen w-64 bg-[#0000AA] border-l-2 border-[#00FFFF] z-50 flex flex-col"
          style={{ fontFamily: 'monospace' }}
        >
          {/* Header */}
          <div className="border-b-2 border-[#00FFFF] p-4 bg-[#0000AA]">
            <div className="text-[#FFFFFF] text-sm font-bold uppercase tracking-widest">
              ACAD_INTERFACE
            </div>
            <div className="text-[#00FF00] text-xs mt-1 uppercase tracking-wide">
              WE_LOVE_YOUR_STARTUP
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-[#00FFFF] text-xs font-bold uppercase tracking-wider mb-2 px-2">
                [ SECTIONS ]
              </div>
              {SECTIONS.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => navigateToSection(section.id)}
                  className={`w-full text-left px-3 py-3 mb-1 font-mono text-sm uppercase tracking-wide transition-all ${
                    activeSection === section.id
                      ? 'bg-[#00FFFF] text-[#0000AA] font-bold'
                      : 'text-[#FFFFFF] hover:bg-[#FFFFFF]/10'
                  }`}
                  style={{
                    borderLeft: activeSection === section.id ? `4px solid ${section.color}` : '4px solid transparent',
                  }}
                >
                  {String(index + 1).padStart(2, '0')} {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t-2 border-[#00FFFF] p-4 bg-[#0000AA]">
            <div className="text-[#00FF00] text-xs uppercase tracking-wide">
              Orden: _navigate
            </div>
            <div className="text-[#FFFFFF]/60 text-xs mt-1">
              VIEWPORT: {activeSection.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full-screen sections on desktop, scrollable on mobile */}
      <div className={`${!isMobile ? 'lg:pr-64' : ''}`}>
        <div className={`${!isMobile ? '' : 'max-w-6xl mx-auto px-8 py-16 space-y-24'}`}>

          {/* SECTION 1: COMPANY */}
          <section
            id="company"
            className={`${!isMobile ? 'min-h-screen' : ''} flex flex-col justify-center ${!isMobile ? 'px-16 py-16' : 'space-y-8'}`}
          >
            <div className="max-w-5xl">
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_01: COMPANY'}
              </div>

              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-auto opacity-80 mb-8 border-2 border-[#00FFFF]"
                />
              )}

              <div className="inline-block px-3 py-1 bg-black border-2 border-[#00FF00] text-sm text-[#00FF00] mb-8 font-mono font-bold uppercase tracking-wider">
                CATEGORY: {company.category.toUpperCase()}
              </div>

              <h1 className="text-8xl lg:text-9xl font-black tracking-tight leading-none uppercase font-mono mb-6"
                style={{
                  color: '#00FFFF',
                  letterSpacing: '0.05em'
                }}>
                {company.name.toUpperCase()}
              </h1>

              <p className="text-2xl lg:text-3xl font-mono max-w-4xl tracking-wide uppercase font-bold text-[#00FF00] mb-10">
                // {company.tagline.toUpperCase()}
              </p>

              <div className="mb-10">
                <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFF00] mb-3">
                  [ DESCRIPTION ]
                </div>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-mono max-w-3xl">
                  {company.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 bg-[#00FF00] text-black font-mono font-bold text-lg uppercase tracking-wider hover:bg-[#00FFFF] transition-all"
                  >
                    [LINK: WEBSITE]
                  </a>
                )}
                {company.twitter && (
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 border-2 border-[#00FFFF] text-[#00FFFF] font-mono font-bold text-lg uppercase tracking-wider hover:bg-[#00FFFF]/10 transition-all"
                  >
                    [LINK: TWITTER/X]
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: MISSION */}
          <section
            id="mission"
            className={`${!isMobile ? 'min-h-screen' : ''} flex flex-col justify-center ${!isMobile ? 'px-16 py-16' : 'space-y-6'}`}
          >
            <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
              {'>> SECTION_02: MISSION'}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1 space-y-8 max-w-3xl">
                <h2 className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                  style={{ color: '#00FFFF' }}>
                  WHAT_THEY'RE_BUILDING
                </h2>

                {company.whyWeLoveThem && (
                  <div className="bg-black border-2 border-[#00FFFF] p-10">
                    <p className="text-sm uppercase tracking-wider text-[#00FFFF] font-bold mb-6 font-mono">
                      [ NOTE: WHY_WE_LOVE_{company.name.toUpperCase().replace(/\s+/g, '_')} ]
                    </p>
                    <p className="text-white/90 leading-relaxed text-xl lg:text-2xl font-mono">
                      {company.whyWeLoveThem}
                    </p>
                  </div>
                )}
              </div>

              {/* 3D Model - Apollo Soyuz - on right */}
              {!isMobile && (
                <div className="w-full lg:w-[450px] h-[450px] flex-shrink-0">
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
              )}
            </div>
          </section>

          {/* SECTION 3: FUNDING */}
          <section
            id="funding"
            className={`${!isMobile ? 'min-h-screen' : ''} flex flex-col justify-center ${!isMobile ? 'px-16 py-16' : 'space-y-6'}`}
          >
            <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
              {'>> SECTION_03: FUNDING'}
            </div>

            <h2 className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide mb-10"
              style={{ color: '#FFFF00' }}>
              CAPITAL_RAISED
            </h2>

            <div className="max-w-3xl">
              <div className="bg-black border-3 border-[#00FFFF] p-10 border-2">
                <p className="text-sm uppercase tracking-widest text-[#00FFFF] mb-6 font-mono font-bold">
                  [ DATA: FUNDING_AMOUNT ]
                </p>
                <p className="text-6xl lg:text-7xl font-black text-[#00FFFF] font-mono tracking-tight mb-4">
                  {formatCurrency(company.funding.amount)}
                </p>
                <p className="text-lg text-[#00FFFF]/70 font-mono uppercase tracking-wide">
                  {company.funding.round} / {company.funding.date}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: TEAM */}
          <section
            id="team"
            className={`${!isMobile ? 'min-h-screen' : ''} flex flex-col justify-center ${!isMobile ? 'px-16 py-16' : 'space-y-6'}`}
          >
            <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
              {'>> SECTION_04: TEAM'}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1 space-y-8">
                <h2 className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                  style={{ color: '#00FFFF' }}>
                  THE_BRILLIANT_MINDS
                </h2>

                <div className="space-y-5 max-w-2xl">
                  {company.founders.map((founder, index) => (
                    <a
                      key={founder.id}
                      href={founder.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-6 p-8 bg-black border-2 border-[#00FF00] hover:bg-[#00FF00]/10 hover:border-[#00FFFF] transition-all group"
                    >
                      {founder.avatar && (
                        <Image
                          src={founder.avatar}
                          alt={founder.name}
                          width={70}
                          height={70}
                          className="border-2 border-[#00FF00] group-hover:border-[#00FFFF] transition-all"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#00FF00]/70 mb-2">
                          MEMBER_{(index + 1).toString().padStart(2, '0')}
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-black text-white group-hover:text-[#00FFFF] transition-colors font-mono uppercase tracking-wide">
                          {founder.name.toUpperCase()}
                        </h3>
                        <p className="text-[#00FF00] mt-2 text-lg font-mono uppercase tracking-wide">
                          ROLE: {founder.role.toUpperCase()}
                        </p>
                      </div>
                      <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity text-[#00FFFF] font-mono">
                        [→]
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* 3D Model - Space Suit - on right */}
              {!isMobile && (
                <div className="w-full lg:w-[450px] h-[450px] flex-shrink-0">
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
              )}
            </div>
          </section>

          {/* SECTION 5: ZERO_FINANCE (Separate Plug/Shill) */}
          <section
            id="zero"
            className={`${!isMobile ? 'min-h-screen' : ''} flex flex-col justify-center ${!isMobile ? 'px-16 py-16' : 'space-y-8 pb-32'}`}
          >
            <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
              {'>> SECTION_05: ZERO_FINANCE'}
            </div>

            <div className="max-w-4xl space-y-10">
              <h2 className="text-6xl lg:text-8xl font-black text-[#FF00FF] uppercase font-mono tracking-tighter leading-tight">
                MAXIMIZE_YOUR_RUNWAY
              </h2>

              <div className="bg-black border-2 border-[#00FF00] p-10">
                <p className="text-white/90 text-xl lg:text-2xl font-mono leading-relaxed mb-8">
                  Zero Finance helps startups like {company.name} stay leaner, move faster, and hire more by giving them access to banking with double the yield of traditional banks. The funds are insured, always withdrawable, and soon instantly spendable with our new corporate card.
                </p>
                <Link
                  href="https://0.finance"
                  className="inline-block px-8 py-4 bg-[#00FF00] text-black font-bold font-mono uppercase tracking-wider hover:bg-[#00FFFF] transition-all text-base border-2 border-[#00FF00] hover:border-[#00FFFF]"
                >
                  [ LEARN_HOW ]
                </Link>
              </div>

              <div className="space-y-6">
                <p className="text-xl lg:text-2xl text-[#00FFFF] font-mono uppercase tracking-wide">
                  This is how much they could save if they put:
                </p>

                <SavingsCalculator defaultAmount={company.funding.amount} />
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="https://0.finance"
                  className="flex-1 text-center px-12 py-6 bg-[#00FF00] text-black font-bold font-mono uppercase tracking-wider hover:bg-[#00FFFF] transition-all text-lg border-2 border-[#00FF00] hover:border-[#00FFFF]"
                >
                  [ ACTION: START_EARNING_8%_APY ]
                </Link>
                <Link
                  href="/"
                  className="text-center px-12 py-6 border-2 border-[#00FFFF] text-[#00FFFF] font-mono font-bold uppercase tracking-wider hover:bg-[#00FFFF]/10 transition-all text-lg"
                >
                  [ RETURN: BROWSE_MORE_STARTUPS ]
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
