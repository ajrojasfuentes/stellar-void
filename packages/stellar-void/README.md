<div align="center">
  <h1>✨ Stellar Void ✨</h1>
  <p><strong>A highly customizable, high-performance, and modular space background for React.</strong></p>

  [![npm version](https://badge.fury.io/js/@ajrojasfuentes%2Fstellar-void.svg)](https://badge.fury.io/js/@ajrojasfuentes%2Fstellar-void)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-^19.2.8-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
</div>

<br />

**Stellar Void** is a robust, modular, and dynamic space environment background component for React applications. Built on top of `tsParticles`, it offers out-of-the-box high-performance rendering of interactive constellations, beautiful dynamic planets, and occasional space travelers (like comets, UFOs, and asteroids).

## 🚀 Features

- 🌌 **Zero Configuration Needed**: Works completely out-of-the-box.
- 🧩 **Extreme Modularity (Compound Components)**: Compose your own universe by rendering only the layers you need.
- ⚡ **Zero Network Dependencies**: All graphical assets (optimized WebP sprites) are embedded directly as base64 strings in the core package. No external network requests, no CDNs, and zero loading flickers.
- 🔋 **Performance & Battery Saver**: Respects user OS preferences (`prefers-reduced-motion`) and offers a dedicated `batterySaver` mode to cap framerates and disable heavy physics on low-end devices. Prevents memory leaks with an internal garbage collector and avoids "spawn bursts" when the browser tab is hidden.
- 🎨 **Deeply Customizable**: Tweak star counts, planetary speed, sizes, and traveler spawn probabilities.
- 🖱️ **Interactive**: Constellations react to user mouse movements (grab and repulse effects).
- 🛡️ **Fully Typed**: Built with TypeScript for excellent developer experience (DX) and comprehensive IDE autocompletion.

---

## 📦 Installation

Install the package via your preferred package manager. You will also need `react`, `react-dom` and optionally `tailwindcss` (if you rely on global Tailwind utility classes, though Stellar Void ships with its own CSS).

```bash
# npm
npm install @ajrojasfuentes/stellar-void

# yarn
yarn add @ajrojasfuentes/stellar-void

# pnpm
pnpm add @ajrojasfuentes/stellar-void
```

---

## 📖 Quick Start

The simplest way to use Stellar Void is to import the main `<StellarVoid />` component and place it at the root of your app or behind the specific layout you want to decorate.

It automatically mounts as a `fixed` background with a z-index of `0`.

```tsx
import React from 'react';
import { StellarVoid } from '@ajrojasfuentes/stellar-void';

// Important: Import the base styles
import '@ajrojasfuentes/stellar-void/dist/styles.css';

export default function App() {
  return (
    <main style={{ position: 'relative', zIndex: 10 }}>
      {/* Renders the complete universe (Background, Constellations, Planets, Travelers) */}
      <StellarVoid />
      
      <div className="content">
        <h1>Welcome to Deep Space</h1>
      </div>
    </main>
  );
}
```

---

## 🧱 Advanced Usage (Compound Components)

If you need finer control over what renders in your background, Stellar Void exposes its internal layers as **Compound Components**. When you provide children to `<StellarVoid>`, it will *only* render what you explicitly declare.

```tsx
import { StellarVoid } from '@ajrojasfuentes/stellar-void';
import '@ajrojasfuentes/stellar-void/dist/styles.css';

export default function CustomUniverse() {
  return (
    <StellarVoid batterySaver={true}>
      {/* 1. Deep space background with optional nebulae */}
      <StellarVoid.Background enableNebulae={true} />
      
      {/* 2. Interactive stars and constellations */}
      <StellarVoid.Constellations />
      
      {/* 3. Random planets orbiting or static */}
      {/* <StellarVoid.Planets /> -> Omitted because we don't want planets here! */}
      
      {/* 4. Comets, Asteroids and UFOs flying by */}
      <StellarVoid.Travelers />
    </StellarVoid>
  );
}
```

---

## ⚙️ Configuration & API Reference

Stellar Void can be fully customized by passing a `config` object to the main component. 

### `<StellarVoid />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `undefined` | Additional CSS classes applied to the root wrapper. |
| `enableNebulae` | `boolean` | `true` | If true, renders the animated nebulae in the background layer. |
| `batterySaver` | `boolean` | `false` | Caps framerate to 30 FPS across all layers for better performance on mobile or low-end devices. |
| `config` | `Partial<StellarVoidThemeConfig>`| `{}` | The configuration object to override default parameters. |

### TypeScript Autocompletion & Customization

The project is heavily typed. By importing `StellarVoidThemeConfig`, your IDE (like VSCode) will provide rich autocompletion and hover documentation for all available parameters.

```tsx
import type { StellarVoidThemeConfig } from '@ajrojasfuentes/core';

// Your IDE will suggest properties inside this object!
const myUniverseConfig: Partial<StellarVoidThemeConfig> = {
  constellations: {
    starsCount: 300,             // More stars!
    starsOpacity: { min: 0.1, max: 1 },
    starsSpeed: 0.3,
    interactivity: {
      repulseDistance: 200,      // Mouse repels stars further away
    }
  },
  planets: [
    // Define exactly what planets you want
    { id: "my-moon", type: "lunar", size: 40, opacity: { min: 0.8, max: 1 }, speed: { min: 0.2, max: 0.5 } }
  ],
  travelers: {
    spawnIntervalMin: 10000,     // Spawn a traveler every 10 to 30 seconds
    spawnIntervalMax: 30000,
    probabilities: {
      common: 0.5,
      uncommon: 0.3,
      rare: 0.2
    }
  }
};

export default function App() {
  return <StellarVoid config={myUniverseConfig} />;
}
```

#### Planet Types Supported
`"geoid" | "saturnian" | "gaseous" | "iceous" | "lunar" | "orbital"`

#### Traveler Types Supported
`"asteroid" | "meteor" | "comet" | "boulder" | "satellite" | "ufo-1" | "ufo-2" | "invader"`

---

## 🌍 Architecture & Performance 

One of the major performance optimizations in **Stellar Void** is its asset handling strategy.

Instead of relying on external Content Delivery Networks (CDNs) or forcing developers to copy heavy `public/` assets, all graphical textures (planets, moons, and asteroids) have been aggressively optimized to tiny `.webp` files (ranging from 800 bytes to 10 KB).

These ultra-light assets are **directly embedded as base64 data URIs** within the core package. When your users load your application, the sprites are instantly decoded and cached in memory using `createImageBitmap()`, completely eliminating network waterfalls, layout shifts, or flashes of unstyled content (FOUC).

Additionally, the internal `TravelerSpawner` utilizes an active Garbage Collector to destroy out-of-bounds particles, preserving memory, and checks `document.hidden` to pause spawning when the browser tab is not active, preventing CPU spikes.

---

## 🗺️ Roadmap & Future Features

We are actively maintaining and expanding Stellar Void. Here is a glimpse of what is coming next:

- [ ] **React Server Components (RSC) Support**: Optimization to ensure `<StellarVoid />` can be cleanly imported in Next.js 14+ App Router without `use client` wrapper issues.
- [ ] **Black Holes & Wormholes**: New `StellarVoid.Anomalies` layer to add gravitational lensing effects using WebGL.
- [ ] **Custom Base64 Sprite Injector**: API to allow developers to pass their own Base64 data URIs to be used as flying objects in the `Travelers` layer.
- [ ] **Parallax Scroll Effect**: Tying the particles' Y-axis movement to the window's scroll position for a deep 3D illusion.

---

## 🤝 Contributing

Contributions are always welcome! Stellar Void is structured as a Monorepo using NPM Workspaces.

1. Clone the repository.
2. Run `npm install` at the root.
3. Packages are separated inside `packages/`:
   - `@ajrojasfuentes/core`
   - `@ajrojasfuentes/background`
   - `@ajrojasfuentes/constellations`
   - `@ajrojasfuentes/planets`
   - `@ajrojasfuentes/travelers`
   - `@ajrojasfuentes/stellar-void` (Main facade)
4. Build all packages using `npm run build` from the root.
5. Create a PR with your changes!

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
