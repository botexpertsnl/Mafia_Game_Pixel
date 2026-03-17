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
    const createFromData = (name: string, data: number[][]) => {
      const layer = map.createBlankLayer(name, tiles, 0, 0, this.mapSize.width, this.mapSize.height, TILE_SIZE, TILE_SIZE)!;
      layer.putTilesAt(data, 0, 0);
      return layer;
    };

    const ground = createFromData('ground', createGroundLayer());
    const roads = createFromData('roads', createRoadLayer());
    const buildings = createFromData('buildings', createBuildingLayer());
    const deco = createFromData('deco', createDecorationLayer());
    const collision = createFromData('collision', createCollisionLayer());
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
