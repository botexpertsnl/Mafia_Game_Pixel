import Phaser from 'phaser';

export interface HudModel {
  money: number;
  rank: string;
  xp: number;
  xpProgress: number;
  nextRankLabel: string;
  location: string;
  inventorySummary: string;
}

const moneyFormat = new Intl.NumberFormat('en-US');

export class Hud {
  private moneyText: Phaser.GameObjects.Text;
  private rankText: Phaser.GameObjects.Text;
  private xpText: Phaser.GameObjects.Text;
  private locationText: Phaser.GameObjects.Text;
  private inventoryText: Phaser.GameObjects.Text;
  private interactionText: Phaser.GameObjects.Text;
  private xpFill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(8, 8, 300, 100, 0x1f1712, 0.82).setOrigin(0).setStrokeStyle(2, 0xc29b62);
    this.moneyText = scene.add.text(16, 14, '', { color: '#f5e8d0', fontSize: '12px', fontFamily: 'monospace' });
    this.rankText = scene.add.text(16, 30, '', { color: '#f5e8d0', fontSize: '12px', fontFamily: 'monospace' });
    this.xpText = scene.add.text(16, 46, '', { color: '#d8c4a6', fontSize: '11px', fontFamily: 'monospace' });
    scene.add.rectangle(16, 65, 180, 10, 0x2d251f).setOrigin(0);
    this.xpFill = scene.add.rectangle(16, 65, 2, 10, 0xd8a45b).setOrigin(0);
    this.locationText = scene.add.text(16, 80, '', { color: '#bfa98a', fontSize: '11px', fontFamily: 'monospace' });
    this.inventoryText = scene.add.text(205, 65, '', { color: '#edd2a4', fontSize: '11px', fontFamily: 'monospace' });

    this.interactionText = scene.add.text(scene.scale.width / 2, scene.scale.height - 50, '', {
      color: '#ffe6b8', fontSize: '13px', fontFamily: 'monospace', backgroundColor: '#2e2016', padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setVisible(false).setStroke('#000000', 2);

    scene.add.container(0, 0, [bg, this.moneyText, this.rankText, this.xpText, this.xpFill, this.locationText, this.inventoryText]).setScrollFactor(0).setDepth(800);
    this.interactionText.setScrollFactor(0).setDepth(810);
  }

  setModel(model: HudModel): void {
    this.moneyText.setText(`₤ ${moneyFormat.format(model.money)}`);
    this.rankText.setText(`Rank: ${model.rank}`);
    this.xpText.setText(`XP ${model.xp} → ${model.nextRankLabel}`);
    this.locationText.setText(model.location);
    this.inventoryText.setText(model.inventorySummary);
    this.xpFill.width = Math.max(2, Math.floor(180 * model.xpProgress));
  }

  setInteraction(prompt?: string): void {
    if (!prompt) return this.interactionText.setVisible(false);
    this.interactionText.setText(prompt).setVisible(true);
  }
}
