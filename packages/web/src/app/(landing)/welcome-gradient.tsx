/** @paper-design/shaders-react@0.0.54 */
import { Dithering } from '@paper-design/shaders-react';

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
    <div className="absolute inset-0 z-0 opacity-10">
    <Dithering
      colorBack="#00000000"
      colorFront="#1B29FF"
      speed={0.05}
      shape="warp"
      type="4x4"
      size={2}
      scale={0.6}
      pxSize={0.05}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
