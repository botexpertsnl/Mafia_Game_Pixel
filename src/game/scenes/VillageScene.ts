import Phaser from 'phaser';
import { CitySceneBase } from './CitySceneBase';
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, createBuildingLayer, createCollisionLayer, createDecorationLayer, createGroundLayer, createRoadLayer, spawnPoint } from '../data/worldData';

export class VillageScene extends CitySceneBase {
  protected cityId = 'village' as const;
  protected otherSceneKey = 'philadelphia';
  protected mapSize = { width: MAP_WIDTH, height: MAP_HEIGHT };
  protected spawn = spawnPoint;

  constructor() { super('village'); }

  protected createLayers(map: Phaser.Tilemaps.Tilemap, tiles: Phaser.Tilemaps.Tileset) {
    const ground = (map as any).createLayer('ground', tiles, createGroundLayer(), 0, 0)!;
    const roads = (map as any).createLayer('roads', tiles, createRoadLayer(), 0, 0)!;
    const buildings = (map as any).createLayer('buildings', tiles, createBuildingLayer(), 0, 0)!;
    const deco = (map as any).createLayer('deco', tiles, createDecorationLayer(), 0, 0)!;
    const collision = (map as any).createLayer('collision', tiles, createCollisionLayer(), 0, 0)!;
    [ground, roads, buildings, deco].forEach((l) => l.setPipeline('Light2D'));
    return {
      collision,
      lights: [
        { x: 11 * TILE_SIZE, y: 20 * TILE_SIZE, r: 140, c: 0xf6bd74, i: 0.6 },
        { x: 53 * TILE_SIZE, y: 34 * TILE_SIZE, r: 140, c: 0xd9a66b, i: 0.55 },
      ],
    };
  }
}
