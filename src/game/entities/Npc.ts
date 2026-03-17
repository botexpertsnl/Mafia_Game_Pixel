import Phaser from 'phaser';
import type { DialogueNode } from '../data/dialogues';

export type NpcAction = 'dialogue' | 'dealer';

export class Npc extends Phaser.Physics.Arcade.Sprite {
  public dialogue: DialogueNode;
  public promptText: string;
  public action: NpcAction;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: number,
    dialogue: DialogueNode,
    promptText = 'Talk',
    action: NpcAction = 'dialogue',
  ) {
    super(scene, x, y, texture, frame);
    this.dialogue = dialogue;
    this.promptText = promptText;
    this.action = action;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setSize(10, 12).setOffset(3, 4);
  }

  idle(): void {
    if (Math.random() < 0.004) this.setFrame(Phaser.Math.Between(0, 2));
  }
}
