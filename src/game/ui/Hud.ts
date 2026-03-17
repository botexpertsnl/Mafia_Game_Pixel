import Phaser from 'phaser';

export class Hud {
  private container: Phaser.GameObjects.Container;
  private interactionText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(8, 8, 250, 70, 0x1f1712, 0.82).setOrigin(0).setStrokeStyle(2, 0xc29b62);
    const stats = scene.add.text(16, 14, '₤ 2,750\nXP 0\nRank: Nobody\nOld Italian Village', {
      color: '#f5e8d0',
      fontSize: '12px',
      fontFamily: 'monospace',
      lineSpacing: 3,
    });

    this.interactionText = scene.add.text(scene.scale.width / 2, scene.scale.height - 50, '', {
      color: '#ffe6b8',
      fontSize: '13px',
      fontFamily: 'monospace',
      backgroundColor: '#2e2016',
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setVisible(false).setStroke('#000000', 2);

    this.container = scene.add.container(0, 0, [bg, stats]).setScrollFactor(0).setDepth(800);
    this.interactionText.setScrollFactor(0).setDepth(810);
  }

  setInteraction(prompt?: string): void {
    if (!prompt) {
      this.interactionText.setVisible(false);
      return;
    }
    this.interactionText.setText(prompt).setVisible(true);
  }
}
