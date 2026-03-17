import Phaser from 'phaser';

export class TravelMenu {
  private panel: Phaser.GameObjects.Container;
  private visible = false;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, 420, 220, 0x120d0b, 0.95).setStrokeStyle(3, 0xb98d50);
    const t = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 70, 'Airport Transfer', { fontFamily: 'monospace', fontSize: '22px', color: '#f3ddb5' }).setOrigin(0.5);
    const b = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, 'Press ENTER to board flight\nPress ESC to cancel', { fontFamily: 'monospace', fontSize: '13px', color: '#dcc5a0', align: 'center' }).setOrigin(0.5);
    this.panel = scene.add.container(0, 0, [bg, t, b]).setDepth(985).setScrollFactor(0).setVisible(false);
  }

  open(): void { this.visible = true; this.panel.setVisible(true); }
  close(): void { this.visible = false; this.panel.setVisible(false); }
  isOpen(): boolean { return this.visible; }
}
