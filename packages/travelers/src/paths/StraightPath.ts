import type { Particle } from "@tsparticles/engine";
import type { PathEngine } from "./BasePath";

export class StraightPath implements PathEngine {
  init(particle: Particle, pData: any) {
    pData.baseVx = particle.velocity.x;
    pData.baseVy = particle.velocity.y;
    pData.trajectory = "straight";
  }

  update(particle: Particle, pData: any) {
    // No velocity modification
  }
}
