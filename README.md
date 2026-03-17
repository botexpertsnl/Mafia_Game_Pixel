# Omertà: Village Shadows (Phase 1)

A browser-based top-down pixel art mafia RPG prototype built with **Phaser + TypeScript**.

## Phase 1 scope
This prototype focuses on a premium-feel foundation:
- Smooth top-down movement (WASD + arrows) with normalized diagonals
- Camera follow, deadzone, and map bounds
- Handcrafted tile-based old Italian village map with districts and props
- Collision with buildings/blocked spaces
- 10 interactable NPCs with unique dialogue
- Interactable points of interest (bar, church, garage, warehouse, docks, airport checkpoint)
- Reusable interaction + dialogue systems
- HUD foundation (money, XP, rank, location)
- Pause/settings shell
- Title screen with polished buttons and transitions
- Audio foundation (music loop, footsteps, UI click, dialogue advance)

## Tech
- Phaser 3
- TypeScript
- Vite
- No backend (local-only runtime)

## Project structure

```txt
src/
  main.ts
  game/
    config/
    scenes/
    entities/
    systems/
    ui/
    data/
    audio/
    utils/
public/
  assets/
    sprites/
    tilesets/
    maps/
    ui/
    audio/
      music/
      sfx/
```

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Deploy later to Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Use default build command: `npm run build`.
4. Use output directory: `dist`.
5. Deploy.

Vercel works out-of-the-box with this Vite setup.
