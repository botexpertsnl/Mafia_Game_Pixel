import type { AudioSettings } from './AudioSystem';

const KEY = 'mafia_phase1_settings';

export class SettingsStore {
  static load(): AudioSettings {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { musicVolume: 0.3, sfxVolume: 0.5, muted: false };
      return { ...{ musicVolume: 0.3, sfxVolume: 0.5, muted: false }, ...JSON.parse(raw) };
    } catch {
      return { musicVolume: 0.3, sfxVolume: 0.5, muted: false };
    }
  }

  static save(settings: AudioSettings): void {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }
}
