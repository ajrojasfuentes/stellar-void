import type { Particle } from "@tsparticles/engine";
import { Aliens } from "./Aliens";

export class Ufo1 extends Aliens {
  constructor() {
    super("ufo-1", 0.8);
  }

  override initKinematics(particle: Particle, pData: any) {
    super.initKinematics(particle, pData);
    pData.rotationAngle = 0;
  }
}
