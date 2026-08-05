import type { Particle } from "@tsparticles/engine";
import { SpriteEntity } from "../craft/SpriteEntity";

export abstract class Orbitals extends SpriteEntity {
  override initKinematics(particle: Particle, pData: any) {
    super.initKinematics(particle, pData);
    if (!pData.orbitalInit) {
      pData.orbitalInit = true;
      const speedMult = pData.configSpeedMultiplier ?? 1.4;
      particle.velocity.x *= speedMult;
      particle.velocity.y *= speedMult;
    }

    if (pData.rotationSpeed === undefined) {
      pData.rotationSpeed = pData.configRotationSpeed ?? (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.01 + 0.005);
    }
    if (pData.rotationAngle === undefined) {
      pData.rotationAngle = Math.random() * Math.PI * 2;
    }
  }

  protected override applyTransform(ctx: CanvasRenderingContext2D, particle: Particle, pData: any, radius: number) {
    // Add rotation speed to the angle every frame
    pData.rotationAngle += pData.rotationSpeed;
    ctx.rotate(pData.rotationAngle);
  }
}
