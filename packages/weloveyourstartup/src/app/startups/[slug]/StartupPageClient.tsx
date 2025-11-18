'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, shaderMaterial } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from '@react-three/postprocessing';
import { GlitchEffect } from '@/effects/GlitchEffect';
import { BlueNoiseHalftoneEffect } from '@/effects/BlueNoiseHalftoneEffect';
import * as THREE from 'three';
import Link from 'next/link';
import Image from 'next/image';
import { StartupCalculatorSection } from '@/components/StartupCalculatorSection';

// 4-color CAD palette - direction-binned, discrete hues
const COLORS = {
  YELLOW: new THREE.Color(0xfff46b),
  YELLOW_GREEN: new THREE.Color(0xafff5a),
  CYAN: new THREE.Color(0x67e2ff),
  BLUE: new THREE.Color(0x3d5bff),
  RED: new THREE.Color(0xff5a62), // accent for seams
};

// UV Panel Grid Shader - CAD-style orthogonal panels
const UVGridMaterial = shaderMaterial(
  {
    uFrequency: new THREE.Vector2(24, 36), // spanwise/chordwise panels
    uLineWidth: 0.014,
    uColor: new THREE.Color(0xf3ff6a), // yellow-green tint
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
  `,
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
  longDescription?: string;
  category: string;
  logo?: string;
  model3d?: string; // Single model (legacy support)
  models3d?: string[]; // Array of 4 models for each section
  modelConfigs?: Array<{
    cameraPosition: [number, number, number];
    cameraFov: number;
    rotation: { x: number; y: number; z: number };
    scale: number;
    position: { x: number; y: number; z: number };
  }>;
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
  '/GL Transmission Format - Binary.glb', // Section 1: Intro - Shuttle
  '/Apollo Soyuz.glb', // Section 2: Mission - Apollo Soyuz
  '/Extravehicular Mobility Unit.glb', // Section 3: Team - Space Suit
  '/International Space Station (ISS) (A).glb', // Section 4: Potential - ISS
];

// Preload all models
MODELS.forEach((model) => useGLTF.preload(model));

interface WireframeRocketProps {
  scrollProgress: number;
  rotation: { x: number; y: number; z: number };
  scale: number;
  position: { x: number; y: number; z: number };
  customModels?: string[]; // Optional custom model path
}

// Subtle camera drift component
function CameraDrift() {
  useFrame((state) => {
    if (state.camera) {
      // Very subtle camera position drift
      state.camera.position.x +=
        Math.sin(state.clock.elapsedTime * 0.1) * 0.002;
      state.camera.position.y +=
        Math.cos(state.clock.elapsedTime * 0.08) * 0.002;

      // Make camera look at center with subtle variation
      const target = new THREE.Vector3(
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1,
        Math.cos(state.clock.elapsedTime * 0.07) * 0.1,
        0,
      );
      state.camera.lookAt(target);
    }
  });
  return null;
}

function WireframeRocket({
  scrollProgress,
  rotation,
  scale,
  position,
  customModels,
}: WireframeRocketProps) {
  // Determine which model to show based on scroll progress
  const modelIndex = Math.min(Math.floor(scrollProgress * 6), 5);
  const modelPath = customModels && customModels[modelIndex]
    ? customModels[modelIndex]
    : MODELS[Math.min(modelIndex, 3)]; // Cap at 3 for default MODELS array (only 4 models)

  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  // Exact copy from PlaygroundClient.tsx - 2-color alternating wireframe
  const colorPalette = useMemo(
    () => [
      0x1b29ff, // primary blue
      0xff3d5b, // risograph red
    ],
    [],
  );

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
            <lineBasicMaterial
              color={color}
              transparent
              opacity={1.0}
              linewidth={1.5}
            />
          </lineSegments>,
        );
      }
    });

    return lines;
  }, [scene, colorPalette, modelPath]);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation based on scroll
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;

      // Add subtle continuous rotation (very slow)
      groupRef.current.rotation.y += 0.001;

      // Add subtle oscillation on X axis
      groupRef.current.rotation.x =
        rotation.x + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

      // Add subtle oscillation on Z axis
      groupRef.current.rotation.z =
        rotation.z + Math.cos(state.clock.elapsedTime * 0.15) * 0.03;
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
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
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

// CAD Viewport - AutoCAD-style viewport with corner brackets and technical annotations
interface CADViewportProps {
  children: React.ReactNode;
  label?: string;
  viewType?: string;
  className?: string;
}

function CADViewport({
  children,
  label = 'VIEWPORT_3D',
  viewType = 'PERSPECTIVE',
  className = '',
}: CADViewportProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* Main content */}
      <div className="w-full h-full relative">{children}</div>

      {/* Corner brackets - L-shaped lines at each corner */}
      {/* Top-left corner */}
      <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF00]"></div>
        <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00FF00]"></div>
      </div>
      {/* Top-right corner */}
      <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00FF00]"></div>
        <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00FF00]"></div>
      </div>
      {/* Bottom-left corner */}
      <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FF00]"></div>
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00FF00]"></div>
      </div>
      {/* Bottom-right corner */}
      <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00FF00]"></div>
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00FF00]"></div>
      </div>

      {/* Technical annotations */}
      <div className="absolute top-1 left-8 font-mono text-[9px] text-[#00FF00] tracking-wider pointer-events-none uppercase">
        [ {label} ]
      </div>
      <div className="absolute top-1 right-8 font-mono text-[9px] text-[#00FFFF] tracking-wider pointer-events-none uppercase">
        {viewType}
      </div>

      {/* Grid coordinates - bottom left */}
      <div className="absolute bottom-1 left-8 font-mono text-[8px] text-[#00FF00]/60 tracking-wider pointer-events-none">
        GRID: ENABLED
      </div>

      {/* Viewport info - bottom right */}
      <div className="absolute bottom-1 right-8 font-mono text-[8px] text-[#00FFFF]/60 tracking-wider pointer-events-none">
        RENDER: WIREFRAME
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 19px, #00FF00 19px, #00FF00 20px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, #00FF00 19px, #00FF00 20px)
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
  { id: 'company', label: 'COMPANY', shortLabel: 'INFO', color: '#00FFFF' },
  { id: 'mission', label: 'MISSION', shortLabel: 'MISSION', color: '#00FF00' },
  { id: 'product', label: 'PRODUCT', shortLabel: 'PRODUCT', color: '#FFFF00' },
  { id: 'funding', label: 'FUNDING', shortLabel: 'FUNDING', color: '#FF00FF' },
  { id: 'team', label: 'TEAM', shortLabel: 'TEAM', color: '#00FFFF' },
  { id: 'zero', label: 'ZERO_FINANCE', shortLabel: 'CALC', color: '#FF00FF' },
] as const;

// Model controls state for debugging
interface ModelControls {
  cameraPosition: [number, number, number];
  cameraFov: number;
  rotation: { x: number; y: number; z: number };
  scale: number;
  position: { x: number; y: number; z: number };
}

export function StartupPageClient({ company }: StartupPageClientProps) {
  const [activeSection, setActiveSection] = useState('company');
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [recordingMode, setRecordingMode] = useState<
    'off' | '16:9' | '9:16' | '1:1'
  >('off');

  // Model controls for each of the 6 models - use company configs if available
  const [modelControls, setModelControls] = useState<ModelControls[]>(
    company.modelConfigs || [
      // Default Model 0 (Section 1 - COMPANY)
      {
        cameraPosition: [0, 0, 140],
        cameraFov: 75,
        rotation: { x: -0.8, y: 0.64, z: -2.46 },
        scale: 0.09,
        position: { x: 0, y: 0, z: 0 },
      },
      // Default Model 1 (Section 2 - MISSION)
      {
        cameraPosition: [0, 0, 15],
        cameraFov: 75,
        rotation: { x: -1.2, y: 0, z: -0.5 },
        scale: 0.7,
        position: { x: 0, y: 0, z: 12.0 },
      },
      // Default Model 2 (Section 3 - PRODUCT)
      {
        cameraPosition: [0, 0, 15],
        cameraFov: 75,
        rotation: { x: -1.2, y: 0, z: -0.5 },
        scale: 0.7,
        position: { x: 0, y: 0, z: 12.0 },
      },
      // Default Model 3 (Section 4 - FUNDING)
      {
        cameraPosition: [0, 0, 15],
        cameraFov: 75,
        rotation: { x: -1.2, y: 0, z: -0.5 },
        scale: 0.7,
        position: { x: 0, y: 0, z: 12.0 },
      },
      // Default Model 4 (Section 5 - TEAM)
      {
        cameraPosition: [0, 0, 15],
        cameraFov: 75,
        rotation: { x: -1.2, y: 0, z: -0.5 },
        scale: 0.7,
        position: { x: 0, y: 0, z: 12.0 },
      },
      // Default Model 5 (Section 6 - ZERO_FINANCE)
      {
        cameraPosition: [0, 0, 15],
        cameraFov: 75,
        rotation: { x: -1.2, y: 0, z: -0.5 },
        scale: 0.7,
        position: { x: 0, y: 0, z: 12.0 },
      },
    ],
  );

  // Compute models array from company data
  const customModels = useMemo(() => {
    if (company.models3d) {
      return company.models3d; // Use models3d if available
    } else if (company.model3d) {
      // Convert single model to array of 6 (one for each section)
      return [
        company.model3d,
        company.model3d,
        company.model3d,
        company.model3d,
        company.model3d,
        company.model3d,
      ];
    }
    return undefined; // Use default models
  }, [company.model3d, company.models3d]);

  // Preload custom models if available
  useEffect(() => {
    if (customModels) {
      customModels.forEach((model) => useGLTF.preload(model));
    }
  }, [customModels]);

  // Toggle controls with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowControls((prev) => !prev);
      }
      // Toggle recording mode with Ctrl+Shift+R
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        setRecordingMode((prev) => {
          if (prev === 'off') return '16:9';
          if (prev === '16:9') return '9:16';
          if (prev === '9:16') return '1:1';
          return 'off';
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update control value
  const updateControl = (
    index: number,
    field: keyof ModelControls,
    value: any,
  ) => {
    setModelControls((prev) => {
      const newControls = [...prev];
      newControls[index] = { ...newControls[index], [field]: value };
      return newControls;
    });
  };

  // Copy current model settings to clipboard
  const copySettings = () => {
    const settings = modelControls[currentModelIndex];
    const output = {
      company: company.name,
      modelIndex: currentModelIndex,
      modelLabel: `MODEL_${(currentModelIndex + 1).toString().padStart(2, '0')}`,
      settings: settings,
    };
    const text = JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(text);
    alert(
      `Settings copied for ${company.name} - Model #${currentModelIndex + 1}!`,
    );
  };

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track active section on scroll (both mobile and desktop)
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile) {
        // Mobile: sections are inside scrollable div
        const scrollContainer = document.querySelector(
          '.flex-1.bg-black.overflow-y-auto',
        );
        if (!scrollContainer) return;

        const sections = SECTIONS.map((s) => document.getElementById(s.id));
        const scrollTop = scrollContainer.scrollTop;
        const containerHeight = scrollContainer.clientHeight;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section) {
            const sectionTop = section.offsetTop;
            if (sectionTop <= scrollTop + containerHeight / 2) {
              setActiveSection(SECTIONS[i].id);
              break;
            }
          }
        }
      } else {
        // Desktop: sections are in window scroll
        const sections = SECTIONS.map((s) => document.getElementById(s.id));
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    // Run once on mount
    setTimeout(handleScroll, 100);

    if (isMobile) {
      const scrollContainer = document.querySelector(
        '.flex-1.bg-black.overflow-y-auto',
      );
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll);
        return () =>
          scrollContainer.removeEventListener('scroll', handleScroll);
      }
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

  const navigateToSection = (sectionId: string) => {
    // CAD-style page transition: vertical wipe down, then instant jump, then scanline reveal
    setIsTransitioning(true);

    // Wait for wipe down animation (400ms), then jump to section
    setTimeout(() => {
      setActiveSection(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        if (isMobile) {
          // On mobile, scroll the container instantly
          const scrollContainer = document.querySelector(
            '.flex-1.bg-black.overflow-y-auto',
          );
          if (scrollContainer) {
            const elementTop = element.offsetTop;
            scrollContainer.scrollTo({ top: elementTop, behavior: 'auto' }); // instant jump
          }
        } else {
          // On desktop, scroll the window instantly
          element.scrollIntoView({ behavior: 'auto' }); // instant jump
        }
      }

      // End transition after redraw animation completes (500ms total)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 400);
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

  // Independent 3D viewer - each model has its own Canvas, camera, and settings
  const Model3D = ({ modelIndex }: { modelIndex: number }) => {
    const isShuttle = modelIndex === 0;

    // Per-model camera settings (completely independent)
    const modelCamera = isShuttle
      ? { position: [0, 0, 100] as [number, number, number], fov: 75 }
      : { position: [0, 0, 12] as [number, number, number], fov: 75 };

    // Per-model transform settings
    const modelTransform = isShuttle
      ? {
          rotation: { x: -0.8, y: 0.64, z: -2.46 },
          scale: 0.12,
          position: { x: 0, y: 0, z: 0 },
        }
      : {
          rotation: { x: -1.2, y: 0, z: -0.5 },
          scale: 0.9,
          position: { x: 0, y: 0, z: 5.0 },
        };

    return (
      <CADViewport
        label={`MODEL_0${modelIndex + 1}`}
        viewType="PERSPECTIVE"
        className="w-full h-[600px]"
      >
        <Canvas
          camera={{ position: modelCamera.position, fov: modelCamera.fov }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
          performance={{ min: 0.5 }} // Allow frame skipping if needed
          style={{ backgroundColor: '#000000' }}
        >
          <PerspectiveCamera
            makeDefault
            position={modelCamera.position}
            fov={modelCamera.fov}
          />

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
                {/* First: Glitch effect */}
                <Bloom intensity={0.6} luminanceThreshold={0.7} radius={0.3} />
                <primitive object={new GlitchEffect()} />
                <ChromaticAberration offset={[0.005, 0.005]} />
                <Noise opacity={0.05} />
              </>
            )}
            {/* modelIndex 1, 2, and 3: No effects */}
          </EffectComposer>
        </Canvas>
      </CADViewport>
    );
  };

  // Calculate recording frame dimensions
  const recordingFrameStyle = useMemo(() => {
    if (recordingMode === 'off') return null;

    let aspectRatio: number;
    let maxWidth: number;
    let maxHeight: number;
    let label: string;

    switch (recordingMode) {
      case '16:9':
        aspectRatio = 16 / 9;
        maxWidth = 1920;
        maxHeight = 1080;
        label = 'LANDSCAPE (16:9)';
        break;
      case '9:16':
        aspectRatio = 9 / 16;
        maxWidth = 1080;
        maxHeight = 1920;
        label = 'PORTRAIT (9:16)';
        break;
      case '1:1':
        aspectRatio = 1;
        maxWidth = 1080;
        maxHeight = 1080;
        label = 'SQUARE (1:1)';
        break;
      default:
        return null;
    }

    // Calculate actual frame size based on window size
    const windowWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight =
      typeof window !== 'undefined' ? window.innerHeight : 1080;

    let frameWidth = maxWidth;
    let frameHeight = maxHeight;

    // Scale down to fit window while maintaining aspect ratio
    if (frameWidth > windowWidth * 0.95) {
      frameWidth = windowWidth * 0.95;
      frameHeight = frameWidth / aspectRatio;
    }
    if (frameHeight > windowHeight * 0.95) {
      frameHeight = windowHeight * 0.95;
      frameWidth = frameHeight * aspectRatio;
    }

    return {
      width: `${frameWidth}px`,
      height: `${frameHeight}px`,
      label,
      dimensions: `${maxWidth}×${maxHeight}`,
    };
  }, [recordingMode]);

  return (
    <div
      className="relative"
      style={{
        backgroundColor: '#000000',
        ...(recordingMode !== 'off' && recordingFrameStyle
          ? {
              width: recordingFrameStyle.width,
              height: recordingFrameStyle.height,
              overflow: 'hidden',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }
          : {
              minHeight: '100vh',
            }),
      }}
    >
      {/* Recording Mode Frame Overlay */}
      {recordingMode !== 'off' && recordingFrameStyle && (
        <>
          {/* Recording indicator - top */}
          <div className="absolute -top-8 left-0 font-mono text-[10px] text-[#00FF00] uppercase tracking-wider font-bold flex items-center gap-2 z-[9999]">
            <span className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse"></span>
            REC: {recordingFrameStyle.label}
          </div>

          {/* Dimensions display - bottom */}
          <div className="absolute -bottom-7 left-0 font-mono text-[9px] text-[#00FFFF] uppercase tracking-wide z-[9999]">
            {recordingFrameStyle.dimensions} | CTRL+SHIFT+R
          </div>

          {/* Corner guides */}
          <div className="absolute inset-0 pointer-events-none z-[9999]">
            {/* Corner guides - top-left */}
            <div className="absolute top-0 left-0 w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00FF00]"></div>
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00FF00]"></div>
            </div>
            {/* Corner guides - top-right */}
            <div className="absolute top-0 right-0 w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00FF00]"></div>
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00FF00]"></div>
            </div>
            {/* Corner guides - bottom-left */}
            <div className="absolute bottom-0 left-0 w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FF00]"></div>
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00FF00]"></div>
            </div>
            {/* Corner guides - bottom-right */}
            <div className="absolute bottom-0 right-0 w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00FF00]"></div>
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00FF00]"></div>
            </div>

            {/* Thirds grid - subtle */}
            <div className="absolute inset-0">
              {/* Horizontal thirds */}
              <div className="absolute top-1/3 left-0 w-full h-[1px] bg-[#00FF00]/15"></div>
              <div className="absolute top-2/3 left-0 w-full h-[1px] bg-[#00FF00]/15"></div>
              {/* Vertical thirds */}
              <div className="absolute top-0 left-1/3 w-[1px] h-full bg-[#00FF00]/15"></div>
              <div className="absolute top-0 left-2/3 w-[1px] h-full bg-[#00FF00]/15"></div>
            </div>
          </div>
        </>
      )}

      {/* CAD-style vertical wipe transition overlay */}
      {isTransitioning && (
        <>
          <div
            className="fixed inset-0 z-[9999] pointer-events-none bg-black"
            style={{
              animation: 'wipeDown 400ms linear',
            }}
          />
          <style>{`
            @keyframes wipeDown {
              0% {
                clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
              }
              100% {
                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              }
            }
            @keyframes scanlineReveal {
              0% {
                clip-path: inset(0 0 100% 0);
                filter: brightness(1.2);
              }
              100% {
                clip-path: inset(0 0 0 0);
                filter: brightness(1);
              }
            }
            .cad-redraw {
              animation: scanlineReveal 100ms linear;
            }
          `}</style>
        </>
      )}

      <CRTEffect />

      {/* Mobile: CAD Interface */}
      {isMobile && (
        <div className="lg:hidden fixed inset-0 bg-black flex flex-col overflow-hidden z-40">
          {/* CAD-style Header Bar */}
          <div className="bg-[#0000AA] text-white font-mono text-[10px] sm:text-xs px-2 py-1 flex items-center justify-between border-b border-[#00FFFF]/30 flex-shrink-0">
            <span className="tracking-wider truncate flex-1 mr-2">
              ACAD v12 - {company.name.toUpperCase().substring(0, 12)}.DWG
            </span>
            <span className="text-[#00FFFF] flex-shrink-0">
              SECT: {SECTIONS.findIndex((s) => s.id === activeSection) + 1}/6
            </span>
          </div>

          {/* 3D Viewport - Top Section */}
          <div className="h-[35vh] border-b border-[#00FF00]/30 relative flex-shrink-0">
            <CADViewport
              label={`MODEL_0${SECTIONS.findIndex((s) => s.id === activeSection) + 1}`}
              viewType="PERSPECTIVE"
              className="w-full h-full"
            >
              <Canvas
                key={activeSection}
                camera={{
                  position:
                    modelControls[
                      SECTIONS.findIndex((s) => s.id === activeSection)
                    ].cameraPosition,
                  fov: modelControls[
                    SECTIONS.findIndex((s) => s.id === activeSection)
                  ].cameraFov,
                }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                style={{ backgroundColor: '#000000' }}
              >
                <PerspectiveCamera
                  makeDefault
                  position={
                    modelControls[
                      SECTIONS.findIndex((s) => s.id === activeSection)
                    ].cameraPosition
                  }
                  fov={
                    modelControls[
                      SECTIONS.findIndex((s) => s.id === activeSection)
                    ].cameraFov
                  }
                />
                <CameraDrift />
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} />
                <Suspense fallback={null}>
                  <WireframeRocket
                    scrollProgress={
                      SECTIONS.findIndex((s) => s.id === activeSection) / 5
                    }
                    rotation={
                      modelControls[
                        SECTIONS.findIndex((s) => s.id === activeSection)
                      ].rotation
                    }
                    scale={
                      modelControls[
                        SECTIONS.findIndex((s) => s.id === activeSection)
                      ].scale
                    }
                    position={
                      modelControls[
                        SECTIONS.findIndex((s) => s.id === activeSection)
                      ].position
                    }
                    customModels={customModels}
                  />
                </Suspense>
                <EffectComposer key={`effects-${activeSection}`}>
                  {activeSection === 'company' && (
                    <>
                      {/* First: Glitch effect */}
                      <Bloom
                        intensity={0.6}
                        luminanceThreshold={0.7}
                        radius={0.3}
                      />
                      <primitive object={new GlitchEffect()} />
                    </>
                  )}
                  {/* mission, funding, team: No effects */}
                  {/* zero: No effects */}
                </EffectComposer>
              </Canvas>
            </CADViewport>

            {/* Section Navigation Buttons */}
            <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-2 sm:right-2 flex gap-0.5 sm:gap-1 z-10">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigateToSection(s.id)}
                  className={`flex-1 py-1 sm:py-1.5 transition-all border font-mono text-[8px] sm:text-[9px] font-bold uppercase ${
                    s.id === activeSection
                      ? 'bg-[#00FF00] border-[#00FF00] text-black'
                      : 'bg-black/80 border-[#00FF00]/30 text-[#00FF00] hover:border-[#00FFFF] hover:text-[#00FFFF]'
                  }`}
                >
                  {s.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 bg-black overflow-y-auto border-t-2 border-[#00FF00] min-h-0">
            <div
              key={`content-${activeSection}-${isTransitioning}`}
              className={`p-3 sm:p-4 space-y-4 ${!isTransitioning ? 'cad-redraw' : ''}`}
            >
              {/* SECTION 1: COMPANY */}
              <div id="company" className="scroll-mt-4">
                <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2 mb-3">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#FF00FF] uppercase tracking-wider">
                    &gt;&gt; SECT_01: COMPANY
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="inline-block px-2 py-1 bg-black border border-[#00FF00] text-[9px] sm:text-[10px] text-[#00FF00] font-mono font-bold uppercase tracking-wider">
                    CAT: {company.category.toUpperCase()}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none uppercase font-mono text-[#00FFFF] break-words">
                    {company.name.toUpperCase()}
                  </h1>

                  <div className="border-2 border-[#00FFFF] bg-[#0000AA]/10 p-3 mt-4">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FFFF00] mb-2">
                      [ DESCRIPTION ]
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-mono break-words">
                      {company.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-[#00FF00] text-black font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-[#00FFFF] transition-all text-center"
                      >
                        [LINK: WEBSITE]
                      </a>
                    )}
                    {company.twitter && (
                      <a
                        href={company.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 border-2 border-[#00FFFF] text-[#00FFFF] font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-[#00FFFF]/10 transition-all text-center"
                      >
                        [LINK: TWITTER/X]
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: MISSION */}
              <div id="mission" className="scroll-mt-4">
                <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2 mb-3">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#FF00FF] uppercase tracking-wider">
                    &gt;&gt; SECT_02: MISSION
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-wide text-[#00FFFF] break-words">
                    Mission Statement
                  </h2>

                  <div className="border-2 border-[#00FFFF] bg-[#0000AA]/10 p-3">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FFFF00] mb-2">
                      [ TAGLINE ]
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-mono break-words">
                      {company.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRODUCT */}
              <div id="product" className="scroll-mt-4">
                <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2 mb-3">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#FF00FF] uppercase tracking-wider">
                    &gt;&gt; SECT_03: PRODUCT
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-wide text-[#00FFFF] break-words">
                    The Product
                  </h2>

                  {company.longDescription && (
                    <div className="bg-black border-2 border-[#00FFFF] p-3">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#00FFFF] font-bold mb-2 font-mono">
                        [ WHAT_YOU_CAN_DO ]
                      </p>
                      <p className="text-white/90 leading-relaxed text-xs sm:text-sm font-mono break-words">
                        {company.longDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: FUNDING */}
              <div id="funding" className="scroll-mt-4">
                <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2 mb-3">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#FF00FF] uppercase tracking-wider">
                    &gt;&gt; SECT_04: FUNDING
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-wide text-[#FFFF00] break-words">
                    CAPITAL_RAISED
                  </h2>

                  {company.funding.amount > 0 ? (
                    <div className="bg-black border-2 border-[#00FFFF] p-4">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#00FFFF] mb-2 font-mono font-bold">
                        [ DATA: FUNDING_AMT ]
                      </p>
                      <p className="text-3xl sm:text-4xl font-black text-[#00FFFF] font-mono tracking-tight mb-2">
                        {formatCurrency(company.funding.amount)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#00FFFF]/70 font-mono uppercase tracking-wide">
                        {company.funding.round} / {company.funding.date}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-black border-2 border-[#00FFFF] p-4">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#00FFFF] mb-2 font-mono font-bold">
                        [ STATUS: FUNDING ]
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-[#00FFFF] font-mono tracking-tight mb-2">
                        BOOTSTRAPPED
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#00FFFF]/70 font-mono uppercase tracking-wide">
                        SELF_FUNDED / NO_EXTERNAL_CAPITAL
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: TEAM */}
              <div id="team" className="scroll-mt-4">
                <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2 mb-3">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#FF00FF] uppercase tracking-wider">
                    &gt;&gt; SECT_05: TEAM
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-wide text-[#00FFFF] break-words">
                    THE_MINDS
                  </h2>

                  <div className="space-y-2">
                    {company.founders.map((founder, index) => (
                      <a
                        key={founder.id}
                        href={founder.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-black border border-[#00FF00] hover:bg-[#00FF00]/10 hover:border-[#00FFFF] transition-all group"
                      >
                        {founder.avatar && (
                          <Image
                            src={founder.avatar}
                            alt={founder.name}
                            width={50}
                            height={50}
                            className="border border-[#00FF00] group-hover:border-[#00FFFF] transition-all flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-[#00FF00]/70 mb-1">
                            MEM_{(index + 1).toString().padStart(2, '0')}
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#00FFFF] transition-colors font-mono uppercase tracking-wide truncate">
                            {founder.name.toUpperCase()}
                          </h3>
                          <p className="text-[#00FF00] text-[9px] sm:text-[10px] font-mono uppercase tracking-wide truncate">
                            {founder.role.toUpperCase()}
                          </p>
                        </div>
                        <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity text-[#00FFFF] font-mono flex-shrink-0">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 6: ZERO_FINANCE */}
              <div id="zero" className="scroll-mt-4 pb-4">
                <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2 mb-3">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#FF00FF] uppercase tracking-wider">
                    &gt;&gt; SECT_06: ZERO_FINANCE
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#FF00FF] uppercase font-mono tracking-tight leading-tight break-words">
                    MAX_RUNWAY
                  </h2>

                  <StartupCalculatorSection
                    companyName={company.name}
                    fundingAmount={company.funding.amount}
                    isMobile={true}
                  />

                  <div className="flex flex-col gap-2">
                    <Link
                      href="https://0.finance"
                      className="text-center px-4 py-3 bg-[#00FF00] text-black font-bold font-mono uppercase tracking-wider hover:bg-[#00FFFF] transition-all text-[10px] sm:text-xs border border-[#00FF00] hover:border-[#00FFFF]"
                    >
                      [ START_EARNING_8%_APY ]
                    </Link>
                    <Link
                      href="/"
                      className="text-center px-4 py-3 border border-[#00FFFF] text-[#00FFFF] font-mono font-bold uppercase tracking-wider hover:bg-[#00FFFF]/10 transition-all text-[10px] sm:text-xs"
                    >
                      [ BROWSE_MORE ]
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CAD Command Line Footer */}
          <div className="bg-[#0000AA] text-white font-mono text-[8px] sm:text-[9px] px-2 py-1 sm:py-1.5 border-t border-[#00FFFF]/30 space-y-0.5 flex-shrink-0">
            <div className="truncate">
              <span className="text-[#00FFFF]">Orden:</span>{' '}
              <span className="text-white">
                _VIEW_{activeSection.toUpperCase()}
              </span>
            </div>
            <div className="text-[#FFFFFF]/70 truncate">
              {company.name} - Viewport{' '}
              {SECTIONS.findIndex((s) => s.id === activeSection) + 1} of{' '}
              {SECTIONS.length}
            </div>
          </div>
        </div>
      )}

      {/* AutoCAD-style Right Sidebar Navigation (desktop only) */}
      {!isMobile && (
        <div
          className={`${recordingMode === 'off' ? 'fixed h-screen' : 'absolute h-full'} right-0 top-0 w-64 bg-[#0000AA] border-l-2 border-[#00FFFF] z-50 flex flex-col`}
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
                    borderLeft:
                      activeSection === section.id
                        ? `4px solid ${section.color}`
                        : '4px solid transparent',
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

      {/* Main Content - Full-screen sections on desktop only */}
      {!isMobile && (
        <div
          className={`lg:pr-64 ${recordingMode !== 'off' ? 'h-full overflow-hidden' : ''}`}
        >
          <div
            key={`desktop-content-${activeSection}-${isTransitioning}`}
            className={!isTransitioning ? 'cad-redraw' : ''}
          >
            {/* SECTION 1: COMPANY */}
            <section
              id="company"
              className={`${recordingMode === 'off' ? 'min-h-screen' : 'h-full'} flex flex-col justify-center px-16 py-16`}
            >
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_01: COMPANY'}
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1 max-w-3xl">
                  <div className="inline-block px-3 py-1 bg-black border-2 border-[#00FF00] text-sm text-[#00FF00] mb-8 font-mono font-bold uppercase tracking-wider">
                    CATEGORY: {company.category.toUpperCase()}
                  </div>

                  <h1
                    className="text-8xl lg:text-9xl font-black tracking-tight leading-none uppercase font-mono mb-10"
                    style={{
                      color: '#00FFFF',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {company.name.toUpperCase()}
                  </h1>

                  <div className="mb-10">
                    <div className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFF00] mb-3">
                      [ DESCRIPTION ]
                    </div>
                    <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-mono">
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

                {/* Shuttle 3D Model - on right */}
                {!isMobile && (
                  <CADViewport
                    label="MODEL_01"
                    viewType="PERSPECTIVE"
                    className="w-full lg:w-[450px] h-[450px] flex-shrink-0"
                  >
                    <Canvas
                      camera={{
                        position: modelControls[0].cameraPosition,
                        fov: modelControls[0].cameraFov,
                      }}
                      dpr={[1, 1.5]}
                      performance={{ min: 0.5 }}
                      style={{ backgroundColor: '#000000' }}
                    >
                      <PerspectiveCamera
                        makeDefault
                        position={modelControls[0].cameraPosition}
                        fov={modelControls[0].cameraFov}
                      />
                      <CameraDrift />
                      <ambientLight intensity={0.2} />
                      <directionalLight position={[5, 5, 5]} intensity={0.4} />
                      <Suspense fallback={null}>
                        <WireframeRocket
                          scrollProgress={0}
                          rotation={modelControls[0].rotation}
                          scale={modelControls[0].scale}
                          position={modelControls[0].position}
                          customModels={customModels}
                        />
                      </Suspense>
                      <EffectComposer>
                        <Bloom
                          intensity={0.6}
                          luminanceThreshold={0.7}
                          radius={0.3}
                        />
                        <primitive object={new GlitchEffect()} />
                        <ChromaticAberration offset={[0.005, 0.005]} />
                        <Noise opacity={0.05} />
                      </EffectComposer>
                    </Canvas>
                  </CADViewport>
                )}
              </div>
            </section>

            {/* SECTION 2: MISSION */}
            <section
              id="mission"
              className={`${recordingMode === 'off' ? 'min-h-screen' : 'h-full'} flex flex-col justify-center px-16 py-16`}
            >
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_02: MISSION'}
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-end">
                <div className="flex-1 space-y-8 max-w-3xl">
                  <h2
                    className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                    style={{ color: '#00FFFF' }}
                  >
                    Mission Statement
                  </h2>

                  <div className="bg-black border-2 border-[#00FFFF] p-10">
                    <p className="text-sm uppercase tracking-wider text-[#00FFFF] font-bold mb-6 font-mono">
                      [ TAGLINE ]
                    </p>
                    <p className="text-white/90 leading-relaxed text-xl lg:text-2xl font-mono">
                      {company.tagline}
                    </p>
                  </div>
                </div>

                {/* 3D Model - Apollo Soyuz - on right, aligned with text box */}
                {!isMobile && (
                  <CADViewport
                    label="MODEL_02"
                    viewType="PERSPECTIVE"
                    className="w-full lg:w-[450px] h-[450px] flex-shrink-0"
                  >
                    <Canvas
                      camera={{
                        position: modelControls[1].cameraPosition,
                        fov: modelControls[1].cameraFov,
                      }}
                      dpr={[1, 1.5]}
                      performance={{ min: 0.5 }}
                      style={{ backgroundColor: '#000000' }}
                    >
                      <PerspectiveCamera
                        makeDefault
                        position={modelControls[1].cameraPosition}
                        fov={modelControls[1].cameraFov}
                      />
                      <CameraDrift />
                      <ambientLight intensity={0.2} />
                      <directionalLight position={[5, 5, 5]} intensity={0.4} />
                      <Suspense fallback={null}>
                        <WireframeRocket
                          scrollProgress={1 / 5}
                          rotation={modelControls[1].rotation}
                          scale={modelControls[1].scale}
                          position={modelControls[1].position}
                          customModels={customModels}
                        />
                      </Suspense>
                      {/* No effects for MISSION section */}
                    </Canvas>
                  </CADViewport>
                )}
              </div>
            </section>

            {/* SECTION 3: PRODUCT */}
            <section
              id="product"
              className={`${recordingMode === 'off' ? 'min-h-screen' : 'h-full'} flex flex-col justify-center px-16 py-16`}
            >
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_03: PRODUCT'}
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-end">
                <div className="flex-1 space-y-8 max-w-3xl">
                  <h2
                    className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                    style={{ color: '#00FFFF' }}
                  >
                    The Product
                  </h2>

                  {company.longDescription && (
                    <div className="bg-black border-2 border-[#00FFFF] p-10">
                      <p className="text-sm uppercase tracking-wider text-[#00FFFF] font-bold mb-6 font-mono">
                        [ WHAT_YOU_CAN_DO ]
                      </p>
                      <p className="text-white/90 leading-relaxed text-xl lg:text-2xl font-mono">
                        {company.longDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3D Model - on right */}
                {!isMobile && (
                  <CADViewport
                    label="MODEL_03"
                    viewType="PERSPECTIVE"
                    className="w-full lg:w-[450px] h-[450px] flex-shrink-0"
                  >
                    <Canvas
                      camera={{
                        position: modelControls[2].cameraPosition,
                        fov: modelControls[2].cameraFov,
                      }}
                      dpr={[1, 1.5]}
                      performance={{ min: 0.5 }}
                      style={{ backgroundColor: '#000000' }}
                    >
                      <PerspectiveCamera
                        makeDefault
                        position={modelControls[2].cameraPosition}
                        fov={modelControls[2].cameraFov}
                      />
                      <CameraDrift />
                      <ambientLight intensity={0.2} />
                      <directionalLight position={[5, 5, 5]} intensity={0.4} />
                      <Suspense fallback={null}>
                        <WireframeRocket
                          scrollProgress={2 / 5}
                          rotation={modelControls[2].rotation}
                          scale={modelControls[2].scale}
                          position={modelControls[2].position}
                          customModels={customModels}
                        />
                      </Suspense>
                      {/* No effects for PRODUCT section */}
                    </Canvas>
                  </CADViewport>
                )}
              </div>
            </section>

            {/* SECTION 4: FUNDING */}
            <section
              id="funding"
              className={`${recordingMode === 'off' ? 'min-h-screen' : 'h-full'} flex flex-col justify-center px-16 py-16`}
            >
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_04: FUNDING'}
              </div>

              <h2
                className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide mb-10"
                style={{ color: '#FFFF00' }}
              >
                CAPITAL_RAISED
              </h2>

              <div className="max-w-3xl">
                {company.funding.amount > 0 ? (
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
                ) : (
                  <div className="bg-black border-3 border-[#00FFFF] p-10 border-2">
                    <p className="text-sm uppercase tracking-widest text-[#00FFFF] mb-6 font-mono font-bold">
                      [ STATUS: FUNDING ]
                    </p>
                    <p className="text-5xl lg:text-6xl font-black text-[#00FFFF] font-mono tracking-tight mb-4">
                      BOOTSTRAPPED
                    </p>
                    <p className="text-lg text-[#00FFFF]/70 font-mono uppercase tracking-wide">
                      SELF_FUNDED / NO_EXTERNAL_CAPITAL
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 5: TEAM */}
            <section
              id="team"
              className={`${recordingMode === 'off' ? 'min-h-screen' : 'h-full'} flex flex-col justify-center px-16 py-16`}
            >
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_05: TEAM'}
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1 space-y-8">
                  <h2
                    className="text-6xl lg:text-7xl font-black uppercase font-mono tracking-wide"
                    style={{ color: '#00FFFF' }}
                  >
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
                  <CADViewport
                    label="MODEL_05"
                    viewType="PERSPECTIVE"
                    className="w-full lg:w-[450px] h-[450px] flex-shrink-0"
                  >
                    <Canvas
                      camera={{
                        position: modelControls[4].cameraPosition,
                        fov: modelControls[4].cameraFov,
                      }}
                      dpr={[1, 1.5]}
                      performance={{ min: 0.5 }}
                      style={{ backgroundColor: '#000000' }}
                    >
                      <PerspectiveCamera
                        makeDefault
                        position={modelControls[4].cameraPosition}
                        fov={modelControls[4].cameraFov}
                      />
                      <CameraDrift />
                      <ambientLight intensity={0.2} />
                      <directionalLight position={[5, 5, 5]} intensity={0.4} />
                      <Suspense fallback={null}>
                        <WireframeRocket
                          scrollProgress={4 / 5}
                          rotation={modelControls[4].rotation}
                          scale={modelControls[4].scale}
                          position={modelControls[4].position}
                          customModels={customModels}
                        />
                      </Suspense>
                      {/* No effects for TEAM section */}
                    </Canvas>
                  </CADViewport>
                )}
              </div>
            </section>

            {/* SECTION 6: ZERO_FINANCE (Separate Plug/Shill) */}
            <section
              id="zero"
              className={`${recordingMode === 'off' ? 'min-h-screen' : 'h-full'} flex flex-col justify-center px-16 py-16`}
            >
              <div className="text-xs uppercase tracking-widest text-[#FF00FF] font-mono font-bold mb-8">
                {'>> SECTION_06: ZERO_FINANCE'}
              </div>

              <div className="max-w-4xl space-y-10">
                <h2 className="text-6xl lg:text-8xl font-black text-[#FF00FF] uppercase font-mono tracking-tighter leading-tight">
                  MAXIMIZE_YOUR_RUNWAY
                </h2>

                <StartupCalculatorSection
                  companyName={company.name}
                  fundingAmount={company.funding.amount}
                  isMobile={false}
                />

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
      )}

      {/* Model Controls HUD - Toggle with Ctrl+Shift+D */}
      {showControls && (
        <div className="fixed top-4 left-4 w-96 bg-black/95 border-2 border-[#00FF00] p-4 font-mono text-xs z-[100] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#00FF00]">
            <h3 className="text-[#00FFFF] font-bold uppercase tracking-wider">
              3D Model Controls
            </h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-[#FF0000] hover:text-[#FF5555] font-bold"
            >
              ✕
            </button>
          </div>

          {/* Model Selector */}
          <div className="mb-4">
            <label className="text-[#FFFF00] block mb-2">SELECT MODEL:</label>
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentModelIndex(idx)}
                  className={`py-2 px-3 border ${
                    currentModelIndex === idx
                      ? 'bg-[#00FF00] text-black border-[#00FF00]'
                      : 'bg-black text-[#00FF00] border-[#00FF00] hover:bg-[#00FF00]/20'
                  } font-bold`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
            <div className="text-[#00FFFF] mt-2 text-[10px]">
              Section:{' '}
              {['COMPANY', 'MISSION', 'PRODUCT', 'FUNDING', 'TEAM', 'ZERO'][currentModelIndex]}
            </div>
          </div>

          {/* Camera Position */}
          <div className="mb-4 pb-4 border-b border-[#00FFFF]/30">
            <label className="text-[#FFFF00] block mb-2">
              CAMERA POSITION:
            </label>
            {['x', 'y', 'z'].map((axis, i) => (
              <div key={axis} className="mb-2">
                <div className="flex justify-between text-[#00FFFF]">
                  <span>{axis.toUpperCase()}:</span>
                  <span>
                    {modelControls[currentModelIndex].cameraPosition[i].toFixed(
                      1,
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={modelControls[currentModelIndex].cameraPosition[i]}
                  onChange={(e) => {
                    const newPos = [
                      ...modelControls[currentModelIndex].cameraPosition,
                    ] as [number, number, number];
                    newPos[i] = parseFloat(e.target.value);
                    updateControl(currentModelIndex, 'cameraPosition', newPos);
                  }}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Camera FOV */}
          <div className="mb-4 pb-4 border-b border-[#00FFFF]/30">
            <div className="flex justify-between text-[#FFFF00] mb-2">
              <span>CAMERA FOV:</span>
              <span className="text-[#00FFFF]">
                {modelControls[currentModelIndex].cameraFov}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="1"
              value={modelControls[currentModelIndex].cameraFov}
              onChange={(e) =>
                updateControl(
                  currentModelIndex,
                  'cameraFov',
                  parseFloat(e.target.value),
                )
              }
              className="w-full"
            />
          </div>

          {/* Model Rotation */}
          <div className="mb-4 pb-4 border-b border-[#00FFFF]/30">
            <label className="text-[#FFFF00] block mb-2">MODEL ROTATION:</label>
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="mb-2">
                <div className="flex justify-between text-[#00FFFF]">
                  <span>{axis.toUpperCase()}:</span>
                  <span>
                    {modelControls[currentModelIndex].rotation[
                      axis as keyof (typeof modelControls)[0]['rotation']
                    ].toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-6.28"
                  max="6.28"
                  step="0.01"
                  value={
                    modelControls[currentModelIndex].rotation[
                      axis as keyof (typeof modelControls)[0]['rotation']
                    ]
                  }
                  onChange={(e) => {
                    const newRot = {
                      ...modelControls[currentModelIndex].rotation,
                    };
                    newRot[axis as keyof typeof newRot] = parseFloat(
                      e.target.value,
                    );
                    updateControl(currentModelIndex, 'rotation', newRot);
                  }}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Model Scale */}
          <div className="mb-4 pb-4 border-b border-[#00FFFF]/30">
            <div className="flex justify-between text-[#FFFF00] mb-2">
              <span>MODEL SCALE:</span>
              <span className="text-[#00FFFF]">
                {modelControls[currentModelIndex].scale.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2"
              step="0.01"
              value={modelControls[currentModelIndex].scale}
              onChange={(e) =>
                updateControl(
                  currentModelIndex,
                  'scale',
                  parseFloat(e.target.value),
                )
              }
              className="w-full"
            />
          </div>

          {/* Model Position */}
          <div className="mb-4 pb-4 border-b border-[#00FFFF]/30">
            <label className="text-[#FFFF00] block mb-2">MODEL POSITION:</label>
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="mb-2">
                <div className="flex justify-between text-[#00FFFF]">
                  <span>{axis.toUpperCase()}:</span>
                  <span>
                    {modelControls[currentModelIndex].position[
                      axis as keyof (typeof modelControls)[0]['position']
                    ].toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="0.1"
                  value={
                    modelControls[currentModelIndex].position[
                      axis as keyof (typeof modelControls)[0]['position']
                    ]
                  }
                  onChange={(e) => {
                    const newPos = {
                      ...modelControls[currentModelIndex].position,
                    };
                    newPos[axis as keyof typeof newPos] = parseFloat(
                      e.target.value,
                    );
                    updateControl(currentModelIndex, 'position', newPos);
                  }}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={copySettings}
            className="w-full py-3 bg-[#00FF00] text-black font-bold uppercase tracking-wider hover:bg-[#00FFFF] transition-all"
          >
            📋 COPY SETTINGS
          </button>

          <div className="mt-2 text-[10px] text-[#00FFFF]/70 text-center">
            Press Ctrl+Shift+D to close
          </div>
        </div>
      )}
    </div>
  );
}
