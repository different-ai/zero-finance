import * as React from 'react';

type PipeIconProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const;

export function PipeIcon({ size = 'md', className = '' }: PipeIconProps) {
  const dimensions = sizeMap[size];

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: dimensions,
        height: dimensions
      }}
    >
      <img
        src="/screenpipe-logo.png" 
        alt="Screenpipe Logo"
        width={dimensions}
        height={dimensions}
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
} 