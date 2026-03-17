import Phaser from 'phaser';
import { DRUGS } from '../data/drugs';
import type { SaveState } from '../data/gameState';

export class DrugMarketMenu {
  private panel: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;
  private visible = false;
  private selected = 0;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(80, 90, scene.scale.width - 160, scene.scale.height - 200, 0x19130f, 0.95).setOrigin(0).setStrokeStyle(3, 0xb88b52);
    const title = scene.add.text(100, 104, 'Dealer Market', { fontFamily: 'monospace', fontSize: '20px', color: '#f2ddb6' });
    this.text = scene.add.text(100, 142, '', { fontFamily: 'monospace', fontSize: '12px', color: '#e5cca6', lineSpacing: 5, wordWrap: { width: scene.scale.width - 190 } });
    const hint = scene.add.text(100, scene.scale.height - 124, '↑/↓ select • B buy 1 • S sell 1 • Esc close', { fontFamily: 'monospace', fontSize: '11px', color: '#bda689' });
    this.panel = scene.add.container(0, 0, [bg, title, this.text, hint]).setDepth(960).setScrollFactor(0).setVisible(false);
  }

  open(): void { this.visible = true; this.panel.setVisible(true); }
  close(): void { this.visible = false; this.panel.setVisible(false); }
  isOpen(): boolean { return this.visible; }
  move(delta: number): void { this.selected = Phaser.Math.Wrap(this.selected + delta, 0, DRUGS.length); }
  getSelectedDrugId(): string { return DRUGS[this.selected].id; }

  render(state: SaveState): void {
    const used = DRUGS.reduce((sum, d) => sum + (state.inventory[d.id] || 0) * d.size, 0);
    const lines = DRUGS.map((d, i) => {
      const p = i === this.selected ? '▶' : ' ';
      return `${p} ${d.name.padEnd(12, ' ')} Buy ₤${d.baseBuyPrice.toString().padEnd(4, ' ')} Sell ₤${d.baseSellPrice.toString().padEnd(4, ' ')} Owned ${(state.inventory[d.id] || 0)}`;
    });
    this.text.setText(`Cash: ₤${state.money}   Stash: ${used}/${state.inventoryCapacity}\n\n${lines.join('\n')}`);
  }
}
