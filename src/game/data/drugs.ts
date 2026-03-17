export interface DrugDef {
  id: string;
  name: string;
  baseBuyPrice: number;
  baseSellPrice: number;
  size: number;
  risk: number;
  requiredRank: number;
}

export const DRUGS: DrugDef[] = [
  { id: 'weed', name: 'Weed', baseBuyPrice: 28, baseSellPrice: 24, size: 1, risk: 0.12, requiredRank: 1 },
  { id: 'hash', name: 'Hash', baseBuyPrice: 45, baseSellPrice: 40, size: 1, risk: 0.18, requiredRank: 2 },
  { id: 'pills', name: 'Pills', baseBuyPrice: 72, baseSellPrice: 64, size: 1, risk: 0.24, requiredRank: 3 },
  { id: 'amphetamines', name: 'Amphetamines', baseBuyPrice: 124, baseSellPrice: 112, size: 1, risk: 0.34, requiredRank: 4 },
  { id: 'heroin', name: 'Heroin', baseBuyPrice: 182, baseSellPrice: 170, size: 1, risk: 0.44, requiredRank: 5 },
  { id: 'crack', name: 'Crack', baseBuyPrice: 236, baseSellPrice: 228, size: 1, risk: 0.5, requiredRank: 6 },
  { id: 'cocaine', name: 'Cocaine', baseBuyPrice: 320, baseSellPrice: 308, size: 1, risk: 0.58, requiredRank: 7 },
];
