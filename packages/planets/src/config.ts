import type { ISourceOptions } from "@tsparticles/engine";

export const planetsConfig: ISourceOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  detectRetina: true,
  interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
  emitters: [],
  particles: {
    number: {
      value: 0, 
    },
    shape: {
      type: "planet",
    },
    size: { value: { min: 15, max: 35 } },
    move: { 
      enable: true, 
      speed: { min: 0.1, max: 0.4 }, 
      random: true, 
      straight: false,
      outModes: { default: "bounce" } 
    },
    rotate: {
      value: { min: 0, max: 360 },
      animation: {
        enable: true,
        speed: 1, 
        sync: false
      }
    },
    collisions: {
      enable: true, 
      mode: "bounce"
    },
    links: { enable: false },
    opacity: { value: { min: 0.6, max: 0.9 } },
    zIndex: { value: -1 }
  }
};
