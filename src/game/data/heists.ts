export interface HeistDef {
  id: string;
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
  {
    id: 'pocket-lift',
    name: 'Festival Pocket Lift',
    subtitle: 'Quick hands in crowded streets',
    description: 'Work the central square crowd and disappear before bells ring.',
    requiredRank: 1,
    baseSuccessRate: 0.82,
    rewardMin: 70,
    rewardMax: 130,
    xpReward: 36,
    failurePenalty: 45,
  },
  {
    id: 'scooter-pull',
    name: 'Scooter Pull',
    subtitle: 'Night snatch near alley garages',
    description: 'Boost a parked scooter and fence it before sunrise.',
    requiredRank: 2,
    baseSuccessRate: 0.76,
    rewardMin: 120,
    rewardMax: 210,
    xpReward: 55,
    failurePenalty: 90,
  },
  {
    id: 'market-collection',
    name: 'Market Collection Run',
    subtitle: 'Cash pickup with attitude',
    description: 'Collect protection envelopes from late market stalls.',
    requiredRank: 3,
    baseSuccessRate: 0.71,
    rewardMin: 180,
    rewardMax: 320,
    xpReward: 75,
    failurePenalty: 140,
  },
  {
    id: 'black-crate',
    name: 'Black-Crate Pickup',
    subtitle: 'No paperwork, no witnesses',
    description: 'Grab a mislabeled crate at dockside before inspectors pass.',
    requiredRank: 4,
    baseSuccessRate: 0.66,
    rewardMin: 260,
    rewardMax: 430,
    xpReward: 95,
    failurePenalty: 190,
  },
  {
    id: 'warehouse-break',
    name: 'Warehouse Break-In',
    subtitle: 'Tin roofs and bad security',
    description: 'Slip past watchmen and crack a local storage lockup.',
    requiredRank: 5,
    baseSuccessRate: 0.61,
    rewardMin: 360,
    rewardMax: 620,
    xpReward: 125,
    failurePenalty: 270,
  },
  {
    id: 'truck-raid',
    name: 'Olive Truck Raid',
    subtitle: 'Hijack the route, keep it quiet',
    description: 'Intercept a “produce” truck carrying expensive side cargo.',
    requiredRank: 6,
    baseSuccessRate: 0.56,
    rewardMin: 500,
    rewardMax: 840,
    xpReward: 165,
    failurePenalty: 360,
  },
  {
    id: 'dock-intercept',
    name: 'Midnight Dock Intercept',
    subtitle: 'Professional risk, professional pay',
    description: 'Seize a protected shipment before it reaches the manifest office.',
    requiredRank: 7,
    baseSuccessRate: 0.5,
    rewardMin: 760,
    rewardMax: 1200,
    xpReward: 230,
    failurePenalty: 500,
  },
];
