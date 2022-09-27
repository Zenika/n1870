import Submarine from './submarine'

const SCROLL_SPEED: number = 1

export default class Background {
  layers: { ratioX: number; sprite: Phaser.GameObjects.TileSprite }[] = []


  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale


    var tileSprite = scene.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(0)
    this.layers.push({
      ratioX: 0.1,
      sprite: tileSprite
    })

    tileSprite = scene.add
      .tileSprite(0, 0, width, height, 'layer1')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(2)
    this.layers.push({
      ratioX: 0.5,
      sprite: tileSprite
    })

    tileSprite = scene.add.tileSprite(0, 0, width, height, 'layer2').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(4)
    this.layers.push({
      ratioX: 0.7,
      sprite: tileSprite
    })
    tileSprite = scene.add.tileSprite(0, 0, width, height, 'layer3').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(5)
    this.layers.push({
      ratioX: 1,
      sprite: tileSprite
    })

  }

  public update(submarine: Submarine) {
    for (let bg of this.layers) {
      bg.sprite.tilePositionX = Math.max(submarine.body.x * bg.ratioX, bg.sprite.tilePositionX + SCROLL_SPEED * bg.ratioX)
    }
  }
}
