import type { Particle } from "@tsparticles/engine";
import { Orbitals } from "./Orbitals";

export class Boulder extends Orbitals {
  constructor() {
    super("boulder", 1.2);
  }
}
