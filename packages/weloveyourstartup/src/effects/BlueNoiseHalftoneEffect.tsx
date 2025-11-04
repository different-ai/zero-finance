import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const blueNoiseHalftoneShader = `
  uniform float uTime;
  uniform vec3 uBlueColor;      // Vibrant blue ink color
  uniform vec3 uPaperColor;     // Cream/white paper background
  uniform float uDotSize;       // Size of halftone dots (4-12)
  uniform float uDotSharpness;  // Sharpness of dots (0.5-2.0)
  uniform float uContrast;      // Overall contrast boost (1.0-2.5)
  uniform float uBrightness;    // Brightness adjustment (0.8-1.2)
  uniform float uGrainIntensity; // Paper grain intensity
  uniform float uInkSpread;     // Simulates ink spreading (0.0-0.3)
  uniform float uDotRotation;   // Dot screen rotation angle in radians
  uniform int uToneLevels;      // Number of tone levels (3-6)

  // Hash function for better randomness
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Improved blue noise approximation
  float blueNoise(vec2 coord) {
    vec2 i = floor(coord);
    vec2 f = fract(coord);

    // Smooth interpolation
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Halftone dot function - creates circular dots
  float halftoneDot(vec2 uv, float size, float angle) {
    // Rotate the coordinate system
    float s = sin(angle);
    float c = cos(angle);
    mat2 rot = mat2(c, -s, s, c);
    vec2 rotated = rot * uv;

    // Create a grid
    vec2 grid = rotated * size;
    vec2 gridCell = fract(grid) - 0.5;

    // Add blue noise offset for organic feel
    vec2 cellId = floor(grid);
    float noise = blueNoise(cellId * 0.1);
    gridCell += (noise - 0.5) * 0.15;

    // Create circular dots
    float dist = length(gridCell);
    return dist;
  }

  // Paper texture with fiber-like grain
  float paperTexture(vec2 coord) {
    float grain = 0.0;

    // Multiple scales of noise for paper fibers
    grain += blueNoise(coord * 0.5) * 0.5;
    grain += blueNoise(coord * 1.2) * 0.3;
    grain += blueNoise(coord * 3.5) * 0.2;

    return grain;
  }

  // Ink texture - adds irregularity to ink coverage
  float inkTexture(vec2 coord) {
    float tex = blueNoise(coord * 2.0);
    tex += blueNoise(coord * 5.0) * 0.5;
    return tex * 0.5;
  }

  // Posterize to discrete tone levels
  float posterize(float value, int levels) {
    float step = 1.0 / float(levels);
    return floor(value / step + 0.5) * step;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 screenCoord = uv * resolution.xy;

    // Better luminance calculation that preserves color information
    float lum = max(max(inputColor.r, inputColor.g), inputColor.b); // Use max channel instead of weighted average

    // Apply contrast and brightness
    lum = (lum - 0.5) * uContrast + 0.5;
    lum = clamp(lum * uBrightness, 0.0, 1.0);

    // Enhanced edge detection
    float edgeX = dFdx(lum);
    float edgeY = dFdy(lum);
    float edge = length(vec2(edgeX, edgeY));

    // Boost edges significantly for wireframe visibility
    lum = clamp(lum + edge * 1.5, 0.0, 1.0);

    // Posterize to create distinct tone levels
    lum = posterize(lum, uToneLevels);

    // For halftone: bright areas should get ink dots
    float density = lum; // Don't invert - bright = more dots

    // Add ink spread simulation
    density = clamp(density + uInkSpread, 0.0, 1.0);

    // Get halftone dot distance
    float dotDist = halftoneDot(screenCoord, uDotSize, uDotRotation);

    // Map density to dot size - larger dots in darker areas
    float dotRadius = sqrt(density) * 0.707; // 0.707 = max radius for touching dots

    // Create the dot with controllable sharpness
    float dotEdge = dotRadius * 1.414; // sqrt(2) for diagonal
    float halftone = 1.0 - smoothstep(dotRadius - 0.01 * uDotSharpness,
                                       dotRadius + 0.01 / uDotSharpness,
                                       dotDist);

    // Add subtle ink texture variation
    float inkVar = inkTexture(screenCoord * 0.3);
    halftone = clamp(halftone + (inkVar - 0.5) * 0.1, 0.0, 1.0);

    // Paper background with texture
    vec3 paper = uPaperColor;
    float paperGrain = paperTexture(screenCoord * 0.4);
    paper = mix(paper * 0.96, paper * 1.02, paperGrain * uGrainIntensity);

    // Ink color with slight variation
    vec3 ink = uBlueColor;
    ink = mix(ink * 0.95, ink * 1.0, inkVar);

    // Blend between paper and ink based on halftone
    vec3 finalColor = mix(paper, ink, halftone);

    // Subtle vignette for depth
    vec2 vignetteCoord = (uv - 0.5) * 1.8;
    float vignette = 1.0 - dot(vignetteCoord, vignetteCoord) * 0.12;
    finalColor *= vignette;

    // Very subtle overall grain
    float noise = blueNoise(screenCoord * 8.0) * 0.015;
    finalColor = clamp(finalColor + noise - 0.0075, 0.0, 1.0);

    outputColor = vec4(finalColor, 1.0);
  }
`;

export interface BlueNoiseHalftoneConfig {
  blueColor: [number, number, number];    // Vibrant blue ink RGB (0-1)
  paperColor: [number, number, number];   // Cream/white paper background RGB (0-1)
  dotSize: number;         // Size of halftone dots (4-12)
  dotSharpness: number;    // Sharpness of dots (0.5-2.0)
  contrast: number;        // Overall contrast boost (1.0-2.5)
  brightness: number;      // Brightness adjustment (0.8-1.2)
  grainIntensity: number;  // Paper grain intensity (0-1)
  inkSpread: number;       // Simulates ink spreading (0.0-0.3)
  dotRotation: number;     // Dot screen rotation in degrees (0-360)
  toneLevels: number;      // Number of tone levels (3-6)
}

export class BlueNoiseHalftoneEffect extends Effect {
  public config: BlueNoiseHalftoneConfig;

  constructor(config: Partial<BlueNoiseHalftoneConfig> = {}) {
    super('BlueNoiseHalftoneEffect', blueNoiseHalftoneShader, {
      uniforms: new Map([
        ['uTime', new Uniform(0)],
        ['uBlueColor', new Uniform(config.blueColor ?? [0.106, 0.161, 1.0])], // #1B29FF vibrant blue ink
        ['uPaperColor', new Uniform(config.paperColor ?? [0.98, 0.98, 0.957])], // #FAFAF4 cream paper
        ['uDotSize', new Uniform(config.dotSize ?? 0.08)],
        ['uDotSharpness', new Uniform(config.dotSharpness ?? 0.8)],
        ['uContrast', new Uniform(config.contrast ?? 2.5)],
        ['uBrightness', new Uniform(config.brightness ?? 1.5)],
        ['uGrainIntensity', new Uniform(config.grainIntensity ?? 0.3)],
        ['uInkSpread', new Uniform(config.inkSpread ?? 0.15)],
        ['uDotRotation', new Uniform((config.dotRotation ?? 15) * Math.PI / 180)],
        ['uToneLevels', new Uniform(config.toneLevels ?? 5)]
      ])
    });

    this.config = {
      blueColor: config.blueColor ?? [0.106, 0.161, 1.0],
      paperColor: config.paperColor ?? [0.98, 0.98, 0.957],
      dotSize: config.dotSize ?? 0.08,
      dotSharpness: config.dotSharpness ?? 0.8,
      contrast: config.contrast ?? 2.5,
      brightness: config.brightness ?? 1.5,
      grainIntensity: config.grainIntensity ?? 0.3,
      inkSpread: config.inkSpread ?? 0.15,
      dotRotation: config.dotRotation ?? 15,
      toneLevels: config.toneLevels ?? 5
    };
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    const timeUniform = this.uniforms.get('uTime');
    const blueColorUniform = this.uniforms.get('uBlueColor');
    const paperColorUniform = this.uniforms.get('uPaperColor');
    const dotSizeUniform = this.uniforms.get('uDotSize');
    const dotSharpnessUniform = this.uniforms.get('uDotSharpness');
    const contrastUniform = this.uniforms.get('uContrast');
    const brightnessUniform = this.uniforms.get('uBrightness');
    const grainIntensityUniform = this.uniforms.get('uGrainIntensity');
    const inkSpreadUniform = this.uniforms.get('uInkSpread');
    const dotRotationUniform = this.uniforms.get('uDotRotation');
    const toneLevelsUniform = this.uniforms.get('uToneLevels');

    // Update configurable uniforms
    if (blueColorUniform) blueColorUniform.value = this.config.blueColor;
    if (paperColorUniform) paperColorUniform.value = this.config.paperColor;
    if (dotSizeUniform) dotSizeUniform.value = this.config.dotSize;
    if (dotSharpnessUniform) dotSharpnessUniform.value = this.config.dotSharpness;
    if (contrastUniform) contrastUniform.value = this.config.contrast;
    if (brightnessUniform) brightnessUniform.value = this.config.brightness;
    if (grainIntensityUniform) grainIntensityUniform.value = this.config.grainIntensity;
    if (inkSpreadUniform) inkSpreadUniform.value = this.config.inkSpread;
    if (dotRotationUniform) dotRotationUniform.value = this.config.dotRotation * Math.PI / 180;
    if (toneLevelsUniform) toneLevelsUniform.value = this.config.toneLevels;

    if (timeUniform) {
      timeUniform.value += deltaTime;
    }
  }
}
