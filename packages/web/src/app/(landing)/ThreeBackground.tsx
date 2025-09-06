'use client';

import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/** Pixel‑square field that matches your refs, anchored to the right.
    Idle animation: subtle shimmer, breathing, boundary swirl
    Hover animation: local density boost, larger squares, ripple ring from pointer
*/
function PixelSquares({
  variant = 'dual' as 'dual' | 'c',
  pointerRef,
  rightMaskStart = 0.36, // where the right‑side mask begins across the hero (0 left .. 1 right)
  maskFeather = 0.1, // softness of the left→right fade
  shapeScale = 1.25, // make the motif bigger
}: {
  variant?: 'dual' | 'c';
  pointerRef: React.MutableRefObject<{
    x: number;
    y: number;
    hovered: number;
    justEnteredAt: number;
    enterPos: { x: number; y: number };
  }>;
  rightMaskStart?: number;
  maskFeather?: number;
  shapeScale?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  useFrame((state) => {
    if (!mat.current) return;

    // Use the Three.js clock which we know works (since the cube rotates)
    const t = state.clock.elapsedTime;
    const p = pointerRef.current;

    // Force the material to update
    mat.current.uniforms.uTime.value = t;
    mat.current.uniforms.uRes.value.set(size.width, size.height);

    // Add drift animation that updates every frame
    mat.current.uniforms.uDrift.value = 0.3 * Math.sin(t * 0.5);

    // Add fade animation that updates every frame
    mat.current.uniforms.uFadeSpeed.value = 0.8 + 0.2 * Math.sin(t * 0.3);

    // smooth the hover scalar so it eases in and out
    const u = mat.current.uniforms.uHover.value as number;
    const target = p.hovered;
    mat.current.uniforms.uHover.value = THREE.MathUtils.lerp(u, target, 0.12);

    // pointer position in NDC space matching the shader's coordinate system
    mat.current.uniforms.uMouse.value.set(p.x, p.y);

    // on fresh enter, stamp the time and position so the ripple originates there
    if (p.justEnteredAt > 0) {
      mat.current.uniforms.uEnterTime.value = p.justEnteredAt;
      mat.current.uniforms.uEnterPos.value.set(p.enterPos.x, p.enterPos.y);
      p.justEnteredAt = 0;
    }

    // CRITICAL: Mark uniforms as needing update
    mat.current.uniformsNeedUpdate = true;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        needsUpdate={true}
        uniforms={{
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(size.width, size.height) },
          uColor: { value: new THREE.Color('#4A5BFF') }, // Lighter, softer blue
          uVariant: { value: variant === 'dual' ? 0 : 1 },
          uGrid: { value: 180.0 }, // higher → smaller squares (less dense)
          uJitter: { value: 0.2 }, // idle wobble per cell
          uPulse: { value: 0.25 }, // idle breathing
          uSwirl: { value: 0.3 }, // idle boundary swirl
          uMaskStart: { value: rightMaskStart },
          uMaskFeather: { value: maskFeather },
          uShapeScale: { value: shapeScale },
          uMouse: { value: new THREE.Vector2(2, 2) }, // offscreen default
          uHover: { value: 0.0 },
          uEnterTime: { value: -1000.0 },
          uEnterPos: { value: new THREE.Vector2(2, 2) },
          uDrift: { value: 0.15 }, // rightward drift speed
          uFadeSpeed: { value: 0.3 }, // fade oscillation speed
        }}
        vertexShader={
          /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          precision highp float;

          uniform float uTime;
          uniform vec2  uRes;
          uniform vec3  uColor;
          uniform int   uVariant;
          uniform float uGrid;
          uniform float uJitter;
          uniform float uPulse;
          uniform float uSwirl;
          uniform float uMaskStart;
          uniform float uMaskFeather;
          uniform float uShapeScale;
          uniform vec2  uMouse;      // NDC [-1,1], y up
          uniform float uHover;      // 0..1 eased
          uniform float uEnterTime;  // time of last enter
          uniform vec2  uEnterPos;   // NDC of last enter
          uniform float uDrift;       // rightward drift amount
          uniform float uFadeSpeed;   // fade oscillation speed

          varying vec2  vUv;

          // small hash utils
          float hash21(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }

          // rotate 2D
          vec2 rot(vec2 p, float a) {
            float s = sin(a), c = cos(a);
            return mat2(c, -s, s, c) * p;
          }

          // ring mask around radius r with thickness t
          float ring(vec2 p, float r, float t) {
            float d = abs(length(p) - r);
            return smoothstep(t, 0.0, d);
          }

          // density function for the two motifs
          float densityFor(vec2 pNDC_aspect) {
            // center everything a bit to the right
            // pNDC_aspect already has aspect baked in so circles stay circular
            vec2 p = pNDC_aspect;
            p *= uShapeScale;
            
            // Add rightward drift animation - BIGGER movement
            float drift = sin(uTime * 0.5) * 0.3;
            p.x -= drift;

            if (uVariant == 0) {
              // dual motif: centered ring plus right dense disc
              vec2 c1 = vec2(-0.15, 0.0);     // ring slightly left of center
              vec2 c2 = vec2(0.45, 0.0);     // dense disc on the right
              
              // Animate positions with MORE movement
              c1.x += sin(uTime * 0.8) * 0.15;
              c1.y += cos(uTime * 0.6) * 0.08;
              c2.x += sin(uTime * 1.0) * 0.2;
              c2.y += cos(uTime * 0.7) * 0.1;
              
              // gentle swirl at the boundary so it feels alive even when not hovered
              float swirl1 = uSwirl * 0.5 * sin(uTime * 0.6 + length(p - c1) * 4.0);
              float swirl2 = uSwirl * 0.6 * sin(uTime * 0.7 + length(p - c2) * 5.0);
              vec2 p1 = rot(p - c1, swirl1) + c1;
              vec2 p2 = rot(p - c2, swirl2) + c2;

              float dRing = ring(p1 - c1, 0.35, 0.12);
              float d2 = length(p2 - c2);
              float disk = smoothstep(0.55, 0.47, d2);
              float denseDisk = disk * pow(clamp(1.0 - d2 / 0.47, 0.0, 1.0), 0.55);

              return clamp(max(dRing * 1.05, denseDisk * 1.35), 0.0, 1.0);
            } else {
              // chunky C cutout
              float r = 0.62;
              float thick = 0.22;
              float base = ring(p, r, thick);
              float ang = atan(p.y, p.x);
              float cutWidth = 0.78;
              float cut = step(cutWidth, abs(ang));
              float cMask = base * cut;
              float edgeBoost = smoothstep(0.0, cutWidth * 0.68, abs(ang));
              return clamp(cMask * (0.65 + 0.95 * edgeBoost), 0.0, 1.0);
            }
          }

          void main() {
            // map to a square pixel lattice so cells are squares on any aspect
            float minDim = min(uRes.x, uRes.y);
            vec2 grid = vec2(uGrid * (uRes.x / minDim), uGrid * (uRes.y / minDim));

            vec2 uvSquare = vec2( (vUv.x * uRes.x) / minDim, (vUv.y * uRes.y) / minDim );
            vec2 cellId = floor(uvSquare * grid);
            vec2 cellUv = fract(uvSquare * grid) - 0.5;
            vec2 cellCenter = (cellId + 0.5) / grid;

            // convert to NDC‑like and apply aspect so shapes are round
            vec2 pNDC = cellCenter * 2.0 - 1.0;
            vec2 pAspect = pNDC;
            float aspect = uRes.x / uRes.y;
            pAspect.x *= aspect;

            // right‑side mask so it lives on the right and fades left
            float mask = smoothstep(uMaskStart - uMaskFeather, uMaskStart + uMaskFeather, vUv.x);

            // base density of the chosen motif
            float baseD = densityFor(pAspect);

            // Animation that works consistently
            float rnd = hash21(cellId);
            
            // Create a wave animation with time
            float phase = rnd * 6.28;
            float wave1 = sin(uTime * 1.5 + phase);
            float wave2 = sin(uTime * 0.8 + phase * 0.5);
            
            // Combine waves for organic movement
            float animValue = 0.5 + 0.3 * wave1 + 0.2 * wave2;
            
            float spawn = baseD * animValue;

            // pointer in same aspect space for distance math
            vec2 mNDC = uMouse;
            vec2 mAspect = mNDC;
            mAspect.x *= aspect;

            // local hover boost
            float distToMouse = distance(pAspect, mAspect);
            float hoverRadius = 0.55;                          // size of the interactive area
            float hoverMask = uHover * smoothstep(hoverRadius, 0.0, distToMouse);
            spawn = clamp(spawn + 0.45 * hoverMask, 0.0, 1.0);

            // ripple ring from the last enter point
            vec2 eAspect = uEnterPos; eAspect.x *= aspect;
            float rippleT = max(0.0, uTime - uEnterTime);
            float ripR = rippleT * 1.15;
            float ripple = 0.0;
            if (rippleT < 2.0) {
              float d = abs(distance(pAspect, eAspect) - ripR);
              ripple = smoothstep(0.08, 0.0, d) * (1.0 - rippleT * 0.45);
              spawn = clamp(spawn + 0.35 * ripple, 0.0, 1.0);
            }

            // jitter inside each cell, stronger where we hover
            float jitterAmt = uJitter * (1.0 + 0.8 * hoverMask);
            vec2 jitter = (vec2(hash21(cellId + 7.7), hash21(cellId + 3.3)) - 0.5) * jitterAmt;
            vec2 q = cellUv - jitter;

            // square glyph
            float halfSize = 0.40 + 0.18 * hoverMask + 0.08 * ripple;
            float inside = 1.0 - step(halfSize, max(abs(q.x), abs(q.y)));

            // stochastic occupancy
            float live = step(rnd, spawn);
            
            // Add gentler global fade oscillation
            float globalFade = 0.7 + 0.3 * sin(uTime * 0.8);
            
            // Add subtle positional wave effect
            float wave = sin(pNDC.x * 3.0 - uTime * 2.0) * 0.15 + 0.85;
            
            float alpha = inside * live * mask * globalFade * wave;
            if (alpha <= 0.0) discard;

            vec3 col = uColor;
            // gentle brightening in denser areas
            col += 0.35 * vec3(1.0) * pow(baseD, 3.0);
            gl_FragColor = vec4(col, alpha * 0.7); // Increased visibility for testing
          }
        `
        }
      />
    </mesh>
  );
}

function Scene({
  pointerRef,
  variant,
}: {
  pointerRef: React.MutableRefObject<{
    x: number;
    y: number;
    hovered: number;
    justEnteredAt: number;
    enterPos: { x: number; y: number };
  }>;
  variant: 'dual' | 'c';
}) {
  return (
    <>
      <fog attach="fog" args={['#020618', 6, 28]} />
      <PixelSquares
        variant={variant}
        pointerRef={pointerRef}
        rightMaskStart={0.55} // Pushed further right to avoid text
        maskFeather={0.15} // Slightly sharper fade
        shapeScale={0.95}
      />
    </>
  );
}

export function ThreeBackground({
  className = '',
  variant = 'dual' as 'dual' | 'c',
}: {
  className?: string;
  variant?: 'dual' | 'c';
}) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const [hasSize, setHasSize] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Observe container size and only mount Canvas when it has dimensions
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      const r = el.getBoundingClientRect();
      setHasSize(r.width > 0 && r.height > 0);
    };

    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Force presentation when the container first has size
  useEffect(() => {
    if (!hasSize) return;
    const id = requestAnimationFrame(() => {
      invalidate();
      requestAnimationFrame(() => invalidate());
    });
    return () => cancelAnimationFrame(id);
  }, [hasSize]);

  // shared mutable pointer state used inside the WebGL scene without re-rendering React
  const pointerRef = useRef({
    x: 2,
    y: 2,
    hovered: 0,
    justEnteredAt: 0,
    enterPos: { x: 2, y: 2 },
  });

  useEffect(() => {
    console.log('ThreeBackground mounting...');
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      // Guard against zero sizes
      if (r.width === 0 || r.height === 0) return;

      const x = e.clientX;
      const y = e.clientY;
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;

      // normalized to 0..1 in the container, then to NDC [-1,1], y up
      const nx = ((x - r.left) / r.width) * 2 - 1;
      const ny = -(((y - r.top) / r.height) * 2 - 1);

      if (inside) {
        if (pointerRef.current.hovered < 0.5) {
          // rising edge
          pointerRef.current.justEnteredAt = performance.now() / 1000;
          pointerRef.current.enterPos = { x: nx, y: ny };
        }
        pointerRef.current.hovered = 1;
        pointerRef.current.x = nx;
        pointerRef.current.y = ny;
      } else {
        pointerRef.current.hovered = 0;
      }
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches?.length) return;
      const t = e.touches[0];
      onMove(
        new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY }),
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  if (!mounted) {
    console.log('ThreeBackground not mounted yet');
    return null;
  }

  if (error) {
    console.error('ThreeBackground error:', error);
    return null;
  }

  console.log('ThreeBackground rendering...');

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        willChange: 'transform, opacity',
        contain: 'layout paint size',
        isolation: 'isolate',
      }}
    >
      {hasSize && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={1}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          onError={(e: any) => {
            console.error('Canvas error:', e);
            setError(e?.message || 'Canvas error');
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          frameloop="always"
        >
          <Scene pointerRef={pointerRef} variant={variant} />
        </Canvas>
      )}
    </div>
  );
}
