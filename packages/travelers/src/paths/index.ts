import { StraightPath } from "./StraightPath";
import { ParabolicPath } from "./ParabolicPath";
import { SinusoidalPath } from "./SinusoidalPath";
import type { PathEngine } from "./BasePath";

export const PathEngineFactory = {
  create(type: "straight" | "parabolic" | "sinusoidal"): PathEngine {
    switch (type) {
      case "parabolic": return new ParabolicPath();
      case "sinusoidal": return new SinusoidalPath();
      case "straight": 
      default:
        return new StraightPath();
    }
  }
};

export type { PathEngine };
