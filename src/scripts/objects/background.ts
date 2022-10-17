import * as constants from '../scenes/mainScene'



export default class Background {
  layers: {
    ratioX: number
    sprite: Phaser.GameObjects.TileSprite
  }[] = []

  scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale
    this.scene = scene



    var tileSprite = scene.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(0)
    this.layers.push({
      ratioX: 0.1,
      sprite: tileSprite,
    })

    tileSprite = scene.add
      .tileSprite(0, 0, width, height, 'layer3')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(1)
      .setAlpha(0.5, 0.5, 0.5, 0.5)
    this.layers.push({
      ratioX: 0.5,
      sprite: tileSprite,
    })

    tileSprite = scene.add.tileSprite(0, 0, width, height, 'layer2').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(2)
    this.layers.push({
      ratioX: 0.7,
      sprite: tileSprite,
    })

    var shapes = scene.cache.json.get('rock')

    var composites: MatterJS.CompositeType[] = []
    for (let index = 0; index < constants.NB_BACKGROUND; index++) {
      var composite = scene.matter.composite.create({
        label: 'background',
      })
      var bodyUp = scene.matter.body.create({ isStatic: true,
        collisionFilter: shapes.layer1.collisionFilter,
        label: 'background',
      })
      var bodyDown = scene.matter.body.create({
        isStatic: true,
        collisionFilter: shapes.layer1.collisionFilter,
        label: 'background',
      })
      scene.matter.body.setParts(bodyUp, Phaser.Physics.Matter.PhysicsEditorParser.parseVertices(shapes.layer1.fixtures[0].vertices, { label: 'background' }))
      scene.matter.body.setParts(bodyDown, Phaser.Physics.Matter.PhysicsEditorParser.parseVertices(shapes.layer1.fixtures[1].vertices, { label: 'background' }))
      scene.matter.composite.add(composite, bodyUp)
      scene.matter.composite.add(composite, bodyDown)

      scene.matter.world.add(composite);
      scene.matter.composite.translate(composite, { x: 2400 * index, y: 0 })

      composites.push(composite)

    }
    tileSprite = scene.add.tileSprite(0, 0, width, height, 'layer1').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(3)
    this.layers.push({
      ratioX: 1,
      sprite: tileSprite
    })

  }

  public update() {


    this.layers.forEach(bg => {
      var scrollX = this.scene.cameras.main.scrollX * bg.ratioX

      bg.sprite.setTilePosition(scrollX)

    })
  }
}
