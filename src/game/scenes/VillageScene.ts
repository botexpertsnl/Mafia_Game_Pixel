import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Npc } from '../entities/Npc';
import { InteractableZone } from '../entities/InteractableZone';
import { npcDialogues, poiDialogues } from '../data/dialogues';
import { createBuildingLayer, createCollisionLayer, createDecorationLayer, createGroundLayer, createRoadLayer, MAP_HEIGHT, MAP_WIDTH, spawnPoint, TILE_SIZE } from '../data/worldData';
import { InteractionSystem } from '../systems/InteractionSystem';
import { DialogueSystem } from '../systems/DialogueSystem';
import { Hud } from '../ui/Hud';
import { DialogueBox } from '../ui/DialogueBox';
import { PauseMenu } from '../ui/PauseMenu';
import type { AudioSystem } from '../systems/AudioSystem';

export class VillageScene extends Phaser.Scene {
  private player!: Player;
  private npcs: Npc[] = [];
  private zones: InteractableZone[] = [];
  private interactionSystem!: InteractionSystem;
  private dialogueSystem = new DialogueSystem();
  private hud!: Hud;
  private dialogueBox!: DialogueBox;
  private pauseMenu!: PauseMenu;
  private audioSystem!: AudioSystem;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private paused = false;
  private footstepCooldown = 0;

  constructor() { super('village'); }

  create(): void {
    this.audioSystem = this.registry.get('audioSystem');
    this.audioSystem.resume();

    const map = this.make.tilemap({ tileWidth: TILE_SIZE, tileHeight: TILE_SIZE, width: MAP_WIDTH, height: MAP_HEIGHT });
    const tiles = map.addTilesetImage('tiles', 'tiles', TILE_SIZE, TILE_SIZE, 0, 0);
    const ground = map.createLayer('ground', tiles!, createGroundLayer(), 0, 0)!;
    const roads = map.createLayer('roads', tiles!, createRoadLayer(), 0, 0)!;
    const buildings = map.createLayer('buildings', tiles!, createBuildingLayer(), 0, 0)!;
    const deco = map.createLayer('deco', tiles!, createDecorationLayer(), 0, 0)!;
    const collision = map.createLayer('collision', tiles!, createCollisionLayer(), 0, 0)!;
    collision.setVisible(false).setCollision(1);

    [ground, roads, buildings, deco].forEach((l) => l.setPipeline('Light2D'));

    this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    this.createAnimations();

    this.physics.add.collider(this.player, collision);

    this.spawnNpcs();
    this.spawnZones();

    this.interactionSystem = new InteractionSystem(this.player, this.npcs, this.zones);

    this.hud = new Hud(this);
    this.dialogueBox = new DialogueBox(this);
    this.pauseMenu = new PauseMenu(this);

    this.interactKey = this.input.keyboard!.addKey('E');
    this.pauseKey = this.input.keyboard!.addKey('ESC');

    this.input.on('pointerdown', () => {
      if (this.dialogueSystem.isActive()) this.advanceDialogue();
    });

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(40, 24);
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

    this.lights.enable().setAmbientColor(0x8f775d);
    this.lights.addLight(11 * TILE_SIZE, 20 * TILE_SIZE, 140, 0xf6bd74, 0.6);
    this.lights.addLight(53 * TILE_SIZE, 34 * TILE_SIZE, 140, 0xd9a66b, 0.55);

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  update(time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.paused = !this.paused;
      this.pauseMenu.setVisible(this.paused);
      this.audioSystem.playUIClick();
    }

    if (this.paused) return;

    this.npcs.forEach((npc) => npc.idle());

    if (!this.dialogueSystem.isActive()) {
      this.player.update();
      const nearby = this.interactionSystem.getNearby();
      this.hud.setInteraction(nearby?.prompt);

      if (nearby && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.audioSystem.playUIClick();
        this.dialogueSystem.start(nearby.dialogue);
        const current = this.dialogueSystem.getCurrent();
        if (current) this.dialogueBox.show(current.name, current.line);
      }

      const moving = this.player.body?.velocity.length() ?? 0;
      this.footstepCooldown -= delta;
      if (moving > 30 && this.footstepCooldown <= 0) {
        this.audioSystem.playFootstep();
        this.footstepCooldown = 220;
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.advanceDialogue();
    }

    if (time % 6000 < 20) {
      this.lights.addLight(Phaser.Math.Between(20, 1000), Phaser.Math.Between(20, 680), 70, 0xe1aa6a, 0.2);
    }
  }

  private advanceDialogue(): void {
    this.audioSystem.playDialogueAdvance();
    const result = this.dialogueSystem.advance();
    if (result.done) {
      this.dialogueBox.hide();
      return;
    }
    const current = this.dialogueSystem.getCurrent();
    if (current) this.dialogueBox.show(current.name, current.line);
  }

  private createAnimations(): void {
    const dirs: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
    dirs.forEach((dir) => {
      this.anims.create({ key: `player-idle-${dir}`, frames: [{ key: 'player', frame: 0 }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: `player-walk-${dir}`, frames: [{ key: 'player', frame: 0 }, { key: 'player', frame: 0 }], frameRate: 8, repeat: -1 });
    });
  }

  private spawnNpcs(): void {
    const defs: Array<[number, number, string, number, keyof typeof npcDialogues, string]> = [
      [11, 18, 'npcA', 0, 'bartender', 'talk to bartender'],
      [47, 22, 'npcB', 0, 'mechanic', 'talk to mechanic'],
      [21, 18, 'npcB', 0, 'elder', 'talk to elder'],
      [35, 18, 'npcC', 0, 'vendor', 'browse wares'],
      [22, 11, 'npcB', 0, 'church', 'speak softly'],
      [12, 36, 'npcA', 0, 'dock', 'talk at docks'],
      [27, 25, 'npcA', 0, 'tough', 'size him up'],
      [14, 27, 'npcC', 0, 'informant', 'hear whispers'],
      [53, 38, 'npcB', 0, 'warehouse', 'talk at warehouse'],
      [60, 14, 'npcC', 0, 'gatekeeper', 'approach checkpoint'],
    ];

    defs.forEach(([x, y, texture, frame, dialogueKey, prompt]) => {
      this.npcs.push(new Npc(this, x * TILE_SIZE, y * TILE_SIZE, texture, frame, npcDialogues[dialogueKey], prompt));
    });
  }

  private spawnZones(): void {
    const defs: Array<[string, number, number, number, string, keyof typeof poiDialogues]> = [
      ['bar', 10, 17, 26, 'enter tavern', 'tavernDoor'],
      ['church', 20, 16, 28, 'inspect church', 'churchDoor'],
      ['garage', 48, 22, 26, 'inspect garage', 'garageDoor'],
      ['warehouse', 54, 38, 30, 'inspect gate', 'warehouseGate'],
      ['dock', 10, 40, 26, 'inspect dockside', 'dockEdge'],
      ['airport', 60, 11, 28, 'inspect checkpoint', 'airportFence'],
    ];

    defs.forEach(([id, x, y, radius, prompt, key]) => {
      this.zones.push(new InteractableZone(this, id, x * TILE_SIZE, y * TILE_SIZE, radius, prompt, poiDialogues[key]));
    });
  }
}
