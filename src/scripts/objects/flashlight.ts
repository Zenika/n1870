import Submarine from './submarine'

export default class Flashlight {
  private scene: Phaser.Scene
  private submarine: Submarine
  polygon: Phaser.GameObjects.Polygon

  static LIGHT_SIZE: integer = 1

  constructor(scene: Phaser.Scene, submarine: Submarine) {
    this.scene = scene
    this.submarine = submarine

    const [x, y] = [0,0]

    this.polygon = scene.add.polygon(
      x,
      y,
      [
        new Phaser.Geom.Point(x, y+20),
        new Phaser.Geom.Point(x+Flashlight.LIGHT_SIZE * 50, y+20-Flashlight.LIGHT_SIZE * 20),
        new Phaser.Geom.Point(x+Flashlight.LIGHT_SIZE * 50, y+40+Flashlight.LIGHT_SIZE * 20),
        new Phaser.Geom.Point(x, y+40)
      ],
      0xe3a433,
      0.5
    ).setDepth(3).setBlendMode(Phaser.BlendModes.ADD).setOrigin(x,y)

  }

  public update() { 
    this.polygon.setPosition(this.submarine.getBottomRight().x,this.submarine.getBottomRight().y)
  }
}
