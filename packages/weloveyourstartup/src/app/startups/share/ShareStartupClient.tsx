"use client";

import React, { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type Stage = 'name' | 'details' | 'launch' | 'success';

interface RocketProps {
  stage: Stage;
  isAnimating: boolean;
}

function AnimatedRocket({ stage, isAnimating }: RocketProps) {
  const { scene } = useGLTF("/GL Transmission Format - Binary.glb");
  const groupRef = useRef<THREE.Group>(null);

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

  useFrame((state) => {
    if (!groupRef.current) return;

    switch (stage) {
      case 'name':
        // Gentle idle rotation
        groupRef.current.rotation.y += 0.005;
        break;

      case 'details':
        // Rotate to show profile
        if (isAnimating) {
          groupRef.current.rotation.y += 0.03;
          groupRef.current.rotation.x += 0.01;
        }
        break;

      case 'launch':
        // Prepare for launch - slight shake and upward tilt
        if (isAnimating) {
          groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.1;
          groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.05;
        }
        break;

      case 'success':
        // Launched! Spin and rise
        groupRef.current.rotation.y += 0.02;
        if (groupRef.current.position.y < 3) {
          groupRef.current.position.y += 0.05;
        }
        break;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-1.68, 0.16, -0.97]} scale={0.5}>
      <primitive object={scene} visible={false} />
      {edgeLines}
    </group>
  );
}

export default function ShareStartupClient() {
  const [stage, setStage] = useState<Stage>('name');
  const [isAnimating, setIsAnimating] = useState(false);
  const [is3DExpanded, setIs3DExpanded] = useState(true);

  // Form data
  const [startupName, setStartupName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');

  const handleNext = (nextStage: Stage) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsAnimating(false);
    }, 600);
  };

  const handleSubmit = () => {
    handleNext('launch');
    setTimeout(() => {
      setStage('success');
    }, 2000);
  };

  const getStageTitle = () => {
    switch (stage) {
      case 'name': return 'Name Your Rocket';
      case 'details': return 'Tell Your Story';
      case 'launch': return 'Ready for Liftoff?';
      case 'success': return 'You\'re Live!';
    }
  };

  const getStageSubtitle = () => {
    switch (stage) {
      case 'name': return 'Every great startup has a name that sticks';
      case 'details': return 'Help us understand your mission';
      case 'launch': return 'Review and launch your startup to the world';
      case 'success': return 'Your startup is now in orbit';
    }
  };

  return (
    <div className="min-h-screen bg-black lg:bg-gradient-to-br lg:from-[#FAFAF4] lg:via-white lg:to-[#EEF2FF] flex flex-col lg:flex-row lg:items-center lg:justify-center">

      {/* Mobile: Sticky 3D Header with CAD aesthetic */}
      <div className="lg:hidden sticky top-0 z-50 bg-black border-b-2 border-[#00FF00]">
        {/* CAD-style Header Bar */}
        <div className="bg-[#0000AA] text-white font-mono text-xs px-3 py-1 flex items-center justify-between">
          <span className="uppercase tracking-wide">ACAD v12 - STARTUP.DWG</span>
          <button
            onClick={() => setIs3DExpanded(!is3DExpanded)}
            className="text-[#00FF00] hover:text-[#00FFFF] transition-colors uppercase text-[10px] border border-[#00FF00] px-2 py-0.5"
          >
            {is3DExpanded ? '[-]' : '[+]'} VIEW
          </button>
        </div>

        {/* 3D Viewport */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            is3DExpanded ? 'h-48' : 'h-0'
          }`}
        >
          <div className="relative w-full h-48 bg-black border-2 border-[#00FF00]/30">
            <Canvas>
              <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={stage === 'name'} autoRotateSpeed={0.5} />

              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              <pointLight position={[-10, -10, -5]} intensity={0.3} color="#FF3D5B" />

              <Suspense fallback={null}>
                <AnimatedRocket stage={stage} isAnimating={isAnimating} />
              </Suspense>

              <EffectComposer>
                <Bloom
                  intensity={stage === 'success' ? 2.0 : stage === 'launch' ? 1.5 : 0.5}
                  luminanceThreshold={0.6}
                  radius={0.4}
                />
              </EffectComposer>
            </Canvas>

            {/* CAD-style Coordinate Display */}
            <div className="absolute top-2 left-2 font-mono text-[10px] text-[#00FF00] bg-black/80 px-2 py-1 border border-[#00FF00]/50">
              STAGE: {stage.toUpperCase()}
            </div>

            {/* Stage Indicator - CAD Style */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {(['name', 'details', 'launch', 'success'] as Stage[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 transition-all border ${
                    s === stage
                      ? 'w-6 bg-[#00FF00] border-[#00FF00]'
                      : (['name', 'details', 'launch', 'success'] as Stage[]).indexOf(s) < (['name', 'details', 'launch', 'success'] as Stage[]).indexOf(stage)
                      ? 'w-1.5 bg-[#00FF00]/50 border-[#00FF00]/50'
                      : 'w-1.5 bg-transparent border-[#00FF00]/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CAD Command Line Footer */}
        <div className="bg-[#0000AA] text-white font-mono text-[10px] px-3 py-1 border-t border-[#00FFFF]/30">
          <span className="text-[#00FFFF]">Command:</span> <span className="text-white">CREATE_STARTUP</span>
        </div>
      </div>

      {/* Desktop & Mobile Content Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 lg:p-4">

        {/* Desktop: 3D Rocket Visualization */}
        <div className="hidden lg:flex order-2 lg:order-1 items-center justify-center">
          <div className="w-full aspect-square max-w-md bg-white/50 backdrop-blur-sm rounded-2xl border border-[#1B29FF]/20 overflow-hidden shadow-2xl">
            <Canvas>
              <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={stage === 'name'} autoRotateSpeed={0.5} />

              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              <pointLight position={[-10, -10, -5]} intensity={0.3} color="#FF3D5B" />

              <Suspense fallback={null}>
                <AnimatedRocket stage={stage} isAnimating={isAnimating} />
              </Suspense>

              <EffectComposer>
                <Bloom
                  intensity={stage === 'success' ? 2.0 : stage === 'launch' ? 1.5 : 0.5}
                  luminanceThreshold={0.6}
                  radius={0.4}
                />
              </EffectComposer>
            </Canvas>

            {/* Stage Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {(['name', 'details', 'launch', 'success'] as Stage[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === stage
                      ? 'w-8 bg-[#1B29FF]'
                      : (['name', 'details', 'launch', 'success'] as Stage[]).indexOf(s) < (['name', 'details', 'launch', 'success'] as Stage[]).indexOf(stage)
                      ? 'w-2 bg-[#1B29FF]/50'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="order-1 lg:order-2 flex items-center bg-black lg:bg-transparent min-h-[calc(100vh-200px)] lg:min-h-0">
          <div className="w-full bg-white lg:rounded-2xl border-t-4 border-[#00FF00] lg:border lg:border-[#101010]/10 p-6 lg:p-12 shadow-xl">

            {/* Header */}
            <div className="mb-6 lg:mb-8">
              {/* Mobile: CAD-style title */}
              <div className="lg:hidden">
                <div className="font-mono text-xs text-[#00FF00] mb-1 tracking-wider">
                  &gt;&gt; PROCESS_STAGE_{(['name', 'details', 'launch', 'success'] as Stage[]).indexOf(stage) + 1}/4
                </div>
                <h1 className="text-3xl font-black text-[#1B29FF] mb-2 tracking-tight uppercase font-mono">
                  {getStageTitle()}
                </h1>
                <p className="text-[#101010]/70 text-sm border-l-2 border-[#00FF00] pl-3">
                  {getStageSubtitle()}
                </p>
              </div>

              {/* Desktop: Original style */}
              <div className="hidden lg:block">
                <h1 className="text-4xl lg:text-5xl font-black text-[#1B29FF] mb-2 tracking-tight">
                  {getStageTitle()}
                </h1>
                <p className="text-[#101010]/60 text-lg">
                  {getStageSubtitle()}
                </p>
              </div>
            </div>

            {/* Stage 1: Name */}
            {stage === 'name' && (
              <div className="space-y-5 lg:space-y-6 animate-fade-in">
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                    Startup Name <span className="text-[#00FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-4 lg:py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-base lg:text-lg transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                    Your Name <span className="text-[#00FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-4 lg:py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-base lg:text-lg transition-all"
                  />
                </div>

                <button
                  onClick={() => handleNext('details')}
                  disabled={!startupName || !founderName}
                  className="w-full bg-[#1B29FF] hover:bg-[#1520CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 lg:py-4 rounded-lg transition-all hover:scale-105 disabled:hover:scale-100 mt-6 lg:mt-8 text-base lg:text-lg uppercase tracking-wide border-2 border-[#1B29FF] hover:border-[#00FF00] disabled:border-gray-300"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Stage 2: Details */}
            {stage === 'details' && (
              <div className="space-y-5 lg:space-y-6 animate-fade-in">
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                    One-line Tagline <span className="text-[#00FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="We're building the future of..."
                    className="w-full px-4 py-4 lg:py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                    Description <span className="text-[#00FF00]">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your startup..."
                    rows={4}
                    className="w-full px-4 py-4 lg:py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] resize-none text-base transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4">
                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                      Category <span className="text-[#00FF00]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-4 lg:py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-base transition-all"
                    >
                      <option value="">Select...</option>
                      <option value="AI">AI</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Climate">Climate</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Developer Tools">Developer Tools</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                      Funding Raised
                    </label>
                    <input
                      type="text"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="$1M"
                      className="w-full px-4 py-4 lg:py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-base transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8">
                  <button
                    onClick={() => setStage('name')}
                    className="lg:flex-1 bg-gray-100 hover:bg-gray-200 text-[#101010] font-medium py-5 lg:py-4 rounded-lg transition-all border-2 border-gray-300 uppercase tracking-wide text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => handleNext('launch')}
                    disabled={!tagline || !description || !category}
                    className="lg:flex-1 bg-[#1B29FF] hover:bg-[#1520CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 lg:py-4 rounded-lg transition-all hover:scale-105 disabled:hover:scale-100 border-2 border-[#1B29FF] hover:border-[#00FF00] disabled:border-gray-300 uppercase tracking-wide text-sm"
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}

            {/* Stage 3: Launch Preview */}
            {stage === 'launch' && (
              <div className="space-y-5 lg:space-y-6 animate-fade-in">
                <div className="bg-gradient-to-br from-[#1B29FF]/5 to-[#FF3D5B]/5 border-2 border-[#1B29FF]/20 rounded-lg p-5 lg:p-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-[#101010] mb-2">{startupName}</h2>
                  <p className="text-sm lg:text-base text-[#101010]/60 mb-3 lg:mb-4">{tagline}</p>
                  <p className="text-xs lg:text-sm text-[#101010]/80 mb-3 lg:mb-4">{description}</p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1.5 lg:py-1 bg-[#1B29FF]/10 text-[#1B29FF] rounded-full font-medium border border-[#1B29FF]/20">
                      {category}
                    </span>
                    {fundingAmount && (
                      <span className="px-3 py-1.5 lg:py-1 bg-green-100 text-green-700 rounded-full font-medium border border-green-200">
                        💰 {fundingAmount}
                      </span>
                    )}
                    <span className="px-3 py-1.5 lg:py-1 bg-purple-100 text-purple-700 rounded-full font-medium border border-purple-200">
                      👤 {founderName}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    🚀 Ready to launch? Your startup will be visible to investors, customers, and the community.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8">
                  <button
                    onClick={() => setStage('details')}
                    className="lg:flex-1 bg-gray-100 hover:bg-gray-200 text-[#101010] font-medium py-5 lg:py-4 rounded-lg transition-all border-2 border-gray-300 uppercase tracking-wide text-sm"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="lg:flex-1 bg-gradient-to-r from-[#1B29FF] to-[#FF3D5B] hover:from-[#1520CC] hover:to-[#E6354F] text-white font-bold py-5 lg:py-4 rounded-lg transition-all hover:scale-105 relative overflow-hidden group border-2 border-[#1B29FF] uppercase tracking-wide text-sm"
                  >
                    <span className="relative z-10">🚀 Launch!</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Stage 4: Success */}
            {stage === 'success' && (
              <div className="space-y-5 lg:space-y-6 animate-fade-in text-center">
                <div className="text-5xl lg:text-6xl mb-4 animate-bounce">🎉</div>

                <div className="space-y-3 lg:space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#1B29FF]">
                    {startupName} is Live!
                  </h2>
                  <p className="text-[#101010]/60 text-base lg:text-lg">
                    Your startup is now visible to the community
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-5 lg:p-6">
                  <p className="text-sm text-[#101010]/80 mb-3 lg:mb-4 font-medium">
                    ✨ Next steps to boost your visibility:
                  </p>
                  <ul className="text-left space-y-2 text-xs lg:text-sm text-[#101010]/70">
                    <li>✅ Share your page on social media</li>
                    <li>✅ Connect with other founders</li>
                    <li>✅ Add more details about your journey</li>
                    <li>✅ Consider Zero Finance to maximize your runway</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 lg:gap-4 mt-6 lg:mt-8">
                  <button
                    onClick={() => window.location.href = `/startups/${startupName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full bg-[#1B29FF] hover:bg-[#1520CC] text-white font-bold py-5 lg:py-4 rounded-lg transition-all hover:scale-105 border-2 border-[#1B29FF] hover:border-[#00FF00] uppercase tracking-wide text-sm"
                  >
                    View Your Page →
                  </button>
                  <button
                    onClick={() => {
                      setStage('name');
                      setStartupName('');
                      setFounderName('');
                      setTagline('');
                      setDescription('');
                      setCategory('');
                      setFundingAmount('');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-[#101010] font-medium py-4 lg:py-3 rounded-lg transition-all border-2 border-gray-300 uppercase tracking-wide text-sm"
                  >
                    Share Another Startup
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
