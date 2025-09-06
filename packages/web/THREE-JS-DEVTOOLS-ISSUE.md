# Three.js Canvas Only Renders When DevTools Is Open

## Problem Summary

The Three.js animated background (`ThreeBackground.tsx`) only becomes visible when Chrome DevTools is open. When DevTools is closed and the page is reloaded, the canvas doesn't render. Opening DevTools immediately makes the animation appear.

## Key Observations

1. **With DevTools open**: Animation renders immediately on page load
2. **Without DevTools**: Animation doesn't render on page load
3. **Opening DevTools after load**: Animation immediately appears
4. **Not a sizing issue**: The component mounts and "renders" (console logs confirm), but nothing is visible

## Current Component Structure

### Files Involved

1. `/packages/web/src/app/(landing)/ThreeBackground.tsx` - The Three.js component
2. `/packages/web/src/app/(landing)/HeroSection.tsx` - Where it's used

### How It's Used

```tsx
// In HeroSection.tsx
<section className="relative border-b border-[#101010]/10 bg-[#F6F5EF] overflow-hidden min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center">
  <ThreeBackground className="opacity-80 z-0" />
  <div className="relative z-10">{/* content */}</div>
</section>
```

## Attempted Solutions

### 1. Fixed Zero-Size Canvas Issue (Didn't solve it)

**Theory**: Canvas was getting 0x0 dimensions on initial mount

**What we tried**:

- Added `useLayoutEffect` with `ResizeObserver` to detect container size
- Only mounted Canvas when container had non-zero dimensions
- Added explicit size styles to container div

**Result**: Component was mounting/rendering (console logs confirmed) but still only visible with DevTools

### 2. Removed z-index: -1 (Partial fix)

**Theory**: Canvas was rendering behind everything

**What we tried**:

- Removed hardcoded `z-index: -1` from component
- Moved ThreeBackground inside sections as first child
- Made it `absolute inset-0 z-0` with content at `z-10`

**Result**: Helped with general visibility but didn't fix DevTools issue

### 3. Force Resize Event (Didn't work)

**Theory**: Canvas needed a resize trigger to render

**What we tried**:

```javascript
setTimeout(() => {
  window.dispatchEvent(new Event('resize'));
}, 100);
```

**Result**: No effect on DevTools issue

### 4. Simplified WebGL Settings (Current state)

**Theory**: Complex GL settings causing rendering issues

**What we tried**:

```javascript
// Changed from:
gl={{
  alpha: true,
  antialias: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
  preserveDrawingBuffer: true,
}}
dpr={[1, 2]}

// To:
gl={{
  alpha: true,
  antialias: false,
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: false,
}}
dpr={1}
```

**Result**: Still only renders with DevTools open

## Console Output

```
ThreeBackground not mounted yet
ThreeBackground mounting...
ThreeBackground rendering...
```

All logs fire correctly, but canvas remains invisible until DevTools opens.

## Current Code State

### ThreeBackground.tsx Structure

- Uses React Three Fiber (`@react-three/fiber`)
- Custom shader material for pixel animation
- Mounts conditionally after `useEffect`
- Container div with `absolute inset-0`

### Canvas Configuration

```tsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 50 }}
  dpr={1}
  gl={{
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: false,
  }}
  frameloop="always"
>
```

## Possible Remaining Theories

1. **GPU/Hardware Acceleration**: DevTools might trigger GPU activation
2. **React Three Fiber Timing**: Something about R3F's initialization requires a paint/reflow that DevTools triggers
3. **Chrome Rendering Optimization**: Browser might be deferring WebGL context creation
4. **Frameloop Issue**: The `frameloop="always"` might need a kickstart
5. **Shader Compilation**: Shaders might not compile until DevTools forces a render

## What Makes This Weird

- It's NOT a resize issue (we've confirmed with logs)
- It's NOT a mounting issue (component mounts fine)
- It's specifically tied to DevTools being open
- Opens DevTools = instant appearance
- Close DevTools + reload = invisible

## Files to Share

1. `/packages/web/src/app/(landing)/ThreeBackground.tsx` - Full component
2. `/packages/web/src/app/(landing)/HeroSection.tsx` - How it's used
3. `/packages/web/package.json` - Dependencies/versions
4. This document - Summary of issue and attempts

## Environment Details

- Next.js app
- React Three Fiber with custom shaders
- Dynamic import with SSR disabled
- Chrome browser (issue seems Chrome-specific)

## Next Steps to Try

1. Force shader compilation/first render
2. Add `gl.render()` call manually after mount
3. Try `frameloop="demand"` with manual `invalidate()`
4. Check if issue occurs in other browsers
5. Add a tiny animation/state change to force re-render
6. Try removing the dynamic import and see if SSR false is the issue

## Attempted Resolution #5: Chrome Compositor Fix (FAILED)

### Theory

Chrome fails to properly composite WebGL canvases when an ancestor element has CSS `opacity` less than 1. Opening DevTools forces a repaint/recomposite which temporarily fixes the issue.

### What we tried

1. **Removed CSS opacity from ThreeBackground wrapper**

   - Removed `opacity-80` and `opacity-30` classes from HeroSection.tsx
   - Rely on shader alpha instead (already set to `alpha * 0.4` in shader)

2. **Forced stable compositor layer**

   ```javascript
   style={{
     pointerEvents: 'none',
     transform: 'translateZ(0)',
     willChange: 'transform, opacity',
   }}
   ```

   - Added hardware acceleration hints to prevent Chrome from deferring the canvas layer

3. **Re-added size gating with ResizeObserver**

   ```javascript
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
   ```

   - Only mount Canvas when container has non-zero dimensions

4. **Guarded pointer math against zero sizes**

   ```javascript
   if (r.width === 0 || r.height === 0) return;
   ```

   - Prevent NaN values in mouse position calculations

5. **Hardened WebGL context**
   ```javascript
   gl={{
     alpha: true,
     antialias: false,
     powerPreference: "high-performance",
     failIfMajorPerformanceCaveat: false,
     premultipliedAlpha: false,
     preserveDrawingBuffer: true,
   }}
   onCreated={({ gl }) => {
     gl.setClearColor(0x000000, 0);
   }}
   ```
   - Added premultiplied alpha settings and explicit clear color

### Result: STILL DOESN'T WORK

- Canvas still only appears when DevTools is open
- All the compositor hints and WebGL settings didn't resolve the issue
- The problem persists despite removing CSS opacity

## Summary of ALL Attempts

1. **Size fixes** - ResizeObserver, container measurements - FAILED
2. **Z-index fixes** - Removed negative z-index, proper layering - FAILED
3. **Resize events** - Force resize dispatch after mount - FAILED
4. **WebGL simplification** - Reduced GL settings complexity - FAILED
5. **Compositor/Opacity fix** - Removed CSS opacity, added GPU hints - FAILED

## Current Status

Despite extensive debugging:

- Component mounts correctly (logs confirm)
- Console shows "ThreeBackground mounting..." and "ThreeBackground rendering..."
- Canvas element exists in DOM
- But WebGL content only renders when Chrome DevTools is open
- Opening DevTools = instant appearance
- Closing DevTools + reload = invisible canvas

## SOLUTION: Fixed Plane Sizing and Chrome Compositor Issues

### Root Cause Analysis

#### Problem 1: Plane Geometry Locked at Mount

- The plane was created with `args={[viewport.width, viewport.height]}`
- If viewport wasn't ready on first render, geometry baked a 0x0 plane
- Geometry args are NOT reactive in Three.js - once created, they don't update
- DevTools triggered re-mounts that coincidentally fixed the frozen geometry

#### Problem 2: Chrome Compositor Laziness

- `preserveDrawingBuffer: true` + transparent clear kept canvas in "nothing to present" state
- Chrome's compositor optimized away the first transparent frames
- DevTools flips internal compositor flags that forced frame presentation

### The Working Fix

#### 1. Made Plane Size Reactive

**Before:**

```jsx
<planeGeometry args={[viewport.width, viewport.height]} />
```

**After:**

```jsx
<mesh scale={[viewport.width, viewport.height, 1]} frustumCulled={false}>
  <planeGeometry args={[1, 1]} />
</mesh>
```

- Unit plane (1x1) scaled by viewport dimensions
- Scale is reactive and updates automatically
- `frustumCulled={false}` ensures it's never clipped

#### 2. Fixed Compositor Settings

```javascript
gl={{
  alpha: true,
  antialias: true,  // Re-enabled
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: false,
  premultipliedAlpha: false,
  // Removed: preserveDrawingBuffer: true
}}
```

#### 3. Forced Initial Paint

```javascript
useEffect(() => {
  if (hasSize) {
    // Force 2 frames through the pipeline
    requestAnimationFrame(() => {
      invalidate();
      requestAnimationFrame(() => {
        invalidate();
      });
    });
  }
}, [hasSize]);
```

#### 4. Isolated Canvas Layer

```css
style={{
  pointerEvents: 'none',
  contain: 'layout paint size',
  isolation: 'isolate',
}}
```

### Result: IT WORKS!

- Canvas renders immediately without DevTools
- Plane resizes correctly with viewport changes
- Chrome's compositor can't optimize away the frames
- No more DevTools dependency

### Why DevTools "Fixed" It

DevTools was triggering:

1. Component re-mounts (fixing the frozen 0x0 geometry)
2. Compositor flag changes (forcing frame presentation)
3. Multiple invalidation cycles (pushing frames through)

The fix addresses all these issues at the source rather than relying on DevTools side effects.
