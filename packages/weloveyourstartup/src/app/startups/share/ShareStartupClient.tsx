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
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF4] via-white to-[#EEF2FF] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Left: 3D Rocket Visualization */}
        <div className="order-2 lg:order-1 flex items-center justify-center">
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

        {/* Right: Form */}
        <div className="order-1 lg:order-2 flex items-center">
          <div className="w-full bg-white rounded-2xl border border-[#101010]/10 p-8 lg:p-12 shadow-xl">

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
                  <label className="block text-sm font-medium text-[#101010]/80 mb-2">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 border border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B29FF] focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#101010]/80 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 border border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B29FF] focus:border-transparent text-lg"
                  />
                </div>

                <button
                  onClick={() => handleNext('details')}
                  disabled={!startupName || !founderName}
                  className="w-full bg-[#1B29FF] hover:bg-[#1520CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all hover:scale-105 disabled:hover:scale-100 mt-8 text-lg"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Stage 2: Details */}
            {stage === 'details' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-[#101010]/80 mb-2">
                    One-line Tagline *
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="We're building the future of..."
                    className="w-full px-4 py-3 border border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B29FF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#101010]/80 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your startup..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B29FF] focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#101010]/80 mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B29FF] focus:border-transparent"
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
                    <label className="block text-sm font-medium text-[#101010]/80 mb-2">
                      Funding Raised
                    </label>
                    <input
                      type="text"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="$1M"
                      className="w-full px-4 py-3 border border-[#101010]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B29FF] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStage('name')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#101010] font-medium py-4 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => handleNext('launch')}
                    disabled={!tagline || !description || !category}
                    className="flex-1 bg-[#1B29FF] hover:bg-[#1520CC] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all hover:scale-105 disabled:hover:scale-100"
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}

            {/* Stage 3: Launch Preview */}
            {stage === 'launch' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-to-br from-[#1B29FF]/5 to-[#FF3D5B]/5 border border-[#1B29FF]/20 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-[#101010] mb-2">{startupName}</h2>
                  <p className="text-[#101010]/60 mb-4">{tagline}</p>
                  <p className="text-sm text-[#101010]/80 mb-4">{description}</p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-[#1B29FF]/10 text-[#1B29FF] rounded-full font-medium">
                      {category}
                    </span>
                    {fundingAmount && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        💰 {fundingAmount}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      👤 {founderName}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    🚀 Ready to launch? Your startup will be visible to investors, customers, and the community.
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStage('details')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#101010] font-medium py-4 rounded-lg transition-all"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-[#1B29FF] to-[#FF3D5B] hover:from-[#1520CC] hover:to-[#E6354F] text-white font-bold py-4 rounded-lg transition-all hover:scale-105 relative overflow-hidden group"
                  >
                    <span className="relative z-10">🚀 Launch!</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Stage 4: Success */}
            {stage === 'success' && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-[#1B29FF]">
                    {startupName} is Live!
                  </h2>
                  <p className="text-[#101010]/60 text-lg">
                    Your startup is now visible to the community
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <p className="text-sm text-[#101010]/80 mb-4">
                    ✨ Next steps to boost your visibility:
                  </p>
                  <ul className="text-left space-y-2 text-sm text-[#101010]/70">
                    <li>✅ Share your page on social media</li>
                    <li>✅ Connect with other founders</li>
                    <li>✅ Add more details about your journey</li>
                    <li>✅ Consider Zero Finance to maximize your runway</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4 mt-8">
                  <button
                    onClick={() => window.location.href = `/startups/${startupName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full bg-[#1B29FF] hover:bg-[#1520CC] text-white font-bold py-4 rounded-lg transition-all hover:scale-105"
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
                    className="w-full bg-gray-100 hover:bg-gray-200 text-[#101010] font-medium py-3 rounded-lg transition-all"
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
