import Phaser from 'phaser';
import { gameConfig } from './game/config/gameConfig';
import { AudioSystem } from './game/systems/AudioSystem';
import { SettingsStore } from './game/systems/SettingsStore';

const game = new Phaser.Game(gameConfig);

const audioSystem = new AudioSystem();
audioSystem.setSettings(SettingsStore.load());
game.registry.set('audioSystem', audioSystem);

window.addEventListener('beforeunload', () => {
  SettingsStore.save(audioSystem.getSettings());
});
