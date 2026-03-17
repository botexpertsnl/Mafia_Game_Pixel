import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Npc } from '../entities/Npc';
import { InteractableZone } from '../entities/InteractableZone';
import { getRankReactiveLine, npcDialogues, poiDialogues } from '../data/dialogues';
import { createBuildingLayer, createCollisionLayer, createDecorationLayer, createGroundLayer, createRoadLayer, MAP_HEIGHT, MAP_WIDTH, spawnPoint, TILE_SIZE } from '../data/worldData';
import { InteractionSystem } from '../systems/InteractionSystem';
import { DialogueSystem } from '../systems/DialogueSystem';
import { Hud } from '../ui/Hud';
import { DialogueBox } from '../ui/DialogueBox';
import { PauseMenu } from '../ui/PauseMenu';
import type { AudioSystem } from '../systems/AudioSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { HeistMenu } from '../ui/HeistMenu';
import { ResultModal } from '../ui/ResultModal';
import { DrugMarketMenu } from '../ui/DrugMarketMenu';
import { RankUpToast } from '../ui/RankUpToast';

export class VillageScene extends Phaser.Scene {
  private player!: Player;
  private npcs: Npc[] = [];
  private zones: InteractableZone[] = [];
  private interactionSystem!: InteractionSystem;
  private dialogueSystem = new DialogueSystem();
  private hud!: Hud;
  private dialogueBox!: DialogueBox;
  private pauseMenu!: PauseMenu;
  private heistMenu!: HeistMenu;
  private resultModal!: ResultModal;
  private drugMenu!: DrugMarketMenu;
  private rankToast!: RankUpToast;
  private audioSystem!: AudioSystem;
  private progression = new ProgressionSystem();
  private interactKey!: Phaser.Input.Keyboard.Key;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private buyKey!: Phaser.Input.Keyboard.Key;
  private sellKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;
  private paused = false;
  private footstepCooldown = 0;

  constructor() { super('village'); }

  create(): void {
    this.audioSystem = this.registry.get('audioSystem');
    this.audioSystem.resume();
    this.progression.hydrate(SaveSystem.load());

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
    this.heistMenu = new HeistMenu(this);
    this.resultModal = new ResultModal(this);
    this.drugMenu = new DrugMarketMenu(this);
    this.rankToast = new RankUpToast(this);

    this.interactKey = this.input.keyboard!.addKey('E');
    this.pauseKey = this.input.keyboard!.addKey('P');
    this.upKey = this.input.keyboard!.addKey('UP');
    this.downKey = this.input.keyboard!.addKey('DOWN');
    this.enterKey = this.input.keyboard!.addKey('ENTER');
    this.buyKey = this.input.keyboard!.addKey('B');
    this.sellKey = this.input.keyboard!.addKey('S');
    this.escKey = this.input.keyboard!.addKey('ESC');

    this.input.on('pointerdown', () => {
      if (this.resultModal.isOpen()) return this.closeResult();
      if (this.dialogueSystem.isActive()) this.advanceDialogue();
    });

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(40, 24);
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

    this.lights.enable().setAmbientColor(0x8f775d);
    this.lights.addLight(11 * TILE_SIZE, 20 * TILE_SIZE, 140, 0xf6bd74, 0.6);
    this.lights.addLight(53 * TILE_SIZE, 34 * TILE_SIZE, 140, 0xd9a66b, 0.55);

    this.refreshHud();
    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  update(_time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey) || Phaser.Input.Keyboard.JustDown(this.escKey) && !this.dialogueSystem.isActive()) {
      if (!this.heistMenu.isOpen() && !this.resultModal.isOpen() && !this.drugMenu.isOpen()) {
        this.paused = !this.paused;
        this.pauseMenu.setVisible(this.paused);
      }
    }

    if (this.paused) {
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        SaveSystem.save(this.progression.getState());
        this.audioSystem.playConfirm();
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        SaveSystem.reset();
        this.progression.hydrate(SaveSystem.load());
        this.refreshHud();
      }
      return;
    }

    if (this.resultModal.isOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) this.closeResult();
      return;
    }

    if (this.heistMenu.isOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.upKey)) this.heistMenu.move(-1);
      if (Phaser.Input.Keyboard.JustDown(this.downKey)) this.heistMenu.move(1);
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) { this.audioSystem.playConfirm(); this.heistMenu.confirm(); }
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) this.heistMenu.close();
      return;
    }

    if (this.drugMenu.isOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.upKey)) this.drugMenu.move(-1);
      if (Phaser.Input.Keyboard.JustDown(this.downKey)) this.drugMenu.move(1);
      if (Phaser.Input.Keyboard.JustDown(this.buyKey)) {
        const res = this.progression.buyDrug(this.drugMenu.getSelectedDrugId(), 1);
        if (res.ok) this.audioSystem.playTrade(); else this.audioSystem.playFailureSting();
        this.onProgressChanged();
      }
      if (Phaser.Input.Keyboard.JustDown(this.sellKey)) {
        const res = this.progression.sellDrug(this.drugMenu.getSelectedDrugId(), 1);
        if (res.ok) this.audioSystem.playTrade(); else this.audioSystem.playFailureSting();
        this.onProgressChanged();
      }
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) this.drugMenu.close();
      this.drugMenu.render(this.progression.getState());
      return;
    }

    this.npcs.forEach((npc) => npc.idle());

    if (!this.dialogueSystem.isActive()) {
      this.player.update();
      const nearby = this.interactionSystem.getNearby();
      this.hud.setInteraction(nearby?.prompt);

      if (nearby && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        if (nearby.action === 'dealer') {
          this.audioSystem.playMenuOpen();
          this.drugMenu.open();
          this.drugMenu.render(this.progression.getState());
          return;
        }
        if (nearby.action === 'heistBoard') {
          this.audioSystem.playMenuOpen();
          this.heistMenu.open(this.progression.getAvailableHeists(), (id) => this.executeHeist(id));
          return;
        }
        if (nearby.dialogue) {
          this.audioSystem.playUIClick();
          this.dialogueSystem.start(nearby.dialogue.id === 'elder' ? getRankReactiveLine(this.progression.getRank()) : nearby.dialogue);
          const current = this.dialogueSystem.getCurrent();
          if (current) this.dialogueBox.show(current.name, current.line);
        }
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
  }

  private executeHeist(heistId: string): void {
    this.heistMenu.close();
    this.cameras.main.fadeOut(260, 0, 0, 0);
    this.time.delayedCall(280, () => {
      const suspense = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Running the job...', {
        fontFamily: 'monospace', fontSize: '20px', color: '#f5ddb1', backgroundColor: '#1b120d', padding: { x: 12, y: 8 }
      }).setOrigin(0.5).setScrollFactor(0).setDepth(970);

      this.time.delayedCall(550, () => {
        const { result, rankUp } = this.progression.runHeist(heistId);
        suspense.destroy();
        this.resultModal.show(result);
        if (result.success) this.audioSystem.playSuccessSting(); else this.audioSystem.playFailureSting();
        if (rankUp) {
          this.audioSystem.playRankUp();
          this.rankToast.show(this, rankUp);
        }
        this.onProgressChanged();
        this.cameras.main.fadeIn(280, 0, 0, 0);
      });
    });
  }

  private closeResult(): void {
    this.resultModal.hide();
    SaveSystem.save(this.progression.getState());
  }

  private onProgressChanged(): void {
    SaveSystem.save(this.progression.getState());
    this.refreshHud();
  }

  private refreshHud(): void {
    const state = this.progression.getState();
    const rank = this.progression.getRank();
    const nextRank = this.progression.getRankList().find((r) => r.index === rank.index + 1);
    const used = this.progression.getInventoryUsed();
    this.hud.setModel({
      money: state.money,
      rank: rank.name,
      xp: state.xp,
      xpProgress: this.progression.getRankProgress(),
      nextRankLabel: nextRank ? `${nextRank.name} (${nextRank.xpRequired})` : 'MAX RANK',
      location: state.lastLocation,
      inventorySummary: `Stash ${used}/${state.inventoryCapacity}`,
    });
  }

  private advanceDialogue(): void {
    this.audioSystem.playDialogueAdvance();
    const result = this.dialogueSystem.advance();
    if (result.done) return this.dialogueBox.hide();
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
    const defs: Array<[number, number, string, number, keyof typeof npcDialogues, string, 'dialogue' | 'dealer']> = [
      [11, 18, 'npcA', 0, 'bartender', 'talk to bartender', 'dialogue'],
      [47, 22, 'npcB', 0, 'mechanic', 'talk to mechanic', 'dialogue'],
      [21, 18, 'npcB', 0, 'elder', 'talk to elder', 'dialogue'],
      [35, 18, 'npcC', 0, 'vendor', 'browse wares', 'dialogue'],
      [22, 11, 'npcB', 0, 'church', 'speak softly', 'dialogue'],
      [12, 36, 'npcA', 0, 'dock', 'talk at docks', 'dialogue'],
      [27, 25, 'npcA', 0, 'tough', 'size him up', 'dialogue'],
      [14, 27, 'npcC', 0, 'informant', 'hear whispers', 'dialogue'],
      [53, 38, 'npcB', 0, 'warehouse', 'talk at warehouse', 'dialogue'],
      [60, 14, 'npcC', 0, 'gatekeeper', 'approach checkpoint', 'dialogue'],
      [38, 20, 'npcA', 0, 'dealer', 'open market', 'dealer'],
    ];

    defs.forEach(([x, y, texture, frame, dialogueKey, prompt, action]) => {
      this.npcs.push(new Npc(this, x * TILE_SIZE, y * TILE_SIZE, texture, frame, npcDialogues[dialogueKey], prompt, action));
    });
  }

  private spawnZones(): void {
    const defs: Array<[string, number, number, number, string, 'dialogue' | 'heistBoard', keyof typeof poiDialogues | undefined]> = [
      ['bar', 10, 17, 26, 'enter tavern', 'dialogue', 'tavernDoor'],
      ['church', 20, 16, 28, 'inspect church', 'dialogue', 'churchDoor'],
      ['garage', 48, 22, 26, 'inspect garage', 'dialogue', 'garageDoor'],
      ['warehouse', 54, 38, 30, 'inspect gate', 'dialogue', 'warehouseGate'],
      ['dock', 10, 40, 26, 'inspect dockside', 'dialogue', 'dockEdge'],
      ['airport', 60, 11, 28, 'inspect checkpoint', 'dialogue', 'airportFence'],
      ['heist_van_1', 31, 23, 24, 'check parked van jobs', 'heistBoard', undefined],
      ['heist_scooter_2', 14, 25, 24, 'check scooter relay jobs', 'heistBoard', undefined],
      ['heist_truck_3', 51, 28, 24, 'check freight jobs', 'heistBoard', undefined],
    ];

    defs.forEach(([id, x, y, radius, prompt, action, key]) => {
      this.zones.push(new InteractableZone(this, id, x * TILE_SIZE, y * TILE_SIZE, radius, prompt, action, key ? poiDialogues[key] : undefined));
    });
  }
}
