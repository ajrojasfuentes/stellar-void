import type { Particle } from "@tsparticles/engine";

export interface PathEngine {
  init(particle: Particle, pData: any): void;
  update(particle: Particle, pData: any): void;
}
