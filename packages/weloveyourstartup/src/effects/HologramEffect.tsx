import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const hologramShader = `
  uniform float uTime;
  uniform float uScanSpeed;
  uniform float uScanIntensity;
  uniform float uLineIntensity;
  uniform float uLineDensity;
  uniform float uEdgeGlow;
  uniform float uFlickerAmount;
  uniform float uFlickerSpeed;
  uniform vec3 uScanColor;
  uniform vec3 uEdgeColor;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Animated scan line
    float scanLine = mod(uv.y + uTime * uScanSpeed, 1.0);
    float scanGlow = exp(-abs(uv.y - scanLine) * 40.0) * uScanIntensity;

    // Horizontal scan lines (CRT style) - configurable density and intensity
    float lines = sin(uv.y * uLineDensity) * uLineIntensity + (1.0 - uLineIntensity);

    // Fresnel-like edge glow - configurable intensity
    vec2 center = uv - 0.5;
    float dist = length(center);
    float edgeGlow = smoothstep(0.3, 0.5, dist) * uEdgeGlow;

    // Combine effects
    vec3 hologramColor = inputColor.rgb;
    hologramColor += uScanColor * scanGlow; // Configurable scan glow color
    hologramColor *= lines;
    hologramColor += uEdgeColor * edgeGlow; // Configurable edge highlight color

    // Flicker effect - configurable amount and speed
    float flicker = sin(uTime * uFlickerSpeed) * uFlickerAmount + (1.0 - uFlickerAmount);
    hologramColor *= flicker;

    outputColor = vec4(hologramColor, inputColor.a);
  }
`;

export interface HologramConfig {
  scanSpeed: number;  // Speed of the scanning line
  scanIntensity: number;  // Intensity of the scan line glow
  lineIntensity: number;  // Intensity of horizontal scan lines (0-1)
  lineDensity: number;  // Density of horizontal scan lines
  edgeGlow: number;  // Intensity of edge glow effect
  flickerAmount: number;  // Amount of flicker (0-1)
  flickerSpeed: number;  // Speed of flicker
  scanColor: [number, number, number];  // RGB color for scan line (0-1 range)
  edgeColor: [number, number, number];  // RGB color for edge glow (0-1 range)
}

export class HologramEffect extends Effect {
  public config: HologramConfig;

  constructor(config: Partial<HologramConfig> = {}) {
    super('HologramEffect', hologramShader, {
      uniforms: new Map([
        ['uTime', new Uniform(0)],
        ['uScanSpeed', new Uniform(config.scanSpeed ?? 0.15)],
        ['uScanIntensity', new Uniform(config.scanIntensity ?? 0.8)],
        ['uLineIntensity', new Uniform(config.lineIntensity ?? 0.1)],
        ['uLineDensity', new Uniform(config.lineDensity ?? 300.0)],
        ['uEdgeGlow', new Uniform(config.edgeGlow ?? 0.3)],
        ['uFlickerAmount', new Uniform(config.flickerAmount ?? 0.02)],
        ['uFlickerSpeed', new Uniform(config.flickerSpeed ?? 10.0)],
        ['uScanColor', new Uniform(config.scanColor ?? [0.0, 1.0, 0.8])],
        ['uEdgeColor', new Uniform(config.edgeColor ?? [0.0, 1.0, 0.7])]
      ])
    });

    this.config = {
      scanSpeed: config.scanSpeed ?? 0.15,
      scanIntensity: config.scanIntensity ?? 0.8,
      lineIntensity: config.lineIntensity ?? 0.1,
      lineDensity: config.lineDensity ?? 300.0,
      edgeGlow: config.edgeGlow ?? 0.3,
      flickerAmount: config.flickerAmount ?? 0.02,
      flickerSpeed: config.flickerSpeed ?? 10.0,
      scanColor: config.scanColor ?? [0.0, 1.0, 0.8],
      edgeColor: config.edgeColor ?? [0.0, 1.0, 0.7]
    };
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    const timeUniform = this.uniforms.get('uTime');
    const scanSpeedUniform = this.uniforms.get('uScanSpeed');
    const scanIntensityUniform = this.uniforms.get('uScanIntensity');
    const lineIntensityUniform = this.uniforms.get('uLineIntensity');
    const lineDensityUniform = this.uniforms.get('uLineDensity');
    const edgeGlowUniform = this.uniforms.get('uEdgeGlow');
    const flickerAmountUniform = this.uniforms.get('uFlickerAmount');
    const flickerSpeedUniform = this.uniforms.get('uFlickerSpeed');
    const scanColorUniform = this.uniforms.get('uScanColor');
    const edgeColorUniform = this.uniforms.get('uEdgeColor');

    // Update configurable uniforms
    if (scanSpeedUniform) scanSpeedUniform.value = this.config.scanSpeed;
    if (scanIntensityUniform) scanIntensityUniform.value = this.config.scanIntensity;
    if (lineIntensityUniform) lineIntensityUniform.value = this.config.lineIntensity;
    if (lineDensityUniform) lineDensityUniform.value = this.config.lineDensity;
    if (edgeGlowUniform) edgeGlowUniform.value = this.config.edgeGlow;
    if (flickerAmountUniform) flickerAmountUniform.value = this.config.flickerAmount;
    if (flickerSpeedUniform) flickerSpeedUniform.value = this.config.flickerSpeed;
    if (scanColorUniform) scanColorUniform.value = this.config.scanColor;
    if (edgeColorUniform) edgeColorUniform.value = this.config.edgeColor;

    if (timeUniform) {
      timeUniform.value += deltaTime;
    }
  }
}
