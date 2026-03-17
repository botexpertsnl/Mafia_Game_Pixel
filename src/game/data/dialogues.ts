import type { RankDef } from './ranks';

export type DialogueLine = string;

export interface DialogueNode {
  id: string;
  name: string;
  lines: DialogueLine[];
}

export const npcDialogues: Record<string, DialogueNode> = {
  bartender: {
    id: 'bartender',
    name: 'Salvatore (Bartender)',
    lines: ['If your glass is full, your mouth should stay empty.', 'You earn a name in this town one quiet night at a time.']
  },
  mechanic: {
    id: 'mechanic',
    name: 'Rina (Mechanic)',
    lines: ['Engines tell the truth. People do not.', 'Bring me money and I can make anything vanish on wheels.']
  },
  elder: {
    id: 'elder',
    name: 'Nonno Vieri',
    lines: ['This village remembers every debt.', 'Your shoes are cleaner than your reputation... for now.']
  },
  vendor: {
    id: 'vendor',
    name: 'Lucia (Vendor)',
    lines: ['Fresh figs, old rumors, same price.', 'Warehouse boys buy bread at midnight. Strange appetite.']
  },
  church: {
    id: 'church',
    name: 'Sister Bianca',
    lines: ['Even saints lock their doors in this town.', 'Pray if you must, but pay what you owe first.']
  },
  dock: {
    id: 'dock',
    name: 'Pietro (Dock Worker)',
    lines: ['Crates in, crates out. Nobody asks what is inside.', 'Bigger cuts go to men with rank. Keep climbing.']
  },
  tough: {
    id: 'tough',
    name: 'Marco "Knuckles"',
    lines: ['You walk like you got ambition. Careful with that.', 'Jobs on engines are posted near the parked vans.']
  },
  informant: {
    id: 'informant',
    name: 'Nico (Street Kid)',
    lines: ['I hear everything from alley windows.', 'Dealer at the market moves product if your cash is honest.']
  },
  warehouse: {
    id: 'warehouse',
    name: 'Enzo (Warehouse Worker)',
    lines: ['Manifest says olives. Weight says otherwise.', 'When you reach Crewman, gates open for better work.']
  },
  gatekeeper: {
    id: 'gatekeeper',
    name: 'Airport Gatekeeper',
    lines: ['Runway is closed to civilians. Orders from above.', 'No flights for you. Not yet.']
  },
  dealer: {
    id: 'dealer',
    name: 'Giada (Dealer)',
    lines: ['Cash first. Questions never.', 'If your stash is full, buy smarter or sell faster.']
  }
};

export const poiDialogues: Record<string, DialogueNode> = {
  tavernDoor: { id: 'tavernDoor', name: 'Tavern Door', lines: ['Warm light spills from inside. Laughter, then sudden silence.'] },
  churchDoor: { id: 'churchDoor', name: 'Church Entrance', lines: ['The bells are quiet. Even the pigeons seem cautious here.'] },
  garageDoor: { id: 'garageDoor', name: 'Garage Shutter', lines: ['Oil stains, fresh tracks, and a lock that looks expensive.'] },
  warehouseGate: { id: 'warehouseGate', name: 'Warehouse Gate', lines: ['A heavy gate blocks the yard. A camera pivots and stops.'] },
  dockEdge: { id: 'dockEdge', name: 'Dockside', lines: ['Salt air, ropes, and crates marked with fading export stamps.'] },
  airportFence: { id: 'airportFence', name: 'Airport Checkpoint', lines: ['Beyond the fence: hangars, security lights, and future trouble.'] }
};

export const getRankReactiveLine = (rank: RankDef): DialogueNode => ({
  id: 'rankReactive',
  name: 'Whispered Rumor',
  lines: [rank.index <= 2 ? 'Still a small fish. Keep grinding little jobs.' : `Word is you're ${rank.name}. Bigger eyes are watching now.`]
});
