import Phaser from 'phaser';
import type { AudioSystem } from '../systems/AudioSystem';

export class TitleScene extends Phaser.Scene {
  private audioSystem!: AudioSystem;

  constructor() { super('title'); }

  create(): void {
    this.audioSystem = this.registry.get('audioSystem');
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const bg = this.add.rectangle(0, 0, width, height, 0x1a120d).setOrigin(0);
    const haze = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.7, 0x5a3a22, 0.25);
    this.tweens.add({ targets: haze, alpha: { from: 0.18, to: 0.35 }, duration: 2800, yoyo: true, repeat: -1 });

    this.add.text(width / 2, 100, 'OMERTÀ\nVILLAGE SHADOWS', {
      fontFamily: 'monospace', fontSize: '44px', color: '#f1d6a1', align: 'center', lineSpacing: 10,
      stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    const makeButton = (label: string, y: number, onClick?: () => void) => {
      const btn = this.add.rectangle(width / 2, y, 240, 48, 0x2b1d14).setStrokeStyle(2, 0xaf8650).setInteractive({ useHandCursor: true });
      const txt = this.add.text(width / 2, y, label, { fontFamily: 'monospace', fontSize: '18px', color: '#f4e4c7' }).setOrigin(0.5);
      btn.on('pointerover', () => btn.setFillStyle(0x3a281a));
      btn.on('pointerout', () => btn.setFillStyle(0x2b1d14));
      btn.on('pointerdown', () => {
        this.audioSystem.resume();
        this.audioSystem.playUIClick();
        onClick?.();
      });
      return [btn, txt];
    };

    makeButton('New Game', 290, () => {
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.time.delayedCall(360, () => this.scene.start('village'));
    });

    makeButton('Continue (No Save Yet)', 350);
    makeButton('Settings (Phase 1 Shell)', 410);

    this.add.text(width / 2, height - 44, 'A gritty pixel mafia tale in a forgotten coastal village', {
      fontFamily: 'monospace', fontSize: '12px', color: '#c1a884'
    }).setOrigin(0.5);

    this.audioSystem.resume();
    this.audioSystem.startVillageLoop();
  }
}
