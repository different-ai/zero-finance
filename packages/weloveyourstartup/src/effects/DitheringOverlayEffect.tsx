import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const ditheringOverlayShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSize;
  uniform float uScale;
  uniform vec3 uDitherColor;
  uniform float uBlendStrength;
  uniform int uBlendMode; // 0: exclusion, 1: difference, 2: overlay, 3: screen
  uniform vec2 uOffset; // X/Y position offset
  uniform float uRotation; // Rotation in radians
  uniform int uDebugMode; // 0: normal, 1: show pattern, 2: show mask, 3: show shuttle detection

  // 4x4 Bayer matrix for ordered dithering
  float bayer4x4(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));

    // Bayer matrix lookup
    if (x == 0) {
      if (y == 0) return 0.0 / 16.0;
      if (y == 1) return 12.0 / 16.0;
      if (y == 2) return 3.0 / 16.0;
      if (y == 3) return 15.0 / 16.0;
    } else if (x == 1) {
      if (y == 0) return 8.0 / 16.0;
      if (y == 1) return 4.0 / 16.0;
      if (y == 2) return 11.0 / 16.0;
      if (y == 3) return 7.0 / 16.0;
    } else if (x == 2) {
      if (y == 0) return 2.0 / 16.0;
      if (y == 1) return 14.0 / 16.0;
      if (y == 2) return 1.0 / 16.0;
      if (y == 3) return 13.0 / 16.0;
    } else {
      if (y == 0) return 10.0 / 16.0;
      if (y == 1) return 6.0 / 16.0;
      if (y == 2) return 9.0 / 16.0;
      if (y == 3) return 5.0 / 16.0;
    }
    return 0.5;
  }

  // Warp effect for dynamic dithering
  vec2 warp(vec2 uv, float time) {
    float warpAmount = 0.02;
    float wave1 = sin(uv.y * 10.0 + time * uSpeed) * warpAmount;
    float wave2 = cos(uv.x * 10.0 + time * uSpeed * 0.7) * warpAmount;
    return uv + vec2(wave1, wave2);
  }

  // Blend modes
  vec3 exclusion(vec3 base, vec3 blend) {
    return base + blend - 2.0 * base * blend;
  }

  vec3 difference(vec3 base, vec3 blend) {
    return abs(base - blend);
  }

  vec3 overlay(vec3 base, vec3 blend) {
    vec3 result;
    result.r = base.r < 0.5 ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r));
    result.g = base.g < 0.5 ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g));
    result.b = base.b < 0.5 ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b));
    return result;
  }

  vec3 screen(vec3 base, vec3 blend) {
    return 1.0 - (1.0 - base) * (1.0 - blend);
  }

  // Rotate UV coordinates around center
  vec2 rotate(vec2 uv, float angle) {
    vec2 centered = uv - 0.5;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotation = mat2(c, -s, s, c);
    return rotation * centered + 0.5;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Apply offset to UV coordinates
    vec2 offsetUV = uv + uOffset;

    // Apply rotation
    vec2 rotatedUV = rotate(offsetUV, uRotation);

    // Apply warp effect to UV coordinates
    vec2 warpedUV = warp(rotatedUV, uTime);

    // Scale and apply dithering pattern
    vec2 pixelPos = (warpedUV * resolution.xy) / uSize;
    pixelPos *= uScale;

    // Get dither threshold from Bayer matrix (0 to 1)
    float ditherThreshold = bayer4x4(pixelPos);

    // Create dithering pattern (0 or 1) - 1 means "reveal", 0 means "hide"
    float pattern = step(0.5, ditherThreshold);

    // Calculate luminance to detect shuttle (bright pixels)
    float luminance = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

    // Detect if this pixel is part of the shuttle (1 = shuttle, 0 = black background)
    float isShuttle = step(0.01, luminance);

    // CRITICAL: Shuttle is ONLY visible where pattern AND shuttle both exist
    // If pattern = 0: hide everything (show background)
    // If pattern = 1 AND isShuttle = 0: show background
    // If pattern = 1 AND isShuttle = 1: reveal shuttle
    float mask = pattern * isShuttle;

    // Debug modes to visualize what's happening
    if (uDebugMode == 1) {
      // Show JUST the dither pattern (white = on, black = off)
      outputColor = vec4(vec3(pattern), 1.0);
      return;
    } else if (uDebugMode == 2) {
      // Show JUST the mask (white = shuttle should be visible, black = hidden)
      outputColor = vec4(vec3(mask), 1.0);
      return;
    } else if (uDebugMode == 3) {
      // Show JUST shuttle detection (white = shuttle detected, black = background)
      outputColor = vec4(vec3(isShuttle), 1.0);
      return;
    }

    // Normal mode: Start with completely black or background color
    vec3 backgroundColor = uDitherColor * 0.02;

    vec3 finalColor = backgroundColor;

    // ONLY add shuttle color where mask = 1
    if (mask > 0.5) {
      vec3 shuttleColor;

      if (uBlendMode == 0) {
        // Exclusion
        shuttleColor = exclusion(inputColor.rgb, uDitherColor);
      } else if (uBlendMode == 1) {
        // Difference
        shuttleColor = difference(inputColor.rgb, uDitherColor);
      } else if (uBlendMode == 2) {
        // Overlay
        shuttleColor = overlay(inputColor.rgb, uDitherColor);
      } else if (uBlendMode == 3) {
        // Screen
        shuttleColor = screen(inputColor.rgb, uDitherColor);
      } else {
        // Direct - just show input color
        shuttleColor = inputColor.rgb;
      }

      // Replace background with shuttle color based on blend strength
      finalColor = mix(backgroundColor, shuttleColor, uBlendStrength);
    }

    outputColor = vec4(finalColor, 1.0);
  }
`;

export interface DitheringOverlayConfig {
  speed: number;  // Animation speed
  size: number;  // Dither pattern size
  scale: number;  // Dither pattern scale
  ditherColor: [number, number, number];  // RGB color for dithering (0-1 range)
  blendMode: number;  // 0: exclusion, 1: difference, 2: overlay, 3: screen
  blendStrength: number;  // Blend strength (0-1)
  offsetX: number;  // X position offset (-1 to 1)
  offsetY: number;  // Y position offset (-1 to 1)
  rotation: number;  // Rotation in degrees (0-360)
  debugMode: number;  // 0: normal, 1: show pattern, 2: show mask, 3: show shuttle detection
}

export class DitheringOverlayEffect extends Effect {
  public config: DitheringOverlayConfig;

  constructor(config: Partial<DitheringOverlayConfig> = {}) {
    super('DitheringOverlayEffect', ditheringOverlayShader, {
      uniforms: new Map([
        ['uTime', new Uniform(0)],
        ['uSpeed', new Uniform(config.speed ?? 1.0)],
        ['uSize', new Uniform(config.size ?? 2.0)],
        ['uScale', new Uniform(config.scale ?? 0.6)],
        ['uDitherColor', new Uniform(config.ditherColor ?? [0.164, 0.38, 0.514])], // #2A6183
        ['uBlendMode', new Uniform(config.blendMode ?? 0)],
        ['uBlendStrength', new Uniform(config.blendStrength ?? 1.0)],
        ['uOffset', new Uniform([config.offsetX ?? 0.0, config.offsetY ?? 0.0])],
        ['uRotation', new Uniform((config.rotation ?? 0) * Math.PI / 180)], // Convert degrees to radians
        ['uDebugMode', new Uniform(config.debugMode ?? 0)]
      ])
    });

    this.config = {
      speed: config.speed ?? 1.0,
      size: config.size ?? 2.0,
      scale: config.scale ?? 0.6,
      ditherColor: config.ditherColor ?? [0.164, 0.38, 0.514], // #2A6183
      blendMode: config.blendMode ?? 0,
      blendStrength: config.blendStrength ?? 1.0,
      offsetX: config.offsetX ?? 0.0,
      offsetY: config.offsetY ?? 0.0,
      rotation: config.rotation ?? 0,
      debugMode: config.debugMode ?? 0
    };
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    const timeUniform = this.uniforms.get('uTime');
    const speedUniform = this.uniforms.get('uSpeed');
    const sizeUniform = this.uniforms.get('uSize');
    const scaleUniform = this.uniforms.get('uScale');
    const ditherColorUniform = this.uniforms.get('uDitherColor');
    const blendModeUniform = this.uniforms.get('uBlendMode');
    const blendStrengthUniform = this.uniforms.get('uBlendStrength');
    const offsetUniform = this.uniforms.get('uOffset');
    const rotationUniform = this.uniforms.get('uRotation');
    const debugModeUniform = this.uniforms.get('uDebugMode');

    // Update configurable uniforms
    if (speedUniform) speedUniform.value = this.config.speed;
    if (sizeUniform) sizeUniform.value = this.config.size;
    if (scaleUniform) scaleUniform.value = this.config.scale;
    if (ditherColorUniform) ditherColorUniform.value = this.config.ditherColor;
    if (blendModeUniform) blendModeUniform.value = this.config.blendMode;
    if (blendStrengthUniform) blendStrengthUniform.value = this.config.blendStrength;
    if (offsetUniform) offsetUniform.value = [this.config.offsetX, this.config.offsetY];
    if (rotationUniform) rotationUniform.value = this.config.rotation * Math.PI / 180; // Convert to radians
    if (debugModeUniform) debugModeUniform.value = this.config.debugMode;

    if (timeUniform) {
      timeUniform.value += deltaTime;
    }
  }
}
