import type { ISourceOptions } from "@tsparticles/engine";

export const travelersConfig: ISourceOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  detectRetina: true,
  interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
  particles: {
    number: { value: 0 },
    links: { enable: false },
    shape: {
      type: "traveler",
      options: {
        traveler: [{ type: "asteroid" }]
      }
    },
    size: { value: { min: 12, max: 25 } }, 
    move: {
      enable: true,
      speed: { min: 0.5, max: 1.5 }, 
      direction: "right",
      outModes: { default: "none" },
    },
    zIndex: { value: 5 }
  }
};
