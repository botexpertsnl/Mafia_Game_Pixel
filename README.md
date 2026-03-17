# Omertà: Village Shadows (Phase 3 MVP)

A browser-based top-down pixel mafia RPG built with **Phaser + TypeScript**.

## Phase 3 Highlights
- Two distinct playable cities:
  - **Old Italian Village** (warm, intimate, early progression)
  - **Philadelphia** (industrial, dense, higher-risk opportunities)
- Airport **travel unlock at Rank 6 (Soldier)** with transition flow.
- Expanded heists with city-specific ladders and scaling risk/reward.
- Expanded drug empire loop with full ladder:
  - weed, hash, pills, amphetamines, heroin, crack, cocaine
- Deal attempt system (probabilistic outcomes, confiscation/fines on failure).
- Warehouse progression across both cities with purchasable storage tiers.
- Save system expanded to include city, warehouses, storage, and progression stats.
- Enhanced audio layering with city-specific music loops and extra gameplay SFX.

## Core Loop
1. Explore city districts and interact with NPCs/boards
2. Run heists for cash + XP
3. Buy product, run deals, manage risk
4. Acquire warehouses to expand total storage
5. Unlock travel, move into Philadelphia for bigger opportunities
6. Climb from **Nobody** to **Godfather**

## Rank Ladder
1. Nobody
2. Street Rat
3. Runner
4. Earner
5. Crewman
6. Soldier
7. Capo
8. Underboss
9. Boss
10. Godfather

## Controls
- Move: `WASD` / Arrow keys
- Interact / advance dialogue: `E`
- Pause/settings shell: `P` or `Esc`
- Heist menu: `↑/↓`, `Enter`, `Esc`
- Drug market: `↑/↓`, `B` buy, `S` sell, `D` deal, `Esc`
- Warehouse menu: `↑/↓` warehouse, `←/→` drug, `B` buy warehouse, `T` store, `R` retrieve
- Pause quick settings: `M/N` music -/+, `B/S` sfx -/+, `E` save, `Enter` reset

## Balance/Data Location
Key balancing and progression data are centralized in:
- `src/game/data/ranks.ts`
- `src/game/data/heists.ts`
- `src/game/data/drugs.ts`
- `src/game/data/warehouses.ts`
- `src/game/data/cityContent.ts`
- `src/game/data/gameState.ts`

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

## Preview build
```bash
npm run preview
```

## Deploy to Vercel
1. Push repository to GitHub
2. Import project in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

Vercel works directly with this Vite setup.
