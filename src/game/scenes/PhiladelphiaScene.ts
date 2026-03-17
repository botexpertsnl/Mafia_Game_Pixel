import Phaser from 'phaser';
import { CitySceneBase } from './CitySceneBase';
import { PHILLY_HEIGHT, PHILLY_WIDTH, TILE_SIZE, createPhillyBuildingLayer, createPhillyCollisionLayer, createPhillyDecorationLayer, createPhillyGroundLayer, createPhillyRoadLayer, phillySpawnPoint } from '../data/worldData';

export class PhiladelphiaScene extends CitySceneBase {
  protected cityId = 'philadelphia' as const;
  protected otherSceneKey = 'village';
  protected mapSize = { width: PHILLY_WIDTH, height: PHILLY_HEIGHT };
  protected spawn = phillySpawnPoint;

  constructor() { super('philadelphia'); }

  protected createLayers(map: Phaser.Tilemaps.Tilemap, tiles: Phaser.Tilemaps.Tileset) {
    const ground = map.createLayer('ground', tiles, createPhillyGroundLayer(), 0, 0)!;
    const roads = map.createLayer('roads', tiles, createPhillyRoadLayer(), 0, 0)!;
    const buildings = map.createLayer('buildings', tiles, createPhillyBuildingLayer(), 0, 0)!;
    const deco = map.createLayer('deco', tiles, createPhillyDecorationLayer(), 0, 0)!;
    const collision = map.createLayer('collision', tiles, createPhillyCollisionLayer(), 0, 0)!;
    [ground, roads, buildings, deco].forEach((l) => l.setPipeline('Light2D'));
    return {
      collision,
      lights: [
        { x: 14 * TILE_SIZE, y: 11 * TILE_SIZE, r: 160, c: 0xaad0ff, i: 0.55 },
        { x: 44 * TILE_SIZE, y: 26 * TILE_SIZE, r: 190, c: 0xffb47a, i: 0.48 },
        { x: 72 * TILE_SIZE, y: 28 * TILE_SIZE, r: 180, c: 0xa868ff, i: 0.52 },
      ],
    };
  }
}
