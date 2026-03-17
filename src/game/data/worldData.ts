import type { DialogueNode } from './dialogues';

export interface SpawnPoint { x: number; y: number }
export interface InteractableDef {
  id: string;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  dialogue: DialogueNode;
}

export const TILE_SIZE = 16;
export const MAP_WIDTH = 70;
export const MAP_HEIGHT = 50;

export const spawnPoint: SpawnPoint = { x: 10 * TILE_SIZE, y: 12 * TILE_SIZE };

export const createGroundLayer = (): number[][] => Array.from({ length: MAP_HEIGHT }, (_, y) =>
  Array.from({ length: MAP_WIDTH }, (_, x) => {
    if (y > 38) return 4;
    if (x > 54 && y > 8) return 3;
    if ((x > 12 && x < 45 && y > 12 && y < 35) || (x > 3 && x < 18 && y > 8 && y < 30)) return 1;
    if (x > 47 && y < 12) return 2;
    return 0;
  })
);

export const createRoadLayer = (): number[][] => Array.from({ length: MAP_HEIGHT }, (_, y) =>
  Array.from({ length: MAP_WIDTH }, (_, x) => {
    if ((y > 20 && y < 24 && x > 2 && x < 66) || (x > 24 && x < 28 && y > 6 && y < 44)) return 5;
    if (x > 49 && x < 55 && y > 12 && y < 42) return 5;
    if (x > 7 && x < 14 && y > 24 && y < 45) return 5;
    return -1;
  })
);

export const createDecorationLayer = (): number[][] => {
  const layer = Array.from({ length: MAP_HEIGHT }, () => Array.from({ length: MAP_WIDTH }, () => -1));
  for (let x = 4; x < 65; x += 4) {
    layer[19][x] = 6;
    layer[24][x + 1] = 6;
  }
  for (let y = 10; y < 43; y += 5) {
    layer[y][23] = 7;
    layer[y][28] = 7;
  }
  for (let x = 34; x < 43; x += 2) {
    layer[14][x] = 8;
  }
  layer[30][10] = 9;
  layer[29][11] = 9;
  layer[33][57] = 10;
  layer[34][58] = 10;
  layer[26][52] = 11;
  layer[40][13] = 12;
  return layer;
};

export const createBuildingLayer = (): number[][] => {
  const layer = Array.from({ length: MAP_HEIGHT }, () => Array.from({ length: MAP_WIDTH }, () => -1));

  const fillRect = (x0: number, y0: number, w: number, h: number, tile: number) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) layer[y][x] = tile;
  };

  fillRect(7, 12, 8, 6, 13); // tavern
  fillRect(17, 9, 10, 8, 14); // church
  fillRect(31, 10, 9, 7, 15); // market row
  fillRect(45, 15, 8, 7, 16); // garage
  fillRect(50, 30, 10, 8, 17); // warehouse
  fillRect(56, 5, 10, 6, 18); // airport checkpoint
  fillRect(6, 33, 12, 7, 19); // dock office

  return layer;
};

export const createCollisionLayer = (): number[][] => {
  const layer = Array.from({ length: MAP_HEIGHT }, () => Array.from({ length: MAP_WIDTH }, () => -1));
  const blockRect = (x0: number, y0: number, w: number, h: number) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) layer[y][x] = 1;
  };

  blockRect(7, 12, 8, 6);
  blockRect(17, 9, 10, 8);
  blockRect(31, 10, 9, 7);
  blockRect(45, 15, 8, 7);
  blockRect(50, 30, 10, 8);
  blockRect(56, 5, 10, 6);
  blockRect(6, 33, 12, 7);

  for (let y = 39; y < MAP_HEIGHT; y++) for (let x = 0; x < MAP_WIDTH; x++) layer[y][x] = 1;
  for (let y = 8; y < MAP_HEIGHT; y++) for (let x = 65; x < MAP_WIDTH; x++) layer[y][x] = 1;

  return layer;
};
