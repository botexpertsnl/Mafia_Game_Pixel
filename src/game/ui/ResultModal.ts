import Phaser from 'phaser';
import type { HeistResult } from '../systems/ProgressionSystem';

export class ResultModal {
  private panel: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;
  private visible = false;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, 460, 250, 0x140f0c, 0.95).setStrokeStyle(3, 0xc39a60);
    this.text = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '', {
      color: '#f4dfba', fontSize: '14px', fontFamily: 'monospace', align: 'center', lineSpacing: 8
    }).setOrigin(0.5);
    this.panel = scene.add.container(0, 0, [bg, this.text]).setDepth(980).setScrollFactor(0).setVisible(false);
  }

  show(result: HeistResult): void {
    this.visible = true;
    this.panel.setVisible(true);
    const title = result.success ? 'HEIST SUCCESS' : 'HEIST FAILED';
    this.text.setText(`${title}\n\nMoney: ${result.moneyDelta >= 0 ? '+' : ''}${result.moneyDelta}\nXP: +${result.xpDelta}\n\n${result.flavor}\n\n[Press E/Enter/Click]`);
  }

  hide(): void { this.visible = false; this.panel.setVisible(false); }
  isOpen(): boolean { return this.visible; }
}
