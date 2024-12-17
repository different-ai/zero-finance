// components/brand-logo.tsx
import React from 'react'

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
} as const

export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const dimensions = sizeMap[size]

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: dimensions,
        height: dimensions
      }}
    >
      <img
        src="/1024x1024.png" 
        alt="Screenpipe Logo"
        width={dimensions}
        height={dimensions}
        className="w-full h-full object-contain" // Remove rounded-lg, add proper sizing
        loading="eager"
      />
    </div>
  )
}

// Usage example:
// <BrandLogo size="lg" className="hover:opacity-90 transition-opacity" />