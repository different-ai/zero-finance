"use client";

import React, { useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type Stage = 'name' | 'details' | 'launch' | 'success';

interface RocketProps {
  stage: Stage;
  isAnimating: boolean;
  modelPath?: string;
}

function AnimatedRocket({ stage, isAnimating, modelPath = "/GL Transmission Format - Binary.glb" }: RocketProps) {
  const { scene } = useGLTF(modelPath);
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

interface ShareStartupClientProps {
  customModel?: string;
}

export default function ShareStartupClient({ customModel }: ShareStartupClientProps = {}) {
  const [stage, setStage] = useState<Stage>('name');
  const [isAnimating, setIsAnimating] = useState(false);

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

      {/* Mobile: Full CAD Interface */}
      <div className="lg:hidden fixed inset-0 bg-black flex flex-col overflow-hidden">
        {/* CAD-style Header Bar */}
        <div className="bg-[#0000AA] text-white font-mono text-[10px] sm:text-xs px-2 py-1 flex items-center justify-between border-b border-[#00FFFF]/30 flex-shrink-0">
          <span className="tracking-wider truncate flex-1 mr-2">ACAD v12 - STARTUP.DWG</span>
          <span className="text-[#00FFFF] flex-shrink-0">X={(['name', 'details', 'launch', 'success'] as Stage[]).indexOf(stage) + 1} Y=4 Z=0</span>
        </div>

        {/* Main CAD Workspace - Split View */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">

          {/* Top: 3D Viewport */}
          <div className="h-[40vh] sm:h-[45vh] bg-black border-b border-[#00FF00]/30 relative flex-shrink-0">
            <Canvas gl={{ preserveDrawingBuffer: true }} dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={stage === 'name'}
                autoRotateSpeed={0.5}
                touches={{ ONE: 2, TWO: 0 }}
                enableDamping={true}
                dampingFactor={0.05}
              />

              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              <pointLight position={[-10, -10, -5]} intensity={0.3} color="#FF3D5B" />

              <Suspense fallback={null}>
                <AnimatedRocket stage={stage} isAnimating={isAnimating} modelPath={customModel} />
              </Suspense>

              <EffectComposer>
                <Bloom
                  intensity={stage === 'success' ? 2.0 : stage === 'launch' ? 1.5 : 0.5}
                  luminanceThreshold={0.6}
                  radius={0.4}
                />
              </EffectComposer>
            </Canvas>

            {/* Viewport Label */}
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 font-mono text-[8px] sm:text-[9px] text-[#00FFFF] uppercase tracking-wider">
              [3D VIEW]
            </div>

            {/* Grid Coordinates */}
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 font-mono text-[8px] sm:text-[9px] text-[#00FF00] space-y-0.5 text-right">
              <div>LAYER: STRUCTURE</div>
              <div className="hidden xs:block">STAGE: {stage.toUpperCase()}</div>
            </div>

            {/* Progress Indicators - CAD Style */}
            <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-2 sm:right-2 flex gap-1">
              {(['name', 'details', 'launch', 'success'] as Stage[]).map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 transition-all border ${
                    s === stage
                      ? 'bg-[#00FF00] border-[#00FF00]'
                      : (['name', 'details', 'launch', 'success'] as Stage[]).indexOf(s) < (['name', 'details', 'launch', 'success'] as Stage[]).indexOf(stage)
                      ? 'bg-[#00FFFF]/50 border-[#00FFFF]/50'
                      : 'bg-transparent border-[#00FF00]/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom: Command Input Area - Scrollable */}
          <div className="flex-1 bg-black overflow-y-auto border-t-2 border-[#00FF00] min-h-0">
            <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">

              {/* CAD-style Form Header */}
              <div className="border border-[#00FFFF]/30 bg-[#0000AA]/20 p-2">
                <div className="font-mono text-[9px] sm:text-[10px] text-[#00FFFF] uppercase tracking-wider mb-1 break-words">
                  &gt;&gt; {getStageTitle()}
                </div>
                <div className="font-mono text-[8px] sm:text-[9px] text-white/70 break-words">
                  {getStageSubtitle()}
                </div>
              </div>

              {/* Stage 1: Name */}
              {stage === 'name' && (
                <div className="space-y-2 sm:space-y-3 animate-fade-in">
                  <div>
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#00FF00] mb-1 sm:mb-1.5 tracking-wider flex items-center gap-1 sm:gap-2">
                      <span className="bg-[#00FF00] text-black px-1 text-[8px]">*</span>
                      <span className="truncate">STARTUP_NAME:</span>
                    </div>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="ENTER_NAME"
                      className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-black border border-[#00FF00] text-[#00FF00] font-mono text-xs sm:text-sm focus:outline-none focus:border-[#00FFFF] focus:text-[#00FFFF] placeholder-[#00FF00]/30 uppercase"
                    />
                  </div>

                  <div>
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#00FF00] mb-1 sm:mb-1.5 tracking-wider flex items-center gap-1 sm:gap-2">
                      <span className="bg-[#00FF00] text-black px-1 text-[8px]">*</span>
                      <span className="truncate">FOUNDER_ID:</span>
                    </div>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="ENTER_FOUNDER"
                      className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-black border border-[#00FF00] text-[#00FF00] font-mono text-xs sm:text-sm focus:outline-none focus:border-[#00FFFF] focus:text-[#00FFFF] placeholder-[#00FF00]/30 uppercase"
                    />
                  </div>

                  <button
                    onClick={() => handleNext('details')}
                    disabled={!startupName || !founderName}
                    className="w-full bg-[#00FF00] disabled:bg-[#003300] disabled:text-[#00FF00]/30 text-black font-mono font-bold py-2.5 sm:py-3 transition-all disabled:cursor-not-allowed uppercase text-xs sm:text-sm tracking-wider border-2 border-[#00FF00] hover:bg-[#00FFFF] hover:border-[#00FFFF] disabled:hover:bg-[#003300]"
                  >
                    {!startupName || !founderName ? '[DATA ERR]' : 'CONTINUE &gt;&gt;'}
                  </button>
                </div>
              )}

              {/* Stage 2: Details */}
              {stage === 'details' && (
                <div className="space-y-2 sm:space-y-3 animate-fade-in">
                  <div>
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#00FF00] mb-1 sm:mb-1.5 tracking-wider flex items-center gap-1 sm:gap-2">
                      <span className="bg-[#00FF00] text-black px-1 text-[8px]">*</span>
                      <span className="truncate">MISSION_TAGLINE:</span>
                    </div>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="ENTER_MISSION"
                      className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-black border border-[#00FF00] text-[#00FF00] font-mono text-[10px] sm:text-xs focus:outline-none focus:border-[#00FFFF] focus:text-[#00FFFF] placeholder-[#00FF00]/30"
                    />
                  </div>

                  <div>
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#00FF00] mb-1 sm:mb-1.5 tracking-wider flex items-center gap-1 sm:gap-2">
                      <span className="bg-[#00FF00] text-black px-1 text-[8px]">*</span>
                      <span className="truncate">TECH_SPEC:</span>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="ENTER_DETAILS"
                      rows={3}
                      className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-black border border-[#00FF00] text-[#00FF00] font-mono text-[10px] sm:text-xs focus:outline-none focus:border-[#00FFFF] focus:text-[#00FFFF] resize-none placeholder-[#00FF00]/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div>
                      <div className="font-mono text-[8px] sm:text-[9px] text-[#00FF00] mb-1 sm:mb-1.5 tracking-wider flex items-center gap-1">
                        <span className="bg-[#00FF00] text-black px-1 text-[8px]">*</span>
                        <span className="truncate">CLASS:</span>
                      </div>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-1.5 sm:px-2 py-2 sm:py-2.5 bg-black border border-[#00FF00] text-[#00FF00] font-mono text-[10px] sm:text-xs focus:outline-none focus:border-[#00FFFF] focus:text-[#00FFFF]"
                      >
                        <option value="">SEL</option>
                        <option value="AI">AI</option>
                        <option value="SaaS">SAAS</option>
                        <option value="Fintech">FINTECH</option>
                        <option value="Climate">CLIMATE</option>
                        <option value="Healthcare">HEALTH</option>
                        <option value="Developer Tools">DEV</option>
                      </select>
                    </div>

                    <div>
                      <div className="font-mono text-[8px] sm:text-[9px] text-[#00FF00] mb-1 sm:mb-1.5 tracking-wider truncate">
                        <span>FUND:</span>
                      </div>
                      <input
                        type="text"
                        value={fundingAmount}
                        onChange={(e) => setFundingAmount(e.target.value)}
                        placeholder="$1M"
                        className="w-full px-1.5 sm:px-2 py-2 sm:py-2.5 bg-black border border-[#00FF00] text-[#00FF00] font-mono text-[10px] sm:text-xs focus:outline-none focus:border-[#00FFFF] focus:text-[#00FFFF] placeholder-[#00FF00]/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    <button
                      onClick={() => setStage('name')}
                      className="flex-1 bg-[#0000AA] border border-[#00FFFF] text-[#00FFFF] font-mono font-bold py-2 sm:py-2.5 transition-all uppercase text-[10px] sm:text-xs tracking-wider hover:bg-[#00FFFF] hover:text-black"
                    >
                      &lt;&lt; BACK
                    </button>
                    <button
                      onClick={() => handleNext('launch')}
                      disabled={!tagline || !description || !category}
                      className="flex-1 bg-[#00FF00] disabled:bg-[#003300] disabled:text-[#00FF00]/30 text-black font-mono font-bold py-2 sm:py-2.5 transition-all disabled:cursor-not-allowed uppercase text-[10px] sm:text-xs tracking-wider border-2 border-[#00FF00] hover:bg-[#00FFFF] hover:border-[#00FFFF] disabled:hover:bg-[#003300]"
                    >
                      REVIEW &gt;&gt;
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 3: Launch Preview */}
              {stage === 'launch' && (
                <div className="space-y-2 sm:space-y-3 animate-fade-in">
                  <div className="border-2 border-[#00FFFF] bg-[#0000AA]/20 p-2 sm:p-3">
                    <div className="font-mono text-[10px] sm:text-xs text-[#00FFFF] mb-1 sm:mb-2 uppercase tracking-wider break-words">
                      {startupName}
                    </div>
                    <div className="font-mono text-[9px] sm:text-[10px] text-[#00FF00] mb-1 sm:mb-2 break-words">
                      {tagline}
                    </div>
                    <div className="font-mono text-[8px] sm:text-[9px] text-white/70 mb-2 sm:mb-3 leading-relaxed break-words">
                      {description}
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-1.5 text-[8px] sm:text-[9px] font-mono">
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00] truncate max-w-[120px]">
                        {category}
                      </span>
                      {fundingAmount && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF] truncate max-w-[100px]">
                          {fundingAmount}
                        </span>
                      )}
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#FF00FF]/20 text-[#FF00FF] border border-[#FF00FF] truncate max-w-[120px]">
                        {founderName}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#FFFF00] bg-[#FFFF00]/10 p-2">
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#FFFF00] leading-relaxed break-words">
                      &gt;&gt; READY? DATA TRANSMIT TO NETWORK.
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    <button
                      onClick={() => setStage('details')}
                      className="flex-1 bg-[#0000AA] border border-[#00FFFF] text-[#00FFFF] font-mono font-bold py-2 sm:py-2.5 transition-all uppercase text-[10px] sm:text-xs tracking-wider hover:bg-[#00FFFF] hover:text-black"
                    >
                      &lt;&lt; EDIT
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-[#00FF00] to-[#00FFFF] text-black font-mono font-bold py-2 sm:py-2.5 transition-all uppercase text-[10px] sm:text-xs tracking-wider hover:from-[#00FFFF] hover:to-[#FF00FF] border-2 border-[#00FF00]"
                    >
                      LAUNCH! &gt;&gt;
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 4: Success */}
              {stage === 'success' && (
                <div className="space-y-2 sm:space-y-3 animate-fade-in">
                  <div className="text-center py-3 sm:py-4 border-2 border-[#00FF00] bg-[#00FF00]/10">
                    <div className="font-mono text-xl sm:text-2xl md:text-3xl text-[#00FF00] mb-1 sm:mb-2 animate-pulse break-words px-2">
                      [ LAUNCH SUCCESS ]
                    </div>
                    <div className="font-mono text-[9px] sm:text-xs text-[#00FFFF] uppercase tracking-wider break-words px-2">
                      {startupName} - NOMINAL
                    </div>
                  </div>

                  <div className="border border-[#00FFFF] bg-[#0000AA]/20 p-2 sm:p-3">
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#00FFFF] mb-1 sm:mb-2 uppercase">
                      &gt;&gt; NEXT OPS:
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 font-mono text-[8px] sm:text-[9px] text-white/70">
                      <div>&gt; SHARE_NETWORK</div>
                      <div>&gt; CONNECT_FOUNDERS</div>
                      <div>&gt; UPDATE_LOG</div>
                      <div>&gt; ZERO_FINANCE</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    <button
                      onClick={() => window.location.href = `/startups/${startupName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="w-full bg-[#00FF00] text-black font-mono font-bold py-2.5 sm:py-3 transition-all uppercase text-[10px] sm:text-xs tracking-wider hover:bg-[#00FFFF] border-2 border-[#00FF00]"
                    >
                      VIEW_PAGE &gt;&gt;
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
                      className="w-full bg-[#0000AA] border border-[#00FFFF] text-[#00FFFF] font-mono font-bold py-2 sm:py-2.5 transition-all uppercase text-[10px] sm:text-xs tracking-wider hover:bg-[#00FFFF] hover:text-black"
                    >
                      RESET_SYSTEM
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* CAD Command Line Footer */}
        <div className="bg-[#0000AA] text-white font-mono text-[8px] sm:text-[9px] px-2 py-1 sm:py-1.5 border-t border-[#00FFFF]/30 space-y-0.5 flex-shrink-0">
          <div className="truncate">
            <span className="text-[#00FFFF]">Cmd:</span> <span className="text-white">_CREATE_STARTUP</span>
          </div>
          <div className="text-[#FFFFFF]/70 truncate">
            {stage === 'name' && 'Enter ID params...'}
            {stage === 'details' && 'Specify mission params...'}
            {stage === 'launch' && 'Review specs...'}
            {stage === 'success' && 'SEQUENCE COMPLETE.'}
          </div>
        </div>
      </div>

      {/* Desktop Content Container */}
      <div className="hidden lg:grid w-full max-w-6xl grid-cols-2 gap-12 p-4">

        {/* Desktop: 3D Rocket Visualization */}
        <div className="flex order-1 items-center justify-center">
          <div className="w-full aspect-square max-w-md bg-white/50 backdrop-blur-sm rounded-2xl border border-[#1B29FF]/20 overflow-hidden shadow-2xl">
            <Canvas gl={{ preserveDrawingBuffer: true }} dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={stage === 'name'}
                autoRotateSpeed={0.5}
                enableDamping={true}
                dampingFactor={0.05}
              />

              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              <pointLight position={[-10, -10, -5]} intensity={0.3} color="#FF3D5B" />

              <Suspense fallback={null}>
                <AnimatedRocket stage={stage} isAnimating={isAnimating} modelPath={customModel} />
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
        <div className="order-2 flex items-center bg-transparent">
          <div className="w-full bg-white rounded-2xl border border-[#101010]/10 p-12 shadow-xl">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-black text-[#1B29FF] mb-2 tracking-tight">
                {getStageTitle()}
              </h1>
              <p className="text-[#101010]/60 text-lg">
                {getStageSubtitle()}
              </p>
            </div>

            {/* Stage 1: Name */}
            {stage === 'name' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                    Startup Name <span className="text-[#00FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-lg transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#101010]/80 mb-2 uppercase tracking-wide">
                    Your Name <span className="text-[#00FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 border-2 border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00] text-lg transition-all"
                  />
                </div>

                <button
                  onClick={() => handleNext('details')}
                  disabled={!startupName || !founderName}
                  className="w-full bg-[#1B29FF] hover:bg-[#1520CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all hover:scale-105 disabled:hover:scale-100 mt-8 text-lg uppercase tracking-wide border-2 border-[#1B29FF] hover:border-[#00FF00] disabled:border-gray-300"
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
