export interface WarehouseDef {
  id: string;
  city: 'village' | 'philadelphia';
  name: string;
  tier: number;
  cost: number;
  capacity: number;
  requiredRank: number;
}

export const WAREHOUSES: WarehouseDef[] = [
  { id: 'tiny-room', city: 'village', name: 'Tiny Hidden Room', tier: 1, cost: 1400, capacity: 25, requiredRank: 3 },
  { id: 'alley-lockup', city: 'village', name: 'Back-Alley Lockup', tier: 2, cost: 3200, capacity: 45, requiredRank: 4 },
  { id: 'dock-unit', city: 'village', name: 'Dock Storage Unit', tier: 3, cost: 6200, capacity: 70, requiredRank: 5 },
  { id: 'industrial-bay', city: 'philadelphia', name: 'Industrial Bay', tier: 4, cost: 12000, capacity: 120, requiredRank: 6 },
  { id: 'rail-yard-stack', city: 'philadelphia', name: 'Rail Yard Stackhouse', tier: 5, cost: 22000, capacity: 180, requiredRank: 7 },
  { id: 'riverfront-hub', city: 'philadelphia', name: 'Riverfront Distribution Hub', tier: 6, cost: 42000, capacity: 280, requiredRank: 8 },
];
