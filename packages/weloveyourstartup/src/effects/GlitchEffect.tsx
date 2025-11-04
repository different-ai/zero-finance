import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const glitchShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uGlitchTrigger;
  uniform float uFrequency;
  uniform float uBlockSize;
  uniform vec3 uGlitchColor;
  uniform float uRgbSeparation;

  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 uvShift = uv;

    // Glitch happens in bursts - only when triggered
    float glitchActive = step(0.7, uGlitchTrigger);

    if (glitchActive > 0.5) {
      // Denser horizontal displacement - more rows affected
      float rowGlitch = random(vec2(floor(uv.y * 200.0), floor(uTime * uFrequency)));
      if (rowGlitch > 0.7) { // Much lower threshold = more rows affected
        uvShift.x += (random(vec2(rowGlitch, uTime)) - 0.5) * 0.15 * uIntensity;
      }

      // Larger block corruption when active (size is configurable)
      float blockGlitch = random(vec2(floor(uv.x * uBlockSize), floor(uv.y * uBlockSize) + floor(uTime * 5.0)));
      if (blockGlitch > 0.85) { // Lower threshold = more blocks
        // Use configurable glitch color with some randomness
        vec3 glitchColor = uGlitchColor * vec3(random(uv + uTime), random(uv - uTime), random(uv * uTime));
        outputColor = vec4(glitchColor, inputColor.a);
        return;
      }
    }

    // RGB channel separation - always slightly active (configurable)
    float separation = glitchActive > 0.5 ? uRgbSeparation * uIntensity : uRgbSeparation * 0.3;
    float r = texture2D(inputBuffer, uvShift + vec2(separation, 0.0)).r;
    float g = texture2D(inputBuffer, uvShift).g;
    float b = texture2D(inputBuffer, uvShift - vec2(separation, 0.0)).b;

    vec3 color = vec3(r, g, b);

    outputColor = vec4(color, inputColor.a);
  }
`;

export interface GlitchConfig {
  intensity: number;  // Overall intensity of the effect (0-1)
  frequency: number;  // Frequency of glitch updates
  blockSize: number;  // Size of corruption blocks (higher = smaller blocks)
  glitchColor: [number, number, number];  // RGB color for glitch blocks (0-1 range)
  rgbSeparation: number;  // Amount of RGB channel separation
}

export class GlitchEffect extends Effect {
  public config: GlitchConfig;

  constructor(config: Partial<GlitchConfig> = {}) {
    super('GlitchEffect', glitchShader, {
      uniforms: new Map([
        ['uTime', new Uniform(0)],
        ['uIntensity', new Uniform(config.intensity ?? 0.8)],
        ['uGlitchTrigger', new Uniform(0)],
        ['uFrequency', new Uniform(config.frequency ?? 3.0)],
        ['uBlockSize', new Uniform(config.blockSize ?? 40.0)],
        ['uGlitchColor', new Uniform(config.glitchColor ?? [1.0, 1.0, 1.0])],
        ['uRgbSeparation', new Uniform(config.rgbSeparation ?? 0.006)]
      ])
    });

    this.config = {
      intensity: config.intensity ?? 0.8,
      frequency: config.frequency ?? 3.0,
      blockSize: config.blockSize ?? 40.0,
      glitchColor: config.glitchColor ?? [1.0, 1.0, 1.0],
      rgbSeparation: config.rgbSeparation ?? 0.006
    };
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    const intensityUniform = this.uniforms.get('uIntensity');
    const timeUniform = this.uniforms.get('uTime');
    const triggerUniform = this.uniforms.get('uGlitchTrigger');
    const frequencyUniform = this.uniforms.get('uFrequency');
    const blockSizeUniform = this.uniforms.get('uBlockSize');
    const glitchColorUniform = this.uniforms.get('uGlitchColor');
    const rgbSeparationUniform = this.uniforms.get('uRgbSeparation');

    // Update configurable uniforms
    if (intensityUniform) intensityUniform.value = this.config.intensity;
    if (frequencyUniform) frequencyUniform.value = this.config.frequency;
    if (blockSizeUniform) blockSizeUniform.value = this.config.blockSize;
    if (glitchColorUniform) glitchColorUniform.value = this.config.glitchColor;
    if (rgbSeparationUniform) rgbSeparationUniform.value = this.config.rgbSeparation;

    if (timeUniform && triggerUniform) {
      timeUniform.value += deltaTime;

      // Trigger glitch bursts randomly - happens less often but more intense
      const time = timeUniform.value;
      // Random value that triggers glitch ~30% of the time in short bursts
      const trigger = Math.sin(time * 1.7) * Math.sin(time * 3.3);
      triggerUniform.value = trigger;
    }
  }
}
