import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const ditherWaveShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uDitherScale;
  uniform float uWaveWidth;
  uniform float uBrightness;
  uniform vec3 uWaveColor;
  uniform vec3 uPatternColor;

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

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Wave sweeps from left to right (starts at -0.15, ends at 1.15)
    float wave = uProgress * 1.3 - 0.15;

    // Distance from current pixel to wave center position
    float distFromWave = uv.x - wave;

    // Get dither threshold from Bayer matrix (0 to 1)
    // Scale down pixel position to make dither pattern coarser/more visible
    vec2 pixelPos = (uv * resolution.xy) / uDitherScale; // Use configurable scale
    float ditherThreshold = bayer4x4(pixelPos);

    // Use configurable wave width
    float waveWidth = uWaveWidth;

    // Calculate reveal progress (0 = ahead of wave, 1 = behind wave)
    float revealProgress = smoothstep(waveWidth, -waveWidth, distFromWave);

    // Calculate how visible the dither pattern should be
    // Peak visibility at wave center, fades toward edges
    float distanceFromWaveCenter = abs(distFromWave);
    float ditherVisibility = 1.0 - smoothstep(0.0, waveWidth * 1.2, distanceFromWaveCenter);

    // Calculate luminance of input color (how bright the pixel is)
    float luminance = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

    // Boost luminance for brighter pixels (shuttle will be brighter)
    float boostedLuminance = luminance * uBrightness;

    // Apply dither pattern to create a base grid across the ENTIRE frame
    // This pattern is visible everywhere, not just on bright pixels
    float baseDither = step(ditherThreshold, revealProgress);

    // Apply the dithering effect strongly in the wave zone
    float ditherPattern = mix(1.0, baseDither, ditherVisibility);

    // Create a base brightness for the dither pattern itself
    // This makes the pattern visible even on black pixels
    float baseBrightness = 0.2; // Minimum brightness for the dither pattern

    // Calculate final brightness: base pattern + modulation by scene luminance
    // Black areas get baseBrightness, bright areas (shuttle) get much more
    float finalBrightness = baseBrightness + (boostedLuminance * 0.5);

    // Apply the dither pattern to the brightness
    // Areas where ditherPattern is 0 (off) stay black
    // Areas where ditherPattern is 1 (on) show color based on brightness
    vec3 color = vec3(0.0);

    if (ditherPattern > 0.5) {
        // This pixel is "on" in the dither pattern
        // Use the input color modulated by brightness
        color = inputColor.rgb * finalBrightness;

        // If there's very little input color, show a dim pattern color for empty areas
        if (luminance < 0.01) {
            color = uPatternColor * 0.3; // Use configurable pattern color
        }
    }

    // Scale everything by reveal progress
    color *= revealProgress;

    // Add bright scan line glow at the wave center using configurable wave color
    float waveFront = smoothstep(waveWidth * 0.8, 0.0, abs(distFromWave));
    color += uWaveColor * waveFront * 3.0; // Use configurable wave color

    outputColor = vec4(color, inputColor.a);
  }
`;

export interface DitherWaveConfig {
  duration: number;  // Duration of sweep in seconds
  pauseDuration: number;  // Pause before restart in seconds
  enabled: boolean;  // Whether animation is enabled
  manualProgress?: number;  // Manual control (0-1), overrides auto when set
  ditherScale: number;  // How coarse the dither pattern is (higher = coarser)
  waveWidth: number;  // Width of the dithered wave transition
  brightness: number;  // Brightness boost multiplier for bright pixels
  waveColor: [number, number, number];  // RGB color for wave front glow (0-1 range)
  patternColor: [number, number, number];  // RGB color for dither pattern on empty areas (0-1 range)
}

export class DitherWaveEffect extends Effect {
  private time: number = 0;
  public config: DitherWaveConfig;

  constructor(config: Partial<DitherWaveConfig> = {}) {
    super('DitherWaveEffect', ditherWaveShader, {
      uniforms: new Map([
        ['uTime', new Uniform(0)],
        ['uProgress', new Uniform(0)],
        ['uDitherScale', new Uniform(config.ditherScale ?? 8.0)],
        ['uWaveWidth', new Uniform(config.waveWidth ?? 0.25)],
        ['uBrightness', new Uniform(config.brightness ?? 2.5)],
        ['uWaveColor', new Uniform(config.waveColor ?? [0.0, 1.0, 0.85])],
        ['uPatternColor', new Uniform(config.patternColor ?? [0.5, 0.7, 0.7])]
      ])
    });

    this.config = {
      duration: config.duration ?? 3.0,
      pauseDuration: config.pauseDuration ?? 0.5,
      enabled: config.enabled ?? true,
      manualProgress: config.manualProgress,
      ditherScale: config.ditherScale ?? 8.0,
      waveWidth: config.waveWidth ?? 0.25,
      brightness: config.brightness ?? 2.5,
      waveColor: config.waveColor ?? [0.0, 1.0, 0.85],
      patternColor: config.patternColor ?? [0.5, 0.7, 0.7]
    };
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number): void {
    // Access uniforms properly
    const timeUniform = this.uniforms.get('uTime');
    const progressUniform = this.uniforms.get('uProgress');
    const ditherScaleUniform = this.uniforms.get('uDitherScale');
    const waveWidthUniform = this.uniforms.get('uWaveWidth');
    const brightnessUniform = this.uniforms.get('uBrightness');
    const waveColorUniform = this.uniforms.get('uWaveColor');
    const patternColorUniform = this.uniforms.get('uPatternColor');

    // Update configurable uniforms
    if (ditherScaleUniform) ditherScaleUniform.value = this.config.ditherScale;
    if (waveWidthUniform) waveWidthUniform.value = this.config.waveWidth;
    if (brightnessUniform) brightnessUniform.value = this.config.brightness;
    if (waveColorUniform) waveColorUniform.value = this.config.waveColor;
    if (patternColorUniform) patternColorUniform.value = this.config.patternColor;

    if (timeUniform && progressUniform) {
      // Manual mode overrides automatic animation
      if (this.config.manualProgress !== undefined) {
        progressUniform.value = this.config.manualProgress;
        timeUniform.value = this.time;
        return;
      }

      // Only update time if animation is enabled
      if (this.config.enabled) {
        this.time += deltaTime;
      }

      timeUniform.value = this.time;

      // Animate progress from 0 to 1 over duration, then pause
      const totalCycle = this.config.duration + this.config.pauseDuration;
      const cycleTime = this.time % totalCycle;

      if (cycleTime < this.config.duration) {
        progressUniform.value = cycleTime / this.config.duration;
      } else {
        progressUniform.value = 1.0;  // Hold at fully revealed during pause
      }
    }
  }

  resetTime(): void {
    this.time = 0;
  }
}
