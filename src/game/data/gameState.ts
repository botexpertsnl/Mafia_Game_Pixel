export interface InventoryState {
  [drugId: string]: number;
}

export interface SaveState {
  money: number;
  xp: number;
  inventory: InventoryState;
  inventoryCapacity: number;
  lastLocation: string;
}

export const DEFAULT_SAVE: SaveState = {
  money: 750,
  xp: 0,
  inventory: {},
  inventoryCapacity: 30,
  lastLocation: 'Old Italian Village',
};
