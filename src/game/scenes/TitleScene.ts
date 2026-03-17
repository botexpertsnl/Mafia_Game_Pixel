import Phaser from 'phaser';
import type { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { SettingsStore } from '../systems/SettingsStore';

export class TitleScene extends Phaser.Scene {
  private audioSystem!: AudioSystem;

  constructor() { super('title'); }

  create(): void {
    this.audioSystem = this.registry.get('audioSystem');
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const hasSave = SaveSystem.hasSave();
    this.add.rectangle(0, 0, width, height, 0x1a120d).setOrigin(0);
    const haze = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.7, 0x5a3a22, 0.25);
    this.tweens.add({ targets: haze, alpha: { from: 0.18, to: 0.35 }, duration: 2800, yoyo: true, repeat: -1 });

    this.add.text(width / 2, 100, 'OMERTÀ\nVILLAGE SHADOWS', {
      fontFamily: 'monospace', fontSize: '44px', color: '#f1d6a1', align: 'center', lineSpacing: 10, stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);

    const makeButton = (label: string, y: number, onClick?: () => void) => {
      const btn = this.add.rectangle(width / 2, y, 280, 48, 0x2b1d14).setStrokeStyle(2, 0xaf8650).setInteractive({ useHandCursor: true });
      this.add.text(width / 2, y, label, { fontFamily: 'monospace', fontSize: '18px', color: '#f4e4c7' }).setOrigin(0.5);
      btn.on('pointerover', () => btn.setFillStyle(0x3a281a));
      btn.on('pointerout', () => btn.setFillStyle(0x2b1d14));
      btn.on('pointerdown', () => {
        this.audioSystem.resume();
        this.audioSystem.playUIClick();
        onClick?.();
      });
    };

    makeButton('New Game', 280, () => {
      SaveSystem.reset();
      this.startGame();
    });
    makeButton(hasSave ? 'Continue' : 'Continue (No Save)', 340, () => hasSave && this.startGame());
    makeButton('Toggle Mute', 400, () => {
      const settings = SettingsStore.load();
      settings.muted = !settings.muted;
      SettingsStore.save(settings);
      this.audioSystem.setSettings(settings);
    });
    makeButton('Reset Save', 460, () => SaveSystem.reset());

    this.add.text(width / 2, height - 44, 'Phase 2: heists, rank progression, drug market, local saves', {
      fontFamily: 'monospace', fontSize: '12px', color: '#c1a884'
    }).setOrigin(0.5);

    this.audioSystem.resume();
    this.audioSystem.startVillageLoop();
  }

  private startGame(): void {
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.time.delayedCall(360, () => this.scene.start('village'));
  }
}
