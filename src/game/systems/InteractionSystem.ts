import Phaser from 'phaser';
import { InteractableZone } from '../entities/InteractableZone';
import { Npc } from '../entities/Npc';
import { Player } from '../entities/Player';
import type { DialogueNode } from '../data/dialogues';

export interface ActiveInteraction {
  prompt: string;
  dialogue: DialogueNode;
}

export class InteractionSystem {
  constructor(private player: Player, private npcs: Npc[], private zones: InteractableZone[]) {}

  getNearby(): ActiveInteraction | undefined {
    let best: ActiveInteraction | undefined;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const npc of this.npcs) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (d < 24 && d < minDistance) {
        minDistance = d;
        best = { prompt: `Press E to ${npc.promptText}`, dialogue: npc.dialogue };
      }
    }

    for (const zone of this.zones) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
      if (d < zone.radius && d < minDistance) {
        minDistance = d;
        best = { prompt: `Press E to ${zone.prompt}`, dialogue: zone.dialogue };
      }
    }

    return best;
  }
}
