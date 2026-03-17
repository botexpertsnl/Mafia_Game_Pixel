import Phaser from 'phaser';

export class PauseMenu {
  private panel: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    const back = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, 430, 250, 0x111111, 0.88).setStrokeStyle(2, 0xc69d64);
    const title = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 92, 'Paused / Settings', { color: '#f2ddba', fontSize: '24px', fontFamily: 'monospace' }).setOrigin(0.5);
    const shell = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 8, 'P / ESC: Resume\nE: Save game\nENTER: Reset save\nM/N: Music -/+\nB/S: SFX -/+', {
      color: '#dbc6a4', fontSize: '13px', fontFamily: 'monospace', align: 'center', lineSpacing: 4
    }).setOrigin(0.5);
    const hint = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 + 86, 'Phase 3 settings shell: persistent audio + save controls', { color: '#bfa98a', fontSize: '12px', fontFamily: 'monospace' }).setOrigin(0.5);
    this.panel = scene.add.container(0, 0, [back, title, shell, hint]).setScrollFactor(0).setDepth(1000).setVisible(false);
  }

  setVisible(v: boolean): void { this.panel.setVisible(v); }
}
