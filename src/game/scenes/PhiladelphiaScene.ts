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
    const createFromData = (name: string, data: number[][]) => {
      const layer = map.createBlankLayer(name, tiles, 0, 0, this.mapSize.width, this.mapSize.height, TILE_SIZE, TILE_SIZE)!;
      layer.putTilesAt(data, 0, 0);
      return layer;
    };

    const ground = createFromData('ground', createPhillyGroundLayer());
    const roads = createFromData('roads', createPhillyRoadLayer());
    const buildings = createFromData('buildings', createPhillyBuildingLayer());
    const deco = createFromData('deco', createPhillyDecorationLayer());
    const collision = createFromData('collision', createPhillyCollisionLayer());
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
