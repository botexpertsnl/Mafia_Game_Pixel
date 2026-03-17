export interface HeistDef {
  id: string;
  city: 'village' | 'philadelphia';
  name: string;
  subtitle: string;
  description: string;
  requiredRank: number;
  baseSuccessRate: number;
  rewardMin: number;
  rewardMax: number;
  xpReward: number;
  failurePenalty: number;
}

export const HEISTS: HeistDef[] = [
  { id: 'pocket-lift', city: 'village', name: 'Festival Pocket Lift', subtitle: 'Quick hands in crowded streets', description: 'Work the central square crowd and disappear before bells ring.', requiredRank: 1, baseSuccessRate: 0.82, rewardMin: 70, rewardMax: 130, xpReward: 36, failurePenalty: 45 },
  { id: 'scooter-pull', city: 'village', name: 'Scooter Pull', subtitle: 'Night snatch near alley garages', description: 'Boost a parked scooter and fence it before sunrise.', requiredRank: 2, baseSuccessRate: 0.76, rewardMin: 120, rewardMax: 210, xpReward: 55, failurePenalty: 90 },
  { id: 'market-collection', city: 'village', name: 'Market Collection Run', subtitle: 'Cash pickup with attitude', description: 'Collect protection envelopes from late market stalls.', requiredRank: 3, baseSuccessRate: 0.71, rewardMin: 180, rewardMax: 320, xpReward: 75, failurePenalty: 140 },
  { id: 'black-crate', city: 'village', name: 'Black-Crate Pickup', subtitle: 'No paperwork, no witnesses', description: 'Grab a mislabeled crate at dockside before inspectors pass.', requiredRank: 4, baseSuccessRate: 0.66, rewardMin: 260, rewardMax: 430, xpReward: 95, failurePenalty: 190 },
  { id: 'warehouse-break', city: 'village', name: 'Warehouse Break-In', subtitle: 'Tin roofs and bad security', description: 'Slip past watchmen and crack a local storage lockup.', requiredRank: 5, baseSuccessRate: 0.61, rewardMin: 360, rewardMax: 620, xpReward: 125, failurePenalty: 270 },
  { id: 'philly-truck', city: 'philadelphia', name: 'Freight Truck Lift', subtitle: 'Rail-adjacent quick hit', description: 'Hijack a freight truck at the industrial ring road.', requiredRank: 6, baseSuccessRate: 0.58, rewardMin: 520, rewardMax: 880, xpReward: 170, failurePenalty: 380 },
  { id: 'nightclub-books', city: 'philadelphia', name: 'Nightclub Ledger Grab', subtitle: 'Neon, smoke, and leverage', description: 'Extract debt ledgers from a nightclub office.', requiredRank: 7, baseSuccessRate: 0.54, rewardMin: 780, rewardMax: 1240, xpReward: 235, failurePenalty: 520 },
  { id: 'dock-intercept', city: 'philadelphia', name: 'Midnight Dock Intercept', subtitle: 'Professional risk, professional pay', description: 'Seize a protected shipment before it reaches customs.', requiredRank: 8, baseSuccessRate: 0.49, rewardMin: 980, rewardMax: 1650, xpReward: 315, failurePenalty: 710 },
];
