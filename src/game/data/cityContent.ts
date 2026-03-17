import { npcDialogues, poiDialogues } from './dialogues';

export type CityId = 'village' | 'philadelphia';

export interface NpcSpawnDef {
  x: number; y: number; texture: string; dialogueKey: keyof typeof npcDialogues; prompt: string; action: 'dialogue' | 'dealer';
}

export interface ZoneSpawnDef {
  id: string;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: 'dialogue' | 'heistBoard' | 'travel' | 'warehouse';
  dialogueKey?: keyof typeof poiDialogues;
}

export const CITY_CONTENT: Record<CityId, { location: string; npcs: NpcSpawnDef[]; zones: ZoneSpawnDef[]; cityBonus: number }> = {
  village: {
    location: 'Old Italian Village',
    cityBonus: 0,
    npcs: [
      { x: 11, y: 18, texture: 'npcA', dialogueKey: 'bartender', prompt: 'talk to bartender', action: 'dialogue' },
      { x: 47, y: 22, texture: 'npcB', dialogueKey: 'mechanic', prompt: 'talk to mechanic', action: 'dialogue' },
      { x: 21, y: 18, texture: 'npcB', dialogueKey: 'elder', prompt: 'talk to elder', action: 'dialogue' },
      { x: 35, y: 18, texture: 'npcC', dialogueKey: 'vendor', prompt: 'browse wares', action: 'dialogue' },
      { x: 22, y: 11, texture: 'npcB', dialogueKey: 'church', prompt: 'speak softly', action: 'dialogue' },
      { x: 12, y: 36, texture: 'npcA', dialogueKey: 'dock', prompt: 'talk at docks', action: 'dialogue' },
      { x: 27, y: 25, texture: 'npcA', dialogueKey: 'tough', prompt: 'size him up', action: 'dialogue' },
      { x: 14, y: 27, texture: 'npcC', dialogueKey: 'informant', prompt: 'hear whispers', action: 'dialogue' },
      { x: 53, y: 38, texture: 'npcB', dialogueKey: 'warehouse', prompt: 'talk at warehouse', action: 'dialogue' },
      { x: 60, y: 14, texture: 'npcC', dialogueKey: 'gatekeeper', prompt: 'approach checkpoint', action: 'dialogue' },
      { x: 38, y: 20, texture: 'npcA', dialogueKey: 'dealer', prompt: 'open market', action: 'dealer' },
    ],
    zones: [
      { id: 'bar', x: 10, y: 17, radius: 26, prompt: 'enter tavern', action: 'dialogue', dialogueKey: 'tavernDoor' },
      { id: 'church', x: 20, y: 16, radius: 28, prompt: 'inspect church', action: 'dialogue', dialogueKey: 'churchDoor' },
      { id: 'garage', x: 48, y: 22, radius: 26, prompt: 'inspect garage', action: 'dialogue', dialogueKey: 'garageDoor' },
      { id: 'warehouse', x: 54, y: 38, radius: 30, prompt: 'warehouse operations', action: 'warehouse', dialogueKey: 'warehouseGate' },
      { id: 'dock', x: 10, y: 40, radius: 26, prompt: 'inspect dockside', action: 'dialogue', dialogueKey: 'dockEdge' },
      { id: 'airport', x: 60, y: 11, radius: 28, prompt: 'airport transfer', action: 'travel', dialogueKey: 'airportFence' },
      { id: 'heist_van_1', x: 31, y: 23, radius: 24, prompt: 'check parked van jobs', action: 'heistBoard' },
      { id: 'heist_scooter_2', x: 14, y: 25, radius: 24, prompt: 'check scooter relay jobs', action: 'heistBoard' },
    ],
  },
  philadelphia: {
    location: 'Philadelphia',
    cityBonus: 0.12,
    npcs: [
      { x: 14, y: 13, texture: 'npcB', dialogueKey: 'gatekeeper', prompt: 'talk to pilot', action: 'dialogue' },
      { x: 28, y: 18, texture: 'npcA', dialogueKey: 'warehouse', prompt: 'ask warehouse contact', action: 'dialogue' },
      { x: 56, y: 15, texture: 'npcC', dialogueKey: 'bartender', prompt: 'talk to fixer', action: 'dialogue' },
      { x: 17, y: 35, texture: 'npcB', dialogueKey: 'vendor', prompt: 'visit diner runner', action: 'dialogue' },
      { x: 73, y: 26, texture: 'npcA', dialogueKey: 'tough', prompt: 'talk to club owner', action: 'dialogue' },
      { x: 62, y: 35, texture: 'npcA', dialogueKey: 'dealer', prompt: 'open philly market', action: 'dealer' },
      { x: 45, y: 47, texture: 'npcC', dialogueKey: 'mechanic', prompt: 'talk to rail mechanic', action: 'dialogue' },
      { x: 70, y: 34, texture: 'npcB', dialogueKey: 'dock', prompt: 'talk to dock foreman', action: 'dialogue' },
      { x: 35, y: 26, texture: 'npcC', dialogueKey: 'informant', prompt: 'hear city rumors', action: 'dialogue' },
      { x: 76, y: 24, texture: 'npcA', dialogueKey: 'elder', prompt: 'meet upper contact', action: 'dialogue' },
    ],
    zones: [
      { id: 'airport', x: 12, y: 10, radius: 30, prompt: 'board return flight', action: 'travel' },
      { id: 'warehouse', x: 28, y: 16, radius: 30, prompt: 'warehouse operations', action: 'warehouse' },
      { id: 'dock_warehouse', x: 58, y: 40, radius: 30, prompt: 'warehouse operations', action: 'warehouse' },
      { id: 'heist_freight', x: 43, y: 27, radius: 24, prompt: 'scan freight raid board', action: 'heistBoard' },
      { id: 'heist_nightclub', x: 72, y: 30, radius: 24, prompt: 'scan nightclub opportunities', action: 'heistBoard' },
      { id: 'hotel', x: 56, y: 16, radius: 22, prompt: 'inspect hotel frontage', action: 'dialogue', dialogueKey: 'tavernDoor' },
    ],
  },
};
