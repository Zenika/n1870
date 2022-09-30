import Submarine from './submarine'

const SCROLL_SPEED: number = 1

export default class Background {
  layers: {
    ratioX: number
    sprite: Phaser.GameObjects.TileSprite
    composite?: MatterJS.CompositeType
  }[] = []

  scene: Phaser.Scene

  collisionBody: MatterJS.BodyType

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
      .setAlpha(0.5,0.5,0.5,0.5)
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

    var composite = scene.matter.composite.create()
    var bodyUp = scene.matter.body.create({ isStatic: true, frictionStatic : 0,  friction : 0, frictionAir: 0, slop: 0})
    var bodyDown = scene.matter.body.create({ isStatic: true, frictionStatic : 0,  friction : 0, frictionAir: 0, slop: 0 })
    scene.matter.body.setParts(bodyUp, Phaser.Physics.Matter.PhysicsEditorParser.parseVertices(shapes.layer1.fixtures[0].vertices))
    scene.matter.body.setParts(bodyDown, Phaser.Physics.Matter.PhysicsEditorParser.parseVertices(shapes.layer1.fixtures[1].vertices))
    scene.matter.composite.add(composite,bodyUp)
    scene.matter.composite.add(composite,bodyDown)

    scene.matter.world.add(composite);
    scene.matter.composite.translate(composite,{ x: -405, y: 0})

    tileSprite = scene.add.tileSprite(0, 0, width, height, 'layer1').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(3)
    this.layers.push({
      ratioX: 1,
      sprite: tileSprite,
      composite: composite
    })

  }

  public update(submarine: Submarine) {

    this.layers.forEach(bg => {
      var xPos = Math.max(submarine.body.position.x * bg.ratioX, bg.sprite.tilePositionX + SCROLL_SPEED * bg.ratioX)

      bg.sprite.tilePositionX = xPos
      

      if(bg.composite) {
        this.scene.matter.composite.translate(bg.composite, { x: -SCROLL_SPEED, y: 0})
      }
    })
  }
}
