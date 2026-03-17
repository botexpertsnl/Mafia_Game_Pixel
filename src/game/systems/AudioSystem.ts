export interface AudioSettings {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}

export class AudioSystem {
  private ctx: AudioContext;
  private settings: AudioSettings = { musicVolume: 0.3, sfxVolume: 0.5, muted: false };
  private villageInterval?: number;

  constructor() {
    this.ctx = new AudioContext();
  }

  resume(): void {
    if (this.ctx.state !== 'running') void this.ctx.resume();
  }

  setSettings(next: Partial<AudioSettings>): AudioSettings {
    this.settings = { ...this.settings, ...next };
    return this.settings;
  }

  getSettings(): AudioSettings {
    return this.settings;
  }

  startVillageLoop(): void {
    this.stopVillageLoop();
    const progression = [196, 220, 174, 164, 146, 164, 196, 130.8];
    let beat = 0;
    this.villageInterval = window.setInterval(() => {
      this.playTone(progression[beat % progression.length], 0.9, 'triangle', 0.08, this.settings.musicVolume);
      this.playTone(progression[(beat + 2) % progression.length] / 2, 1.1, 'sine', 0.08, this.settings.musicVolume * 0.7);
      beat++;
    }, 740);
  }

  stopVillageLoop(): void {
    if (this.villageInterval) window.clearInterval(this.villageInterval);
  }

  playFootstep(): void {
    this.playNoise(0.05, this.settings.sfxVolume * 0.2);
  }

  playUIClick(): void {
    this.playTone(620, 0.05, 'square', 0.02, this.settings.sfxVolume * 0.7);
  }

  playDialogueAdvance(): void {
    this.playTone(460, 0.07, 'triangle', 0.02, this.settings.sfxVolume * 0.5);
  }

  private playTone(freq: number, duration: number, type: OscillatorType, attack: number, volume: number): void {
    if (this.settings.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private playNoise(duration: number, volume: number): void {
    if (this.settings.muted) return;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.connect(filter).connect(gain).connect(this.ctx.destination);
    src.start();
  }
}
