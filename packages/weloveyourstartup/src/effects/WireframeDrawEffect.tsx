import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const wireframeDrawShader = `
  uniform float uProgress;
  uniform float uDrawSpeed;

  // Simple hash function for pseudo-random values
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Calculate vertical progress (draws from bottom to top)
    float verticalProgress = uProgress;

    // Add some horizontal scanning noise for that CRT drawing feel
    float scanline = hash(vec2(uv.y * 100.0, floor(uProgress * 50.0)));
    float drawThreshold = uv.y + (scanline * 0.1);

    // Progressive reveal: areas below progress line are visible
    float reveal = step(drawThreshold, verticalProgress);

    // Fade in effect at the drawing edge for smoother appearance
    float edgeFade = smoothstep(verticalProgress - 0.05, verticalProgress, uv.y);

    // Combine reveal with edge fade
    float visibility = reveal * edgeFade;

    // Apply brightness boost at the drawing edge (like an active scan line)
    float edgeGlow = smoothstep(verticalProgress - 0.02, verticalProgress, uv.y) *
                     (1.0 - smoothstep(verticalProgress, verticalProgress + 0.02, uv.y));

    vec3 color = inputColor.rgb * visibility;
    color += vec3(0.0, 1.0, 0.85) * edgeGlow * 0.5; // Cyan glow at drawing edge

    outputColor = vec4(color, inputColor.a * visibility);
  }
`;

export interface WireframeDrawConfig {
  duration: number;  // Duration of drawing animation in seconds
  enabled: boolean;  // Whether animation is enabled
  drawSpeed: number; // Speed multiplier for drawing
}

export class WireframeDrawEffect extends Effect {
  private time: number = 0;
  private startTime: number = 0;
  private hasStarted: boolean = false;
  public config: WireframeDrawConfig;

  constructor(config: Partial<WireframeDrawConfig> = {}) {
    super('WireframeDrawEffect', wireframeDrawShader, {
      uniforms: new Map([
        ['uProgress', new Uniform(0)],
        ['uDrawSpeed', new Uniform(config.drawSpeed ?? 1.0)]
      ])
    });

    this.config = {
      duration: config.duration ?? 1.5,
      enabled: config.enabled ?? true,
      drawSpeed: config.drawSpeed ?? 1.0
    };
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number): void {
    const progressUniform = this.uniforms.get('uProgress');
    const drawSpeedUniform = this.uniforms.get('uDrawSpeed');

    if (drawSpeedUniform) drawSpeedUniform.value = this.config.drawSpeed;

    if (progressUniform) {
      if (!this.hasStarted) {
        this.hasStarted = true;
        this.startTime = this.time;
      }

      if (this.config.enabled) {
        this.time += deltaTime;
      }

      // Calculate progress from 0 to 1 over duration
      const elapsed = this.time - this.startTime;
      const progress = Math.min(elapsed / this.config.duration, 1.0);

      progressUniform.value = progress;
    }
  }

  reset(): void {
    this.time = 0;
    this.startTime = 0;
    this.hasStarted = false;
    const progressUniform = this.uniforms.get('uProgress');
    if (progressUniform) progressUniform.value = 0;
  }
}
