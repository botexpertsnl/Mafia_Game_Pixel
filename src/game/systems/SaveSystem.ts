import { DEFAULT_SAVE, type SaveState } from '../data/gameState';

const SAVE_KEY = 'mafia_phase2_save';

export class SaveSystem {
  static hasSave(): boolean {
    return !!localStorage.getItem(SAVE_KEY);
  }

  static load(): SaveState {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...DEFAULT_SAVE };
      return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_SAVE };
    }
  }

  static save(state: SaveState): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  static reset(): void {
    localStorage.removeItem(SAVE_KEY);
  }
}
