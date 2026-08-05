import type { Particle } from "@tsparticles/engine";
import type { PathEngine } from "./BasePath";

export class SinusoidalPath implements PathEngine {
  init(particle: Particle, pData: any) {
    pData.baseVx = particle.velocity.x;
    pData.baseVy = particle.velocity.y;
    
    const speed = Math.hypot(pData.baseVx, pData.baseVy) || 1;
    pData.baseSpeed = speed; 
    
    pData.perpX = -pData.baseVy / speed;
    pData.perpY = pData.baseVx / speed;
    
    // Frequency and amplitude (amplitude is directly a visual radius in pixels)
    pData.sinFreq = Math.random() * 0.05 + 0.03; // Orbit frequency
    pData.sinAmp = Math.random() * 80 + 60; // Amplitude (orbital radius) from 60px to 140px
    
    pData.time = 0;
    pData.trajectory = "sinusoidal";
  }

  update(particle: Particle, pData: any) {
    pData.time += pData.sinFreq;
    
    // The visual offset of the sine wave
    const waveOffset = Math.sin(pData.time) * pData.sinAmp;
    
    pData.visOffsetX = pData.perpX * waveOffset;
    pData.visOffsetY = pData.perpY * waveOffset;
    
    // Keep the physics velocity perfectly straight so the axis remains fixed
    particle.velocity.x = pData.baseVx;
    particle.velocity.y = pData.baseVy;
  }
}
