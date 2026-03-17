import Phaser from 'phaser';
import type { DrugDef } from '../data/drugs';
import type { SaveState } from '../data/gameState';
import type { WarehouseDef } from '../data/warehouses';

export class WarehouseMenu {
  private panel: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;
  private visible = false;
  private selectedWarehouse = 0;
  private selectedDrug = 0;
  private warehouses: WarehouseDef[] = [];
  private drugs: DrugDef[] = [];

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(90, 80, scene.scale.width - 180, scene.scale.height - 160, 0x17110e, 0.95).setOrigin(0).setStrokeStyle(3, 0xbf9258);
    const title = scene.add.text(110, 94, 'Warehouse Operations', { fontFamily: 'monospace', fontSize: '20px', color: '#f0ddb8' });
    this.text = scene.add.text(110, 132, '', { fontFamily: 'monospace', fontSize: '12px', color: '#e5d2b2', lineSpacing: 4, wordWrap: { width: scene.scale.width - 230 } });
    const hint = scene.add.text(110, scene.scale.height - 108, '↑/↓ warehouse • ←/→ drug • B buy warehouse • T store 1 • R retrieve 1 • Esc close', { fontFamily: 'monospace', fontSize: '11px', color: '#bda98a' });
    this.panel = scene.add.container(0, 0, [bg, title, this.text, hint]).setDepth(965).setScrollFactor(0).setVisible(false);
  }

  open(warehouses: WarehouseDef[], drugs: DrugDef[]): void { this.warehouses = warehouses; this.drugs = drugs; this.visible = true; this.panel.setVisible(true); this.selectedWarehouse = 0; this.selectedDrug = 0; }
  close(): void { this.visible = false; this.panel.setVisible(false); }
  isOpen(): boolean { return this.visible; }
  moveWarehouse(delta: number): void { this.selectedWarehouse = Phaser.Math.Wrap(this.selectedWarehouse + delta, 0, Math.max(1, this.warehouses.length)); }
  moveDrug(delta: number): void { this.selectedDrug = Phaser.Math.Wrap(this.selectedDrug + delta, 0, Math.max(1, this.drugs.length)); }
  getWarehouseId(): string | undefined { return this.warehouses[this.selectedWarehouse]?.id; }
  getDrugId(): string | undefined { return this.drugs[this.selectedDrug]?.id; }

  render(state: SaveState): void {
    const whLines = this.warehouses.map((w, i) => `${i === this.selectedWarehouse ? '▶' : ' '} ${w.name} | Cost ₤${w.cost} | +${w.capacity} cap | Rank ${w.requiredRank}+ ${state.ownedWarehouses.includes(w.id) ? '[OWNED]' : ''}`);
    const drugLines = this.drugs.map((d, i) => `${i === this.selectedDrug ? '◆' : ' '} ${d.name}: Hand ${state.inventory[d.id] || 0}, Stored ${state.warehouseStorage[d.id] || 0}`);
    this.text.setText(`Cash ₤${state.money}\n\nWarehouses:\n${whLines.join('\n')}\n\nStock Move:\n${drugLines.join('\n')}`);
  }
}
