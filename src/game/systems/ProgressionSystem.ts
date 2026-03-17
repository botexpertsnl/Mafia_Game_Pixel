import { DRUGS } from '../data/drugs';
import { DEFAULT_SAVE, type SaveState } from '../data/gameState';
import { HEISTS, type HeistDef } from '../data/heists';
import { getNextRank, getRankByXp, RANKS } from '../data/ranks';

export interface HeistResult {
  success: boolean;
  moneyDelta: number;
  xpDelta: number;
  flavor: string;
}

export class ProgressionSystem {
  private state: SaveState = { ...DEFAULT_SAVE };

  hydrate(save: SaveState): void {
    this.state = { ...save };
  }

  getState(): SaveState {
    return structuredClone(this.state);
  }

  getRank() {
    return getRankByXp(this.state.xp);
  }

  getRankProgress(): number {
    const current = getRankByXp(this.state.xp);
    const next = getNextRank(this.state.xp);
    if (!next) return 1;
    const span = next.xpRequired - current.xpRequired;
    return (this.state.xp - current.xpRequired) / span;
  }

  getAvailableHeists(): HeistDef[] {
    const rank = this.getRank().index;
    return HEISTS.filter((h) => h.requiredRank <= rank + 1);
  }

  getHeistChance(heist: HeistDef): number {
    const rankAdvantage = (this.getRank().index - heist.requiredRank) * 0.04;
    return Math.max(0.25, Math.min(0.95, heist.baseSuccessRate + rankAdvantage));
  }

  runHeist(heistId: string): { result: HeistResult; rankUp?: string } {
    const heist = HEISTS.find((h) => h.id === heistId);
    if (!heist) throw new Error('Unknown heist');

    const preRank = this.getRank().name;
    const chance = this.getHeistChance(heist);
    const roll = Math.random();
    let result: HeistResult;

    if (roll <= chance) {
      const moneyGain = Math.floor(heist.rewardMin + Math.random() * (heist.rewardMax - heist.rewardMin));
      this.state.money += moneyGain;
      this.state.xp += heist.xpReward;
      result = {
        success: true,
        moneyDelta: moneyGain,
        xpDelta: heist.xpReward,
        flavor: 'The job was clean. Nobody saw your face.',
      };
    } else {
      const penalty = Math.min(this.state.money, heist.failurePenalty);
      this.state.money -= penalty;
      const xpDelta = Math.floor(heist.xpReward * 0.35);
      this.state.xp += xpDelta;
      result = {
        success: false,
        moneyDelta: -penalty,
        xpDelta,
        flavor: 'Sirens, panic, and a painful buyout to stay out of a cell.',
      };
    }

    const newRank = this.getRank().name;
    return { result, rankUp: preRank !== newRank ? newRank : undefined };
  }

  getInventoryUsed(): number {
    return DRUGS.reduce((sum, d) => sum + (this.state.inventory[d.id] || 0) * d.size, 0);
  }

  getInventoryFree(): number {
    return this.state.inventoryCapacity - this.getInventoryUsed();
  }

  buyDrug(drugId: string, qty: number): { ok: boolean; reason?: string } {
    const drug = DRUGS.find((d) => d.id === drugId);
    if (!drug) return { ok: false, reason: 'Unknown product' };
    if (qty <= 0) return { ok: false, reason: 'Invalid quantity' };
    const totalCost = drug.baseBuyPrice * qty;
    const capacityNeed = drug.size * qty;
    if (this.state.money < totalCost) return { ok: false, reason: 'Not enough cash' };
    if (this.getInventoryFree() < capacityNeed) return { ok: false, reason: 'Not enough stash space' };
    this.state.money -= totalCost;
    this.state.inventory[drug.id] = (this.state.inventory[drug.id] || 0) + qty;
    this.state.xp += Math.floor(qty * 2);
    return { ok: true };
  }

  sellDrug(drugId: string, qty: number): { ok: boolean; reason?: string } {
    const drug = DRUGS.find((d) => d.id === drugId);
    if (!drug) return { ok: false, reason: 'Unknown product' };
    if (qty <= 0) return { ok: false, reason: 'Invalid quantity' };
    const owned = this.state.inventory[drug.id] || 0;
    if (owned < qty) return { ok: false, reason: 'Not enough stock' };
    this.state.inventory[drug.id] = owned - qty;
    if (this.state.inventory[drug.id] <= 0) delete this.state.inventory[drug.id];
    this.state.money += drug.baseSellPrice * qty;
    this.state.xp += Math.floor(qty * 3);
    return { ok: true };
  }

  getRankList() {
    return RANKS;
  }
}
