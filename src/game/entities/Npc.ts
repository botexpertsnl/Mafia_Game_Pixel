import Phaser from 'phaser';
import type { DialogueNode } from '../data/dialogues';

export class Npc extends Phaser.Physics.Arcade.Sprite {
  public dialogue: DialogueNode;
  public promptText: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: number,
    dialogue: DialogueNode,
    promptText = 'Talk'
  ) {
    super(scene, x, y, texture, frame);
    this.dialogue = dialogue;
    this.promptText = promptText;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setSize(10, 12).setOffset(3, 4);
  }

  idle(): void {
    if (Math.random() < 0.004) {
      const frame = Phaser.Math.Between(0, 2);
      this.setFrame(frame);
    }
  }
}
