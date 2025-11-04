# 🚀 Rocket Visualization Implementation

This document explains the rocket visualization with glitch effects implemented in the weloveyourstartup package.

## 🎨 What's Included

### 1. **Custom Shader Effects** (`/src/effects/`)
All 5 custom postprocessing effects from the cool-website project:

- **GlitchEffect.tsx** - Digital glitch/corruption effect with RGB separation
- **DitherWaveEffect.tsx** - Animated dither reveal wave
- **HologramEffect.tsx** - Holographic scanning effect
- **DitheringOverlayEffect.tsx** - Dithering overlay with blend modes
- **BlueNoiseHalftoneEffect.tsx** - Risograph print effect

### 2. **Reusable Component** (`/src/components/RocketVisualization.tsx`)
A clean, performant 3D visualization component:

```tsx
<RocketVisualization
  height="400px"
  showGlitch={true}
  glitchIntensity={0.6}
  glitchFrequency={2.5}
/>
```

**Features:**
- Auto-rotating 3D space shuttle
- Wireframe rendering with risograph color palette (#1B29FF blue, #FF3D5B red)
- Configurable glitch effect
- Client-side only rendering (no SSR issues)

### 3. **Playground** (`/src/app/playground/page.tsx`)
Testing environment for experimenting with effects:

```
http://localhost:3002/playground
```

**Controls:**
- W/E/R - Switch transform modes (translate/rotate/scale)
- H - Toggle control panel
- Mouse - Orbit camera
- Scroll - Zoom

### 4. **Integration**
Added to startup pages at `/src/app/startups/[slug]/page.tsx`:
- Appears in showcase section above calculator
- Uses dynamic import to avoid SSR issues
- Shows loading state while 3D model loads

## 🔧 Technical Details

### Dependencies Installed
```json
{
  "@react-three/drei": "^9.108.3",
  "@react-three/fiber": "^8.16.8",
  "@react-three/postprocessing": "^2.16.2",
  "postprocessing": "^6.35.0",
  "three": "^0.164.1"
}
```

### React Version
Downgraded from React 19 to React 18.3.1 for compatibility with react-three-fiber.

### Next.js Dynamic Import
Used to prevent SSR issues with three.js:

```tsx
const RocketVisualization = dynamic(
  () => import('@/components/RocketVisualization').then(mod => ({ default: mod.RocketVisualization })),
  {
    ssr: false,
    loading: () => <LoadingFallback />
  }
);
```

## 🎮 Usage Examples

### Basic Usage
```tsx
import { RocketVisualization } from '@/components/RocketVisualization';

// In your component
<RocketVisualization height="500px" />
```

### With Glitch Effect
```tsx
<RocketVisualization
  height="600px"
  showGlitch={true}
  glitchIntensity={0.8}
  glitchFrequency={3.0}
/>
```

### No Effects (Clean Wireframe)
```tsx
<RocketVisualization
  height="400px"
  showGlitch={false}
/>
```

## 🐛 Troubleshooting

### Error: Cannot read properties of undefined (reading 'ReactCurrentOwner')
**Solution:** Already fixed! This was caused by:
1. React 19 incompatibility - downgraded to React 18
2. SSR issues - using dynamic import with `ssr: false`

### 3D Model Not Loading
**Check:**
1. Model file exists at `/public/GL Transmission Format - Binary.glb`
2. Component is using `"use client"` directive
3. Dynamic import is configured with `ssr: false`

### Glitch Effect Not Working
**Check:**
1. `showGlitch={true}` is set
2. Effect parameters are valid numbers
3. Browser console for WebGL errors

## 🚀 Next Steps

You can enhance this by:
1. Adding more visual effects (all 5 are available in `/src/effects/`)
2. Creating effect sequences/transitions
3. Adding user controls to toggle effects
4. Customizing the rocket model or colors
5. Adding scroll-based animation triggers

## 📁 File Structure

```
packages/weloveyourstartup/
├── public/
│   └── GL Transmission Format - Binary.glb
├── src/
│   ├── app/
│   │   ├── playground/
│   │   │   └── page.tsx (testing environment)
│   │   └── startups/[slug]/
│   │       └── page.tsx (integrated visualization)
│   ├── components/
│   │   └── RocketVisualization.tsx (reusable component)
│   └── effects/
│       ├── GlitchEffect.tsx
│       ├── DitherWaveEffect.tsx
│       ├── HologramEffect.tsx
│       ├── DitheringOverlayEffect.tsx
│       └── BlueNoiseHalftoneEffect.tsx
└── package.json (updated dependencies)
```

## 🎨 Customization

### Change Colors
Edit the `colorPalette` in `RocketVisualization.tsx`:
```tsx
const colorPalette = useMemo(() => [
  0x1B29FF, // primary color
  0xFF3D5B, // accent color
], []);
```

### Adjust Glitch Settings
Modify default props in component:
```tsx
glitchIntensity={0.8}  // 0-1, higher = more intense
glitchFrequency={3.0}   // Hz, higher = more frequent
```

---

Built with ❤️ for Zero Finance's weloveyourstartup project
