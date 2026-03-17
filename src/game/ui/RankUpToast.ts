import Phaser from 'phaser';

export class RankUpToast {
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(scene.scale.width / 2, 40, '', {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffe6b8', stroke: '#000', strokeThickness: 4,
      backgroundColor: '#3c2518', padding: { x: 10, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(990).setVisible(false);
  }

  show(scene: Phaser.Scene, rankName: string): void {
    this.text.setText(`RANK UP! ${rankName}`).setVisible(true).setScale(0.8).setAlpha(1);
    scene.tweens.add({ targets: this.text, scale: 1, duration: 180, ease: 'Back.Out' });
    scene.tweens.add({ targets: this.text, alpha: 0, delay: 1700, duration: 600, onComplete: () => this.text.setVisible(false) });
  }
}
