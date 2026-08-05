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
- ⚡ **Plug & Play Assets via CDN**: All heavy graphical assets (WebP sprites) are seamlessly streamed via the **jsDelivr CDN**, keeping your JavaScript bundle incredibly lightweight.
- 🎨 **Deeply Customizable**: Tweak star counts, planetary speed, sizes, and traveler spawn probabilities.
- 🖱️ **Interactive**: Constellations react to user mouse movements (grab and repulse effects).
- 🛡️ **Fully Typed**: Built with TypeScript for excellent developer experience (DX).

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
    <StellarVoid>
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
| `config` | `Partial<StellarVoidThemeConfig>`| `{}` | The configuration object to override default parameters. |
| `assetBasePath` | `string` | `DEFAULT_CDN_PATH` | Path from where to load `.webp` sprites. By default, relies on a global jsDelivr CDN link. |

### The `config` Object (`StellarVoidThemeConfig`)

You can override any specific piece of the configuration. Below is a subset of the available customizable properties:

```tsx
<StellarVoid 
  config={{
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
  }} 
/>
```

#### Planet Types Supported
`"geoid" | "saturnian" | "gaseous" | "iceous" | "lunar" | "binary" | "orbital"`

#### Traveler Types Supported
`"asteroid" | "meteor" | "comet" | "boulder" | "satellite" | "ufo-1" | "ufo-2" | "invader"`

---

## 🌍 Architecture & Asset Distribution (CDN)

One of the greatest features of **Stellar Void** is its Asset Distribution approach. High-quality WebP textures for planets, moons, and asteroids are relatively heavy.

Instead of bundling these images directly into your application (which would increase your Time-To-Interactive and bundle size), Stellar Void points its `assetBasePath` dynamically to **jsDelivr**, a reliable, free, and blazing-fast open-source CDN. 

When your users load your application, the sprites are streamed asynchronously and cached by the browser natively.

*If you prefer hosting the assets yourself, you can download the `/assets` folder from our repository, place it in your `public` folder, and pass `assetBasePath="/path/to/your/assets"`.*

---

## 🗺️ Roadmap & Future Features

We are actively maintaining and expanding Stellar Void. Here is a glimpse of what is coming next:

- [ ] **React Server Components (RSC) Support**: Optimization to ensure `<StellarVoid />` can be cleanly imported in Next.js 14+ App Router without `use client` wrapper issues.
- [ ] **Black Holes & Wormholes**: New `StellarVoid.Anomalies` layer to add gravitational lensing effects using WebGL.
- [ ] **Custom Traveler Injector**: API to allow developers to pass their own `.png`/`.webp` paths to be used as flying objects in the `Travelers` layer.
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
