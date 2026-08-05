import type { Particle } from "@tsparticles/engine";
import { Aliens } from "./Aliens";

export class Invader extends Aliens {
  constructor(basePath: string) {
    super("invader", `${basePath}/invader.webp`, 0.65);
  }

  override initKinematics(particle: Particle, pData: any) {
    super.initKinematics(particle, pData);
    pData.rotationAngle = 0;
  }
}
