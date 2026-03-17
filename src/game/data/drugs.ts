export interface DrugDef {
  id: string;
  name: string;
  baseBuyPrice: number;
  baseSellPrice: number;
  size: number;
}

export const DRUGS: DrugDef[] = [
  { id: 'weed', name: 'Weed', baseBuyPrice: 28, baseSellPrice: 24, size: 1 },
  { id: 'hash', name: 'Hash', baseBuyPrice: 45, baseSellPrice: 39, size: 1 },
  { id: 'pills', name: 'Pills', baseBuyPrice: 70, baseSellPrice: 60, size: 1 },
  { id: 'amphetamines', name: 'Amphetamines', baseBuyPrice: 120, baseSellPrice: 104, size: 1 },
  { id: 'cocaine', name: 'Cocaine', baseBuyPrice: 215, baseSellPrice: 186, size: 1 },
];
