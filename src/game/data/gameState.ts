export interface InventoryState { [drugId: string]: number }

export interface SaveState {
  money: number;
  xp: number;
  currentCity: 'village' | 'philadelphia';
  inventory: InventoryState;
  warehouseStorage: InventoryState;
  baseCapacity: number;
  ownedWarehouses: string[];
  lastLocation: string;
  heistsCompleted: number;
  heistsFailed: number;
  dealsSuccess: number;
  dealsFailed: number;
  totalTravel: number;
}

export const DEFAULT_SAVE: SaveState = {
  money: 900,
  xp: 0,
  currentCity: 'village',
  inventory: {},
  warehouseStorage: {},
  baseCapacity: 30,
  ownedWarehouses: [],
  lastLocation: 'Old Italian Village',
  heistsCompleted: 0,
  heistsFailed: 0,
  dealsSuccess: 0,
  dealsFailed: 0,
  totalTravel: 0,
};
