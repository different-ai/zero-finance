'use client';

import React from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

export function GradientBackground({
  className = '',
  variant = 'hero' as 'hero' | 'demo',
}: {
  className?: string;
  variant?: 'hero' | 'demo';
}) {
  // Blue gradient colors concentrated in top-right
  const heroColors = [
    'rgba(27, 41, 255, 0.1)', // Transparent blue
    '#4A5BFF', // Medium blue
    '#1B29FF', // Strong blue
    '#3344FF', // Vibrant blue
  ];

  const demoColors = [
    'rgba(27, 41, 255, 0.05)', // Very transparent blue
    '#4A5BFF',
    '#6677FF',
    '#1B29FF',
  ];

  const sharedProps = {
    colorBack: 'rgba(246, 245, 239, 0)', // Transparent background
    softness: 0.9, // Softer edges for better blending
    intensity: 0.4, // Slightly more intense
    noise: 0.15, // Less noise for cleaner look
    shape: 'circle' as const,
    scale: 2.0, // Larger scale to cover more area
    speed: 0.15, // Slower, more subtle animation
    style: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: variant === 'hero' ? 0.6 : 0.4,
    },
  };

  return (
    <div
      className={`fixed inset-0 ${className}`}
      style={{
        pointerEvents: 'none',
        zIndex: -1, // Behind everything including header
      }}
    >
      <GrainGradient
        {...sharedProps}
        colors={variant === 'hero' ? heroColors : demoColors}
        offsetX={variant === 'hero' ? 0.5 : 0.3} // Push to the right
        offsetY={variant === 'hero' ? -0.5 : -0.3} // Push to the top
        rotation={variant === 'hero' ? -45 : -30} // Angle from top-right
      />
    </div>
  );
}
