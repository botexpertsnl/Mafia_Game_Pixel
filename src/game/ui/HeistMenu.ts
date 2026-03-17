import Phaser from 'phaser';
import type { HeistDef } from '../data/heists';

export class HeistMenu {
  private panel: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Text;
  private visible = false;
  private selected = 0;
  private heists: HeistDef[] = [];
  private onChoose?: (id: string) => void;

  constructor(private scene: Phaser.Scene) {
    const w = scene.scale.width - 120;
    const h = scene.scale.height - 180;
    const bg = scene.add.rectangle(60, 80, w, h, 0x18120e, 0.96).setOrigin(0).setStrokeStyle(3, 0xba8f55);
    const title = scene.add.text(78, 94, 'Vehicle Heist Board', { fontFamily: 'monospace', fontSize: '20px', color: '#f3ddb6' });
    this.body = scene.add.text(78, 128, '', { fontFamily: 'monospace', fontSize: '12px', color: '#e8d2af', lineSpacing: 4, wordWrap: { width: w - 36 } });
    const hint = scene.add.text(78, 80 + h - 32, '↑/↓ Select  •  Enter Confirm  •  Esc Close', { fontFamily: 'monospace', fontSize: '11px', color: '#bfa98a' });
    this.panel = scene.add.container(0, 0, [bg, title, this.body, hint]).setScrollFactor(0).setDepth(950).setVisible(false);
  }

  open(heists: HeistDef[], onChoose: (id: string) => void): void {
    this.heists = heists;
    this.onChoose = onChoose;
    this.selected = 0;
    this.visible = true;
    this.panel.setVisible(true);
    this.refresh();
  }

  close(): void {
    this.visible = false;
    this.panel.setVisible(false);
  }

  isOpen(): boolean { return this.visible; }

  move(delta: number): void {
    if (!this.visible) return;
    this.selected = Phaser.Math.Wrap(this.selected + delta, 0, this.heists.length);
    this.refresh();
  }

  confirm(): void {
    if (!this.visible || !this.heists[this.selected]) return;
    this.onChoose?.(this.heists[this.selected].id);
  }

  private refresh(): void {
    const rows = this.heists.map((h, i) => {
      const pointer = i === this.selected ? '▶' : ' ';
      return `${pointer} ${h.name} (${h.subtitle})\n   Rank ${h.requiredRank}+ | ${(h.baseSuccessRate * 100).toFixed(0)}% base | ₤${h.rewardMin}-${h.rewardMax} | XP ${h.xpReward}\n   Risk: -₤${h.failurePenalty}\n   ${h.description}`;
    });
    this.body.setText(rows.join('\n\n'));
  }
}
