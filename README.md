# Omertà: Village Shadows (Phase 2)

Browser-based top-down pixel mafia RPG prototype built with **Phaser + TypeScript**.

## Phase 2 Added Gameplay Loop
- Explore the old Italian village
- Open heist boards at vehicle points
- Run heists with success/failure outcomes
- Earn/loss money and XP
- Progress through 10 mafia ranks
- Buy/sell drugs with stash capacity limits
- Save progression locally and continue later

## Implemented Systems
- **Rank progression** with exact ladder:
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
- **Heist system**: selectable jobs, rank gates, configurable rewards/chances/penalties.
- **Economy**: money earnings/spend/loss integrated with heists and drug trading.
- **Drug market**: dealer interaction, buy/sell actions, inventory quantities.
- **Inventory/stash**: used vs max capacity enforced.
- **Save system**: auto-save on meaningful progression, title continue/reset options.
- **UI expansion**: HUD money/rank/xp progress/location/stash, heist modal, result modal, drug market, rank-up toast.
- **Audio expansion**: menu open, confirm, success/failure stings, rank-up, trade feedback.

## Controls
- Move: `WASD` or Arrow keys
- Interact/advance: `E`
- Heist menu: `↑/↓` + `Enter`, `Esc` close
- Drug market: `↑/↓`, `B` buy, `S` sell, `Esc` close
- Pause: `P` or `Esc`
- Pause actions: `E` save, `Enter` reset save

## Tech
- Phaser 3
- TypeScript
- Vite
- No backend

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

## Deploy to Vercel later
1. Push to GitHub
2. Import repo in Vercel
3. Build command: `npm run build`
4. Output dir: `dist`
