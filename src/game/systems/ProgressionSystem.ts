import { DRUGS, type DrugDef } from '../data/drugs';
import { DEFAULT_SAVE, type SaveState } from '../data/gameState';
import { HEISTS, type HeistDef } from '../data/heists';
import { getNextRank, getRankByXp, RANKS } from '../data/ranks';
import { WAREHOUSES, type WarehouseDef } from '../data/warehouses';

export interface HeistResult { success: boolean; moneyDelta: number; xpDelta: number; flavor: string }
export interface DealResult { success: boolean; profit: number; qty: number; confiscated: number; fine: number; flavor: string }

export class ProgressionSystem {
  private state: SaveState = { ...DEFAULT_SAVE };

  hydrate(save: SaveState): void { this.state = { ...DEFAULT_SAVE, ...save }; }
  getState(): SaveState { return structuredClone(this.state); }
  getRank() { return getRankByXp(this.state.xp); }
  getRankList() { return RANKS; }

  getRankProgress(): number {
    const current = getRankByXp(this.state.xp);
    const next = getNextRank(this.state.xp);
    if (!next) return 1;
    return (this.state.xp - current.xpRequired) / (next.xpRequired - current.xpRequired);
  }

  setCity(city: 'village' | 'philadelphia', location: string): void {
    this.state.currentCity = city;
    this.state.lastLocation = location;
    this.state.totalTravel += 1;
  }

  canTravel(): boolean { return this.getRank().index >= 6; }

  getAvailableHeists(city: 'village' | 'philadelphia'): HeistDef[] {
    const rank = this.getRank().index;
    return HEISTS.filter((h) => h.city === city && h.requiredRank <= rank + 1);
  }

  getHeistChance(heist: HeistDef): number {
    const rankAdvantage = (this.getRank().index - heist.requiredRank) * 0.04;
    return Math.max(0.23, Math.min(0.95, heist.baseSuccessRate + rankAdvantage));
  }

  runHeist(heistId: string): { result: HeistResult; rankUp?: string } {
    const heist = HEISTS.find((h) => h.id === heistId);
    if (!heist) throw new Error('Unknown heist');
    const preRank = this.getRank().name;
    const chance = this.getHeistChance(heist);
    const success = Math.random() <= chance;
    let result: HeistResult;

    if (success) {
      const moneyGain = Math.floor(heist.rewardMin + Math.random() * (heist.rewardMax - heist.rewardMin));
      this.state.money += moneyGain;
      this.state.xp += heist.xpReward;
      this.state.heistsCompleted += 1;
      result = { success: true, moneyDelta: moneyGain, xpDelta: heist.xpReward, flavor: 'Clean escape. Your name travels faster than the police report.' };
    } else {
      const penalty = Math.min(this.state.money, heist.failurePenalty);
      const xpDelta = Math.floor(heist.xpReward * 0.32);
      this.state.money -= penalty;
      this.state.xp += xpDelta;
      this.state.heistsFailed += 1;
      result = { success: false, moneyDelta: -penalty, xpDelta, flavor: 'Rough night. You paid to keep your freedom and your silence.' };
    }

    const newRank = this.getRank().name;
    return { result, rankUp: preRank !== newRank ? newRank : undefined };
  }

  getUnlockedDrugs(): DrugDef[] {
    const rank = this.getRank().index;
    return DRUGS.filter((d) => d.requiredRank <= rank);
  }

  getTotalCapacity(): number {
    return this.state.baseCapacity + this.getOwnedWarehouseDefs().reduce((sum, w) => sum + w.capacity, 0);
  }

  getInventoryUsed(): number {
    const all = [...DRUGS];
    return all.reduce((sum, d) => sum + ((this.state.inventory[d.id] || 0) + (this.state.warehouseStorage[d.id] || 0)) * d.size, 0);
  }

  getInventoryFree(): number { return this.getTotalCapacity() - this.getInventoryUsed(); }

  buyDrug(drugId: string, qty: number): { ok: boolean; reason?: string } {
    const drug = DRUGS.find((d) => d.id === drugId);
    if (!drug) return { ok: false, reason: 'Unknown product' };
    if (this.getRank().index < drug.requiredRank) return { ok: false, reason: 'Rank too low' };
    if (qty <= 0) return { ok: false, reason: 'Invalid quantity' };
    const totalCost = drug.baseBuyPrice * qty;
    if (this.state.money < totalCost) return { ok: false, reason: 'Not enough cash' };
    if (this.getInventoryFree() < drug.size * qty) return { ok: false, reason: 'Not enough storage' };
    this.state.money -= totalCost;
    this.state.inventory[drug.id] = (this.state.inventory[drug.id] || 0) + qty;
    this.state.xp += Math.floor(qty * 2.5);
    return { ok: true };
  }

  sellDrug(drugId: string, qty: number): { ok: boolean; reason?: string } {
    if (qty <= 0) return { ok: false, reason: 'Invalid quantity' };
    const owned = this.state.inventory[drugId] || 0;
    if (owned < qty) return { ok: false, reason: 'Not enough on-hand stock' };
    const drug = DRUGS.find((d) => d.id === drugId)!;
    this.state.inventory[drug.id] = owned - qty;
    if (this.state.inventory[drug.id] <= 0) delete this.state.inventory[drug.id];
    this.state.money += drug.baseSellPrice * qty;
    this.state.xp += Math.floor(qty * 3);
    return { ok: true };
  }

  attemptDeal(drugId: string, qty: number, cityBonus: number): DealResult {
    const drug = DRUGS.find((d) => d.id === drugId)!;
    const onHand = this.state.inventory[drugId] || 0;
    if (onHand < qty || qty <= 0) return { success: false, profit: 0, qty: 0, confiscated: 0, fine: 0, flavor: 'No stock ready for the deal.' };

    const rankFactor = this.getRank().index * 0.03;
    const sizeRisk = qty * 0.015;
    const chance = Math.max(0.18, Math.min(0.92, 0.78 - drug.risk - sizeRisk + rankFactor + cityBonus));
    const success = Math.random() <= chance;

    if (success) {
      const unitProfit = Math.floor((drug.baseSellPrice - drug.baseBuyPrice * 0.55) * (1.35 + cityBonus));
      const profit = Math.max(8, unitProfit) * qty;
      this.state.inventory[drugId] = onHand - qty;
      if (this.state.inventory[drugId] <= 0) delete this.state.inventory[drugId];
      this.state.money += profit;
      this.state.xp += Math.floor(qty * (5 + drug.risk * 8));
      this.state.dealsSuccess += 1;
      return { success: true, profit, qty, confiscated: 0, fine: 0, flavor: 'Deal closed. Cash changed hands before headlights passed.' };
    }

    const confiscated = Math.min(onHand, Math.max(1, Math.floor(qty * (0.4 + drug.risk))));
    const fine = Math.min(this.state.money, Math.floor(drug.baseBuyPrice * qty * (0.35 + drug.risk)));
    this.state.inventory[drugId] = onHand - confiscated;
    if (this.state.inventory[drugId] <= 0) delete this.state.inventory[drugId];
    this.state.money -= fine;
    this.state.xp += Math.floor(qty * 2);
    this.state.dealsFailed += 1;
    return { success: false, profit: 0, qty, confiscated, fine, flavor: 'Bad handoff. Product seized and a bribe kept your record clean.' };
  }

  getWarehousesByCity(city: 'village' | 'philadelphia'): WarehouseDef[] { return WAREHOUSES.filter((w) => w.city === city); }
  getOwnedWarehouseDefs(): WarehouseDef[] { return WAREHOUSES.filter((w) => this.state.ownedWarehouses.includes(w.id)); }

  buyWarehouse(id: string): { ok: boolean; reason?: string } {
    const warehouse = WAREHOUSES.find((w) => w.id === id);
    if (!warehouse) return { ok: false, reason: 'Unknown warehouse' };
    if (this.state.ownedWarehouses.includes(id)) return { ok: false, reason: 'Already owned' };
    if (this.getRank().index < warehouse.requiredRank) return { ok: false, reason: 'Rank too low' };
    if (this.state.money < warehouse.cost) return { ok: false, reason: 'Not enough cash' };
    this.state.money -= warehouse.cost;
    this.state.ownedWarehouses.push(id);
    this.state.xp += 35;
    return { ok: true };
  }

  moveToWarehouse(drugId: string, qty: number): { ok: boolean; reason?: string } {
    const held = this.state.inventory[drugId] || 0;
    if (held < qty) return { ok: false, reason: 'Not enough on-hand stock' };
    this.state.inventory[drugId] = held - qty;
    this.state.warehouseStorage[drugId] = (this.state.warehouseStorage[drugId] || 0) + qty;
    if (this.state.inventory[drugId] <= 0) delete this.state.inventory[drugId];
    return { ok: true };
  }

  moveFromWarehouse(drugId: string, qty: number): { ok: boolean; reason?: string } {
    const stored = this.state.warehouseStorage[drugId] || 0;
    if (stored < qty) return { ok: false, reason: 'Not enough warehouse stock' };
    this.state.warehouseStorage[drugId] = stored - qty;
    this.state.inventory[drugId] = (this.state.inventory[drugId] || 0) + qty;
    if (this.state.warehouseStorage[drugId] <= 0) delete this.state.warehouseStorage[drugId];
    return { ok: true };
  }
}
