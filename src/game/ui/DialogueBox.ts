import Phaser from 'phaser';

export class DialogueBox {
  private panel: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const width = scene.scale.width - 40;
    const y = scene.scale.height - 140;
    const box = scene.add.rectangle(20, y, width, 120, 0x1a110d, 0.9).setOrigin(0).setStrokeStyle(3, 0xb98b4d);
    this.nameText = scene.add.text(30, y + 10, '', { color: '#f6d9a8', fontSize: '14px', fontFamily: 'monospace' });
    this.bodyText = scene.add.text(30, y + 36, '', {
      color: '#fff2d4',
      fontSize: '13px',
      fontFamily: 'monospace',
      wordWrap: { width: width - 20 },
      lineSpacing: 4,
    });
    const hint = scene.add.text(width - 70, y + 96, '[E/Click]', { color: '#d2b689', fontSize: '12px', fontFamily: 'monospace' });

    this.panel = scene.add.container(0, 0, [box, this.nameText, this.bodyText, hint]).setScrollFactor(0).setDepth(900).setVisible(false);
  }

  show(name: string, line: string): void {
    this.panel.setVisible(true);
    this.nameText.setText(name);
    this.bodyText.setText(line);
  }

  hide(): void {
    this.panel.setVisible(false);
  }
}
