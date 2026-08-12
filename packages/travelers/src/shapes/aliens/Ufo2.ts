import type { Particle } from "@tsparticles/engine";
import { Aliens } from "./Aliens";

export class Ufo2 extends Aliens {
  constructor() {
    super("ufo-2", 0.7);
  }

  override initKinematics(particle: Particle, pData: any) {
    super.initKinematics(particle, pData);
    pData.rotationAngle = 0;
  }
}
