
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

  constructor(scene: Phaser.Scene, submarine: Submarine) {
    this.scene = scene
    this.submarine = submarine

    this.armLight = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, 'submarinelight')
    this.armLight.setTexture('submarinelight', 'straight-no-light')

    scene.add.existing(this.armLight)
    scene.physics.add.existing(this.armLight)
    this.armLight.setDepth(3)
    this.armLight.setOrigin(0, 0)
    this.armLight.body.setSize(1, 1)
    this.armLight.body.setOffset(0, this.armLight.height / 2)
  }

  lightUp() {
    console.log("up")
    this.currentPos = 'UP'
    this.updateLight()
  }

  lightStraight() {
    this.currentPos = 'STRAIGHT'
    this.updateLight()
  }

  lightDown() {
    this.currentPos = 'DOWN'
    this.updateLight()
  }

  toggleLight() {
    this.lightActivated = !this.lightActivated
    this.updateLight()
  }

  private updateLight() {
    let activatedFrame: ACTIVATION = (this.lightActivated ? 'ACTIVATED' : 'DESACTIVATED')
    this.armLight.setTexture('submarinelight', LIGHTS[this.currentPos][activatedFrame]["framename"])
  }

  update() {
    this.armLight.setPosition(this.submarine.getBottomLeft().x + this.submarine.width / 2, this.submarine.getBottomLeft().y - this.armLight.height / 2 - 7)
  }
}
