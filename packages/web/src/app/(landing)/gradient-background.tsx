'use client';

import React from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

export function GradientBackground({
  className = '',
  variant = 'hero' as 'hero' | 'demo' | 'welcome',
}: {
  className?: string;
  variant?: 'hero' | 'demo' | 'welcome';
}) {
  const noise = (variant: 'hero' | 'demo' | 'welcome') => {
    switch (variant) {
      case 'hero':
        return 0.25;
      case 'demo':
        return 0.25;
      case 'welcome':
        return 0.25;
    }
  };

  const shape = (variant: 'hero' | 'demo' | 'welcome') => {
    switch (variant) {
      case 'hero':
        return 'corners' as const;
      case 'demo':
        return 'corners' as const;
      case 'welcome':
        return 'corners' as const;
    }
  };
  const offsetX = (variant: 'hero' | 'demo' | 'welcome') => {
    switch (variant) {
      case 'hero':
        return -1;
      case 'demo':
        return -1;
      case 'welcome':
        return -1;
    }
  };
  const offsetY = (variant: 'hero' | 'demo' | 'welcome') => {
    switch (variant) {
      case 'hero':
        return 0;
      case 'demo':
        return 0;
      case 'welcome':
        return 0;
    }
  };
  const rotation = (variant: 'hero' | 'demo' | 'welcome') => {
    switch (variant) {
      case 'hero':
        return 0;
      case 'demo':
        return 0;
      case 'welcome':
        return 0;
    }
  };
  // Brand gradient colors from Design Language (readable on light backgrounds)
  const heroColors = [
    '#668fff', // Light blue
    '#1B29FF', // Brand primary
    'rgba(246, 245, 239, 0)', // Transparent cream
    'rgba(27, 41, 255, 0.3)', // Semi-transparent brand blue
  ];

  const demoColors = [
    '#668fff',
    '#1B29FF',
    'rgba(246, 245, 239, 0)',
    'rgba(27, 41, 255, 0.2)',
  ];

  const sharedProps = {
    colorBack: 'rgba(246, 245, 239, 0)', // Transparent background matching design language
    softness: 0.3, // Softer for better text readability
    intensity: 0.2, // Lower intensity for background use
    noise: noise(variant),
    shape: shape(variant),
    scale: 1,
    speed: 0.2, // Slower, subtle movement per design language
    style: {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: variant === 'hero' ? 0.5 : 0.3, // Ensure text readability
    },
  };

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        pointerEvents: 'none',
        // zIndex: -1, // Behind everything including header
      }}
    >
      <GrainGradient
        {...sharedProps}
        colors={variant === 'hero' ? heroColors : demoColors}
        offsetX={offsetX(variant)} // Push to the right
        offsetY={offsetY(variant)} // Push to the top
        rotation={rotation(variant)} // Angle from top-right
      />
    </div>
  );
}
