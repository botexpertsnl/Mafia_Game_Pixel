import Phaser from 'phaser';
import type { DialogueNode } from '../data/dialogues';

export type ZoneAction = 'dialogue' | 'heistBoard' | 'travel' | 'warehouse';

export class InteractableZone extends Phaser.GameObjects.Zone {
  public readonly id: string;
  public readonly prompt: string;
  public readonly dialogue?: DialogueNode;
  public readonly radius: number;
  public readonly action: ZoneAction;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number, radius: number, prompt: string, action: ZoneAction, dialogue?: DialogueNode) {
    super(scene, x, y, radius * 2, radius * 2);
    this.id = id;
    this.prompt = prompt;
    this.action = action;
    this.dialogue = dialogue;
    this.radius = radius;
    scene.add.existing(this);
  }
}
