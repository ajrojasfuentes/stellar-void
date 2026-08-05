import type { Particle } from "@tsparticles/engine";
import type { PathEngine } from "./BasePath";

export class ParabolicPath implements PathEngine {
  init(particle: Particle, pData: any) {
    pData.baseVx = particle.velocity.x;
    pData.baseVy = particle.velocity.y;
    
    const speed = Math.hypot(pData.baseVx, pData.baseVy) || 1;
    
    // Choose a perpendicular direction for the "gravity" pull
    const sign = Math.random() > 0.5 ? 1 : -1;
    const perpX = -pData.baseVy * sign;
    const perpY = pData.baseVx * sign;
    
    // Normalize and scale to a small constant acceleration for a wide arc
    const nx = perpX / speed;
    const ny = perpY / speed;
    
    // Gravity strength (0.001 to 0.003 pixels per frame squared)
    const g = Math.random() * 0.002 + 0.001;
    pData.gravityX = nx * g;
    pData.gravityY = ny * g;
    
    pData.trajectory = "parabolic";
  }

  update(particle: Particle, pData: any) {
    // A constant directional acceleration naturally forms a perfect parabola!
    particle.velocity.x += pData.gravityX;
    particle.velocity.y += pData.gravityY;
  }
}
