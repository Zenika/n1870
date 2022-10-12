
import Submarine from './submarine'


const LIGHTS = {
  UP: {
    DESACTIVATED: {
      "framename": "up-no-light"
    },
    ACTIVATED: {
      "framename": "up-light"
    }
  },
  STRAIGHT: {
    DESACTIVATED: {
      "framename": "straight-no-light"
    },
    ACTIVATED: {
      "framename": "straight-light"
    }
  },
  DOWN: {
    DESACTIVATED: {
      "framename": "down-no-light"
    },
    ACTIVATED: {
      "framename": "down-light"
    }
  }

}

type POSITION = keyof typeof LIGHTS
type ACTIVATION = keyof typeof LIGHTS[keyof typeof LIGHTS]



export default class Flashlight {
  private scene: Phaser.Scene
  private submarine: Submarine
  armLight: Phaser.Physics.Arcade.Sprite

  currentPos: POSITION = 'STRAIGHT'
  lightActivated: Boolean = false

  lastOrigin: Phaser.Math.Vector2

  bodyForCollision: Map<string, MatterJS.BodyType> = new Map<string, MatterJS.BodyType>()
  currentBody: MatterJS.BodyType

  constructor(scene: Phaser.Scene, submarine: Submarine) {
    this.scene = scene
    this.submarine = submarine

    this.armLight = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, 'submarinelight')
    this.armLight.setTexture('submarinelight', 'straight-no-light')

    scene.add.existing(this.armLight)
    scene.physics.add.existing(this.armLight)
    this.armLight.setDepth(5)
    this.armLight.setOrigin(0, 0)
    this.updateLight()
    this.lightStraight()

    var shapes = scene.cache.json.get('submarine-light-box')
    var body = this.scene.matter.add.fromPhysicsEditor(0, 0, shapes.straight);
    body.render.visible = false
    this.bodyForCollision.set('straight-light', body)
    body = this.scene.matter.add.fromPhysicsEditor(0, 0, shapes.up);
    body.render.visible = false
    this.bodyForCollision.set('up-light', body)
    body = this.scene.matter.add.fromPhysicsEditor(0, 0, shapes.down);
    body.render.visible = false
    this.bodyForCollision.set('down-light', body)

  }

  lightUp() {
    this.currentPos = 'UP'
    this.updateLight()
    this.armLight.body.setOffset(60, this.armLight.height / 10 - 20)
    this.armLight.body.setSize(175, 135, false)
  }

  lightStraight() {
    this.currentPos = 'STRAIGHT'
    this.updateLight()
    this.armLight.body.setOffset(60, this.armLight.height / 4 + 20)
    this.armLight.body.setSize(190, 120, false)

  }

  lightDown() {
    this.currentPos = 'DOWN'
    this.updateLight()
    this.armLight.body.setOffset(60, this.armLight.height / 2 + 10)
    this.armLight.body.setSize(175, 135, false)
  }

  toggleLight() {
    this.lightActivated = !this.lightActivated
    this.updateLight()
  }

  activateLight() {
    this.lightActivated = true
    this.updateLight()
  }

  switchOffLight() {
    this.lightActivated = false
    this.updateLight()
  }

  private updateLight() {
    let activatedFrame: ACTIVATION = (this.lightActivated ? 'ACTIVATED' : 'DESACTIVATED')
    this.armLight.setTexture('submarinelight', LIGHTS[this.currentPos][activatedFrame]["framename"])

    switch (activatedFrame) {
      case 'ACTIVATED':
        this.armLight.body.checkCollision.none = false
        if (this.currentBody) {
          this.currentBody.render.visible = false
        }
        var body = this.bodyForCollision.get(LIGHTS[this.currentPos][activatedFrame]["framename"])
        if (body) {
          this.currentBody = body
          this.currentBody.render.visible = true
        }

        this.scene.time.addEvent({
          delay: 3000,
          callback: () => {
            this.lightActivated = false
            this.updateLight()
          },
          loop: false
        })

        break;
      case 'DESACTIVATED':
        this.armLight.body.checkCollision.none = true
        if (this.currentBody) {
          this.currentBody.render.visible = false
        }
        break;
      default:
        break;
    }

  }

  update() {
    var x = this.submarine.getBottomLeft().x + this.submarine.width / 2
    var y = this.submarine.getBottomLeft().y - this.armLight.height / 2 - 7
    this.armLight.setPosition(x, y)

    if (this.currentBody) {

      this.currentBody.position.x = this.submarine.getBottomLeft().x + this.submarine.width + 100

      if (this.currentPos == 'UP')
        this.currentBody.position.y = this.submarine.getBottomRight().y - 70
      else if (this.currentPos == 'DOWN')
        this.currentBody.position.y = this.submarine.getBottomRight().y + 70
      else
        this.currentBody.position.y = this.submarine.getBottomRight().y
    }
  }
}
