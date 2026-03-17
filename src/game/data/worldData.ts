export const TILE_SIZE = 16;

export const MAP_WIDTH = 70;
export const MAP_HEIGHT = 50;
export const PHILLY_WIDTH = 86;
export const PHILLY_HEIGHT = 56;

export const spawnPoint = { x: 10 * TILE_SIZE, y: 12 * TILE_SIZE };
export const phillySpawnPoint = { x: 8 * TILE_SIZE, y: 10 * TILE_SIZE };

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
  for (let x = 4; x < 65; x += 4) { layer[19][x] = 6; layer[24][x + 1] = 6; }
  for (let y = 10; y < 43; y += 5) { layer[y][23] = 7; layer[y][28] = 7; }
  for (let x = 34; x < 43; x += 2) layer[14][x] = 8;
  layer[30][10] = 9; layer[29][11] = 9; layer[33][57] = 10; layer[34][58] = 10; layer[26][52] = 11; layer[40][13] = 12;
  return layer;
};

export const createBuildingLayer = (): number[][] => {
  const layer = Array.from({ length: MAP_HEIGHT }, () => Array.from({ length: MAP_WIDTH }, () => -1));
  const fillRect = (x0: number, y0: number, w: number, h: number, tile: number) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) layer[y][x] = tile; };
  fillRect(7, 12, 8, 6, 13); fillRect(17, 9, 10, 8, 14); fillRect(31, 10, 9, 7, 15); fillRect(45, 15, 8, 7, 16); fillRect(50, 30, 10, 8, 17); fillRect(56, 5, 10, 6, 18); fillRect(6, 33, 12, 7, 19);
  return layer;
};

export const createCollisionLayer = (): number[][] => {
  const layer = Array.from({ length: MAP_HEIGHT }, () => Array.from({ length: MAP_WIDTH }, () => -1));
  const blockRect = (x0: number, y0: number, w: number, h: number) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) layer[y][x] = 1; };
  blockRect(7, 12, 8, 6); blockRect(17, 9, 10, 8); blockRect(31, 10, 9, 7); blockRect(45, 15, 8, 7); blockRect(50, 30, 10, 8); blockRect(56, 5, 10, 6); blockRect(6, 33, 12, 7);
  for (let y = 39; y < MAP_HEIGHT; y++) for (let x = 0; x < MAP_WIDTH; x++) layer[y][x] = 1;
  for (let y = 8; y < MAP_HEIGHT; y++) for (let x = 65; x < MAP_WIDTH; x++) layer[y][x] = 1;
  return layer;
};

export const createPhillyGroundLayer = (): number[][] => Array.from({ length: PHILLY_HEIGHT }, (_, y) =>
  Array.from({ length: PHILLY_WIDTH }, (_, x) => {
    if (y > 44) return 4;
    if (x > 64 && y < 16) return 2;
    if (x > 60 && y > 14) return 3;
    if ((x > 8 && x < 54 && y > 8 && y < 42) || (x > 30 && x < 78 && y > 20 && y < 50)) return 1;
    return 0;
  })
);

export const createPhillyRoadLayer = (): number[][] => Array.from({ length: PHILLY_HEIGHT }, (_, y) =>
  Array.from({ length: PHILLY_WIDTH }, (_, x) => {
    if ((y > 23 && y < 28 && x > 2 && x < 83) || (x > 40 && x < 46 && y > 4 && y < 53)) return 5;
    if (x > 18 && x < 24 && y > 12 && y < 48) return 5;
    if (x > 65 && x < 71 && y > 12 && y < 52) return 5;
    return -1;
  })
);

export const createPhillyDecorationLayer = (): number[][] => {
  const layer = Array.from({ length: PHILLY_HEIGHT }, () => Array.from({ length: PHILLY_WIDTH }, () => -1));
  for (let x = 6; x < 80; x += 5) { layer[22][x] = 6; layer[28][x + 1] = 7; }
  for (let y = 8; y < 51; y += 4) { layer[y][39] = 8; layer[y][46] = 9; }
  for (let y = 16; y < 50; y += 6) { layer[y][66] = 10; layer[y][21] = 11; }
  layer[40][72] = 12; layer[41][73] = 8; layer[17][12] = 10;
  return layer;
};

export const createPhillyBuildingLayer = (): number[][] => {
  const layer = Array.from({ length: PHILLY_HEIGHT }, () => Array.from({ length: PHILLY_WIDTH }, () => -1));
  const fillRect = (x0: number, y0: number, w: number, h: number, tile: number) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) layer[y][x] = tile; };
  fillRect(6, 6, 13, 7, 18); // airport
  fillRect(24, 8, 12, 9, 17); // warehouse
  fillRect(50, 7, 12, 8, 16); // hotel
  fillRect(12, 31, 12, 9, 15); // diner
  fillRect(52, 31, 13, 10, 17); // dock warehouse
  fillRect(67, 20, 14, 11, 14); // nightclub
  fillRect(32, 42, 16, 10, 19); // industrial block
  return layer;
};

export const createPhillyCollisionLayer = (): number[][] => {
  const layer = Array.from({ length: PHILLY_HEIGHT }, () => Array.from({ length: PHILLY_WIDTH }, () => -1));
  const blockRect = (x0: number, y0: number, w: number, h: number) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) layer[y][x] = 1; };
  blockRect(6, 6, 13, 7); blockRect(24, 8, 12, 9); blockRect(50, 7, 12, 8); blockRect(12, 31, 12, 9); blockRect(52, 31, 13, 10); blockRect(67, 20, 14, 11); blockRect(32, 42, 16, 10);
  for (let y = 45; y < PHILLY_HEIGHT; y++) for (let x = 0; x < PHILLY_WIDTH; x++) layer[y][x] = 1;
  return layer;
};
