/** @paper-design/shaders-react@0.0.54 */
import { MeshGradient } from '@paper-design/shaders-react';

/**
 * Code exported from Paper
 * https://app.paper.design/file/01K4GQ8ZPFWFT3S5VPDH79QP92?node=01K61RTN5AQ5V56AQ3Q4KNR3Z9
 * on Sep 25, 2025 at 6:05 PM.
 */
export default function GeneratedComponent({
  className = '',
}: {
  className?: string;
}) {
  return (
    <MeshGradient
      className={`absolute inset-0 z-0 ${className}`}
      speed={0.2}
    //   transparent also
      colors={[ '#668fff', '#1B29FF',  'rgba(246, 245, 239, 0)']}
      distortion={0.8}
      swirl={0.1}
      style={{ height: '100vh', width: '100vw' }}
    />
  );
}
