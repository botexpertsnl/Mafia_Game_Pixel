export interface AudioSettings { musicVolume: number; sfxVolume: number; muted: boolean }

export class AudioSystem {
  private ctx: AudioContext;
  private settings: AudioSettings = { musicVolume: 0.3, sfxVolume: 0.5, muted: false };
  private loopHandle?: number;

  constructor() { this.ctx = new AudioContext(); }
  resume(): void { if (this.ctx.state !== 'running') void this.ctx.resume(); }
  setSettings(next: Partial<AudioSettings>): AudioSettings { this.settings = { ...this.settings, ...next }; return this.settings; }
  getSettings(): AudioSettings { return this.settings; }

  startCityLoop(city: 'village' | 'philadelphia'): void {
    this.stopLoop();
    const prog = city === 'village' ? [196, 220, 174, 164, 146, 164, 196, 130.8] : [164, 130.8, 146, 155, 174, 138.5, 164, 123.5];
    let beat = 0;
    this.loopHandle = window.setInterval(() => {
      this.playTone(prog[beat % prog.length], 0.82, city === 'village' ? 'triangle' : 'sawtooth', 0.05, this.settings.musicVolume);
      this.playTone(prog[(beat + 2) % prog.length] / 2, 1.0, 'sine', 0.05, this.settings.musicVolume * (city === 'village' ? 0.65 : 0.5));
      beat++;
    }, city === 'village' ? 740 : 620);
  }

  stopLoop(): void { if (this.loopHandle) window.clearInterval(this.loopHandle); }

  playFootstep(): void { this.playNoise(0.05, this.settings.sfxVolume * 0.2); }
  playUIClick(): void { this.playTone(620, 0.05, 'square', 0.02, this.settings.sfxVolume * 0.7); }
  playDialogueAdvance(): void { this.playTone(460, 0.07, 'triangle', 0.02, this.settings.sfxVolume * 0.5); }
  playMenuOpen(): void { this.playTone(410, 0.08, 'triangle', 0.01, this.settings.sfxVolume * 0.5); }
  playConfirm(): void { this.playTone(740, 0.1, 'square', 0.01, this.settings.sfxVolume * 0.6); }
  playSuccessSting(): void { this.playTone(680, 0.12, 'triangle', 0.02, this.settings.sfxVolume * 0.6); this.playTone(920, 0.18, 'sine', 0.02, this.settings.sfxVolume * 0.5); }
  playFailureSting(): void { this.playTone(210, 0.16, 'sawtooth', 0.01, this.settings.sfxVolume * 0.5); }
  playRankUp(): void { this.playTone(520, 0.1, 'triangle', 0.02, this.settings.sfxVolume * 0.5); this.playTone(740, 0.16, 'triangle', 0.02, this.settings.sfxVolume * 0.55); }
  playTrade(): void { this.playTone(560, 0.07, 'square', 0.01, this.settings.sfxVolume * 0.45); }
  playTravel(): void { this.playTone(320, 0.2, 'sine', 0.03, this.settings.sfxVolume * 0.5); this.playTone(540, 0.24, 'triangle', 0.04, this.settings.sfxVolume * 0.45); }
  playWarehouse(): void { this.playTone(280, 0.08, 'square', 0.01, this.settings.sfxVolume * 0.45); }
  playIndustrialAmbient(pan = 0): void { this.playNoise(0.08, this.settings.sfxVolume * (0.08 + Math.abs(pan) * 0.04), pan); }

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

  private playNoise(duration: number, volume: number, pan = 0): void {
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
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    src.connect(filter).connect(gain).connect(panner).connect(this.ctx.destination);
    src.start();
  }
}
