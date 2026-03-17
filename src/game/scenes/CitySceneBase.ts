import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Npc } from '../entities/Npc';
import { InteractableZone } from '../entities/InteractableZone';
import { getRankReactiveLine, npcDialogues, poiDialogues } from '../data/dialogues';
import { TILE_SIZE } from '../data/worldData';
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
import { TravelMenu } from '../ui/TravelMenu';
import { WarehouseMenu } from '../ui/WarehouseMenu';
import { CITY_CONTENT, type CityId } from '../data/cityContent';
import type { HeistResult } from '../systems/ProgressionSystem';

export abstract class CitySceneBase extends Phaser.Scene {
  constructor(sceneKey: string) { super(sceneKey); }
  protected abstract cityId: CityId;
  protected abstract otherSceneKey: string;
  protected abstract mapSize: { width: number; height: number };
  protected abstract spawn: { x: number; y: number };
  protected abstract createLayers(map: Phaser.Tilemaps.Tilemap, tiles: Phaser.Tilemaps.Tileset): { collision: Phaser.Tilemaps.TilemapLayer; lights: Array<{ x: number; y: number; r: number; c: number; i: number }> };

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
  private travelMenu!: TravelMenu;
  private warehouseMenu!: WarehouseMenu;
  private audioSystem!: AudioSystem;
  private progression = new ProgressionSystem();
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private paused = false;
  private footstepCooldown = 0;

  create(): void {
    try {
      console.log(`[${this.scene.key}] Gameplay create started`);
      this.audioSystem = this.registry.get('audioSystem');
      this.audioSystem.resume();
      this.progression.hydrate(SaveSystem.load());
      this.progression.setCity(this.cityId, CITY_CONTENT[this.cityId].location);

      const map = this.make.tilemap({ tileWidth: TILE_SIZE, tileHeight: TILE_SIZE, width: this.mapSize.width, height: this.mapSize.height });
      const tiles = map.addTilesetImage('tiles', 'tiles', TILE_SIZE, TILE_SIZE, 0, 0)!;
      const { collision, lights } = this.createLayers(map, tiles);
      collision.setVisible(false).setCollision(1);

      this.player = new Player(this, this.spawn.x, this.spawn.y);
      console.log(`[${this.scene.key}] Player spawn`, this.player.x, this.player.y);
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
      this.travelMenu = new TravelMenu(this);
      this.warehouseMenu = new WarehouseMenu(this);

      this.keys = {
        E: this.input.keyboard!.addKey('E'), P: this.input.keyboard!.addKey('P'), UP: this.input.keyboard!.addKey('UP'), DOWN: this.input.keyboard!.addKey('DOWN'),
        LEFT: this.input.keyboard!.addKey('LEFT'), RIGHT: this.input.keyboard!.addKey('RIGHT'), ENTER: this.input.keyboard!.addKey('ENTER'), B: this.input.keyboard!.addKey('B'),
        S: this.input.keyboard!.addKey('S'), D: this.input.keyboard!.addKey('D'), T: this.input.keyboard!.addKey('T'), R: this.input.keyboard!.addKey('R'), ESC: this.input.keyboard!.addKey('ESC'), M: this.input.keyboard!.addKey('M'), N: this.input.keyboard!.addKey('N')
      };

      this.input.on('pointerdown', () => { if (this.resultModal.isOpen()) this.closeResult(); else if (this.dialogueSystem.isActive()) this.advanceDialogue(); });

      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setDeadzone(40, 24);
      this.cameras.main.setBounds(0, 0, this.mapSize.width * TILE_SIZE, this.mapSize.height * TILE_SIZE);
      this.physics.world.setBounds(0, 0, this.mapSize.width * TILE_SIZE, this.mapSize.height * TILE_SIZE);
      console.log(`[${this.scene.key}] Camera bounds`, this.mapSize.width * TILE_SIZE, this.mapSize.height * TILE_SIZE);

      this.lights.enable().setAmbientColor(this.cityId === 'village' ? 0x8f775d : 0x6d7485);
      lights.forEach((l) => this.lights.addLight(l.x, l.y, l.r, l.c, l.i));

      this.refreshHud();
      this.audioSystem.startCityLoop(this.cityId);
      this.cameras.main.fadeIn(600, 0, 0, 0);
      console.log(`[${this.scene.key}] Gameplay create complete`);
    } catch (error) {
      console.error(`[${this.scene.key}] Game failed to start`, error);
      const msg = error instanceof Error ? error.message : String(error);
      this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.95).setScrollFactor(0);
      this.add.text(this.scale.width / 2, this.scale.height / 2, `Game failed to start\n${msg}`, {
        color: '#ffcccc',
        fontFamily: 'monospace',
        fontSize: '16px',
        align: 'center',
        wordWrap: { width: this.scale.width - 60 },
      }).setOrigin(0.5).setScrollFactor(0);
    }
  }

  update(_t: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.P) || Phaser.Input.Keyboard.JustDown(this.keys.ESC) && !this.dialogueSystem.isActive()) {
      if (!this.heistMenu.isOpen() && !this.resultModal.isOpen() && !this.drugMenu.isOpen() && !this.travelMenu.isOpen() && !this.warehouseMenu.isOpen()) {
        this.paused = !this.paused;
        this.pauseMenu.setVisible(this.paused);
      }
    }
    if (this.paused) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.M)) { const s=this.audioSystem.getSettings(); this.audioSystem.setSettings({ musicVolume: Math.max(0, s.musicVolume-0.05) }); }
      if (Phaser.Input.Keyboard.JustDown(this.keys.N)) { const s=this.audioSystem.getSettings(); this.audioSystem.setSettings({ musicVolume: Math.min(1, s.musicVolume+0.05) }); }
      if (Phaser.Input.Keyboard.JustDown(this.keys.B)) { const s=this.audioSystem.getSettings(); this.audioSystem.setSettings({ sfxVolume: Math.max(0, s.sfxVolume-0.05) }); }
      if (Phaser.Input.Keyboard.JustDown(this.keys.S)) { const s=this.audioSystem.getSettings(); this.audioSystem.setSettings({ sfxVolume: Math.min(1, s.sfxVolume+0.05) }); }
      if (Phaser.Input.Keyboard.JustDown(this.keys.E)) SaveSystem.save(this.progression.getState());
      if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) { SaveSystem.reset(); this.progression.hydrate(SaveSystem.load()); this.refreshHud(); }
      return;
    }

    if (this.resultModal.isOpen()) { if (Phaser.Input.Keyboard.JustDown(this.keys.E) || Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) this.closeResult(); return; }
    if (this.travelMenu.isOpen()) { if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) this.executeTravel(); if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) this.travelMenu.close(); return; }

    if (this.heistMenu.isOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.UP)) this.heistMenu.move(-1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.DOWN)) this.heistMenu.move(1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) { this.audioSystem.playConfirm(); this.heistMenu.confirm(); }
      if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) this.heistMenu.close();
      return;
    }

    if (this.drugMenu.isOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.UP)) this.drugMenu.move(-1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.DOWN)) this.drugMenu.move(1);
      const drugId = this.drugMenu.getSelectedDrugId();
      if (drugId && Phaser.Input.Keyboard.JustDown(this.keys.B)) this.applyProgress(this.progression.buyDrug(drugId, 1).ok, 'trade');
      if (drugId && Phaser.Input.Keyboard.JustDown(this.keys.S)) this.applyProgress(this.progression.sellDrug(drugId, 1).ok, 'trade');
      if (drugId && Phaser.Input.Keyboard.JustDown(this.keys.D)) {
        const deal = this.progression.attemptDeal(drugId, 1, CITY_CONTENT[this.cityId].cityBonus);
        this.handleDealResult(deal);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) this.drugMenu.close();
      this.drugMenu.render(this.progression.getState());
      return;
    }

    if (this.warehouseMenu.isOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.UP)) this.warehouseMenu.moveWarehouse(-1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.DOWN)) this.warehouseMenu.moveWarehouse(1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.LEFT)) this.warehouseMenu.moveDrug(-1);
      if (Phaser.Input.Keyboard.JustDown(this.keys.RIGHT)) this.warehouseMenu.moveDrug(1);
      const wid = this.warehouseMenu.getWarehouseId();
      const did = this.warehouseMenu.getDrugId();
      if (wid && Phaser.Input.Keyboard.JustDown(this.keys.B)) this.applyProgress(this.progression.buyWarehouse(wid).ok, 'warehouse');
      if (did && Phaser.Input.Keyboard.JustDown(this.keys.T)) this.applyProgress(this.progression.moveToWarehouse(did, 1).ok, 'warehouse');
      if (did && Phaser.Input.Keyboard.JustDown(this.keys.R)) this.applyProgress(this.progression.moveFromWarehouse(did, 1).ok, 'warehouse');
      if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) this.warehouseMenu.close();
      this.warehouseMenu.render(this.progression.getState());
      return;
    }

    this.npcs.forEach((npc) => npc.idle());

    if (!this.dialogueSystem.isActive()) {
      this.player.update();
      const nearby = this.interactionSystem.getNearby();
      this.hud.setInteraction(nearby?.prompt);
      if (nearby && Phaser.Input.Keyboard.JustDown(this.keys.E)) {
        if (nearby.action === 'dealer') {
          this.audioSystem.playMenuOpen();
          this.drugMenu.open(this.progression.getUnlockedDrugs());
          this.drugMenu.render(this.progression.getState());
          return;
        }
        if (nearby.action === 'heistBoard') { this.audioSystem.playMenuOpen(); this.heistMenu.open(this.progression.getAvailableHeists(this.cityId), (id) => this.executeHeist(id)); return; }
        if (nearby.action === 'travel') { if (!this.progression.canTravel()) this.dialogueSystem.start({ id: 'blocked', name: 'Airport Staff', lines: ['No travel for your rank. Hit Soldier first.'] }); else this.travelMenu.open(); const c = this.dialogueSystem.getCurrent(); if (c) this.dialogueBox.show(c.name, c.line); return; }
        if (nearby.action === 'warehouse') { this.audioSystem.playWarehouse(); this.warehouseMenu.open(this.progression.getWarehousesByCity(this.cityId), this.progression.getUnlockedDrugs()); this.warehouseMenu.render(this.progression.getState()); return; }
        if (nearby.dialogue) {
          this.audioSystem.playUIClick();
          this.dialogueSystem.start(nearby.dialogue.id === 'elder' ? getRankReactiveLine(this.progression.getRank()) : nearby.dialogue);
          const c = this.dialogueSystem.getCurrent(); if (c) this.dialogueBox.show(c.name, c.line);
        }
      }
      const moving = this.player.body?.velocity.length() ?? 0;
      this.footstepCooldown -= delta;
      if (moving > 30 && this.footstepCooldown <= 0) { this.audioSystem.playFootstep(); this.footstepCooldown = 220; }
      if (this.cityId === 'philadelphia' && Math.random() < 0.004) this.audioSystem.playIndustrialAmbient((this.player.x / (this.mapSize.width * TILE_SIZE)) * 2 - 1);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.E)) this.advanceDialogue();
  }

  private applyProgress(ok: boolean, type: 'trade' | 'warehouse'): void {
    if (ok) type === 'trade' ? this.audioSystem.playTrade() : this.audioSystem.playWarehouse();
    else this.audioSystem.playFailureSting();
    this.onProgressChanged();
  }

  private handleDealResult(deal: { success: boolean; profit: number; qty: number; confiscated: number; fine: number; flavor: string }): void {
    this.resultModal.show({ success: deal.success, moneyDelta: deal.success ? deal.profit : -deal.fine, xpDelta: deal.qty * (deal.success ? 6 : 2), flavor: `${deal.flavor} ${deal.confiscated ? `Confiscated: ${deal.confiscated}.` : ''}` });
    if (deal.success) this.audioSystem.playSuccessSting(); else this.audioSystem.playFailureSting();
    this.onProgressChanged();
  }

  private executeHeist(heistId: string): void {
    this.heistMenu.close();
    this.cameras.main.fadeOut(260, 0, 0, 0);
    this.time.delayedCall(260, () => {
      const suspense = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Running the job...', {
        fontFamily: 'monospace', fontSize: '20px', color: '#f5ddb1', backgroundColor: '#1b120d', padding: { x: 12, y: 8 }
      }).setOrigin(0.5).setScrollFactor(0).setDepth(970);
      this.time.delayedCall(560, () => {
        const { result, rankUp } = this.progression.runHeist(heistId);
        suspense.destroy();
        this.handleHeistResult(result, rankUp);
        this.cameras.main.fadeIn(280, 0, 0, 0);
      });
    });
  }

  private handleHeistResult(result: HeistResult, rankUp?: string): void {
    this.resultModal.show(result);
    result.success ? this.audioSystem.playSuccessSting() : this.audioSystem.playFailureSting();
    if (rankUp) { this.audioSystem.playRankUp(); this.rankToast.show(this, rankUp); }
    this.onProgressChanged();
  }

  private executeTravel(): void {
    this.travelMenu.close();
    this.audioSystem.playTravel();
    this.cameras.main.fadeOut(420, 0, 0, 0);
    this.time.delayedCall(450, () => {
      this.progression.setCity(this.cityId === 'village' ? 'philadelphia' : 'village', this.cityId === 'village' ? 'Philadelphia' : 'Old Italian Village');
      SaveSystem.save(this.progression.getState());
      this.scene.start(this.otherSceneKey);
    });
  }

  private closeResult(): void { this.resultModal.hide(); SaveSystem.save(this.progression.getState()); }
  private onProgressChanged(): void { SaveSystem.save(this.progression.getState()); this.refreshHud(); }

  private refreshHud(): void {
    const state = this.progression.getState();
    const rank = this.progression.getRank();
    const nextRank = this.progression.getRankList().find((r) => r.index === rank.index + 1);
    this.hud.setModel({
      money: state.money,
      rank: rank.name,
      xp: state.xp,
      xpProgress: this.progression.getRankProgress(),
      nextRankLabel: nextRank ? `${nextRank.name} (${nextRank.xpRequired})` : 'MAX RANK',
      location: CITY_CONTENT[this.cityId].location,
      inventorySummary: `Stash ${this.progression.getInventoryUsed()}/${this.progression.getTotalCapacity()}`,
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
    if (this.anims.exists('player-idle-up')) return;
    (['up', 'down', 'left', 'right'] as const).forEach((dir) => {
      this.anims.create({ key: `player-idle-${dir}`, frames: [{ key: 'player', frame: 0 }], frameRate: 1, repeat: -1 });
      this.anims.create({ key: `player-walk-${dir}`, frames: [{ key: 'player', frame: 0 }, { key: 'player', frame: 0 }], frameRate: 8, repeat: -1 });
    });
  }

  private spawnNpcs(): void {
    CITY_CONTENT[this.cityId].npcs.forEach((n) => this.npcs.push(new Npc(this, n.x * TILE_SIZE, n.y * TILE_SIZE, n.texture, 0, npcDialogues[n.dialogueKey], n.prompt, n.action)));
  }

  private spawnZones(): void {
    CITY_CONTENT[this.cityId].zones.forEach((z) => this.zones.push(new InteractableZone(this, z.id, z.x * TILE_SIZE, z.y * TILE_SIZE, z.radius, z.prompt, z.action as any, z.dialogueKey ? poiDialogues[z.dialogueKey] : undefined)));
  }
}
