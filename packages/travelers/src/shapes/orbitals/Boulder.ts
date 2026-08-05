import type { Particle } from "@tsparticles/engine";
import { Orbitals } from "./Orbitals";

export class Boulder extends Orbitals {
  constructor(basePath: string) {
    super("boulder", `${basePath}/boulder.webp`, 1.2);
  }
}
