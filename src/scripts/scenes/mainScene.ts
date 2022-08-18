import Submarine from '../objects/submarine'
import FpsText from '../objects/fpsText'
import Background from '../objects/background'

export default class MainScene extends Phaser.Scene {
  fpsText
  submarine: Submarine
  background: Background
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

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

    this.textures.addSpriteSheetFromAtlas('sub-sheet', { atlas: 'all', frame: 'sub', frameWidth: 128 })

    this.anims.create({
      key: 'sub-anim',
      frames: this.anims.generateFrameNumbers('sub-sheet', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    })

    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0).setPosition(400, 200)

    this.fpsText = new FpsText(this)
    this.cursors = this.input.keyboard.createCursorKeys()

    this.fpsText.setPosition(0, 30).setDepth(7)

    this.physics.world.setBounds(0, 0, width - this.submarine.width + 32, 380, true, true, true, true)

  }

  update() {
    if (this.cursors.left.isDown) {
      this.submarine.setAccelerationX(-150)
    } else if (this.cursors.right.isDown) {
        this.submarine.setAccelerationX(150)
    } else {
      this.submarine.setAccelerationX(0)
    }

    if (this.cursors.up.isDown) {
      this.submarine.setAccelerationY(-110)
    } else if (this.cursors.down.isDown) {
      this.submarine.setAccelerationY(110)
    } else {
      this.submarine.setAccelerationY(0)
    }

    for (let bg of this.background.layers) {
      bg.sprite.tilePositionX = this.submarine.body.x * bg.ratioX
    }

    this.fpsText.update()

  }
}
