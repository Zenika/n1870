import Submarine from '../objects/submarine'
import FpsText from '../objects/fpsText'
import { Body } from 'matter'

export default class MainScene extends Phaser.Scene {
  fpsText
  submarine: Submarine
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)
    this.cursors = this.input.keyboard.createCursorKeys();

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  update() {
    if (this.cursors.left.isDown)
    {
        this.submarine.setAngularVelocity(-150);
    }
    else if (this.cursors.right.isDown)
    {
      this.submarine.setAngularVelocity(150);
    }
    else
    {
      this.submarine.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown)
    {
        this.physics.velocityFromRotation(this.submarine.rotation, 600, (this.submarine.body as Phaser.Physics.Arcade.Body).acceleration);
    }
    else
    {
      this.submarine.setAcceleration(0);
    }

    this.fpsText.update()
  }
}
