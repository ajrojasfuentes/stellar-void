import type { Particle } from "@tsparticles/engine";
import { Aliens } from "./Aliens";

export class Ufo1 extends Aliens {
  constructor(basePath: string) {
    super("ufo-1", `${basePath}/ufo-1.webp`, 0.8);
  }

  override initKinematics(particle: Particle, pData: any) {
    super.initKinematics(particle, pData);
    pData.rotationAngle = 0;
  }
}
