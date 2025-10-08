/** @paper-design/shaders-react@0.0.57 */
import { Dithering } from '@paper-design/shaders-react';

/**
 * Flyer gradient background with dithering effect
 * Uses Zero Finance brand blue with dynamic pattern
 */
export default function FlyerGradient({
  className = '',
}: {
  className?: string;
}) {
  return (
    <Dithering
      className={`absolute inset-0 z-0 ${className}`}
      colorBack="#00000000"
      colorFront="#1B29FF" // Brand primary blue
      speed={0.8}
      shape="simplex"
      type="4x4"
      size={2}
      scale={0.6}
      style={{ height: '100vh', width: '100vw' }}
    />
  );
}
