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
    lines: [
      'If your glass is full, your mouth should stay empty.',
      'Men from the port ask too many questions tonight.',
      'Come back when you can pay in folded bills.'
    ]
  },
  mechanic: {
    id: 'mechanic',
    name: 'Rina (Mechanic)',
    lines: [
      'Engines tell the truth. People do not.',
      'Airport road is quiet, but the tires there are never clean.'
    ]
  },
  elder: {
    id: 'elder',
    name: 'Nonno Vieri',
    lines: [
      'This village remembers every debt.',
      'Keep your head down near the square after dusk.'
    ]
  },
  vendor: {
    id: 'vendor',
    name: 'Lucia (Vendor)',
    lines: [
      'Fresh figs, old rumors, same price.',
      'Warehouse boys buy bread at midnight. Strange appetite.'
    ]
  },
  church: {
    id: 'church',
    name: 'Sister Bianca',
    lines: [
      'Even saints lock their doors in this town.',
      'Light a candle if your conscience starts speaking.'
    ]
  },
  dock: {
    id: 'dock',
    name: 'Pietro (Dock Worker)',
    lines: [
      'Crates in, crates out. Nobody asks what is inside.',
      'Fog covers sins better than priests do.'
    ]
  },
  tough: {
    id: 'tough',
    name: 'Marco "Knuckles"',
    lines: [
      'You walk like you got ambition. Careful with that.',
      'Big city men are sniffing around the airport again.'
    ]
  },
  informant: {
    id: 'informant',
    name: 'Nico (Street Kid)',
    lines: [
      'I hear everything from alley windows.',
      'You got coins? I got names.'
    ]
  },
  warehouse: {
    id: 'warehouse',
    name: 'Enzo (Warehouse Worker)',
    lines: [
      'Manifest says olives. Weight says otherwise.',
      'Boss says no visitors until paperwork gets... quieter.'
    ]
  },
  gatekeeper: {
    id: 'gatekeeper',
    name: 'Airport Gatekeeper',
    lines: [
      'Runway is closed to civilians. Orders from above.',
      'Maybe one day you will have the right surname.'
    ]
  }
};

export const poiDialogues: Record<string, DialogueNode> = {
  tavernDoor: {
    id: 'tavernDoor',
    name: 'Tavern Door',
    lines: ['Warm light spills from inside. Laughter, then sudden silence.']
  },
  churchDoor: {
    id: 'churchDoor',
    name: 'Church Entrance',
    lines: ['The bells are quiet. Even the pigeons seem cautious here.']
  },
  garageDoor: {
    id: 'garageDoor',
    name: 'Garage Shutter',
    lines: ['Oil stains, fresh tracks, and a lock that looks expensive.']
  },
  warehouseGate: {
    id: 'warehouseGate',
    name: 'Warehouse Gate',
    lines: ['A heavy gate blocks the yard. A camera pivots and stops.']
  },
  dockEdge: {
    id: 'dockEdge',
    name: 'Dockside',
    lines: ['Salt air, ropes, and crates marked with fading export stamps.']
  },
  airportFence: {
    id: 'airportFence',
    name: 'Airport Checkpoint',
    lines: ['Beyond the fence: hangars, security lights, and future trouble.']
  }
};
