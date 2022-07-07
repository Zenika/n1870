export default class Background {
  layers: { ratioX: number; sprite: Phaser.GameObjects.TileSprite }[] = []

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale

    this.layers.push({
      ratioX: 0.1,
      sprite: scene.add.tileSprite(0, 0, width, height, 'downlayer').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(1)
    })

    this.layers.push({
      ratioX: 0.5,
      sprite: scene.add.tileSprite(0, 0, width, height, 'middlelayer').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(2)
    })

    this.layers.push({
      ratioX: 0.7,
      sprite: scene.add.tileSprite(0, 0, width, height, 'light').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(4)
    })

    this.layers.push({
      ratioX: 1,
      sprite: scene.add.tileSprite(0, 0, width, height, 'toplayer').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(5)
    })
  }
}
