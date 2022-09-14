import Submarine, { Movement } from '../objects/submarine'
import FpsText from '../objects/fpsText'
import Background from '../objects/background'
import Octopus from '../objects/octopus'

export default class MainScene extends Phaser.Scene {
  fpsText
  submarine: Submarine
  background: Background
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  ennemis: Octopus[]

  private velocityX = 10

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    const { width, height } = this.scale

    this.add.image(0, 0, 'sky').setOrigin(0, 0).setScrollFactor(0).setScale(width, height)
    this.background = new Background(this)


    // display the Phaser.VERSION
    this.add
      .text(0, 0, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setDepth(6)

    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0).setPosition(400, 200)

    this.ennemis = []
    this.ennemis.push(new Octopus(this, width - 50, 100, this.submarine))
    this.ennemis.push(new Octopus(this, width - 50, 250, this.submarine))
    this.ennemis.push(new Octopus(this, width - 50, 350, this.submarine))

    this.fpsText = new FpsText(this)

    this.fpsText.setPosition(0, 30).setDepth(7)

    this.physics.world.setBounds(0, 0, width, 470, true, true, false, true)
    this.lights.enable().setAmbientColor(0x555555)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.input.keyboard.on('keyup', event => this.dealWithKeyUp(event))

  }


  dealWithKeyUp(event) {
    
    switch (event.which) {
      case Phaser.Input.Keyboard.KeyCodes.ONE:
        this.submarine.light.lightUp()
        break;
      case Phaser.Input.Keyboard.KeyCodes.TWO:
        this.submarine.light.lightStraight()
        break;
      case Phaser.Input.Keyboard.KeyCodes.THREE:
        this.submarine.light.lightDown()
        break;
      case Phaser.Input.Keyboard.KeyCodes.L:
        this.submarine.light.toggleLight()
        break;
      default:
        break;
    }
  }

  update() {

    let currentMovement: Movement

    if (this.cursors.left.isDown) {
      this.submarine.setAccelerationX(-150)
      currentMovement = Movement.Backward
    } else if (this.cursors.right.isDown) {
      this.submarine.setAccelerationX(150)
      currentMovement = Movement.Forward
    } else {
      this.submarine.setAccelerationX(0)
      currentMovement = Movement.Stopped
    }

    if (this.cursors.up.isDown) {
      this.submarine.setAccelerationY(-110)
    } else if (this.cursors.down.isDown) {
      this.submarine.setAccelerationY(110)
    } else {
      this.submarine.setAccelerationY(0)
    }


    this.background.update(this.submarine)
    this.fpsText.update()
    this.submarine.update(currentMovement)

    this.ennemis.forEach(ennemi => {
      ennemi.update()
    });
  }


}
