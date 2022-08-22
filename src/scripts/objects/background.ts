import Submarine from './submarine'

export default class Background {
  layers: { ratioX: number; sprite: Phaser.GameObjects.TileSprite }[] = []

  

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale


    // let coverRec = scene.add
    //   .rectangle(0, 0, width, height, 0x1e1f29, 0.8)
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0, 0)
    //   .setDepth(5)

    // coverRec.setBlendMode(Phaser.BlendModes.DIFFERENCE)

    var tileSprite = scene.add
      .tileSprite(0, 0, width, height, 'downlayer')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(1)
    this.layers.push({
      ratioX: 0.1,
      sprite: tileSprite
    })
    //tileSprite.setPipeline('Light2D')

    tileSprite = scene.add
      .tileSprite(0, 0, width, height, 'middlelayer')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(2)
    this.layers.push({
      ratioX: 0.5,
      sprite: tileSprite
    })
    //tileSprite.setPipeline('Light2D')

    tileSprite = scene.add.tileSprite(0, 0, width, height, 'light').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(4)
    this.layers.push({
      ratioX: 0.7,
      sprite: tileSprite
    })

    this.layers.push({
      ratioX: 1,
      sprite: scene.add.tileSprite(0, 0, width, height, 'toplayer').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(6)
    })
  }

  public update(submarine: Submarine) {
    for (let bg of this.layers) {
      bg.sprite.tilePositionX = submarine.body.x * bg.ratioX
    }
  }
}
