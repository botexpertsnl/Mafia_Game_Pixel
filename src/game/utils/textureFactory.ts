import Phaser from 'phaser';

export const createTextures = (scene: Phaser.Scene): void => {
  const g = scene.make.graphics({ x: 0, y: 0 });

  // tileset atlas 20 tiles
  g.fillStyle(0xb79b76).fillRect(0, 0, 16, 16); // dirt
  g.fillStyle(0xc9b28f).fillRect(16, 0, 16, 16); // square
  g.fillStyle(0x8da17a).fillRect(32, 0, 16, 16); // grass
  g.fillStyle(0x6e7d92).fillRect(48, 0, 16, 16); // water
  g.fillStyle(0x866748).fillRect(64, 0, 16, 16); // dock wood
  g.fillStyle(0x8c8a86).fillRect(80, 0, 16, 16); // road stone
  g.fillStyle(0xd7b980).fillRect(96, 0, 16, 16); // lamp
  g.fillStyle(0x6a5139).fillRect(112, 0, 16, 16); // pole
  g.fillStyle(0x916b44).fillRect(128, 0, 16, 16); // crate
  g.fillStyle(0x7a5f46).fillRect(144, 0, 16, 16); // barrel
  g.fillStyle(0x5a442f).fillRect(160, 0, 16, 16); // bench
  g.fillStyle(0xa29480).fillRect(176, 0, 16, 16); // sign
  g.fillStyle(0x4f3d2b).fillRect(192, 0, 16, 16); // clutter
  g.fillStyle(0x9b6b4a).fillRect(208, 0, 16, 16); // tavern
  g.fillStyle(0xb5b1aa).fillRect(224, 0, 16, 16); // church
  g.fillStyle(0xb28b65).fillRect(240, 0, 16, 16); // market
  g.fillStyle(0x7d6f5d).fillRect(256, 0, 16, 16); // garage
  g.fillStyle(0x665649).fillRect(272, 0, 16, 16); // warehouse
  g.fillStyle(0x7f8474).fillRect(288, 0, 16, 16); // airport
  g.fillStyle(0x5f4c3e).fillRect(304, 0, 16, 16); // dock office
  g.generateTexture('tiles', 320, 16);
  g.clear();

  const pixelPerson = (key: string, coat: number, hair: number) => {
    g.fillStyle(0x2f2a24).fillRect(0, 0, 16, 16);
    g.fillStyle(coat).fillRect(5, 7, 6, 7);
    g.fillStyle(0xe0c8a8).fillRect(5, 4, 6, 4);
    g.fillStyle(hair).fillRect(5, 3, 6, 2);
    g.fillStyle(0x222222).fillRect(6, 8, 1, 4);
    g.fillStyle(0x222222).fillRect(9, 8, 1, 4);
    g.generateTexture(key, 16, 16);
    g.clear();
  };

  pixelPerson('player', 0x3e4c61, 0x2f1f17);
  pixelPerson('npcA', 0x6e3f2f, 0x5c4330);
  pixelPerson('npcB', 0x486340, 0xdad0ba);
  pixelPerson('npcC', 0x62506f, 0x1d1a16);

  // ui background
  g.fillStyle(0x130f0a).fillRect(0, 0, 64, 64);
  g.lineStyle(2, 0xa87d45).strokeRect(1, 1, 62, 62);
  g.generateTexture('panel', 64, 64);
};
